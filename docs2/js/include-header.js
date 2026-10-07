/**
 * include-header.js
 * ヘッダー（サイトタイトル＋グローバルナビ）を header.html 1ファイルに集約し、
 * 各ページの <header id="pageHead"></header>（中身は空でよい）に読み込む。
 *
 * 使い方: 各HTMLの <header id="pageHead"></header> の中身は空にしておき、
 *   <script src="js/include-header.js"></script>
 * を <head> に追加するだけ。ナビの「現在地」ハイライトも自動で付与される。
 *
 * 注意: fetch() を使うため、file:// で直接開くと動かないブラウザがあります。
 * サーバー経由（http/https）で開いてください（このサイトは元々サーバーで
 * 配信されるので問題ありません）。
 */
(function () {
  "use strict";

  function currentFileName() {
    // <body data-nav-current="tips.html"> があれば、サブページからでも
    // 親ページ側のナビをハイライトさせるために優先的に使う
    var override = document.body.getAttribute("data-nav-current");
    if (override) return override.trim().toLowerCase();

    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf("/") + 1);
    return (file || "index.html").toLowerCase();
  }

  function markCurrent(mount) {
    var here = currentFileName();
    var links = mount.querySelectorAll(".globalNavi a[href]");
    links.forEach(function (a) {
      var href = a.getAttribute("href").trim().toLowerCase();
      var hrefFile = href.substring(href.lastIndexOf("/") + 1);
      if (hrefFile === here) {
        var li = a.closest("li");
        if (li) li.classList.add("current");
      }
    });
  }

  function rebaseNavLinks(mount) {
    // <body data-nav-base="../"> があれば、header.html内の相対リンク
    // （index.html, CV.html など）にその接頭辞を足す。
    // サブディレクトリに置かれたページから正しく親階層のファイルを指せるようにする。
    var base = document.body.getAttribute("data-nav-base");
    if (!base) return;

    var links = mount.querySelectorAll(".globalNavi a[href]");
    links.forEach(function (a) {
      var href = a.getAttribute("href");
      // 絶対URLやルート相対パスはそのまま（二重に接頭辞を付けない）
      if (/^([a-z]+:)?\/\//i.test(href) || href.charAt(0) === "/") return;
      a.setAttribute("href", base + href);
    });
  }

  function inject() {
    var mount = document.getElementById("pageHead");
    if (!mount) return;

    // サブディレクトリのページ用: <body data-header-src="../header.html">
    // を指定すれば、そこから header.html を取りに行く（未指定時は同階層）。
    var headerSrc = document.body.getAttribute("data-header-src") || "header.html";

    fetch(headerSrc, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("header.html の読み込みに失敗しました: " + res.status);
        }
        return res.text();
      })
      .then(function (html) {
        mount.innerHTML = html;
        rebaseNavLinks(mount);
        markCurrent(mount);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
