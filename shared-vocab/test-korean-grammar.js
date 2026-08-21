#!/usr/bin/env node
/*
 * Known-correct forms for the conjugation engine.
 * Run: node shared-vocab/test-korean-grammar.js
 */
"use strict";
const G = require("./korean-grammar.js");

let pass = 0;
const failures = [];
const check = (label, actual, expected) => {
  if (actual === expected) pass++;
  else failures.push(`${label}: got ${actual}  expected ${expected}`);
};

// --- 아/어 infinitive --------------------------------------------------------
const INFINITIVE = {
  // regular, open syllable (contractions)
  "가다": "가", "오다": "와", "보다": "봐", "주다": "줘", "배우다": "배워", "마시다": "마셔",
  "지내다": "지내", "되다": "돼", "서다": "서", "켜다": "켜", "쉬다": "쉬어", "다니다": "다녀",
  // regular, closed syllable
  "먹다": "먹어", "읽다": "읽어", "앉다": "앉아", "받다": "받아", "웃다": "웃어", "입다": "입어",
  "좋다": "좋아", "많다": "많아", "닫다": "닫아", "씻다": "씻어",
  // 하다
  "하다": "해", "공부하다": "공부해", "일하다": "일해", "좋아하다": "좋아해",
  // ㅂ irregular
  "춥다": "추워", "덥다": "더워", "쉽다": "쉬워", "어렵다": "어려워", "맵다": "매워",
  "무겁다": "무거워", "가볍다": "가벼워", "반갑다": "반가워", "고맙다": "고마워", "돕다": "도와",
  // ㄷ irregular
  "듣다": "들어", "걷다": "걸어", "싣다": "실어",
  // ㅅ irregular
  "짓다": "지어", "낫다": "나아", "붓다": "부어",
  // 르 irregular
  "모르다": "몰라", "부르다": "불러", "다르다": "달라", "빠르다": "빨라", "고르다": "골라",
  "따르다": "따라", "들르다": "들러",
  // 으 irregular
  "쓰다": "써", "크다": "커", "바쁘다": "바빠", "예쁘다": "예뻐", "아프다": "아파", "슬프다": "슬퍼",
  // ㅎ irregular
  "그렇다": "그래", "빨갛다": "빨개", "파랗다": "파래", "어떻다": "어때",
  // ㄹ stem (regular before 아/어)
  "살다": "살아", "알다": "알아", "만들다": "만들어", "놀다": "놀아", "멀다": "멀어"
};
Object.entries(INFINITIVE).forEach(([word, want]) => check(`infinitive ${word}`, G.infinitive(word), want));

// --- polite present / past ---------------------------------------------------
const POLITE = { "가다": "가요", "먹다": "먹어요", "하다": "해요", "춥다": "추워요", "듣다": "들어요", "쓰다": "써요", "살다": "살아요", "모르다": "몰라요" };
Object.entries(POLITE).forEach(([w, want]) => check(`polite ${w}`, G.politeEnding(w), want));

const PAST = { "가다": "갔어요", "먹다": "먹었어요", "하다": "했어요", "춥다": "추웠어요", "듣다": "들었어요", "쓰다": "썼어요", "오다": "왔어요", "마시다": "마셨어요", "되다": "됐어요" };
Object.entries(PAST).forEach(([w, want]) => check(`past ${w}`, G.pastPolite(w), want));

// --- (으) endings ------------------------------------------------------------
const EU = [
  ["가다", "(으)면", "가면"], ["먹다", "(으)면", "먹으면"], ["살다", "(으)면", "살면"],
  ["춥다", "(으)면", "추우면"], ["듣다", "(으)면", "들으면"], ["짓다", "(으)면", "지으면"],
  ["가다", "(으)니까", "가니까"], ["먹다", "(으)니까", "먹으니까"], ["살다", "(으)니까", "사니까"],
  ["가다", "(으)면서", "가면서"], ["듣다", "(으)면서", "들으면서"], ["먹다", "(으)면서", "먹으면서"],
  ["가다", "(으)려고", "가려고"], ["먹다", "(으)려고", "먹으려고"],
  ["가다", "(으)러", "가러"], ["먹다", "(으)러", "먹으러"],
  ["가다", "(으)ㄹ", "갈"], ["먹다", "(으)ㄹ", "먹을"], ["살다", "(으)ㄹ", "살"],
  ["춥다", "(으)ㄹ", "추울"], ["듣다", "(으)ㄹ", "들을"], ["만들다", "(으)ㄹ", "만들"],
  ["가다", "(으)ㄴ", "간"], ["먹다", "(으)ㄴ", "먹은"], ["살다", "(으)ㄴ", "산"],
  ["작다", "(으)ㄴ", "작은"], ["크다", "(으)ㄴ", "큰"], ["춥다", "(으)ㄴ", "추운"],
  ["가다", "(으)세요", "가세요"], ["먹다", "(으)세요", "먹으세요"], ["살다", "(으)세요", "사세요"],
  ["가다", "(으)ㄹ까요", "갈까요"], ["먹다", "(으)ㄹ까요", "먹을까요"],
  ["가다", "(으)ㅂ시다", "갑시다"], ["먹다", "(으)ㅂ시다", "먹읍시다"],
  // ㄹ-stems keep ㄹ before 으-endings but drop it before ㄴ/ㅂ/ㅅ
  ["살다", "(으)면서", "살면서"], ["살다", "(으)려고", "살려고"], ["살다", "(으)러", "살러"],
  ["살다", "(으)세요", "사세요"], ["살다", "(으)ㅂ시다", "삽시다"], ["만들다", "(으)ㄴ", "만든"],
  ["놀다", "(으)니까", "노니까"], ["멀다", "(으)면", "멀면"]
];
EU.forEach(([w, e, want]) => check(`attachEu ${w}+${e}`, G.attachEu(w, e), want));

