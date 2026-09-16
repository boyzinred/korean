/*
  reading-sentences.js
  ----------------------------------------------------------------------------
  Sentence generator for the KOREAN READING COMPREHENSION translation exercise.

  One template set, keyed by the grammar point ids in reading-grammar.js and
  reading-grammar-2.js. A template asks for slots by part of speech — a noun, a
  verb, two adjectives — and the page fills them from its own word bank. No
  slot is ever narrowed by meaning: 학교를 마셔요 (I drink the school) is a
  sentence this file is happy to make, because the point being drilled is the
  object marker, not the drink. Dropping the meaning check is what turns a bank
  of 150 words into tens of thousands of practice sentences.

  Fields on a template
    needs   slot names the builder reads; each maps to one part of speech
    build   (slots) -> { ko, en, cue? }
              ko    the Korean sentence
              en    its English translation
              cue   something the English cannot carry — which counter to use,
                    which of two equivalent forms is being drilled

  A grammar point holds a list of templates and a generated sentence picks one
  at random, so the same point keeps producing different shapes.

  Requires korean-grammar.js for the conjugation and particle rules.

  Browser: <script src="./shared-vocab/reading-sentences.js"></script>
*/
(function (global) {
  "use strict";

  const G = global.KoreanGrammar;

  /* ==========================================================================
     SLOTS
     Every slot name a template may ask for, and the part of speech that fills
     it. Numbered names (noun2, verb2) draw from the same pool as their base
     but never land on the same word twice in one sentence.
  ========================================================================== */
  const SLOT_POS = {
    noun: "noun", noun2: "noun", noun3: "noun",
    verb: "verb", verb2: "verb",
    adj: "adjective", adj2: "adjective",
    adv: "adverb",
    name: "name",
    number: "number",
    counter: "counter"
  };

  /* ==========================================================================
     ENGLISH HELPERS
     The bank packs several senses into one gloss ("to see, to watch, to look
     at"), and a generated sentence can only carry one, so everything here
     runs through KoreanGrammar's first-sense reader.
  ========================================================================== */
  const gloss = entry => G.baseEnglish({ english: entry.en });
  const V = entry => G.verbEnglish({ english: entry.en });
  const A = entry => G.adjectiveEnglish({ english: entry.en });
  /* A few glosses carry their own article ("a piece", "the last one"), and the
     sentence frames supply one of their own, so it comes off here. */
  const N = entry => gloss(entry).replace(/^(?:a|an|the)\s+/i, "");
  const the = entry => "the " + N(entry);
  const a = entry => G.article(N(entry));
  const third = entry => G.thirdPerson(V(entry));
  const ing = entry => G.gerund(V(entry));
  const past = entry => G.pastEnglish(V(entry));
  const cap = text => String(text).charAt(0).toUpperCase() + String(text).slice(1);

  /* Many verbs are glossed as a state — 놀라다 is "to be surprised", 들리다 is
     "to be heard" — and English will not say "I be surprised", so the first
     person and the plural take the matching form of to be. */
  const isBe = entry => /^be(\s|$)/i.test(V(entry));
  const beRest = entry => V(entry).replace(/^be\s*/i, "");
  const iV = entry => (isBe(entry) ? "am " + beRest(entry) : V(entry));
  const theyV = entry => (isBe(entry) ? "are " + beRest(entry) : V(entry));
  const iNot = entry => (isBe(entry) ? "am not " + beRest(entry) : "do not " + V(entry));

  /* bird -> birds, library -> libraries, bus -> buses */
  function plural(entry) {
    const word = N(entry);
    if (/(?:ch|sh|ss|s|x|z)$/i.test(word)) return word + "es";
    if (/[^aeiou]y$/i.test(word)) return word.slice(0, -1) + "ies";
    return word + "s";
  }

  /* ==========================================================================
     KOREAN HELPERS
     Particles and endings that KoreanGrammar does not already hand over in the
     exact shape a template wants.
  ========================================================================== */
  const topic = entry => G.topic(entry.ko);
  const subject = entry => G.subject(entry.ko);
  const object = entry => G.object(entry.ko);
  const polite = entry => G.politeEnding(entry.ko);
  const pastPolite = entry => G.pastPolite(entry.ko);
  const stem = (entry, ending) => G.plainStem(entry.ko, ending);
  const eu = (entry, ending) => G.attachEu(entry.ko, ending);
  const inf = entry => G.infinitive(entry.ko);

  /* 학생이었어요 / 의사였어요 — the past of the copula. */
  const pastCopula = entry => entry.ko + (G.hasBatchim(entry.ko) ? "이었어요" : "였어요");
  /* 민수라고 / 콩이이라고 — 이 appears only after a consonant. */
  const quoted = entry => entry.ko + (G.hasBatchim(entry.ko) ? "이라고" : "라고");

  /* The plain declarative a quote sits on: 간다고, 먹는다고, 좋다고.
     Adjectives keep the dictionary form; verbs take -ㄴ다 or -는다. */
  function plainDeclarative(entry, isAdjective) {
    if (isAdjective) return G.stemOf(entry.ko) + "다";
    const bare = G.stemOf(entry.ko);
    if (G.irregularClass(entry.ko) === "l") return G.attachEu(entry.ko, "ㄴ다");
    return G.hasBatchim(bare) ? bare + "는다" : G.attachEu(entry.ko, "ㄴ다");
  }

  /* 하나 -> 한 개. Native numbers change shape in front of a counter; the
     Sino-Korean ones in the bank are left as they are. */
  const ATTRIBUTIVE = { "하나": "한", "둘": "두", "셋": "세", "넷": "네", "스물": "스무" };
  const attributive = entry => ATTRIBUTIVE[entry.ko] || entry.ko;

  /* ==========================================================================
     TEMPLATES
     Keyed by grammar point id. Grade 1's ids have no prefix; grade 2's all
     begin g2-. A page only ever reaches the ones its own grammar bank holds.
  ========================================================================== */
  const TEMPLATES = {
    /* ---- grade 1 · particles -------------------------------------------- */
    "topic-eun-neun": [
      { needs: ["noun", "adj"], build: s => ({ ko: `${topic(s.noun)} ${polite(s.adj)}.`, en: `The ${N(s.noun)} is ${A(s.adj)}.` }) },
      { needs: ["noun", "noun2"], build: s => ({ ko: `${topic(s.noun)} ${G.copula(s.noun2.ko)}.`, en: `The ${N(s.noun)} is ${a(s.noun2)}.` }) },
      { needs: ["noun", "noun2", "verb"], build: s => ({ ko: `${topic(s.noun)} ${object(s.noun2)} ${polite(s.verb)}.`, en: `The ${N(s.noun)} ${third(s.verb)} the ${N(s.noun2)}.` }) }
    ],
    "subject-i-ga": [
      { needs: ["noun", "noun2"], build: s => ({ ko: `${s.noun.ko}에 ${subject(s.noun2)} 있어요.`, en: `There is ${a(s.noun2)} at the ${N(s.noun)}.` }) },
      { needs: ["noun", "adj"], build: s => ({ ko: `${subject(s.noun)} ${polite(s.adj)}.`, en: `The ${N(s.noun)} is ${A(s.adj)}.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${subject(s.noun)} ${polite(s.verb)}.`, en: `The ${N(s.noun)} ${third(s.verb)}.` }) }
    ],
    "object-eul-reul": [
      { needs: ["noun", "verb"], build: s => ({ ko: `저는 ${object(s.noun)} ${polite(s.verb)}.`, en: `I ${iV(s.verb)} the ${N(s.noun)}.` }) },
      { needs: ["name", "noun", "verb"], build: s => ({ ko: `${topic(s.name)} ${object(s.noun)} ${polite(s.verb)}.`, en: `${N(s.name)} ${third(s.verb)} the ${N(s.noun)}.` }) }
    ],
    "location-e": [
      { needs: ["noun"], build: s => ({ ko: `저는 ${s.noun.ko}에 가요.`, en: `I go to the ${N(s.noun)}.` }) },
      { needs: ["noun", "noun2"], build: s => ({ ko: `${s.noun.ko}에 ${subject(s.noun2)} 있어요.`, en: `There is ${a(s.noun2)} at the ${N(s.noun)}.` }) },
      { needs: ["noun", "noun2", "verb"], build: s => ({ ko: `${s.noun.ko}에 ${object(s.noun2)} ${polite(s.verb)}.`, en: `I ${iV(s.verb)} the ${N(s.noun2)} to the ${N(s.noun)}.` }) }
    ],
    "location-eseo": [
      { needs: ["noun", "noun2", "verb"], build: s => ({ ko: `${s.noun.ko}에서 ${object(s.noun2)} ${polite(s.verb)}.`, en: `I ${iV(s.verb)} the ${N(s.noun2)} at the ${N(s.noun)}.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `저는 ${s.noun.ko}에서 ${polite(s.verb)}.`, en: `I ${iV(s.verb)} at the ${N(s.noun)}.` }) }
    ],
    "and-wa-gwa-hago": [
      { needs: ["noun", "noun2", "verb"], build: s => ({ ko: `${G.and(s.noun.ko)} ${object(s.noun2)} ${polite(s.verb)}.`, en: `I ${iV(s.verb)} the ${N(s.noun)} and the ${N(s.noun2)}.` }) },
      { needs: ["noun", "noun2", "adj"], build: s => ({ ko: `${s.noun.ko}하고 ${subject(s.noun2)} ${polite(s.adj)}.`, en: `The ${N(s.noun)} and the ${N(s.noun2)} are ${A(s.adj)}.`, cue: "join them with 하고" }) }
    ],
    "also-do": [
      { needs: ["noun", "adj"], build: s => ({ ko: `${s.noun.ko}도 ${polite(s.adj)}.`, en: `The ${N(s.noun)} is ${A(s.adj)} too.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${s.noun.ko}도 ${polite(s.verb)}.`, en: `The ${N(s.noun)} ${third(s.verb)} too.` }) }
    ],
    "possessive-je": [
      { needs: ["noun", "adj"], build: s => ({ ko: `제 ${topic(s.noun)} ${polite(s.adj)}.`, en: `My ${N(s.noun)} is ${A(s.adj)}.` }) },
      { needs: ["name", "noun", "adj"], build: s => ({ ko: `${s.name.ko}의 ${topic(s.noun)} ${polite(s.adj)}.`, en: `${N(s.name)}'s ${N(s.noun)} is ${A(s.adj)}.` }) }
    ],
    "instrument-ro": [
      { needs: ["noun", "noun2", "verb"], build: s => ({ ko: `${G.instrumental(s.noun.ko)} ${object(s.noun2)} ${polite(s.verb)}.`, en: `I ${iV(s.verb)} the ${N(s.noun2)} with the ${N(s.noun)}.` }) }
    ],
    "every-mada": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${s.noun.ko}마다 ${polite(s.verb)}.`, en: `I ${iV(s.verb)} every ${N(s.noun)}.` }) },
      { needs: ["noun", "noun2", "verb"], build: s => ({ ko: `${s.noun.ko}마다 ${object(s.noun2)} ${polite(s.verb)}.`, en: `Every ${N(s.noun)} I ${iV(s.verb)} the ${N(s.noun2)}.` }) }
    ],

    /* ---- grade 1 · being and having -------------------------------------- */
    "copula-ieyo": [
      { needs: ["noun", "noun2"], build: s => ({ ko: `${topic(s.noun)} ${G.copula(s.noun2.ko)}.`, en: `The ${N(s.noun)} is ${a(s.noun2)}.` }) },
      { needs: ["name", "noun"], build: s => ({ ko: `${topic(s.name)} ${G.copula(s.noun.ko)}.`, en: `${N(s.name)} is ${a(s.noun)}.` }) }
    ],
    "itda-eopda": [
      { needs: ["noun", "noun2"], build: s => ({ ko: `${s.noun.ko}에 ${subject(s.noun2)} 있어요.`, en: `There is ${a(s.noun2)} in the ${N(s.noun)}.` }) },
      { needs: ["noun", "noun2"], build: s => ({ ko: `${s.noun.ko}에 ${subject(s.noun2)} 없어요.`, en: `There is no ${N(s.noun2)} in the ${N(s.noun)}.` }) }
    ],

    /* ---- grade 1 · verb endings ------------------------------------------ */
    "polite-ayo-eoyo": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${topic(s.noun)} ${polite(s.verb)}.`, en: `The ${N(s.noun)} ${third(s.verb)}.` }) },
      { needs: ["noun", "adj"], build: s => ({ ko: `${topic(s.noun)} ${polite(s.adj)}.`, en: `The ${N(s.noun)} is ${A(s.adj)}.` }) },
      { needs: ["adv", "verb"], build: s => ({ ko: `저는 ${s.adv.ko} ${polite(s.verb)}.`, en: `I ${iV(s.verb)} ${N(s.adv)}.` }) }
    ],
    "connect-go": [
      { needs: ["verb", "verb2"], build: s => ({ ko: `${stem(s.verb, "고")}고 ${polite(s.verb2)}.`, en: `I ${iV(s.verb)} and then ${iV(s.verb2)}.` }) },
      { needs: ["noun", "verb", "noun2", "verb2"], build: s => ({ ko: `${object(s.noun)} ${stem(s.verb, "고")}고 ${object(s.noun2)} ${polite(s.verb2)}.`, en: `I ${iV(s.verb)} the ${N(s.noun)} and then ${iV(s.verb2)} the ${N(s.noun2)}.` }) }
    ],
    "connect-aseo": [
      { needs: ["verb", "verb2"], build: s => ({ ko: `${inf(s.verb)}서 ${polite(s.verb2)}.`, en: `I ${iV(s.verb)} and so I ${iV(s.verb2)}.` }) },
      { needs: ["noun", "adj", "verb"], build: s => ({ ko: `${topic(s.noun)} ${inf(s.adj)}서 ${polite(s.verb)}.`, en: `The ${N(s.noun)} is ${A(s.adj)} and so I ${iV(s.verb)}.` }) }
    ],
    "negation": [
      {
        needs: ["noun", "verb"],
        build: s => ({ ko: `저는 ${object(s.noun)} 안 ${polite(s.verb)}.`, en: `I ${iNot(s.verb)} the ${N(s.noun)}.`, cue: "either negative is fine" }),
        alts: s => [`저는 ${object(s.noun)} ${G.longNegative(s.verb.ko)}.`]
      },
      {
        needs: ["noun", "adj"],
        build: s => ({ ko: `${topic(s.noun)} ${G.longNegative(s.adj.ko)}.`, en: `The ${N(s.noun)} is not ${A(s.adj)}.`, cue: "either negative is fine" }),
        alts: s => [`${topic(s.noun)} 안 ${polite(s.adj)}.`]
      }
    ],
    "request-seyo": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${eu(s.verb, "(으)세요")}.`, en: `Please ${V(s.verb)} the ${N(s.noun)}.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${s.noun.ko}에서 ${eu(s.verb, "(으)세요")}.`, en: `Please ${V(s.verb)} at the ${N(s.noun)}.` }) }
    ],

    /* ---- grade 1 · clauses in front of a noun ---------------------------- */
    "modifier-neun": [
      { needs: ["verb", "noun"], build: s => ({ ko: `${G.modifier(s.verb.ko)} ${subject(s.noun)} 있어요.`, en: `There is ${a(s.noun)} that ${third(s.verb)}.` }) },
      { needs: ["adj", "noun"], build: s => ({ ko: `저는 ${G.modifier(s.adj.ko, { adjective: true })} ${object(s.noun)} 좋아해요.`, en: `I like ${A(s.adj)} ${plural(s.noun)}.` }) }
    ],
    "embedded-neunji": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${topic(s.noun)} 무엇을 ${stem(s.verb, "는지")}는지 몰라요.`, en: `I do not know what the ${N(s.noun)} ${third(s.verb)}.` }) },
      { needs: ["noun", "adj"], build: s => ({ ko: `${topic(s.noun)} ${eu(s.adj, "(으)ㄴ지")} 몰라요.`, en: `I do not know whether the ${N(s.noun)} is ${A(s.adj)}.` }) }
    ],

    /* ---- grade 1 · sentence patterns ------------------------------------- */
    "counters": [
      { needs: ["noun", "number", "counter"], build: s => ({ ko: `${s.noun.ko} ${attributive(s.number)} ${s.counter.ko} 있어요.`, en: `There are ${N(s.number)} ${plural(s.noun)}.`, cue: `count with ${s.counter.ko}` }) },
      { needs: ["noun", "number", "counter", "verb"], build: s => ({ ko: `${object(s.noun)} ${attributive(s.number)} ${s.counter.ko} ${polite(s.verb)}.`, en: `I ${iV(s.verb)} ${N(s.number)} ${plural(s.noun)}.`, cue: `count with ${s.counter.ko}` }) }
    ],
    "joahada": [
      { needs: ["noun"], build: s => ({ ko: `저는 ${object(s.noun)} 좋아해요.`, en: `I like ${plural(s.noun)}.` }) },
      { needs: ["noun"], build: s => ({ ko: `${subject(s.noun)} 좋아요.`, en: `The ${N(s.noun)} is good.` }) }
    ],
    "word-order": [
      { needs: ["name", "noun", "verb"], build: s => ({ ko: `${topic(s.name)} ${object(s.noun)} ${polite(s.verb)}.`, en: `${N(s.name)} ${third(s.verb)} the ${N(s.noun)}.` }) },
      { needs: ["adv", "noun", "verb"], build: s => ({ ko: `저는 ${s.adv.ko} ${object(s.noun)} ${polite(s.verb)}.`, en: `I ${iV(s.verb)} the ${N(s.noun)} ${N(s.adv)}.` }) }
    ],
    "connectors": [
      { needs: ["noun", "adj", "noun2", "adj2"], build: s => ({ ko: `${topic(s.noun)} ${polite(s.adj)}. 그리고 ${topic(s.noun2)} ${polite(s.adj2)}.`, en: `The ${N(s.noun)} is ${A(s.adj)}. And the ${N(s.noun2)} is ${A(s.adj2)}.` }) },
      { needs: ["noun", "adj", "noun2", "adj2"], build: s => ({ ko: `${topic(s.noun)} ${polite(s.adj)}. 하지만 ${topic(s.noun2)} ${polite(s.adj2)}.`, en: `The ${N(s.noun)} is ${A(s.adj)}. But the ${N(s.noun2)} is ${A(s.adj2)}.` }) },
      { needs: ["noun", "adj", "noun2", "verb"], build: s => ({ ko: `${topic(s.noun)} ${polite(s.adj)}. 그래서 저는 ${object(s.noun2)} ${polite(s.verb)}.`, en: `The ${N(s.noun)} is ${A(s.adj)}. So I ${iV(s.verb)} the ${N(s.noun2)}.` }) }
    ],
    "question-words": [
      { needs: ["noun"], build: s => ({ ko: `${topic(s.noun)} 어디에 있어요?`, en: `Where is the ${N(s.noun)}?` }) },
      { needs: ["verb"], build: s => ({ ko: `무엇을 ${polite(s.verb)}?`, en: `What do you ${V(s.verb)}?` }) },
      { needs: ["noun", "counter"], build: s => ({ ko: `${subject(s.noun)} 몇 ${s.counter.ko} 있어요?`, en: `How many ${plural(s.noun)} are there?`, cue: `count with ${s.counter.ko}` }) },
      { needs: ["noun"], build: s => ({ ko: `누가 ${object(s.noun)} 좋아해요?`, en: `Who likes ${plural(s.noun)}?` }) }
    ],

    /* ---- grade 2 · tense -------------------------------------------------- */
    "g2-past": [
      { needs: ["noun", "verb"], build: s => ({ ko: `저는 ${object(s.noun)} ${pastPolite(s.verb)}.`, en: `I ${past(s.verb)} the ${N(s.noun)}.` }) },
      { needs: ["noun", "adj"], build: s => ({ ko: `${topic(s.noun)} ${pastPolite(s.adj)}.`, en: `The ${N(s.noun)} was ${A(s.adj)}.` }) },
      { needs: ["name", "noun", "verb"], build: s => ({ ko: `${topic(s.name)} ${object(s.noun)} ${pastPolite(s.verb)}.`, en: `${N(s.name)} ${past(s.verb)} the ${N(s.noun)}.` }) }
    ],
    "g2-past-copula": [
      { needs: ["noun", "noun2"], build: s => ({ ko: `${topic(s.noun)} ${pastCopula(s.noun2)}.`, en: `The ${N(s.noun)} was ${a(s.noun2)}.` }) },
      { needs: ["name", "noun"], build: s => ({ ko: `${topic(s.name)} ${pastCopula(s.noun)}.`, en: `${N(s.name)} was ${a(s.noun)}.` }) }
    ],
    "g2-future-geoyeyo": [
      { needs: ["noun", "verb"], build: s => ({ ko: `저는 ${object(s.noun)} ${G.futurePolite(s.verb.ko)}.`, en: `I will ${V(s.verb)} the ${N(s.noun)}.` }) },
      { needs: ["noun", "adj"], build: s => ({ ko: `${topic(s.noun)} ${G.futurePolite(s.adj.ko)}.`, en: `The ${N(s.noun)} will be ${A(s.adj)}.` }) }
    ],

    /* ---- grade 2 · can, want, must ---------------------------------------- */
    "g2-su-itda": [
      { needs: ["noun", "verb"], build: s => ({ ko: `저는 ${object(s.noun)} ${eu(s.verb, "(으)ㄹ")} 수 있어요.`, en: `I can ${V(s.verb)} the ${N(s.noun)}.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `저는 ${object(s.noun)} ${eu(s.verb, "(으)ㄹ")} 수 없어요.`, en: `I cannot ${V(s.verb)} the ${N(s.noun)}.` }) }
    ],
    "g2-jul-alda": [
      { needs: ["verb"], build: s => ({ ko: `저는 ${eu(s.verb, "(으)ㄹ")} 줄 알아요.`, en: `I know how to ${V(s.verb)}.` }) },
      { needs: ["verb"], build: s => ({ ko: `저는 ${eu(s.verb, "(으)ㄹ")} 줄 몰라요.`, en: `I do not know how to ${V(s.verb)}.` }) }
    ],
    "g2-go-sipda": [
      { needs: ["noun", "verb"], build: s => ({ ko: `저는 ${object(s.noun)} ${stem(s.verb, "고")}고 싶어요.`, en: `I want to ${V(s.verb)} the ${N(s.noun)}.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${s.noun.ko}에 ${stem(s.verb, "고")}고 싶어요.`, en: `I want to ${V(s.verb)} at the ${N(s.noun)}.` }) }
    ],
    "g2-eoya-hada": [
      { needs: ["noun", "verb"], build: s => ({ ko: `저는 ${object(s.noun)} ${inf(s.verb)}야 해요.`, en: `I have to ${V(s.verb)} the ${N(s.noun)}.` }) },
      { needs: ["noun", "adj"], build: s => ({ ko: `${topic(s.noun)} ${inf(s.adj)}야 해요.`, en: `The ${N(s.noun)} has to be ${A(s.adj)}.` }) }
    ],

    /* ---- grade 2 · joining clauses ---------------------------------------- */
    "g2-eul-ttae": [
      { needs: ["verb", "verb2"], build: s => ({ ko: `${eu(s.verb, "(으)ㄹ")} 때 ${polite(s.verb2)}.`, en: `When I ${iV(s.verb)}, I ${iV(s.verb2)}.` }) },
      { needs: ["noun", "verb", "adj"], build: s => ({ ko: `${object(s.noun)} ${eu(s.verb, "(으)ㄹ")} 때 ${polite(s.adj)}.`, en: `When I ${iV(s.verb)} the ${N(s.noun)}, it is ${A(s.adj)}.` }) }
    ],
    "g2-gi-jeone": [
      { needs: ["verb", "verb2"], build: s => ({ ko: `${stem(s.verb, "기")}기 전에 ${polite(s.verb2)}.`, en: `Before I ${iV(s.verb)}, I ${iV(s.verb2)}.` }) },
      { needs: ["verb", "verb2"], build: s => ({ ko: `${eu(s.verb, "(으)ㄴ")} 후에 ${polite(s.verb2)}.`, en: `After I ${iV(s.verb)}, I ${iV(s.verb2)}.` }) }
    ],
    "g2-myeon": [
      { needs: ["verb", "verb2"], build: s => ({ ko: `${eu(s.verb, "(으)면")} ${polite(s.verb2)}.`, en: `If I ${iV(s.verb)}, I ${iV(s.verb2)}.` }) },
      { needs: ["adj", "verb"], build: s => ({ ko: `${eu(s.adj, "(으)면")} ${polite(s.verb)}.`, en: `If it is ${A(s.adj)}, I ${iV(s.verb)}.` }) }
    ],
    "g2-myeonseo": [
      { needs: ["verb", "verb2"], build: s => ({ ko: `${eu(s.verb, "(으)면서")} ${polite(s.verb2)}.`, en: `I ${iV(s.verb2)} while ${ing(s.verb)}.` }) },
      { needs: ["noun", "verb", "verb2"], build: s => ({ ko: `${object(s.noun)} ${eu(s.verb, "(으)면서")} ${polite(s.verb2)}.`, en: `I ${iV(s.verb2)} while ${ing(s.verb)} the ${N(s.noun)}.` }) }
    ],
    "g2-jiman": [
      { needs: ["adj", "verb"], build: s => ({ ko: `${stem(s.adj, "지만")}지만 ${polite(s.verb)}.`, en: `It is ${A(s.adj)} but I ${iV(s.verb)}.` }) },
      { needs: ["verb", "verb2"], build: s => ({ ko: `${stem(s.verb, "지만")}지만 ${polite(s.verb2)}.`, en: `I ${iV(s.verb)} but I ${iV(s.verb2)}.` }) }
    ],
    "g2-euro-gada": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${s.noun.ko}에 ${eu(s.verb, "(으)러")} 가요.`, en: `I go to the ${N(s.noun)} to ${V(s.verb)}.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${eu(s.verb, "(으)려고")} 해요.`, en: `I am going to ${V(s.verb)} the ${N(s.noun)}.`, cue: "-(으)려고 하다" }) }
    ],

    /* ---- grade 2 · helping verbs ------------------------------------------ */
    "g2-eo-juda": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${inf(s.verb)} 줘요.`, en: `I ${iV(s.verb)} the ${N(s.noun)} for you.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${inf(s.verb)} 주세요.`, en: `Please ${V(s.verb)} the ${N(s.noun)} for me.` }) }
    ],
    "g2-eo-boda": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${inf(s.verb)} 봤어요.`, en: `I tried ${ing(s.verb)} the ${N(s.noun)}.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${inf(s.verb)} 보세요.`, en: `Please try ${ing(s.verb)} the ${N(s.noun)}.` }) }
    ],
    "g2-eojida": [
      { needs: ["noun", "adj"], build: s => ({ ko: `${subject(s.noun)} ${inf(s.adj)}졌어요.`, en: `The ${N(s.noun)} became ${A(s.adj)}.` }) },
      { needs: ["noun", "adj"], build: s => ({ ko: `${subject(s.noun)} ${inf(s.adj)}져요.`, en: `The ${N(s.noun)} is becoming ${A(s.adj)}.` }) }
    ],
    "g2-ge": [
      { needs: ["adj", "verb"], build: s => ({ ko: `${stem(s.adj, "게")}게 ${polite(s.verb)}.`, en: `I ${iV(s.verb)} in a ${A(s.adj)} way.` }) },
      { needs: ["noun", "adj", "verb"], build: s => ({ ko: `${object(s.noun)} ${stem(s.adj, "게")}게 ${polite(s.verb)}.`, en: `I ${iV(s.verb)} the ${N(s.noun)} in a ${A(s.adj)} way.` }) }
    ],

    /* ---- grade 2 · respect, quoting, comparing ---------------------------- */
    "g2-honorific-si": [
      { needs: ["name", "verb"], build: s => ({ ko: `${s.name.ko}께서 ${eu(s.verb, "(으)세요")}.`, en: `${N(s.name)} ${third(s.verb)}.`, cue: "respect forms 께서 and -(으)시-" }) },
      { needs: ["name", "noun", "verb"], build: s => ({ ko: `${s.name.ko}께서 ${object(s.noun)} ${eu(s.verb, "(으)셨어요")}.`, en: `${N(s.name)} ${past(s.verb)} the ${N(s.noun)}.`, cue: "respect forms, in the past" }) }
    ],
    "g2-irago-hada": [
      { needs: ["noun", "name"], build: s => ({ ko: `제 ${topic(s.noun)} ${quoted(s.name)} 해요.`, en: `My ${N(s.noun)} is called ${N(s.name)}.` }) },
      { needs: ["noun", "name"], build: s => ({ ko: `${quoted(s.name)} 하는 ${subject(s.noun)} 있어요.`, en: `There is ${a(s.noun)} called ${N(s.name)}.` }) }
    ],
    "g2-dago": [
      { needs: ["name", "noun", "verb"], build: s => ({ ko: `${topic(s.name)} ${object(s.noun)} ${plainDeclarative(s.verb, false)}고 했어요.`, en: `${N(s.name)} said that they ${V(s.verb)} the ${N(s.noun)}.` }) },
      { needs: ["name", "noun", "adj"], build: s => ({ ko: `${topic(s.name)} ${topic(s.noun)} ${plainDeclarative(s.adj, true)}고 했어요.`, en: `${N(s.name)} said that the ${N(s.noun)} is ${A(s.adj)}.` }) }
    ],
    "g2-comparison": [
      { needs: ["noun", "noun2", "adj"], build: s => ({ ko: `${s.noun.ko}보다 ${subject(s.noun2)} 더 ${polite(s.adj)}.`, en: `The ${N(s.noun2)} is more ${A(s.adj)} than the ${N(s.noun)}.` }) },
      { needs: ["noun", "noun2", "adj"], build: s => ({ ko: `${topic(s.noun)} ${s.noun2.ko}처럼 ${polite(s.adj)}.`, en: `The ${N(s.noun)} is as ${A(s.adj)} as the ${N(s.noun2)}.` }) },
      { needs: ["noun", "adj"], build: s => ({ ko: `${topic(s.noun)} 가장 ${polite(s.adj)}.`, en: `The ${N(s.noun)} is the most ${A(s.adj)}.`, cue: "가장 or 제일" }) }
    ],
    "g2-geot-gatda": [
      { needs: ["noun", "adj"], build: s => ({ ko: `${subject(s.noun)} ${G.modifier(s.adj.ko, { adjective: true })} 것 같아요.`, en: `It seems the ${N(s.noun)} is ${A(s.adj)}.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${subject(s.noun)} ${G.modifier(s.verb.ko)} 것 같아요.`, en: `It seems the ${N(s.noun)} ${third(s.verb)}.` }) }
    ],

    /* ---- grade 2 · casual speech and commands ----------------------------- */
    "g2-casual": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${G.casualPresent(s.verb.ko)}.`, en: `I ${iV(s.verb)} the ${N(s.noun)}.`, cue: "casual style — no 요" }) },
      { needs: ["noun", "adj"], build: s => ({ ko: `${topic(s.noun)} ${G.casualPresent(s.adj.ko)}.`, en: `The ${N(s.noun)} is ${A(s.adj)}.`, cue: "casual style — no 요" }) }
    ],
    "g2-commands": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${inf(s.verb)}라.`, en: `${cap(V(s.verb))} the ${N(s.noun)}!`, cue: "plain command -아라 / -어라" }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${G.stemOf(s.verb.ko)}지 마.`, en: `Do not ${V(s.verb)} the ${N(s.noun)}.`, cue: "plain command" }) }
    ],
    "g2-ulge-ullae": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${eu(s.verb, "(으)ㄹ게")}.`, en: `I will ${V(s.verb)} the ${N(s.noun)}.`, cue: "-(으)ㄹ게, a promise" }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${object(s.noun)} ${eu(s.verb, "(으)ㄹ래")}?`, en: `Shall we ${V(s.verb)} the ${N(s.noun)}?`, cue: "-(으)ㄹ래" }) }
    ],
    "g2-ne-guna": [
      { needs: ["noun", "adj"], build: s => ({ ko: `${subject(s.noun)} ${stem(s.adj, "네요")}네요.`, en: `Oh, the ${N(s.noun)} is ${A(s.adj)}!`, cue: "-네요" }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${subject(s.noun)} ${stem(s.verb, "네요")}네요.`, en: `Oh, the ${N(s.noun)} ${third(s.verb)}!`, cue: "-네요" }) }
    ],

    /* ---- grade 2 · modifiers, nouns from verbs, negatives ----------------- */
    "g2-modifiers-three": [
      { needs: ["verb", "noun"], build: s => ({ ko: `${G.modifier(s.verb.ko, { tense: "past" })} ${subject(s.noun)} 있어요.`, en: `There is ${a(s.noun)} that ${past(s.verb)}.`, cue: "past modifier" }) },
      { needs: ["verb", "noun"], build: s => ({ ko: `${G.modifier(s.verb.ko)} ${subject(s.noun)} 있어요.`, en: `There is ${a(s.noun)} that ${third(s.verb)}.`, cue: "present modifier" }) },
      { needs: ["verb", "noun"], build: s => ({ ko: `${G.modifier(s.verb.ko, { tense: "future" })} ${subject(s.noun)} 있어요.`, en: `There is ${a(s.noun)} that will ${V(s.verb)}.`, cue: "future modifier" }) }
    ],
    "g2-gi-noun": [
      { needs: ["verb", "adj"], build: s => ({ ko: `${stem(s.verb, "기")}기가 ${polite(s.adj)}.`, en: `${cap(ing(s.verb))} is ${A(s.adj)}.` }) },
      { needs: ["noun", "verb", "adj"], build: s => ({ ko: `${object(s.noun)} ${stem(s.verb, "기")}기가 ${polite(s.adj)}.`, en: `${cap(ing(s.verb))} the ${N(s.noun)} is ${A(s.adj)}.` }) }
    ],
    "g2-mothada": [
      {
        needs: ["noun", "verb"],
        build: s => ({ ko: `저는 ${object(s.noun)} 못 ${polite(s.verb)}.`, en: `I cannot ${V(s.verb)} the ${N(s.noun)}.`, cue: "either 못 form is fine" }),
        alts: s => [`저는 ${object(s.noun)} ${G.stemOf(s.verb.ko)}지 못해요.`]
      },
      {
        needs: ["noun", "verb"],
        build: s => ({ ko: `저는 ${object(s.noun)} 못 ${pastPolite(s.verb)}.`, en: `I could not ${V(s.verb)} the ${N(s.noun)}.`, cue: "either 못 form is fine" }),
        alts: s => [`저는 ${object(s.noun)} ${G.stemOf(s.verb.ko)}지 못했어요.`]
      }
    ],
    "g2-deul": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${s.noun.ko}들이 ${polite(s.verb)}.`, en: `The ${plural(s.noun)} ${theyV(s.verb)}.` }) },
      { needs: ["noun", "adj"], build: s => ({ ko: `${s.noun.ko}들은 ${polite(s.adj)}.`, en: `The ${plural(s.noun)} are ${A(s.adj)}.` }) }
    ],
    "g2-mane": [
      { needs: ["noun", "noun2", "verb"], build: s => ({ ko: `${s.noun.ko}부터 ${s.noun2.ko}까지 ${polite(s.verb)}.`, en: `I ${iV(s.verb)} from the ${N(s.noun)} to the ${N(s.noun2)}.` }) },
      { needs: ["noun", "verb"], build: s => ({ ko: `${s.noun.ko} 내내 ${polite(s.verb)}.`, en: `I ${iV(s.verb)} all ${N(s.noun)} long.` }) }
    ],
    "g2-euro-direction": [
      { needs: ["noun", "verb"], build: s => ({ ko: `${G.instrumental(s.noun.ko)} ${polite(s.verb)}.`, en: `I ${iV(s.verb)} towards the ${N(s.noun)}.` }) },
      { needs: ["noun", "noun2", "verb"], build: s => ({ ko: `${object(s.noun2)} ${G.instrumental(s.noun.ko)} ${polite(s.verb)}.`, en: `I ${iV(s.verb)} the ${N(s.noun2)} towards the ${N(s.noun)}.` }) }
    ],
    "g2-connectors": [
      { needs: ["noun", "adj", "noun2", "verb"], build: s => ({ ko: `${topic(s.noun)} ${polite(s.adj)}. 그래서 저는 ${object(s.noun2)} ${polite(s.verb)}.`, en: `The ${N(s.noun)} is ${A(s.adj)}. So I ${iV(s.verb)} the ${N(s.noun2)}.` }) },
      { needs: ["noun", "adj", "noun2", "verb"], build: s => ({ ko: `${topic(s.noun)} ${polite(s.adj)}. 그런데 저는 ${object(s.noun2)} ${polite(s.verb)}.`, en: `The ${N(s.noun)} is ${A(s.adj)}. But I ${iV(s.verb)} the ${N(s.noun2)}.` }) }
    ]
  };

  /* ==========================================================================
     GENERATOR
  ========================================================================== */
  const pick = list => list[Math.floor(Math.random() * list.length)];

  /* Which parts of speech a template variant needs, and how many of each. */
  function demand(variant) {
    const counts = {};
    variant.needs.forEach(slot => {
      const pos = SLOT_POS[slot];
      counts[pos] = (counts[pos] || 0) + 1;
    });
    return counts;
  }

  /* A variant is usable when the bank can fill every slot with a different
     word. Grade 1 has four names; a template wanting two would be dropped. */
  function variantFits(variant, byPos) {
    return Object.entries(demand(variant)).every(([pos, n]) => (byPos[pos] || []).length >= n);
  }

  /* Nonsense is the point of this exercise, but ungrammatical is not. 있다,
     없다, 계시다 and 되다 take 이/가 and never 을/를, and 않다, 못하다 and 말다
     only ever sit behind another verb, so any frame handing one an object would
     build a sentence no Korean would write. Each of them still turns up inside
     the grammar point that drills it. */
  const VERB_SKIP = new Set(["있다", "없다", "계시다", "되다", "이다", "아니다", "않다", "못하다", "말다"]);

  function groupByPos(pool) {
    const byPos = {};
    pool.forEach(entry => {
      if (entry.pos === "verb" && VERB_SKIP.has(entry.ko)) return;
      if (!byPos[entry.pos]) byPos[entry.pos] = [];
      byPos[entry.pos].push(entry);
    });
    return byPos;
  }

  /* Fills a variant's slots. Slots sharing a part of speech draw without
     replacement, so 학교하고 학교가 never comes out. */
  function fillSlots(variant, byPos) {
    const used = new Set();
    const slots = {};
    for (const slot of variant.needs) {
      const pos = SLOT_POS[slot];
      const choices = (byPos[pos] || []).filter(entry => !used.has(entry.id));
      if (!choices.length) return null;
      const entry = pick(choices);
      used.add(entry.id);
      slots[slot] = entry;
    }
    return slots;
  }

  /* 은/는 and 이/가 are both defensible on most of these sentences, so the
     other one is accepted too. The swap is built from the words that went into
     the sentence, never by pattern-matching the Korean, so 고양이 keeps its 이. */
  function particleSwaps(ko, slots) {
    const out = new Set();
    /* Only where the particle ends the word: 창문이에요 is the copula, not 창문
       plus 이, and swapping inside it would accept 창문은에요. */
    const swap = (text, from, to) => {
      const pattern = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?=\\s|[.,?!]|$)", "g");
      return pattern.test(text) ? text.replace(pattern, to) : null;
    };
    Object.keys(slots).forEach(slot => {
      const word = slots[slot].ko;
      const asTopic = G.topic(word);
      const asSubject = G.subject(word);
      const toSubject = swap(ko, asTopic, asSubject);
      const toTopic = swap(ko, asSubject, asTopic);
      if (toSubject) out.add(toSubject);
      if (toTopic) out.add(toTopic);
    });
    out.delete(ko);
    return [...out];
  }

  function has(pointId) {
    return Array.isArray(TEMPLATES[pointId]) && TEMPLATES[pointId].length > 0;
  }

  /* Whether this bank can build anything at all for a point. */
  function supports(pointId, pool) {
    if (!has(pointId)) return false;
    const byPos = groupByPos(pool);
    return TEMPLATES[pointId].some(variant => variantFits(variant, byPos));
  }

  /*
    One sentence for one grammar point, or null when the bank cannot fill any
    of its templates. `words` is what went into it, so the page can offer the
    vocabulary as a hint.
  */
  function make(pointId, pool) {
    if (!has(pointId)) return null;
    const byPos = groupByPos(pool);
    const usable = TEMPLATES[pointId].filter(variant => variantFits(variant, byPos));
    if (!usable.length) return null;
    const variant = pick(usable);
    const slots = fillSlots(variant, byPos);
    if (!slots) return null;
    const built = variant.build(slots);
    const extra = typeof variant.alts === "function" ? variant.alts(slots) : [];
    const words = variant.needs.map(slot => slots[slot]);
    return {
      pointId: pointId,
      ko: built.ko,
      en: built.en,
      cue: built.cue || "",
      alts: [...new Set(extra.concat(particleSwaps(built.ko, slots), extra.flatMap(alt => particleSwaps(alt, slots))))],
      words: words.filter((entry, index) => words.indexOf(entry) === index)
    };
  }

  global.ReadingSentences = {
    VERSION: "1.0.0",
    TEMPLATES: TEMPLATES,
    SLOT_POS: SLOT_POS,
    has: has,
    supports: supports,
    make: make
  };
})(window);
