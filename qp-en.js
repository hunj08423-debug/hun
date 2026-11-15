/* 질문 받기 연습실 영어판 불러오기 (작은 파일, 늘 불림)
   주소 끝에 ?lang=en 이 있을 때만 qp-content-en.js(영어 내용과 번역 엔진)를 불러옵니다. 한국어 화면에는 아무 영향이 없어요.
   머리줄의 'English / 한국어' 단추도 여기서 맞춥니다. */
(function () {
  var on = /(?:^|[?&])lang=en(?:&|$)/.test(location.search);
  window.QP_LANG = on ? "en" : "ko";
  var b = document.getElementById("langBtn");
  if (b) {
    b.textContent = on ? "한국어" : "English";
    b.setAttribute("lang", on ? "ko" : "en");
    b.setAttribute("hreflang", on ? "ko" : "en");
    b.setAttribute("data-no-tr", "");
    b.setAttribute("href", on ? "./" : "?lang=en");
    b.addEventListener("click", function (e) {
      try {
        var u = new URL(location.href);
        if (on) u.searchParams.delete("lang"); else u.searchParams.set("lang", "en");
        e.preventDefault();
        location.href = u.pathname + u.search + u.hash;
      } catch (x) {}
    });
  }
  if (!on) return;
  document.documentElement.lang = "en";
  document.write('<script src="qp-content-en.js"><\/script>');
})();
