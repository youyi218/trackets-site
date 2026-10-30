// Picks the page language: ?lang= first, then a saved choice, then the
// browser's language, falling back to English. Runs in <head> so the right
// language shows on first paint.
(function () {
  var supported = ["en", "fr", "zh"];

  function fromBrowser() {
    var preferred = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < preferred.length; i++) {
      var code = String(preferred[i]).toLowerCase().slice(0, 2);
      if (supported.indexOf(code) !== -1) return code;
    }
    return "en";
  }

  function saved() {
    try { return localStorage.getItem("trackets.lang"); } catch (e) { return null; }
  }

  var query = new URLSearchParams(location.search).get("lang");
  var lang = [query, saved(), fromBrowser()].filter(function (code) {
    return supported.indexOf(code) !== -1;
  })[0];

  function apply(code) {
    document.documentElement.setAttribute("data-lang", code);
    document.documentElement.setAttribute("lang", code === "zh" ? "zh-Hans" : code);
    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-set-lang") === code));
    }
  }

  apply(lang);

  document.addEventListener("DOMContentLoaded", function () {
    apply(lang);
    var buttons = document.querySelectorAll("[data-set-lang]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (event) {
        lang = event.currentTarget.getAttribute("data-set-lang");
        try { localStorage.setItem("trackets.lang", lang); } catch (e) {}
        apply(lang);
      });
    }
  });
})();