// --- formal present ----------------------------------------------------------
const FORMAL = { "가다": "갑니다", "먹다": "먹습니다", "하다": "합니다", "살다": "삽니다", "춥다": "춥습니다", "만들다": "만듭니다", "듣다": "듣습니다", "짓다": "짓습니다", "쓰다": "씁니다", "크다": "큽니다" };
Object.entries(FORMAL).forEach(([w, want]) => check(`formal ${w}`, G.formalPresent(w), want));

// --- modifiers ---------------------------------------------------------------
check("modifier 가다 present", G.modifier("가다"), "가는");
check("modifier 살다 present", G.modifier("살다"), "사는");
check("modifier 먹다 present", G.modifier("먹다"), "먹는");
check("modifier 가다 past", G.modifier("가다", { tense: "past" }), "간");
check("modifier 먹다 past", G.modifier("먹다", { tense: "past" }), "먹은");
check("modifier 가다 future", G.modifier("가다", { tense: "future" }), "갈");
check("modifier 작다 adjective", G.modifier("작다", { adjective: true }), "작은");
check("modifier 춥다 adjective", G.modifier("춥다", { adjective: true }), "추운");
check("modifier 예쁘다 adjective", G.modifier("예쁘다", { adjective: true }), "예쁜");
check("modifier 만들다 present", G.modifier("만들다"), "만드는");
check("modifier 멀다 adjective", G.modifier("멀다", { adjective: true }), "먼");
// 있다/없다 keep 는 in front of a noun even though they inflect as adjectives.
check("modifier 있다", G.modifier("있다", { adjective: true }), "있는");
check("modifier 없다", G.modifier("없다", { adjective: true }), "없는");
check("modifier 재미있다", G.modifier("재미있다", { adjective: true }), "재미있는");
check("modifier 맛없다", G.modifier("맛없다", { adjective: true }), "맛없는");
check("modifier 관계없다", G.modifier("관계없다", { adjective: true }), "관계없는");
check("modifier 있다 past", G.modifier("있다", { tense: "past" }), "있던");
check("modifier 없다 past", G.modifier("없다", { tense: "past" }), "없던");
check("modifier 재미있다 past", G.modifier("재미있다", { tense: "past" }), "재미있던");
check("modifier 있다 future", G.modifier("있다", { tense: "future" }), "있을");
check("modifier 어떻다", G.modifier("어떻다", { adjective: true }), "어떤");
check("modifier 그렇다", G.modifier("그렇다", { adjective: true }), "그런");
check("modifier 빨갛다", G.modifier("빨갛다", { adjective: true }), "빨간");
check("modifier 어둡다", G.modifier("어둡다", { adjective: true }), "어두운");
check("modifier 뜨겁다", G.modifier("뜨겁다", { adjective: true }), "뜨거운");
check("modifier 차갑다", G.modifier("차갑다", { adjective: true }), "차가운");
check("modifier 즐겁다", G.modifier("즐겁다", { adjective: true }), "즐거운");
check("infinitive 어둡다", G.infinitive("어둡다"), "어두워");
check("infinitive 뜨겁다", G.infinitive("뜨겁다"), "뜨거워");
check("infinitive 시끄럽다", G.infinitive("시끄럽다"), "시끄러워");
check("infinitive 더럽다", G.infinitive("더럽다"), "더러워");
check("plainStem 살다 before 고", G.plainStem("살다", "고"), "살");
check("plainStem 살다 before 는", G.plainStem("살다", "는"), "사");
check("plainStem 춥다 before 지만", G.plainStem("춥다", "지만"), "춥");

// --- particles ---------------------------------------------------------------
check("topic 학생", G.topic("학생"), "학생은");
check("topic 학교", G.topic("학교"), "학교는");
check("subject 사람", G.subject("사람"), "사람이");
check("object 밥", G.object("밥"), "밥을");
check("object 커피", G.object("커피"), "커피를");
check("copula 학생", G.copula("학생"), "학생이에요");
check("copula 의사", G.copula("의사"), "의사예요");
check("instrumental 지하철", G.instrumental("지하철"), "지하철로");
check("instrumental 버스", G.instrumental("버스"), "버스로");
check("instrumental 손", G.instrumental("손"), "손으로");

// --- English helpers ---------------------------------------------------------
check("verbEnglish", G.verbEnglish({ english: "to study" }), "study");
check("adjectiveEnglish", G.adjectiveEnglish({ english: "to be quiet / calm" }), "quiet");
check("thirdPerson study", G.thirdPerson("study"), "studies");
check("thirdPerson watch", G.thirdPerson("watch"), "watches");
check("thirdPerson go", G.thirdPerson("go"), "goes");
check("gerund make", G.gerund("make"), "making");
check("gerund study", G.gerund("study"), "studying");
check("gerund sit", G.gerund("sit"), "sitting");
check("pastEnglish go", G.pastEnglish("go"), "went");
check("pastEnglish study", G.pastEnglish("study"), "studied");
check("pastEnglish live", G.pastEnglish("live"), "lived");

console.log(`${pass} passed, ${failures.length} failed`);
if (failures.length) {
  failures.forEach(f => console.log("  FAIL " + f));
  process.exit(1);
}
