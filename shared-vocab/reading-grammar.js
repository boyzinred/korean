/*
  reading-grammar.js
  ----------------------------------------------------------------------------
  Grammar bank for the KOREAN READING COMPREHENSION section, grade 1.

  Every point here is one that the grade 1 passages actually use. A point is
  never tied to a single story: the same ending turns up in six of them, so
  membership is worked out at render time by running each point's `match`
  patterns over a story's Korean lines. Group the page by story and a point
  appears under every story that uses it; group it by type and it appears once.

  Fields
    id        unique slug
    form      the grammar itself, in Hangul, as it is usually written
    name      a short English name for it
    type      which bucket it belongs to (see TYPE_DEFS)
    meaning   one line: what it does
    shape     which form attaches to what, including the vowel/consonant rule
    usage     a paragraph on how it behaves and what beginners get wrong
    examples  [{ ko, en }] sentences lifted from the passages themselves
    match     regular expression sources; a story that matches any of them uses
              this point. Written against the Hangul of a story's lines.

  Romanization is never stored. ReadingGrammar.romanize is the same strict
  character-by-character transliteration the vocabulary bank uses.
*/
(function (global) {
  "use strict";

  const POINTS = [
    /* ---------------------------------------------------------------------
       PARTICLES — the little tags that say what each noun is doing
    --------------------------------------------------------------------- */
    {
      id: "topic-eun-neun",
      form: "은 / 는",
      name: "Topic marker",
      type: "particle",
      meaning: "Marks what the sentence is about.",
      shape: "A noun ending in a consonant takes 은; one ending in a vowel takes 는.",
      usage: "은/는 announces the subject of the whole paragraph, not just the sentence: 저는 ... sets you up as the person being talked about, and the following sentences can leave you out entirely. It also sets one thing against another — 저는 라면을 좋아해요 right after 유나는 김밥을 좋아해요 is a contrast, not a repetition.",
      examples: [
        { ko: "저는 학생이에요.", en: "I am a student." },
        { ko: "제 방은 작아요.", en: "My room is small." },
        { ko: "도서관 안은 조용해요.", en: "Inside the library it is quiet." }
      ],
      match: ["[가-힣]는\\s", "[가-힣]은\\s", "[가-힣]는\\.", "[가-힣]은\\."]
    },
    {
      id: "subject-i-ga",
      form: "이 / 가",
      name: "Subject marker",
      type: "particle",
      meaning: "Marks who or what is doing the verb.",
      shape: "A noun ending in a consonant takes 이; one ending in a vowel takes 가.",
      usage: "Where 은/는 says what the sentence is about, 이/가 points at the thing that is new or being picked out: 침대가 있어요 answers what is in the room. With 있다, 없다, 좋다, 많다 and the other describing verbs, the thing described takes 이/가, never 을/를.",
      examples: [
        { ko: "방에 침대가 있어요.", en: "There is a bed in the room." },
        { ko: "공원에 사람이 없어요.", en: "There are no people in the park." },
        { ko: "친구들이 저를 기다려요.", en: "My friends are waiting for me." }
      ],
      match: ["[가-힣]가\\s", "[가-힣]이\\s", "[가-힣]이\\.", "[가-힣]들이"]
    },
    {
      id: "object-eul-reul",
      form: "을 / 를",
      name: "Object marker",
      type: "particle",
      meaning: "Marks the thing the verb is done to.",
      shape: "A noun ending in a consonant takes 을; one ending in a vowel takes 를.",
      usage: "Korean puts the object before the verb, with 을/를 on it: 책을 읽어요, not 읽어요 책을. In quick speech the particle is often dropped, but the passages keep it so the sentence pattern stays visible.",
      examples: [
        { ko: "저는 책을 좋아해요.", en: "I like books." },
        { ko: "학교에서 친구를 만나요.", en: "At school I meet my friends." },
        { ko: "칼로 김밥을 잘라요.", en: "We cut the gimbap with a knife." }
      ],
      match: ["[가-힣]을\\s", "[가-힣]를\\s"]
    },
    {
      id: "location-e",
      form: "에",
      name: "에 — to, at, in, on (and clock time)",
      type: "particle",
      meaning: "Where something is, where you are going, or when it happens.",
      shape: "Straight onto the noun, whatever it ends in: 학교에, 집에, 네 시에.",
      usage: "에 marks a place you go to (학교에 가요), a place something simply sits (방에 침대가 있어요), and a point in time (일곱 시에). What it never marks is a place where an action is carried out — that is 에서, the next point.",
      examples: [
        { ko: "아침마다 학교에 가요.", en: "Every morning I go to school." },
        { ko: "창문 앞에 의자가 한 개 있어요.", en: "There is one chair in front of the window." },
        { ko: "아침 일곱 시에 일어나요.", en: "I get up at seven in the morning." }
      ],
      match: ["[가-힣]에\\s", "[가-힣]에\\."]
    },
    {
      id: "location-eseo",
      form: "에서",
      name: "에서 — at (doing something), from",
      type: "particle",
      meaning: "The place an action happens, or the place it starts from.",
      shape: "Straight onto the noun: 학교에서, 시장에서, 집에서.",
      usage: "The test is the verb. 학교에 가요 — 에, because going ends at the school. 학교에서 친구를 만나요 — 에서, because the meeting happens inside it. 에서 is also from: 집에서 나가요, 집에서 멀지 않아요.",
      examples: [
        { ko: "학교에서 친구를 만나요.", en: "At school I meet my friends." },
        { ko: "시장에서 사과와 딸기를 사요.", en: "At the market we buy apples and strawberries." },
        { ko: "학교는 집에서 멀지 않아요.", en: "The school is not far from my house." }
      ],
      match: ["[가-힣]에서"]
    },
    {
      id: "and-wa-gwa-hago",
      form: "와 / 과, 하고",
      name: "and, with",
      type: "particle",
      meaning: "Joins two nouns, or names who you did something with.",
      shape: "A noun ending in a vowel takes 와, one ending in a consonant takes 과. 하고 goes on either and is the everyday spoken choice.",
      usage: "These only ever join nouns. To join two sentences you need 그리고 or the ending -고. 하고 doubles as with: 어머니하고 시장에 가요 — I go to the market with my mother.",
      examples: [
        { ko: "가방에 책과 연필을 넣어요.", en: "I put books and pencils in my bag." },
        { ko: "시장에서 사과와 딸기를 사요.", en: "At the market we buy apples and strawberries." },
        { ko: "어머니하고 시장에 가요.", en: "I go to the market with my mother." }
      ],
      match: ["[가-힣]하고", "[가-힣]와\\s", "[가-힣]과\\s"]
    },
    {
      id: "also-do",
      form: "도",
      name: "도 — too, also, even",
      type: "particle",
      meaning: "Adds this one to what has already been said.",
      shape: "Onto the noun, and it replaces 은/는, 이/가 and 을/를 rather than stacking on them.",
      usage: "You never write 고양이가도 — the 가 drops and only 도 is left: 고양이도. With a negative it means not even: 비 오는 날도 예뻐요 is the positive version, a rainy day is pretty too.",
      examples: [
        { ko: "우리 집에 고양이도 한 마리 있어요.", en: "We also have one cat at home." },
        { ko: "비 오는 날도 예뻐요.", en: "A rainy day is pretty too." }
      ],
      match: ["[가-힣]도\\s", "[가-힣]도\\."]
    },
    {
      id: "possessive-je",
      form: "제 / 의",
      name: "my, of",
      type: "particle",
      meaning: "Shows who something belongs to.",
      shape: "저 + 의 contracts to 제 (my). 우리 needs no particle at all: 우리 가족, 우리 집.",
      usage: "의 is written far less than English writes of. Two nouns simply sit next to each other — 고양이 이름, 강아지 이름 — and the first one owns the second. For my, 제 is the polite form and 내 the casual one.",
      examples: [
        { ko: "제 이름은 민수예요.", en: "My name is Minsu." },
        { ko: "고양이 이름은 나비예요.", en: "The cat's name is Nabi." },
        { ko: "우리 가족은 네 명이에요.", en: "My family has four people." }
      ],
      match: ["제\\s", "[가-힣]의\\s", "우리\\s"]
    },
    {
      id: "instrument-ro",
      form: "로 / 으로",
      name: "with, by means of",
      type: "particle",
      meaning: "The tool used, or the way something is done.",
      shape: "After a vowel or ㄹ it is 로; after any other consonant it is 으로.",
      usage: "칼로 잘라요 — with a knife. 큰 소리로 말해요 — in a loud voice. It also gives direction, but that use belongs to the grade 2 passages.",
      examples: [
        { ko: "칼로 김밥을 잘라요.", en: "We cut the gimbap with a knife." },
        { ko: "우리는 큰 소리로 말하지 않아요.", en: "We do not talk in a loud voice." }
      ],
      match: ["[가-힣]로\\s", "[가-힣]으로"]
    },
    {
      id: "every-mada",
      form: "마다",
      name: "마다 — every",
      type: "particle",
      meaning: "Every one of them, without exception.",
      shape: "Straight onto a time word: 아침마다, 저녁마다, 날마다.",
      usage: "매일 and 아침마다 say much the same thing, but 마다 sticks to whatever noun you like, so you can build 저녁마다 (every evening) the moment you know 저녁.",
      examples: [
        { ko: "아침마다 학교에 가요.", en: "Every morning I go to school." },
        { ko: "저녁마다 저는 콩이하고 산책해요.", en: "Every evening I take a walk with Kongi." }
      ],
      match: ["[가-힣]마다"]
    },

    /* ---------------------------------------------------------------------
       BEING AND HAVING
    --------------------------------------------------------------------- */
    {
      id: "copula-ieyo",
      form: "이에요 / 예요",
      name: "to be (A is B)",
      type: "copula",
      meaning: "Says that one thing is another thing.",
      shape: "A noun ending in a consonant takes 이에요; one ending in a vowel takes 예요.",
      usage: "This is one word with the noun, never a separate verb: 학생이에요, 의사예요. There is no Korean word for a or the, so 학생이에요 is both I am a student and I am the student — context decides.",
      examples: [
        { ko: "저는 학생이에요.", en: "I am a student." },
        { ko: "아버지는 의사예요.", en: "My father is a doctor." },
        { ko: "우산은 파란색이에요.", en: "The umbrella is blue." }
      ],
      match: ["이에요", "예요"]
    },
    {
      id: "itda-eopda",
      form: "있어요 / 없어요",
      name: "there is / there is not",
      type: "copula",
      meaning: "Says that something exists, or that it does not.",
      shape: "The place takes 에 and the thing takes 이/가: 방에 침대가 있어요.",
      usage: "있다 covers both there is and to have: 우리 집에 고양이도 있어요 is equally we have a cat. 없다 is its own word, not 안 있다 — Korean gives the negative its own verb.",
      examples: [
        { ko: "방에 침대가 있어요.", en: "There is a bed in the room." },
        { ko: "공원에 사람이 없어요.", en: "There are no people in the park." },
        { ko: "도서관은 학교 뒤에 있어요.", en: "The library is behind the school." }
      ],
      match: ["있어요", "없어요"]
    },

    /* ---------------------------------------------------------------------
       VERB ENDINGS
    --------------------------------------------------------------------- */
    {
      id: "polite-ayo-eoyo",
      form: "-아요 / -어요",
      name: "The polite present tense",
      type: "ending",
      meaning: "The everyday polite way to end a sentence.",
      shape: "A stem whose last vowel is ㅏ or ㅗ takes -아요; every other stem takes -어요. 하다 verbs become 해요.",
      usage: "This one ending does the work of English's I go, he goes, they are going and even I will go — Korean leaves the person and the number to context. It is also the question form: only the rising voice, or a question mark, tells them apart.",
      examples: [
        { ko: "아침마다 학교에 가요.", en: "Every morning I go to school." },
        { ko: "저는 이야기책을 읽어요.", en: "I read a story book." },
        { ko: "집에 와서 같이 요리해요.", en: "We come home and cook together." }
      ],
      match: ["[가-힣]아요", "[가-힣]어요", "[가-힣]해요", "[가-힣]예요"]
    },
    {
      id: "connect-go",
      form: "-고",
      name: "-고 — and then",
      type: "ending",
      meaning: "Strings two actions together in order.",
      shape: "Straight onto the verb stem, no vowel rule: 하고, 먹고, 타고.",
      usage: "It joins clauses, where 와/과 and 하고 join nouns. 세수를 하고 밥을 먹어요 puts the washing first and the eating second. 버스를 타고 학교에 가요 is the same pattern used for how you travel.",
      examples: [
        { ko: "세수를 하고 밥을 먹어요.", en: "I wash my face and eat a meal." },
        { ko: "버스를 타고 학교에 가요.", en: "I take the bus to school." }
      ],
      /* The lookbehind keeps 그리고, a sentence opener, out of the ending. */
      match: ["(?<!그리)[가-힣]고\\s"]
    },
    {
      id: "connect-aseo",
      form: "-아서 / -어서",
      name: "-아서 / -어서 — and so, and then",
      type: "ending",
      meaning: "One thing leads into the next.",
      shape: "The same vowel rule as -아요/-어요, with 서 in place of 요.",
      usage: "Unlike -고, this ending ties the two halves together: 의자에 앉아서 책을 읽어요 means you sit down and read from that chair, not that you did two unrelated things. 집에 와서 요리해요 — you came home, and that is where the cooking happens.",
      examples: [
        { ko: "저는 의자에 앉아서 책을 읽어요.", en: "I sit on the chair and read a book." },
        { ko: "집에 와서 같이 요리해요.", en: "We come home and cook together." }
      ],
      match: ["[가-힣]아서", "[가-힣]어서", "[가-힣]해서", "와서"]
    },
    {
      id: "negation",
      form: "안 · -지 않아요",
      name: "Saying no",
      type: "ending",
      meaning: "Turns a verb or an adjective into its negative.",
      shape: "안 goes in front of the verb; -지 않아요 goes on the stem. Both mean the same thing.",
      usage: "안 is short and spoken; -지 않아요 is a touch more formal and is what the passages use. With a 하다 verb the 안 slips inside: 공부 안 해요, not 안 공부해요. And remember 있다's negative is the separate word 없다.",
      examples: [
        { ko: "학교는 집에서 멀지 않아요.", en: "The school is not far from my house." },
        { ko: "우리는 큰 소리로 말하지 않아요.", en: "We do not talk in a loud voice." }
      ],
      match: ["지 않", "안 [가-힣]"]
    },
    {
      id: "request-seyo",
      form: "-(으)세요",
      name: "-(으)세요 — please do",
      type: "ending",
      meaning: "A polite instruction or request.",
      shape: "A stem ending in a vowel takes -세요; one ending in a consonant takes -으세요.",
      usage: "This is the ending the instruction line above every passage uses: 알아보세요, 찾아보세요. It is polite rather than bossy, and it is also the respectful way to describe what someone older is doing.",
      examples: [
        { ko: "이야기를 읽고 민수에 대해 알아보세요.", en: "Read the story and find out about Minsu." },
        { ko: "방 안에 무엇이 있는지 찾아보세요.", en: "Find out what is in the room." }
      ],
      match: ["세요"]
    },

    /* ---------------------------------------------------------------------
       PUTTING A CLAUSE IN FRONT OF A NOUN
    --------------------------------------------------------------------- */
    {
      id: "modifier-neun",
      form: "-는 + noun",
      name: "A verb describing a noun",
      type: "modifier",
      meaning: "Turns a whole verb phrase into a description.",
      shape: "-는 onto a verb stem, then the noun: 비 오는 날, 하는 일, 김밥 만드는 순서.",
      usage: "English hangs the description behind the noun — the day it rains. Korean puts it in front, with no relative pronoun at all: 비 오는 날, literally rain-coming day. Getting used to reading forwards from the verb to the noun is most of what makes longer Korean sentences readable.",
      examples: [
        { ko: "비 오는 날도 예뻐요.", en: "A rainy day is pretty too." },
        { ko: "도서관에서 하는 일을 찾아보세요.", en: "Find out what they do at the library." },
        { ko: "김밥 만드는 순서를 찾아보세요.", en: "Follow the order of making gimbap." }
      ],
      match: ["[가-힣]는 [가-힣]", "만드는", "오는"]
    },
    {
      id: "embedded-neunji",
      form: "-는지 · -(으)ㄴ지 · 인지",
      name: "whether, what, how — a question inside a sentence",
      type: "modifier",
      meaning: "Packs a question into the middle of a bigger sentence.",
      shape: "Verbs take -는지, adjectives -(으)ㄴ지, and a noun takes 인지.",
      usage: "English needs two clauses — find out what is in the room. Korean keeps it as one: 무엇이 있는지 찾아보세요. The question word stays where it was and the ending 지 does the joining.",
      examples: [
        { ko: "방 안에 무엇이 있는지 찾아보세요.", en: "Find out what is in the room." },
        { ko: "가족이 몇 명인지 알아보세요.", en: "Find out how many people are in the family." },
        { ko: "오늘 날씨가 어떤지 알아보세요.", en: "Find out what the weather is like today." }
      ],
      match: ["는지", "ㄴ지", "인지", "어떤지"]
    },

    /* ---------------------------------------------------------------------
       PATTERNS WORTH LEARNING WHOLE
    --------------------------------------------------------------------- */
    {
      id: "counters",
      form: "number + counter",
      name: "Counting things",
      type: "pattern",
      meaning: "How many of something there are.",
      shape: "Noun, then number, then counter: 책을 두 권, 고양이도 한 마리. 하나·둘·셋·넷 shorten to 한·두·세·네 in front of the counter.",
      usage: "You cannot say 두 책 — every countable noun needs its counter: 권 for books, 마리 for animals, 명 for people, 개 for everything else, 살 for age, 시 for the hour and 분 for the minute. Hours use the native numbers (일곱 시) and minutes the Sino-Korean ones (삼십 분), which is why 여덟 시 삼십 분 mixes the two sets in one phrase.",
      examples: [
        { ko: "도서관에서 책을 세 권 빌려요.", en: "At the library I borrow three books." },
        { ko: "우리 가족은 네 명이에요.", en: "My family has four people." },
        { ko: "여덟 시 삼십 분에 교실에 도착해요.", en: "I arrive at the classroom at eight thirty." }
      ],
      match: ["[한두세네] [가-힣]", "[가-힣] 권", "[가-힣] 마리", "[가-힣] 명", "[가-힣] 살", "[가-힣] 시", "[가-힣] 개"]
    },
    {
      id: "joahada",
      form: "좋아요 vs 좋아해요",
      name: "Liking something two ways",
      type: "pattern",
      meaning: "Two verbs that both come out as like in English.",
      shape: "좋다 is an adjective and takes 이/가. 좋아하다 is a verb and takes 을/를.",
      usage: "저는 학교가 좋아요 says school is good to me. 저는 책을 좋아해요 says I like books. Both translate as like, but the particle has to match the verb you chose, and mixing them up is the single most common beginner slip in these passages.",
      examples: [
        { ko: "저는 책을 좋아해요.", en: "I like books." },
        { ko: "저는 학교가 좋아요.", en: "I like school." }
      ],
      match: ["좋아해요", "좋아요"]
    },
    {
      id: "word-order",
      form: "Subject — object — verb",
      name: "Where the verb goes",
      type: "pattern",
      meaning: "The verb comes last, always.",
      shape: "저는 (who) 책을 (what) 좋아해요 (verb).",
      usage: "Because the particles say what each noun is doing, the nouns can be shuffled, and anything obvious can be left out entirely — most of these passages never repeat 저는 after the first line. The one thing that cannot move is the verb: it ends the sentence.",
      examples: [
        { ko: "학교에서 친구를 만나요.", en: "At school I meet my friends." },
        { ko: "가방에 책과 연필을 넣어요.", en: "I put books and pencils in my bag." }
      ],
      match: ["[가-힣]"]
    },
    {
      id: "connectors",
      form: "그리고 · 하지만 · 그래서",
      name: "Joining two sentences",
      type: "pattern",
      meaning: "Words that start the next sentence and link it to the last.",
      shape: "They open a sentence, and take no particle.",
      usage: "그리고 adds (and then), 하지만 contrasts (but), 그래서 draws a consequence (so). Korean uses them at the head of a new sentence far more readily than English does, which is why so many of these passages have a line beginning 그리고.",
      examples: [
        { ko: "그리고 김 위에 밥을 놓아요.", en: "Then we put the rice on the seaweed." },
        { ko: "하지만 아주 깨끗해요.", en: "But it is very clean." }
      ],
      match: ["그리고", "하지만", "그래서"]
    },
    {
      id: "question-words",
      form: "무엇 / 뭐 · 몇 · 어떤 · 누구 · 어디",
      name: "Question words",
      type: "pattern",
      meaning: "The words that ask what, how many, which, who, and where.",
      shape: "They sit where the answer would sit — Korean never moves them to the front.",
      usage: "주말에 뭐 해요? keeps 뭐 in the object's place, exactly where 책을 would go in the answer. 몇 always comes in front of a counter: 몇 명, 몇 시. 뭐 is simply the spoken short form of 무엇.",
      examples: [
        { ko: "주말에 뭐 해요?", en: "What do you do on the weekend?" },
        { ko: "민수는 몇 살이에요?", en: "How old is Minsu?" },
        { ko: "민수는 학교에서 누구를 만나요?", en: "Whom does Minsu meet at school?" }
      ],
      match: ["무엇", "뭐", "몇", "어떤", "누구", "어디"]
    }
  ];

  const TYPE_DEFS = [
    { id: "particle", label: "조사 · Particles", note: "The tags that go on a noun and say what it is doing in the sentence. Korean leans on these where English leans on word order." },
    { id: "copula", label: "이다와 있다 · Being and having", note: "The two ways Korean says that something is: 이에요/예요 for A is B, and 있어요/없어요 for there is and there is not." },
    { id: "ending", label: "어미 · Verb endings", note: "What goes on the end of a verb stem: the polite present, the joining endings, negation, and requests." },
    { id: "modifier", label: "꾸미는 말 · Clauses in front of a noun", note: "Korean builds its descriptions in front of the noun, with no word for that or which. These are the shapes that do it." },
    { id: "pattern", label: "문장 만들기 · Sentence patterns", note: "Whole shapes worth learning as one piece, rather than as separate words." }
  ];

  /* =========================================================================
     BANK FACTORY
     A grammar bank is a point list plus the type buckets it is shown in, and a
     matcher that decides which stories use each point. Grade 2 calls this with
     its own points on top of these, so nothing is written twice.
  ========================================================================= */
  function buildBank(points, typeDefs) {
    const compiled = points.map(point => ({
      point: point,
      tests: (point.match || []).map(source => new RegExp(source))
    }));
    const byId = new Map(points.map(point => [point.id, point]));

    const types = (typeDefs || []).map(type => ({
      id: type.id,
      label: type.label,
      note: type.note,
      ids: points.filter(point => point.type === type.id).map(point => point.id)
    })).filter(type => type.ids.length);

    points.forEach(point => {
      const type = types.find(candidate => candidate.id === point.type);
      point.typeLabel = type ? type.label : point.type;
    });

    /* A story uses a point when any of the point's patterns matches any of its
       Korean lines. One point can belong to all ten stories, which is the whole
       reason membership is computed rather than stored. */
    function pointsUsedIn(lines) {
      const hay = lines.join("\n");
      return compiled.filter(item => item.tests.some(test => test.test(hay))).map(item => item.point);
    }

    return {
      POINTS: points,
      TYPES: types,
      get: id => byId.get(String(id || "")) || null,
      pointsUsedIn: pointsUsedIn,
      count: points.length
    };
  }

  global.ReadingGrammar = Object.assign({
    VERSION: "1.0.0",
    POINT_DEFS: POINTS,
    TYPE_DEFS: TYPE_DEFS,
    buildBank: buildBank,
    romanize: global.ReadingVocab ? global.ReadingVocab.romanize : (text => text)
  }, buildBank(POINTS, TYPE_DEFS));
})(window);
