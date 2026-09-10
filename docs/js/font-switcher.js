/**
 * font-switcher.js
 * 和文フォントをその場で自由に切り替えるためのウィジェット。
 * 選択結果は localStorage に保存し、サイト内のどのページでも引き継がれる。
 *
 * 使い方: 各HTMLの <head> 内、css/style.css の直後あたりに
 *   <script src="js/font-switcher.js"></script>
 * を追加するだけ（defer/async不要。フォント切り替えのチラつきを防ぐため、
 * 先頭部分は同期実行で <html> に data-jp-font 属性をすぐに反映する）。
 */
(function () {
  "use strict";

  var STORAGE_KEY = "jpFont";

  var FONTS = [
    { key: "zenkaku",  label: "Zen Kaku Gothic New" },
    { key: "zenmaru",  label: "Zen Maru Gothic" },
    { key: "sawarabi", label: "Sawarabi Gothic" },
    { key: "mplus1p",  label: "M PLUS 1p" },
    { key: "murecho",  label: "Murecho" }
  ];
  var DEFAULT_KEY = "mplus1p";

  function getSavedKey() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      if (v && FONTS.some(function (f) { return f.key === v; })) {
        return v;
      }
    } catch (e) {
      /* localStorageが使えない環境（プライベートモード等）でも落とさない */
    }
    return DEFAULT_KEY;
  }

  function applyKey(key) {
    document.documentElement.setAttribute("data-jp-font", key);
  }

  // ---- ここから即時実行：<head> 読み込み時点でフォントを確定させる ----
  var currentKey = getSavedKey();
  applyKey(currentKey);

  function saveKey(key) {
    try {
      window.localStorage.setItem(STORAGE_KEY, key);
    } catch (e) {
      /* 保存に失敗しても、その場での切り替え自体は継続する */
    }
  }

  // ---- ここから先はDOM構築後：切り替えウィジェットを1つだけ生成する ----
  function buildWidget() {
    if (document.querySelector(".font-switcher")) return; // 二重生成防止

    var wrap = document.createElement("div");
    wrap.className = "font-switcher";

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "font-switcher__toggle";
    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "文字 Aa";
    wrap.appendChild(toggle);

    var panel = document.createElement("div");
    panel.className = "font-switcher__panel";
    panel.setAttribute("role", "menu");

    var buttons = [];
    FONTS.forEach(function (font) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "font-switcher__option";
      btn.setAttribute("role", "menuitemradio");
      btn.setAttribute("data-font-key", font.key);
      btn.setAttribute("aria-pressed", String(font.key === currentKey));

      var label = document.createElement("span");
      label.textContent = font.label;
      btn.appendChild(label);

      var sample = document.createElement("small");
      sample.textContent = "あ字体";
      sample.style.fontFamily =
        '"' + font.label + '", "Hiragino Kaku Gothic ProN", sans-serif';
      btn.appendChild(sample);

      btn.addEventListener("click", function () {
        currentKey = font.key;
        applyKey(currentKey);
        saveKey(currentKey);
        buttons.forEach(function (b) {
          b.setAttribute(
            "aria-pressed",
            String(b.getAttribute("data-font-key") === currentKey)
          );
        });
      });

      buttons.push(btn);
      panel.appendChild(btn);
    });

    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    toggle.addEventListener("click", function () {
      var isOpen = wrap.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();
