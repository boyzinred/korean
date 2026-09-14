/*
  reading-grammar-2.js
  ----------------------------------------------------------------------------
  Grammar bank for the KOREAN READING COMPREHENSION section, grade 2.

  The grade 2 passages are told in the past tense, quote people talking, and
  stack endings on top of one another. Everything new to that is here. The
  grade 1 points are loaded underneath and kept, because the passages still run
  on 은/는, 을/를, 에 and the rest — a reader needs the whole set in one place.

  Field shapes are identical to reading-grammar.js. Story membership is again
  worked out by matching each point's patterns against a story's lines, so a
  point used by seven passages is listed under all seven.
*/
(function (global) {
  "use strict";

  const POINTS = [
    /* ---------------------------------------------------------------------
       TENSE — the one change that runs through every grade 2 passage
    --------------------------------------------------------------------- */
    {
      id: "g2-past",
      form: "-았어요 / -었어요",
      name: "The past tense",
      type: "tense",
      meaning: "Says that it already happened.",
      shape: "A stem whose last vowel is ㅏ or ㅗ takes -았어요; every other stem takes -었어요. 하다 becomes 했어요.",
      usage: "Take the polite present you already know, and swap 요 for ㅆ어요: 가요 → 갔어요, 먹어요 → 먹었어요, 해요 → 했어요. Every one of these passages is a story being told afterwards, so this ending is on nearly every line. It also does English's have done — Korean has no separate perfect tense.",
      examples: [
        { ko: "수아가 대문을 열었어요.", en: "Sua opened the front gate." },
        { ko: "우리는 양념을 만들었어요.", en: "We made the seasoning." },
        { ko: "저는 열심히 달렸어요.", en: "I ran as hard as I could." }
      ],
      match: ["았어요", "었어요", "했어요", "였어요", "됐어요"]
    },
    {
      id: "g2-past-copula",
      form: "이었어요 / 였어요",
      name: "was, were",
      type: "tense",
      meaning: "The past of 이에요/예요.",
      shape: "A noun ending in a consonant takes 이었어요; one ending in a vowel takes 였어요.",
      usage: "토요일 아침이었어요 opens a story the way English opens with it was Saturday morning. The negative past is 아니었어요, and 있다's past is the separate-looking 있었어요.",
      examples: [
        { ko: "토요일 아침이었어요.", en: "It was Saturday morning." },
        { ko: "마지막 경기는 이어달리기였어요.", en: "The last event was the relay race." },
        { ko: "세종은 조선의 네 번째 임금이었어요.", en: "Sejong was the fourth king of Joseon." }
      ],
      match: ["이었어요", "였어요", "있었어요"]
    },
    {
      id: "g2-future-geoyeyo",
      form: "-(으)ㄹ 거예요 / 거야",
      name: "will, going to",
      type: "tense",
      meaning: "Something that has not happened yet.",
      shape: "-ㄹ 거예요 after a vowel, -을 거예요 after a consonant. 거야 is the casual version.",
      usage: "거 is really 것, thing, so the shape is literally it is a thing that will happen. The passages use the casual 거야 inside quoted speech between family members and 거예요 when a child speaks politely.",
      examples: [
        { ko: "\"이 김치를 겨울 내내 먹을 거야.\"", en: "\"We will eat this kimchi all winter long.\"" },
        { ko: "\"이따가 눈사람도 만들 거예요!\"", en: "\"We are going to make a snowman later too!\"" }
      ],
      match: ["거예요", "거야"]
    },

    /* ---------------------------------------------------------------------
       ABILITY, WANTING, AND HAVING TO
    --------------------------------------------------------------------- */
    {
      id: "g2-su-itda",
      form: "-(으)ㄹ 수 있다 / 없다",
      name: "can, cannot",
      type: "pattern",
      meaning: "Whether something is possible.",
      shape: "-ㄹ 수 있어요 after a vowel, -을 수 있어요 after a consonant. 없어요 makes it cannot.",
      usage: "수 is a bound noun meaning the possibility, so the phrase is literally there is a way to do it. 할 수 있어! is what Jiho's friends shout at him, and 탈 수 있게 되었어요 — literally it became so that I could ride — is how Korean says I finally managed it.",
      examples: [
        { ko: "\"할 수 있어!\"", en: "\"You can do it!\"" },
        { ko: "백성이 쉽게 배울 수 있는 글자가 필요해.", en: "The people need letters they can learn easily." },
        { ko: "저는 드디어 자전거를 탈 수 있게 되었어요.", en: "At last I could ride a bicycle." }
      ],
      match: ["수 있", "수 없"]
    },
    {
      id: "g2-jul-alda",
      form: "-(으)ㄹ 줄 알다 / 모르다",
      name: "to know how to",
      type: "pattern",
      meaning: "Whether you have the skill, not whether it is possible.",
      shape: "-ㄹ 줄 알아요 / 몰라요 after a vowel, -을 줄 after a consonant.",
      usage: "Easy to mix up with -(으)ㄹ 수 있다. 탈 수 없어요 means riding is out of the question — perhaps the bicycle is broken. 탈 줄 몰랐어요 means the bicycle was fine and the rider had not learned yet, which is exactly the point of that passage.",
      examples: [
        { ko: "저는 자전거를 탈 줄 몰랐어요.", en: "I did not know how to ride a bicycle." }
      ],
      match: ["줄 알", "줄 몰"]
    },
    {
      id: "g2-go-sipda",
      form: "-고 싶다",
      name: "to want to",
      type: "pattern",
      meaning: "What the speaker would like to do.",
      shape: "-고 싶어요 onto the verb stem. In the past, -고 싶었어요.",
      usage: "싶다 never stands on its own — it always sits behind -고. Careful with the person: in a plain statement Korean reserves -고 싶다 for I and you, and uses -고 싶어하다 when talking about somebody else.",
      examples: [
        { ko: "저는 그만하고 싶었어요.", en: "I wanted to stop." },
        { ko: "내년에 또 가고 싶어요.", en: "I want to go again next year." }
      ],
      match: ["고 싶"]
    },
    {
      id: "g2-eoya-hada",
      form: "-아야 / -어야 하다",
      name: "must, have to",
      type: "pattern",
      meaning: "Something there is no way around.",
      shape: "Same vowel rule as -아요/-어요, then 야 하다 or 야 되다.",
      usage: "기다려야 해 is grandmother saying we have to wait. The casual 해 at the end is the same 하다 you know, just without 요. The related -아야지 / -어야지 is the version you say to yourself: 쉬어야지, I had better rest.",
      examples: [
        { ko: "\"배추가 부드러워질 때까지 기다려야 해.\"", en: "\"We have to wait until the cabbage goes soft.\"" },
        { ko: "\"시간이 많아. 조금 쉬어야지.\"", en: "\"I have plenty of time. I will rest a little.\"" }
      ],
      match: ["야 해", "야 하", "야 되", "어야지", "아야지"]
    },

    /* ---------------------------------------------------------------------
       JOINING CLAUSES
    --------------------------------------------------------------------- */
    {
      id: "g2-eul-ttae",
      form: "-(으)ㄹ 때",
      name: "when",
      type: "modifier",
      meaning: "Names the moment something else happened.",
      shape: "-ㄹ 때 after a vowel, -을 때 after a consonant. For a moment already past, -았/었을 때.",
      usage: "때 is the noun time, so this is another clause-in-front-of-a-noun. 제 차례가 되었을 때 is when my turn came — the 었 makes the turn already arrived, while a plain 때 leaves it general.",
      examples: [
        { ko: "제 차례가 되었을 때 우리 반은 삼 등이었어요.", en: "When my turn came, our class was in third place." },
        { ko: "토끼가 눈을 떴을 때 해가 낮아져 있었어요.", en: "When the rabbit opened his eyes, the sun was already low." }
      ],
      match: ["ㄹ 때", "을 때", "울 때", "었을 때", "때 [가-힣]"]
    },
    {
      id: "g2-gi-jeone",
      form: "-기 전에 · -(으)ㄴ 후에",
      name: "before and after",
      type: "pattern",
      meaning: "Puts two events in order.",
      shape: "-기 전에 for before; 후에 follows a noun or -(으)ㄴ. 때까지 is until.",
      usage: "Note that 전에 always takes -기, never the past tense, no matter when the story happens: 겨울이 오기 전에 works for last year as easily as for next. 잠시 후에 — a moment later — opens three of these passages' turning points.",
      examples: [
        { ko: "겨울이 오기 전에 우리 가족은 김치를 담가요.", en: "Before winter comes, our family makes kimchi." },
        { ko: "잠시 후에 아버지가 돌아왔어요.", en: "A moment later her father came back." },
        { ko: "몇 시간 후에 우리는 양념을 만들었어요.", en: "A few hours later we made the seasoning." }
      ],
      match: ["기 전에", "후에", "때까지"]
    },
    {
      id: "g2-myeon",
      form: "-(으)면",
      name: "if, when",
      type: "ending",
      meaning: "Sets a condition.",
      shape: "-면 after a vowel, -으면 after a consonant.",
      usage: "Korean does not distinguish if from whenever here — 눈이 오면 covers both if it snows and when it snows. 라면 on a noun does the same job for a person: 수아라면, if it were Sua.",
      examples: [
        { ko: "눈이 오면 어떤 기분일지 생각하면서 읽어 보세요.", en: "Think about how you would feel if it snowed." },
        { ko: "\"떡 하나 주면 안 잡아먹지.\"", en: "\"Give me one rice cake and I will not eat you.\"" }
      ],
      match: ["[가-힣]면\\s", "[가-힣]으면", "라면"]
    },
    {
      id: "g2-myeonseo",
      form: "-(으)면서",
      name: "while, as",
      type: "ending",
      meaning: "Two things done at the same time by the same person.",
      shape: "-면서 after a vowel, -으면서 after a consonant.",
      usage: "The instruction line above every grade 2 passage uses it: 생각하면서 읽어 보세요, read while thinking. The catch is that both halves must have the same subject — for two different people doing things at once you need a different shape.",
      examples: [
        { ko: "생각하면서 읽어 보세요.", en: "Read while thinking about it." },
        { ko: "다른 옛날이야기와 비교하면서 읽어 보세요.", en: "Read it while comparing it with other folk tales." }
      ],
      match: ["면서"]
    },
    {
      id: "g2-jiman",
      form: "-지만",
      name: "-지만 — but",
      type: "ending",
      meaning: "Contrasts the two halves of one sentence.",
      shape: "Straight onto the stem, with no vowel rule: 맵지만, 늦었지만.",
      usage: "하지만 starts a new sentence; -지만 keeps it as one. Tense goes in front of it: 늦었지만 is it was late, but. 맵지만 맛있었어요 is the whole of kimchi in three words.",
      examples: [
        { ko: "맵지만 정말 맛있었어요.", en: "It was spicy, but really delicious." },
        { ko: "\"조금 늦었지만 찾아서 다행이야.\"", en: "\"It is a little late, but I am glad you found it.\"" },
        { ko: "저는 상을 받지 못했지만 아주 자랑스러웠어요.", en: "I did not get a prize, but I felt very proud." }
      ],
      match: ["지만"]
    },
    {
      id: "g2-euro-gada",
      form: "-(으)러 가다 · -(으)려고",
      name: "in order to",
      type: "pattern",
      meaning: "Why you went, or what you were trying to do.",
      shape: "-(으)러 only goes with a verb of movement. -(으)려고 goes with any verb at all.",
      usage: "먹으러 돌아와 — come back in order to eat — needs 러 because 돌아오다 is movement. 돌려주려고 가방을 열었어요 uses 려고 because opening a bag is not going anywhere.",
      examples: [
        { ko: "\"아침 먹으러 곧 돌아와.\"", en: "\"Come back soon for breakfast.\"" },
        { ko: "책을 돌려주려고 가방을 열었어요.", en: "I opened my bag to return the books." }
      ],
      match: ["으러", "[가-힣]러 ", "려고"]
    },

    /* ---------------------------------------------------------------------
       ENDINGS STACKED ON A VERB
    --------------------------------------------------------------------- */
    {
      id: "g2-eo-juda",
      form: "-아 / -어 주다",
      name: "doing it for somebody",
      type: "pattern",
      meaning: "The action is a favour to someone else.",
      shape: "Same vowel rule as -아요/-어요, then 주다. Honorific: 주시다 → 주셨어요.",
      usage: "잡다 is to hold; 잡아 주셨어요 is he held it for me. Leaving 주다 off is not wrong, but it drops the whole sense of kindness that these passages turn on. 살려 주세요 — please save us — is the same shape as a request.",
      examples: [
        { ko: "아버지께서 자전거를 잡아 주셨어요.", en: "My father held the bicycle for me." },
        { ko: "친구들이 저를 안아 주었어요.", en: "My friends hugged me." },
        { ko: "\"하늘님, 저희를 살려 주세요.\"", en: "\"Heaven, please save us.\"" }
      ],
      match: ["아 주", "어 주", "려 주", "와 주", "해 주"]
    },
    {
      id: "g2-eo-boda",
      form: "-아 / -어 보다",
      name: "giving it a try",
      type: "pattern",
      meaning: "Doing something to see what happens.",
      shape: "Same vowel rule as -아요/-어요, then 보다.",
      usage: "먹어 보았어요 is not I saw the food — it is I tried it. 읽어 보세요 softens the instruction from read this to have a read. 전화해 볼게 is I will give them a ring.",
      examples: [
        { ko: "저는 김치 한 조각을 먹어 보았어요.", en: "I tasted one piece of the kimchi." },
        { ko: "\"동물 센터에 전화해 볼게.\"", en: "\"I will call the animal centre.\"" },
        { ko: "\"한 번만 더 해 볼래요.\"", en: "\"I want to try just one more time.\"" }
      ],
      match: ["아 보", "어 보", "해 보", "워 보"]
    },
    {
      id: "g2-eojida",
      form: "-아 / -어지다",
      name: "becoming",
      type: "pattern",
      meaning: "A state that changes rather than one that simply is.",
      shape: "Same vowel rule as -아요/-어요, then 지다.",
      usage: "부드럽다 is to be soft; 부드러워지다 is to go soft. 낮다 is to be low; 낮아지다 is to get lower, which is what the sun does while the rabbit sleeps. Watch out for 지다 verbs that have set solid: 떨어지다 (to fall) and 미끄러지다 (to slip) are now simply their own words.",
      examples: [
        { ko: "배추가 부드러워질 때까지 기다려야 해.", en: "We have to wait until the cabbage goes soft." },
        { ko: "해가 낮아져 있었어요.", en: "The sun was already low." },
        { ko: "\"둥지에서 떨어진 것 같구나.\"", en: "\"It seems to have fallen from its nest.\"" }
      ],
      match: ["어지", "아지", "워지", "려지", "어졌", "아졌"]
    },
    {
      id: "g2-ge",
      form: "-게",
      name: "-게 — turning a describing word into an adverb",
      type: "ending",
      meaning: "Says how something was done.",
      shape: "Straight onto the adjective stem: 쉽게, 하얗게, 빨갛게.",
      usage: "English adds -ly; Korean adds -게. It is regular enough that any describing word you know becomes an adverb on the spot. Note that 빨리 (from 빠르다) and 천천히 are old irregulars that never took -게.",
      examples: [
        { ko: "백성이 쉽게 배울 수 있는 글자가 필요해.", en: "The people need letters they can learn easily." },
        { ko: "마당의 자전거도 하얗게 변했어요.", en: "Even the bicycle in the yard had turned white." },
        { ko: "제 손도 빨갛게 변했어요.", en: "My hands turned red too." }
      ],
      match: ["쉽게", "하얗게", "빨갛게", "[가-힣]게 [가-힣]"]
    },

    /* ---------------------------------------------------------------------
       RESPECT
    --------------------------------------------------------------------- */
    {
      id: "g2-honorific-si",
      form: "-(으)시- · 께서",
      name: "The respect forms",
      type: "honorific",
      meaning: "Marks that the person doing the verb deserves respect.",
      shape: "-시- goes inside the verb, before the tense: 하시다 → 하셨어요. 께서 replaces 이/가 on the subject, and 께 replaces 에게.",
      usage: "Two things move at once. The subject swaps 이/가 for 께서 — 할머니께서, 어머니께서 — and the verb takes -시-: 말씀하셨어요, 주셨어요, 물으셨어요. A few verbs have their own respect word instead: 있다 becomes 계시다 and 말하다 becomes 말씀하시다. Korean children use all of this about their parents and grandparents as a matter of course.",
      examples: [
        { ko: "할머니께서 말씀하셨어요.", en: "My grandmother said." },
        { ko: "아버지께서 사진을 많이 찍으셨어요.", en: "My father took a lot of photographs." },
        { ko: "아버지는 멀리 서 계셨어요.", en: "My father was standing far away." }
      ],
      match: ["께서", "셨어요", "계시", "말씀", "으세요"]
    },

    /* ---------------------------------------------------------------------
       QUOTING, NAMING, COMPARING
    --------------------------------------------------------------------- */
    {
      id: "g2-irago-hada",
      form: "-(이)라고 하다 · -(이)라는",
      name: "to be called",
      type: "pattern",
      meaning: "Gives something its name, or reports what was said.",
      shape: "라고 after a vowel, 이라고 after a consonant. 라는 is its modifier form, used in front of a noun.",
      usage: "이것을 김장이라고 해요 is literally we call this thing gimjang — the standard way to introduce a term. 라는 puts the name in front of the noun: '바른 소리'라는 뜻이에요, a meaning called the correct sounds.",
      examples: [
        { ko: "이것을 김장이라고 해요.", en: "This is called gimjang." },
        { ko: "우리는 이 글자를 한글이라고 불러요.", en: "We call these letters Hangeul." },
        { ko: "'백성을 가르치는 바른 소리'라는 뜻이에요.", en: "It means \"the correct sounds for teaching the people\"." }
      ],
      match: ["라고", "라는"]
    },
    {
      id: "g2-dago",
      form: "-다고 · -(느)ㄴ다고",
      name: "reporting what somebody said or thought",
      type: "pattern",
      meaning: "Passes on somebody else's words without quoting them.",
      shape: "An adjective takes -다고; a verb takes -ㄴ다고 or -는다고.",
      usage: "자기가 제일 빠르다고 자랑했어요 is he boasted that he was the fastest. Korean reports the words in their plain form and lets 고 do the joining, where English needs a whole that-clause.",
      examples: [
        { ko: "토끼는 자기가 제일 빠르다고 자랑했어요.", en: "The rabbit boasted that he was the fastest." }
      ],
      match: ["다고"]
    },
    {
      id: "g2-comparison",
      form: "보다 · 처럼 · 만큼 · 가장 / 제일",
      name: "Comparing things",
      type: "pattern",
      meaning: "More than, like, as much as, and the most.",
      shape: "All four attach straight to the noun. 에서 marks the group you are comparing within.",
      usage: "나보다 빠른 동물 is an animal faster than me — 보다 goes on the thing being beaten, the opposite of English's word order. 지호처럼 is like Jiho. 눈 오는 날만큼 좋은 날 is a day as good as a snowy day. For the top of the heap, 가장 and 제일 mean the same thing, and the group takes 에서: 한국에서 가장 큰 섬.",
      examples: [
        { ko: "\"나보다 빠른 동물은 없어!\"", en: "\"No animal is faster than me!\"" },
        { ko: "제주도는 한국에서 가장 큰 섬이에요.", en: "Jeju is the largest island in Korea." },
        { ko: "\"눈 오는 날만큼 좋은 날은 없지.\"", en: "\"There is nothing like a snowy day.\"" }
      ],
      match: ["보다", "처럼", "만큼", "가장", "제일"]
    },
    {
      id: "g2-geot-gatda",
      form: "-(으)ㄴ 것 같다",
      name: "it seems, it looks like",
      type: "pattern",
      meaning: "A guess rather than a fact.",
      shape: "The modifier form of the verb, then 것 같다. 같구나 and 같았어요 are its exclamatory and past versions.",
      usage: "Koreans reach for this constantly, and it softens a statement the way English's I think does. 떨어진 것 같구나 is the father guessing aloud; 쓴 것 같았어요 is a child saying the snow-covered trees looked as if they were wearing hats.",
      examples: [
        { ko: "\"둥지에서 떨어진 것 같구나.\"", en: "\"It seems to have fallen from its nest.\"" },
        { ko: "나무들은 하얀 모자를 쓴 것 같았어요.", en: "The trees looked as if they were wearing white hats." }
      ],
      match: ["것 같", "거 같"]
    },

    /* ---------------------------------------------------------------------
       SPEAKING — the styles inside the quotation marks
    --------------------------------------------------------------------- */
    {
      id: "g2-casual",
      form: "반말 — the casual style",
      name: "Talking without 요",
      type: "honorific",
      meaning: "How family and close friends speak to each other.",
      shape: "Drop the 요: 했어요 → 했어, 있어요 → 있어, 가요 → 가. 아니에요 → 아니야.",
      usage: "Watch who is speaking. Parents use it to their children and children to each other — \"우리가 잘했어\", \"할 수 있어!\" — while the same children answer politely with 요. Getting this the wrong way round is rude, so read the quotation marks carefully.",
      examples: [
        { ko: "\"우리가 잘했어.\"", en: "\"We did the right thing.\"" },
        { ko: "\"저건 엄마가 아니야!\"", en: "\"That is not Mother!\"" },
        { ko: "\"내 목도리 어디 있어?\"", en: "\"Where is my scarf?\"" }
      ],
      match: ["어요\\?", "\"[^\"]*[가-힣]어\\.", "아니야", "다행이야", "있어\\?", "있어!"]
    },
    {
      id: "g2-commands",
      form: "-아라 / -어라 · -지 마",
      name: "Telling somebody to do, or not do, something",
      type: "ending",
      meaning: "A direct order, without 요.",
      shape: "-아라/-어라 orders; -지 마 forbids. The polite versions are -(으)세요 and -지 마세요.",
      usage: "문을 열어라 is the tiger pretending to be a parent — the ending only works downwards, to a child or a close junior. 보지 마 is the negative: verb stem, 지, then 마.",
      examples: [
        { ko: "\"얘들아, 엄마다. 문을 열어라.\"", en: "\"Children, it is Mother. Open the door.\"" },
        { ko: "\"앞을 봐. 뒤를 보지 마.\"", en: "\"Look ahead. Do not look back.\"" }
      ],
      match: ["어라", "아라", "지 마", "[가-힣]봐\\.", "일어나!"]
    },
    {
      id: "g2-ulge-ullae",
      form: "-(으)ㄹ게 · -(으)ㄹ래",
      name: "I will · shall we?",
      type: "ending",
      meaning: "A promise you make, or an invitation you offer.",
      shape: "-ㄹ게(요) and -ㄹ래(요) after a vowel; -을게(요) and -을래(요) after a consonant.",
      usage: "-(으)ㄹ게 is a promise to the person you are speaking to: 전화해 볼게, I will ring them. -(으)ㄹ래 asks or offers: 내기 할래? is will you take the bet, and 해 볼래요 is I would like to try. Neither is just the future — 거예요 does that.",
      examples: [
        { ko: "\"동물 센터에 전화해 볼게.\"", en: "\"I will call the animal centre.\"" },
        { ko: "\"나하고 내기 할래?\"", en: "\"Will you race me?\"" },
        { ko: "\"한 번만 더 해 볼래요.\"", en: "\"I want to try just one more time.\"" }
      ],
      match: ["ㄹ게", "을게", "볼게", "ㄹ래", "할래", "볼래"]
    },
    {
      id: "g2-ne-guna",
      form: "-네요 · -구나",
      name: "Noticing something out loud",
      type: "ending",
      meaning: "A reaction to something you have only just realised.",
      shape: "-네요 politely, -구나 casually. -구나 often follows 것 같다.",
      usage: "Neither of these adds information — they add the speaker's surprise. 같구나 is the father working it out as he looks at the bird, and it is why the line reads as thinking aloud rather than as a verdict.",
      examples: [
        { ko: "\"둥지에서 떨어진 것 같구나.\"", en: "\"It seems to have fallen from its nest.\"" }
      ],
      match: ["구나", "네요"]
    },

    /* ---------------------------------------------------------------------
       MODIFIERS AND THE REST
    --------------------------------------------------------------------- */
    {
      id: "g2-modifiers-three",
      form: "-(으)ㄴ · -는 · -(으)ㄹ + noun",
      name: "Past, present, and future in front of a noun",
      type: "modifier",
      meaning: "Three endings that put a whole clause in front of a noun, one per tense.",
      shape: "A verb takes -(으)ㄴ for the past, -는 for now, and -(으)ㄹ for what is still to come. An adjective uses -(으)ㄴ for its plain description.",
      usage: "떨어진 새 is a bird that has fallen, 오는 길 is the road while you are coming along it, 썰매 탈 곳 is a place to sled in future. Adjectives use the same -(으)ㄴ shape with no past meaning at all: 빠른 토끼, 하얀 모자, 높은 산.",
      examples: [
        { ko: "어머니가 집에 오는 길에 호랑이를 만났어요.", en: "On her way home the mother met a tiger." },
        { ko: "\"썰매 탈 곳을 찾았어요!\"", en: "\"We found a place to sled!\"" },
        { ko: "옛날에 아주 빠른 토끼가 있었어요.", en: "Long ago there was a very fast rabbit." }
      ],
      match: ["는 [가-힣]", "[운은른한긴]\\s[가-힣]", "빠른", "하얀", "높은", "굵은", "느린", "탈 곳"]
    },
    {
      id: "g2-gi-noun",
      form: "-기",
      name: "-기 — turning a verb into a noun",
      type: "modifier",
      meaning: "Makes a verb usable as the name of an activity.",
      shape: "Straight onto the stem: 배우다 → 배우기, 달리다 → 달리기.",
      usage: "배우기 쉬웠어요 is it was easy to learn. The same ending builds the names of sports and activities outright: 달리기 is running, and 이어달리기 — joined-up running — is the relay race.",
      examples: [
        { ko: "새 글자는 배우기 아주 쉬웠어요.", en: "The new letters were very easy to learn." },
        { ko: "마지막 경기는 이어달리기였어요.", en: "The last event was the relay race." },
        { ko: "호랑이도 나무 위로 올라오기 시작했어요.", en: "The tiger began to climb the tree too." }
      ],
      match: ["배우기", "달리기", "오기", "[가-힣]기 [쉬어시]"]
    },
    {
      id: "g2-mothada",
      form: "못 · -지 못하다",
      name: "The other negative: could not",
      type: "ending",
      meaning: "Not because you chose not to, but because you could not.",
      shape: "못 in front of the verb, or -지 못하다 on its stem.",
      usage: "This is the difference between 안 읽었어요, I did not read it, and 읽지 못했어요, I could not read it. The Sejong passage turns on exactly that: the common people were willing, and the writing was too hard.",
      examples: [
        { ko: "많은 백성이 글을 읽지 못했어요.", en: "Many of the common people could not read." },
        { ko: "저는 상을 받지 못했지만 아주 자랑스러웠어요.", en: "I did not get a prize, but I felt very proud." }
      ],
      match: ["못했", "못해", "못 [가-힣]"]
    },
    {
      id: "g2-deul",
      form: "-들",
      name: "-들 — more than one",
      type: "particle",
      meaning: "Marks a noun as plural.",
      shape: "Onto the noun, in front of any particle: 학생들이, 친구들의, 아이들은.",
      usage: "Korean only bothers with 들 when the plural actually matters, and leaves it off the rest of the time — 책 can be one book or a shelf of them. It is used most readily with people: 학생들, 친구들, 백성들.",
      examples: [
        { ko: "운동장에 학생들이 모두 모였어요.", en: "All the students gathered on the field." },
        { ko: "그때 친구들의 목소리가 들렸어요.", en: "Just then I heard my friends' voices." },
        { ko: "나무들은 하얀 모자를 쓴 것 같았어요.", en: "The trees looked as if they were wearing white hats." }
      ],
      match: ["들이", "들은", "들의", "들도", "들과", "들을"]
    },
    {
      id: "g2-mane",
      form: "만에 · 내내 · 부터 · 까지",
      name: "Marking a stretch of time",
      type: "particle",
      meaning: "Within, throughout, from, and until.",
      shape: "All four go straight onto the time word.",
      usage: "만에 measures how little time it took: 한 시간 만에 도착했어요, we arrived in just an hour. 내내 is the opposite, the whole stretch: 겨울 내내. 부터 starts it and 까지 ends it — 아침부터, 끝까지.",
      examples: [
        { ko: "우리는 비행기를 타고 한 시간 만에 도착했어요.", en: "We took a plane and arrived in just one hour." },
        { ko: "아침부터 하늘이 아주 맑았어요.", en: "The sky was very clear from the morning." },
        { ko: "\"이 김치를 겨울 내내 먹을 거야.\"", en: "\"We will eat this kimchi all winter long.\"" }
      ],
      match: ["만에", "내내", "부터", "까지"]
    },
    {
      id: "g2-euro-direction",
      form: "(으)로 — towards",
      name: "(으)로 as a direction",
      type: "particle",
      meaning: "Which way something moved.",
      shape: "로 after a vowel or ㄹ, 으로 after any other consonant.",
      usage: "In grade 1 this particle was the tool you used something with. Here it points: 마당으로 나왔어요, 집으로 들어가서, 나뭇가지로 날아갔어요. Unlike 에, it stresses the direction taken rather than the destination reached.",
      examples: [
        { ko: "부모님이 마당으로 나왔어요.", en: "Her parents came out to the yard." },
        { ko: "두 마리가 함께 나뭇가지로 날아갔어요.", en: "The two of them flew away together to a tree branch." },
        { ko: "오누이는 뒷문으로 도망갔어요.", en: "The brother and sister ran away through the back door." }
      ],
      match: ["으로", "[가-힣]로 [가-힣]"]
    },
    {
      id: "g2-connectors",
      form: "그래서 · 그런데 · 그다음에 · 왜냐하면",
      name: "Connecting one sentence to the next",
      type: "pattern",
      meaning: "So, but, after that, and because.",
      shape: "They open a sentence and take no particle.",
      usage: "그래서 draws the consequence, 그런데 turns the story — and it is the word that marks the moment something goes wrong in four of these passages. 그다음에 orders the steps of a recipe. 왜냐하면 introduces the reason, and its sentence usually ends in 때문이에요.",
      examples: [
        { ko: "그래서 많은 백성이 글을 읽지 못했어요.", en: "So many of the common people could not read." },
        { ko: "그런데 갑자기 발이 미끄러져서 넘어졌어요.", en: "But suddenly my foot slipped and I fell over." },
        { ko: "그다음에 배추 잎 사이사이에 양념을 발랐어요.", en: "After that we spread the seasoning between the cabbage leaves." }
      ],
      match: ["그래서", "그런데", "그다음", "왜냐하면"]
    }
  ];

  const TYPE_DEFS = [
    { id: "tense", label: "시제 · Tense", note: "The grade 2 passages are stories already over, so the past tense runs through all of them. The future turns up inside quoted speech." },
    { id: "honorific", label: "높임말과 반말 · Respect and casual speech", note: "Who is speaking to whom decides the ending. Children speak politely to adults, adults casually to children, and a grandmother's actions take the respect forms." },
    { id: "particle", label: "조사 · Particles", note: "The tags that go on a noun. Grade 1's set, plus the ones that mark plurals, directions, and stretches of time." },
    { id: "copula", label: "이다와 있다 · Being and having", note: "The two ways Korean says that something is: 이에요/예요 for A is B, and 있어요/없어요 for there is and there is not." },
    { id: "ending", label: "어미 · Verb endings", note: "What goes on the end of a verb stem: joining, contrasting, conditioning, ordering, and the two ways of saying no." },
    { id: "modifier", label: "꾸미는 말 · Clauses in front of a noun", note: "Korean builds its descriptions in front of the noun. Grade 2 adds a tense to them, and a way of turning a verb into a noun." },
    { id: "pattern", label: "문장 만들기 · Sentence patterns", note: "Whole shapes worth learning as one piece — ability, wanting, trying, comparing, and quoting." }
  ];

  /* The grade 1 points are kept, because these passages still run on them.
     Grade 2's points go first so the new material is what a reader meets at the
     top of each type. */
  const base = global.ReadingGrammar;
  const allPoints = base && base.POINT_DEFS ? POINTS.concat(base.POINT_DEFS) : POINTS;

  global.ReadingGrammar2 = Object.assign({
    VERSION: "1.0.0",
    NEW_POINTS: POINTS,
    romanize: base ? base.romanize : (text => text)
  }, base.buildBank(allPoints, TYPE_DEFS));
})(window);
