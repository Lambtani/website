/**
 * theme.js
 * ライト / ダーク / 自動（OS設定に従う）の切り替え。
 * 選択は localStorage("theme") に保存し、サイト内の全ページで引き継ぐ。
 *   - "light" / "dark" … <html data-theme="..."> を付けてOS設定より優先
 *   - 保存なし（自動） … 属性なし。css/style.css の prefers-color-scheme に任せる
 * 使い方: 各HTMLの <head> に <script src="js/theme.js"></script>
 * （font-switcher.js の直前。先頭部分は同期実行なので表示のチラつきを防げる）
 */
(function () {
  "use strict";
  var KEY = "theme";
  var root = document.documentElement;

  function load() {
    try {
      var v = window.localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : "auto";
    } catch (e) { return "auto"; }
  }
  function save(v) {
    try {
      if (v === "auto") window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, v);
    } catch (e) { /* 保存できなくてもその場の切り替えは有効 */ }
  }
  function apply(v) {
    if (v === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", v);
  }

  var current = load();
  apply(current);   // <head> で同期実行：初回描画前にテーマを確定

  var LABELS = { auto: "自動", light: "☀ ライト", dark: "☾ ダーク" };
  var NEXT = { auto: "dark", dark: "light", light: "auto" };

  function build() {
    if (document.querySelector(".theme-toggle")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    function render() {
      btn.textContent = LABELS[current];
      btn.setAttribute("aria-label", "表示テーマ: " + LABELS[current] + "（クリックで切り替え）");
    }
    btn.addEventListener("click", function () {
      current = NEXT[current];
      apply(current);
      save(current);
      render();
    });
    render();
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
