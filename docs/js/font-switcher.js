/**
 * font-switcher.js
 * 和文フォント・欧文フォントを、それぞれ独立にその場で切り替えられるウィジェット。
 * 選択結果は localStorage に保存し、サイト内のどのページでも引き継がれる。
 *
 * - 和文フォント: <html data-jp-font="...">    (css/style.css の --font-jp を制御)
 * - 欧文フォント: <html data-latin-font="..."> (css/style.css の --font-latin-current を制御)
 * 2つは完全に独立していて、好きな組み合わせを選べる。
 *
 * 使い方: 各HTMLの <head> 内、css/style.css の直後あたりに
 *   <script src="js/font-switcher.js"></script>
 * を追加するだけ（defer/async不要。フォント切り替えのチラつきを防ぐため、
 * 先頭部分は同期実行で <html> に data-jp-font / data-latin-font 属性をすぐに反映する）。
 */
(function () {
  "use strict";

  // ---- フォント切り替えグループの定義 ----
  var GROUPS = [
    {
      groupLabel: "和文",
      attr: "data-jp-font",
      storageKey: "jpFont",
      defaultKey: "mplus1p",
      fonts: [
        { key: "zenkaku",   label: "Zen Kaku Gothic New", fallback: '"Hiragino Kaku Gothic ProN", sans-serif' },
        { key: "zenmaru",   label: "Zen Maru Gothic",     fallback: '"Hiragino Maru Gothic ProN", sans-serif' },
        { key: "sawarabi",  label: "Sawarabi Gothic",     fallback: '"Hiragino Kaku Gothic ProN", sans-serif' },
        { key: "mplus1p",   label: "M PLUS 1p",           fallback: '"Hiragino Kaku Gothic ProN", sans-serif' },
        { key: "murecho",   label: "Murecho",             fallback: '"Hiragino Kaku Gothic ProN", sans-serif' },
        { key: "notoserif", label: "Noto Serif JP",       fallback: '"Hiragino Mincho ProN", serif' }
      ],
      sampleText: "あ字体"
    },
    {
      groupLabel: "欧文",
      attr: "data-latin-font",
      storageKey: "latinFont",
      defaultKey: "graphein",
      fonts: [
        { key: "graphein", label: "Graphein Pro", cssFamily: "mysans1", fallback: "sans-serif" },
        { key: "optima",   label: "Optima Nova",  cssFamily: "Optima Nova", fallback: "sans-serif" }
      ],
      sampleText: "Aa"
    }
  ];

  function getSavedKey(group) {
    try {
      var v = window.localStorage.getItem(group.storageKey);
      if (v && group.fonts.some(function (f) { return f.key === v; })) {
        return v;
      }
    } catch (e) {
      /* localStorageが使えない環境（プライベートモード等）でも落とさない */
    }
    return group.defaultKey;
  }

  function saveKey(group, key) {
    try {
      window.localStorage.setItem(group.storageKey, key);
    } catch (e) {
      /* 保存に失敗しても、その場での切り替え自体は継続する */
    }
  }

  function applyKey(group, key) {
    document.documentElement.setAttribute(group.attr, key);
  }

  // ---- ここから即時実行：<head> 読み込み時点でフォントを確定させる ----
  GROUPS.forEach(function (group) {
    group.currentKey = getSavedKey(group);
    applyKey(group, group.currentKey);
  });

  // ---- ここから先はDOM構築後：切り替えウィジェットを1つだけ生成する ----
  function buildGroupSection(panel, group) {
    var heading = document.createElement("div");
    heading.className = "font-switcher__group-label";
    heading.textContent = group.groupLabel;
    panel.appendChild(heading);

    var buttons = [];
    group.fonts.forEach(function (font) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "font-switcher__option";
      btn.setAttribute("role", "menuitemradio");
      btn.setAttribute("data-font-key", font.key);
      btn.setAttribute("aria-pressed", String(font.key === group.currentKey));

      var label = document.createElement("span");
      label.textContent = font.label;
      btn.appendChild(label);

      var sample = document.createElement("small");
      sample.textContent = group.sampleText;
      var family = font.cssFamily || font.label;
      sample.style.fontFamily = '"' + family + '", ' + font.fallback;
      btn.appendChild(sample);

      btn.addEventListener("click", function () {
        group.currentKey = font.key;
        applyKey(group, group.currentKey);
        saveKey(group, group.currentKey);
        buttons.forEach(function (b) {
          b.setAttribute(
            "aria-pressed",
            String(b.getAttribute("data-font-key") === group.currentKey)
          );
        });
      });

      buttons.push(btn);
      panel.appendChild(btn);
    });
  }

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

    GROUPS.forEach(function (group, i) {
      if (i > 0) {
        var divider = document.createElement("div");
        divider.className = "font-switcher__divider";
        panel.appendChild(divider);
      }
      buildGroupSection(panel, group);
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
