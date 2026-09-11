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
 * 設定を変えたいときは、このファイルだけ直せば全ページに反映される。
 */
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true
  },
  svg: { fontCache: 'global' }
};

(function () {
  // 既に読み込み済みなら何もしない（誤って複数ページ分呼ばれても安全）
  if (document.getElementById('MathJax-script')) return;

  var script = document.createElement('script');
  script.id = 'MathJax-script';
  script.async = true;
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.js';
  document.head.appendChild(script);
})();
