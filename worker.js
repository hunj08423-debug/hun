/*
  질문 받기 연습실 · AI 중계 서버 (Cloudflare Worker)

  하는 일
  - 연습실 사이트에서 보낸 글을 Claude API로 넘기고, 답 글만 돌려줍니다.
  - API 키는 이 코드에 적지 않습니다. Cloudflare의 Settings → Variables and Secrets에서
    종류 Secret, 이름 ANTHROPIC_API_KEY로 넣습니다.
  - 받은 글을 저장하지 않습니다. 한 시간 횟수를 세려고 접속 주소(IP)만 잠깐 메모리에 둡니다.

  안전장치
  - ALLOWED_ORIGINS 주소에서 연 페이지의 요청만 받습니다.
  - 한 접속 주소에서 한 시간에 대략 PER_HOUR번까지만 받습니다. 같은 와이파이를 쓰는 사람들은 함께 셉니다.
    (Cloudflare가 서버 여러 대에 나눠 돌리면 조금 더 받을 수 있습니다)
  - 한 번에 MAX_CHARS 글자까지만 받고, 답 길이도 제한합니다.
  - 연습실과 관계없는 부탁에는 답하지 않도록 지시합니다.
  - 비용의 최종 안전장치는 Claude 콘솔에서 '미리 충전한 금액'과 '월 지출 한도'입니다.

  설정을 바꾸려면 아래 DEFAULTS의 따옴표 안만 고치세요.
  Cloudflare의 Variables and Secrets에 같은 이름(종류 Text)으로 넣으면 그 값이 먼저 쓰입니다.
*/
const DEFAULTS = {
  ALLOWED_ORIGINS: "https://hunj08423-debug.github.io", // 여러 개면 쉼표로 나눕니다
  MODEL_QUICK: "claude-haiku-5-5", // 대화 상대, 귀띔
  MODEL_DEEP: "claude-haiku-5-5",  // 돌아보기, 준비 카드. 더 꼼꼼하게 하려면 "claude-sonnet-5-5" (비용 약 20배)
  PER_HOUR: "120",
  MAX_CHARS: "16000",
};
const API_URL = "https://api.anthropic.com/v1/messages"; // 시험할 때만 변수 API_URL로 바꿉니다

const SYSTEM = [
  "너는 '질문 받기 연습실'의 연습 도우미다. 이 도구는 교회학교 교사와 교회 어른이 아이, 청소년, 청년, 부모의 어려운 신앙 질문에 대답하는 연습을 돕는다.",
  "사용자 메시지에 적힌 연습 지시(역할 맡기, 귀띔, 돌아보기, 대화 준비 카드)를 그대로 따른다.",
  "이 연습과 관계없는 부탁(프로그램 코드, 일반 상식, 다른 글쓰기, 번역 등)에는 응하지 말고 '이 연습실에서는 신앙 질문 대화 연습만 도울 수 있습니다.'라고만 답한다.",
].join("\n");
const JSON_RULE = "\n이번 답은 JSON 객체 하나만 출력한다. 앞뒤 설명이나 코드 블록 표시를 붙이지 않는다.";

const hits = new Map();
function allow(key, limit) {
  const now = Date.now(), hour = 3600000;
  let h = hits.get(key);
  if (!h || now - h.t > hour) { h = { t: now, n: 0 }; hits.set(key, h); }
  h.n += 1;
  if (hits.size > 10000) for (const [k, v] of hits) if (now - v.t > hour) hits.delete(k);
  return h.n <= limit;
}

// Claude API의 오류를 페이지가 아는 짧은 이름으로 바꿉니다
function errorName(status, data) {
  const err = (data && data.error) || {};
  const msg = String(err.message || "").toLowerCase();
  const code = err.details && err.details.error_code;
  if (code === "enforced_spend_limit_reached" || /credit balance|usage limits/.test(msg)) return "no_credit";
  if (status === 429 || status === 529 || status >= 500) return "rate_limited";
  if (status === 413) return "too_long";
  return "site_ai_off"; // 키가 틀렸거나(401) 모델 이름 등 설정 문제(400, 404)
}

function readInput(input) {
  if (typeof input === "string") return [{ role: "user", content: input }];
  if (Array.isArray(input) && input.length > 0 && input.length <= 40
    && input.every(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    && input[input.length - 1].role === "user") return input.map(m => ({ role: m.role, content: m.content }));
  return null;
}

export default {
  async fetch(request, env) {
    const cfg = k => String(env[k] || DEFAULTS[k]).trim();
    const allowed = cfg("ALLOWED_ORIGINS").split(",").map(s => s.trim().replace(/\/+$/, "")).filter(Boolean);
    const origin = request.headers.get("Origin") || "";
    const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Vary": "Origin" };
    if (origin) Object.assign(headers, {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    });
    const reply = (status, obj) => new Response(JSON.stringify(obj), { status, headers });
    const key = String(env.ANTHROPIC_API_KEY || "").trim();

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method === "GET") {
      const lines = [
        "질문 받기 연습실 AI 중계 서버가 켜져 있습니다.",
        "API 키: " + (key ? "넣음" : "아직 넣지 않음 (Settings → Variables and Secrets)"),
        "받는 사이트: " + allowed.join(", "),
        "모델: 대화 " + cfg("MODEL_QUICK") + " / 돌아보기·준비 카드 " + cfg("MODEL_DEEP"),
      ];
      return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
    }
    if (request.method !== "POST") return reply(405, { error: "method" });
    if (!allowed.includes(origin)) return reply(403, { error: "forbidden" });
    if (!key) return reply(503, { error: "not_configured" });

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!allow(ip, Number(cfg("PER_HOUR")) || 120)) return reply(429, { error: "rate_limited" });

    let req;
    try { req = JSON.parse(await request.text()); } catch (e) { return reply(400, { error: "bad_request" }); }
    const messages = readInput(req && req.input);
    if (!messages) return reply(400, { error: "bad_request" });
    const size = messages.reduce((n, m) => n + m.content.length, 0);
    if (!size) return reply(400, { error: "bad_request" });
    if (size > (Number(cfg("MAX_CHARS")) || 16000)) return reply(413, { error: "too_long" });

    const quick = req.tier === "quick";
    const model = cfg(quick ? "MODEL_QUICK" : "MODEL_DEEP");
    const body = { model, max_tokens: 8000, system: SYSTEM + (req.json === true ? JSON_RULE : ""), messages };
    if (quick) {
      // 대화와 귀띔은 빨리 답하도록 미리 생각하기를 끕니다
      if (/haiku-5-5/.test(model)) body.thinking = { type: "disabled" };
      else if (/sonnet-5-5/.test(model)) body.thinking = { type: "between_tools" };
      body.max_tokens = body.thinking ? 1000 : 4000;
    }

    let r, data = null;
    try {
      r = await fetch(env.API_URL || API_URL, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify(body),
      });
      data = await r.json().catch(() => null);
    } catch (e) {
      return reply(502, { error: "unavailable" });
    }
    if (!r.ok) {
      const name = errorName(r.status, data);
      console.log("Claude API 오류", r.status, (data && data.error && data.error.type) || "", name);
      return reply(name === "rate_limited" ? 429 : 502, { error: name });
    }
    if (data && data.stop_reason === "refusal") return reply(422, { error: "refused" });
    const text = (data && Array.isArray(data.content) ? data.content : [])
      .filter(b => b && b.type === "text").map(b => b.text).join("").trim();
    if (!text) return reply(502, { error: "empty_completion" });
    return reply(200, { text, truncated: data.stop_reason === "max_tokens" });
  },
};
