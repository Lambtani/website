/**
 * mathjax-init.js
 * MathJaxの設定とライブラリ読み込みをこの1ファイルに集約する。
 * 各ページの <head> には
 *   <script src="js/mathjax-init.js"></script>
 * を1行足すだけでよい（サブディレクトリのページは "../js/mathjax-init.js"）。
 *
 * 本文中では次の書き方で数式が使える：
 *   インライン: $E=mc^2$  または  \(E=mc^2\)
 *   ディスプレイ: $$E=mc^2$$  または  \[E=mc^2\]
 *
 * MathJax v3にはフォント切り替えの仕組みがまだ無いため、v4を使用。
 * 数式フォントは Pagella（Palatino系、他の欧文フォント候補と相性が良い）。
 * v4のフォントパッケージは執筆時点でベータ版（4.0.0-beta.x）なので、
 * 稀に細かい表示崩れが出る可能性がある。気になる場合は下の
 * output.font を 'mathjax-tex'（従来のMathJax標準フォント）や
 * 'mathjax-stix2'（Times系）などに変えれば良い。
 *
 * 設定を変えたいときは、このファイルだけ直せば全ページに反映される。
 */
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true
  },
  svg: { fontCache: 'global' },
  output: { font: 'mathjax-pagella' }
};

(function () {
  // 既に読み込み済みなら何もしない（誤って複数ページ分呼ばれても安全）
  if (document.getElementById('MathJax-script')) return;

  var script = document.createElement('script');
  script.id = 'MathJax-script';
  script.async = true;
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js';
  document.head.appendChild(script);
})();
