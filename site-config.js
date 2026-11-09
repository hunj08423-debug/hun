/* 질문 받기 연습실 · 사이트 설정
   이 파일만 고치면 됩니다. 따옴표 안의 글자만 바꾸세요.
   - operator  : 운영하는 사람이나 모임 이름. 화면 맨 아래에 '운영: …'으로 나옵니다.
   - contact   : 문의처(메일 주소 등). 비워 두면 화면에 나오지 않습니다.
   - claudeUrl : AI 기능이 있는 Claude 판 주소. 이 사이트에서 AI를 쓸 수 없을 때 안내 링크로 나옵니다.
   - aiEndpoint: AI 중계 서버(Cloudflare Worker) 주소. 예: "https://qp-ai.내이름.workers.dev"
                 비워 두면 이 사이트에서는 AI 기능이 꺼져 있습니다. API 키는 절대 여기에 넣지 마세요. */
window.QP_SITE = {
  operator: "홍지훈 (개인 기획)",
  contact: "",
  claudeUrl: "https://claude.ai/artifact/7Ld15z5DcujWTbEJQD3Lsd",
  aiEndpoint: ""
};
