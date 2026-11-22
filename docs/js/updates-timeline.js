/**
 * updates-timeline.js
 * index.htmlの「What's new?」の素の <ul class="a" id="updates-list"> を、
 * 年ごとに折りたたみ可能な区画に分け、各項目を日付ラベル付きの
 * タイムライン風表示に組み替える。
 *
 * 元のHTML側は今まで通り、
 *   <li>2026/06/10: 本文...</li>
 * のように「YYYY/MM/DD: 本文」の形でシンプルに書き足していくだけでよい。
 * 日付の無い項目（Spotifyの紹介など）は、直前の項目と同じ年の
 * グループにそのまま入る。
 */
(function () {
  "use strict";

  // 行頭の日付表記を検出する（例: "2026/06/10:", "2025/04--05:", "2023/10/07-13:"）
  var DATE_RE = /^\s*(\d{4})\/(\d{1,2}(?:[-\/–]{1,2}\d{1,2})?)\s*[:：]\s*/;

  function buildTimeline() {
    var list = document.getElementById("updates-list");
    if (!list) return;

    var items = Array.prototype.slice.call(list.querySelectorAll(":scope > li"));
    if (items.length === 0) return;

    var yearGroups = []; // [{ year, items: [li, ...] }]
    var currentYear = null;

    items.forEach(function (li) {
      var html = li.innerHTML;
      var m = html.match(DATE_RE);

      var year;
      if (m) {
        year = m[1];
        var dateLabel = m[1] + "/" + m[2];
        var rest = html.slice(m[0].length);
        li.innerHTML =
          '<span class="update-date">' + dateLabel + "</span>" +
          '<span class="update-body">' + rest + "</span>";
      } else {
        // 日付が無い項目は直前の年グループに間借りする
        year = currentYear || "その他";
        li.innerHTML = '<span class="update-body">' + html + "</span>";
        li.classList.add("no-date");
      }

      currentYear = year;

      var lastGroup = yearGroups[yearGroups.length - 1];
      if (!lastGroup || lastGroup.year !== year) {
        yearGroups.push({ year: year, items: [li] });
      } else {
        lastGroup.items.push(li);
      }
    });

    var frag = document.createDocumentFragment();

    yearGroups.forEach(function (group, i) {
      var details = document.createElement("details");
      details.className = "update-year";
      // 直近2年分は開いた状態で表示し、それより古い年は畳んでおく
      if (i < 2) details.setAttribute("open", "");

      var summary = document.createElement("summary");
      summary.innerHTML =
        group.year + "年 " +
        '<span class="update-count">(' + group.items.length + "件)</span>";
      details.appendChild(summary);

      var ul = document.createElement("ul");
      ul.className = "a update-year-list";
      group.items.forEach(function (li) {
        ul.appendChild(li);
      });
      details.appendChild(ul);

      frag.appendChild(details);
    });

    list.replaceWith(frag);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildTimeline);
  } else {
    buildTimeline();
  }
})();