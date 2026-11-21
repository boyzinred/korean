/*
  topik-i-guide-outline.js

  The table of contents of Complete Guide to the TOPIK I (3rd ed., 차례 p. 8),
  and the two things the Complete Guide pages do with it:

    nest(groups, options)  the groups of a grouping (word-bank sections, quiz
                           checkboxes), filed under the book's parts instead of
                           sitting in one flat list:

                             PART 1 기출문제 유형 분석   듣기 · 읽기
                             PART 2 유형별 연습 문제     듣기 · 읽기
                             PART 3 실전 모의고사        1회 (듣기 · 읽기), 2회 (듣기 · 읽기)

                           Each group says which workbook it belongs to with
                           `book` (p1l, p1r, p2l, p2r, m1l, m1r, m2l, m2r) and
                           is drawn by options.leaf(group). Groups without a
                           book (e.g. one per question type, across the books)
                           come back as one flat list.
    wire(container)        with options.checkboxes, ticks every checkbox under
                           a heading when the heading's box is ticked, and keeps
                           each heading's box checked / mixed / clear to match.
                           sync(container) repaints those boxes after a script
                           ticked leaves itself (Select all, Select none).

  Layout only: the groups, their ids and their order are the page's own.
*/
(function (root) {
  "use strict";

  const OUTLINE = [
    { id: "part1", tag: "PART 1", ko: "기출문제 유형 분석", en: "Review & Analysis of Previous TOPIK Questions", children: [
      { id: "p1l", ko: "듣기", en: "Listening", book: "p1l" },
      { id: "p1r", ko: "읽기", en: "Reading", book: "p1r" }
    ] },
    { id: "part2", tag: "PART 2", ko: "유형별 연습 문제", en: "Practice Questions", children: [
      { id: "p2l", ko: "듣기", en: "Listening", book: "p2l" },
      { id: "p2r", ko: "읽기", en: "Reading", book: "p2r" }
    ] },
    { id: "part3", tag: "PART 3", ko: "실전 모의고사", en: "Mock Tests", children: [
      { id: "mock1", ko: "실전 모의고사 1회", en: "Mock Test 1", children: [
        { id: "m1l", ko: "듣기", en: "Listening", book: "m1l" },
        { id: "m1r", ko: "읽기", en: "Reading", book: "m1r" }
      ] },
      { id: "mock2", ko: "실전 모의고사 2회", en: "Mock Test 2", children: [
        { id: "m2l", ko: "듣기", en: "Listening", book: "m2l" },
        { id: "m2r", ko: "읽기", en: "Reading", book: "m2r" }
      ] }
    ] }
  ];

  const esc = value => String(value).replace(/[&<>"']/g, ch =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

  function injectStyle() {
    if (typeof document === "undefined" || document.getElementById("guide-outline-style")) return;
    const style = document.createElement("style");
    style.id = "guide-outline-style";
    style.textContent = [
      ".outline-tree { display: grid; gap: 26px; }",
      ".outline-node { display: grid; gap: 12px; min-width: 0; }",
      ".outline-node > .outline-children { display: grid; gap: 18px; }",
      /* Below a part, each level steps in behind a rule, so a unit reads as
         part of the section above it. */
      ".outline-node .outline-node { padding-left: 14px; border-left: 3px solid var(--border); }",
      ".outline-head { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 10px; margin: 0; line-height: 1.3; }",
      ".outline-head--1 { font-size: 1.05rem; font-weight: 800; }",
      ".outline-head--2, .outline-head--3 { font-size: .92rem; font-weight: 800; }",
      ".outline-tag { padding: 2px 8px; color: var(--on-primary, #fff); background: var(--primary); border-radius: var(--radius-md, 6px); font-size: .76rem; letter-spacing: .04em; }",
      ".outline-en { font-size: .78rem; font-weight: 700; opacity: .72; }",
      ".outline-head input { width: 20px; height: 20px; min-height: 20px; flex: 0 0 20px; margin: 0; padding: 0; }",
      "label.outline-head { cursor: pointer; }",
      ".outline-leaves.group-grid { margin-top: 0; }",
      ".group-outline { margin-top: 12px; }",
      /* A heading whose groups the search has hidden goes with them. */
      ".outline-node:not(:has(.vocab-category:not(.is-hidden))):has(.vocab-category) { display: none; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function nest(groups, options) {
    options = options || {};
    const leafClass = options.leafClass || "";
    const checkboxes = Boolean(options.checkboxes);
    const byBook = new Map();
    let filed = 0;
    groups.forEach(group => {
      if (!group.book) return;
      if (!byBook.has(group.book)) byBook.set(group.book, []);
      byBook.get(group.book).push(group);
      filed += 1;
    });
    if (filed !== groups.length || !filed) {
      return '<div class="' + esc(leafClass) + '">' + groups.map(options.leaf).join("") + "</div>";
    }
    injectStyle();

    function has(node) {
      return node.book ? byBook.has(node.book) : node.children.some(has);
    }
    function head(node, depth) {
      const text = (node.tag ? '<span class="outline-tag">' + esc(node.tag) + "</span>" : "")
        + "<span>" + esc(node.ko) + "</span>"
        + '<span class="outline-en">' + esc(node.en) + "</span>";
      const cls = "outline-head outline-head--" + depth;
      if (checkboxes) {
        return '<label class="' + cls + '"><input class="outline-box" type="checkbox" checked aria-label="'
          + esc((node.tag ? node.tag + " " : "") + node.ko + " · " + node.en) + '">' + text + "</label>";
      }
      const tag = depth === 1 ? "h3" : "h4";
      return "<" + tag + ' class="' + cls + '">' + text + "</" + tag + ">";
    }
    function draw(node, depth) {
      const inner = node.book
        ? '<div class="outline-leaves ' + esc(leafClass) + '">' + byBook.get(node.book).map(options.leaf).join("") + "</div>"
        : '<div class="outline-children">' + node.children.filter(has).map(child => draw(child, depth + 1)).join("") + "</div>";
      return '<section class="outline-node" data-outline="' + esc(node.id) + '">' + head(node, depth) + inner + "</section>";
    }
    return '<div class="outline-tree">' + OUTLINE.filter(has).map(part => draw(part, 1)).join("") + "</div>";
  }

  /* Heading boxes, deepest first, so a part reads its sections' new state. */
  function sync(container) {
    const boxes = [...container.querySelectorAll(".outline-node > .outline-head > .outline-box")].reverse();
    boxes.forEach(box => {
      const node = box.closest(".outline-node");
      const leaves = [...node.querySelectorAll('input[type="checkbox"]:not(.outline-box)')];
      const on = leaves.filter(input => input.checked).length;
      box.checked = leaves.length > 0 && on === leaves.length;
      box.indeterminate = on > 0 && on < leaves.length;
    });
  }

  function wire(container) {
    if (!container || container.dataset.outlineWired === "true") { if (container) sync(container); return; }
    container.dataset.outlineWired = "true";
    /* Capture, so the page's own change listeners (pool counts) run after
       the heading's leaves have been ticked. */
    container.addEventListener("change", event => {
      const box = event.target;
      if (box.classList && box.classList.contains("outline-box")) {
        box.closest(".outline-node").querySelectorAll('input[type="checkbox"]').forEach(input => {
          input.checked = box.checked;
          input.indeterminate = false;
        });
      }
      sync(container);
    }, true);
    sync(container);
  }

  const api = { OUTLINE, nest, wire, sync };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.GuideOutline = api;
})(typeof window !== "undefined" ? window : this);
