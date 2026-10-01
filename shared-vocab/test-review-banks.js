#!/usr/bin/env node
/*
 * Checks that every page progress-review.html reads still hands it a word
 * bank: the page's review-bank blocks run on their own, outside the page, and
 * yield words with ids, Korean and English, grouped every way the page groups
 * them.
 *
 * Run: node shared-vocab/test-review-banks.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ReviewBanks = require("./review-banks.js");

const ROOT = path.resolve(__dirname, "..");
const problems = [];

for (const bank of ReviewBanks.BANKS) {
  /* A fresh browser-like global per bank, holding only the scripts the bank
     says it needs — so a block that leans on anything else fails here. */
  const context = vm.createContext({ console });
  context.window = context;
  context.self = context;
  for (const script of bank.scripts || []) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, script), "utf8"), context, { filename: script });
  }

  let result;
  try {
    const html = fs.readFileSync(path.join(ROOT, bank.href), "utf8");
    result = ReviewBanks.build(bank, html, {
      window: context,
      Function: vm.runInContext("Function", context)
    });
  } catch (error) {
    problems.push(bank.href + ": " + error.message);
    continue;
  }

  const { words, modes } = result;
  if (!words.length) problems.push(bank.href + ": no words");
  words.forEach(word => {
    if (!word.ko || !word.en) problems.push(bank.href + ": " + word.id + " is missing Korean or English");
  });
  if (!modes.length) problems.push(bank.href + ": no groupings");
  const ids = new Set(words.map(word => word.id));
  modes.forEach(mode => {
    const groupIds = new Set();
    const covered = new Set();
    mode.groups.forEach(group => {
      if (groupIds.has(group.id)) problems.push(bank.href + ": " + mode.id + " repeats group " + group.id);
      groupIds.add(group.id);
      group.ids.forEach(id => {
        if (!ids.has(id)) problems.push(bank.href + ": " + group.id + " lists unknown word " + id);
        covered.add(id);
      });
    });
    /* The story grouping covers only words a passage uses; every other
       grouping files every word somewhere. */
    if (mode.id !== "story" && covered.size !== ids.size) {
      problems.push(bank.href + ": grouping by " + mode.id + " leaves " + (ids.size - covered.size) + " words out");
    }
  });

  console.log(bank.title.padEnd(26) + String(words.length).padStart(5) + " words · "
    + modes.map(mode => mode.label.toLowerCase() + " (" + mode.groups.length + ")").join(", "));
}

if (problems.length) {
  console.error("\n" + problems.join("\n"));
  process.exit(1);
}
console.log("every bank builds");
