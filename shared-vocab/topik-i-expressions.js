/*
 * TOPIK I expressions — the sentence layer over topik-vocab-topik-i.js.
 *
 * The word bank drills 1358 headwords one at a time. This file gives each of
 * them two or three whole utterances built on that word, because knowing 시간
 * is not the same as being able to ask 시간 있어요?. They are read by
 * tutoring-topik-i-word-bank.html, which nests them under the word's own row
 * and can quiz on them beside the vocabulary or instead of it.
 *
 * Keyed "korean|partOfSpeech", matching topik-i-notes.js, because the bank has
 * four separate 이 and three separate 있다. Everything else about a word — its
 * English, day, topic and part of speech — is read from the vocabulary file,
 * never repeated here.
 *
 * Each expression carries:
 *   ko     - the sentence in its 해요체 (polite) form, which is what the
 *            exercises ask for
 *   en     - natural English
 *   note   - optional: the trap in this particular sentence
 *   casual - optional 반말 version
 *   formal - optional 합쇼체 / honorific version
 *
 * A register version is written only where it is a genuinely different
 * utterance — 안녕히 가세요 / 잘 가, 죄송해요 / 미안해, 봐요 / 뵙겠습니다 — not
 * where the same sentence merely drops its 요 or swaps in -ㅂ니다. Everything
 * else would be conjugation practice wearing a vocabulary hat.
 *
 * Coverage is complete: all 1358 words of days 1-27, three expressions each,
 * 4074 in total. The page still handles gaps, so a word added to the vocabulary
 * file with nothing written for it simply shows no expressions.
 *
 * Browser: script src -> window.TopikIExpressions
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TopikIExpressions = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const BY_WORD = {
    // ================================================================= day 1
    "사람|noun": [
      { ko: "저 사람이 누구예요?", en: "Who is that person?", note: "저 is 'that over there'; 그 사람 is the person near you or already mentioned." },
      { ko: "사람이 많아요.", en: "There are a lot of people.", note: "The thing that exists takes 이/가, so 사람이, never 사람을." },
      { ko: "좋은 사람이에요.", en: "They are a good person." }
    ],
    "때|noun": [
      { ko: "시간 있을 때 전화하세요.", en: "Call me when you have time.", note: "때 always follows a modifier: 있을 때, 어릴 때. It never stands alone as a subject." },
      { ko: "어릴 때 한국에 살았어요.", en: "I lived in Korea when I was young.", note: "어리다 → 어릴 (the -ㄹ modifier), not 어렸을 때, though both are heard." },
      { ko: "그때 뭐 했어요?", en: "What were you doing then?" }
    ],
    "하다|verb": [
      { ko: "지금 뭐 해요?", en: "What are you doing now?", formal: "지금 무엇을 하십니까?" },
      { ko: "숙제를 해야 해요.", en: "I have to do my homework.", note: "-아야/어야 하다 is obligation; 하다 appears twice here, once as the main verb and once as the pattern." },
      { ko: "같이 할까요?", en: "Shall we do it together?", note: "-(으)ㄹ까요? proposes something and asks the listener at the same time." }
    ],
    "안녕하세요|expression": [
      { ko: "안녕하세요.", en: "Hello.", casual: "안녕.", note: "Works morning, noon and night. 안녕 alone is only for friends and children; 안녕하십니까 is for broadcasts and formal introductions." },
      { ko: "안녕히 주무세요.", en: "Good night.", casual: "잘 자.", note: "주무시다 is the honorific of 자다, so this is said to the person going to bed, never about yourself." },
      { ko: "안녕히 주무셨어요?", en: "Good morning. (to someone older)", note: "Literally 'did you sleep well' — the morning greeting upward. 잘 잤어요? is the level version." }
    ],
    "말|noun": [
      { ko: "그 말이 맞아요.", en: "That is right.", note: "말 is speech or what was said. 말이 많다 is 'talks a lot', not 'has many horses'." },
      { ko: "말이 너무 빨라요.", en: "You speak too fast.", note: "빠르다 is 르-irregular: 빨라요, not 빠르어요." },
      { ko: "한국말을 배워요.", en: "I am learning Korean.", note: "한국말 is the everyday word, 한국어 the formal one." }
    ],
    "있다|adjective": [
      { ko: "시간이 있어요?", en: "Do you have time?" },
      { ko: "질문이 있어요.", en: "I have a question.", note: "What exists takes 이/가. The negative is the separate word 없다, never 안 있다." },
      { ko: "여기 있어요.", en: "Here you are.", note: "What you say handing something over — literally 'it is here'." }
    ],
    "일|noun": [
      { ko: "오늘 일이 많아요.", en: "I have a lot of work today." },
      { ko: "무슨 일이에요?", en: "What is the matter?", note: "일 is a matter as well as work, so this asks what has happened, not what job it is." },
      { ko: "일 끝나고 만나요.", en: "Let's meet after work.", note: "-고 orders the two events: finish first, then meet." }
    ],
    "은|particle": [
      { ko: "저는 학생이에요.", en: "I am a student.", note: "은 after a consonant, 는 after a vowel — 저는, 선생님은." },
      { ko: "오늘은 집에 있어요.", en: "Today I am staying home.", note: "The topic marker carries contrast: today, as opposed to other days." },
      { ko: "이것은 뭐예요?", en: "What is this?" }
    ],
    "또|adverb": [
      { ko: "또 만나요!", en: "See you again!", note: "또 is a repeat of the same thing; 다시 is closer to 'once more, over again'." },
      { ko: "또 늦었어요?", en: "Late again?" },
      { ko: "또 오세요.", en: "Come again.", note: "What every shop and restaurant says as you leave." }
    ],
    "집|noun": [
      { ko: "집에 가요.", en: "I am going home." },
      { ko: "집이 어디예요?", en: "Where do you live?", note: "Literally 'where is your house' — the normal way to ask where someone lives." },
      { ko: "집에서 쉬어요.", en: "I am resting at home.", note: "에 marks where you go, 에서 where the action happens." }
    ],
    "것|dependent noun": [
      { ko: "이것은 제 것이에요.", en: "This is mine.", casual: "이건 내 거야." },
      { ko: "큰 것 주세요.", en: "Give me the big one, please.", note: "것 can never stand alone; it always follows a modifier — 큰 것, 제 것." },
      { ko: "좋아하는 것이 뭐예요?", en: "What is it that you like?", note: "-는 것 turns a verb into a noun: the thing you like." }
    ],
    "하나|numeral": [
      { ko: "사과 하나 주세요.", en: "One apple, please.", note: "하나 stands alone after the noun. Before a counter it shortens to 한 — 한 개, never 하나 개." },
      { ko: "하나만 더 주세요.", en: "Just one more, please.", note: "만 is 'only'; 더 is 'more'." },
      { ko: "하나도 몰라요.", en: "I do not know a single thing.", note: "하나도 needs a negative after it — 하나도 없어요, 하나도 안 좋아해요." }
    ],
    "되다|verb": [
      { ko: "잘 됐어요!", en: "That worked out well!" },
      { ko: "의사가 되고 싶어요.", en: "I want to become a doctor.", note: "What you become takes 이/가, not 을/를: 의사가 되다." },
      { ko: "이제 됐어요.", en: "That is enough. / It is done.", note: "Said to stop someone pouring, helping or explaining further." }
    ],
    "잘 모르겠어요|phrase": [
      { ko: "잘 모르겠어요.", en: "I am not sure.", note: "Softer than 몰라요, which can sound curt. -겠- turns it into a guess rather than a flat statement." },
      { ko: "무슨 말인지 잘 모르겠어요.", en: "I do not understand what you mean.", note: "-ㄴ지 embeds the question: 'what it is that you are saying'." },
      { ko: "글쎄요, 잘 모르겠어요.", en: "Well, I am really not sure.", note: "글쎄요 buys you a moment and softens the answer further." }
    ],
    "문제|noun": [
      { ko: "문제가 있어요.", en: "There is a problem." },
      { ko: "문제없어요.", en: "No problem.", note: "Written as one word in this fixed phrase." },
      { ko: "이 문제가 어려워요.", en: "This question is difficult.", note: "문제 is also an exam question, not only trouble." }
    ],
    "나|pronoun": [
      { ko: "나도 갈래.", en: "I want to come too.", note: "나 is casual. With anyone you are not close to, use 저 — 저도 갈래요." },
      { ko: "나는 괜찮아.", en: "I am fine.", note: "나는 contracts to 난 in speech." },
      { ko: "나한테 전화해.", en: "Call me.", note: "한테 is the casual counterpart of 에게; 저한테 is the polite version." }
    ],
    "그|determiner": [
      { ko: "그 사람 알아요?", en: "Do you know that person?", formal: "그분을 아십니까?" },
      { ko: "그 책 주세요.", en: "Give me that book, please.", note: "이 (near me) / 그 (near you) / 저 (over there) — Korean splits English 'that' two ways." },
      { ko: "그 말이 맞아요.", en: "That is right." }
    ],
    "속|noun": [
      { ko: "가방 속에 있어요.", en: "It is inside the bag.", note: "속 is the interior of something enclosed; 안 is the more general 'inside' and is far more common." },
      { ko: "물속에서 눈을 뜨지 마세요.", en: "Do not open your eyes under the water.", note: "물속 is written as one word." },
      { ko: "주머니 속에 뭐가 있어요?", en: "What is in your pocket?" }
    ],
    "안녕히 가세요|expression": [
      { ko: "안녕히 가세요.", en: "Goodbye. (to the person leaving)", casual: "잘 가.", note: "Said by whoever stays behind. Checking who is walking away is the whole trick." },
      { ko: "조심히 가세요.", en: "Get home safe." },
      { ko: "안녕히 가세요. 다음에 또 봬요.", en: "Goodbye. See you next time.", note: "봬요 is 뵈어요 contracted, the humble 'see you'." }
    ],
    "개|counter": [
      { ko: "사과 세 개 주세요.", en: "Three apples, please.", note: "Counters take native numbers, and 셋 becomes 세 before one: 세 개, never 셋 개." },
      { ko: "몇 개 있어요?", en: "How many are there?" },
      { ko: "한 개에 얼마예요?", en: "How much for one?" }
    ],
    "아|interjection": [
      { ko: "아, 그래요?", en: "Oh, really?" },
      { ko: "아, 알겠어요.", en: "Ah, I see.", note: "아 marks the moment something lands; 어 is the hesitating equivalent." },
      { ko: "아, 맞다! 잊어버렸어요.", en: "Oh, right! I forgot.", note: "아, 맞다 is the standard noise for remembering something on the spot." }
    ],
    "앞|noun": [
      { ko: "학교 앞에서 만나요.", en: "Let's meet in front of the school.", note: "Position nouns follow the thing they locate: 학교 앞, never 앞 학교." },
      { ko: "제 앞에 앉으세요.", en: "Please sit in front of me.", casual: "내 앞에 앉아." },
      { ko: "앞으로 가세요.", en: "Go forward.", note: "앞으로 also means 'from now on' when it is about time." }
    ],
    "그러나|conjunction": [
      { ko: "비가 왔어요. 그러나 우리는 갔어요.", en: "It rained. However, we went.", note: "그러나 is written Korean. In speech people say 하지만 or 그렇지만." },
      { ko: "한국어는 어려워요. 그러나 재미있어요.", en: "Korean is hard. However, it is fun." },
      { ko: "노력했어요. 그러나 실패했어요.", en: "I tried. However, I failed." }
    ],
    "보다|verb": [
      { ko: "저녁에 영화를 봐요.", en: "I watch a film in the evening.", note: "보다 → 봐요: ㅗ and ㅏ contract." },
      { ko: "내일 시험을 봐요.", en: "I have an exam tomorrow.", note: "Exams are 'seen' in Korean: 시험을 보다." },
      { ko: "내일 봐요.", en: "See you tomorrow.", formal: "내일 뵙겠습니다." }
    ],
    "한국|proper noun": [
      { ko: "한국에 가고 싶어요.", en: "I want to go to Korea.", note: "-고 싶다 is your own wish; about someone else it becomes -고 싶어하다." },
      { ko: "한국 음식을 좋아해요.", en: "I like Korean food." },
      { ko: "한국 사람이에요?", en: "Are you Korean?", note: "Country + 사람 makes the nationality; there is no separate adjective." }
    ],
    "자기소개|noun phrase": [
      { ko: "자기소개를 해 주세요.", en: "Please introduce yourself." },
      { ko: "간단하게 자기소개를 할게요.", en: "I will introduce myself briefly.", note: "-게 turns an adjective into an adverb: 간단하다 → 간단하게." },
      { ko: "자기소개부터 시작할게요.", en: "Let me start with an introduction.", note: "부터 marks where you begin." }
    ],
    "생각|noun": [
      { ko: "좋은 생각이에요!", en: "That is a good idea!" },
      { ko: "제 생각에는 좀 비싸요.", en: "In my opinion it is a bit expensive.", note: "제 생각에는 is the standard way to open an opinion." },
      { ko: "갑자기 생각이 났어요.", en: "It suddenly came to me.", note: "생각이 나다 is to remember something on your own; 기억하다 is the deliberate act." }
    ],
    "여자|noun": [
      { ko: "저 여자분이 제 친구예요.", en: "That woman is my friend.", note: "-분 is the polite counter for people; bare 저 여자 can sound blunt." },
      { ko: "여자 친구 있어요?", en: "Do you have a girlfriend?", note: "여자 친구 together means girlfriend; a female friend is 여자인 친구 or just 친구." },
      { ko: "여자 화장실은 이쪽이에요.", en: "The ladies' is this way." }
    ],
    "없다|adjective": [
      { ko: "시간이 없어요.", en: "I do not have time." },
      { ko: "돈이 없어요.", en: "I have no money.", note: "없다 is its own word, not a negated 있다 — 안 있다 does not exist." },
      { ko: "문제없어요.", en: "No problem." }
    ],
    "뒤|noun": [
      { ko: "집 뒤에 공원이 있어요.", en: "There is a park behind the house." },
      { ko: "제 뒤에 서세요.", en: "Please stand behind me.", note: "뒤 is also 'after' in time: 그 뒤에 = after that." },
      { ko: "뒤에 앉아도 돼요?", en: "May I sit at the back?" }
    ],
    "안녕히 계세요|expression": [
      { ko: "안녕히 계세요.", en: "Goodbye. (to the person staying)", casual: "잘 있어.", note: "Said by whoever is leaving. 계시다 is the honorific of 있다." },
      { ko: "먼저 가 볼게요.", en: "I will be heading off." },
      { ko: "그럼 안녕히 계세요.", en: "Right then, goodbye." }
    ],
    "가다|verb": [
      { ko: "학교에 가요.", en: "I go to school.", note: "The destination takes 에; the purpose takes -러: 밥 먹으러 가요." },
      { ko: "같이 갈까요?", en: "Shall we go together?", formal: "같이 가시겠습니까?" },
      { ko: "지금 가요.", en: "I am on my way.", note: "Korean picks 가다 or 오다 by where the speaker is, so coming to where you are is 지금 가요, never 와요." }
    ],
    "아이|noun": [
      { ko: "아이가 몇 명이에요?", en: "How many children do you have?", note: "People are counted with 명: 한 명, 두 명." },
      { ko: "아이들이 학교에 가요.", en: "The children go to school.", note: "-들 marks a plural but is optional and usually dropped when the number is obvious." },
      { ko: "아이가 참 귀여워요.", en: "What a cute child.", note: "귀엽다 is ㅂ-irregular: 귀여워요." }
    ],
    "이|particle": [
      { ko: "시간이 없어요.", en: "I have no time.", note: "이 after a consonant, 가 after a vowel — 시간이, 친구가." },
      { ko: "눈이 와요.", en: "It is snowing.", note: "Weather falls as a subject: 눈이 와요, 비가 와요." },
      { ko: "누가 왔어요?", en: "Who came?", note: "누구 + 가 contracts to 누가 — one of the few irregular pairings." }
    ],
    "시간|noun": [
      { ko: "시간 있어요?", en: "Do you have time?" },
      { ko: "시간이 빨리 가요.", en: "Time goes quickly." },
      { ko: "세 시간 걸려요.", en: "It takes three hours.", note: "시간 is both 'time' and the counter for hours; 시 is the clock hour." }
    ],
    "안|adverb": [
      { ko: "오늘은 안 바빠요.", en: "I am not busy today.", note: "안 sits directly in front of the verb or adjective." },
      { ko: "저는 술을 안 마셔요.", en: "I do not drink alcohol.", casual: "나는 술 안 마셔." },
      { ko: "공부 안 해요.", en: "I do not study.", note: "하다 verbs split: 공부 안 해요, not 안 공부해요." }
    ],
    "어머니|noun": [
      { ko: "어머니가 한국 사람이에요.", en: "My mother is Korean.", note: "우리 어머니 is the natural way to say 'my mother' — Korean says 'our' about family." },
      { ko: "어머니께 전화했어요.", en: "I called my mother.", note: "께 is the honorific of 에게, used upward to parents and teachers." },
      { ko: "어머니, 다녀오겠습니다.", en: "I am off, Mum." }
    ],
    "수|dependent noun": [
      { ko: "할 수 있어요!", en: "I can do it!" },
      { ko: "오늘은 갈 수 없어요.", en: "I cannot go today.", note: "-(으)ㄹ 수 없다 is inability; 못 가요 is the shorter spoken version." },
      { ko: "한국어를 읽을 수 있어요?", en: "Can you read Korean?", note: "수 never stands alone — it always follows a -(으)ㄹ modifier." }
    ],
    "있다|auxiliary verb": [
      { ko: "지금 밥을 먹고 있어요.", en: "I am eating right now.", note: "-고 있다 makes an action ongoing: attach 고 to the stem." },
      { ko: "뭐 하고 있어요?", en: "What are you doing?", formal: "무엇을 하고 계십니까?" },
      { ko: "밖에서 기다리고 있어요.", en: "I am waiting outside.", note: "For a state left by an action use -어 있다 instead: 앉아 있어요 = to be seated." }
    ],
    "둘|numeral": [
      { ko: "둘 다 좋아요.", en: "I like both.", note: "다 after a number means 'all of them'." },
      { ko: "하나, 둘, 셋!", en: "One, two, three!", note: "Counting aloud uses the native numbers." },
      { ko: "우리 둘이 갈게요.", en: "The two of us will go.", note: "Before a counter 둘 shortens to 두: 두 개, 두 명." }
    ],
    "눈|noun": [
      { ko: "눈이 와요.", en: "It is snowing.", note: "Snow and rain 'come' in Korean." },
      { ko: "눈이 아파요.", en: "My eyes hurt.", note: "Snow and eye are the same spelling; the vowel length differs in speech but not in writing." },
      { ko: "눈이 크고 예뻐요.", en: "You have big, pretty eyes.", note: "-고 links two descriptions." }
    ],
    "말하다|verb": [
      { ko: "천천히 말해 주세요.", en: "Please speak slowly.", formal: "천천히 말씀해 주십시오." },
      { ko: "한국어로 말해요.", en: "Say it in Korean.", note: "로/으로 marks the means — here, the language." },
      { ko: "저한테 말해 주세요.", en: "Please tell me.", note: "For talking *with* someone use 이야기하다; 말하다 is what is said." }
    ],
    "다시 말해 주세요|phrase": [
      { ko: "다시 말해 주세요.", en: "Please say that again.", formal: "다시 말씀해 주십시오." },
      { ko: "다시 한번 천천히 말해 주세요.", en: "Please say it once more, slowly." },
      { ko: "죄송하지만 다시 말해 주세요.", en: "Sorry, could you say that again?", note: "죄송하지만 softens any request to a stranger." }
    ],
    "다음|noun": [
      { ko: "다음에 봐요.", en: "See you next time.", formal: "다음에 뵙겠습니다." },
      { ko: "다음 주에 만나요.", en: "Let's meet next week.", note: "다음 주, 다음 달, 다음 해 — 다음 goes straight in front." },
      { ko: "다음은 뭐예요?", en: "What is next?" }
    ],
    "감사합니다|expression": [
      { ko: "감사합니다.", en: "Thank you.", casual: "고마워.", note: "감사합니다 is already formal; the 해요체 equivalent is 고마워요." },
      { ko: "도와주셔서 감사합니다.", en: "Thank you for your help.", note: "-아서/어서 gives the reason for the thanks, and -시- honours the person who helped." },
      { ko: "정말 감사합니다.", en: "Thank you very much." }
    ],
    "아니다|adjective": [
      { ko: "아니에요, 괜찮아요.", en: "No, it is fine." },
      { ko: "저는 학생이 아니에요.", en: "I am not a student.", note: "The noun takes 이/가 in front of 아니다, not 은/는." },
      { ko: "그게 아니에요.", en: "That is not it." }
    ],
    "전|noun": [
      { ko: "밥 먹기 전에 손을 씻어요.", en: "I wash my hands before eating.", note: "Verb + -기 전에 is 'before doing'; the verb stays in the dictionary form." },
      { ko: "삼 년 전에 한국에 왔어요.", en: "I came to Korea three years ago.", note: "Time + 전에 is 'ago'." },
      { ko: "자기 전에 책을 읽어요.", en: "I read before going to bed.", note: "Verb + -기 전에 is 'before doing'." }
    ],
    "곳|noun": [
      { ko: "좋은 곳이에요.", en: "It is a nice place." },
      { ko: "조용한 곳에서 만나요.", en: "Let's meet somewhere quiet.", note: "곳 needs a modifier in front; 장소 is the word that stands alone." },
      { ko: "제가 자주 가는 곳이에요.", en: "It is a place I go to often.", note: "-는 turns the verb into a modifier in front of 곳." }
    ],
    "오다|verb": [
      { ko: "비가 와요.", en: "It is raining.", note: "Rain comes in Korean — never 떨어지다." },
      { ko: "언제 왔어요?", en: "When did you get here?" },
      { ko: "내일 오세요.", en: "Please come tomorrow." }
    ],
    "우리|pronoun": [
      { ko: "우리 집에 오세요.", en: "Come to my house.", note: "우리 집 is 'my house' — Korean says 'our' about family, home and school." },
      { ko: "우리 같이 가요.", en: "Let's go together.", formal: "저희가 같이 가겠습니다." },
      { ko: "저희 회사는 서울에 있어요.", en: "Our company is in Seoul.", note: "저희 is the humble 우리, used downward-facing to customers and seniors." }
    ],
    "안|noun": [
      { ko: "가방 안에 책이 있어요.", en: "There is a book in the bag.", note: "The position noun 안 always follows another noun; the negation adverb 안 sits before a verb." },
      { ko: "안에서 기다리세요.", en: "Please wait inside." },
      { ko: "집 안이 따뜻해요.", en: "It is warm inside the house." }
    ],

    // ================================================================= day 2
    "이|determiner": [
      { ko: "이 책을 읽으세요.", en: "Please read this book.", note: "A determiner never takes a particle: 이 책, 이 사람." },
      { ko: "이 근처에 식당이 있어요?", en: "Is there a restaurant near here?" },
      { ko: "이 사람이 제 친구예요.", en: "This is my friend." }
    ],
    "위|noun": [
      { ko: "책상 위에 있어요.", en: "It is on the desk.", note: "Korean has no separate 'on': 위에 covers both on top of and above." },
      { ko: "위를 보세요.", en: "Look up." },
      { ko: "위층에 살아요.", en: "I live on the floor above.", note: "위층 upstairs, 아래층 downstairs." }
    ],
    "고맙습니다|expression": [
      { ko: "고마워요.", en: "Thank you.", note: "고맙다 is the native word, 감사하다 the Sino-Korean one. 고맙다 is ㅂ-irregular, giving 고마워요." },
      { ko: "도와줘서 고마워요.", en: "Thanks for helping." },
      { ko: "정말 고맙습니다.", en: "Thank you so much." }
    ],
    "을|particle": [
      { ko: "밥을 먹어요.", en: "I eat a meal.", note: "을 after a consonant, 를 after a vowel — 밥을, 커피를." },
      { ko: "책을 읽고 있어요.", en: "I am reading a book.", note: "In casual speech the object particle is often dropped: 책 읽고 있어." },
      { ko: "한국어를 공부해요.", en: "I study Korean.", note: "를 after a vowel — 한국어를 — and 을 after a consonant." }
    ],
    "운동|noun": [
      { ko: "매일 운동해요.", en: "I exercise every day." },
      { ko: "무슨 운동을 좋아해요?", en: "What sport do you like?" },
      { ko: "운동하러 가요.", en: "I am going to work out.", note: "-(으)러 가다 is going in order to do something." }
    ],
    "장|counter": [
      { ko: "종이 한 장 주세요.", en: "One sheet of paper, please.", note: "장 counts flat things: paper, tickets, photos, cards." },
      { ko: "표 두 장 주세요.", en: "Two tickets, please." },
      { ko: "사진 세 장 찍었어요.", en: "I took three photos." }
    ],
    "그래|interjection": [
      { ko: "그래, 알겠어.", en: "All right, got it.", note: "그래 is 반말. To anyone else say 그래요 or 알겠어요." },
      { ko: "그래? 정말?", en: "Really? Seriously?" },
      { ko: "그래, 그렇게 하자.", en: "All right, let's do that.", note: "-자 is the casual 'let's'." }
    ],
    "알다|verb": [
      { ko: "그 사람을 알아요.", en: "I know that person.", note: "알다 is ㄹ-irregular: the ㄹ drops before ㅂ, ㄴ and ㅅ — 압니다, 아세요." },
      { ko: "알겠어요.", en: "Got it.", note: "The reply to an instruction. 알아요 means 'I already know that' and can land as a correction." },
      { ko: "저도 몰랐어요.", en: "I did not know either.", note: "The negative of 알다 is the separate verb 모르다, never 안 알다." }
    ],
    "더|adverb": [
      { ko: "조금 더 주세요.", en: "A little more, please." },
      { ko: "더 크게 말해 주세요.", en: "Please speak louder.", note: "더 sits in front of what is being increased." },
      { ko: "더 이상 못 먹어요.", en: "I cannot eat any more.", note: "더 이상 with a negative is 'no longer, not any more'." }
    ],
    "학교|noun": [
      { ko: "학교에 가요.", en: "I go to school." },
      { ko: "학교가 집에서 멀어요.", en: "The school is far from my house.", note: "에서 marks the point measured from." },
      { ko: "학교에서 한국어를 배워요.", en: "I learn Korean at school.", note: "에 is where you go, 에서 where you do something." }
    ],
    "돈|noun": [
      { ko: "돈이 없어요.", en: "I have no money." },
      { ko: "돈 좀 빌려줄 수 있어요?", en: "Could you lend me some money?", note: "빌리다 is to borrow, 빌려주다 to lend — the direction is in the 주다." },
      { ko: "돈을 모으고 있어요.", en: "I am saving money." }
    ],
    "거|dependent noun": [
      { ko: "이거 뭐예요?", en: "What is this?", formal: "이것은 무엇입니까?", note: "거 is 것 in speech, so 이거 is spoken 이것." },
      { ko: "제 거예요.", en: "It is mine.", casual: "내 거야." },
      { ko: "맛있는 거 먹고 싶어요.", en: "I want to eat something tasty." }
    ],
    "같다|adjective": [
      { ko: "저도 같은 생각이에요.", en: "I think so too.", note: "같은 + noun is 'the same'; 같이 is 'together'." },
      { ko: "비가 올 것 같아요.", en: "It looks like it will rain.", note: "-(으)ㄹ 것 같다 is the everyday way to hedge a guess." },
      { ko: "우리는 나이가 같아요.", en: "We are the same age.", note: "What something is the same as takes 와/과 or 하고: 저와 같아요." }
    ],
    "그리고|conjunction": [
      { ko: "밥을 먹었어요. 그리고 잤어요.", en: "I ate, and then I slept.", note: "그리고 joins two sentences; to join two nouns use 하고 or 와/과." },
      { ko: "빵 그리고 우유를 샀어요.", en: "I bought bread and milk." },
      { ko: "저는 학생이에요. 그리고 한국어를 배워요.", en: "I am a student. And I am learning Korean." }
    ],
    "날|noun": [
      { ko: "오늘은 좋은 날이에요.", en: "Today is a good day." },
      { ko: "비 오는 날을 좋아해요.", en: "I like rainy days.", note: "-는 turns a verb into a modifier: 비 오는 날." },
      { ko: "그날 뭐 했어요?", en: "What did you do that day?", note: "그날 is written as one word." }
    ],
    "둘째|numeral": [
      { ko: "저는 둘째예요.", en: "I am the second child.", note: "The ordinals 첫째, 둘째, 셋째 are also how Koreans list points: 첫째, 둘째." },
      { ko: "둘째 아이가 다섯 살이에요.", en: "My second child is five." },
      { ko: "둘째, 약속을 지키세요.", en: "Second, keep your promises." }
    ],
    "받다|verb": [
      { ko: "선물을 받았어요.", en: "I received a present." },
      { ko: "전화 좀 받으세요.", en: "Please answer the phone.", note: "Phones are 'received' in Korean: 전화를 받다." },
      { ko: "이메일 받았어요?", en: "Did you get my email?" }
    ],
    "죄송합니다|expression": [
      { ko: "죄송해요.", en: "I am sorry.", casual: "미안해.", note: "죄송하다 is heavier than 미안하다 and is the one for strangers and seniors." },
      { ko: "늦어서 죄송합니다.", en: "I am sorry I am late.", note: "-아서/어서 gives the reason; Korean puts the cause first and the apology last." },
      { ko: "정말 죄송합니다.", en: "I am terribly sorry." }
    ],
    "천천히 말해 주세요|phrase": [
      { ko: "천천히 말해 주세요.", en: "Please speak slowly.", formal: "천천히 말씀해 주십시오." },
      { ko: "조금만 더 천천히 말해 주세요.", en: "Please speak just a little more slowly." },
      { ko: "죄송하지만 천천히 말해 주세요.", en: "Sorry, could you speak slowly?" }
    ],
    "서울|proper noun": [
      { ko: "서울에 살아요.", en: "I live in Seoul.", note: "살다 takes 에 for where you live, unlike most action verbs which take 에서." },
      { ko: "서울역에서 만나요.", en: "Let's meet at Seoul Station." },
      { ko: "서울까지 얼마나 걸려요?", en: "How long does it take to get to Seoul?", note: "까지 marks the end point, 부터 the start." }
    ],
    "대중교통|noun phrase": [
      { ko: "대중교통을 이용해요.", en: "I use public transport." },
      { ko: "서울은 대중교통이 편리해요.", en: "Public transport in Seoul is convenient." },
      { ko: "대중교통으로 갈까요?", en: "Shall we go by public transport?" }
    ],
    "친구|noun": [
      { ko: "친구를 만나요.", en: "I am meeting a friend.", note: "만나다 takes 을/를 — 친구를 만나요, not 친구에게." },
      { ko: "친구하고 같이 갔어요.", en: "I went with a friend.", note: "하고 is the spoken 'with'; 와/과 is the written one." },
      { ko: "제 친구예요.", en: "This is my friend.", casual: "내 친구야." }
    ],
    "마음|noun": [
      { ko: "마음에 들어요.", en: "I like it.", note: "Literally 'it enters my heart' — for something just shown or given, where 좋아해요 would sound like a long-standing taste." },
      { ko: "마음이 아파요.", en: "My heart aches." },
      { ko: "마음대로 하세요.", en: "Do as you like.", note: "-대로 is 'in accordance with'." }
    ],
    "후|noun": [
      { ko: "수업 후에 만나요.", en: "Let's meet after class.", note: "Noun + 후에; for a verb use -(으)ㄴ 후에: 먹은 후에." },
      { ko: "한 시간 후에 갈게요.", en: "I will go in an hour." },
      { ko: "그 후에 어떻게 됐어요?", en: "What happened after that?" }
    ],
    "아버지|noun": [
      { ko: "우리 아버지예요.", en: "This is my father.", note: "Korean says 우리 아버지 for 'my father'." },
      { ko: "아버지께 말씀드렸어요.", en: "I told my father.", note: "말씀드리다 is the humble 말하다, used when speaking to someone senior." },
      { ko: "아버지께서 신문을 읽고 계세요.", en: "Father is reading the paper.", note: "계시다 is the honorific 있다, so -고 계시다 is the honorific progressive." }
    ],
    "나오다|verb": [
      { ko: "물이 안 나와요.", en: "The water is not running.", formal: "물이 나오지 않습니다." },
      { ko: "집에서 나왔어요.", en: "I have left the house.", note: "나오다 is coming out toward the speaker; 나가다 is going out away from them." },
      { ko: "텔레비전에 나왔어요.", en: "It was on television." }
    ],
    "남자|noun": [
      { ko: "저 남자분이 누구예요?", en: "Who is that man?", note: "-분 is the polite counter for people." },
      { ko: "남자 친구 있어요?", en: "Do you have a boyfriend?" },
      { ko: "남자 화장실이 어디예요?", en: "Where is the gents?" }
    ],
    "의|particle": [
      { ko: "친구의 집이에요.", en: "It is my friend's house.", note: "의 is pronounced 에 here, and in speech it is usually dropped: 친구 집." },
      { ko: "저의 이름은 마이클이에요.", en: "My name is Michael.", note: "저의 contracts to 제, 나의 to 내 — those contractions are what people actually say." },
      { ko: "한국의 문화를 배워요.", en: "I am learning about Korean culture." }
    ],
    "미안합니다|expression": [
      { ko: "미안해요.", en: "Sorry.", note: "Lighter than 죄송합니다 and used with people you know." },
      { ko: "정말 미안해요.", en: "I am really sorry." },
      { ko: "늦어서 미안해요.", en: "Sorry I am late." }
    ],
    "그렇다|adjective": [
      { ko: "그래요?", en: "Really? / Is that so?", note: "그렇다 is ㅎ-irregular, which is where 그래요 comes from." },
      { ko: "그렇게 하세요.", en: "Do it that way.", note: "그렇게 is the adverb: 'like that, that much'." },
      { ko: "그렇지 않아요.", en: "That is not the case." }
    ],
    "몸|noun": [
      { ko: "몸이 안 좋아요.", en: "I am not feeling well.", formal: "몸이 좋지 않습니다." },
      { ko: "몸조심하세요.", en: "Take care of yourself.", note: "Written as one word; said to someone ill or heading somewhere cold." },
      { ko: "몸이 아파서 못 갔어요.", en: "I could not go because I was ill." }
    ],
    "그|pronoun": [
      { ko: "그는 한국 사람이에요.", en: "He is Korean.", note: "Bare 그 as 'he' is written Korean. In speech people say 그 사람 or 그분." },
      { ko: "그가 말했어요.", en: "He said so." },
      { ko: "그를 만난 적이 없어요.", en: "I have never met him.", note: "-(으)ㄴ 적이 없다 is 'have never'." }
    ],
    "잘|adverb": [
      { ko: "잘 지냈어요?", en: "How have you been?" },
      { ko: "한국어를 잘해요.", en: "You speak Korean well.", note: "잘하다 is written as one word when it means being good at something." },
      { ko: "잘 먹겠습니다.", en: "Thank you for the meal. (before eating)", note: "Said before eating; 잘 먹었습니다 is what you say afterwards." }
    ],
    "얼굴|noun": [
      { ko: "얼굴이 안 좋아요.", en: "You do not look well.", note: "Literally 'your face is not good' — about health or mood, not looks." },
      { ko: "오랜만에 얼굴 봐서 좋아요.", en: "It is good to see you after so long." },
      { ko: "얼굴을 씻으세요.", en: "Wash your face." }
    ],
    "살다|verb": [
      { ko: "어디에 살아요?", en: "Where do you live?", note: "살다 is ㄹ-irregular: 삽니다, 사세요." },
      { ko: "한국에서 오 년 살았어요.", en: "I lived in Korea for five years.", note: "With a duration, 에서 is also possible: both 한국에 and 한국에서 are heard." },
      { ko: "서울에 살아요.", en: "I live in Seoul.", note: "살다 takes 에 for where you live, unlike most verbs which take 에서." }
    ],
    "한|determiner": [
      { ko: "한 개 주세요.", en: "One, please.", note: "하나 shortens to 한 in front of a counter — 한 개, 한 명, 한 시간." },
      { ko: "한 시간 기다렸어요.", en: "I waited for an hour." },
      { ko: "한 명만 더 오세요.", en: "Just one more person, please." }
    ],
    "물|noun": [
      { ko: "물 좀 주세요.", en: "Some water, please.", note: "좀 softens the request rather than meaning 'a little'." },
      { ko: "물을 많이 마셔요.", en: "I drink a lot of water." },
      { ko: "물이 차가워요.", en: "The water is cold.", note: "차갑다 is ㅂ-irregular: 차가워요." }
    ],
    "년|dependent noun": [
      { ko: "삼 년 동안 살았어요.", en: "I lived there for three years.", note: "년 takes Sino-Korean numbers: 일 년, 이 년, 삼 년." },
      { ko: "몇 년 됐어요?", en: "How many years has it been?" },
      { ko: "이천이십오 년이에요.", en: "It is the year 2025.", note: "Years are read digit block by block: 이천이십오." }
    ],
    "이번|noun": [
      { ko: "이번 주말에 뭐 해요?", en: "What are you doing this weekend?" },
      { ko: "이번에는 제가 낼게요.", en: "I will pay this time.", note: "돈을 내다 is to pay; 이번에는 sets this occasion against the others." },
      { ko: "이번이 마지막이에요.", en: "This is the last time." }
    ],
    "첫째|numeral": [
      { ko: "저는 첫째예요.", en: "I am the eldest.", note: "첫째 is irregular — 하나째 does not exist." },
      { ko: "첫째, 건강이 중요해요.", en: "First, health is important.", note: "Used to open the first item in a list." },
      { ko: "첫째 아이가 열 살이에요.", en: "My first child is ten." }
    ],
    "반갑습니다|expression": [
      { ko: "반가워요.", en: "Nice to meet you.", note: "Only on a first meeting. 반갑다 is ㅂ-irregular, giving 반가워요." },
      { ko: "만나서 반갑습니다.", en: "It is a pleasure to meet you.", note: "-아서/어서 links cause to feeling: because we met, I am glad." },
      { ko: "만나서 정말 반가워요.", en: "It really is a pleasure to meet you." }
    ],
    "길|noun": [
      { ko: "길을 잃었어요.", en: "I am lost." },
      { ko: "길이 막혀요.", en: "The traffic is bad.", note: "Literally 'the road is blocked' — the standard way to say there is a jam." },
      { ko: "길을 건너세요.", en: "Cross the road." }
    ],
    "생각하다|verb": [
      { ko: "어떻게 생각해요?", en: "What do you think?" },
      { ko: "저도 그렇게 생각해요.", en: "I think so too." },
      { ko: "생각해 볼게요.", en: "I will think about it.", note: "-어 보다 (give it a go) plus -(으)ㄹ게요 (I promise to) — the polite way to not answer yet." }
    ],
    "무슨 뜻이에요|phrase": [
      { ko: "무슨 뜻이에요?", en: "What does it mean?" },
      { ko: "이 단어가 무슨 뜻이에요?", en: "What does this word mean?" },
      { ko: "이게 무슨 뜻이에요?", en: "What does this mean?" }
    ],
    "생활|noun": [
      { ko: "한국 생활이 어때요?", en: "How is life in Korea?" },
      { ko: "요즘 생활이 바빠요.", en: "Life is busy these days." },
      { ko: "생활이 많이 달라졌어요.", en: "Life has changed a lot.", note: "-아/어지다 turns an adjective into a change of state." }
    ],
    "대|counter": [
      { ko: "자동차 한 대 있어요.", en: "I have one car.", note: "대 counts vehicles and machines: cars, computers, washing machines." },
      { ko: "컴퓨터 두 대를 샀어요.", en: "I bought two computers." },
      { ko: "택시 한 대를 불렀어요.", en: "I called a taxi." }
    ],
    "뭐|interjection": [
      { ko: "뭐, 괜찮아요.", en: "Well, it is fine.", note: "As an interjection 뭐 is a shrug. As a pronoun it is 'what': 뭐 해요?" },
      { ko: "뭐? 정말이에요?", en: "What? Really?", casual: "뭐? 진짜?" },
      { ko: "뭐, 그럴 수도 있죠.", en: "Well, that can happen.", note: "-(으)ㄹ 수도 있다 is 'it is possible'." }
    ],
    "지금|noun": [
      { ko: "지금 몇 시예요?", en: "What time is it now?" },
      { ko: "지금은 바빠요.", en: "I am busy right now.", note: "지금 takes no 에 — unlike 주말에, 아침에." },
      { ko: "지금 갈게요.", en: "I am coming now." }
    ],
    "크다|adjective": [
      { ko: "집이 커요.", en: "The house is big.", note: "크다 is ㅡ-irregular: 크 + 어요 gives 커요." },
      { ko: "소리가 너무 커요.", en: "It is too loud." },
      { ko: "더 큰 거 있어요?", en: "Do you have a bigger one?", note: "크다 → 큰 is the modifier form used in front of a noun." }
    ],
    "사이|noun": [
      { ko: "학교와 집 사이에 있어요.", en: "It is between the school and the house.", note: "A와 B 사이에 — the two things are joined by 와/과 or 하고." },
      { ko: "친구 사이예요.", en: "We are friends.", note: "사이 is also the relationship between people: 사이가 좋아요 = they get on well." },
      { ko: "두 사람 사이가 좋아요.", en: "The two of them get on well." }
    ],

    // ================================================================= day 3
    "에|particle": [
      { ko: "세 시에 만나요.", en: "Let's meet at three.", note: "에 marks clock time and dates, but never 오늘, 내일, 어제 or 지금." },
      { ko: "학교에 가요.", en: "I go to school.", note: "에 marks the destination with a movement verb." },
      { ko: "책상 위에 있어요.", en: "It is on the desk.", note: "With 있다/없다, 에 marks where something sits — 에서 would be wrong here." }
    ],
    "모르다|verb": [
      { ko: "저도 몰라요.", en: "I do not know either.", note: "모르다 is 르-irregular: 몰라요, not 모르어요. It is the negative of 알다 — 안 알아요 does not exist." },
      { ko: "길을 몰라요.", en: "I do not know the way." },
      { ko: "언제 올지 모르겠어요.", en: "I am not sure when they will come.", note: "-(으)ㄹ지 모르다 is 'not to know whether or when'." }
    ],
    "우리나라|noun": [
      { ko: "우리나라 음식이 맛있어요.", en: "The food of my country is delicious.", note: "Written as one word, and used by Koreans to mean Korea. A foreigner using it about Korea sounds odd — say 인도네시아 for your own." },
      { ko: "우리나라에서는 신발을 벗어요.", en: "In my country we take our shoes off." },
      { ko: "우리나라 사람들은 김치를 많이 먹어요.", en: "People in my country eat a lot of kimchi." }
    ],
    "처음 뵙겠습니다|expression": [
      { ko: "처음 뵙겠습니다.", en: "How do you do.", casual: "처음 보네.", note: "Only on a first meeting, and only upward or formally — 뵙다 is the humble verb for meeting someone senior. 만나서 반갑습니다 usually follows." },
      { ko: "처음 뵙겠습니다. 저는 마이클입니다.", en: "How do you do. I am Michael." },
      { ko: "처음 뵙겠습니다. 잘 부탁드립니다.", en: "How do you do. I look forward to working with you.", note: "The two lines almost always come as a pair." }
    ],
    "그래서|conjunction": [
      { ko: "비가 왔어요. 그래서 집에 있었어요.", en: "It rained, so I stayed home.", note: "그래서 opens the second sentence. To join them into one, use -아서/어서: 비가 와서 집에 있었어요." },
      { ko: "늦었어요. 그래서 택시를 탔어요.", en: "I was late, so I took a taxi." },
      { ko: "배가 고팠어요. 그래서 밥을 먹었어요.", en: "I was hungry, so I ate." }
    ],
    "처음|noun": [
      { ko: "한국은 처음이에요.", en: "It is my first time in Korea.", casual: "한국은 처음이야." },
      { ko: "처음부터 다시 하세요.", en: "Please do it again from the start.", note: "부터 marks the starting point." },
      { ko: "처음 만났을 때 기억나요?", en: "Do you remember when we first met?", note: "Here 처음 works as an adverb, straight in front of the verb." }
    ],
    "다시|adverb": [
      { ko: "다시 한번 말해 주세요.", en: "Please say it once more." },
      { ko: "다시 시작해요.", en: "Let's start over.", note: "다시 is doing it over; 또 is the same thing happening again." },
      { ko: "다시 만나요.", en: "See you again." }
    ],
    "손|noun": [
      { ko: "손을 씻으세요.", en: "Please wash your hands." },
      { ko: "손 좀 잡아 주세요.", en: "Please hold my hand." },
      { ko: "손을 들어 주세요.", en: "Please raise your hand." }
    ],
    "만들다|verb": [
      { ko: "김치를 만들어요.", en: "I make kimchi.", note: "만들다 is ㄹ-irregular: the ㄹ drops before ㅂ and ㄴ — 만듭니다, 만드는." },
      { ko: "뭐 만들고 있어요?", en: "What are you making?" },
      { ko: "한국 친구를 만들고 싶어요.", en: "I want to make Korean friends.", note: "Friends are 'made' in Korean too — 친구를 사귀다 is the closer 'to make friends with'." }
    ],
    "그때|noun": [
      { ko: "그때는 몰랐어요.", en: "I did not know at the time.", note: "Written as one word when it means 'then'; 그 때 spaced is 'that occasion'." },
      { ko: "그때 뭐 하고 있었어요?", en: "What were you doing then?" },
      { ko: "그때 처음 만났어요.", en: "That was when we first met." }
    ],
    "때문|dependent noun": [
      { ko: "비 때문에 못 갔어요.", en: "I could not go because of the rain.", note: "Noun + 때문에. After a verb it needs -기 때문에: 늦었기 때문에." },
      { ko: "시험 때문에 바빠요.", en: "I am busy because of an exam.", note: "때문 can never stand alone — it always follows what caused things." },
      { ko: "일 때문에 못 가요.", en: "I cannot go because of work." }
    ],
    "하다|auxiliary verb": [
      { ko: "지금 가야 해요.", en: "I have to go now.", note: "-아야/어야 하다 is obligation: 가다 → 가야 해요. 되다 can replace 하다 with almost no change." },
      { ko: "약을 먹어야 해요.", en: "I have to take medicine." },
      { ko: "열심히 공부해야 해요.", en: "I have to study hard." }
    ],
    "부산|proper noun": [
      { ko: "부산에 가 봤어요?", en: "Have you been to Busan?", note: "-아/어 봤다 is the 'have you ever' of experience." },
      { ko: "서울에서 부산까지 세 시간 걸려요.", en: "It takes three hours from Seoul to Busan.", note: "에서 … 까지 is 'from … to'." },
      { ko: "부산에서 바다를 봤어요.", en: "I saw the sea in Busan." }
    ],
    "사회 문제|noun phrase": [
      { ko: "그건 큰 사회 문제예요.", en: "That is a big social problem." },
      { ko: "사회 문제에 관심이 많아요.", en: "I am very interested in social issues.", note: "관심이 있다/많다 takes 에 on what you are interested in." },
      { ko: "사회 문제를 해결하기 어려워요.", en: "Social problems are hard to solve.", note: "-기 어렵다 is 'hard to do'; -기 쉽다 its opposite." }
    ],
    "이야기|noun": [
      { ko: "이야기 좀 해요.", en: "Let's talk.", casual: "얘기 좀 하자.", note: "얘기 is the spoken contraction of 이야기." },
      { ko: "무슨 이야기예요?", en: "What is it about?" },
      { ko: "재미있는 이야기를 들었어요.", en: "I heard an interesting story." }
    ],
    "이|pronoun": [
      { ko: "이는 아주 중요한 문제예요.", en: "This is a very important issue.", note: "Bare 이 as 'this one' is written Korean only. In speech people say 이것 or 이거." },
      { ko: "이것이 제 책이에요.", en: "This is my book.", casual: "이거 내 책이야." },
      { ko: "이보다 더 좋은 방법은 없어요.", en: "There is no better way than this." }
    ],
    "잘 부탁드립니다|expression": [
      { ko: "잘 부탁드립니다.", en: "I look forward to working with you.", casual: "잘 부탁해.", note: "Closes almost every self-introduction, and asks the other person to look kindly on you. 드리다 is the humble 주다." },
      { ko: "앞으로 잘 부탁드립니다.", en: "I look forward to working with you from now on.", note: "앞으로 is 'from now on' when it is about time, 'forward' when it is about space." },
      { ko: "저는 마이클입니다. 잘 부탁드립니다.", en: "I am Michael. I look forward to working with you." }
    ],
    "셋|numeral": [
      { ko: "하나, 둘, 셋!", en: "One, two, three!" },
      { ko: "셋 다 주세요.", en: "Give me all three, please." },
      { ko: "아이가 셋이에요.", en: "I have three children.", note: "Before a counter 셋 shortens to 세: 세 개, 세 명." }
    ],
    "많다|adjective": [
      { ko: "사람이 많아요.", en: "There are a lot of people.", note: "많다 describes a thing; 많이 is the adverb that describes an action." },
      { ko: "일이 너무 많아요.", en: "I have far too much work." },
      { ko: "할 말이 많아요.", en: "I have a lot to say." }
    ],
    "선생님|noun": [
      { ko: "선생님, 질문이 있어요.", en: "Teacher, I have a question.", note: "선생님 is used as a form of address, the way English uses a name. -님 is the honorific suffix." },
      { ko: "선생님께 여쭤볼게요.", en: "I will ask the teacher.", note: "여쭙다 is the humble 'to ask', used when the person asked is senior." },
      { ko: "저는 한국어 선생님이에요.", en: "I am a Korean teacher." }
    ],
    "역사|noun": [
      { ko: "한국 역사에 관심이 있어요.", en: "I am interested in Korean history." },
      { ko: "역사를 공부해요.", en: "I study history." },
      { ko: "역사가 오래된 도시예요.", en: "It is a city with a long history." }
    ],
    "먹다|verb": [
      { ko: "밥 먹었어요?", en: "Have you eaten?", formal: "식사하셨습니까?", note: "A greeting as much as a question. 식사하다 is the polite verb for having a meal." },
      { ko: "천천히 드세요.", en: "Please eat slowly.", note: "드시다 is the honorific of 먹다, so it is only ever said about someone else." },
      { ko: "약을 먹어야 해요.", en: "I have to take medicine.", note: "Medicine is eaten in Korean, never taken." }
    ],
    "두|determiner": [
      { ko: "두 개 주세요.", en: "Two, please.", note: "둘 shortens to 두 in front of a counter — 두 개, 두 명, 두 시간." },
      { ko: "두 시에 만나요.", en: "Let's meet at two.", note: "Hours are native numbers: 두 시. Minutes are Sino-Korean: 이십 분." },
      { ko: "두 명이 왔어요.", en: "Two people came." }
    ],
    "어떻게 생각해요|phrase": [
      { ko: "어떻게 생각해요?", en: "What do you think?", note: "Literally 'how do you think' — 뭐 생각해요 would be asking what is on their mind." },
      { ko: "이 문제를 어떻게 생각해요?", en: "What do you think about this problem?" },
      { ko: "제 생각은 이런데, 어떻게 생각해요?", en: "This is my view — what do you think?" }
    ],
    "동안|noun": [
      { ko: "세 시간 동안 기다렸어요.", en: "I waited for three hours.", note: "Duration + 동안. After a verb it is -는 동안: 기다리는 동안." },
      { ko: "방학 동안 뭐 했어요?", en: "What did you do during the holidays?" },
      { ko: "일 년 동안 한국에 살았어요.", en: "I lived in Korea for a year." }
    ],
    "에서|particle": [
      { ko: "집에서 쉬어요.", en: "I rest at home.", note: "에서 is where an action happens; 에 is where something is or where you go." },
      { ko: "인도네시아에서 왔어요.", en: "I am from Indonesia.", note: "에서 also marks the point you came from." },
      { ko: "여기에서 만나요.", en: "Let's meet here.", note: "여기에서 contracts to 여기서 in speech." }
    ],
    "책|noun": [
      { ko: "책을 읽어요.", en: "I read a book." },
      { ko: "이 책 재미있어요.", en: "This book is interesting." },
      { ko: "도서관에서 책을 빌렸어요.", en: "I borrowed a book from the library.", note: "빌리다 is to borrow; 빌려주다 is to lend." }
    ],
    "시장|noun": [
      { ko: "시장에 가요.", en: "I am going to the market." },
      { ko: "시장이 백화점보다 싸요.", en: "The market is cheaper than the department store.", note: "보다 as a particle marks what is being compared against." },
      { ko: "시장에서 과일을 샀어요.", en: "I bought fruit at the market." }
    ],
    "실례합니다|expression": [
      { ko: "실례합니다.", en: "Excuse me.", note: "For interrupting someone, or squeezing past. To call a waiter, 저기요 is the natural one." },
      { ko: "실례지만, 자리 있어요?", en: "Excuse me, is this seat taken?", note: "실례지만 softens a question to a stranger — literally 'it is rude, but'." },
      { ko: "실례합니다, 길 좀 물어볼게요.", en: "Excuse me, may I ask for directions?" }
    ],
    "듣다|verb": [
      { ko: "잘 들으세요.", en: "Listen carefully.", note: "듣다 is ㄷ-irregular: the ㄷ becomes ㄹ before a vowel — 들어요, 들으세요." },
      { ko: "음악을 들어요.", en: "I listen to music." },
      { ko: "잘 못 들었어요.", en: "I did not catch that." }
    ],
    "다|adverb": [
      { ko: "다 먹었어요.", en: "I ate it all." },
      { ko: "다 같이 가요.", en: "Let's all go together." },
      { ko: "숙제를 다 했어요.", en: "I finished all my homework." }
    ],
    "힘|noun": [
      { ko: "힘이 없어요.", en: "I have no energy." },
      { ko: "힘내세요!", en: "Keep your chin up!", casual: "힘내!", note: "Said to someone having a hard time — literally 'put out strength'." },
      { ko: "힘이 세요.", en: "You are strong.", note: "힘이 세다 is the fixed pairing for physical strength." }
    ],
    "나라|noun": [
      { ko: "어느 나라에서 왔어요?", en: "Which country are you from?", note: "어느 asks which of a known set; 무슨 asks what kind." },
      { ko: "여러 나라를 여행하고 싶어요.", en: "I want to travel to several countries." },
      { ko: "어느 나라 음식을 좋아해요?", en: "Which country's food do you like?" }
    ],
    "좋다|adjective": [
      { ko: "날씨가 좋아요.", en: "The weather is nice." },
      { ko: "좋아요, 그렇게 해요.", en: "All right, let's do that.", note: "좋아요 doubles as agreement to a plan." },
      { ko: "기분이 좋아요.", en: "I am in a good mood.", note: "좋다 describes the thing; 좋아하다 is a person liking it." }
    ],
    "벌|counter": [
      { ko: "옷 한 벌 샀어요.", en: "I bought an outfit.", note: "벌 counts sets of clothing — a suit, a matching outfit, bedding." },
      { ko: "양복 두 벌이 있어요.", en: "I have two suits." },
      { ko: "옷 세 벌을 가져왔어요.", en: "I brought three sets of clothes." }
    ],
    "네|interjection": [
      { ko: "네, 알겠어요.", en: "Yes, understood.", casual: "응, 알겠어.", note: "네 is also the 'yes?' you answer a call with, and the noise that shows you are listening." },
      { ko: "네? 다시 말해 주세요.", en: "Sorry? Please say that again.", note: "네 with a rising tone means you did not catch it." },
      { ko: "네, 맞아요.", en: "Yes, that is right." }
    ],
    "자리|noun": [
      { ko: "자리 있어요?", en: "Is this seat free?" },
      { ko: "제 자리예요.", en: "That is my seat." },
      { ko: "자리를 바꿔 주세요.", en: "Could you change seats with me?" }
    ],
    "씨|dependent noun": [
      { ko: "마이클 씨, 안녕하세요.", en: "Hello, Michael.", note: "씨 follows a given name or a full name, never a surname alone, and never your own name." },
      { ko: "김민수 씨를 아세요?", en: "Do you know Kim Minsu?", note: "To someone clearly senior, use their title instead — 선생님, 과장님." },
      { ko: "민수 씨는 어디에 사세요?", en: "Where do you live, Minsu?" }
    ],
    "들다|verb": [
      { ko: "가방 좀 들어 주세요.", en: "Could you hold my bag?" },
      { ko: "돈이 많이 들어요.", en: "It costs a lot.", note: "들다 is also what money and time do: 시간이 들어요." },
      { ko: "마음에 들어요.", en: "I like it.", note: "Literally 'it enters my heart' — for something just shown or given." }
    ],
    "얘기|noun": [
      { ko: "무슨 얘기야?", en: "What are you talking about?", note: "얘기 is 이야기 shortened, and belongs with casual speech." },
      { ko: "얘기 좀 들어 주세요.", en: "Please hear me out." },
      { ko: "나중에 얘기해.", en: "Let's talk later.", note: "Casual — 얘기 belongs with 반말." }
    ],
    "괜찮아요|expression": [
      { ko: "괜찮아요.", en: "It is okay.", note: "Three jobs in one word: accepting an apology, declining an offer, and saying you are unhurt." },
      { ko: "괜찮아요?", en: "Are you all right?", note: "Same words, rising tone — the standard way to check on someone." },
      { ko: "네, 저는 괜찮아요.", en: "Yes, I am fine." }
    ],
    "학생|noun": [
      { ko: "저는 학생이에요.", en: "I am a student.", casual: "나는 학생이야." },
      { ko: "학생이 몇 명이에요?", en: "How many students are there?", note: "People are counted with 명." },
      { ko: "학생 할인 돼요?", en: "Is there a student discount?" }
    ],
    "셋째|numeral": [
      { ko: "셋째 아이예요.", en: "This is my third child." },
      { ko: "셋째, 시간을 지키세요.", en: "Third, be on time.", note: "첫째, 둘째, 셋째 are also how a list of points is numbered." },
      { ko: "셋째 줄에 앉으세요.", en: "Please sit in the third row." }
    ],
    "엄마|noun": [
      { ko: "엄마, 어디 가?", en: "Mum, where are you going?", formal: "어머니, 어디 가세요?", note: "엄마 is what you call your own mother at home; 어머니 is the word for anyone else's, and for polite speech." },
      { ko: "엄마가 만든 음식이 제일 맛있어요.", en: "My mum's cooking is the best." },
      { ko: "엄마한테 전화할게.", en: "I will call Mum." }
    ],
    "에게|particle": [
      { ko: "친구에게 선물을 줬어요.", en: "I gave my friend a present.", note: "에게 marks a person receiving. For a thing, use 에: 회사에 보냈어요." },
      { ko: "저에게 전화해 주세요.", en: "Please call me.", note: "한테 is the spoken version, 께 the honorific one." },
      { ko: "동생에게 책을 줬어요.", en: "I gave my younger brother a book." }
    ],
    "가지다|verb": [
      { ko: "우산 가져왔어요?", en: "Did you bring an umbrella?", note: "가지고 오다 contracts to 가져오다 — to bring a thing. For a person it is 데려오다." },
      { ko: "이거 가져도 돼요?", en: "May I take this?" },
      { ko: "돈을 얼마나 가지고 있어요?", en: "How much money do you have on you?" }
    ],
    "그런데|conjunction": [
      { ko: "맛있어요. 그런데 좀 비싸요.", en: "It is tasty. But it is a bit expensive." },
      { ko: "그런데 지금 몇 시예요?", en: "By the way, what time is it?", note: "그런데 also changes the subject, which 하지만 cannot do. It contracts to 근데 in speech." },
      { ko: "가고 싶어요. 그런데 시간이 없어요.", en: "I want to go, but I have no time." }
    ],
    "이름|noun": [
      { ko: "이름이 뭐예요?", en: "What is your name?", formal: "성함이 어떻게 되십니까?", note: "성함 is the honorific noun for a name, and 뭐 is too blunt to use upward." },
      { ko: "제 이름은 마이클이에요.", en: "My name is Michael." },
      { ko: "여기에 이름을 쓰세요.", en: "Please write your name here." }
    ],
    "그것|pronoun": [
      { ko: "그것은 제 것이 아니에요.", en: "That is not mine.", casual: "그거 내 거 아니야." },
      { ko: "그거 주세요.", en: "Give me that one, please.", note: "그거 is 그것 in speech, and what you actually say while pointing." },
      { ko: "그것 좀 보여 주세요.", en: "Could you show me that?" }
    ],
    "시간이 없어요|phrase": [
      { ko: "시간이 없어요.", en: "I do not have time.", note: "The standard polite decline. 시간 있어요? is the question it answers." },
      { ko: "미안해요, 지금 시간이 없어요.", en: "Sorry, I have no time right now." },
      { ko: "오늘은 정말 시간이 없어요.", en: "I really have no time today." }
    ],

    // ================================================================= day 4
    "하나|noun": [
      { ko: "하나만 주세요.", en: "Just one, please.", note: "As a noun 하나 can take particles — 하나만, 하나도 — which the bare numeral cannot." },
      { ko: "하나도 없어요.", en: "There is not a single one.", note: "하나도 always needs a negative behind it." },
      { ko: "하나씩 주세요.", en: "One each, please.", note: "씩 is 'each, apiece'." }
    ],
    "어떻다|adjective": [
      { ko: "한국 음식은 어때요?", en: "How is Korean food?", note: "어때요 is 어떻다 contracted — 어떻다 is ㅎ-irregular." },
      { ko: "어땠어요?", en: "How was it?" },
      { ko: "이건 어때요?", en: "How about this one?", note: "Also how you make a suggestion." }
    ],
    "남편|noun": [
      { ko: "제 남편이에요.", en: "This is my husband." },
      { ko: "남편이 회사에 다녀요.", en: "My husband works at a company.", note: "다니다 is to go somewhere regularly — a job, a school, a gym." },
      { ko: "남편하고 같이 왔어요.", en: "I came with my husband." }
    ],
    "잘 먹겠습니다|expression": [
      { ko: "잘 먹겠습니다.", en: "Thank you for the meal. (before eating)", casual: "잘 먹을게.", note: "Said before the first bite, to whoever cooked or is paying. There is no English equivalent — 'thank you' is the nearest." },
      { ko: "맛있게 드세요.", en: "Enjoy your meal.", note: "What the host says back; 드시다 is the honorific of 먹다." },
      { ko: "그럼 잘 먹겠습니다.", en: "Right then, thank you for the meal." }
    ],
    "좀|adverb": [
      { ko: "물 좀 주세요.", en: "Some water, please.", note: "좀 is 조금 shortened, and softens a request rather than meaning 'a little'." },
      { ko: "좀 비싸요.", en: "It is a bit expensive." },
      { ko: "좀 도와주세요.", en: "Please help me out." }
    ],
    "어떤|determiner": [
      { ko: "어떤 음악을 좋아해요?", en: "What kind of music do you like?", note: "어떤 asks what sort; 무슨 asks which thing; 어느 asks which of a known set." },
      { ko: "어떤 사람이에요?", en: "What kind of person are they?" },
      { ko: "어떤 색을 좋아해요?", en: "What colour do you like?" }
    ],
    "밖|noun": [
      { ko: "밖이 추워요.", en: "It is cold outside." },
      { ko: "밖에서 기다릴게요.", en: "I will wait outside." },
      { ko: "밖에 나가요.", en: "Let's go outside.", note: "밖에 also means 'only' when a negative follows: 하나밖에 없어요." }
    ],
    "주다|verb": [
      { ko: "이거 주세요.", en: "This one, please.", note: "주세요 orders anything you can point at, in any shop or restaurant." },
      { ko: "친구에게 선물을 줬어요.", en: "I gave my friend a present." },
      { ko: "선생님께 선물을 드렸어요.", en: "I gave my teacher a present.", note: "드리다 is the humble 주다, used when the receiver is senior." }
    ],
    "제주도|proper noun": [
      { ko: "제주도에 가 봤어요?", en: "Have you been to Jeju?" },
      { ko: "제주도는 정말 아름다워요.", en: "Jeju really is beautiful.", note: "아름답다 is ㅂ-irregular: 아름다워요." },
      { ko: "제주도에서 일주일 동안 있었어요.", en: "I stayed on Jeju for a week." }
    ],
    "환경 오염|noun phrase": [
      { ko: "환경 오염이 심해요.", en: "The pollution is severe." },
      { ko: "환경 오염 문제를 해결해야 해요.", en: "We have to solve the pollution problem." },
      { ko: "환경 오염을 줄여야 해요.", en: "We have to reduce pollution." }
    ],
    "대학|noun": [
      { ko: "대학에 다녀요.", en: "I go to university." },
      { ko: "어느 대학을 나왔어요?", en: "Which university did you graduate from?", note: "나오다 for a school means to graduate from it." },
      { ko: "대학에서 한국어를 공부했어요.", en: "I studied Korean at university." }
    ],
    "가운데|noun": [
      { ko: "가운데에 앉으세요.", en: "Please sit in the middle." },
      { ko: "세 개 가운데 하나를 고르세요.", en: "Choose one out of the three.", note: "가운데 also means 'among, out of' a group — 중에 is the more common spoken form." },
      { ko: "가운데 자리가 좋아요.", en: "I prefer the middle seat." }
    ],
    "일|dependent noun": [
      { ko: "삼 일 걸려요.", en: "It takes three days.", note: "일 as the day counter takes Sino-Korean numbers: 일 일, 이 일, 삼 일." },
      { ko: "오늘은 십일월 이십오 일이에요.", en: "Today is the twenty-fifth of November.", note: "Dates run big to small: year, month, day." },
      { ko: "휴가가 십 일 남았어요.", en: "There are ten days of holiday left." }
    ],
    "밤|noun": [
      { ko: "어젯밤에 뭐 했어요?", en: "What did you do last night?", note: "어젯밤 is written as one word, with a 사이시옷." },
      { ko: "밤에 잠을 못 잤어요.", en: "I could not sleep last night." },
      { ko: "밤이 늦었어요.", en: "It is late at night." }
    ],
    "나다|verb": [
      { ko: "갑자기 생각이 났어요.", en: "It suddenly came to me.", note: "생각이 나다 is remembering on your own; 기억하다 is the deliberate act." },
      { ko: "불이 났어요!", en: "There is a fire!" },
      { ko: "화가 나요.", en: "I am angry.", note: "Anger 'arises' in Korean, so the feeling takes 이/가, not 을/를." }
    ],
    "잘 먹었습니다|expression": [
      { ko: "잘 먹었습니다.", en: "Thank you for the meal. (after eating)", casual: "잘 먹었어.", note: "Said to whoever cooked or paid, on standing up from the table." },
      { ko: "잘 먹었습니다. 정말 맛있었어요.", en: "Thank you for the meal. It really was delicious." },
      { ko: "잘 먹었습니다. 다음에는 제가 살게요.", en: "Thank you for the meal. Next time it is on me." }
    ],
    "컴퓨터|noun": [
      { ko: "컴퓨터가 고장 났어요.", en: "My computer is broken.", note: "고장 나다 is the fixed pair for a machine breaking down." },
      { ko: "컴퓨터로 일해요.", en: "I work on a computer.", note: "로/으로 marks the tool used." },
      { ko: "컴퓨터를 켜 주세요.", en: "Please turn the computer on.", note: "켜다 turns it on, 끄다 off." }
    ],
    "한테|particle": [
      { ko: "저한테 주세요.", en: "Give it to me.", note: "한테 is the spoken 에게. Both mark a person receiving; 께 is the honorific." },
      { ko: "친구한테 전화했어요.", en: "I called my friend." },
      { ko: "누구한테 물어볼까요?", en: "Who shall we ask?" }
    ],
    "몇|numeral": [
      { ko: "몇 시예요?", en: "What time is it?" },
      { ko: "몇 명이에요?", en: "How many people?", note: "몇 always sits in front of a counter." },
      { ko: "몇 개 필요해요?", en: "How many do you need?" }
    ],
    "머리|noun": [
      { ko: "머리가 아파요.", en: "I have a headache." },
      { ko: "머리를 잘랐어요.", en: "I got a haircut.", note: "머리 is both head and hair, so the same word covers both." },
      { ko: "머리가 좋아요.", en: "They are clever.", note: "Literally 'the head is good'." }
    ],
    "이렇다|adjective": [
      { ko: "이렇게 하세요.", en: "Do it like this.", note: "이렇게 is the adverb — 이렇다 is ㅎ-irregular, like 그렇다 and 어떻다." },
      { ko: "이런 것도 있어요?", en: "Do you have this kind too?" },
      { ko: "왜 이래요?", en: "What is the matter with you?" }
    ],
    "아들|noun": [
      { ko: "아들이 둘 있어요.", en: "I have two sons." },
      { ko: "제 아들이에요.", en: "This is my son." },
      { ko: "아들이 대학에 다녀요.", en: "My son is at university." }
    ],
    "켤레|counter": [
      { ko: "양말 두 켤레 주세요.", en: "Two pairs of socks, please.", note: "켤레 counts footwear worn in pairs — socks, shoes, slippers." },
      { ko: "신발 한 켤레 샀어요.", en: "I bought a pair of shoes." },
      { ko: "구두 한 켤레가 필요해요.", en: "I need a pair of dress shoes." }
    ],
    "어|interjection": [
      { ko: "어, 맞아요.", en: "Oh, that is right.", note: "어 is the hesitating noise as well as recognition. As a bare 'yes' it is casual — 네 is the polite one." },
      { ko: "어? 이상하네요.", en: "Huh? That is strange." },
      { ko: "어, 잠깐만요.", en: "Uh, hold on a second." }
    ],
    "시작하다|verb": [
      { ko: "언제 시작해요?", en: "When does it start?", note: "시작하다 works both ways: 수업이 시작해요 and 수업을 시작해요." },
      { ko: "이제 시작해요.", en: "Let's start now." },
      { ko: "수업을 시작하겠습니다.", en: "I will begin the lesson.", note: "-겠습니다 announces your own next move, formally." }
    ],
    "오늘|noun": [
      { ko: "오늘 뭐 해요?", en: "What are you doing today?", note: "오늘, 내일, 어제 and 지금 take no 에 — 주말에 does." },
      { ko: "오늘은 바빠요.", en: "I am busy today.", note: "은/는 here sets today against other days." },
      { ko: "오늘까지 해야 해요.", en: "It has to be done by today.", note: "까지 is the deadline; 부터 is the start." }
    ],
    "시간이 있어요|phrase": [
      { ko: "시간이 있어요.", en: "I have time." },
      { ko: "시간 있어요?", en: "Do you have time?", note: "How you open a request or ask someone out. In speech the 이 is usually dropped." },
      { ko: "오후에는 시간이 있어요.", en: "I am free in the afternoon." }
    ],
    "함께|adverb": [
      { ko: "함께 가요.", en: "Let's go together.", note: "함께 is the written twin of 같이; both are correct, 같이 is what people say." },
      { ko: "가족과 함께 살아요.", en: "I live with my family.", note: "What you are with takes 와/과 or 하고." },
      { ko: "함께 일해서 좋았어요.", en: "It was good working with you." }
    ],
    "다녀오겠습니다|expression": [
      { ko: "다녀오겠습니다.", en: "I am off. (leaving home)", casual: "다녀올게.", note: "Said on the way out of your own house; the reply is 다녀오세요." },
      { ko: "다녀오세요.", en: "See you later. (to the one leaving)", casual: "잘 다녀와.", note: "Literally 'go and come back' — Korean assumes you are returning." },
      { ko: "학교에 다녀오겠습니다.", en: "I am off to school." }
    ],
    "방|noun": [
      { ko: "방이 커요.", en: "The room is big." },
      { ko: "방을 청소했어요.", en: "I cleaned my room." },
      { ko: "방에서 공부해요.", en: "I study in my room." }
    ],
    "아침|noun": [
      { ko: "아침을 먹었어요?", en: "Did you have breakfast?", note: "아침 is both the morning and the meal eaten in it, as are 점심 and 저녁." },
      { ko: "아침에 운동해요.", en: "I exercise in the morning." },
      { ko: "아침 일찍 일어나요.", en: "I get up early in the morning." }
    ],
    "저|pronoun": [
      { ko: "저는 학생이에요.", en: "I am a student.", casual: "나는 학생이야.", note: "저 is the humble 'I' and belongs with 요 and 습니다; 나 is for friends." },
      { ko: "저도 그렇게 생각해요.", en: "I think so too.", note: "도 replaces 은/는 rather than stacking with it — 저도, never 저는도." },
      { ko: "저한테 주세요.", en: "Give it to me, please." }
    ],
    "들어가다|verb": [
      { ko: "안으로 들어가세요.", en: "Please go inside." },
      { ko: "방에 들어가도 돼요?", en: "May I come into the room?", note: "들어가다 moves away from the speaker; 들어오다 comes toward them." },
      { ko: "집에 들어갔어요.", en: "I got home." }
    ],
    "끝|noun": [
      { ko: "이제 끝이에요.", en: "That is the end." },
      { ko: "끝까지 들어 주세요.", en: "Please hear me out to the end.", note: "끝나다 is the verb: 수업이 끝났어요." },
      { ko: "끝이 좋으면 다 좋아요.", en: "All is well that ends well.", note: "A set saying, and the same idea as the English one." }
    ],
    "입|noun": [
      { ko: "입을 벌리세요.", en: "Open your mouth." },
      { ko: "입에 맞으세요?", en: "Is it to your taste?", note: "Literally 'does it fit your mouth' — what a host asks about the food." },
      { ko: "음식이 입에 안 맞아요.", en: "The food is not to my taste.", note: "입에 맞다 is the fixed pairing for suiting your palate." }
    ],
    "원|dependent noun": [
      { ko: "오천 원이에요.", en: "It is five thousand won.", note: "Money takes Sino-Korean numbers: 오천 원, 만 원." },
      { ko: "만 원만 빌려주세요.", en: "Please lend me ten thousand won." },
      { ko: "한 개에 천 원이에요.", en: "It is a thousand won each." }
    ],
    "않다|auxiliary verb": [
      { ko: "저는 술을 마시지 않아요.", en: "I do not drink alcohol.", note: "-지 않다 is the long negative; 안 마셔요 is the short one, and more common in speech." },
      { ko: "별로 맵지 않아요.", en: "It is not very spicy.", note: "별로 needs a negative behind it." },
      { ko: "가지 않을 거예요.", en: "I am not going to go." }
    ],
    "다르다|adjective": [
      { ko: "생각이 달라요.", en: "We think differently.", note: "다르다 is 르-irregular: 달라요, not 다르어요." },
      { ko: "저는 형과 성격이 달라요.", en: "My brother and I have different personalities.", note: "What it differs from takes 와/과 or 하고." },
      { ko: "한국과 일본은 문화가 달라요.", en: "Korea and Japan have different cultures." }
    ],
    "영화|noun": [
      { ko: "영화 보러 가요.", en: "Let's go and see a film.", note: "-(으)러 가다 is going in order to do something." },
      { ko: "무슨 영화를 좋아해요?", en: "What films do you like?" },
      { ko: "그 영화 재미있었어요.", en: "That film was good." }
    ],
    "하지만|conjunction": [
      { ko: "비싸요. 하지만 좋아요.", en: "It is expensive. But it is good.", note: "하지만 contrasts, and unlike 그런데 it cannot change the subject." },
      { ko: "배고파요. 하지만 시간이 없어요.", en: "I am hungry, but there is no time." },
      { ko: "가고 싶어요. 하지만 돈이 없어요.", en: "I want to go. But I have no money." }
    ],
    "다녀왔습니다|expression": [
      { ko: "다녀왔습니다.", en: "I am home.", casual: "다녀왔어.", note: "Said walking back into your own house; the reply is 어서 와." },
      { ko: "잘 다녀왔어요?", en: "Did it go well?", note: "Asked of someone just back from a trip." },
      { ko: "여행 잘 다녀왔습니다.", en: "I am back from my trip, and it went well." }
    ],
    "다른|determiner": [
      { ko: "다른 색 있어요?", en: "Do you have another colour?", note: "다른 goes straight in front of a noun with no particle." },
      { ko: "다른 사람에게 물어보세요.", en: "Please ask somebody else." },
      { ko: "다른 거 보여 주세요.", en: "Could you show me a different one?" }
    ],
    "께|particle": [
      { ko: "부모님께 전화했어요.", en: "I called my parents.", note: "께 is the honorific 에게, used when the person receiving is senior." },
      { ko: "선생님께 드렸어요.", en: "I gave it to the teacher.", note: "께 usually brings 드리다 with it, the humble 주다." },
      { ko: "할머니께 선물을 드렸어요.", en: "I gave my grandmother a present." }
    ],
    "필요|noun": [
      { ko: "필요 없어요.", en: "I do not need it.", note: "필요하다 is the adjective: 뭐가 필요해요?" },
      { ko: "도움이 필요해요.", en: "I need help.", note: "What you need takes 이/가, not 을/를." },
      { ko: "필요한 게 있으면 말씀하세요.", en: "Let me know if you need anything." }
    ],
    "만나다|verb": [
      { ko: "친구를 만나요.", en: "I am meeting a friend.", note: "만나다 takes 을/를 — 친구를 만나요, never 친구에게." },
      { ko: "어디에서 만날까요?", en: "Where shall we meet?" },
      { ko: "만나서 반가워요.", en: "Nice to meet you.", formal: "만나서 반갑습니다.", note: "Only on a first meeting." }
    ],
    "하늘|noun": [
      { ko: "하늘이 파래요.", en: "The sky is blue.", note: "파랗다 is ㅎ-irregular: 파래요." },
      { ko: "하늘에 구름이 많아요.", en: "There are a lot of clouds in the sky." },
      { ko: "하늘을 보세요.", en: "Look at the sky." }
    ],
    "삼|numeral": [
      { ko: "삼월에 한국에 가요.", en: "I go to Korea in March.", note: "Sino-Korean numbers name the months: 삼월 is March. 3월 is written the same way." },
      { ko: "삼 층에 있어요.", en: "It is on the third floor." },
      { ko: "삼 분만 기다려 주세요.", en: "Please wait just three minutes." }
    ],
    "밥|noun": [
      { ko: "밥 먹었어요?", en: "Have you eaten?", note: "밥 is cooked rice, and by extension a meal of any kind." },
      { ko: "밥 한 그릇 더 주세요.", en: "One more bowl of rice, please." },
      { ko: "같이 밥 먹을래요?", en: "Shall we get something to eat?", note: "밥 먹자 is how Koreans invite you out, whatever the food." }
    ],
    "그림|noun": [
      { ko: "그림을 그려요.", en: "I draw pictures.", note: "그림 and 그리다 are the same root — a picture is a drawn thing." },
      { ko: "이 그림이 예뻐요.", en: "This picture is lovely." },
      { ko: "그림을 잘 그리네요!", en: "You draw well!" }
    ],
    "내다|verb": [
      { ko: "제가 낼게요.", en: "I will pay.", note: "돈을 내다 is to pay a bill; -(으)ㄹ게요 promises it to the listener." },
      { ko: "숙제를 내일까지 내세요.", en: "Hand the homework in by tomorrow." },
      { ko: "시간 좀 내 주세요.", en: "Please make some time for me." }
    ],
    "많이|adverb": [
      { ko: "많이 드세요.", en: "Please help yourself.", note: "Literally 'eat a lot' — what a host says at the table." },
      { ko: "많이 배웠어요.", en: "I learned a lot." },
      { ko: "오늘 많이 바빠요?", en: "Are you very busy today?", note: "많이 modifies a verb or adjective; 많다 describes a noun." }
    ],

    // ================================================================= day 5
    "수고하셨습니다|expression": [
      { ko: "수고하셨습니다.", en: "Thank you for your hard work.", casual: "수고했어.", note: "Said at the end of a shift, a class or a shared job — and never upward to a boss or teacher, where 감사합니다 is safer." },
      { ko: "오늘도 수고하셨습니다.", en: "Thank you for your work again today." },
      { ko: "먼저 가 보겠습니다. 수고하셨습니다.", en: "I will be off first. Thank you for your work." }
    ],
    "별말씀을요|phrase": [
      { ko: "별말씀을요.", en: "Not at all.", casual: "별말을.", note: "The polite brush-off after being thanked or praised — literally 'what a thing to say'. 말씀 is the honorific of 말." },
      { ko: "별말씀을요, 당연한 일인데요.", en: "Not at all, it was the least I could do." },
      { ko: "아니에요, 별말씀을요.", en: "Not at all, please do not mention it." }
    ],
    "인천|proper noun": [
      { ko: "인천 공항에서 만나요.", en: "Let's meet at Incheon Airport.", note: "인천국제공항 is Korea's main airport, an hour west of Seoul." },
      { ko: "인천까지 어떻게 가요?", en: "How do I get to Incheon?" },
      { ko: "인천에서 비행기를 탔어요.", en: "I took the plane from Incheon." }
    ],
    "경제 성장|noun phrase": [
      { ko: "경제 성장이 빨라요.", en: "Economic growth is fast." },
      { ko: "경제 성장에 대해 이야기했어요.", en: "We talked about economic growth." },
      { ko: "경제 성장이 멈췄어요.", en: "Economic growth has stalled." }
    ],
    "혼자|noun": [
      { ko: "혼자 살아요.", en: "I live alone.", note: "혼자 works as an adverb without a particle: 혼자 가요, 혼자 먹어요." },
      { ko: "혼자 가기 무서워요.", en: "I am scared to go alone." },
      { ko: "저 혼자 했어요.", en: "I did it by myself." }
    ],
    "이제|noun": [
      { ko: "이제 가야 해요.", en: "I have to go now.", note: "이제 is 'now, from this point on' and implies a change; 지금 is the plain clock now." },
      { ko: "이제 괜찮아요.", en: "I am all right now." },
      { ko: "이제부터 열심히 할게요.", en: "From now on I will work hard." }
    ],
    "중요하다|adjective": [
      { ko: "이게 제일 중요해요.", en: "This is the most important thing." },
      { ko: "건강이 중요해요.", en: "Health is important.", note: "What is important takes 이/가." },
      { ko: "중요한 회의가 있어요.", en: "I have an important meeting." }
    ],
    "교수|noun": [
      { ko: "김 교수님께 여쭤보세요.", en: "Please ask Professor Kim.", note: "Address a professor as 교수님 — bare 교수 is the job, not the person." },
      { ko: "저는 대학교 교수예요.", en: "I am a university professor." },
      { ko: "교수님 수업이 재미있어요.", en: "The professor's lectures are interesting." }
    ],
    "쓰다|verb": [
      { ko: "여기에 이름을 쓰세요.", en: "Please write your name here.", note: "쓰다 is ㅡ-irregular: 써요, 썼어요." },
      { ko: "이 컴퓨터를 써도 돼요?", en: "May I use this computer?", note: "The same 쓰다 is 'to use', and a third one is 'to wear' a hat or glasses." },
      { ko: "모자를 쓰고 나갔어요.", en: "I went out wearing a hat." }
    ],
    "술|noun": [
      { ko: "저는 술을 안 마셔요.", en: "I do not drink alcohol.", casual: "나는 술 안 마셔." },
      { ko: "술 한잔할까요?", en: "Shall we go for a drink?", note: "한잔하다 is written as one word and means going for a drink, not literally one glass." },
      { ko: "술을 조금만 마셔요.", en: "I only drink a little." }
    ],
    "송이|counter": [
      { ko: "장미 한 송이 주세요.", en: "One rose, please.", note: "송이 counts single blooms and bunches on a stem." },
      { ko: "꽃 열 송이를 샀어요.", en: "I bought ten flowers." },
      { ko: "장미 백 송이를 받았어요.", en: "I was given a hundred roses." }
    ],
    "예|interjection": [
      { ko: "예, 알겠습니다.", en: "Yes, understood.", note: "예 is the formal 네 — the army, customer service, and speaking to someone much older." },
      { ko: "예? 다시 말씀해 주세요.", en: "Sorry? Please say that again." },
      { ko: "예, 그렇습니다.", en: "Yes, that is correct." }
    ],
    "명|dependent noun": [
      { ko: "몇 명이에요?", en: "How many people?", note: "명 counts people and takes native numbers: 한 명, 두 명, 세 명." },
      { ko: "네 명 자리 있어요?", en: "Do you have a table for four?" },
      { ko: "학생이 스무 명 있어요.", en: "There are twenty students.", note: "스물 shortens to 스무 in front of a counter." }
    ],
    "에게서|particle": [
      { ko: "친구에게서 선물을 받았어요.", en: "I got a present from a friend.", note: "에게서 is 'from a person'. From a place it is 에서: 회사에서 받았어요." },
      { ko: "누구에게서 들었어요?", en: "Who did you hear it from?" },
      { ko: "부모님에게서 편지가 왔어요.", en: "A letter came from my parents." }
    ],
    "사랑|noun": [
      { ko: "사랑해요.", en: "I love you.", casual: "사랑해.", note: "사랑하다 takes 을/를 when the person is named: 가족을 사랑해요." },
      { ko: "가족의 사랑이 제일 커요.", en: "A family's love is the greatest." },
      { ko: "사랑에 빠졌어요.", en: "I have fallen in love.", note: "사랑에 빠지다 — love is 'fallen into' in Korean too." }
    ],
    "너|pronoun": [
      { ko: "너도 갈래?", en: "Do you want to come too?", note: "너 is casual and only for close friends or children. To anyone else, use their name plus 씨, or drop the subject entirely." },
      { ko: "너 어디야?", en: "Where are you?", note: "너 + 가 contracts to 네가, which people say as 니가 to keep it apart from 내가." },
      { ko: "너한테 할 말이 있어.", en: "I have something to tell you." }
    ],
    "축하합니다|expression": [
      { ko: "축하합니다!", en: "Congratulations!", casual: "축하해!", note: "What is being celebrated takes 을/를: 졸업을 축하해요." },
      { ko: "생일 축하합니다!", en: "Happy birthday!" },
      { ko: "결혼 축하합니다!", en: "Congratulations on your wedding!" }
    ],
    "전화|noun": [
      { ko: "전화 좀 받으세요.", en: "Please answer the phone.", note: "Calls are 'received' in Korean: 전화를 받다." },
      { ko: "전화번호가 뭐예요?", en: "What is your phone number?" },
      { ko: "나중에 전화할게요.", en: "I will call you later." }
    ],
    "앉다|verb": [
      { ko: "여기 앉으세요.", en: "Please have a seat." },
      { ko: "여기에 앉아도 돼요?", en: "May I sit here?", note: "-아도/어도 되다 asks permission; the refusal is 안 돼요." },
      { ko: "창가에 앉고 싶어요.", en: "I would like to sit by the window." }
    ],
    "아빠|noun": [
      { ko: "아빠, 어디 가?", en: "Dad, where are you going?", formal: "아버지, 어디 가세요?", note: "아빠 is what you call your own father at home; 아버지 is the polite word, and the one for anyone else's." },
      { ko: "아빠가 만든 음식이 맛있어요.", en: "My dad's cooking is delicious." },
      { ko: "아빠하고 같이 갔어요.", en: "I went with my dad." }
    ],
    "넷째|numeral": [
      { ko: "저는 넷째예요.", en: "I am the fourth child." },
      { ko: "넷째 줄에 앉으세요.", en: "Please sit in the fourth row." },
      { ko: "넷째 아이가 태어났어요.", en: "Their fourth child was born." }
    ],
    "한번|noun": [
      { ko: "한번 먹어 보세요.", en: "Give it a try.", note: "한번 written together is 'give it a go'; 한 번 spaced is a literal count of one time." },
      { ko: "언제 한번 만나요.", en: "Let's meet up sometime.", note: "언제 한번 is the vague Korean 'sometime' — a pleasantry more than a plan." },
      { ko: "한번 해 볼게요.", en: "I will give it a go." }
    ],
    "커피|noun": [
      { ko: "커피 한 잔 주세요.", en: "One coffee, please.", note: "잔 counts cups and glasses of a drink." },
      { ko: "커피 마실래요?", en: "Do you want a coffee?", note: "-(으)ㄹ래요? asks about the listener's wish, and is friendly rather than formal." },
      { ko: "커피에 설탕 넣으세요?", en: "Do you take sugar in your coffee?" }
    ],
    "어렵다|adjective": [
      { ko: "한국어가 어려워요.", en: "Korean is difficult.", note: "어렵다 is ㅂ-irregular: 어려워요. Its opposite is 쉽다 → 쉬워요." },
      { ko: "이 문제가 너무 어려워요.", en: "This question is far too hard." },
      { ko: "어려운 질문이네요.", en: "That is a difficult question." }
    ],
    "가장|adverb": [
      { ko: "이게 가장 좋아요.", en: "This one is the best.", note: "가장 is the written superlative; 제일 is what people say." },
      { ko: "무엇이 가장 중요해요?", en: "What matters most?" },
      { ko: "가장 가까운 역이 어디예요?", en: "Where is the nearest station?" }
    ],
    "이런|determiner": [
      { ko: "이런 음식 좋아해요?", en: "Do you like this kind of food?", note: "이런 / 그런 / 저런 follow the same near-you-there split as 이 / 그 / 저." },
      { ko: "이런 일은 처음이에요.", en: "This is the first time anything like this has happened." },
      { ko: "이런 식으로 하세요.", en: "Do it in this way.", note: "이런 식으로 is 'in this manner'." }
    ],
    "오랜만이에요|expression": [
      { ko: "오랜만이에요.", en: "Long time no see.", casual: "오랜만이야.", note: "Only for someone you already know, after a gap of weeks or more. 잘 지냈어요? usually follows." },
      { ko: "정말 오랜만이에요!", en: "It really has been a long time!" },
      { ko: "오랜만이에요. 잘 지냈어요?", en: "Long time no see. How have you been?" }
    ],
    "가슴|noun": [
      { ko: "가슴이 아파요.", en: "My chest hurts.", note: "가슴 is also where feelings sit, so this doubles as heartache." },
      { ko: "가슴이 답답해요.", en: "My chest feels tight." },
      { ko: "가슴이 뛰어요.", en: "My heart is racing." }
    ],
    "찾다|verb": [
      { ko: "뭐 찾으세요?", en: "What are you looking for?", note: "찾다 covers both looking for and finding; the context decides which." },
      { ko: "열쇠를 찾았어요.", en: "I found my keys." },
      { ko: "은행에서 돈을 찾았어요.", en: "I withdrew money at the bank.", note: "Money is 'found' at a bank in Korean — 돈을 찾다 is to withdraw." }
    ],
    "천만에요|phrase": [
      { ko: "천만에요.", en: "You are welcome.", note: "The formal reply to thanks. In everyday speech 아니에요 and 별말씀을요 are far more common." },
      { ko: "천만에요, 저도 즐거웠어요.", en: "Not at all, I enjoyed it too." },
      { ko: "아니에요, 천만에요.", en: "Not at all, you are welcome." }
    ],
    "회사|noun": [
      { ko: "회사에 다녀요.", en: "I work at a company.", note: "다니다 is going somewhere regularly — a job, a school, a gym." },
      { ko: "회사가 집에서 멀어요.", en: "My office is far from home." },
      { ko: "회사에서 일해요.", en: "I work at the office.", note: "에서 marks where the work happens." }
    ],
    "그러면|conjunction": [
      { ko: "그러면 내일 만나요.", en: "In that case, let's meet tomorrow.", note: "그러면 contracts to 그럼 in speech, which is what you usually hear." },
      { ko: "시간이 없어요? 그러면 다음에 해요.", en: "No time? Then let's do it another time." },
      { ko: "그러면 어떻게 할까요?", en: "Then what shall we do?" }
    ],
    "맛|noun": [
      { ko: "맛이 어때요?", en: "How does it taste?" },
      { ko: "맛있어요.", en: "It is delicious.", note: "맛 + 있다 makes 맛있다; its opposite 맛없다 is one word too." },
      { ko: "이 맛을 좋아해요.", en: "I like this flavour." }
    ],
    "음식|noun": [
      { ko: "한국 음식을 좋아해요.", en: "I like Korean food." },
      { ko: "음식이 맛있어요.", en: "The food is delicious." },
      { ko: "어떤 음식을 못 먹어요?", en: "Is there anything you cannot eat?", note: "못 먹다 covers both allergies and dislikes." }
    ],
    "한테서|particle": [
      { ko: "친구한테서 들었어요.", en: "I heard it from a friend.", note: "한테서 is the spoken 에게서 — from a person." },
      { ko: "누구한테서 받았어요?", en: "Who did you get it from?" },
      { ko: "엄마한테서 전화가 왔어.", en: "Mum called." }
    ],
    "나가다|verb": [
      { ko: "잠깐 나갔다 올게요.", en: "I am popping out for a moment.", note: "나가다 goes out away from the speaker; 나오다 comes out toward them." },
      { ko: "밖에 나가요.", en: "Let's go outside." },
      { ko: "지금 나가야 해요.", en: "I have to go out now." }
    ],
    "개|dependent noun": [
      { ko: "사과 세 개 주세요.", en: "Three apples, please.", note: "개 is the default counter for objects, and takes native numbers." },
      { ko: "몇 개 드릴까요?", en: "How many shall I give you?", note: "드리다 is the humble 주다, which is what shop staff use." },
      { ko: "한 개만 남았어요.", en: "There is only one left." }
    ],
    "요즘|noun": [
      { ko: "요즘 어때요?", en: "How are things lately?" },
      { ko: "요즘 바빠요.", en: "I am busy these days.", note: "요즘 covers the last few weeks, not today." },
      { ko: "요즘 뭐 하고 지내요?", en: "What have you been up to lately?" }
    ],
    "잘 지내셨어요|expression": [
      { ko: "잘 지내셨어요?", en: "How have you been?", casual: "잘 지냈어?", note: "The -시- honours the listener. The past tense asks about the time since you last met, so it is never a first-meeting line." },
      { ko: "네, 잘 지냈어요.", en: "Yes, I have been well." },
      { ko: "그동안 잘 지내셨어요?", en: "Have you been well all this time?" }
    ],
    "계획|noun": [
      { ko: "주말에 계획 있어요?", en: "Do you have plans this weekend?" },
      { ko: "계획을 세웠어요.", en: "I made a plan.", note: "Plans are 'stood up' in Korean: 계획을 세우다." },
      { ko: "여행 계획을 세우고 있어요.", en: "I am planning a trip." }
    ],
    "쉽다|adjective": [
      { ko: "이건 쉬워요.", en: "This is easy.", note: "쉽다 is ㅂ-irregular: 쉬워요." },
      { ko: "생각보다 쉬웠어요.", en: "It was easier than I expected.", note: "보다 as a particle marks what is compared against." },
      { ko: "쉬운 문제부터 푸세요.", en: "Start with the easy questions." }
    ],
    "얼마|noun": [
      { ko: "이거 얼마예요?", en: "How much is this?", note: "The single most useful shopping line. For a total, ask 전부 얼마예요?" },
      { ko: "얼마나 걸려요?", en: "How long does it take?", note: "얼마나 asks how much of something — time, distance, quantity." },
      { ko: "전부 얼마예요?", en: "How much is it altogether?" }
    ],
    "사다|verb": [
      { ko: "어디에서 샀어요?", en: "Where did you buy it?" },
      { ko: "제가 사 줄게요.", en: "I will buy it for you.", note: "-아/어 주다 does the action for someone else's benefit." },
      { ko: "오늘은 제가 살게요.", en: "It is on me today.", note: "사다 on its own is also 'to treat someone'." }
    ],
    "넷|numeral": [
      { ko: "하나, 둘, 셋, 넷!", en: "One, two, three, four!" },
      { ko: "넷 다 가져가세요.", en: "Take all four.", note: "Before a counter 넷 shortens to 네: 네 개, 네 명." },
      { ko: "넷 중에 하나를 고르세요.", en: "Choose one of the four." }
    ],
    "뭐|pronoun": [
      { ko: "이게 뭐예요?", en: "What is this?", formal: "이것이 무엇입니까?", note: "뭐 is the spoken 무엇, and 이게 the spoken 이것이." },
      { ko: "뭐 먹을래요?", en: "What do you want to eat?" },
      { ko: "뭐라고요?", en: "Sorry, what did you say?", note: "-라고요? asks someone to repeat what they just said." }
    ],
    "아내|noun": [
      { ko: "제 아내예요.", en: "This is my wife.", note: "아내 is your own wife; 부인 or 사모님 is how you refer to someone else's." },
      { ko: "아내와 함께 왔어요.", en: "I came with my wife." },
      { ko: "아내가 한국 사람이에요.", en: "My wife is Korean." }
    ],
    "대구|proper noun": [
      { ko: "대구는 여름에 정말 더워요.", en: "Daegu is really hot in summer." },
      { ko: "대구에서 태어났어요.", en: "I was born in Daegu.", note: "태어나다 takes 에서 for the place of birth." },
      { ko: "대구까지 기차로 가요.", en: "I am going to Daegu by train." }
    ],
    "인구 감소|noun phrase": [
      { ko: "인구 감소가 큰 문제예요.", en: "Population decline is a big problem." },
      { ko: "인구 감소 때문에 학교가 문을 닫았어요.", en: "The school closed because of the falling population." },
      { ko: "인구 감소가 계속되고 있어요.", en: "The population keeps falling." }
    ],
    "바로|adverb": [
      { ko: "지금 바로 갈게요.", en: "I will come right away." },
      { ko: "학교 바로 앞이에요.", en: "It is right in front of the school.", note: "바로 also means 'directly, exactly' about a position." },
      { ko: "바로 여기예요.", en: "It is right here." }
    ],
    "가족|noun": [
      { ko: "가족이 몇 명이에요?", en: "How many people are in your family?" },
      { ko: "우리 가족은 네 명이에요.", en: "There are four of us in my family.", note: "Korean says 우리 가족, never 제 가족, about your own." },
      { ko: "가족과 함께 살아요.", en: "I live with my family." }
    ],

    // ================================================================= day 6
    "그루|counter": [
      { ko: "나무 한 그루를 심었어요.", en: "I planted a tree.", note: "그루 counts standing trees, and takes native numbers." },
      { ko: "저기 나무 두 그루가 있어요.", en: "There are two trees over there." },
      { ko: "정원에 나무 세 그루가 있어요.", en: "There are three trees in the garden." }
    ],
    "그|interjection": [
      { ko: "그, 뭐라고 하죠?", en: "Um, how do I put it?", note: "The filler you use while hunting for a word — the spoken cousin of 저기." },
      { ko: "그, 잠깐만요.", en: "Er, just a moment." },
      { ko: "그, 어떻게 설명해야 할까요?", en: "Um, how should I explain this?" }
    ],
    "에 대해|expression": [
      { ko: "그 문제에 대해 이야기했어요.", en: "We talked about that problem.", note: "Noun + 에 대해(서). In writing it becomes 에 대하여, and in front of a noun 에 대한: 한국에 대한 책." },
      { ko: "한국 역사에 대해 배우고 있어요.", en: "I am learning about Korean history." },
      { ko: "그 사람에 대해 어떻게 생각해요?", en: "What do you think about that person?" }
    ],
    "차|noun": [
      { ko: "차 한잔하실래요?", en: "Would you like a cup of tea?", note: "차 is tea, and also a car — the same syllable, two different Hanja." },
      { ko: "차로 갈까요?", en: "Shall we go by car?", note: "로/으로 marks the means of travel." },
      { ko: "차가 막혀요.", en: "The traffic is bad." }
    ],
    "잡다|verb": [
      { ko: "손을 잡으세요.", en: "Hold my hand." },
      { ko: "택시를 잡았어요.", en: "I caught a taxi." },
      { ko: "약속을 잡을까요?", en: "Shall we fix a date?", note: "약속을 잡다 is to set up an appointment." }
    ],
    "도시|noun": [
      { ko: "서울은 큰 도시예요.", en: "Seoul is a big city." },
      { ko: "도시 생활이 바빠요.", en: "City life is busy.", note: "Its opposite is 시골, the countryside." },
      { ko: "어느 도시에 살아요?", en: "Which city do you live in?" }
    ],
    "물론이죠|phrase": [
      { ko: "물론이죠.", en: "Of course.", casual: "당연하지.", note: "-죠 is -지요 contracted, and invites the listener to agree." },
      { ko: "물론이죠, 같이 가요.", en: "Of course, let's go together." },
      { ko: "물론이죠, 도와드릴게요.", en: "Of course, I will help you." }
    ],
    "나이|noun": [
      { ko: "나이가 어떻게 되세요?", en: "How old are you?", casual: "몇 살이야?", note: "The polite way to ask; 연세 is the honorific noun for someone much older." },
      { ko: "저희는 나이가 같아요.", en: "We are the same age." },
      { ko: "나이가 많아요.", en: "They are quite old.", note: "나이가 많다 is the neutral way to say someone is old; 늙다 is blunt." }
    ],
    "으로|particle": [
      { ko: "버스로 갈게요.", en: "I will go by bus.", note: "로 after a vowel or ㄹ, 으로 after any other consonant — 버스로, 지하철로, 손으로." },
      { ko: "한국어로 말해 주세요.", en: "Please say it in Korean.", note: "The same particle marks the tool, the language and the direction." },
      { ko: "이쪽으로 오세요.", en: "Come this way." }
    ],
    "여러|determiner": [
      { ko: "여러 나라를 여행했어요.", en: "I have travelled to several countries.", note: "여러 always sits in front of a noun and never takes a particle." },
      { ko: "여러 가지가 있어요.", en: "There are various kinds." },
      { ko: "여러 번 말했어요.", en: "I have said it several times." }
    ],
    "옆|noun": [
      { ko: "제 옆에 앉으세요.", en: "Sit next to me." },
      { ko: "은행 옆에 있어요.", en: "It is next to the bank.", note: "Position nouns follow what they locate: 은행 옆, never 옆 은행." },
      { ko: "옆으로 조금만 가 주세요.", en: "Could you move over a little?" }
    ],
    "필요하다|adjective": [
      { ko: "뭐가 필요해요?", en: "What do you need?", note: "필요하다 is an adjective, so what you need takes 이/가, not 을/를." },
      { ko: "시간이 더 필요해요.", en: "I need more time." },
      { ko: "필요하면 언제든지 말하세요.", en: "If you need anything, just say." }
    ],
    "퍼센트|dependent noun": [
      { ko: "오십 퍼센트 할인이에요.", en: "It is fifty percent off.", note: "Percentages take Sino-Korean numbers. 프로 is the everyday spoken alternative." },
      { ko: "배터리가 십 퍼센트 남았어요.", en: "The battery is at ten percent." },
      { ko: "합격률이 삼십 퍼센트예요.", en: "The pass rate is thirty percent." }
    ],
    "보다|auxiliary verb": [
      { ko: "한번 먹어 보세요.", en: "Give it a taste.", note: "-어 보다 is trying something out. It does not mean attempting and failing — that is -려고 하다." },
      { ko: "한국에 가 봤어요?", en: "Have you been to Korea?", note: "-아/어 봤다 is the 'have you ever' of experience." },
      { ko: "생각해 볼게요.", en: "I will think about it.", note: "The polite way to not answer yet." }
    ],
    "아래|noun": [
      { ko: "책상 아래에 있어요.", en: "It is under the desk.", note: "아래 and 밑 are near twins; 밑 is more common for directly underneath." },
      { ko: "아래를 보세요.", en: "Look down." },
      { ko: "아래에 이름을 쓰세요.", en: "Write your name below." }
    ],
    "서다|verb": [
      { ko: "여기에 서 주세요.", en: "Please stand here.", note: "서다 is what stands or stops on its own; 세우다 is bringing something to a stop." },
      { ko: "버스가 섰어요.", en: "The bus has stopped." },
      { ko: "줄을 서 주세요.", en: "Please queue up.", note: "줄을 서다 is to stand in line." }
    ],
    "에 따라|expression": [
      { ko: "사람에 따라 달라요.", en: "It depends on the person.", note: "Noun + 에 따라(서), 'according to'. In front of a noun it becomes 에 따른." },
      { ko: "계획에 따라 진행할게요.", en: "We will go ahead according to plan." },
      { ko: "날씨에 따라 달라져요.", en: "It varies depending on the weather." }
    ],
    "배|noun": [
      { ko: "배가 아파요.", en: "I have a stomach ache." },
      { ko: "배를 타고 갔어요.", en: "We went by boat.", note: "배 is a stomach, a boat and a pear — three different words with one spelling." },
      { ko: "배가 고파요.", en: "I am hungry.", note: "Literally 'the stomach is empty'." }
    ],
    "산|noun": [
      { ko: "주말에 산에 가요.", en: "I go to the mountains at the weekend." },
      { ko: "산이 아주 높아요.", en: "The mountain is very high.", note: "등산 is the word for hiking — literally 'climbing a mountain'." },
      { ko: "산에서 사진을 많이 찍었어요.", en: "I took lots of photos on the mountain." }
    ],
    "문|noun": [
      { ko: "문 좀 열어 주세요.", en: "Please open the door." },
      { ko: "문을 닫아 주세요.", en: "Please close the door." },
      { ko: "가게가 문을 닫았어요.", en: "The shop has closed.", note: "문을 닫다 is also how a business closes, for the day or for good." }
    ],
    "모두|adverb": [
      { ko: "모두 얼마예요?", en: "How much is it altogether?" },
      { ko: "모두 다섯 명이에요.", en: "There are five of us in all.", note: "모두 also works as a noun meaning everyone: 모두 오세요." },
      { ko: "모두 준비됐어요?", en: "Is everything ready?" }
    ],
    "다섯|numeral": [
      { ko: "다섯 시에 만나요.", en: "Let's meet at five.", note: "Hours take native numbers: 다섯 시. Minutes take Sino-Korean: 오십 분." },
      { ko: "다섯 개 주세요.", en: "Five, please." },
      { ko: "다섯 명이 왔어요.", en: "Five people came." }
    ],
    "읽다|verb": [
      { ko: "책을 읽어요.", en: "I read a book.", note: "읽다 is pronounced 익따 on its own, but 일거요 with a vowel behind it." },
      { ko: "한국어를 읽을 수 있어요?", en: "Can you read Korean?" },
      { ko: "이 글을 읽어 보세요.", en: "Have a read of this." }
    ],
    "그렇지만|conjunction": [
      { ko: "비싸요. 그렇지만 사고 싶어요.", en: "It is expensive. But I want it.", note: "그렇지만 and 하지만 are interchangeable; 그렇지만 is a touch softer." },
      { ko: "어려워요. 그렇지만 재미있어요.", en: "It is hard, but it is fun." },
      { ko: "가고 싶어요. 그렇지만 시간이 없어요.", en: "I want to go. But there is no time." }
    ],
    "꽃|noun": [
      { ko: "꽃이 예뻐요.", en: "The flowers are pretty." },
      { ko: "꽃을 선물했어요.", en: "I gave flowers as a present.", note: "꽃 is pronounced 꼳 on its own, 꼬치 with 이 behind it." },
      { ko: "봄에 꽃이 피어요.", en: "Flowers bloom in spring.", note: "피다 is what flowers do; it takes 이/가." }
    ],
    "을 통해|expression": [
      { ko: "친구를 통해 알게 됐어요.", en: "I got to know them through a friend.", note: "Noun + 을/를 통해(서) — through a person, a channel, a means." },
      { ko: "인터넷을 통해 배웠어요.", en: "I learned it through the internet." },
      { ko: "이 경험을 통해 많이 배웠어요.", en: "I learned a lot through this experience." }
    ],
    "그동안|noun": [
      { ko: "그동안 잘 지냈어요?", en: "Have you been well all this time?", note: "Written as one word: the stretch of time since you last met." },
      { ko: "그동안 감사했습니다.", en: "Thank you for everything.", note: "What you say on leaving a job or a course." },
      { ko: "그동안 어떻게 지냈어요?", en: "How have you been all this time?" }
    ],
    "작다|adjective": [
      { ko: "이 옷은 좀 작아요.", en: "These clothes are a bit small.", note: "작다 is small in size; 적다 is small in number, and the two are constantly mixed up." },
      { ko: "더 작은 거 있어요?", en: "Do you have a smaller one?" },
      { ko: "글씨가 너무 작아요.", en: "The writing is too small." }
    ],
    "누구|pronoun": [
      { ko: "누구세요?", en: "Who is it?", note: "What you say at the door or on the phone." },
      { ko: "저 사람이 누구예요?", en: "Who is that person?" },
      { ko: "누가 왔어요?", en: "Who came?", note: "누구 + 가 contracts to 누가 — one of the few irregular pairings." }
    ],
    "바람|noun": [
      { ko: "바람이 불어요.", en: "The wind is blowing.", note: "불다 is the verb for wind: 바람이 불다." },
      { ko: "바람이 시원해요.", en: "The breeze is refreshing." },
      { ko: "오늘은 바람이 많이 불어요.", en: "It is very windy today." }
    ],
    "와|particle": [
      { ko: "친구와 같이 갔어요.", en: "I went with a friend.", note: "와 after a vowel, 과 after a consonant. 하고 is the spoken version of both." },
      { ko: "빵과 우유를 샀어요.", en: "I bought bread and milk.", note: "The same particle joins two nouns; 그리고 joins two sentences." },
      { ko: "저와 같이 가실래요?", en: "Would you like to come with me?" }
    ],
    "일어나다|verb": [
      { ko: "일곱 시에 일어나요.", en: "I get up at seven." },
      { ko: "무슨 일이 일어났어요?", en: "What happened?", note: "일어나다 is both getting up and an event occurring." },
      { ko: "일어나세요!", en: "Get up!" }
    ],
    "노래|noun": [
      { ko: "노래를 잘해요.", en: "You sing well." },
      { ko: "이 노래 좋아해요.", en: "I like this song.", note: "노래하다 is to sing; 노래를 부르다 is the more natural pairing." },
      { ko: "노래 한 곡 불러 주세요.", en: "Please sing us a song.", note: "곡 is the counter for songs and pieces of music." }
    ],
    "그럼요|phrase": [
      { ko: "그럼요.", en: "Of course.", casual: "그럼.", note: "A warm yes to a request or a question. 그럼 on its own also means 'then, in that case'." },
      { ko: "그럼요, 언제든지요.", en: "Of course, any time." },
      { ko: "그럼요, 제가 할게요.", en: "Of course, I will do it." }
    ],
    "바다|noun": [
      { ko: "여름에 바다에 가요.", en: "I go to the sea in summer." },
      { ko: "바다가 아름다워요.", en: "The sea is beautiful." },
      { ko: "바다에서 수영했어요.", en: "I swam in the sea." }
    ],
    "번|dependent noun": [
      { ko: "한 번 더 해 보세요.", en: "Try it one more time.", note: "한 번 spaced is a count of times; 한번 together is 'give it a go'." },
      { ko: "몇 번 가 봤어요.", en: "I have been a few times." },
      { ko: "몇 번이에요?", en: "What number is it?", note: "번 also numbers things — bus routes, seats, house numbers — with Sino-Korean numbers." }
    ],
    "에 비해|expression": [
      { ko: "작년에 비해 따뜻해요.", en: "It is warm compared with last year.", note: "Noun + 에 비해(서). The everyday spoken version is just 보다." },
      { ko: "가격에 비해 품질이 좋아요.", en: "The quality is good for the price." },
      { ko: "다른 곳에 비해 싸요.", en: "It is cheap compared with other places." }
    ],
    "공부|noun": [
      { ko: "한국어 공부가 재미있어요.", en: "Studying Korean is fun." },
      { ko: "공부 열심히 하세요.", en: "Study hard.", note: "공부하다 is one verb, so 공부해요 written together is just as correct." },
      { ko: "시험 공부를 해야 해요.", en: "I have to study for an exam." }
    ],
    "근|counter": [
      { ko: "소고기 한 근 주세요.", en: "Six hundred grams of beef, please.", note: "근 is a traditional weight used at butchers and markets — about 600g for meat." },
      { ko: "두 근에 얼마예요?", en: "How much for two 근?" },
      { ko: "돼지고기 두 근 주세요.", en: "Two 근 of pork, please." }
    ],
    "어디|interjection": [
      { ko: "어디, 한번 봅시다.", en: "Now then, let me have a look.", note: "As an interjection 어디 is 'let's see'; as a question word it is 'where'." },
      { ko: "어디, 얼마나 잘하나 볼까요?", en: "Well now, let's see how good you are." },
      { ko: "어디, 제가 해 볼게요.", en: "Right, let me have a go." }
    ],
    "넣다|verb": [
      { ko: "설탕을 넣어 주세요.", en: "Please put some sugar in." },
      { ko: "가방에 넣었어요.", en: "I put it in my bag.", note: "Where it goes takes 에: 가방에 넣다." },
      { ko: "냉장고에 넣어 주세요.", en: "Please put it in the fridge." }
    ],
    "언니|noun": [
      { ko: "언니가 한 명 있어요.", en: "I have one older sister.", note: "언니 is used by a woman. A man says 누나 for the same person — Korean names siblings by the speaker's gender." },
      { ko: "언니, 이거 어때?", en: "Sis, how about this one?", note: "Also how a younger woman addresses a slightly older one she is friendly with." },
      { ko: "언니가 서울에 살아요.", en: "My older sister lives in Seoul." }
    ],
    "광주|proper noun": [
      { ko: "광주에서 살았어요.", en: "I lived in Gwangju." },
      { ko: "광주까지 기차로 가요.", en: "I am going to Gwangju by train." },
      { ko: "광주는 음식이 맛있어요.", en: "The food in Gwangju is good." }
    ],
    "기후 변화|noun phrase": [
      { ko: "기후 변화가 심각해요.", en: "Climate change is serious." },
      { ko: "기후 변화에 대해 배웠어요.", en: "We learned about climate change." },
      { ko: "기후 변화를 막아야 해요.", en: "We have to stop climate change." }
    ],
    "불|noun": [
      { ko: "불 좀 켜 주세요.", en: "Please turn the light on.", note: "켜다 turns a light on, 끄다 turns it off." },
      { ko: "불이 났어요!", en: "There is a fire!" },
      { ko: "불을 꺼 주세요.", en: "Please turn the light off." }
    ],
    "어느|determiner": [
      { ko: "어느 나라에서 왔어요?", en: "Which country are you from?", note: "어느 asks which of a known set; 어떤 asks what kind." },
      { ko: "어느 것이 더 좋아요?", en: "Which one is better?" },
      { ko: "어느 쪽으로 가야 해요?", en: "Which way should I go?" }
    ],
    "왜|adverb": [
      { ko: "왜 늦었어요?", en: "Why are you late?" },
      { ko: "왜요?", en: "Why?", casual: "왜?", note: "왜 그래요? is a different question — it asks what is wrong." },
      { ko: "왜 한국어를 배워요?", en: "Why are you learning Korean?" }
    ],
    "학년|noun": [
      { ko: "몇 학년이에요?", en: "What year are you in?", note: "학년 takes Sino-Korean numbers: 일 학년, 이 학년." },
      { ko: "저는 삼 학년이에요.", en: "I am in the third year." },
      { ko: "저는 고등학교 이 학년이에요.", en: "I am in the second year of high school." }
    ],
    "높다|adjective": [
      { ko: "건물이 높아요.", en: "The building is tall.", note: "높다 is high off the ground; 키가 크다 is how you say a person is tall." },
      { ko: "가격이 너무 높아요.", en: "The price is too high." },
      { ko: "산이 아주 높아요.", en: "The mountain is very high." }
    ],
    "일|numeral": [
      { ko: "일 월에 만나요.", en: "Let's meet in January.", note: "Sino-Korean 일 names months, dates, money and phone numbers; native 하나 counts objects." },
      { ko: "일 번 버스를 타세요.", en: "Take the number one bus." },
      { ko: "일 번 출구에서 만나요.", en: "Let's meet at exit one." }
    ],

    // ================================================================= day 7
    "부르다|verb": [
      { ko: "택시를 불러 주세요.", en: "Please call a taxi.", note: "부르다 is 르-irregular: 불러요, not 부르어요." },
      { ko: "노래를 부를까요?", en: "Shall we sing?", note: "Songs are 'called' in Korean: 노래를 부르다." },
      { ko: "뭐라고 불러야 해요?", en: "What should I call you?", note: "The polite way to ask what to address someone as." }
    ],
    "신문|noun": [
      { ko: "아침에 신문을 읽어요.", en: "I read the paper in the morning." },
      { ko: "신문에 났어요.", en: "It was in the paper.", note: "나다 is what news does — it 'comes out' in a paper or on TV." },
      { ko: "신문을 구독하고 있어요.", en: "I subscribe to a newspaper." }
    ],
    "에 의해|expression": [
      { ko: "이 건물은 백 년 전에 지어졌어요.", en: "This building was built a hundred years ago.", note: "에 의해 marks the doer in a passive sentence: 건축가에 의해 지어졌어요. It is written Korean — speech keeps the active voice." },
      { ko: "법에 의해 금지되어 있어요.", en: "It is prohibited by law." },
      { ko: "경찰에 의해 밝혀졌어요.", en: "It was uncovered by the police." }
    ],
    "선생|noun": [
      { ko: "김 선생님이 가르치세요.", en: "Mr Kim teaches us.", note: "Always 선생님 when speaking to or about someone — bare 선생 is the job title in writing." },
      { ko: "선생님, 질문 있어요.", en: "Teacher, I have a question." },
      { ko: "선생님께서 설명해 주셨어요.", en: "The teacher explained it to us." }
    ],
    "하고|particle": [
      { ko: "친구하고 같이 갔어요.", en: "I went with a friend.", note: "하고 is the spoken 와/과, and works after a vowel or a consonant alike." },
      { ko: "빵하고 우유를 샀어요.", en: "I bought bread and milk." },
      { ko: "누구하고 갈 거예요?", en: "Who are you going with?" }
    ],
    "기분|noun": [
      { ko: "기분이 좋아요.", en: "I am in a good mood.", note: "기분 is a passing mood; 성격 is character." },
      { ko: "기분이 어때요?", en: "How are you feeling?" },
      { ko: "기분 나빠요.", en: "That upsets me.", note: "기분이 나쁘다 is how you say something offended you." }
    ],
    "옷|noun": [
      { ko: "옷을 갈아입었어요.", en: "I changed my clothes." },
      { ko: "이 옷 어때요?", en: "How do these look?" },
      { ko: "따뜻한 옷을 입으세요.", en: "Wear something warm.", note: "입다 is for clothes on the body; hats take 쓰다 and shoes 신다." }
    ],
    "죽다|verb": [
      { ko: "할아버지께서 작년에 돌아가셨어요.", en: "My grandfather passed away last year.", note: "돌아가시다 is the honorific for a person dying; 죽다 about a person you respect is blunt." },
      { ko: "배터리가 죽었어요.", en: "The battery is dead.", note: "죽다 is fine for things and animals." },
      { ko: "꽃이 다 죽었어요.", en: "The flowers have all died." }
    ],
    "아무래도 좋아요|phrase": [
      { ko: "아무래도 좋아요.", en: "Either is fine with me.", casual: "아무래도 좋아.", note: "아무래도 is 'whichever way it goes'. 아무거나 괜찮아요 is the more everyday version." },
      { ko: "저는 아무래도 좋아요. 정하세요.", en: "I do not mind either way. You decide." },
      { ko: "시간은 아무래도 좋아요.", en: "Any time suits me." }
    ],
    "꿈|noun": [
      { ko: "어젯밤에 꿈을 꿨어요.", en: "I had a dream last night.", note: "Dreams are 'dreamt' with their own verb: 꿈을 꾸다." },
      { ko: "제 꿈은 선생님이 되는 거예요.", en: "My dream is to become a teacher." },
      { ko: "꿈이 뭐예요?", en: "What is your dream?" }
    ],
    "시|dependent noun": [
      { ko: "세 시에 만나요.", en: "Let's meet at three.", note: "Hours take native numbers, minutes Sino-Korean: 세 시 삼십 분." },
      { ko: "몇 시에 시작해요?", en: "What time does it start?" },
      { ko: "지금 몇 시예요?", en: "What time is it now?" }
    ],
    "무엇|pronoun": [
      { ko: "이것이 무엇입니까?", en: "What is this?", casual: "이게 뭐야?", note: "무엇 is the written form; 뭐 is what people say." },
      { ko: "무엇을 도와드릴까요?", en: "How may I help you?", note: "The standard line from shop and hotel staff. 드리다 is the humble 주다." },
      { ko: "무엇이 제일 중요합니까?", en: "What matters most?" }
    ],
    "을 위해|expression": [
      { ko: "가족을 위해 일해요.", en: "I work for my family.", note: "Noun + 을/를 위해(서). After a verb it is -기 위해: 시험을 잘 보기 위해 공부해요." },
      { ko: "건강을 위해 운동해요.", en: "I exercise for my health." },
      { ko: "시험을 위해 열심히 공부했어요.", en: "I studied hard for the exam." }
    ],
    "할머니|noun": [
      { ko: "할머니께서 오셨어요.", en: "My grandmother has come.", note: "Family elders take 께서 and the -시- honorific on the verb." },
      { ko: "할머니, 안녕히 주무세요.", en: "Good night, Grandma." },
      { ko: "할머니 댁에 갔어요.", en: "I went to my grandmother's.", note: "댁 is the honorific 집." }
    ],
    "아름답다|adjective": [
      { ko: "경치가 아름다워요.", en: "The scenery is beautiful.", note: "아름답다 is ㅂ-irregular: 아름다워요. It is a written, weighty word — 예쁘다 is the everyday one." },
      { ko: "정말 아름다운 곳이에요.", en: "It really is a beautiful place." },
      { ko: "노래가 정말 아름다워요.", en: "The song is really beautiful." }
    ],
    "회의|noun": [
      { ko: "지금 회의 중이에요.", en: "I am in a meeting.", note: "Noun + 중이다 is 'in the middle of'." },
      { ko: "회의가 몇 시에 끝나요?", en: "What time does the meeting end?" },
      { ko: "내일 회의가 있어요.", en: "There is a meeting tomorrow." }
    ],
    "그래|conjunction": [
      { ko: "그래서 늦었어요.", en: "That is why I was late.", note: "As a conjunction 그래 lives inside 그래서 and 그래도; on its own it is the casual 'yeah'." },
      { ko: "비가 왔어요. 그래도 갔어요.", en: "It rained. I went anyway.", note: "그래도 is 'even so'." },
      { ko: "그래서 어떻게 됐어요?", en: "So what happened in the end?" }
    ],
    "내리다|verb": [
      { ko: "다음 역에서 내려요.", en: "I get off at the next stop.", note: "타다 is to board, 내리다 to get off. Where you get off takes 에서." },
      { ko: "여기에서 내려 주세요.", en: "Please let me off here." },
      { ko: "눈이 내려요.", en: "It is snowing.", note: "내리다 for weather is the bookish twin of 오다." }
    ],
    "나무|noun": [
      { ko: "나무가 많아요.", en: "There are a lot of trees." },
      { ko: "나무 아래에서 쉬었어요.", en: "We rested under a tree.", note: "나무 is also the material, wood." },
      { ko: "나무로 만들었어요.", en: "It is made of wood.", note: "로/으로 marks the material as well as the tool." }
    ],
    "지금|adverb": [
      { ko: "지금 가요.", en: "I am going now.", note: "지금 takes no 에, unlike 주말에 or 아침에." },
      { ko: "지금 뭐 하고 있어요?", en: "What are you doing right now?" },
      { ko: "지금 어디예요?", en: "Where are you now?" }
    ],
    "이때|noun": [
      { ko: "이때 전화가 왔어요.", en: "At that moment the phone rang.", note: "Written as one word, and used in telling a story: 이때, 그때, 그날." },
      { ko: "바로 이때예요.", en: "Now is the moment." },
      { ko: "이때가 제일 좋았어요.", en: "This was the best time." }
    ],
    "물건|noun": [
      { ko: "이 물건 얼마예요?", en: "How much is this item?" },
      { ko: "물건을 사러 시장에 가요.", en: "I am going to the market to buy things.", note: "-(으)러 가다 is going in order to do something." },
      { ko: "이 물건은 제 거예요.", en: "This thing is mine." }
    ],
    "만|numeral": [
      { ko: "만 원이에요.", en: "It is ten thousand won.", note: "Korean counts in units of ten thousand: 만, 십만, 백만. A hundred thousand is 십만, not 백천." },
      { ko: "십만 원 넘어요.", en: "It is over a hundred thousand won." },
      { ko: "만 명이 넘게 왔어요.", en: "More than ten thousand people came." }
    ],
    "와 관련해|expression": [
      { ko: "그 일과 관련해 말씀드릴게요.", en: "I will tell you about that matter.", note: "와 after a vowel, 과 after a consonant. Formal, written Korean — speech uses 에 대해." },
      { ko: "환경과 관련해 질문이 있어요.", en: "I have a question relating to the environment." },
      { ko: "이 사건과 관련해 조사 중이에요.", en: "An investigation is under way in relation to this case." }
    ],
    "이랑|particle": [
      { ko: "친구랑 영화 봤어.", en: "I watched a film with a friend.", note: "이랑 after a consonant, 랑 after a vowel. The most casual of 하고 / 와 / 이랑 — friends only." },
      { ko: "빵이랑 우유 샀어.", en: "I bought bread and milk." },
      { ko: "나랑 같이 갈래?", en: "Do you want to come with me?" }
    ],
    "생기다|verb": [
      { ko: "문제가 생겼어요.", en: "A problem has come up.", note: "생기다 is something coming into being on its own, so it always takes 이/가." },
      { ko: "여자 친구가 생겼어요.", en: "I have got a girlfriend." },
      { ko: "무슨 일 생겼어요?", en: "Has something happened?" }
    ],
    "발|noun": [
      { ko: "발이 아파요.", en: "My feet hurt." },
      { ko: "발이 커서 신발이 없어요.", en: "My feet are big, so there are no shoes for me.", note: "-아서/어서 gives the reason." },
      { ko: "발을 밟았어요. 죄송해요.", en: "I stepped on your foot. Sorry." }
    ],
    "자루|counter": [
      { ko: "연필 한 자루 주세요.", en: "One pencil, please.", note: "자루 counts long thin things with a handle or a shaft: pencils, pens, knives, brooms." },
      { ko: "볼펜 두 자루 샀어요.", en: "I bought two ballpoint pens." },
      { ko: "연필 몇 자루 있어요?", en: "How many pencils do you have?" }
    ],
    "아니요|interjection": [
      { ko: "아니요, 괜찮아요.", en: "No, it is fine.", casual: "아니, 괜찮아.", note: "아니요 answers a question; 아니에요 says something is not the case." },
      { ko: "아니요, 저는 학생이에요.", en: "No, I am a student." },
      { ko: "아니요, 아직 안 했어요.", en: "No, I have not done it yet." }
    ],
    "모든|determiner": [
      { ko: "모든 사람이 왔어요.", en: "Everyone came.", note: "모든 sits in front of a noun and never takes a particle; 모두 stands on its own." },
      { ko: "모든 것이 괜찮아요.", en: "Everything is fine." },
      { ko: "모든 학생이 시험을 봐요.", en: "Every student sits the exam." }
    ],
    "음악|noun": [
      { ko: "음악을 들어요.", en: "I listen to music." },
      { ko: "무슨 음악을 좋아해요?", en: "What music do you like?" },
      { ko: "음악을 들으면서 공부해요.", en: "I study while listening to music.", note: "-(으)면서 links two things done at once." }
    ],
    "비|noun": [
      { ko: "비가 와요.", en: "It is raining.", note: "Rain 'comes' in Korean, and takes 이/가." },
      { ko: "비가 올 것 같아요.", en: "It looks like rain.", note: "-(으)ㄹ 것 같다 is the everyday way to hedge a guess." },
      { ko: "우산 가져왔어요? 비가 와요.", en: "Did you bring an umbrella? It is raining." }
    ],
    "길다|adjective": [
      { ko: "머리가 길어요.", en: "Your hair is long.", note: "길다 is ㄹ-irregular: 깁니다, 긴." },
      { ko: "이야기가 너무 길어요.", en: "The story is far too long." },
      { ko: "긴 머리가 잘 어울려요.", en: "Long hair suits you." }
    ],
    "사용하다|verb": [
      { ko: "이거 사용해도 돼요?", en: "May I use this?", note: "사용하다 is the formal twin of 쓰다; both work here." },
      { ko: "카드를 사용할 수 있어요?", en: "Can I use a card?" },
      { ko: "이 방법을 사용해 보세요.", en: "Try using this method." }
    ],
    "고향|noun": [
      { ko: "고향이 어디예요?", en: "Where is your hometown?", note: "A standard small-talk question, asked long after you have met." },
      { ko: "고향에 가고 싶어요.", en: "I want to go home to my hometown." },
      { ko: "고향이 그리워요.", en: "I miss my hometown.", note: "그립다 is ㅂ-irregular: 그리워요." }
    ],
    "을 바탕으로|expression": [
      { ko: "경험을 바탕으로 이야기할게요.", en: "I will speak from experience.", note: "Noun + 을/를 바탕으로, 'on the basis of'. Written Korean, common in reports and essays." },
      { ko: "이 영화는 실화를 바탕으로 만들었어요.", en: "This film was based on a true story." },
      { ko: "자료를 바탕으로 설명할게요.", en: "I will explain on the basis of the data." }
    ],
    "상관없어요|phrase": [
      { ko: "상관없어요.", en: "It does not matter.", casual: "상관없어.", note: "Said flatly it can sound cold — 괜찮아요 or 아무거나 좋아요 is warmer." },
      { ko: "저는 상관없어요. 편한 대로 하세요.", en: "It is all the same to me. Do as suits you." },
      { ko: "어디든 상관없어요.", en: "Anywhere is fine by me." }
    ],
    "쪽|dependent noun": [
      { ko: "이쪽으로 오세요.", en: "Come this way.", note: "이쪽 / 그쪽 / 저쪽 follow the same near-you-there split as 이 / 그 / 저." },
      { ko: "오른쪽으로 가세요.", en: "Go to the right.", note: "오른쪽 right, 왼쪽 left." },
      { ko: "십 쪽을 펴세요.", en: "Open to page ten.", note: "쪽 is also the page counter, with Sino-Korean numbers." }
    ],
    "주다|auxiliary verb": [
      { ko: "천천히 말해 주세요.", en: "Please speak slowly.", note: "-아/어 주다 asks for the action as a favour to you. Without it, 말하세요 is an instruction." },
      { ko: "사진 좀 찍어 주세요.", en: "Could you take a photo for me?" },
      { ko: "도와주셔서 감사합니다.", en: "Thank you for helping me.", note: "-시- honours the helper; 주시다 is the honorific of 주다." }
    ],
    "대전|proper noun": [
      { ko: "대전은 서울과 부산 사이에 있어요.", en: "Daejeon lies between Seoul and Busan." },
      { ko: "대전에서 기차를 갈아탔어요.", en: "I changed trains at Daejeon.", note: "갈아타다 is to change vehicles." },
      { ko: "대전에서 일한 적이 있어요.", en: "I have worked in Daejeon." }
    ],
    "인공 지능|noun phrase": [
      { ko: "인공 지능이 빠르게 발전하고 있어요.", en: "Artificial intelligence is developing fast." },
      { ko: "인공 지능에 대해 공부하고 있어요.", en: "I am studying artificial intelligence." },
      { ko: "인공 지능이 일자리를 바꾸고 있어요.", en: "AI is changing the world of work." }
    ],
    "은행|noun": [
      { ko: "은행이 몇 시에 문을 열어요?", en: "What time does the bank open?" },
      { ko: "은행에서 돈을 찾았어요.", en: "I withdrew money at the bank.", note: "Money is 'found' at a bank in Korean: 돈을 찾다." },
      { ko: "은행 앞에서 만나요.", en: "Let's meet in front of the bank." }
    ],
    "결혼|noun": [
      { ko: "결혼했어요?", en: "Are you married?", note: "결혼하다 takes 와/과 or 하고 for the spouse: 친구와 결혼했어요." },
      { ko: "결혼 축하합니다!", en: "Congratulations on your wedding!" },
      { ko: "다음 달에 결혼해요.", en: "I am getting married next month." }
    ],
    "아직|adverb": [
      { ko: "아직 안 먹었어요.", en: "I have not eaten yet.", note: "아직 usually brings a negative with it; its opposite is 벌써, 'already'." },
      { ko: "아직 멀었어요?", en: "Are we nearly there?", note: "Literally 'is it still far' — what you ask on a long journey." },
      { ko: "아직 잘 몰라요.", en: "I still do not really know." }
    ],
    "동생|noun": [
      { ko: "동생이 두 명 있어요.", en: "I have two younger siblings.", note: "동생 does not say the gender; 남동생 and 여동생 do." },
      { ko: "제 동생이에요.", en: "This is my younger brother." },
      { ko: "동생하고 사이가 좋아요.", en: "I get on well with my younger sibling." }
    ],
    "들어오다|verb": [
      { ko: "들어오세요.", en: "Come in.", note: "들어오다 comes in toward the speaker; 들어가다 goes in away from them." },
      { ko: "방금 들어왔어요.", en: "I have just got in." },
      { ko: "여기로 들어오세요.", en: "Come in this way." }
    ],
    "그거|pronoun": [
      { ko: "그거 주세요.", en: "Give me that one, please.", note: "그거 is 그것 in speech, and what you actually say while pointing." },
      { ko: "그거 얼마예요?", en: "How much is that?" },
      { ko: "그거 어디에서 샀어요?", en: "Where did you buy that?" }
    ],
    "오후|noun": [
      { ko: "오후에 만나요.", en: "Let's meet in the afternoon.", note: "오전 is before noon, 오후 after — they also carry a.m. and p.m. in front of a clock time: 오후 세 시." },
      { ko: "오늘 오후에 시간 있어요?", en: "Do you have time this afternoon?" },
      { ko: "오후 세 시에 시작해요.", en: "It starts at three in the afternoon." }
    ],
    "도|particle": [
      { ko: "저도 갈게요.", en: "I will come too.", note: "도 replaces 은/는 and 이/가 rather than stacking with them — 저도, never 저는도." },
      { ko: "이것도 주세요.", en: "This one as well, please." },
      { ko: "하나도 없어요.", en: "There is not a single one.", note: "With a negative, 도 turns into 'not even one'." }
    ],
    "아기|noun": [
      { ko: "아기가 자고 있어요.", en: "The baby is sleeping." },
      { ko: "아기가 정말 귀여워요.", en: "The baby is so cute.", note: "귀엽다 is ㅂ-irregular: 귀여워요." },
      { ko: "아기가 몇 개월이에요?", en: "How many months old is the baby?" }
    ],
    "을 중심으로|expression": [
      { ko: "서울을 중심으로 발전했어요.", en: "It developed with Seoul at the centre.", note: "Noun + 을/를 중심으로, 'centring on'. Written Korean, common in reports." },
      { ko: "이 문제를 중심으로 이야기해요.", en: "Let's talk with this problem as the focus." },
      { ko: "젊은 사람들을 중심으로 인기가 많아요.", en: "It is popular, mainly among young people." }
    ],

    // ================================================================= day 8
    "열|numeral": [
      { ko: "열 개 주세요.", en: "Ten, please.", note: "Native 열 counts objects; Sino-Korean 십 is for dates, money and phone numbers." },
      { ko: "열 시에 만나요.", en: "Let's meet at ten.", note: "Hours are native: 열 시. Minutes are Sino-Korean: 십 분." },
      { ko: "열 명이 왔어요.", en: "Ten people came." }
    ],
    "힘들다|adjective": [
      { ko: "일이 너무 힘들어요.", en: "The work is really tough.", note: "힘들다 is ㄹ-irregular: 힘듭니다. It covers physical effort and emotional strain alike." },
      { ko: "힘들면 쉬세요.", en: "Rest if it is too much.", note: "-(으)면 is 'if, when'." },
      { ko: "힘든 하루였어요.", en: "It has been a hard day." }
    ],
    "아저씨|noun": [
      { ko: "아저씨, 여기요!", en: "Excuse me! (to a middle-aged man)", note: "How you hail a taxi driver or a shopkeeper. To a woman it is 아주머니 or 이모." },
      { ko: "옆집 아저씨예요.", en: "He is the man from next door." },
      { ko: "아저씨, 이거 얼마예요?", en: "Excuse me, how much is this?" }
    ],
    "타다|verb": [
      { ko: "버스를 타요.", en: "I take the bus.", note: "What you ride takes 을/를, never 에 — 버스를 타요." },
      { ko: "택시를 타고 갈까요?", en: "Shall we go by taxi?" },
      { ko: "어디에서 타요?", en: "Where do I get on?" }
    ],
    "옛날|noun": [
      { ko: "옛날에는 여기가 바다였어요.", en: "This used to be the sea long ago." },
      { ko: "옛날 이야기를 해 주세요.", en: "Tell me a story from the old days.", note: "옛날이야기 written together means a folk tale." },
      { ko: "옛날에 여기에 살았어요.", en: "I used to live here long ago." }
    ],
    "딸|noun": [
      { ko: "딸이 하나 있어요.", en: "I have one daughter." },
      { ko: "제 딸이에요.", en: "This is my daughter." },
      { ko: "딸이 학교에 다녀요.", en: "My daughter is at school." }
    ],
    "왜냐하면|conjunction": [
      { ko: "안 갔어요. 왜냐하면 아팠거든요.", en: "I did not go, because I was ill.", note: "왜냐하면 opens the reason and usually closes with -기 때문이다 or -거든요." },
      { ko: "한국어를 배워요. 왜냐하면 한국에서 일하고 싶기 때문이에요.", en: "I am learning Korean, because I want to work in Korea." },
      { ko: "못 가요. 왜냐하면 일이 많거든요.", en: "I cannot go, because I have a lot of work." }
    ],
    "마지막|noun": [
      { ko: "마지막 버스가 몇 시예요?", en: "What time is the last bus?" },
      { ko: "이게 마지막이에요.", en: "This is the last one." },
      { ko: "마지막으로 한 번만 더 해 보세요.", en: "Give it one last try." }
    ],
    "에 관해|expression": [
      { ko: "그 일에 관해 이야기합시다.", en: "Let's talk about that matter.", note: "에 관해(서) and 에 대해(서) are near twins; 에 관해 is the more formal of the two." },
      { ko: "이 문제에 관해 어떻게 생각해요?", en: "What do you think regarding this problem?" },
      { ko: "환경에 관해 발표했어요.", en: "I gave a presentation regarding the environment." }
    ],
    "보내다|verb": [
      { ko: "편지를 보냈어요.", en: "I sent a letter." },
      { ko: "주말 잘 보내세요.", en: "Have a good weekend.", note: "보내다 is also to spend time: 좋은 하루 보내세요." },
      { ko: "문자 보낼게요.", en: "I will text you." }
    ],
    "분|dependent noun": [
      { ko: "십 분만 기다려 주세요.", en: "Please wait just ten minutes.", note: "Minutes take Sino-Korean numbers: 십 분, 삼십 분." },
      { ko: "몇 분이세요?", en: "How many are in your party?", note: "The same 분 is the honorific counter for people: 세 분 오셨어요." },
      { ko: "삼십 분쯤 걸려요.", en: "It takes about thirty minutes." }
    ],
    "병원|noun": [
      { ko: "병원에 가야 해요.", en: "I have to go to the hospital.", note: "In Korea 병원 covers any clinic, so it does not imply an emergency." },
      { ko: "병원에서 일해요.", en: "I work at a hospital." },
      { ko: "병원에 입원했어요.", en: "They were admitted to hospital." }
    ],
    "몇|determiner": [
      { ko: "몇 사람이 왔어요.", en: "A few people came.", note: "몇 in a statement means 'a few'; in a question it means 'how many'." },
      { ko: "몇 가지만 물어볼게요.", en: "Let me ask just a few things." },
      { ko: "몇 년 전에 만났어요.", en: "We met a few years ago." }
    ],
    "어쩔 수 없어요|phrase": [
      { ko: "어쩔 수 없어요.", en: "There is nothing to be done.", casual: "어쩔 수 없지.", note: "A resigned shrug at something outside anyone's control." },
      { ko: "비가 와서 어쩔 수 없어요.", en: "It is raining, so there is nothing for it." },
      { ko: "늦었지만 어쩔 수 없어요.", en: "We are late, but there is nothing for it." }
    ],
    "경찰|noun": [
      { ko: "경찰에 신고했어요.", en: "I reported it to the police.", note: "The organisation takes 에; a person takes 에게." },
      { ko: "경찰서가 어디에 있어요?", en: "Where is the police station?" },
      { ko: "경찰이 왔어요.", en: "The police have come." }
    ],
    "조각|counter": [
      { ko: "케이크 한 조각 주세요.", en: "One slice of cake, please.", note: "조각 counts slices and broken-off pieces." },
      { ko: "피자 두 조각 먹었어요.", en: "I ate two slices of pizza." },
      { ko: "빵 한 조각만 주세요.", en: "Just one slice of bread, please." }
    ],
    "그럼|interjection": [
      { ko: "그럼요, 당연하죠.", en: "Of course, naturally.", note: "As an interjection 그럼 is a warm yes; as a conjunction it is 그러면 shortened." },
      { ko: "그럼, 내일 봐요.", en: "Right then, see you tomorrow." },
      { ko: "그럼, 제가 도와드릴게요.", en: "Of course, I will help you." }
    ],
    "같이|adverb": [
      { ko: "같이 가요.", en: "Let's go together.", note: "Pronounced 가치. 함께 is its written twin." },
      { ko: "친구하고 같이 살아요.", en: "I live with a friend." },
      { ko: "같이 먹을래요?", en: "Shall we eat together?" }
    ],
    "저녁|noun": [
      { ko: "저녁에 뭐 해요?", en: "What are you doing this evening?" },
      { ko: "저녁 먹었어요?", en: "Have you had dinner?", note: "아침, 점심 and 저녁 are each both the time of day and the meal." },
      { ko: "같이 저녁 먹을래요?", en: "Would you like to have dinner together?" }
    ],
    "아프다|adjective": [
      { ko: "어디가 아파요?", en: "Where does it hurt?", note: "The body part takes 이/가. 아프다 is ㅡ-irregular: 아파요." },
      { ko: "배가 아파요.", en: "I have a stomach ache." },
      { ko: "어제부터 아팠어요.", en: "I have been ill since yesterday." }
    ],
    "다니다|verb": [
      { ko: "학교에 다녀요.", en: "I go to school.", note: "다니다 is going somewhere regularly — a school, a job, a gym. 가다 is one single trip." },
      { ko: "회사에 다닌 지 삼 년 됐어요.", en: "I have worked at the company for three years.", note: "-(으)ㄴ 지 … 됐다 counts how long since something started." },
      { ko: "헬스장에 다녀요.", en: "I go to the gym." }
    ],
    "만|particle": [
      { ko: "이것만 주세요.", en: "Just this one, please.", note: "만 attaches straight to the noun and pushes out 은/는 and 이/가." },
      { ko: "조금만 기다려 주세요.", en: "Please wait just a moment." },
      { ko: "저만 몰랐어요.", en: "I was the only one who did not know." }
    ],
    "시험|noun": [
      { ko: "내일 시험을 봐요.", en: "I have an exam tomorrow.", note: "Exams are 'seen' in Korean: 시험을 보다." },
      { ko: "시험 잘 봤어요?", en: "Did the exam go well?" },
      { ko: "시험에 합격했어요.", en: "I passed the exam.", note: "합격하다 takes 에." }
    ],
    "잠|noun": [
      { ko: "잠을 못 잤어요.", en: "I could not sleep.", note: "Sleep is 'slept' with its own verb: 잠을 자다." },
      { ko: "잠이 안 와요.", en: "I cannot get to sleep.", note: "Literally 'sleep does not come'." },
      { ko: "잠을 푹 자야 해요.", en: "You need a proper sleep." }
    ],
    "에 반해|expression": [
      { ko: "형에 반해 동생은 조용해요.", en: "In contrast to his brother, the younger one is quiet.", note: "Noun + 에 반해, setting two things against each other. Written Korean." },
      { ko: "작년에 반해 올해는 따뜻해요.", en: "In contrast to last year, this year is warm." },
      { ko: "예상에 반해 결과가 좋았어요.", en: "Contrary to expectations, the result was good." }
    ],
    "마흔|numeral": [
      { ko: "올해 마흔이 됐어요.", en: "I turned forty this year.", note: "Ages take native numbers: 스물, 서른, 마흔, 쉰." },
      { ko: "마흔 명쯤 왔어요.", en: "About forty people came." },
      { ko: "마흔 살이 넘었어요.", en: "They are over forty." }
    ],
    "건강|noun": [
      { ko: "건강이 제일 중요해요.", en: "Health matters most." },
      { ko: "건강하세요.", en: "Stay well.", note: "A common closing wish to someone older." },
      { ko: "건강을 조심하세요.", en: "Take care of your health." }
    ],
    "여기|pronoun": [
      { ko: "여기가 어디예요?", en: "Where are we?" },
      { ko: "여기 앉으세요.", en: "Sit here, please." },
      { ko: "여기요!", en: "Excuse me!", note: "How you call a waiter over — 저기요 does the same job." }
    ],
    "건물|noun": [
      { ko: "저 건물이 뭐예요?", en: "What is that building?" },
      { ko: "건물 안으로 들어가세요.", en: "Please go into the building." },
      { ko: "이 건물은 아주 오래됐어요.", en: "This building is very old." }
    ],
    "열다|verb": [
      { ko: "문 좀 열어 주세요.", en: "Please open the door.", note: "열다 is ㄹ-irregular: 엽니다. Its opposite is 닫다." },
      { ko: "가게는 몇 시에 열어요?", en: "What time does the shop open?" },
      { ko: "창문을 열어도 돼요?", en: "May I open the window?" }
    ],
    "외국|noun": [
      { ko: "외국에 가 본 적이 있어요?", en: "Have you ever been abroad?", note: "-아/어 본 적이 있다 is the full 'have you ever' construction." },
      { ko: "저는 외국 사람이에요.", en: "I am a foreigner.", note: "외국인 is the single-word noun; 외국 사람 is what people say." },
      { ko: "외국에서 공부하고 싶어요.", en: "I want to study abroad." }
    ],
    "경주|proper noun": [
      { ko: "경주에 오래된 절이 많아요.", en: "There are many old temples in Gyeongju." },
      { ko: "경주로 여행 갈까요?", en: "Shall we take a trip to Gyeongju?" },
      { ko: "경주는 신라의 수도였어요.", en: "Gyeongju was the capital of Silla." }
    ],
    "정보 통신|noun phrase": [
      { ko: "정보 통신 기술이 빠르게 변해요.", en: "Information technology changes fast." },
      { ko: "정보 통신 회사에서 일해요.", en: "I work at an IT company." },
      { ko: "정보 통신 분야에서 일해요.", en: "I work in the IT field." }
    ],
    "밑|noun": [
      { ko: "책상 밑에 있어요.", en: "It is under the desk.", note: "밑 is directly underneath; 아래 is the broader 'below'." },
      { ko: "의자 밑을 보세요.", en: "Look under the chair." },
      { ko: "침대 밑에 넣어 두세요.", en: "Put it under the bed." }
    ],
    "로 인해|expression": [
      { ko: "비로 인해 경기가 취소됐어요.", en: "The match was cancelled because of rain.", note: "로 after a vowel or ㄹ, 으로 otherwise. Formal written cause — speech uses 때문에." },
      { ko: "사고로 인해 길이 막혔어요.", en: "The road was blocked due to an accident." },
      { ko: "태풍으로 인해 비행기가 취소됐어요.", en: "The flight was cancelled due to the typhoon." }
    ],
    "적다|adjective": [
      { ko: "사람이 적어요.", en: "There are few people.", note: "적다 is few in number; 작다 is small in size, and the two get mixed up constantly." },
      { ko: "월급이 너무 적어요.", en: "The salary is far too low." },
      { ko: "이번에는 손님이 적어요.", en: "There are fewer customers this time." }
    ],
    "시간|dependent noun": [
      { ko: "세 시간 걸려요.", en: "It takes three hours.", note: "시간 counts hours with native numbers; 시 names the hour on the clock." },
      { ko: "몇 시간 잤어요?", en: "How many hours did you sleep?" },
      { ko: "한 시간 후에 만나요.", en: "Let's meet in an hour." }
    ],
    "어른|noun": [
      { ko: "어른한테는 높임말을 써요.", en: "You use polite speech with adults.", note: "높임말 is honorific speech, 반말 its opposite." },
      { ko: "어른 두 명, 아이 한 명이에요.", en: "Two adults and one child." },
      { ko: "어른이 되면 알게 돼요.", en: "You will understand when you grow up." }
    ],
    "묻다|verb": [
      { ko: "길을 물어봤어요.", en: "I asked for directions.", note: "묻다 is ㄷ-irregular: 물어요, 물었어요. 물어보다 is the everyday form." },
      { ko: "하나만 물어봐도 돼요?", en: "May I ask you just one thing?" },
      { ko: "선생님께 여쭤봤어요.", en: "I asked the teacher.", note: "여쭙다 is the humble 묻다, for asking someone senior." }
    ],
    "조금|noun": [
      { ko: "조금만 주세요.", en: "Just a little, please.", note: "좀 is 조금 shortened, and softens requests rather than measuring an amount." },
      { ko: "조금 기다려 주세요.", en: "Please wait a little." },
      { ko: "조금 전에 왔어요.", en: "I arrived a moment ago." }
    ],
    "못|adverb": [
      { ko: "저는 수영을 못해요.", en: "I cannot swim.", note: "못 is inability; 안 is choosing not to. 하다 verbs split: 수영 못 해요." },
      { ko: "어제 못 갔어요.", en: "I could not go yesterday." },
      { ko: "잘 못 들었어요.", en: "I did not catch that." }
    ],
    "그럴 리가요|phrase": [
      { ko: "그럴 리가요.", en: "That cannot be.", casual: "그럴 리가.", note: "-(으)ㄹ 리가 없다 is 'there is no way'. This is the polite, surprised version." },
      { ko: "그럴 리가요, 확인해 보세요.", en: "Surely not — do check." },
      { ko: "그럴 리가요, 제가 봤는데요.", en: "Surely not — I saw it myself." }
    ],
    "팀|noun": [
      { ko: "우리 팀이 이겼어요.", en: "Our team won." },
      { ko: "어느 팀을 좋아해요?", en: "Which team do you support?" },
      { ko: "저는 이 팀에서 일해요.", en: "I work on this team." }
    ],
    "부터|particle": [
      { ko: "아홉 시부터 일해요.", en: "I work from nine.", note: "부터 is the starting point in time; 에서 is the starting point in space." },
      { ko: "처음부터 다시 하세요.", en: "Start again from the beginning." },
      { ko: "월요일부터 금요일까지 일해요.", en: "I work from Monday to Friday.", note: "부터 … 까지 is the 'from … to' pair." }
    ],
    "부모|noun": [
      { ko: "부모님께서 한국에 오세요.", en: "My parents are coming to Korea.", note: "Always 부모님 when you mean actual people — bare 부모 is the abstract term." },
      { ko: "부모님께 전화했어요.", en: "I called my parents." },
      { ko: "부모님 덕분이에요.", en: "It is thanks to my parents." }
    ],
    "기다리다|verb": [
      { ko: "잠깐만 기다려 주세요.", en: "Please wait a moment." },
      { ko: "얼마나 기다렸어요?", en: "How long did you wait?" },
      { ko: "여기에서 기다릴게요.", en: "I will wait here." }
    ],
    "무슨|determiner": [
      { ko: "무슨 일이에요?", en: "What is the matter?" },
      { ko: "무슨 음악을 좋아해요?", en: "What kind of music do you like?", note: "무슨 asks which thing; 어떤 asks what sort; 어느 asks which of a known set." },
      { ko: "무슨 요일이에요?", en: "What day of the week is it?" }
    ],
    "을 비롯해|expression": [
      { ko: "서울을 비롯해 여러 도시에 갔어요.", en: "I went to several cities, Seoul among them.", note: "Noun + 을/를 비롯해(서), naming the leading example first. Written Korean." },
      { ko: "김치를 비롯해 한국 음식을 좋아해요.", en: "I like Korean food, kimchi above all." },
      { ko: "선생님을 비롯해 모두 오셨어요.", en: "Everyone came, the teacher included." }
    ],
    "그날|noun": [
      { ko: "그날 비가 많이 왔어요.", en: "It rained hard that day.", note: "Written as one word." },
      { ko: "그날 이후로 못 봤어요.", en: "I have not seen them since that day." },
      { ko: "그날을 잊을 수 없어요.", en: "I cannot forget that day." }
    ],
    "그러니까|conjunction": [
      { ko: "비가 와요. 그러니까 택시를 타요.", en: "It is raining, so let's take a taxi.", note: "그러니까 gives a reason for a suggestion or request, which 그래서 cannot do." },
      { ko: "그러니까 제 말이 맞죠?", en: "So I was right, was I not?", note: "Also the 'I mean…' that restates what you just said." },
      { ko: "늦었어요. 그러니까 서두르세요.", en: "We are late, so hurry up." }
    ],

    // ================================================================= day 9
    "담배|noun": [
      { ko: "여기에서 담배를 피우면 안 돼요.", en: "You must not smoke here.", note: "Cigarettes are 'blown' in Korean: 담배를 피우다. -(으)면 안 되다 is prohibition." },
      { ko: "담배를 끊었어요.", en: "I have given up smoking.", note: "끊다 is to cut something off — a habit, a call, a rope." },
      { ko: "담배 한 갑에 얼마예요?", en: "How much is a packet of cigarettes?" }
    ],
    "이|numeral": [
      { ko: "이월에 한국에 가요.", en: "I go to Korea in February.", note: "Sino-Korean 이 names months and dates; native 둘 counts objects." },
      { ko: "이 층에 있어요.", en: "It is on the second floor." },
      { ko: "이 번 출구로 나오세요.", en: "Come out of exit two." }
    ],
    "할아버지|noun": [
      { ko: "할아버지께서 신문을 읽고 계세요.", en: "Grandfather is reading the paper.", note: "계시다 is the honorific of 있다, so -고 계시다 is the honorific progressive." },
      { ko: "할아버지, 안녕히 주무셨어요?", en: "Good morning, Grandpa.", note: "Literally 'did you sleep well' — the morning greeting to an elder." },
      { ko: "할아버지께 인사드렸어요.", en: "I paid my respects to my grandfather." }
    ],
    "빠르다|adjective": [
      { ko: "지하철이 더 빨라요.", en: "The subway is faster.", note: "빠르다 is 르-irregular: 빨라요. The adverb is 빨리." },
      { ko: "시간이 정말 빠르네요.", en: "Time really does fly.", note: "-네요 reacts to something you have just noticed." },
      { ko: "빨리 오세요.", en: "Come quickly.", note: "빨리 is the adverb of 빠르다." }
    ],
    "판|counter": [
      { ko: "피자 한 판 시킬까요?", en: "Shall we order a pizza?", note: "판 counts flat round things — a pizza, a board game, a tray of eggs." },
      { ko: "한 판 더 할까요?", en: "Shall we play another round?" },
      { ko: "계란 한 판 샀어요.", en: "I bought a tray of eggs.", note: "A 판 of eggs is thirty." }
    ],
    "여보세요|interjection": [
      { ko: "여보세요?", en: "Hello? (on the phone)", note: "Phone calls only. Answering the door is 누구세요?" },
      { ko: "여보세요, 민수 씨 계세요?", en: "Hello, is Minsu there?", note: "계시다 is the honorific 있다, used about the person you are asking after." },
      { ko: "여보세요, 잘 안 들려요.", en: "Hello? I cannot hear you well." }
    ],
    "웃다|verb": [
      { ko: "왜 웃어요?", en: "Why are you laughing?", note: "웃다 covers both smiling and laughing; 미소 짓다 is specifically to smile." },
      { ko: "웃으면 복이 와요.", en: "Smile and fortune will follow.", note: "A set saying — literally 'if you smile, luck comes'." },
      { ko: "크게 웃었어요.", en: "We laughed out loud." }
    ],
    "환자|noun": [
      { ko: "환자가 많아요.", en: "There are a lot of patients." },
      { ko: "환자를 돌봐야 해요.", en: "I have to look after a patient.", note: "돌보다 is to care for someone." },
      { ko: "환자가 많이 좋아졌어요.", en: "The patient has improved a lot." }
    ],
    "대화|noun": [
      { ko: "대화를 나눴어요.", en: "We had a conversation.", note: "대화를 나누다 is the fixed pairing — literally 'to share a conversation'." },
      { ko: "한국어로 대화하고 싶어요.", en: "I want to hold a conversation in Korean." },
      { ko: "대화가 잘 통해요.", en: "We understand each other well.", note: "말이 통하다 and 대화가 통하다 are both used for getting on." }
    ],
    "에 불과하다|expression": [
      { ko: "그건 시작에 불과해요.", en: "That is only the beginning.", note: "Noun + 에 불과하다, 'to be nothing more than'. Written and formal." },
      { ko: "소문에 불과해요.", en: "It is nothing but a rumour." },
      { ko: "농담에 불과했어요.", en: "It was nothing more than a joke." }
    ],
    "어디|pronoun": [
      { ko: "어디 가요?", en: "Where are you going?", note: "In speech the 에 drops: 어디 가요 rather than 어디에 가요." },
      { ko: "화장실이 어디예요?", en: "Where is the toilet?" },
      { ko: "어디에서 왔어요?", en: "Where are you from?" }
    ],
    "살|dependent noun": [
      { ko: "몇 살이에요?", en: "How old are you?", casual: "몇 살이야?", note: "Ages take native numbers: 한 살, 스무 살, 서른 살. To an elder, ask 연세가 어떻게 되세요?" },
      { ko: "저는 스무 살이에요.", en: "I am twenty.", note: "스물 shortens to 스무 in front of a counter." },
      { ko: "아이가 다섯 살이에요.", en: "The child is five." }
    ],
    "못하다|auxiliary verb": [
      { ko: "어제는 자지 못했어요.", en: "I was not able to sleep last night.", note: "-지 못하다 is the long 'cannot'; 못 자다 is the short spoken one." },
      { ko: "매운 음식을 먹지 못해요.", en: "I cannot eat spicy food.", note: "못하다 is inability; 안 하다 is choosing not to." },
      { ko: "약속을 지키지 못했어요.", en: "I was unable to keep my promise." }
    ],
    "올해|noun": [
      { ko: "올해 몇 살이에요?", en: "How old are you this year?", note: "작년 last year, 올해 this year, 내년 next year." },
      { ko: "올해는 한국에 갈 거예요.", en: "This year I am going to Korea." },
      { ko: "올해 계획이 뭐예요?", en: "What are your plans this year?" }
    ],
    "이제|adverb": [
      { ko: "이제 시작해요.", en: "Let's start now.", note: "이제 marks a change from before; 지금 is the plain clock now." },
      { ko: "이제 그만하세요.", en: "That is enough now." },
      { ko: "이제 집에 가요.", en: "Let's go home now." }
    ],
    "형|noun": [
      { ko: "형이 두 명 있어요.", en: "I have two older brothers.", note: "형 is used by a man. A woman says 오빠 for the same person." },
      { ko: "형, 같이 가요.", en: "Come with me, hyung.", note: "Also how a younger man addresses an older male friend." },
      { ko: "형이 회사에 다녀요.", en: "My older brother works at a company." }
    ],
    "떠나다|verb": [
      { ko: "내일 서울을 떠나요.", en: "I leave Seoul tomorrow.", note: "What you leave takes 을/를 — 서울을 떠나다." },
      { ko: "여행을 떠나고 싶어요.", en: "I want to set off on a trip." },
      { ko: "기차가 떠났어요.", en: "The train has left." }
    ],
    "까지|particle": [
      { ko: "여기까지 왔어요.", en: "I came this far.", note: "까지 is the end point in space or time; 부터 is where it starts." },
      { ko: "다섯 시까지 오세요.", en: "Please come by five." },
      { ko: "서울에서 부산까지 얼마나 걸려요?", en: "How long does it take from Seoul to Busan?" }
    ],
    "모두|noun": [
      { ko: "모두 오세요.", en: "Everyone come along.", note: "As a noun 모두 stands on its own and can take particles; 모든 must sit in front of a noun." },
      { ko: "모두 몇 명이에요?", en: "How many are there in all?" },
      { ko: "모두 함께 사진을 찍었어요.", en: "We all took a photo together." }
    ],
    "말도 안 돼요|phrase": [
      { ko: "말도 안 돼요!", en: "That is ridiculous!", casual: "말도 안 돼!", note: "Literally 'it does not even become words'. Surprise or disbelief, and strong enough to be rude if aimed at a person." },
      { ko: "말도 안 되는 소리예요.", en: "That is nonsense." },
      { ko: "가격이 말도 안 돼요.", en: "The price is ridiculous." }
    ],
    "버스|noun": [
      { ko: "버스를 타고 가요.", en: "I go by bus.", note: "What you ride takes 을/를, never 에." },
      { ko: "버스가 언제 와요?", en: "When does the bus come?" },
      { ko: "몇 번 버스를 타야 해요?", en: "Which bus do I need to take?" }
    ],
    "넓다|adjective": [
      { ko: "방이 넓어요.", en: "The room is spacious.", note: "Pronounced 널따. Its opposite is 좁다." },
      { ko: "길이 넓어졌어요.", en: "The road has been widened.", note: "-아/어지다 turns an adjective into a change of state." },
      { ko: "마음이 넓은 사람이에요.", en: "They are a big-hearted person." }
    ],
    "에 달려 있다|expression": [
      { ko: "날씨에 달려 있어요.", en: "It depends on the weather.", note: "Noun + 에 달려 있다. For a clause, use -느냐에 달려 있다." },
      { ko: "결과는 노력에 달려 있어요.", en: "The result depends on the effort." },
      { ko: "모든 것은 당신에게 달려 있어요.", en: "Everything depends on you." }
    ],
    "사진|noun": [
      { ko: "사진 좀 찍어 주세요.", en: "Could you take a photo for me?", note: "Photos are 'stamped' in Korean: 사진을 찍다." },
      { ko: "사진을 보여 주세요.", en: "Please show me the photo." },
      { ko: "여기에서 사진을 찍어도 돼요?", en: "May I take photos here?" }
    ],
    "입다|verb": [
      { ko: "따뜻한 옷을 입으세요.", en: "Wear something warm.", note: "입다 is for clothes on the torso; hats take 쓰다, shoes 신다, gloves 끼다." },
      { ko: "이 옷 입어 봐도 돼요?", en: "May I try these on?" },
      { ko: "무슨 옷을 입을까요?", en: "What shall I wear?" }
    ],
    "제일|noun": [
      { ko: "이게 제일 좋아요.", en: "This one is the best.", note: "제일 is the spoken superlative; 가장 is its written twin." },
      { ko: "뭐가 제일 맛있어요?", en: "What is the tastiest thing here?" },
      { ko: "제일 먼저 가세요.", en: "You go first." }
    ],
    "한강|proper noun": [
      { ko: "한강에서 산책했어요.", en: "I took a walk by the Han River." },
      { ko: "주말에 한강에 가요.", en: "I go to the Han River at the weekend." },
      { ko: "한강 공원에서 자전거를 탔어요.", en: "I rode a bike in Han River Park." }
    ],
    "일자리 창출|noun phrase": [
      { ko: "일자리 창출이 중요해요.", en: "Job creation is important." },
      { ko: "정부가 일자리 창출을 위해 노력하고 있어요.", en: "The government is working to create jobs." },
      { ko: "일자리 창출 효과가 커요.", en: "The effect on job creation is significant." }
    ],
    "스물|numeral": [
      { ko: "스무 살이에요.", en: "I am twenty.", note: "스물 shortens to 스무 in front of a counter — 스무 개, 스무 명." },
      { ko: "스물다섯 명이 왔어요.", en: "Twenty-five people came." },
      { ko: "스물한 명이 왔어요.", en: "Twenty-one people came." }
    ],
    "다리|noun": [
      { ko: "다리가 아파요.", en: "My legs hurt." },
      { ko: "다리를 건너세요.", en: "Cross the bridge.", note: "The same 다리 is a leg and a bridge." },
      { ko: "다리를 다쳤어요.", en: "I hurt my leg." }
    ],
    "해|noun": [
      { ko: "새해 복 많이 받으세요.", en: "Happy New Year.", note: "The standard New Year greeting — literally 'receive much fortune'." },
      { ko: "해가 떴어요.", en: "The sun has risen.", note: "해 is also the sun itself." },
      { ko: "올해가 좋은 해였어요.", en: "This has been a good year." }
    ],
    "세|determiner": [
      { ko: "세 개 주세요.", en: "Three, please.", note: "셋 shortens to 세 in front of a counter — 세 개, 세 명, 세 시간." },
      { ko: "세 시에 만나요.", en: "Let's meet at three." },
      { ko: "세 명이 왔어요.", en: "Three people came." }
    ],
    "마시다|verb": [
      { ko: "물을 많이 마셔요.", en: "I drink a lot of water." },
      { ko: "커피 마실래요?", en: "Do you fancy a coffee?" },
      { ko: "약은 마시지 않고 먹어요.", en: "Medicine is eaten, not drunk.", note: "Korean eats medicine — 약을 먹다 — however liquid it is." }
    ],
    "여름|noun": [
      { ko: "여름에 바다에 가요.", en: "I go to the sea in summer." },
      { ko: "한국 여름은 너무 더워요.", en: "Korean summers are far too hot.", note: "덥다 is ㅂ-irregular: 더워요." },
      { ko: "여름 방학에 뭐 해요?", en: "What are you doing in the summer holidays?" }
    ],
    "을 막론하고|expression": [
      { ko: "남녀를 막론하고 좋아해요.", en: "Men and women alike enjoy it.", note: "Noun + 을/를 막론하고, 'regardless of'. Formal, and usually with a paired noun in front." },
      { ko: "이유를 막론하고 늦으면 안 돼요.", en: "Whatever the reason, you must not be late." },
      { ko: "나이를 막론하고 누구나 할 수 있어요.", en: "Anyone can do it, whatever their age." }
    ],
    "달|dependent noun": [
      { ko: "세 달 동안 배웠어요.", en: "I studied for three months.", note: "달 takes native numbers: 한 달, 두 달. Its Sino-Korean twin 개월 takes 일, 이, 삼." },
      { ko: "한 달에 한 번 만나요.", en: "We meet once a month.", note: "Period + 에 + frequency is 'per'." },
      { ko: "두 달 후에 만나요.", en: "Let's meet in two months." }
    ],
    "값|noun": [
      { ko: "값이 너무 비싸요.", en: "The price is far too high.", note: "Pronounced 갑. 가격 is the more formal word for a price." },
      { ko: "값을 깎아 주세요.", en: "Could you lower the price?" },
      { ko: "값이 많이 올랐어요.", en: "The price has gone up a lot." }
    ],
    "물론|adverb": [
      { ko: "물론이에요.", en: "Of course.", note: "물론 on its own also works as a one-word yes." },
      { ko: "물론 저도 갈 거예요.", en: "Of course I am going too." },
      { ko: "물론 알고 있어요.", en: "Of course I know." }
    ],
    "마다|particle": [
      { ko: "날마다 운동해요.", en: "I exercise every day.", note: "마다 attaches straight to the noun: 날마다, 사람마다, 주말마다." },
      { ko: "사람마다 생각이 달라요.", en: "Everyone thinks differently." },
      { ko: "주말마다 등산해요.", en: "I go hiking every weekend." }
    ],
    "자동차|noun": [
      { ko: "자동차를 샀어요.", en: "I bought a car.", note: "차 is what people say; 자동차 is the full, formal word." },
      { ko: "자동차로 두 시간 걸려요.", en: "It takes two hours by car." },
      { ko: "자동차가 고장 났어요.", en: "My car has broken down." }
    ],
    "가깝다|adjective": [
      { ko: "집에서 가까워요.", en: "It is close to my house.", note: "가깝다 is ㅂ-irregular: 가까워요. Its opposite is 멀다." },
      { ko: "가까운 역이 어디예요?", en: "Where is the nearest station?" },
      { ko: "저희 집은 학교에서 가까워요.", en: "Our house is near the school." }
    ],
    "치다|verb": [
      { ko: "피아노를 칠 수 있어요?", en: "Can you play the piano?", note: "치다 is for instruments you strike — piano, drums, guitar. Wind instruments take 불다." },
      { ko: "테니스를 쳐요.", en: "I play tennis.", note: "Racket sports are 'hit' too: 테니스를 치다, 골프를 치다." },
      { ko: "박수를 쳤어요.", en: "We clapped.", note: "박수를 치다 is the fixed pairing for applause." }
    ],
    "그러므로|conjunction": [
      { ko: "비가 왔다. 그러므로 경기가 취소되었다.", en: "It rained. Therefore the match was cancelled.", note: "Written Korean, at home in essays and reports. Speech uses 그래서 or 그러니까." },
      { ko: "건강이 중요하다. 그러므로 운동해야 한다.", en: "Health is important. Therefore one must exercise." },
      { ko: "이것은 사실이다. 그러므로 믿어야 한다.", en: "This is a fact. Therefore it must be believed." }
    ],
    "어린이|noun": [
      { ko: "어린이는 무료예요.", en: "Children go free." },
      { ko: "오월 오일은 어린이날이에요.", en: "The fifth of May is Children's Day.", note: "어린이 is the respectful word for a child in signs and public notices; 아이 is the everyday one." },
      { ko: "어린이 책을 샀어요.", en: "I bought a children's book." }
    ],
    "척|counter": [
      { ko: "배 두 척이 있어요.", en: "There are two ships.", note: "척 counts boats and ships of any size." },
      { ko: "큰 배 한 척이 들어왔어요.", en: "A large ship has come in." },
      { ko: "배 세 척이 떠났어요.", en: "Three ships have left." }
    ],
    "안녕|interjection": [
      { ko: "안녕!", en: "Hi! / Bye!", note: "Casual only — for friends and children. It works both for arriving and leaving." },
      { ko: "안녕, 내일 봐.", en: "Bye, see you tomorrow." },
      { ko: "안녕, 오랜만이야!", en: "Hi, long time no see!" }
    ],
    "이것|pronoun": [
      { ko: "이것은 제 책이에요.", en: "This is my book.", casual: "이거 내 책이야.", note: "이것 is the written form; 이거 is what people say." },
      { ko: "이것 좀 보세요.", en: "Please take a look at this." },
      { ko: "이것과 저것 중에 뭐가 좋아요?", en: "Which is better, this or that?" }
    ],
    "그러게요|phrase": [
      { ko: "그러게요.", en: "I know, right?", casual: "그러게.", note: "Agreeing with something the other person has just observed — often with a note of 'I did say so'." },
      { ko: "그러게요, 저도 그렇게 생각했어요.", en: "Right? I thought the same thing." },
      { ko: "그러게요, 날씨가 참 좋네요.", en: "I know — the weather really is lovely." }
    ],
    "말씀|noun": [
      { ko: "말씀 좀 묻겠습니다.", en: "May I ask you something?", note: "말씀 is the honorific 말, and this is how you stop a stranger to ask for directions." },
      { ko: "선생님 말씀이 맞아요.", en: "The teacher is right." },
      { ko: "말씀 많이 들었습니다.", en: "I have heard a lot about you.", note: "The standard line on being introduced to someone." }
    ],
    "에도 불구하고|expression": [
      { ko: "비에도 불구하고 갔어요.", en: "We went in spite of the rain.", note: "Noun + 에도 불구하고. After a verb it is -(으)ㄴ/는데도 불구하고. Formal written Korean." },
      { ko: "어려움에도 불구하고 성공했어요.", en: "They succeeded in spite of the difficulties." },
      { ko: "바쁨에도 불구하고 와 주셨어요.", en: "You came in spite of being busy." }
    ],

    // ================================================================ day 10
    "눈물|noun": [
      { ko: "눈물이 났어요.", en: "Tears came to my eyes.", note: "눈물이 나다 is the fixed pairing — tears 'arise', so they take 이/가." },
      { ko: "눈물을 닦으세요.", en: "Wipe your tears." },
      { ko: "눈물이 나올 것 같아요.", en: "I feel like I am going to cry." }
    ],
    "주인|noun": [
      { ko: "이 가게 주인이 친절해요.", en: "The owner of this shop is kind." },
      { ko: "이 우산 주인이 누구예요?", en: "Whose umbrella is this?" },
      { ko: "개 주인을 찾고 있어요.", en: "I am looking for the dog's owner." }
    ],
    "끝나다|verb": [
      { ko: "수업이 몇 시에 끝나요?", en: "What time does the class end?", note: "끝나다 is what ends by itself; 끝내다 is ending something." },
      { ko: "일이 끝나고 만나요.", en: "Let's meet after work." },
      { ko: "드디어 끝났어요!", en: "It is finally over!" }
    ],
    "반|noun": [
      { ko: "세 시 반에 만나요.", en: "Let's meet at half past three.", note: "반 is the half hour: 시 + 반." },
      { ko: "우리 반에 스무 명이 있어요.", en: "There are twenty in my class.", note: "The same 반 is a school class." },
      { ko: "반만 주세요.", en: "Half will do, thanks." }
    ],
    "구|numeral": [
      { ko: "구월에 학교가 시작해요.", en: "School starts in September.", note: "Sino-Korean 구 names months and dates; native 아홉 counts objects." },
      { ko: "구 번 버스를 타세요.", en: "Take the number nine bus." },
      { ko: "구 층에 있어요.", en: "It is on the ninth floor." }
    ],
    "귀|noun": [
      { ko: "귀가 아파요.", en: "My ear hurts." },
      { ko: "귀에 익은 노래예요.", en: "That song sounds familiar.", note: "Literally 'the song is worn into my ear'." },
      { ko: "귀가 잘 안 들려요.", en: "I cannot hear very well." }
    ],
    "재미있다|adjective": [
      { ko: "이 영화 재미있어요.", en: "This film is good fun.", note: "Used of films, classes and people alike. The opposite is one word: 재미없어요." },
      { ko: "한국어 공부가 재미있어요.", en: "Studying Korean is fun." },
      { ko: "재미있는 이야기 좀 해 주세요.", en: "Tell me an interesting story." }
    ],
    "아파트|noun": [
      { ko: "아파트에 살아요.", en: "I live in a flat.", note: "In Korea 아파트 means a flat in a tower block, which is how most people live." },
      { ko: "아파트가 비싸요.", en: "Flats are expensive." },
      { ko: "아파트 몇 층에 살아요?", en: "Which floor of the flats do you live on?" }
    ],
    "기 마련이다|expression": [
      { ko: "누구나 실수하기 마련이에요.", en: "Everyone is bound to make mistakes.", note: "Verb stem + -기 마련이다: it is in the nature of things." },
      { ko: "처음에는 어렵기 마련이에요.", en: "It is bound to be hard at first." },
      { ko: "시간이 지나면 잊히기 마련이에요.", en: "With time, things are bound to be forgotten." }
    ],
    "돌아오다|verb": [
      { ko: "언제 돌아와요?", en: "When are you coming back?", note: "돌아오다 comes back toward the speaker; 돌아가다 goes back away from them." },
      { ko: "집에 돌아왔어요.", en: "I am back home." },
      { ko: "곧 돌아올게요.", en: "I will be back shortly." }
    ],
    "처럼|particle": [
      { ko: "한국 사람처럼 말해요.", en: "You speak like a Korean.", note: "처럼 attaches straight to the noun, with no particle in front." },
      { ko: "가족처럼 지내요.", en: "We get on like family." },
      { ko: "저 사람처럼 되고 싶어요.", en: "I want to become like them." }
    ],
    "너무|adverb": [
      { ko: "너무 비싸요.", en: "It is too expensive.", note: "Strictly 너무 is 'excessively', but in speech it has drifted to plain 'very'." },
      { ko: "너무 맛있어요!", en: "This is so good!" },
      { ko: "너무 걱정하지 마세요.", en: "Do not worry too much." }
    ],
    "게임|noun": [
      { ko: "게임을 해요.", en: "I play games." },
      { ko: "게임하지 말고 공부하세요.", en: "Stop gaming and study.", note: "-지 말고 is 'instead of doing'." },
      { ko: "무슨 게임을 좋아해요?", en: "What games do you like?" }
    ],
    "달러|dependent noun": [
      { ko: "십 달러예요.", en: "It is ten dollars.", note: "Foreign currency takes Sino-Korean numbers, like 원 does." },
      { ko: "백 달러를 바꿨어요.", en: "I changed a hundred dollars." },
      { ko: "달러로 낼 수 있어요?", en: "Can I pay in dollars?" }
    ],
    "잔|noun": [
      { ko: "커피 한 잔 주세요.", en: "One coffee, please.", note: "잔 counts cups and glasses of a drink." },
      { ko: "한잔할까요?", en: "Shall we go for a drink?", note: "한잔하다 written together means going out drinking, not literally one glass." },
      { ko: "한 잔 더 드릴까요?", en: "Shall I get you another one?" }
    ],
    "저|determiner": [
      { ko: "저 사람이 누구예요?", en: "Who is that person over there?", note: "이 near me, 그 near you, 저 away from us both." },
      { ko: "저 건물이 우리 회사예요.", en: "That building over there is my company." },
      { ko: "저기 있는 저 가방이 제 거예요.", en: "That bag over there is mine." }
    ],
    "손님|noun": [
      { ko: "손님이 오셨어요.", en: "A guest has arrived.", note: "손님 is both a customer and a guest; -님 makes it respectful either way." },
      { ko: "손님, 뭐 드릴까요?", en: "What can I get you, sir?", note: "How shop and restaurant staff address a customer." },
      { ko: "오늘은 손님이 많아요.", en: "There are a lot of customers today." }
    ],
    "오르다|verb": [
      { ko: "값이 올랐어요.", en: "The price has gone up.", note: "오르다 is 르-irregular: 올라요, 올랐어요." },
      { ko: "산에 올라갔어요.", en: "We climbed the mountain." },
      { ko: "계단으로 올라가세요.", en: "Take the stairs up." }
    ],
    "뉴스|noun": [
      { ko: "뉴스를 봤어요?", en: "Did you see the news?" },
      { ko: "뉴스에 나왔어요.", en: "It was on the news." },
      { ko: "매일 아침 뉴스를 들어요.", en: "I listen to the news every morning." }
    ],
    "는 바람에|expression": [
      { ko: "늦게 일어나는 바람에 지각했어요.", en: "I overslept, and so I was late.", note: "Verb + -는 바람에 gives an unwanted result, and always in the past. A good outcome takes -아서/어서 instead." },
      { ko: "비가 오는 바람에 못 갔어요.", en: "It rained, so I could not go." },
      { ko: "버스를 놓치는 바람에 늦었어요.", en: "I missed the bus, so I was late." }
    ],
    "그런 것 같아요|phrase": [
      { ko: "그런 것 같아요.", en: "I think so.", casual: "그런 것 같아.", note: "-(으)ㄴ 것 같다 hedges an opinion, which Korean prefers to a flat assertion." },
      { ko: "네, 저도 그런 것 같아요.", en: "Yes, I think so too." },
      { ko: "제가 잘못한 것 같아요.", en: "I think I was in the wrong." }
    ],
    "백두산|proper noun": [
      { ko: "백두산은 한국에서 제일 높은 산이에요.", en: "Baekdusan is the highest mountain in Korea." },
      { ko: "백두산에 가 보고 싶어요.", en: "I would like to visit Baekdusan." },
      { ko: "백두산에 눈이 많이 왔어요.", en: "There has been heavy snow on Baekdusan." }
    ],
    "세대 차이|noun phrase": [
      { ko: "세대 차이를 느껴요.", en: "I feel the generation gap." },
      { ko: "부모님과 세대 차이가 있어요.", en: "There is a generation gap between me and my parents." },
      { ko: "세대 차이는 어디에나 있어요.", en: "There is a generation gap everywhere." }
    ],
    "수업|noun": [
      { ko: "수업이 언제 시작해요?", en: "When does the class start?" },
      { ko: "오늘 수업이 없어요.", en: "I have no classes today." },
      { ko: "수업을 들어요.", en: "I take the class.", note: "Classes are 'listened to' in Korean: 수업을 듣다." }
    ],
    "겨울|noun": [
      { ko: "겨울에 눈이 많이 와요.", en: "It snows a lot in winter." },
      { ko: "한국 겨울은 정말 추워요.", en: "Korean winters are really cold.", note: "춥다 is ㅂ-irregular: 추워요." },
      { ko: "겨울 옷을 준비하세요.", en: "Get your winter clothes ready." }
    ],
    "멀다|adjective": [
      { ko: "집에서 멀어요.", en: "It is far from my house.", note: "멀다 is ㄹ-irregular: 멉니다. Its opposite is 가깝다." },
      { ko: "아직 멀었어요?", en: "Are we nearly there?", note: "Literally 'is it still far' — the standard back-seat question." },
      { ko: "여기에서 먼가요?", en: "Is it far from here?" }
    ],
    "거기|pronoun": [
      { ko: "거기에서 만나요.", en: "Let's meet there.", note: "여기 here, 거기 there near you, 저기 over there." },
      { ko: "거기 누구세요?", en: "Who is that there?" },
      { ko: "거기까지 어떻게 가요?", en: "How do I get there?" }
    ],
    "놓다|verb": [
      { ko: "여기에 놓으세요.", en: "Please put it here.", note: "놓다 is putting something down; 넣다 is putting it inside." },
      { ko: "가방을 책상 위에 놓았어요.", en: "I put my bag on the desk." },
      { ko: "잠깐 내려놓으세요.", en: "Put it down for a moment." }
    ],
    "층|noun": [
      { ko: "몇 층이에요?", en: "Which floor?", note: "층 takes Sino-Korean numbers: 일 층, 이 층, 삼 층." },
      { ko: "삼 층으로 올라가세요.", en: "Please go up to the third floor." },
      { ko: "이 건물은 십 층이에요.", en: "This building has ten floors." }
    ],
    "사|numeral": [
      { ko: "사월에 꽃이 펴요.", en: "The flowers bloom in April.", note: "Sino-Korean 사 names months and dates; native 넷 counts objects." },
      { ko: "사 층에 있어요.", en: "It is on the fourth floor.", note: "사 sounds like the word for death, so some buildings label the fourth floor F." },
      { ko: "사 번 버스를 타세요.", en: "Take the number four bus." }
    ],
    "식사|noun": [
      { ko: "식사하셨어요?", en: "Have you eaten?", casual: "밥 먹었어?", note: "식사하다 is the polite verb for having a meal, and this is the polite twin of 밥 먹었어요?" },
      { ko: "식사 맛있게 하세요.", en: "Enjoy your meal." },
      { ko: "식사 시간이 언제예요?", en: "When is mealtime?" }
    ],
    "통|counter": [
      { ko: "편지 한 통을 받았어요.", en: "I received a letter.", note: "통 counts letters, emails and phone calls: 전화 한 통." },
      { ko: "전화 한 통만 할게요.", en: "Let me just make one call." },
      { ko: "이메일 두 통을 보냈어요.", en: "I sent two emails." }
    ],
    "아니|interjection": [
      { ko: "아니, 괜찮아.", en: "No, it is fine.", note: "Casual. The polite answer to a question is 아니요." },
      { ko: "아니, 그게 무슨 말이야?", en: "Wait, what do you mean?", note: "아니 also opens a sentence in surprise or protest." },
      { ko: "아니, 벌써 왔어?", en: "What, you are here already?" }
    ],
    "같이|particle": [
      { ko: "눈같이 하얘요.", en: "It is white as snow.", note: "As a particle 같이 attaches to the noun and means 'like'; 처럼 is the more common twin." },
      { ko: "너같이 착한 사람은 없어.", en: "There is nobody as kind as you." },
      { ko: "얼음같이 차가워요.", en: "It is cold as ice." }
    ],
    "텔레비전|noun": [
      { ko: "텔레비전을 봐요.", en: "I watch television.", note: "티브이 is the short spoken form." },
      { ko: "텔레비전에서 봤어요.", en: "I saw it on television." },
      { ko: "텔레비전을 켜 주세요.", en: "Please turn the television on." }
    ],
    "는 김에|expression": [
      { ko: "나가는 김에 우유 좀 사 오세요.", en: "While you are out, pick up some milk.", note: "Verb + -는 김에: taking the chance offered by something you are doing anyway." },
      { ko: "서울에 온 김에 친구를 만났어요.", en: "Since I was in Seoul anyway, I met a friend." },
      { ko: "말이 나온 김에 지금 정해요.", en: "While we are on the subject, let's decide now." }
    ],
    "그럼|conjunction": [
      { ko: "그럼 내일 만나요.", en: "Then let's meet tomorrow.", note: "그럼 is 그러면 shortened, and is what people actually say." },
      { ko: "시간이 없어요? 그럼 다음에 해요.", en: "No time? Then let's do it next time." },
      { ko: "그럼 이렇게 할까요?", en: "Then shall we do it this way?" }
    ],
    "아주|adverb": [
      { ko: "아주 맛있어요.", en: "It is very tasty.", note: "아주 is a plain 'very'; 너무 carries a hint of 'too much'." },
      { ko: "아주 좋은 생각이에요.", en: "That is a very good idea." },
      { ko: "아주 잘하셨어요.", en: "You did very well." }
    ],
    "놀다|verb": [
      { ko: "친구하고 놀았어요.", en: "I hung out with a friend.", note: "놀다 is not childish — adults use it for spending time together. It is ㄹ-irregular: 놉니다." },
      { ko: "주말에 뭐 하고 놀아요?", en: "What do you do for fun at the weekend?" },
      { ko: "오늘 같이 놀래요?", en: "Do you want to hang out today?" }
    ],
    "편지|noun": [
      { ko: "편지를 썼어요.", en: "I wrote a letter." },
      { ko: "편지를 보냈어요.", en: "I sent a letter." },
      { ko: "손으로 편지를 썼어요.", en: "I wrote the letter by hand." }
    ],
    "개월|dependent noun": [
      { ko: "삼 개월 동안 배웠어요.", en: "I studied for three months.", note: "개월 takes Sino-Korean numbers; its native twin 달 takes 한, 두, 세." },
      { ko: "육 개월 후에 돌아올게요.", en: "I will be back in six months." },
      { ko: "몇 개월 배웠어요?", en: "How many months did you study?" }
    ],
    "오다|auxiliary verb": [
      { ko: "십 년 동안 한국어를 배워 왔어요.", en: "I have been learning Korean for ten years.", note: "-아/어 오다 tracks an action up to now; its mirror -아/어 가다 points forward." },
      { ko: "지금까지 잘해 왔어요.", en: "You have done well up to now." },
      { ko: "이 일을 오 년 동안 해 왔어요.", en: "I have been doing this work for five years." }
    ],
    "팔|noun": [
      { ko: "팔이 아파요.", en: "My arm hurts." },
      { ko: "팔을 들어 보세요.", en: "Try raising your arm.", note: "The same spelling is Sino-Korean eight — 팔월 is August." },
      { ko: "팔짱을 끼지 마세요.", en: "Do not fold your arms.", note: "팔짱을 끼다 is the fixed pairing, and reads as unfriendly in Korea." }
    ],
    "설명|noun": [
      { ko: "설명 좀 해 주세요.", en: "Could you explain, please?" },
      { ko: "선생님의 설명이 쉬웠어요.", en: "The teacher's explanation was easy to follow." },
      { ko: "자세한 설명이 필요해요.", en: "I need a fuller explanation." }
    ],
    "비슷하다|adjective": [
      { ko: "두 사람이 비슷해요.", en: "The two of them are alike.", note: "What it resembles takes 와/과 or 하고: 저와 비슷해요." },
      { ko: "발음이 비슷해서 헷갈려요.", en: "The pronunciation is similar, so I get them mixed up." },
      { ko: "저와 성격이 비슷해요.", en: "Our personalities are alike." }
    ],
    "티브이|noun": [
      { ko: "티브이 좀 꺼 주세요.", en: "Please turn the TV off.", note: "끄다 turns it off, 켜다 turns it on." },
      { ko: "티브이에서 한국 드라마를 봐요.", en: "I watch Korean dramas on TV." },
      { ko: "티브이에 나온 적이 있어요.", en: "I have been on TV." }
    ],
    "바꾸다|verb": [
      { ko: "자리를 바꿔 주세요.", en: "Could you change seats with me?" },
      { ko: "돈을 바꾸고 싶어요.", en: "I would like to change some money." },
      { ko: "생각을 바꿨어요.", en: "I have changed my mind." }
    ],
    "는 대로|expression": [
      { ko: "도착하는 대로 전화할게요.", en: "I will call as soon as I arrive.", note: "Verb + -는 대로 is 'as soon as'. After a noun, 대로 means 'in accordance with': 마음대로." },
      { ko: "끝나는 대로 갈게요.", en: "I will come as soon as it finishes." },
      { ko: "준비되는 대로 출발해요.", en: "We will set off as soon as we are ready." }
    ],
    "봄|noun": [
      { ko: "봄에 꽃이 펴요.", en: "Flowers bloom in spring." },
      { ko: "한국의 봄은 짧아요.", en: "Spring in Korea is short." },
      { ko: "봄이 왔어요.", en: "Spring has come." }
    ],
    "잘 될 거예요|phrase": [
      { ko: "잘 될 거예요.", en: "It will work out.", casual: "잘 될 거야.", note: "-(으)ㄹ 거예요 is the plain future. This is the standard line of reassurance." },
      { ko: "걱정하지 마세요. 다 잘 될 거예요.", en: "Do not worry. It will all work out." },
      { ko: "힘내세요, 잘 될 거예요.", en: "Chin up, it will work out." }
    ],

    // ================================================================ day 11
    "어깨|noun": [
      { ko: "어깨가 아파요.", en: "My shoulder hurts." },
      { ko: "어깨 좀 주물러 주세요.", en: "Could you rub my shoulders?" },
      { ko: "가방을 어깨에 멨어요.", en: "I carried the bag on my shoulder." }
    ],
    "새|determiner": [
      { ko: "새 옷을 샀어요.", en: "I bought new clothes.", note: "새 goes straight in front of a noun with no particle. The adjective 새롭다 is used elsewhere." },
      { ko: "새 학기가 시작됐어요.", en: "The new term has started." },
      { ko: "새 친구를 사귀었어요.", en: "I made a new friend.", note: "친구를 사귀다 is the fixed pairing for making friends." }
    ],
    "부부|noun": [
      { ko: "두 사람은 부부예요.", en: "The two of them are married." },
      { ko: "옆집 부부가 친절해요.", en: "The couple next door are kind." },
      { ko: "부부가 함께 가게를 해요.", en: "The couple run the shop together." }
    ],
    "좋아하다|verb": [
      { ko: "한국 음식을 좋아해요.", en: "I like Korean food.", note: "좋아하다 is a verb and takes 을/를; 좋다 is an adjective and takes 이/가." },
      { ko: "뭐 좋아해요?", en: "What do you like?" },
      { ko: "저는 커피보다 차를 좋아해요.", en: "I prefer tea to coffee." }
    ],
    "보다|particle": [
      { ko: "지하철이 버스보다 빨라요.", en: "The subway is faster than the bus.", note: "보다 attaches to what is being compared against, and 더 often comes before the adjective." },
      { ko: "생각보다 쉬웠어요.", en: "It was easier than I expected." },
      { ko: "어제보다 추워요.", en: "It is colder than yesterday." }
    ],
    "서른|numeral": [
      { ko: "올해 서른이 됐어요.", en: "I turned thirty this year.", note: "Ages take native numbers: 스물, 서른, 마흔." },
      { ko: "서른 명쯤 왔어요.", en: "About thirty people came." },
      { ko: "서른 개쯤 있어요.", en: "There are about thirty." }
    ],
    "여행|noun": [
      { ko: "여행 가고 싶어요.", en: "I want to go travelling." },
      { ko: "여행 잘 다녀오세요.", en: "Have a good trip.", note: "다녀오다 is 'go and come back', which is how Korean wishes you a trip." },
      { ko: "작년에 한국으로 여행을 갔어요.", en: "I took a trip to Korea last year." }
    ],
    "먼저|adverb": [
      { ko: "먼저 가세요.", en: "Please go ahead." },
      { ko: "먼저 손을 씻으세요.", en: "Wash your hands first." },
      { ko: "먼저 갈게요.", en: "I will be off first.", note: "What you say leaving a gathering before the others." }
    ],
    "는 반면에|expression": [
      { ko: "형은 조용한 반면에 동생은 활발해요.", en: "The older brother is quiet, whereas the younger one is lively.", note: "Verb + -는 반면에, adjective + -(으)ㄴ 반면에. Written Korean, setting two halves against each other." },
      { ko: "값이 싼 반면에 품질이 나빠요.", en: "It is cheap, but on the other hand the quality is poor." },
      { ko: "도시는 편리한 반면에 복잡해요.", en: "The city is convenient but on the other hand crowded." }
    ],
    "공|noun": [
      { ko: "공을 던졌어요.", en: "I threw the ball." },
      { ko: "공으로 차요.", en: "Kick it with the ball.", note: "The same 공 is Sino-Korean zero: 공일공 for a phone number beginning 010." },
      { ko: "공을 차 보세요.", en: "Try kicking the ball." }
    ],
    "이거|pronoun": [
      { ko: "이거 얼마예요?", en: "How much is this?", note: "이거 is 이것 in speech, and what you say while pointing." },
      { ko: "이거 주세요.", en: "This one, please." },
      { ko: "이거 뭐예요?", en: "What is this?" }
    ],
    "오월|noun": [
      { ko: "오월에 날씨가 좋아요.", en: "The weather is nice in May.", note: "Months are Sino-Korean number + 월. Only 유월 and 시월 drop a consonant." },
      { ko: "오월 오일은 어린이날이에요.", en: "The fifth of May is Children's Day." },
      { ko: "오월에 결혼해요.", en: "I am getting married in May." }
    ],
    "미터|dependent noun": [
      { ko: "백 미터쯤 가세요.", en: "Go about a hundred metres.", note: "Measurements take Sino-Korean numbers." },
      { ko: "이 건물은 높이가 오십 미터예요.", en: "This building is fifty metres tall." },
      { ko: "오십 미터만 더 가세요.", en: "Go another fifty metres." }
    ],
    "싫다|adjective": [
      { ko: "저는 매운 음식이 싫어요.", en: "I do not like spicy food.", note: "싫다 is an adjective, so what you dislike takes 이/가. 싫어하다 is the verb and takes 을/를." },
      { ko: "가기 싫어요.", en: "I do not want to go.", note: "-기 싫다 is 'do not feel like doing'." },
      { ko: "싫으면 안 해도 돼요.", en: "If you do not like it, you need not do it." }
    ],
    "그리다|verb": [
      { ko: "그림을 그려요.", en: "I draw pictures.", note: "그림 and 그리다 share a root — a picture is a drawn thing." },
      { ko: "여기에 지도를 그려 주세요.", en: "Please draw me a map here." },
      { ko: "무엇을 그리고 있어요?", en: "What are you drawing?" }
    ],
    "과|noun": [
      { ko: "오늘은 오 과를 공부해요.", en: "Today we are studying lesson five." },
      { ko: "저는 한국어과 학생이에요.", en: "I am a student in the Korean department.", note: "The same 과 names a university department: 경제학과, 의과." },
      { ko: "무슨 과를 나오셨어요?", en: "What did you major in?" }
    ],
    "한라산|proper noun": [
      { ko: "한라산은 제주도에 있어요.", en: "Hallasan is on Jeju Island." },
      { ko: "한라산에 올라갔어요.", en: "I climbed Hallasan." },
      { ko: "한라산에 눈이 왔어요.", en: "It has snowed on Hallasan." }
    ],
    "남녀 차별|noun phrase": [
      { ko: "남녀 차별이 없어야 해요.", en: "There should be no discrimination between men and women." },
      { ko: "남녀 차별 문제에 대해 이야기했어요.", en: "We talked about the problem of gender discrimination." },
      { ko: "남녀 차별을 없애야 해요.", en: "Gender discrimination must be got rid of." }
    ],
    "오빠|noun": [
      { ko: "오빠가 한 명 있어요.", en: "I have one older brother.", note: "오빠 is used by a woman. A man says 형 for the same person." },
      { ko: "오빠, 이거 어때?", en: "What do you think of this one?", note: "Also how a younger woman addresses an older man she is close to." },
      { ko: "오빠가 두 살 많아요.", en: "My older brother is two years older." }
    ],
    "사월|noun": [
      { ko: "사월에 꽃이 펴요.", en: "The flowers bloom in April." },
      { ko: "사월 십일에 만나요.", en: "Let's meet on the tenth of April." },
      { ko: "사월은 날씨가 좋아요.", en: "The weather is nice in April." }
    ],
    "봉지|counter": [
      { ko: "과자 한 봉지 주세요.", en: "One packet of crisps, please.", note: "봉지 counts bags and packets, and is also the word for the bag itself." },
      { ko: "봉지에 넣어 주세요.", en: "Please put it in a bag." },
      { ko: "봉지 하나 더 주시겠어요?", en: "Could I have one more bag?" }
    ],
    "음|interjection": [
      { ko: "음, 글쎄요.", en: "Hmm, I am not sure.", note: "The noise you make while thinking. 글쎄요 is the polite 'well, who knows'." },
      { ko: "음, 좋은 생각이네요.", en: "Hmm, that is a good idea." },
      { ko: "음, 생각 좀 해 볼게요.", en: "Hmm, let me think about it." }
    ],
    "기 위해서|expression": [
      { ko: "한국에서 일하기 위해서 한국어를 배워요.", en: "I am learning Korean in order to work in Korea.", note: "Verb stem + -기 위해서. After a noun it is 을/를 위해서." },
      { ko: "건강을 지키기 위해서 운동해요.", en: "I exercise in order to stay healthy." },
      { ko: "돈을 모으기 위해서 아르바이트를 해요.", en: "I work part-time in order to save money." }
    ],
    "배우다|verb": [
      { ko: "한국어를 배워요.", en: "I am learning Korean.", note: "배우다 is the learner's side; 가르치다 is the teacher's." },
      { ko: "어디에서 배웠어요?", en: "Where did you learn it?" },
      { ko: "많이 배웠어요.", en: "I learned a lot." }
    ],
    "나중|noun": [
      { ko: "나중에 이야기해요.", en: "Let's talk later.", note: "나중 nearly always appears as 나중에." },
      { ko: "나중에 후회할 거예요.", en: "You will regret it later." },
      { ko: "나중에 다시 연락드릴게요.", en: "I will be in touch again later." }
    ],
    "며칠|noun": [
      { ko: "오늘이 며칠이에요?", en: "What is the date today?", note: "며칠 asks the date and also means 'a few days' — the context decides." },
      { ko: "며칠 동안 여행했어요.", en: "I travelled for a few days." },
      { ko: "며칠만 기다려 주세요.", en: "Please wait just a few days." }
    ],
    "힘내세요|phrase": [
      { ko: "힘내세요!", en: "Keep your chin up!", casual: "힘내!", note: "Literally 'put out strength' — said to someone having a hard time." },
      { ko: "조금만 더 힘내세요.", en: "Hang in there a little longer." },
      { ko: "시험 잘 보세요, 힘내세요!", en: "Good luck in the exam — you can do it!" }
    ],
    "그래도|conjunction": [
      { ko: "비가 왔어요. 그래도 갔어요.", en: "It rained. I went anyway.", note: "그래도 concedes the first sentence and goes on regardless." },
      { ko: "힘들어요. 그래도 재미있어요.", en: "It is hard. Even so, it is fun." },
      { ko: "바빠요. 그래도 갈게요.", en: "I am busy. Even so, I will go." }
    ],
    "작년|noun": [
      { ko: "작년에 한국에 갔어요.", en: "I went to Korea last year.", note: "작년, 올해, 내년 — last year, this year, next year." },
      { ko: "작년보다 따뜻해요.", en: "It is warmer than last year." },
      { ko: "작년 이맘때 만났어요.", en: "We met around this time last year." }
    ],
    "밖에|particle": [
      { ko: "천 원밖에 없어요.", en: "I only have a thousand won.", note: "밖에 always takes a negative behind it, and carries a note of 'not enough'. 만 is the neutral 'only'." },
      { ko: "하나밖에 안 남았어요.", en: "There is only one left." },
      { ko: "한 시간밖에 못 잤어요.", en: "I only got an hour of sleep." }
    ],
    "괜찮다|adjective": [
      { ko: "괜찮아요?", en: "Are you all right?" },
      { ko: "괜찮은 식당을 알아요.", en: "I know a decent restaurant.", note: "괜찮은 + noun is 'decent, not bad' — mild praise." },
      { ko: "안 괜찮아요.", en: "I am not okay." }
    ],
    "쓰레기|noun": [
      { ko: "쓰레기를 버리지 마세요.", en: "Do not drop litter.", note: "버리다 is to throw away." },
      { ko: "쓰레기통이 어디에 있어요?", en: "Where is the bin?" },
      { ko: "쓰레기를 분리해서 버려요.", en: "We separate the rubbish before throwing it out." }
    ],
    "잘하다|verb": [
      { ko: "한국어를 잘해요.", en: "You speak Korean well.", note: "Written as one word when it means being good at something." },
      { ko: "잘했어요!", en: "Well done!", note: "Said downward — to children, students, teammates." },
      { ko: "요리를 잘해요.", en: "You cook well." }
    ],
    "아홉|numeral": [
      { ko: "아홉 시에 만나요.", en: "Let's meet at nine.", note: "Hours are native numbers: 아홉 시. Minutes are Sino-Korean: 구 분." },
      { ko: "아홉 개 남았어요.", en: "There are nine left." },
      { ko: "아홉 명이 왔어요.", en: "Nine people came." }
    ],
    "얼마나|adverb": [
      { ko: "얼마나 걸려요?", en: "How long does it take?" },
      { ko: "얼마나 자주 가요?", en: "How often do you go?" },
      { ko: "한국어를 얼마나 배웠어요?", en: "How long have you been learning Korean?" }
    ],
    "기 때문에|expression": [
      { ko: "바쁘기 때문에 못 가요.", en: "I cannot go because I am busy.", note: "Verb or adjective + -기 때문에. After a noun it is 때문에 on its own: 비 때문에." },
      { ko: "비가 왔기 때문에 취소됐어요.", en: "It was cancelled because it rained.", note: "-기 때문에 cannot end in a command or a suggestion — use -(으)니까 for those." },
      { ko: "학생이기 때문에 할인이 돼요.", en: "It is discounted because I am a student.", note: "After a noun it is 이기 때문에." }
    ],
    "고기|noun": [
      { ko: "고기를 안 먹어요.", en: "I do not eat meat." },
      { ko: "고기 구워 먹을까요?", en: "Shall we grill some meat?", note: "돼지고기 pork, 소고기 beef, 닭고기 chicken — 고기 builds them all." },
      { ko: "고기보다 생선을 좋아해요.", en: "I prefer fish to meat." }
    ],
    "전|determiner": [
      { ko: "전 직장에서 만났어요.", en: "We met at my previous job.", note: "As a determiner 전 sits in front of a noun: 전 남자 친구, 전 직장." },
      { ko: "전 대통령이 왔어요.", en: "The former president came." },
      { ko: "전 회사에서 삼 년 일했어요.", en: "I worked at my previous company for three years." }
    ],
    "남녀|noun": [
      { ko: "남녀 모두 좋아해요.", en: "Men and women alike enjoy it." },
      { ko: "남녀 화장실이 따로 있어요.", en: "There are separate toilets for men and women." },
      { ko: "남녀가 함께 일해요.", en: "Men and women work side by side." }
    ],
    "술|dependent noun": [
      { ko: "설탕 한 술만 넣으세요.", en: "Add just one spoonful of sugar.", note: "술 counts spoonfuls and takes native numbers. It is unrelated to 술, alcohol." },
      { ko: "밥 한 술도 못 먹었어요.", en: "I could not eat a single spoonful." },
      { ko: "한 술 떠 보세요.", en: "Have a spoonful." }
    ],
    "준비|noun": [
      { ko: "준비 다 됐어요?", en: "Are you ready?" },
      { ko: "시험 준비를 해야 해요.", en: "I have to prepare for the exam.", note: "준비하다 is one verb: 준비했어요." },
      { ko: "준비하고 있어요.", en: "I am getting ready." }
    ],
    "못하다|verb": [
      { ko: "저는 노래를 못해요.", en: "I cannot sing.", note: "못하다 as a verb means being bad at something. 안 하다 is choosing not to do it." },
      { ko: "생각보다 못했어요.", en: "It went worse than I expected." },
      { ko: "저보다 못하지 않아요.", en: "They are no worse than me." }
    ],
    "구월|noun": [
      { ko: "구월에 학교가 시작해요.", en: "School starts in September." },
      { ko: "구월부터 날씨가 시원해요.", en: "From September the weather is cool." },
      { ko: "구월 말에 갈 거예요.", en: "I am going at the end of September." }
    ],
    "이곳|pronoun": [
      { ko: "이곳이 제일 좋아요.", en: "This place is the best.", note: "이곳 is the written 여기; signs and notices use it." },
      { ko: "이곳에서 사진을 찍지 마세요.", en: "Please do not take photographs here." },
      { ko: "이곳은 금연 구역입니다.", en: "This is a non-smoking area." }
    ],
    "유월|noun": [
      { ko: "유월에 비가 많이 와요.", en: "It rains a lot in June.", note: "육월 is wrong — the ㄱ drops, giving 유월. 시월 does the same." },
      { ko: "유월 이십오일이에요.", en: "It is the twenty-fifth of June." },
      { ko: "유월부터 더워져요.", en: "It gets hot from June." }
    ],
    "는 덕분에|expression": [
      { ko: "도와주신 덕분에 잘 끝났어요.", en: "Thanks to your help, it finished well.", note: "-(으)ㄴ/는 덕분에 is for a good result; a bad one takes -는 바람에 or -는 탓에." },
      { ko: "친구 덕분에 한국어를 배웠어요.", en: "Thanks to a friend, I learned Korean.", note: "After a noun, 덕분에 stands on its own." },
      { ko: "선생님 덕분에 합격했어요.", en: "Thanks to my teacher, I passed." }
    ],
    "허리|noun": [
      { ko: "허리가 아파요.", en: "My back hurts.", note: "허리 is the lower back and waist; the upper back is 등." },
      { ko: "허리를 펴세요.", en: "Straighten your back." },
      { ko: "허리를 다쳤어요.", en: "I hurt my back." }
    ],
    "어떠하다|adjective": [
      { ko: "결과가 어떠합니까?", en: "How are the results?", note: "어떠하다 is the full written form; 어떻다 is its contraction, and 어때요 is what people say." },
      { ko: "상황이 어떠한지 알려 주세요.", en: "Please let me know how the situation stands." },
      { ko: "그 일이 어떠했는지 말씀해 주세요.", en: "Please tell me how that went." }
    ],
    "이해하다|verb": [
      { ko: "이해했어요.", en: "I understand.", note: "이해하다 is grasping a meaning; 알겠어요 is the everyday reply to an instruction." },
      { ko: "잘 이해가 안 돼요.", en: "I do not quite follow.", note: "이해가 되다 is the passive: it 'becomes understood'." },
      { ko: "제 말 이해하셨어요?", en: "Do you understand what I mean?" }
    ],
    "새|noun": [
      { ko: "새가 노래해요.", en: "The birds are singing." },
      { ko: "하늘에 새가 많아요.", en: "There are a lot of birds in the sky." },
      { ko: "새 한 마리가 앉아 있어요.", en: "A bird is sitting there.", note: "마리 counts animals and birds." }
    ],
    "조차|particle": [
      { ko: "이름조차 몰라요.", en: "I do not even know their name.", note: "조차 attaches to the noun and needs a negative. It carries surprise at how far things go." },
      { ko: "물조차 못 마셨어요.", en: "I could not even drink water." },
      { ko: "생각조차 안 했어요.", en: "It did not even cross my mind." }
    ],

    // ================================================================ day 12
    "조심하세요|phrase": [
      { ko: "조심하세요.", en: "Be careful.", casual: "조심해.", note: "Also said to someone heading out into bad weather or traffic." },
      { ko: "감기 조심하세요.", en: "Mind you do not catch a cold." },
      { ko: "길이 미끄러우니까 조심하세요.", en: "The road is slippery, so be careful." }
    ],
    "영어|noun": [
      { ko: "영어를 할 수 있어요?", en: "Can you speak English?", note: "Languages are 'done' in Korean: 영어를 하다, 한국어를 하다." },
      { ko: "영어로 말해 주세요.", en: "Please say it in English." },
      { ko: "영어를 가르쳐요.", en: "I teach English." }
    ],
    "달|noun": [
      { ko: "달이 밝아요.", en: "The moon is bright." },
      { ko: "한 달에 한 번 만나요.", en: "We meet once a month.", note: "The same 달 is the month counter, with native numbers: 한 달, 두 달." },
      { ko: "달이 예쁘게 떴어요.", en: "The moon is out and lovely." }
    ],
    "곧|adverb": [
      { ko: "곧 갈게요.", en: "I will be there soon." },
      { ko: "수업이 곧 시작해요.", en: "The class starts shortly.", note: "곧 is sooner than 나중에 and vaguer than 지금 바로." },
      { ko: "곧 도착해요.", en: "I am arriving shortly." }
    ],
    "여든|numeral": [
      { ko: "할머니가 여든이세요.", en: "My grandmother is eighty.", note: "Ages take native numbers: 예순, 일흔, 여든, 아흔." },
      { ko: "여든 명이 넘었어요.", en: "There were over eighty people." },
      { ko: "여든까지 건강하게 사셨어요.", en: "They lived healthily to eighty." }
    ],
    "는 탓에|expression": [
      { ko: "늦게 자는 탓에 피곤해요.", en: "I am tired because I go to bed late.", note: "-는 탓에 blames something for a bad result; 덕분에 credits something for a good one." },
      { ko: "비가 온 탓에 길이 막혔어요.", en: "The roads were jammed because of the rain." },
      { ko: "제 탓에 늦었어요.", en: "It is my fault we were late.", note: "After a noun, 탓에 stands on its own." }
    ],
    "돌아가다|verb": [
      { ko: "집에 돌아가요.", en: "I am going back home.", note: "돌아가다 goes back away from the speaker; 돌아오다 comes back toward them." },
      { ko: "고향에 돌아가고 싶어요.", en: "I want to go back to my hometown." },
      { ko: "할아버지께서 돌아가셨어요.", en: "My grandfather passed away.", note: "돌아가시다 is the honorific for a person dying — literally 'to go back'." }
    ],
    "사장|noun": [
      { ko: "사장님께 말씀드릴게요.", en: "I will speak to the boss.", note: "Always 사장님 when you mean the person; -님 is compulsory with job titles." },
      { ko: "저희 사장님은 좋은 분이세요.", en: "Our boss is a good person.", note: "분 is the honorific counter for people." },
      { ko: "사장님이 회의 중이세요.", en: "The boss is in a meeting." }
    ],
    "상자|counter": [
      { ko: "사과 한 상자 샀어요.", en: "I bought a box of apples.", note: "상자 is both the box itself and the counter for boxfuls." },
      { ko: "상자에 넣어 주세요.", en: "Please put it in a box." },
      { ko: "상자 두 개만 옮겨 주세요.", en: "Could you move two boxes?" }
    ],
    "응|interjection": [
      { ko: "응, 알겠어.", en: "Yeah, got it.", note: "Casual only. The polite yes is 네, and the formal one 예." },
      { ko: "응? 뭐라고 했어?", en: "Huh? What did you say?" },
      { ko: "응, 나도 그렇게 생각해.", en: "Yeah, I think so too." }
    ],
    "삼월|noun": [
      { ko: "삼월에 학교가 시작해요.", en: "The school year starts in March.", note: "In Korea the school year begins in March, not September." },
      { ko: "삼월은 아직 추워요.", en: "March is still cold." },
      { ko: "삼월 초에 만나요.", en: "Let's meet at the beginning of March." }
    ],
    "장|dependent noun": [
      { ko: "종이 두 장 주세요.", en: "Two sheets of paper, please.", note: "장 counts flat things: paper, tickets, photos, cards." },
      { ko: "표 몇 장 필요해요?", en: "How many tickets do you need?" },
      { ko: "사진 한 장만 보여 주세요.", en: "Show me just one photo." }
    ],
    "싶다|auxiliary verb": [
      { ko: "한국에 가고 싶어요.", en: "I want to go to Korea.", note: "-고 싶다 is your own wish. About someone else it becomes -고 싶어하다." },
      { ko: "뭐 먹고 싶어요?", en: "What do you want to eat?" },
      { ko: "쉬고 싶어요.", en: "I want to rest." }
    ],
    "북한|proper noun": [
      { ko: "북한은 한국의 북쪽에 있어요.", en: "North Korea lies to the north of South Korea." },
      { ko: "북한에 대해 공부하고 있어요.", en: "I am studying about North Korea." },
      { ko: "북한 사람들도 한국어를 써요.", en: "North Koreans speak Korean too." }
    ],
    "빈부 격차|noun phrase": [
      { ko: "빈부 격차가 커지고 있어요.", en: "The gap between rich and poor is widening." },
      { ko: "빈부 격차는 큰 사회 문제예요.", en: "The wealth gap is a major social problem." },
      { ko: "빈부 격차를 줄여야 해요.", en: "The wealth gap has to be narrowed." }
    ],
    "키|noun": [
      { ko: "키가 커요.", en: "They are tall.", note: "A person's height is 키가 크다 — never 높다, which is for buildings and mountains." },
      { ko: "키가 몇이에요?", en: "How tall are you?" },
      { ko: "키가 많이 컸네요.", en: "You have grown a lot." }
    ],
    "짧다|adjective": [
      { ko: "머리가 짧아요.", en: "Your hair is short.", note: "Pronounced 짤따. Its opposite is 길다." },
      { ko: "시간이 짧아요.", en: "There is not much time." },
      { ko: "짧게 말씀해 주세요.", en: "Please keep it brief." }
    ],
    "걱정|noun": [
      { ko: "걱정이 많아요.", en: "I have a lot on my mind." },
      { ko: "걱정하지 마세요.", en: "Do not worry.", note: "-지 말다 is the negative command." },
      { ko: "걱정 마세요.", en: "No need to worry.", note: "걱정하지 마세요 shortened, and just as common." }
    ],
    "이야기하다|verb": [
      { ko: "친구하고 이야기했어요.", en: "I talked with a friend.", note: "이야기하다 is talking *with* someone; 말하다 is what is said." },
      { ko: "천천히 이야기해 주세요.", en: "Please tell me slowly." },
      { ko: "무슨 이야기를 하고 있었어요?", en: "What were you talking about?" }
    ],
    "그러자|conjunction": [
      { ko: "문을 열었어요. 그러자 고양이가 들어왔어요.", en: "I opened the door, and then a cat came in.", note: "그러자 links a past action to what immediately followed. It never appears with a present or future sentence." },
      { ko: "이름을 불렀어요. 그러자 뒤를 돌아봤어요.", en: "I called their name, and at that they turned round." },
      { ko: "비가 그쳤어요. 그러자 해가 났어요.", en: "The rain stopped, and then the sun came out." }
    ],
    "누나|noun": [
      { ko: "누나가 한 명 있어요.", en: "I have one older sister.", note: "누나 is used by a man. A woman says 언니 for the same person." },
      { ko: "누나, 이것 좀 봐.", en: "Sis, take a look at this." },
      { ko: "누나가 요리를 잘해요.", en: "My older sister is a good cook." }
    ],
    "을 뿐만 아니라|expression": [
      { ko: "한국어뿐만 아니라 중국어도 해요.", en: "I speak not only Korean but Chinese too.", note: "Noun + 뿐만 아니라; after a verb it is -(으)ㄹ 뿐만 아니라. The second half usually carries 도." },
      { ko: "값이 쌀 뿐만 아니라 품질도 좋아요.", en: "It is not only cheap but good quality as well." },
      { ko: "그분은 친절할 뿐만 아니라 똑똑해요.", en: "They are not only kind but clever." }
    ],
    "아무|determiner": [
      { ko: "아무 데나 좋아요.", en: "Anywhere is fine.", note: "아무 + noun + (이)나 is 'any at all'; with a negative it becomes 'none'." },
      { ko: "아무도 없어요.", en: "There is nobody here.", note: "아무도 always takes a negative behind it." },
      { ko: "아무 때나 오세요.", en: "Come any time." }
    ],
    "질문|noun": [
      { ko: "질문이 있어요.", en: "I have a question.", note: "Say it before asking, exactly as in English." },
      { ko: "질문 있으면 하세요.", en: "Ask if you have any questions." },
      { ko: "질문에 답해 주세요.", en: "Please answer the question." }
    ],
    "마저|particle": [
      { ko: "친구마저 떠났어요.", en: "Even my friend has left.", note: "마저 is the last of a set going too, with a note of regret. 조차 is closer to plain disbelief." },
      { ko: "비가 오는데 바람마저 불어요.", en: "It is raining, and now the wind as well." },
      { ko: "마지막 버스마저 놓쳤어요.", en: "I missed even the last bus." }
    ],
    "근처|noun": [
      { ko: "이 근처에 식당이 있어요?", en: "Is there a restaurant near here?" },
      { ko: "학교 근처에 살아요.", en: "I live near the school.", note: "근처 follows the place it is near: 학교 근처." },
      { ko: "근처에 지하철역이 있어요?", en: "Is there a subway station nearby?" }
    ],
    "그곳|pronoun": [
      { ko: "그곳에 가 봤어요?", en: "Have you been there?", note: "그곳 is the written 거기; it belongs in reports and notices." },
      { ko: "그곳은 정말 아름다웠어요.", en: "That place really was beautiful." },
      { ko: "그곳에서 무슨 일이 있었어요?", en: "What happened there?" }
    ],
    "자다|verb": [
      { ko: "잘 잤어요?", en: "Did you sleep well?", note: "The morning greeting between people who live together. Upward it becomes 안녕히 주무셨어요?" },
      { ko: "일찍 자야 해요.", en: "I have to go to bed early." },
      { ko: "어젯밤에 몇 시에 잤어요?", en: "What time did you go to bed last night?" }
    ],
    "부모님|noun": [
      { ko: "부모님께서 오세요.", en: "My parents are coming.", note: "Family elders take 께서 and the -시- honorific on the verb." },
      { ko: "부모님과 함께 살아요.", en: "I live with my parents." },
      { ko: "부모님이 보고 싶어요.", en: "I miss my parents.", note: "보고 싶다 is both 'want to see' and 'miss'." }
    ],
    "서로|adverb": [
      { ko: "서로 도와요.", en: "We help each other." },
      { ko: "서로 잘 알아요.", en: "We know each other well." },
      { ko: "서로 다른 생각을 존중해요.", en: "We respect each other's different views." }
    ],
    "걱정하지 마세요|phrase": [
      { ko: "걱정하지 마세요.", en: "Do not worry.", casual: "걱정하지 마.", note: "-지 말다 is the negative command; 마세요 is its polite form." },
      { ko: "걱정하지 마세요. 제가 도와드릴게요.", en: "Do not worry. I will help you.", note: "도와드리다 is the humble 도와주다, used when the person helped is senior." },
      { ko: "아무 걱정하지 마세요.", en: "Do not worry about a thing." }
    ],
    "비행기|noun": [
      { ko: "비행기를 타고 갔어요.", en: "We went by plane.", note: "What you ride takes 을/를: 비행기를 타다." },
      { ko: "비행기가 몇 시에 출발해요?", en: "What time does the plane leave?" },
      { ko: "비행기 표를 예약했어요.", en: "I booked a plane ticket." }
    ],
    "을 수밖에 없다|expression": [
      { ko: "기다릴 수밖에 없어요.", en: "There is nothing to do but wait.", note: "Verb + -(으)ㄹ 수밖에 없다: no other option is left." },
      { ko: "비싸지만 살 수밖에 없었어요.", en: "It was expensive, but I had no choice but to buy it." },
      { ko: "그렇게 할 수밖에 없었어요.", en: "There was nothing else I could do." }
    ],
    "낮|noun": [
      { ko: "낮에는 따뜻해요.", en: "It is warm during the day.", note: "낮 is daytime, 밤 night. Pronounced 낟 on its own." },
      { ko: "낮에 만날까요?", en: "Shall we meet in the daytime?" },
      { ko: "낮과 밤이 달라요.", en: "Day and night are quite different." }
    ],
    "일흔|numeral": [
      { ko: "할아버지가 일흔이세요.", en: "My grandfather is seventy." },
      { ko: "일흔 명쯤 왔어요.", en: "About seventy people came." },
      { ko: "일흔이 넘으셨어요.", en: "They are over seventy." }
    ],
    "고맙다|adjective": [
      { ko: "고마워요.", en: "Thank you.", casual: "고마워.", note: "고맙다 is ㅂ-irregular: 고마워요. It is the native word; 감사하다 is the Sino-Korean one." },
      { ko: "도와줘서 고마워요.", en: "Thanks for helping." },
      { ko: "언제나 고마워요.", en: "Thank you, always." }
    ],
    "걷다|verb": [
      { ko: "걸어서 갈까요?", en: "Shall we walk?", note: "걷다 is ㄷ-irregular: 걸어요, 걸었어요." },
      { ko: "십 분쯤 걸어요.", en: "It is about a ten minute walk." },
      { ko: "매일 삼십 분씩 걸어요.", en: "I walk for thirty minutes a day." }
    ],
    "오전|noun": [
      { ko: "오전에 회의가 있어요.", en: "I have a meeting in the morning.", note: "오전 is before noon, 오후 after; in front of a clock time they carry a.m. and p.m." },
      { ko: "오전 아홉 시에 만나요.", en: "Let's meet at nine a.m." },
      { ko: "오전에는 바빠요.", en: "I am busy in the morning." }
    ],
    "센티미터|dependent noun": [
      { ko: "키가 백칠십 센티미터예요.", en: "I am a hundred and seventy centimetres tall.", note: "센티 is the everyday spoken short form." },
      { ko: "십 센티미터만 짧게 해 주세요.", en: "Please take ten centimetres off." },
      { ko: "몇 센티미터예요?", en: "How many centimetres is it?" }
    ],
    "가게|noun": [
      { ko: "가게가 문을 닫았어요.", en: "The shop has closed.", note: "문을 닫다 is how a business closes, for the day or for good." },
      { ko: "집 앞에 가게가 있어요.", en: "There is a shop in front of my house." },
      { ko: "가게에서 우유를 샀어요.", en: "I bought milk at the shop." }
    ],
    "약속|noun": [
      { ko: "약속이 있어요.", en: "I have plans.", note: "약속 is both a promise and an appointment, which makes this the standard polite decline." },
      { ko: "약속을 지키세요.", en: "Keep your promise.", note: "Promises are 'kept' in Korean too: 약속을 지키다." },
      { ko: "약속 시간에 늦었어요.", en: "I was late for our appointment." }
    ],
    "시작되다|verb": [
      { ko: "수업이 시작됐어요.", en: "The class has started.", note: "시작되다 is what starts by itself; 시작하다 is someone starting it." },
      { ko: "언제부터 시작돼요?", en: "When does it start from?" },
      { ko: "영화가 시작됐어요.", en: "The film has started." }
    ],
    "인사|noun": [
      { ko: "인사 좀 드릴게요.", en: "Let me pay my respects.", note: "인사드리다 is the humble form, used when greeting someone senior." },
      { ko: "인사하세요.", en: "Say hello.", note: "인사하다 is one verb: 선생님께 인사했어요." },
      { ko: "인사도 없이 갔어요.", en: "They left without even a goodbye." }
    ],
    "을 리가 없다|expression": [
      { ko: "그럴 리가 없어요.", en: "There is no way that is so.", note: "Verb + -(으)ㄹ 리가 없다: the speaker refuses to believe it." },
      { ko: "그 사람이 거짓말할 리가 없어요.", en: "There is no way they would lie." },
      { ko: "이 시간에 올 리가 없어요.", en: "There is no way they would come at this hour." }
    ],
    "커녕|particle": [
      { ko: "밥은커녕 물도 못 마셨어요.", en: "Let alone a meal, I could not even drink water.", note: "Noun + 은/는커녕, dismissing the first thing to make the second sting. It always closes with a negative." },
      { ko: "칭찬은커녕 혼났어요.", en: "Far from being praised, I got told off." },
      { ko: "쉬기는커녕 더 바빠졌어요.", en: "Far from resting, I got even busier." }
    ],
    "소금|noun": [
      { ko: "소금 좀 주세요.", en: "Pass the salt, please." },
      { ko: "소금을 조금만 넣으세요.", en: "Add just a little salt." },
      { ko: "소금이 너무 많이 들어갔어요.", en: "Too much salt has gone in." }
    ],
    "갑|counter": [
      { ko: "담배 한 갑 주세요.", en: "One packet of cigarettes, please.", note: "갑 counts small boxed packs — cigarettes, matches, tissues." },
      { ko: "두 갑에 얼마예요?", en: "How much for two packs?" },
      { ko: "휴지 한 갑 사 주세요.", en: "Please buy a box of tissues." }
    ],
    "와|interjection": [
      { ko: "와, 정말 예뻐요!", en: "Wow, it really is lovely!" },
      { ko: "와, 대단하네요!", en: "Wow, that is impressive!", note: "-네요 reacts to something you have just noticed." },
      { ko: "와, 진짜 맛있어요!", en: "Wow, this is really good!" }
    ],
    "자전거|noun": [
      { ko: "자전거를 타요.", en: "I ride a bicycle.", note: "What you ride takes 을/를: 자전거를 타다." },
      { ko: "자전거로 학교에 가요.", en: "I go to school by bike." },
      { ko: "자전거를 빌릴 수 있어요?", en: "Can I hire a bicycle?" }
    ],
    "바쁘다|adjective": [
      { ko: "요즘 바빠요.", en: "I am busy these days.", note: "바쁘다 is ㅡ-irregular: 바빠요." },
      { ko: "바쁘면 나중에 해요.", en: "If you are busy, let's do it later." },
      { ko: "바쁜 일이 있어요?", en: "Have you got something urgent on?" }
    ],

    // ================================================================ day 13
    "목|noun": [
      { ko: "목이 아파요.", en: "I have a sore throat.", note: "목 is both the neck and the throat, so this covers either." },
      { ko: "목이 말라요.", en: "I am thirsty.", note: "Literally 'my throat is dry' — the standard way to say it." },
      { ko: "목도리를 하세요.", en: "Put a scarf on.", note: "목도리 is literally a neck-wrap." }
    ],
    "말다|verb": [
      { ko: "걱정하지 마세요.", en: "Do not worry.", note: "말다 only lives inside -지 말다, the negative command. It is ㄹ-irregular: 마세요, 마." },
      { ko: "늦지 마세요.", en: "Do not be late." },
      { ko: "그런 말은 하지 마세요.", en: "Do not say things like that." }
    ],
    "정말|adverb": [
      { ko: "정말 맛있어요.", en: "It really is delicious." },
      { ko: "정말요?", en: "Really?", casual: "진짜?", note: "진짜 is the casual twin and is heard far more in speech." },
      { ko: "정말 고마워요.", en: "Thank you, truly." }
    ],
    "네|determiner": [
      { ko: "네 개 주세요.", en: "Four, please.", note: "넷 shortens to 네 in front of a counter — 네 개, 네 명, 네 시." },
      { ko: "네 시에 만나요.", en: "Let's meet at four." },
      { ko: "네 명이 왔어요.", en: "Four people came." }
    ],
    "교통|noun": [
      { ko: "교통이 편리해요.", en: "The transport links are good." },
      { ko: "교통사고가 났어요.", en: "There has been a traffic accident.", note: "사고가 나다 is the fixed pairing for an accident happening." },
      { ko: "이 시간에는 교통이 복잡해요.", en: "The traffic is heavy at this hour." }
    ],
    "은 척하다|expression": [
      { ko: "모르는 척했어요.", en: "I pretended not to know.", note: "Verb + -는 척하다, adjective + -(으)ㄴ 척하다: to put on an act." },
      { ko: "자는 척하지 마세요.", en: "Do not pretend to be asleep." },
      { ko: "괜찮은 척했어요.", en: "I pretended to be fine." }
    ],
    "신경 쓰지 마세요|phrase": [
      { ko: "신경 쓰지 마세요.", en: "Never mind.", casual: "신경 쓰지 마.", note: "신경을 쓰다 is to let something occupy you; this tells someone to let it go." },
      { ko: "제 걱정은 신경 쓰지 마세요.", en: "Do not trouble yourself about me." },
      { ko: "그런 건 신경 쓰지 마세요.", en: "Do not let that bother you." }
    ],
    "미국|proper noun": [
      { ko: "미국에서 왔어요.", en: "I am from America." },
      { ko: "미국 사람이에요?", en: "Are you American?", note: "Country + 사람 makes the nationality." },
      { ko: "미국에 가 본 적이 있어요?", en: "Have you ever been to America?" }
    ],
    "고령화 사회|noun phrase": [
      { ko: "한국은 고령화 사회예요.", en: "Korea is an ageing society." },
      { ko: "고령화 사회 문제가 심각해요.", en: "The problems of an ageing society are serious." },
      { ko: "고령화 사회를 준비해야 해요.", en: "We have to prepare for an ageing society." }
    ],
    "거리|noun": [
      { ko: "거리에 사람이 많아요.", en: "There are a lot of people on the street." },
      { ko: "거리가 얼마나 돼요?", en: "How far is it?", note: "The same 거리 is a distance as well as a street." },
      { ko: "거리를 걸었어요.", en: "We walked the streets." }
    ],
    "아무|pronoun": [
      { ko: "아무도 안 왔어요.", en: "Nobody came.", note: "아무도 always takes a negative behind it." },
      { ko: "아무나 할 수 있어요.", en: "Anyone can do it.", note: "아무나 is the positive 'anyone at all'." },
      { ko: "아무한테도 말하지 마세요.", en: "Do not tell anybody.", note: "아무한테도 takes a negative behind it." }
    ],
    "칠|numeral": [
      { ko: "칠월에 휴가를 가요.", en: "I take my holiday in July.", note: "Sino-Korean 칠 names months and dates; native 일곱 counts objects." },
      { ko: "칠 층에 있어요.", en: "It is on the seventh floor." },
      { ko: "칠 번 버스를 타세요.", en: "Take the number seven bus." }
    ],
    "한글|noun": [
      { ko: "한글을 읽을 수 있어요.", en: "I can read Hangul.", note: "한글 is the alphabet; 한국어 is the language. They are not interchangeable." },
      { ko: "한글은 배우기 쉬워요.", en: "Hangul is easy to learn.", note: "-기 쉽다 is 'easy to do'; -기 어렵다 is its opposite." },
      { ko: "한글날은 시월 구일이에요.", en: "Hangul Day is the ninth of October." }
    ],
    "그런데도|conjunction": [
      { ko: "비가 왔어요. 그런데도 갔어요.", en: "It rained. And yet we went.", note: "그런데도 is 그래도 with more weight — 'even given that'." },
      { ko: "열심히 했어요. 그런데도 떨어졌어요.", en: "I worked hard, and still I failed." },
      { ko: "몸이 아파요. 그런데도 일해야 해요.", en: "I am ill. And yet I have to work." }
    ],
    "설명하다|verb": [
      { ko: "다시 설명해 주세요.", en: "Please explain it again." },
      { ko: "제가 설명할게요.", en: "Let me explain." },
      { ko: "이 단어를 설명해 주시겠어요?", en: "Could you explain this word?" }
    ],
    "세|dependent noun": [
      { ko: "삼십 세 이상만 가능해요.", en: "Only those over thirty are eligible.", note: "세 is the formal age counter, with Sino-Korean numbers. Everyday speech uses 살." },
      { ko: "이십 세 미만은 들어갈 수 없어요.", en: "Under-twenties may not enter." },
      { ko: "만 십팔 세부터 가능합니다.", en: "Available from the age of eighteen." }
    ],
    "가을|noun": [
      { ko: "가을 날씨가 좋아요.", en: "Autumn weather is lovely." },
      { ko: "가을에 단풍이 예뻐요.", en: "The autumn leaves are beautiful.", note: "단풍 is the autumn colour, and 단풍 구경 the outing to see it." },
      { ko: "가을이 제일 좋아요.", en: "Autumn is my favourite." }
    ],
    "내일|noun": [
      { ko: "내일 만나요.", en: "See you tomorrow.", note: "내일, 오늘 and 어제 take no 에." },
      { ko: "내일까지 끝내야 해요.", en: "It has to be finished by tomorrow." },
      { ko: "내일 시간 있어요?", en: "Are you free tomorrow?" }
    ],
    "이나|particle": [
      { ko: "커피나 차 드릴까요?", en: "Would you like coffee or tea?", note: "이나 after a consonant, 나 after a vowel." },
      { ko: "세 시간이나 기다렸어요.", en: "I waited a full three hours.", note: "After a number, 이나 expresses surprise at how much." },
      { ko: "주스나 물 주세요.", en: "Juice or water, please." }
    ],
    "을 지경이다|expression": [
      { ko: "배고파서 쓰러질 지경이에요.", en: "I am so hungry I could collapse.", note: "Verb + -(으)ㄹ 지경이다: pushed to the edge of something, nearly always bad." },
      { ko: "너무 바빠서 울 지경이에요.", en: "I am so busy I could cry." },
      { ko: "피곤해서 쓰러질 지경이에요.", en: "I am so tired I could drop." }
    ],
    "손가락|noun": [
      { ko: "손가락을 다쳤어요.", en: "I hurt my finger.", note: "손가락 is a finger, 발가락 a toe — 가락 is the shared part." },
      { ko: "손가락으로 가리키지 마세요.", en: "Do not point with your finger." },
      { ko: "손가락이 열 개예요.", en: "There are ten fingers." }
    ],
    "나쁘다|adjective": [
      { ko: "날씨가 나빠요.", en: "The weather is bad.", note: "나쁘다 is ㅡ-irregular: 나빠요." },
      { ko: "기분이 나빠요.", en: "That upsets me.", note: "기분이 나쁘다 is how you say something offended you." },
      { ko: "나쁜 소식이 있어요.", en: "I have bad news." }
    ],
    "놀라다|verb": [
      { ko: "깜짝 놀랐어요!", en: "You gave me a fright!", note: "깜짝 is the adverb that goes with a sudden start." },
      { ko: "그 소식을 듣고 놀랐어요.", en: "I was surprised to hear the news." },
      { ko: "놀라게 해서 미안해요.", en: "Sorry for startling you." }
    ],
    "급|noun": [
      { ko: "한국어능력시험 몇 급이에요?", en: "What TOPIK level are you?", note: "급 numbers levels and grades with Sino-Korean numbers: 일 급, 이 급." },
      { ko: "이 급부터 시작했어요.", en: "I started at level two." },
      { ko: "육 급이 제일 높아요.", en: "Level six is the highest." }
    ],
    "날씨|noun": [
      { ko: "날씨가 좋아요.", en: "The weather is nice.", note: "The safest small-talk opener there is." },
      { ko: "오늘 날씨가 어때요?", en: "How is the weather today?" },
      { ko: "날씨 때문에 취소됐어요.", en: "It was cancelled because of the weather." }
    ],
    "매우|adverb": [
      { ko: "매우 중요한 문제예요.", en: "It is a very important issue.", note: "매우 is written Korean; 아주 and 정말 are what people say." },
      { ko: "매우 만족합니다.", en: "I am very satisfied." },
      { ko: "매우 감사합니다.", en: "Thank you very much indeed." }
    ],
    "동물|noun": [
      { ko: "동물을 좋아해요.", en: "I like animals." },
      { ko: "동물원에 갔어요.", en: "I went to the zoo.", note: "동물원 is literally an animal garden." },
      { ko: "무슨 동물을 좋아해요?", en: "What animals do you like?" }
    ],
    "울다|verb": [
      { ko: "아기가 울어요.", en: "The baby is crying.", note: "울다 is ㄹ-irregular: 웁니다, 우는." },
      { ko: "울지 마세요.", en: "Please do not cry." },
      { ko: "왜 울어요?", en: "Why are you crying?" }
    ],
    "의사|noun": [
      { ko: "의사한테 가 보세요.", en: "You should see a doctor." },
      { ko: "저는 의사가 되고 싶어요.", en: "I want to become a doctor.", note: "What you become takes 이/가, not 을/를." },
      { ko: "의사 선생님이 친절하세요.", en: "The doctor is kind.", note: "의사 선생님 is how patients address a doctor." }
    ],
    "기 십상이다|expression": [
      { ko: "서두르면 실수하기 십상이에요.", en: "Rush and you are likely to slip up.", note: "Verb + -기 십상이다: very likely, and nearly always a bad outcome." },
      { ko: "밤에 커피를 마시면 잠을 못 자기 십상이에요.", en: "Drink coffee at night and you will probably not sleep." },
      { ko: "안 자면 감기에 걸리기 십상이에요.", en: "If you do not sleep you are likely to catch a cold." }
    ],
    "병|noun": [
      { ko: "병이 났어요.", en: "I have fallen ill.", note: "병이 나다 is the fixed pairing for falling ill." },
      { ko: "맥주 두 병 주세요.", en: "Two bottles of beer, please.", note: "The same 병 is a bottle, and the counter for bottles." },
      { ko: "병을 고쳤어요.", en: "The illness was cured." }
    ],
    "서두르지 마세요|phrase": [
      { ko: "서두르지 마세요.", en: "Do not rush.", casual: "서두르지 마.", note: "서두르다 is 르-irregular: 서둘러요." },
      { ko: "천천히 하세요, 서두르지 마세요.", en: "Take your time, there is no rush." },
      { ko: "시간 많으니까 서두르지 마세요.", en: "There is plenty of time, so do not rush." }
    ],
    "다섯째|numeral": [
      { ko: "다섯째 줄에 앉으세요.", en: "Please sit in the fifth row." },
      { ko: "다섯째 아이가 태어났어요.", en: "Their fifth child was born." },
      { ko: "다섯째 손가락이 제일 작아요.", en: "The fifth finger is the smallest." }
    ],
    "축구|noun": [
      { ko: "축구를 좋아해요.", en: "I like football." },
      { ko: "주말에 축구를 해요.", en: "I play football at the weekend.", note: "Ball games with the feet take 하다; racket sports take 치다." },
      { ko: "축구 경기를 봤어요.", en: "I watched a football match." }
    ],
    "쌍|counter": [
      { ko: "젓가락 한 쌍 주세요.", en: "One pair of chopsticks, please.", note: "쌍 counts things that come as a matched pair, including couples: 부부 한 쌍." },
      { ko: "저기 한 쌍이 앉아 있어요.", en: "A couple is sitting over there." },
      { ko: "양말 두 쌍을 샀어요.", en: "I bought two pairs of socks." }
    ],
    "우와|interjection": [
      { ko: "우와, 정말 크네요!", en: "Wow, it really is big!", note: "우와 is 와 with more force behind it." },
      { ko: "우와, 한국어를 잘하시네요!", en: "Wow, your Korean is good!" },
      { ko: "우와, 벌써 다 했어요?", en: "Wow, you have finished already?" }
    ],
    "마리|dependent noun": [
      { ko: "강아지 두 마리를 키워요.", en: "I keep two puppies.", note: "마리 counts animals and fish, with native numbers. 키우다 is to raise or keep." },
      { ko: "물고기가 몇 마리 있어요?", en: "How many fish are there?" },
      { ko: "고양이 한 마리를 키워요.", en: "I keep one cat." }
    ],
    "버리다|auxiliary verb": [
      { ko: "다 먹어 버렸어요.", en: "I ate the whole lot.", note: "-아/어 버리다 finishes something off, often with relief or regret attached." },
      { ko: "지갑을 잃어버렸어요.", en: "I have lost my wallet.", note: "잃어버리다 is written as one word — losing something for good." },
      { ko: "그 사람을 잊어버렸어요.", en: "I have forgotten them completely." }
    ],
    "늦다|adjective": [
      { ko: "늦어서 죄송합니다.", en: "I am sorry I am late.", note: "늦다 works as both adjective and verb: 늦었어요 covers 'it is late' and 'I was late'." },
      { ko: "벌써 늦었어요.", en: "It is late already." },
      { ko: "늦게 일어났어요.", en: "I got up late." }
    ],
    "장소|noun": [
      { ko: "약속 장소가 어디예요?", en: "Where are we meeting?" },
      { ko: "조용한 장소를 찾고 있어요.", en: "I am looking for a quiet spot.", note: "장소 stands alone; 곳 always needs a modifier in front." },
      { ko: "장소를 바꿀까요?", en: "Shall we change the venue?" }
    ],
    "지내다|verb": [
      { ko: "잘 지냈어요?", en: "How have you been?", note: "The past tense asks about the time since you last met." },
      { ko: "요즘 어떻게 지내요?", en: "How are things going these days?" },
      { ko: "잘 지내세요.", en: "Take care of yourself.", note: "A warm way to close a letter or a goodbye." }
    ],
    "백|determiner": [
      { ko: "백 명이 왔어요.", en: "A hundred people came.", note: "백 sits in front of a counter and takes no particle." },
      { ko: "백 원짜리 있어요?", en: "Do you have a hundred-won coin?", note: "-짜리 marks what something is worth." },
      { ko: "백 년 전 이야기예요.", en: "It is a story from a hundred years ago." }
    ],
    "이든지|particle": [
      { ko: "뭐든지 괜찮아요.", en: "Anything is fine.", note: "이든지 after a consonant, 든지 after a vowel. It attaches to question words: 누구든지, 언제든지." },
      { ko: "언제든지 전화하세요.", en: "Call any time." },
      { ko: "누구든지 올 수 있어요.", en: "Anybody can come." }
    ],
    "코|noun": [
      { ko: "코가 막혔어요.", en: "My nose is blocked." },
      { ko: "코를 풀었어요.", en: "I blew my nose.", note: "코를 풀다 is the fixed pairing." },
      { ko: "코감기에 걸렸어요.", en: "I have a head cold." }
    ],
    "언제|pronoun": [
      { ko: "언제 만날까요?", en: "When shall we meet?" },
      { ko: "언제부터 배웠어요?", en: "Since when have you been learning?" },
      { ko: "언제든지 괜찮아요.", en: "Any time is fine." }
    ],
    "는 셈이다|expression": [
      { ko: "거의 다 끝난 셈이에요.", en: "It is as good as finished.", note: "Verb + -(으)ㄴ/는 셈이다: not literally so, but it amounts to the same thing." },
      { ko: "이 정도면 싼 셈이에요.", en: "At this price it counts as cheap." },
      { ko: "한 달에 한 번 보는 셈이에요.", en: "It amounts to seeing each other once a month." }
    ],
    "고등학교|noun": [
      { ko: "고등학교에 다녀요.", en: "I go to high school.", note: "초등학교, 중학교, 고등학교 — primary, middle, high. 고등학생 is the pupil." },
      { ko: "고등학교 친구예요.", en: "We were friends at high school." },
      { ko: "고등학교를 졸업했어요.", en: "I graduated from high school.", note: "졸업하다 takes 을/를 for the school." }
    ],
    "교실|noun": [
      { ko: "교실에서 기다리세요.", en: "Please wait in the classroom." },
      { ko: "교실이 조용해요.", en: "The classroom is quiet." },
      { ko: "교실이 삼 층에 있어요.", en: "The classroom is on the third floor." }
    ],
    "팔다|verb": [
      { ko: "여기에서 표를 팔아요.", en: "They sell tickets here.", note: "팔다 is ㄹ-irregular: 팝니다. Its opposite is 사다." },
      { ko: "이거 얼마에 팔아요?", en: "How much are you selling this for?" },
      { ko: "다 팔렸어요.", en: "They are all sold out.", note: "팔리다 is the passive: to be sold." }
    ],
    "별|noun": [
      { ko: "별이 많아요.", en: "There are a lot of stars." },
      { ko: "오늘 밤에 별이 잘 보여요.", en: "The stars are clear tonight.", note: "보이다 is 'to be visible' — the passive of 보다." },
      { ko: "별을 보러 갔어요.", en: "We went to look at the stars." }
    ],

    // ================================================================ day 14
    "꼭|adverb": [
      { ko: "꼭 오세요.", en: "Do come, without fail." },
      { ko: "꼭 한번 가 보고 싶어요.", en: "I really do want to go once.", note: "꼭 adds weight to a promise, a request or a wish." },
      { ko: "꼭 필요해요.", en: "It is absolutely necessary." }
    ],
    "중국|proper noun": [
      { ko: "중국에 가 봤어요?", en: "Have you been to China?" },
      { ko: "중국어를 배우고 있어요.", en: "I am learning Chinese.", note: "Country + 어 makes the language: 중국어, 한국어, 일본어." },
      { ko: "중국 음식을 좋아해요.", en: "I like Chinese food." }
    ],
    "저출산 문제|noun phrase": [
      { ko: "저출산 문제가 심각해요.", en: "The low birth rate is a serious problem." },
      { ko: "저출산 문제를 해결해야 해요.", en: "We have to solve the low birth rate problem." },
      { ko: "저출산 문제는 쉽지 않아요.", en: "The low birth rate is not an easy problem." }
    ],
    "색|noun": [
      { ko: "무슨 색을 좋아해요?", en: "What colour do you like?" },
      { ko: "다른 색 있어요?", en: "Do you have another colour?", note: "색깔 is the fuller word and just as common in speech." },
      { ko: "이 색이 마음에 들어요.", en: "I like this colour." }
    ],
    "아니면|conjunction": [
      { ko: "커피 아니면 차 드릴까요?", en: "Coffee, or would you prefer tea?", note: "아니면 joins two whole options; 이나 joins two nouns." },
      { ko: "지금 갈까요? 아니면 나중에 갈까요?", en: "Shall we go now, or later?" },
      { ko: "제가 갈까요? 아니면 오실래요?", en: "Shall I go, or will you come?" }
    ],
    "보통|noun": [
      { ko: "보통 일곱 시에 일어나요.", en: "I usually get up at seven.", note: "보통 works as an adverb without a particle." },
      { ko: "보통 사람들은 그렇게 생각해요.", en: "Ordinary people think that way." },
      { ko: "보통 주말에 쉬어요.", en: "I usually rest at the weekend." }
    ],
    "을 뻔하다|expression": [
      { ko: "넘어질 뻔했어요.", en: "I almost fell over.", note: "Verb + -(으)ㄹ 뻔하다, always in the past: it nearly happened but did not." },
      { ko: "늦을 뻔했어요.", en: "I very nearly was late." },
      { ko: "사고가 날 뻔했어요.", en: "There was nearly an accident." }
    ],
    "낮다|adjective": [
      { ko: "가격이 낮아요.", en: "The price is low.", note: "낮다 is low in height or level; its opposite is 높다." },
      { ko: "이 건물은 낮아요.", en: "This building is low." },
      { ko: "온도가 낮아요.", en: "The temperature is low." }
    ],
    "일하다|verb": [
      { ko: "어디에서 일해요?", en: "Where do you work?" },
      { ko: "저는 은행에서 일해요.", en: "I work at a bank.", note: "Where the work happens takes 에서." },
      { ko: "주말에도 일해요?", en: "Do you work weekends too?" }
    ],
    "식당|noun": [
      { ko: "근처에 식당이 있어요?", en: "Is there a restaurant nearby?" },
      { ko: "이 식당 맛있어요.", en: "This restaurant is good." },
      { ko: "식당을 예약했어요.", en: "I booked a restaurant." }
    ],
    "칠월|noun": [
      { ko: "칠월에 휴가를 가요.", en: "I go on holiday in July." },
      { ko: "칠월은 정말 더워요.", en: "July is really hot." },
      { ko: "칠월 말에 가요.", en: "I am going at the end of July." }
    ],
    "부담 갖지 마세요|phrase": [
      { ko: "부담 갖지 마세요.", en: "Please do not feel obliged.", casual: "부담 갖지 마.", note: "부담 is the weight of an obligation. Said when offering help or a gift, so the other person can accept freely." },
      { ko: "그냥 드리는 거예요. 부담 갖지 마세요.", en: "It is just a gift. Do not feel you owe me." },
      { ko: "편하게 생각하고 부담 갖지 마세요.", en: "Take it easy and do not feel any pressure." }
    ],
    "백|numeral": [
      { ko: "백 원이에요.", en: "It is a hundred won.", note: "Korean counts in units of ten thousand above this: 백, 천, 만, 십만." },
      { ko: "백 명이 넘었어요.", en: "There were more than a hundred people." },
      { ko: "백 퍼센트 확실해요.", en: "I am a hundred percent sure." }
    ],
    "호|dependent noun": [
      { ko: "삼백이 호에 묵고 있어요.", en: "I am staying in room 302.", note: "호 numbers rooms and magazine issues, with Sino-Korean numbers." },
      { ko: "이번 호 잡지를 읽었어요.", en: "I read this issue of the magazine." },
      { ko: "몇 호에 사세요?", en: "Which flat number do you live in?" }
    ],
    "이라도|particle": [
      { ko: "커피라도 한잔할까요?", en: "Shall we at least have a coffee?", note: "이라도 after a consonant, 라도 after a vowel: not the first choice, but better than nothing." },
      { ko: "물이라도 드릴까요?", en: "Can I at least get you some water?" },
      { ko: "잠깐이라도 쉬세요.", en: "Rest, even if only briefly." }
    ],
    "십이월|noun": [
      { ko: "십이월에 눈이 와요.", en: "It snows in December." },
      { ko: "십이월 이십오일은 크리스마스예요.", en: "The twenty-fifth of December is Christmas." },
      { ko: "십이월은 정말 바빠요.", en: "December is really busy." }
    ],
    "올라가다|verb": [
      { ko: "삼 층으로 올라가세요.", en: "Please go up to the third floor.", note: "올라가다 goes up away from the speaker; 올라오다 comes up toward them." },
      { ko: "산에 올라갔어요.", en: "We climbed the mountain." },
      { ko: "값이 계속 올라가요.", en: "Prices keep going up." }
    ],
    "컵|noun": [
      { ko: "컵 하나 주세요.", en: "One cup, please.", note: "컵 is the cup itself; 잔 is the counter for a cupful of drink." },
      { ko: "종이컵 있어요?", en: "Do you have paper cups?" },
      { ko: "컵에 물을 따라 주세요.", en: "Please pour some water into the cup." }
    ],
    "고 말다|expression": [
      { ko: "결국 울고 말았어요.", en: "In the end I broke down and cried.", note: "Verb + -고 말다: it ended that way despite you, usually with regret. 결국 often comes with it." },
      { ko: "지각하고 말았어요.", en: "I ended up being late after all." },
      { ko: "약속을 잊고 말았어요.", en: "I ended up forgetting the appointment." }
    ],
    "종이|noun": [
      { ko: "종이 한 장 주세요.", en: "One sheet of paper, please.", note: "장 is the counter for flat things." },
      { ko: "종이에 쓰세요.", en: "Write it on the paper." },
      { ko: "종이가 다 떨어졌어요.", en: "We have run out of paper." }
    ],
    "재미|noun": [
      { ko: "재미가 없어요.", en: "It is no fun.", note: "재미 + 있다/없다 make 재미있다 and 재미없다, both written as one word." },
      { ko: "요즘 사는 재미가 있어요.", en: "Life is good fun these days." },
      { ko: "재미로 시작했어요.", en: "I started it for fun." }
    ],
    "떡|noun": [
      { ko: "떡을 먹어 봤어요?", en: "Have you tried tteok?", note: "떡 is rice cake, eaten at holidays and celebrations." },
      { ko: "설날에 떡국을 먹어요.", en: "We eat rice cake soup at New Year." },
      { ko: "떡이 정말 맛있어요.", en: "The rice cake is really good." }
    ],
    "태어나다|verb": [
      { ko: "서울에서 태어났어요.", en: "I was born in Seoul.", note: "The place of birth takes 에서." },
      { ko: "언제 태어났어요?", en: "When were you born?" },
      { ko: "아기가 태어났어요.", en: "The baby has been born." }
    ],
    "즐겁다|adjective": [
      { ko: "즐거운 주말 보내세요.", en: "Have a good weekend.", note: "즐겁다 is ㅂ-irregular: 즐거워요, 즐거운." },
      { ko: "오늘 정말 즐거웠어요.", en: "I really enjoyed today." },
      { ko: "즐겁게 지내세요.", en: "Enjoy yourself." }
    ],
    "계속|adverb": [
      { ko: "계속하세요.", en: "Please carry on.", note: "계속하다 written together is 'to continue something'." },
      { ko: "비가 계속 와요.", en: "It keeps raining." },
      { ko: "계속 연락해요.", en: "Let's keep in touch." }
    ],
    "인분|counter": [
      { ko: "삼겹살 이 인분 주세요.", en: "Two portions of pork belly, please.", note: "인분 counts portions of food, with Sino-Korean numbers, and most Korean barbecue is ordered this way." },
      { ko: "몇 인분 시킬까요?", en: "How many portions shall we order?" },
      { ko: "일 인분만 주세요.", en: "One portion, please." }
    ],
    "둘째|determiner": [
      { ko: "둘째 아이가 다섯 살이에요.", en: "My second child is five." },
      { ko: "둘째 주 월요일에 만나요.", en: "Let's meet on the second Monday." },
      { ko: "둘째 딸이에요.", en: "She is my second daughter." }
    ],
    "여러분|pronoun": [
      { ko: "여러분, 안녕하세요.", en: "Hello, everyone.", note: "여러분 addresses a group politely — an audience, a class, readers." },
      { ko: "여러분의 도움이 필요해요.", en: "We need your help." },
      { ko: "여러분, 잘 들어 주세요.", en: "Everyone, please listen carefully." }
    ],
    "어머|interjection": [
      { ko: "어머, 정말요?", en: "Oh my, really?", note: "어머 is mainly used by women; 어 and 아이고 are the neutral equivalents." },
      { ko: "어머, 깜짝이야!", en: "Oh! You startled me!" },
      { ko: "어머, 이게 누구예요!", en: "Oh my, look who it is!" }
    ],
    "대답|noun": [
      { ko: "대답해 주세요.", en: "Please answer me.", note: "대답하다 is answering a question; 답장하다 is replying to a letter." },
      { ko: "대답이 없어요.", en: "There is no answer." },
      { ko: "대답을 기다리고 있어요.", en: "I am waiting for an answer." }
    ],
    "시작|noun": [
      { ko: "시작이 반이에요.", en: "Starting is half the battle.", note: "A set saying — literally 'the beginning is half'." },
      { ko: "시작 시간이 몇 시예요?", en: "What time does it start?" },
      { ko: "좋은 시작이에요.", en: "That is a good start." }
    ],
    "아 버리다|expression": [
      { ko: "다 써 버렸어요.", en: "I have used it all up.", note: "-아/어 버리다 finishes something off, with relief or regret behind it." },
      { ko: "친구가 먼저 가 버렸어요.", en: "My friend went off without me." },
      { ko: "표가 다 팔려 버렸어요.", en: "The tickets all sold out on us." }
    ],
    "일주일|noun": [
      { ko: "일주일에 한 번 만나요.", en: "We meet once a week.", note: "Period + 에 + frequency is 'per'." },
      { ko: "일주일 동안 여행했어요.", en: "I travelled for a week." },
      { ko: "일주일 후에 다시 오세요.", en: "Come back in a week." }
    ],
    "가르치다|verb": [
      { ko: "한국어를 가르쳐요.", en: "I teach Korean.", note: "가르치다 is to teach; 가리키다 is to point at, and the two get confused." },
      { ko: "저한테 가르쳐 주세요.", en: "Please teach me." },
      { ko: "어느 학교에서 가르치세요?", en: "Which school do you teach at?" }
    ],
    "춤|noun": [
      { ko: "춤을 춰요.", en: "I dance.", note: "Dance is 'danced' with its own verb: 춤을 추다." },
      { ko: "춤을 잘 추네요!", en: "You dance well!" },
      { ko: "같이 춤출까요?", en: "Shall we dance?" }
    ],
    "쯤|particle": [
      { ko: "세 시쯤 만나요.", en: "Let's meet at about three.", note: "쯤 attaches straight to the noun; 정도 is the fuller word that follows it." },
      { ko: "십 분쯤 걸려요.", en: "It takes about ten minutes." },
      { ko: "언제쯤 도착해요?", en: "About when will you arrive?" }
    ],
    "해|dependent noun": [
      { ko: "세 해가 지났어요.", en: "Three years have passed.", note: "해 counts years with native numbers; 년 does the same with Sino-Korean ones and is far more common." },
      { ko: "올해도 좋은 해가 되기를 바랍니다.", en: "I hope this year is a good one too." },
      { ko: "해마다 한국에 가요.", en: "I go to Korea every year.", note: "해마다 is 'every year'." }
    ],
    "사십|numeral": [
      { ko: "사십 분 걸려요.", en: "It takes forty minutes.", note: "Minutes take Sino-Korean numbers: 사십 분. Ages take native 마흔." },
      { ko: "사십 명이 왔어요.", en: "Forty people came." },
      { ko: "사십 퍼센트 할인해요.", en: "It is forty percent off." }
    ],
    "편하게 하세요|phrase": [
      { ko: "편하게 하세요.", en: "Make yourself comfortable.", casual: "편하게 해.", note: "Said to a guest. 편하게 있으세요 does the same job." },
      { ko: "여기 앉아서 편하게 하세요.", en: "Sit here and make yourself at home." },
      { ko: "신발 벗고 편하게 하세요.", en: "Take your shoes off and make yourself at home." }
    ],
    "스트레스|noun": [
      { ko: "스트레스를 받아요.", en: "I am under stress.", note: "Stress is 'received' in Korean: 스트레스를 받다." },
      { ko: "스트레스를 어떻게 풀어요?", en: "How do you let off steam?", note: "스트레스를 풀다 is to release it." },
      { ko: "스트레스가 너무 심해요.", en: "The stress is too much." }
    ],
    "과일|noun": [
      { ko: "과일을 자주 먹어요.", en: "I eat fruit often." },
      { ko: "무슨 과일을 좋아해요?", en: "What fruit do you like?" },
      { ko: "과일 좀 드세요.", en: "Do have some fruit." }
    ],
    "걸다|verb": [
      { ko: "전화 걸게요.", en: "I will give you a call.", note: "전화를 걸다 is to make a call; 전화를 받다 is to take one. 걸다 is ㄹ-irregular: 겁니다." },
      { ko: "옷을 여기에 거세요.", en: "Please hang your coat here." },
      { ko: "누구한테 전화 걸었어요?", en: "Who did you call?" }
    ],
    "예쁘다|adjective": [
      { ko: "정말 예뻐요.", en: "It is really pretty.", note: "예쁘다 is ㅡ-irregular: 예뻐요." },
      { ko: "예쁜 옷을 샀어요.", en: "I bought a pretty dress." },
      { ko: "이 색이 더 예뻐요.", en: "This colour is prettier." }
    ],
    "아 놓다|expression": [
      { ko: "미리 사 놓았어요.", en: "I bought it in advance and have it ready.", note: "-아/어 놓다 leaves the result standing for later; -아/어 두다 does much the same." },
      { ko: "창문을 열어 놓으세요.", en: "Leave the window open." },
      { ko: "자리를 잡아 놓았어요.", en: "I have saved us a seat." }
    ],
    "시월|noun": [
      { ko: "시월에 단풍이 예뻐요.", en: "The autumn leaves are lovely in October.", note: "십월 is wrong — the ㅂ drops, giving 시월, as 유월 does in June." },
      { ko: "시월 삼일은 개천절이에요.", en: "The third of October is National Foundation Day." },
      { ko: "시월에 여행 갈까요?", en: "Shall we travel in October?" }
    ],
    "혹은|conjunction": [
      { ko: "전화 혹은 이메일로 연락하세요.", en: "Contact us by phone or email.", note: "혹은 is the written 'or'; speech uses 아니면." },
      { ko: "토요일 혹은 일요일에 갈게요.", en: "I will go on Saturday or Sunday." },
      { ko: "한국어 혹은 영어로 쓰세요.", en: "Write it in Korean or English." }
    ],
    "박물관|noun": [
      { ko: "박물관에 가 봤어요?", en: "Have you been to the museum?" },
      { ko: "박물관은 월요일에 문을 닫아요.", en: "The museum is closed on Mondays." },
      { ko: "박물관 입장료가 얼마예요?", en: "How much is entry to the museum?" }
    ],
    "일본|proper noun": [
      { ko: "일본에 가 봤어요?", en: "Have you been to Japan?" },
      { ko: "일본어도 배우고 싶어요.", en: "I want to learn Japanese as well." },
      { ko: "일본은 한국에서 가까워요.", en: "Japan is close to Korea." }
    ],
    "지구 온난화|noun phrase": [
      { ko: "지구 온난화가 심각해요.", en: "Global warming is serious." },
      { ko: "지구 온난화 때문에 날씨가 이상해요.", en: "The weather is strange because of global warming." },
      { ko: "지구 온난화를 막아야 해요.", en: "We have to stop global warming." }
    ],
    "그럼|adverb": [
      { ko: "그럼 어떻게 해요?", en: "Then what do we do?", note: "그럼 is 그러면 shortened, and covers both 'then' and the warm 'of course'." },
      { ko: "그럼 내일 봐요.", en: "Right then, see you tomorrow." },
      { ko: "그럼 제가 할게요.", en: "In that case I will do it." }
    ],
    "팔월|noun": [
      { ko: "팔월에 휴가를 가요.", en: "I take my holiday in August." },
      { ko: "팔월이 제일 더워요.", en: "August is the hottest month." },
      { ko: "팔월 십오일은 광복절이에요.", en: "The fifteenth of August is Liberation Day." }
    ],

    // ================================================================ day 15
    "얘기하다|verb": [
      { ko: "나중에 얘기해요.", en: "Let's talk later.", note: "얘기하다 is 이야기하다 shortened, and belongs with casual speech." },
      { ko: "친구하고 얘기하고 있었어요.", en: "I was talking with a friend." },
      { ko: "무슨 얘기했어요?", en: "What did you talk about?" }
    ],
    "가방|noun": [
      { ko: "가방이 무거워요.", en: "The bag is heavy.", note: "무겁다 is ㅂ-irregular: 무거워요." },
      { ko: "가방 안에 뭐가 있어요?", en: "What is in the bag?" },
      { ko: "이 가방 얼마예요?", en: "How much is this bag?" }
    ],
    "그릇|noun": [
      { ko: "밥 한 그릇 더 주세요.", en: "One more bowl of rice, please.", note: "그릇 is both the bowl and the counter for bowlfuls." },
      { ko: "그릇을 씻었어요.", en: "I washed the dishes." },
      { ko: "그릇이 깨졌어요.", en: "The bowl broke." }
    ],
    "아 두다|expression": [
      { ko: "미리 예약해 두었어요.", en: "I have booked it in advance.", note: "-아/어 두다 does something now and leaves it ready for later; -아/어 놓다 is its close twin." },
      { ko: "여기에 적어 두세요.", en: "Write it down here for later." },
      { ko: "음식을 냉장고에 넣어 두었어요.", en: "I have put the food in the fridge." }
    ],
    "저기|pronoun": [
      { ko: "저기에 있어요.", en: "It is over there.", note: "여기 here, 거기 there near you, 저기 over there away from us both." },
      { ko: "저기요!", en: "Excuse me!", note: "How you call a waiter or a stranger over." },
      { ko: "저기까지 걸어갈까요?", en: "Shall we walk over there?" }
    ],
    "개|noun": [
      { ko: "개를 키워요.", en: "I keep a dog.", note: "키우다 is to raise or keep an animal." },
      { ko: "개가 짖어요.", en: "The dog is barking." },
      { ko: "저 개는 참 순해요.", en: "That dog is very gentle." }
    ],
    "씩|particle": [
      { ko: "하나씩 가져가세요.", en: "Take one each." },
      { ko: "조금씩 먹어요.", en: "I eat a little at a time." },
      { ko: "매일 삼십 분씩 걸어요.", en: "I walk thirty minutes a day.", note: "씩 marks an amount repeated per unit." }
    ],
    "천|determiner": [
      { ko: "천 원짜리 있어요?", en: "Do you have a thousand-won note?", note: "-짜리 marks what something is worth." },
      { ko: "천 명이 모였어요.", en: "A thousand people gathered." },
      { ko: "천 원만 빌려주세요.", en: "Lend me just a thousand won." }
    ],
    "잃다|verb": [
      { ko: "지갑을 잃어버렸어요.", en: "I have lost my wallet.", note: "잃어버리다 written together is losing something for good." },
      { ko: "길을 잃었어요.", en: "I am lost." },
      { ko: "자신감을 잃지 마세요.", en: "Do not lose your confidence." }
    ],
    "라디오|noun": [
      { ko: "라디오를 들어요.", en: "I listen to the radio." },
      { ko: "라디오에서 들었어요.", en: "I heard it on the radio." },
      { ko: "라디오 좀 켜 주세요.", en: "Please turn the radio on." }
    ],
    "맛있다|adjective": [
      { ko: "정말 맛있어요.", en: "It is really delicious.", note: "맛 + 있다, written as one word. Its opposite 맛없다 is one word too." },
      { ko: "맛있는 식당을 알아요.", en: "I know a good restaurant." },
      { ko: "맛있게 드세요.", en: "Enjoy your meal." }
    ],
    "바람|dependent noun": [
      { ko: "늦잠을 자는 바람에 지각했어요.", en: "I overslept, so I was late.", note: "-는 바람에 gives an unwanted result, and always in the past." },
      { ko: "비가 오는 바람에 취소됐어요.", en: "It was cancelled because it rained." },
      { ko: "버스를 놓치는 바람에 걸어왔어요.", en: "I missed the bus, so I walked." }
    ],
    "가다|auxiliary verb": [
      { ko: "일이 끝나 가요.", en: "The work is nearly done.", note: "-아/어 가다 carries an action forward from now; its mirror -아/어 오다 tracks it up to now." },
      { ko: "점점 좋아져 가요.", en: "It is gradually getting better." },
      { ko: "이제 다 되어 가요.", en: "It is almost ready now." }
    ],
    "번|counter": [
      { ko: "한 번 더 해 보세요.", en: "Try once more.", note: "한 번 spaced counts times; 한번 together is 'give it a go'." },
      { ko: "몇 번 가 봤어요.", en: "I have been a few times." },
      { ko: "두 번 다시 안 해요.", en: "I will never do it again." }
    ],
    "아이고|interjection": [
      { ko: "아이고, 깜짝이야!", en: "Oh dear, what a fright!", note: "아이고 covers surprise, sympathy, tiredness and mild complaint alike." },
      { ko: "아이고, 힘들어요.", en: "Oh, I am worn out." },
      { ko: "아이고, 어떡해요?", en: "Oh no, what do we do?" }
    ],
    "방학|noun": [
      { ko: "방학에 뭐 할 거예요?", en: "What will you do in the holidays?", note: "방학 is a school holiday; a worker's leave is 휴가." },
      { ko: "여름 방학이 시작됐어요.", en: "The summer holidays have started." },
      { ko: "방학 동안 한국에 갔어요.", en: "I went to Korea during the holidays." }
    ],
    "팔|numeral": [
      { ko: "팔월에 휴가를 가요.", en: "I take my holiday in August.", note: "Sino-Korean 팔 names months and dates; native 여덟 counts objects." },
      { ko: "팔 층에 있어요.", en: "It is on the eighth floor." },
      { ko: "팔 번 버스를 타세요.", en: "Take the number eight bus." }
    ],
    "마음대로 하세요|phrase": [
      { ko: "마음대로 하세요.", en: "Do as you like.", casual: "마음대로 해.", note: "Said flatly it can sound cold — a warmer version is 편한 대로 하세요." },
      { ko: "여기에서는 마음대로 하세요.", en: "Here, please make yourself at home." },
      { ko: "마음대로 하세요. 저는 상관없어요.", en: "Do as you wish. It is all the same to me." }
    ],
    "남쪽|noun": [
      { ko: "부산은 남쪽에 있어요.", en: "Busan is in the south.", note: "동쪽, 서쪽, 남쪽, 북쪽 — the four directions, all with 쪽." },
      { ko: "남쪽으로 가세요.", en: "Head south." },
      { ko: "남쪽이 더 따뜻해요.", en: "The south is warmer." }
    ],
    "아 가다|expression": [
      { ko: "이제 다 끝나 가요.", en: "It is almost finished now.", note: "-아/어 가다 moves the action forward, away from now." },
      { ko: "날씨가 따뜻해져 가요.", en: "The weather is turning warmer." },
      { ko: "조금씩 배워 가고 있어요.", en: "I am learning bit by bit as I go." }
    ],
    "색깔|noun": [
      { ko: "무슨 색깔을 좋아해요?", en: "What colour do you like?", note: "색깔 and 색 are interchangeable; 색깔 is a touch more spoken." },
      { ko: "색깔이 예뻐요.", en: "The colour is lovely." },
      { ko: "다른 색깔도 있어요?", en: "Do you have other colours?" }
    ],
    "사랑하다|verb": [
      { ko: "사랑해요.", en: "I love you.", casual: "사랑해." },
      { ko: "가족을 사랑해요.", en: "I love my family.", note: "Who you love takes 을/를." },
      { ko: "저를 사랑하세요?", en: "Do you love me?" }
    ],
    "요리|noun": [
      { ko: "요리를 잘해요.", en: "You are a good cook." },
      { ko: "한국 요리를 배우고 싶어요.", en: "I want to learn Korean cooking." },
      { ko: "이 요리 이름이 뭐예요?", en: "What is this dish called?" }
    ],
    "갑자기|adverb": [
      { ko: "갑자기 비가 왔어요.", en: "It suddenly started raining." },
      { ko: "왜 갑자기 그래요?", en: "Why the sudden change?" },
      { ko: "갑자기 생각났어요.", en: "It suddenly came to me." }
    ],
    "외국인|noun": [
      { ko: "저는 외국인이에요.", en: "I am a foreigner.", note: "외국인 is the single word; 외국 사람 is what people say." },
      { ko: "외국인 등록증이 있어요?", en: "Do you have a residence card?" },
      { ko: "외국인도 신청할 수 있어요.", en: "Foreigners may apply too." }
    ],
    "부인|noun": [
      { ko: "부인께서도 오세요.", en: "Do bring your wife as well.", note: "부인 is someone else's wife; your own is 아내." },
      { ko: "사장님 부인이세요.", en: "She is the director's wife." },
      { ko: "부인은 어떻게 지내세요?", en: "How is your wife keeping?" }
    ],
    "공부하다|verb": [
      { ko: "한국어를 공부해요.", en: "I study Korean.", note: "공부하다 is one verb, so 공부를 해요 and 공부해요 are both right." },
      { ko: "어디에서 공부해요?", en: "Where do you study?" },
      { ko: "시험 때문에 공부하고 있어요.", en: "I am studying for an exam." }
    ],
    "맑다|adjective": [
      { ko: "날씨가 맑아요.", en: "The weather is clear.", note: "Pronounced 막따. 흐리다 is its opposite, cloudy." },
      { ko: "물이 아주 맑아요.", en: "The water is very clear." },
      { ko: "내일은 맑겠습니다.", en: "Tomorrow will be clear.", note: "-겠- is the weather forecast's future." }
    ],
    "숙제|noun": [
      { ko: "숙제를 했어요?", en: "Have you done the homework?" },
      { ko: "숙제가 너무 많아요.", en: "There is far too much homework." },
      { ko: "숙제를 내일까지 내세요.", en: "Hand the homework in by tomorrow." }
    ],
    "아 오다|expression": [
      { ko: "십 년 동안 이 일을 해 왔어요.", en: "I have been doing this work for ten years.", note: "-아/어 오다 tracks an action up to the present." },
      { ko: "지금까지 잘 견뎌 왔어요.", en: "You have held up well until now." },
      { ko: "오랫동안 지켜봐 왔어요.", en: "I have been watching for a long time." }
    ],
    "째|particle": [
      { ko: "세 번째예요.", en: "It is the third time.", note: "째 attaches to a number to make an ordinal: 첫째, 두 번째, 세 번째." },
      { ko: "이틀째 비가 와요.", en: "It has been raining for two days straight." },
      { ko: "몇 번째 줄이에요?", en: "Which row is it?" }
    ],
    "우산|noun": [
      { ko: "우산 가져왔어요?", en: "Did you bring an umbrella?" },
      { ko: "우산 좀 빌려주세요.", en: "Could you lend me an umbrella?" },
      { ko: "우산을 잃어버렸어요.", en: "I have lost my umbrella." }
    ],
    "지난달|noun": [
      { ko: "지난달에 한국에 갔어요.", en: "I went to Korea last month.", note: "지난주 last week, 지난달 last month, 작년 last year." },
      { ko: "지난달부터 배우고 있어요.", en: "I have been learning since last month." },
      { ko: "지난달보다 바빠요.", en: "I am busier than last month." }
    ],
    "권|dependent noun": [
      { ko: "책 두 권을 샀어요.", en: "I bought two books.", note: "권 counts books and takes native numbers: 한 권, 두 권." },
      { ko: "이 책 몇 권 있어요?", en: "How many copies of this book do you have?" },
      { ko: "한 달에 한 권씩 읽어요.", en: "I read one book a month." }
    ],
    "닦다|verb": [
      { ko: "이를 닦았어요?", en: "Have you brushed your teeth?", note: "이를 닦다 is the fixed pairing for brushing teeth." },
      { ko: "책상을 닦아 주세요.", en: "Please wipe the desk." },
      { ko: "신발을 닦았어요.", en: "I polished my shoes." }
    ],
    "반면에|conjunction": [
      { ko: "도시는 편리해요. 반면에 복잡해요.", en: "The city is convenient. On the other hand it is crowded.", note: "As a conjunction it opens the second sentence; after a verb it is -는 반면에." },
      { ko: "값이 싸요. 반면에 품질이 나빠요.", en: "It is cheap. On the other hand the quality is poor." },
      { ko: "형은 조용해요. 반면에 동생은 활발해요.", en: "The older brother is quiet. The younger one, by contrast, is lively." }
    ],
    "책상|noun": [
      { ko: "책상 위에 놓으세요.", en: "Put it on the desk." },
      { ko: "책상을 정리했어요.", en: "I tidied my desk." },
      { ko: "새 책상을 샀어요.", en: "I bought a new desk." }
    ],
    "여섯|numeral": [
      { ko: "여섯 시에 만나요.", en: "Let's meet at six.", note: "Hours are native numbers: 여섯 시. Minutes are Sino-Korean: 육 분." },
      { ko: "여섯 개 주세요.", en: "Six, please." },
      { ko: "여섯 명이 왔어요.", en: "Six people came." }
    ],
    "이쪽|pronoun": [
      { ko: "이쪽으로 오세요.", en: "Come this way." },
      { ko: "이쪽이 제 자리예요.", en: "This side is my seat." },
      { ko: "이쪽은 제 친구예요.", en: "This is my friend.", note: "이쪽 also introduces a person politely, without pointing." }
    ],
    "침대|noun": [
      { ko: "침대에 누웠어요.", en: "I lay down on the bed.", note: "눕다 is ㅂ-irregular: 누워요." },
      { ko: "침대가 편해요.", en: "The bed is comfortable." },
      { ko: "침대 밑을 보세요.", en: "Look under the bed." }
    ],
    "춤을 추다|expression": [
      { ko: "같이 춤을 출까요?", en: "Shall we dance?", note: "춤 always takes 추다 — never 하다." },
      { ko: "춤을 잘 추네요!", en: "You dance well!" },
      { ko: "무대에서 춤을 췄어요.", en: "They danced on the stage." }
    ],
    "어서 오세요|phrase": [
      { ko: "어서 오세요.", en: "Welcome.", casual: "어서 와.", note: "What every shop and home says as you walk in." },
      { ko: "어서 오세요, 몇 분이세요?", en: "Welcome, how many in your party?" },
      { ko: "어서 오세요, 기다리고 있었어요.", en: "Come in, I have been expecting you." }
    ],
    "영국|proper noun": [
      { ko: "영국에서 왔어요.", en: "I am from Britain." },
      { ko: "영국 날씨는 흐려요.", en: "British weather is cloudy." },
      { ko: "영국에 가 본 적이 있어요?", en: "Have you ever been to Britain?" }
    ],
    "재활용 쓰레기|noun phrase": [
      { ko: "재활용 쓰레기를 분리해요.", en: "We separate the recycling.", note: "분리수거 is the word for Korea's household sorting system." },
      { ko: "재활용 쓰레기는 여기에 버리세요.", en: "Put recyclable waste here." },
      { ko: "재활용 쓰레기가 많아요.", en: "There is a lot of recycling." }
    ],
    "시계|noun": [
      { ko: "시계가 멈췄어요.", en: "The clock has stopped." },
      { ko: "시계 좀 봐 주세요.", en: "Check the time for me, would you?" },
      { ko: "손목시계를 샀어요.", en: "I bought a wristwatch." }
    ],
    "만|determiner": [
      { ko: "만 원만 주세요.", en: "Ten thousand won, please." },
      { ko: "만 명이 넘게 왔어요.", en: "Over ten thousand people came." },
      { ko: "만 원짜리 있어요?", en: "Do you have a ten thousand won note?" }
    ],
    "오늘|adverb": [
      { ko: "오늘 만날까요?", en: "Shall we meet today?" },
      { ko: "오늘 기분이 좋아요.", en: "I am in a good mood today." },
      { ko: "오늘 안에 끝내야 해요.", en: "It has to be finished within the day." }
    ],
    "있다|verb": [
      { ko: "오늘은 집에 있어요.", en: "I am staying home today.", note: "The 'stay, remain' sense conjugates as an action verb, so 있으세요 and 있자 are possible." },
      { ko: "여기 잠깐 있어 주세요.", en: "Please stay here a moment." },
      { ko: "가만히 있으세요.", en: "Stay still." }
    ],
    "잎|noun": [
      { ko: "나뭇잎이 떨어져요.", en: "The leaves are falling.", note: "나뭇잎 takes a 사이시옷 between the two nouns." },
      { ko: "가을에는 잎이 빨개져요.", en: "In autumn the leaves turn red." },
      { ko: "잎이 넓은 나무예요.", en: "It is a broad-leaved tree." }
    ],
    "뜨겁다|adjective": [
      { ko: "커피가 뜨거워요.", en: "The coffee is hot.", note: "뜨겁다 is hot to the touch; 덥다 is hot weather. Both are ㅂ-irregular." },
      { ko: "조심하세요, 아주 뜨거워요.", en: "Careful, it is very hot." },
      { ko: "뜨거운 물 좀 주세요.", en: "Some hot water, please." }
    ],

    // ================================================================ day 16
    "스포츠|noun": [
      { ko: "무슨 스포츠를 좋아해요?", en: "What sports do you like?" },
      { ko: "스포츠 경기를 자주 봐요.", en: "I often watch sports matches." },
      { ko: "스포츠센터에 다녀요.", en: "I go to a sports centre." }
    ],
    "회|counter": [
      { ko: "일주일에 세 회 열려요.", en: "It is held three times a week.", note: "회 counts rounds and sessions with Sino-Korean numbers; 번 is the everyday spoken counter." },
      { ko: "제 십 회 대회예요.", en: "It is the tenth competition." },
      { ko: "이 회부터 재미있어요.", en: "It gets interesting from this episode." }
    ],
    "아휴|interjection": [
      { ko: "아휴, 힘들어요.", en: "Ugh, I am exhausted.", note: "The sigh of tiredness or mild exasperation." },
      { ko: "아휴, 또 비가 오네요.", en: "Oh, it is raining again." },
      { ko: "아휴, 어떡하죠?", en: "Oh dear, what shall we do?" }
    ],
    "교회|noun": [
      { ko: "일요일에 교회에 가요.", en: "I go to church on Sunday." },
      { ko: "집 근처에 교회가 있어요.", en: "There is a church near my house." },
      { ko: "교회에서 친구를 만났어요.", en: "I met a friend at church." }
    ],
    "에다가|particle": [
      { ko: "여기에다가 놓으세요.", en: "Put it right here.", note: "에다가 is 에 with more emphasis on the spot; in speech it shortens to 에다." },
      { ko: "커피에다가 설탕을 넣었어요.", en: "I put sugar into the coffee." },
      { ko: "비가 오는 데다가 바람도 불어요.", en: "It is raining, and on top of that it is windy.", note: "-는 데다가 adds one thing on top of another." }
    ],
    "경험을 쌓다|expression": [
      { ko: "경험을 쌓고 싶어요.", en: "I want to build up experience.", note: "경험 pairs with 쌓다 — experience is 'piled up' in Korean." },
      { ko: "아르바이트로 경험을 쌓았어요.", en: "I gained experience through part-time work." },
      { ko: "경험을 쌓으면 쉬워져요.", en: "It gets easier as you build experience." }
    ],
    "화|noun": [
      { ko: "화가 났어요.", en: "I am angry.", note: "화가 나다 — anger 'arises', so it takes 이/가." },
      { ko: "화내지 마세요.", en: "Do not get angry.", note: "화내다 is to show your anger." },
      { ko: "화를 참았어요.", en: "I held my temper." }
    ],
    "내려오다|verb": [
      { ko: "산에서 내려왔어요.", en: "We came down from the mountain.", note: "내려오다 comes down toward the speaker; 내려가다 goes down away from them." },
      { ko: "잠깐 내려오세요.", en: "Come down for a moment." },
      { ko: "일 층으로 내려오세요.", en: "Come down to the ground floor." }
    ],
    "일월|noun": [
      { ko: "일월에 눈이 많이 와요.", en: "It snows a lot in January." },
      { ko: "일월 일일은 새해예요.", en: "The first of January is New Year." },
      { ko: "일월이 제일 추워요.", en: "January is the coldest month." }
    ],
    "도서관|noun": [
      { ko: "도서관에서 공부해요.", en: "I study at the library." },
      { ko: "도서관에서 책을 빌렸어요.", en: "I borrowed a book from the library." },
      { ko: "도서관은 몇 시까지 해요?", en: "How late is the library open?" }
    ],
    "주|dependent noun": [
      { ko: "이 주 동안 여행했어요.", en: "I travelled for two weeks.", note: "주 takes Sino-Korean numbers: 일 주, 이 주. 주일 works the same way." },
      { ko: "다음 주에 만나요.", en: "Let's meet next week." },
      { ko: "한 주에 세 번 운동해요.", en: "I exercise three times a week." }
    ],
    "선물|noun": [
      { ko: "선물을 받았어요.", en: "I received a present." },
      { ko: "생일 선물로 뭐가 좋을까요?", en: "What would make a good birthday present?" },
      { ko: "작은 선물을 준비했어요.", en: "I have a small gift for you." }
    ],
    "안다|verb": [
      { ko: "아기를 안고 있어요.", en: "She is holding the baby.", note: "Pronounced 안따. Do not confuse it with 알다, to know." },
      { ko: "가방을 안고 앉았어요.", en: "I sat holding my bag in my arms." },
      { ko: "한번 안아 주세요.", en: "Give me a hug." }
    ],
    "가볍다|adjective": [
      { ko: "가방이 가벼워요.", en: "The bag is light.", note: "가볍다 is ㅂ-irregular: 가벼워요. Its opposite is 무겁다." },
      { ko: "가볍게 운동했어요.", en: "I did some light exercise." },
      { ko: "더 가벼운 거 있어요?", en: "Do you have a lighter one?" }
    ],
    "육|numeral": [
      { ko: "육월이 아니라 유월이에요.", en: "It is 유월, not 육월.", note: "The ㄱ drops in the month name: 유월." },
      { ko: "육 층에 있어요.", en: "It is on the sixth floor." },
      { ko: "육 개월 걸려요.", en: "It takes six months." }
    ],
    "아주머니|noun": [
      { ko: "아주머니, 여기요!", en: "Excuse me! (to a middle-aged woman)", note: "The female counterpart of 아저씨. In restaurants 이모님 is warmer." },
      { ko: "옆집 아주머니세요.", en: "She is the lady from next door." },
      { ko: "아주머니께서 도와주셨어요.", en: "The lady helped me." }
    ],
    "책임을 지다|expression": [
      { ko: "제가 책임을 지겠습니다.", en: "I will take responsibility.", note: "책임 pairs with 지다 — responsibility is 'carried' in Korean." },
      { ko: "누가 책임을 져요?", en: "Who takes responsibility?" },
      { ko: "책임을 질 수 없어요.", en: "I cannot be held responsible." }
    ],
    "위험|noun": [
      { ko: "위험해요!", en: "It is dangerous!", note: "위험하다 is the adjective, and this is what you shout." },
      { ko: "위험한 일은 하지 마세요.", en: "Do not do anything dangerous." },
      { ko: "위험이 있을 수 있어요.", en: "There may be a risk." }
    ],
    "또 오세요|phrase": [
      { ko: "또 오세요.", en: "Come again.", casual: "또 와.", note: "What every shop says as you leave." },
      { ko: "안녕히 가세요. 또 오세요.", en: "Goodbye. Please come again." },
      { ko: "다음에 또 오세요.", en: "Do come again next time." }
    ],
    "빨리|adverb": [
      { ko: "빨리 오세요.", en: "Come quickly.", note: "빨리 is the adverb of 빠르다." },
      { ko: "빨리 끝내고 싶어요.", en: "I want to get it over with quickly." },
      { ko: "빨리빨리 하세요.", en: "Hurry up.", note: "빨리빨리 doubled is the classic Korean urging." }
    ],
    "지하|noun": [
      { ko: "지하 일 층에 있어요.", en: "It is on the first basement floor.", note: "Basement floors are counted 지하 일 층, 지하 이 층." },
      { ko: "지하로 내려가세요.", en: "Go down to the basement." },
      { ko: "지하에 주차장이 있어요.", en: "There is a car park underground." }
    ],
    "잊다|verb": [
      { ko: "잊어버렸어요.", en: "I forgot.", note: "잊어버리다 written together is forgetting for good." },
      { ko: "잊지 마세요.", en: "Do not forget." },
      { ko: "그날을 잊을 수 없어요.", en: "I cannot forget that day." }
    ],
    "저쪽|pronoun": [
      { ko: "저쪽으로 가세요.", en: "Go that way." },
      { ko: "화장실은 저쪽이에요.", en: "The toilet is over that way." },
      { ko: "저쪽에 앉을까요?", en: "Shall we sit over there?" }
    ],
    "지하철|noun": [
      { ko: "지하철을 타고 가요.", en: "I go by subway.", note: "What you ride takes 을/를." },
      { ko: "지하철역이 어디예요?", en: "Where is the subway station?" },
      { ko: "지하철이 버스보다 빨라요.", en: "The subway is faster than the bus." }
    ],
    "으로서|particle": [
      { ko: "학생으로서 열심히 공부해야 해요.", en: "As a student, I have to study hard.", note: "으로서 is the role someone holds; 으로써 is the means used." },
      { ko: "친구로서 말하는 거예요.", en: "I am saying this as a friend." },
      { ko: "선생님으로서 책임이 있어요.", en: "As a teacher, I have a responsibility." }
    ],
    "사무실|noun": [
      { ko: "사무실이 몇 층이에요?", en: "Which floor is the office on?" },
      { ko: "사무실에서 일해요.", en: "I work in an office." },
      { ko: "사무실에 잠깐 들를게요.", en: "I will drop by the office." }
    ],
    "스무|determiner": [
      { ko: "스무 살이에요.", en: "I am twenty.", note: "스물 shortens to 스무 in front of a counter." },
      { ko: "스무 개 주세요.", en: "Twenty, please." },
      { ko: "스무 명쯤 왔어요.", en: "About twenty people came." }
    ],
    "관심을 갖다|expression": [
      { ko: "한국 문화에 관심을 갖게 됐어요.", en: "I have come to take an interest in Korean culture.", note: "What you are interested in takes 에. 관심이 있다 is the everyday form." },
      { ko: "관심을 가져 주셔서 감사합니다.", en: "Thank you for your interest." },
      { ko: "환경 문제에 관심을 가져야 해요.", en: "We should take an interest in environmental issues." }
    ],
    "이월|noun": [
      { ko: "이월은 짧아요.", en: "February is short." },
      { ko: "이월에 한국에 가요.", en: "I go to Korea in February." },
      { ko: "이월 말에 만나요.", en: "Let's meet at the end of February." }
    ],
    "그리하여|conjunction": [
      { ko: "전쟁이 끝났다. 그리하여 평화가 왔다.", en: "The war ended, and thus peace came.", note: "Formal written Korean, at home in history books and reports." },
      { ko: "열심히 공부했다. 그리하여 시험에 합격했다.", en: "They studied hard, and thus passed the exam." },
      { ko: "그리하여 오늘에 이르렀습니다.", en: "And so we have arrived at today." }
    ],
    "씻다|verb": [
      { ko: "손을 씻으세요.", en: "Wash your hands." },
      { ko: "과일을 씻어서 드세요.", en: "Wash the fruit before eating it." },
      { ko: "얼굴을 씻고 잤어요.", en: "I washed my face and went to bed." }
    ],
    "일요일|noun": [
      { ko: "일요일에 뭐 해요?", en: "What do you do on Sundays?", note: "Days of the week take 에: 월요일에, 일요일에." },
      { ko: "일요일에는 쉬어요.", en: "I rest on Sundays." },
      { ko: "다음 일요일에 만나요.", en: "Let's meet next Sunday." }
    ],
    "건강하다|adjective": [
      { ko: "건강하세요.", en: "Stay well.", note: "A common closing wish to someone older." },
      { ko: "건강한 음식을 드세요.", en: "Eat healthy food." },
      { ko: "요즘 건강해졌어요.", en: "I have got healthier lately." }
    ],
    "강|noun": [
      { ko: "강이 넓어요.", en: "The river is wide." },
      { ko: "강에서 낚시했어요.", en: "We fished in the river." },
      { ko: "강을 따라 걸었어요.", en: "We walked along the river.", note: "-을 따라 is 'along'." }
    ],
    "월|dependent noun": [
      { ko: "몇 월이에요?", en: "What month is it?", note: "월 takes Sino-Korean numbers, with 유월 and 시월 the two irregulars." },
      { ko: "삼 월에 학교가 시작해요.", en: "School starts in March." },
      { ko: "십이 월은 바빠요.", en: "December is busy." }
    ],
    "놓다|auxiliary verb": [
      { ko: "창문을 열어 놓았어요.", en: "I have left the window open.", note: "-아/어 놓다 leaves the result standing for later." },
      { ko: "미리 사 놓으세요.", en: "Buy it in advance and keep it ready." },
      { ko: "자리를 잡아 놓을게요.", en: "I will save us a seat." }
    ],
    "프랑스|proper noun": [
      { ko: "프랑스에 가 봤어요?", en: "Have you been to France?" },
      { ko: "프랑스 음식을 좋아해요.", en: "I like French food." },
      { ko: "프랑스어를 조금 할 수 있어요.", en: "I can speak a little French." }
    ],
    "개인 정보|noun phrase": [
      { ko: "개인 정보를 보호해야 해요.", en: "Personal information has to be protected." },
      { ko: "개인 정보를 입력하세요.", en: "Please enter your personal details." },
      { ko: "개인 정보가 유출됐어요.", en: "Personal data has been leaked." }
    ],
    "왼쪽|noun": [
      { ko: "왼쪽으로 가세요.", en: "Go to the left.", note: "왼쪽 left, 오른쪽 right." },
      { ko: "왼쪽에 있어요.", en: "It is on the left." },
      { ko: "왼쪽 두 번째 방이에요.", en: "It is the second room on the left." }
    ],
    "부|counter": [
      { ko: "복사 두 부 해 주세요.", en: "Two copies, please.", note: "부 counts copies of documents and newspapers, with Sino-Korean numbers." },
      { ko: "이력서 한 부를 냈어요.", en: "I submitted one copy of my CV." },
      { ko: "몇 부 필요하세요?", en: "How many copies do you need?" }
    ],
    "에이|interjection": [
      { ko: "에이, 설마요.", en: "Come on, surely not.", note: "A casual noise of disbelief or mild protest." },
      { ko: "에이, 농담이죠?", en: "Oh come on, you are joking?" },
      { ko: "에이, 그럴 리가 없어요.", en: "Come off it, that cannot be." }
    ],
    "택시|noun": [
      { ko: "택시를 탈까요?", en: "Shall we take a taxi?" },
      { ko: "택시를 불러 주세요.", en: "Please call me a taxi." },
      { ko: "택시로 십 분 걸려요.", en: "It is ten minutes by taxi." }
    ],
    "쉬다|verb": [
      { ko: "푹 쉬세요.", en: "Get plenty of rest." },
      { ko: "잠깐 쉴까요?", en: "Shall we take a break?" },
      { ko: "주말에는 집에서 쉬어요.", en: "I rest at home at the weekend." }
    ],
    "시간을 보내다|expression": [
      { ko: "가족과 시간을 보내요.", en: "I spend time with my family.", note: "시간 pairs with 보내다 — time is 'sent' in Korean." },
      { ko: "즐거운 시간 보내세요.", en: "Have a good time." },
      { ko: "어떻게 시간을 보냈어요?", en: "How did you spend the time?" }
    ],
    "일곱|numeral": [
      { ko: "일곱 시에 일어나요.", en: "I get up at seven.", note: "Hours are native numbers: 일곱 시. Minutes are Sino-Korean: 칠 분." },
      { ko: "일곱 개 남았어요.", en: "There are seven left." },
      { ko: "일곱 명이 왔어요.", en: "Seven people came." }
    ],
    "참|adverb": [
      { ko: "참 좋네요.", en: "That really is nice.", note: "참 is a warm, slightly old-fashioned 'really'." },
      { ko: "참, 그 얘기 들었어요?", en: "Oh, by the way — did you hear about that?", note: "참 at the front of a sentence is the 'oh, that reminds me' of Korean." },
      { ko: "참 어려운 문제예요.", en: "It really is a difficult problem." }
    ],
    "잡지|noun": [
      { ko: "잡지를 읽어요.", en: "I read magazines." },
      { ko: "이번 호 잡지 있어요?", en: "Do you have this month's issue?" },
      { ko: "잡지에 실렸어요.", en: "It was in a magazine." }
    ],
    "댁|noun": [
      { ko: "댁이 어디세요?", en: "Where do you live?", note: "댁 is the honorific 집, used about someone senior." },
      { ko: "선생님 댁에 갔어요.", en: "I went to the teacher's house." },
      { ko: "댁에 계세요?", en: "Are you at home?" }
    ],
    "조심히 가세요|phrase": [
      { ko: "조심히 가세요.", en: "Get home safely.", casual: "조심히 가.", note: "Said to whoever is leaving, especially at night or in bad weather." },
      { ko: "눈이 오니까 조심히 가세요.", en: "It is snowing, so travel safely." },
      { ko: "안녕히 가세요. 조심히 가세요.", en: "Goodbye. Do take care on the way." }
    ],
    "으로써|particle": [
      { ko: "대화로써 문제를 해결했어요.", en: "We solved the problem by talking.", note: "으로써 is the means used; 으로서 is the role held." },
      { ko: "노력으로써 성공했어요.", en: "They succeeded through effort." },
      { ko: "이로써 회의를 마치겠습니다.", en: "With that, I will close the meeting." }
    ],

    // ================================================================ day 17
    "비디오|noun": [
      { ko: "비디오를 봤어요.", en: "I watched a video." },
      { ko: "비디오를 찍어도 돼요?", en: "May I film this?" },
      { ko: "비디오로 남겨 두었어요.", en: "I kept it on video." }
    ],
    "싸우다|verb": [
      { ko: "친구하고 싸웠어요.", en: "I had a fight with my friend.", note: "Who you fight with takes 하고 or 와/과." },
      { ko: "싸우지 마세요.", en: "Do not fight." },
      { ko: "왜 싸웠어요?", en: "What did you fall out over?" }
    ],
    "따뜻하다|adjective": [
      { ko: "날씨가 따뜻해요.", en: "The weather is warm.", note: "따뜻하다 is pleasantly warm; 덥다 is uncomfortably hot." },
      { ko: "따뜻한 물 주세요.", en: "Some warm water, please." },
      { ko: "마음이 따뜻한 사람이에요.", en: "They are a warm-hearted person." }
    ],
    "연습|noun": [
      { ko: "매일 연습해요.", en: "I practise every day.", note: "연습하다 is one verb: 발음을 연습해요." },
      { ko: "연습이 필요해요.", en: "It needs practice." },
      { ko: "발음 연습을 하고 있어요.", en: "I am practising pronunciation." }
    ],
    "돈을 벌다|expression": [
      { ko: "돈을 벌어야 해요.", en: "I need to earn money.", note: "돈 pairs with 벌다 — money is 'earned', never 만들다." },
      { ko: "아르바이트로 돈을 벌어요.", en: "I earn money doing part-time work." },
      { ko: "돈을 많이 벌고 싶어요.", en: "I want to earn a lot." }
    ],
    "오른쪽|noun": [
      { ko: "오른쪽으로 가세요.", en: "Go to the right." },
      { ko: "오른쪽에 있어요.", en: "It is on the right." },
      { ko: "오른쪽 첫 번째 방이에요.", en: "It is the first room on the right." }
    ],
    "그분|pronoun": [
      { ko: "그분이 누구세요?", en: "Who is that gentleman?", note: "그분 is the honorific 그 사람, for someone senior or a stranger." },
      { ko: "그분께 여쭤보세요.", en: "Please ask that person." },
      { ko: "그분은 제 선생님이세요.", en: "That is my teacher." }
    ],
    "지도|noun": [
      { ko: "지도를 보여 주세요.", en: "Please show me the map." },
      { ko: "지도에 표시해 주세요.", en: "Please mark it on the map." },
      { ko: "지도를 보고 찾았어요.", en: "I found it using the map." }
    ],
    "내려가다|verb": [
      { ko: "일 층으로 내려가세요.", en: "Go down to the ground floor.", note: "내려가다 goes down away from the speaker; 내려오다 comes down toward them." },
      { ko: "산에서 내려갔어요.", en: "We went down from the mountain." },
      { ko: "가격이 내려갔어요.", en: "The price has come down." }
    ],
    "화장실|noun": [
      { ko: "화장실이 어디예요?", en: "Where is the toilet?" },
      { ko: "화장실 좀 써도 돼요?", en: "May I use the toilet?" },
      { ko: "화장실이 이 층에 있어요.", en: "The toilet is on the second floor." }
    ],
    "때|dependent noun": [
      { ko: "밥 먹을 때 이야기하지 마세요.", en: "Do not talk while eating.", note: "때 always follows a modifier: 먹을 때, 어릴 때." },
      { ko: "어렸을 때 사진이에요.", en: "It is a photo from my childhood." },
      { ko: "그럴 때가 있어요.", en: "There are times like that." }
    ],
    "주말|noun": [
      { ko: "주말에 뭐 해요?", en: "What are you doing at the weekend?" },
      { ko: "즐거운 주말 보내세요.", en: "Have a good weekend." },
      { ko: "주말마다 등산해요.", en: "I hike every weekend." }
    ],
    "첫째|determiner": [
      { ko: "첫째 아이가 학교에 가요.", en: "My first child goes to school." },
      { ko: "첫째 줄에 앉으세요.", en: "Please sit in the first row." },
      { ko: "첫째 주에 만나요.", en: "Let's meet in the first week." }
    ],
    "내년|noun": [
      { ko: "내년에 한국에 갈 거예요.", en: "I am going to Korea next year.", note: "작년, 올해, 내년 — last year, this year, next year." },
      { ko: "내년 계획이 뭐예요?", en: "What are your plans for next year?" },
      { ko: "내년 봄에 졸업해요.", en: "I graduate next spring." }
    ],
    "꿈을 꾸다|expression": [
      { ko: "어젯밤에 이상한 꿈을 꿨어요.", en: "I had a strange dream last night.", note: "꿈 pairs with 꾸다 — dreams are 'dreamt' with their own verb." },
      { ko: "좋은 꿈 꾸세요.", en: "Sweet dreams." },
      { ko: "같은 꿈을 또 꿨어요.", en: "I had the same dream again." }
    ],
    "열심히|adverb": [
      { ko: "열심히 공부해요.", en: "I study hard." },
      { ko: "열심히 하겠습니다.", en: "I will do my best.", note: "The standard line on starting a new job or course." },
      { ko: "열심히 해서 성공했어요.", en: "They worked hard and succeeded." }
    ],
    "삼십|numeral": [
      { ko: "삼십 분 걸려요.", en: "It takes thirty minutes.", note: "Minutes take Sino-Korean numbers; ages take native 서른." },
      { ko: "삼십 명이 왔어요.", en: "Thirty people came." },
      { ko: "삼십 퍼센트 할인해요.", en: "It is thirty percent off." }
    ],
    "가져오다|verb": [
      { ko: "우산 가져왔어요?", en: "Did you bring an umbrella?", note: "가지고 오다 contracted. For a person it is 데려오다." },
      { ko: "내일 가져올게요.", en: "I will bring it tomorrow." },
      { ko: "이거 좀 가져와 주세요.", en: "Could you bring this over?" }
    ],
    "대학생|noun": [
      { ko: "저는 대학생이에요.", en: "I am a university student." },
      { ko: "대학생 할인 돼요?", en: "Is there a student discount?" },
      { ko: "대학생 때 한국에 갔어요.", en: "I went to Korea as a student." }
    ],
    "밝다|adjective": [
      { ko: "방이 밝아요.", en: "The room is bright.", note: "Pronounced 박따. Its opposite is 어둡다." },
      { ko: "성격이 밝아요.", en: "They have a cheerful nature." },
      { ko: "날이 밝았어요.", en: "Day has broken." }
    ],
    "께서|particle": [
      { ko: "선생님께서 오셨어요.", en: "The teacher has come.", note: "께서 is the honorific 이/가, and brings -시- onto the verb with it." },
      { ko: "부모님께서 한국에 사세요.", en: "My parents live in Korea." },
      { ko: "할머니께서 말씀하셨어요.", en: "My grandmother said so." }
    ],
    "생일|noun": [
      { ko: "생일 축하합니다!", en: "Happy birthday!" },
      { ko: "생일이 언제예요?", en: "When is your birthday?" },
      { ko: "생일 선물을 받았어요.", en: "I got a birthday present." }
    ],
    "그러다가|conjunction": [
      { ko: "놀았어요. 그러다가 시험을 못 봤어요.", en: "I kept playing, and in the end the exam went badly.", note: "그러다가 marks a drift from one state into another, usually unwanted." },
      { ko: "계속 미뤘어요. 그러다가 늦었어요.", en: "I kept putting it off, and then it was too late." },
      { ko: "그러다가 다쳐요.", en: "Carry on like that and you will get hurt." }
    ],
    "잠시만요|phrase": [
      { ko: "잠시만요.", en: "Just a moment.", casual: "잠깐만.", note: "Also how you ask someone to let you past. On the phone it is the standard hold." },
      { ko: "잠시만요, 확인해 볼게요.", en: "One moment, let me check." },
      { ko: "잠시만 기다려 주세요.", en: "Please wait just a moment." }
    ],
    "백화점|noun": [
      { ko: "백화점에 가요.", en: "I am going to the department store." },
      { ko: "백화점이 시장보다 비싸요.", en: "The department store is dearer than the market." },
      { ko: "백화점 지하에 식당이 있어요.", en: "There are restaurants in the department store basement." }
    ],
    "고양이|noun": [
      { ko: "고양이를 키워요.", en: "I keep a cat." },
      { ko: "고양이가 귀여워요.", en: "The cat is cute." },
      { ko: "고양이 두 마리가 있어요.", en: "There are two cats.", note: "마리 counts animals." }
    ],
    "대답하다|verb": [
      { ko: "질문에 대답해 주세요.", en: "Please answer the question.", note: "What you answer takes 에: 질문에 대답하다." },
      { ko: "아무도 대답하지 않았어요.", en: "Nobody answered." },
      { ko: "빨리 대답하세요.", en: "Answer quickly." }
    ],
    "사진을 찍다|expression": [
      { ko: "사진 좀 찍어 주세요.", en: "Could you take a photo for me?", note: "사진 pairs with 찍다 — photos are 'stamped' in Korean." },
      { ko: "여기에서 사진을 찍어도 돼요?", en: "May I take photos here?" },
      { ko: "같이 사진 찍을까요?", en: "Shall we have a photo together?" }
    ],
    "편|counter": [
      { ko: "영화 한 편을 봤어요.", en: "I watched a film.", note: "편 counts films, plays and poems, with native numbers." },
      { ko: "시 두 편을 외웠어요.", en: "I memorised two poems." },
      { ko: "이 드라마는 몇 편이에요?", en: "How many episodes does this drama have?" }
    ],
    "저기요|interjection": [
      { ko: "저기요, 여기 주문할게요.", en: "Excuse me, we would like to order.", note: "How you call a waiter or a stranger. 야 is friends only." },
      { ko: "저기요, 이거 떨어뜨리셨어요.", en: "Excuse me, you dropped this." },
      { ko: "저기요, 길 좀 여쭤볼게요.", en: "Excuse me, may I ask for directions?" }
    ],
    "중학교|noun": [
      { ko: "중학교에 다녀요.", en: "I go to middle school.", note: "초등학교, 중학교, 고등학교 — primary, middle, high." },
      { ko: "중학교 때 친구예요.", en: "We were friends in middle school." },
      { ko: "중학교를 졸업했어요.", en: "I finished middle school." }
    ],
    "흰색|noun": [
      { ko: "흰색이 좋아요.", en: "I like white.", note: "흰색 and 하얀색 are both used; 하얗다 is the adjective." },
      { ko: "흰색 셔츠를 샀어요.", en: "I bought a white shirt." },
      { ko: "흰색은 없어요?", en: "Do you have it in white?" }
    ],
    "독일|proper noun": [
      { ko: "독일에서 왔어요.", en: "I am from Germany." },
      { ko: "독일어를 배우고 있어요.", en: "I am learning German." },
      { ko: "독일에 가 본 적이 있어요.", en: "I have been to Germany." }
    ],
    "생활 습관|noun phrase": [
      { ko: "생활 습관을 바꿔야 해요.", en: "I need to change my habits." },
      { ko: "좋은 생활 습관이 중요해요.", en: "Good daily habits matter." },
      { ko: "생활 습관 때문에 건강이 나빠졌어요.", en: "My health suffered because of my lifestyle." }
    ],
    "가수|noun": [
      { ko: "좋아하는 가수가 누구예요?", en: "Who is your favourite singer?" },
      { ko: "저 가수 노래를 잘해요.", en: "That singer sings well." },
      { ko: "가수가 되고 싶어요.", en: "I want to be a singer." }
    ],
    "벗다|verb": [
      { ko: "신발을 벗으세요.", en: "Please take your shoes off.", note: "벗다 undoes 입다, 신다 and 쓰다 alike — one verb for taking anything off." },
      { ko: "집에서는 신발을 벗어요.", en: "We take our shoes off indoors." },
      { ko: "코트를 벗어서 걸었어요.", en: "I took my coat off and hung it up." }
    ],
    "복잡하다|adjective": [
      { ko: "지하철이 복잡해요.", en: "The subway is crowded." },
      { ko: "이야기가 좀 복잡해요.", en: "The story is a bit complicated." },
      { ko: "주말에는 복잡하니까 평일에 가요.", en: "It is crowded at weekends, so let's go on a weekday." }
    ],
    "뿐|dependent noun": [
      { ko: "이것뿐이에요.", en: "This is all there is.", note: "뿐 attaches to a noun; after a verb it is -(으)ㄹ 뿐." },
      { ko: "말뿐이에요.", en: "It is all talk." },
      { ko: "저뿐만 아니라 다른 사람도 그래요.", en: "Not only me — others feel the same." }
    ],
    "약|noun": [
      { ko: "약을 먹었어요?", en: "Have you taken your medicine?", note: "Medicine is eaten in Korean, never taken." },
      { ko: "약국에서 약을 샀어요.", en: "I bought medicine at the pharmacy." },
      { ko: "이 약을 하루에 세 번 드세요.", en: "Take this medicine three times a day." }
    ],
    "그쪽|pronoun": [
      { ko: "그쪽으로 가세요.", en: "Go that way." },
      { ko: "그쪽은 어떠세요?", en: "How about you?", note: "그쪽 also stands in for 'you' when you do not know a name — polite but a little distant." },
      { ko: "그쪽에 앉으세요.", en: "Please sit over there." }
    ],
    "창문|noun": [
      { ko: "창문을 열어도 돼요?", en: "May I open the window?" },
      { ko: "창문을 닫아 주세요.", en: "Please close the window." },
      { ko: "창문 옆에 앉고 싶어요.", en: "I would like to sit by the window." }
    ],
    "약속을 지키다|expression": [
      { ko: "약속을 꼭 지키세요.", en: "Be sure to keep your promise.", note: "약속 pairs with 지키다 — promises are 'guarded' in Korean." },
      { ko: "약속을 못 지켜서 미안해요.", en: "Sorry I could not keep our appointment." },
      { ko: "그 사람은 약속을 잘 지켜요.", en: "They are good at keeping their word." }
    ],
    "자주|adverb": [
      { ko: "자주 만나요.", en: "We meet often." },
      { ko: "얼마나 자주 가요?", en: "How often do you go?" },
      { ko: "자주 오는 곳이에요.", en: "It is a place I come to often." }
    ],
    "우유|noun": [
      { ko: "우유 한 잔 주세요.", en: "A glass of milk, please." },
      { ko: "우유가 다 떨어졌어요.", en: "We are out of milk." },
      { ko: "우유를 냉장고에 넣어 두세요.", en: "Put the milk in the fridge." }
    ],
    "이라고|particle": [
      { ko: "마이클이라고 해요.", en: "My name is Michael.", note: "이라고 after a consonant, 라고 after a vowel. -(이)라고 하다 is 'to be called'." },
      { ko: "뭐라고 했어요?", en: "What did you say?" },
      { ko: "이것을 한국어로 뭐라고 해요?", en: "What is this called in Korean?" }
    ],
    "오십|numeral": [
      { ko: "오십 퍼센트 할인이에요.", en: "It is fifty percent off." },
      { ko: "오십 분 걸려요.", en: "It takes fifty minutes." },
      { ko: "오십 명쯤 왔어요.", en: "About fifty people came." }
    ],
    "준비하다|verb": [
      { ko: "시험을 준비하고 있어요.", en: "I am preparing for an exam." },
      { ko: "저녁을 준비할게요.", en: "I will get dinner ready." },
      { ko: "뭘 준비해야 해요?", en: "What do I need to prepare?" }
    ],
    "표|noun": [
      { ko: "표 두 장 주세요.", en: "Two tickets, please.", note: "장 counts flat things, tickets among them." },
      { ko: "표가 다 팔렸어요.", en: "The tickets are sold out." },
      { ko: "표를 미리 예매했어요.", en: "I booked the tickets in advance." }
    ],
    "셋째|determiner": [
      { ko: "셋째 아이가 태어났어요.", en: "Their third child was born." },
      { ko: "셋째 주에 만나요.", en: "Let's meet in the third week." },
      { ko: "셋째 줄에 앉았어요.", en: "I sat in the third row." }
    ],
    "십일월|noun": [
      { ko: "십일월에 날씨가 추워져요.", en: "It gets cold in November." },
      { ko: "십일월 십일일이에요.", en: "It is the eleventh of November." },
      { ko: "십일월 말에 만나요.", en: "Let's meet at the end of November." }
    ],
    "잠깐만요|phrase": [
      { ko: "잠깐만요.", en: "Hold on a second.", casual: "잠깐만.", note: "잠시만요 is the slightly more polished twin." },
      { ko: "잠깐만요, 지나갈게요.", en: "Excuse me, let me through." },
      { ko: "잠깐만 기다려 주세요.", en: "Please wait a second." }
    ],

    // ================================================================ day 18
    "거울|noun": [
      { ko: "거울을 봐요.", en: "I am looking in the mirror." },
      { ko: "거울이 깨졌어요.", en: "The mirror is broken." },
      { ko: "거울 앞에서 옷을 입어 봤어요.", en: "I tried the clothes on in front of the mirror." }
    ],
    "노력을 기울이다|expression": [
      { ko: "많은 노력을 기울였어요.", en: "We put a great deal of effort in.", note: "노력 pairs with 기울이다 in formal Korean; 노력하다 is the everyday verb." },
      { ko: "환경을 지키려고 노력을 기울이고 있어요.", en: "Efforts are being made to protect the environment." },
      { ko: "노력을 기울인 만큼 결과가 좋아요.", en: "The results match the effort put in." }
    ],
    "돕다|verb": [
      { ko: "도와주세요!", en: "Please help me!", note: "돕다 is ㅂ-irregular: 돕 + 아 gives 도와." },
      { ko: "제가 도와드릴게요.", en: "Let me help you.", note: "도와드리다 is the humble form, for helping someone senior." },
      { ko: "서로 도우면서 살아요.", en: "We get by helping each other." }
    ],
    "빵|noun": [
      { ko: "아침에 빵을 먹어요.", en: "I eat bread for breakfast." },
      { ko: "빵집에서 빵을 샀어요.", en: "I bought bread at the bakery." },
      { ko: "이 빵 정말 맛있어요.", en: "This bread is really good." }
    ],
    "똑같다|adjective": [
      { ko: "둘이 똑같아요.", en: "The two are identical.", note: "똑같다 is 'exactly the same'; 같다 alone is just 'the same'." },
      { ko: "저하고 똑같은 가방이에요.", en: "It is the same bag as mine." },
      { ko: "똑같이 나눠요.", en: "Let's split it evenly." }
    ],
    "부엌|noun": [
      { ko: "부엌에서 요리해요.", en: "I cook in the kitchen.", note: "Pronounced 부억. 주방 is the word used for a professional kitchen." },
      { ko: "부엌이 깨끗해요.", en: "The kitchen is clean." },
      { ko: "부엌에 가서 물 좀 가져오세요.", en: "Go to the kitchen and bring some water." }
    ],
    "북쪽|noun": [
      { ko: "서울은 남쪽이 아니라 북쪽에 있어요.", en: "Seoul is in the north, not the south." },
      { ko: "북쪽으로 가세요.", en: "Head north." },
      { ko: "북쪽이 더 추워요.", en: "The north is colder." }
    ],
    "대로|dependent noun": [
      { ko: "마음대로 하세요.", en: "Do as you like.", note: "Noun + 대로 is 'in accordance with'; after a verb, -는 대로 is 'as soon as'." },
      { ko: "생각한 대로 됐어요.", en: "It turned out as I thought." },
      { ko: "규칙대로 하세요.", en: "Do it by the rules." }
    ],
    "말다|auxiliary verb": [
      { ko: "걱정하지 마세요.", en: "Do not worry.", note: "-지 말다 is the negative command, and 말다 is ㄹ-irregular: 마세요, 마." },
      { ko: "거기에 가지 마세요.", en: "Do not go there." },
      { ko: "잊지 말고 가져오세요.", en: "Do not forget to bring it." }
    ],
    "쇠고기|noun": [
      { ko: "쇠고기 한 근 주세요.", en: "Six hundred grams of beef, please.", note: "쇠고기 and 소고기 are both standard; 소고기 is more common now." },
      { ko: "쇠고기가 비싸요.", en: "Beef is expensive." },
      { ko: "쇠고기로 국을 끓였어요.", en: "I made soup with beef." }
    ],
    "결혼하다|verb": [
      { ko: "언제 결혼했어요?", en: "When did you get married?" },
      { ko: "친구와 결혼했어요.", en: "I married a friend.", note: "The spouse takes 와/과 or 하고 — never 을/를." },
      { ko: "내년에 결혼할 거예요.", en: "I am getting married next year." }
    ],
    "벌써|adverb": [
      { ko: "벌써 끝났어요?", en: "Is it over already?", note: "벌써 is sooner than expected; 이미 is a flat 'already'." },
      { ko: "벌써 열 시예요.", en: "It is ten o'clock already." },
      { ko: "벌써 다 먹었어요.", en: "I have eaten it all already." }
    ],
    "그뿐만 아니라|conjunction": [
      { ko: "값이 싸요. 그뿐만 아니라 품질도 좋아요.", en: "It is cheap. Not only that, the quality is good too.", note: "The second half nearly always carries 도." },
      { ko: "한국어를 해요. 그뿐만 아니라 중국어도 해요.", en: "They speak Korean. On top of that, Chinese too." },
      { ko: "친절해요. 그뿐만 아니라 성실해요.", en: "They are kind, and hard-working besides." }
    ],
    "스트레스를 받다|expression": [
      { ko: "요즘 스트레스를 많이 받아요.", en: "I am under a lot of stress lately.", note: "Stress is 'received' in Korean: 스트레스를 받다." },
      { ko: "일 때문에 스트레스를 받아요.", en: "Work is stressing me out." },
      { ko: "스트레스를 받지 마세요.", en: "Try not to get stressed." }
    ],
    "주|noun": [
      { ko: "다음 주에 만나요.", en: "Let's meet next week." },
      { ko: "이번 주는 바빠요.", en: "I am busy this week." },
      { ko: "지난주에 한국에 갔어요.", en: "I went to Korea last week.", note: "지난주 is written as one word." }
    ],
    "요|particle": [
      { ko: "저는요, 한국 사람이에요.", en: "Me? I am Korean.", note: "요 makes any fragment polite, and can be tacked onto almost anything: 저는요, 그런데요." },
      { ko: "왜요?", en: "Why?", note: "The bare 왜 is casual; adding 요 makes it polite." },
      { ko: "밥요? 아직 안 먹었어요.", en: "Food? I have not eaten yet." }
    ],
    "곡|counter": [
      { ko: "노래 한 곡 불러 주세요.", en: "Please sing us a song.", note: "곡 counts songs and pieces of music." },
      { ko: "이 앨범에 열 곡이 있어요.", en: "There are ten tracks on this album." },
      { ko: "한 곡 더 들을까요?", en: "Shall we listen to one more?" }
    ],
    "여보|interjection": [
      { ko: "여보, 어디 있어요?", en: "Darling, where are you?", note: "여보 is only used between husband and wife." },
      { ko: "여보, 밥 먹어요.", en: "Dear, dinner is ready." },
      { ko: "여보, 이것 좀 봐요.", en: "Darling, take a look at this." }
    ],
    "카드|noun": [
      { ko: "카드로 계산할게요.", en: "I will pay by card." },
      { ko: "카드 되나요?", en: "Do you take cards?" },
      { ko: "생일 카드를 썼어요.", en: "I wrote a birthday card." }
    ],
    "칠십|numeral": [
      { ko: "칠십 퍼센트가 찬성했어요.", en: "Seventy percent were in favour." },
      { ko: "칠십 명이 넘었어요.", en: "There were over seventy people." },
      { ko: "칠십 분 걸렸어요.", en: "It took seventy minutes." }
    ],
    "단어|noun": [
      { ko: "이 단어가 무슨 뜻이에요?", en: "What does this word mean?" },
      { ko: "단어를 외웠어요.", en: "I memorised the words.", note: "외우다 is to learn by heart." },
      { ko: "매일 단어 열 개를 공부해요.", en: "I study ten words a day." }
    ],
    "계시다|verb": [
      { ko: "선생님 계세요?", en: "Is the teacher in?", note: "계시다 is the honorific 있다, used about someone senior — never about yourself." },
      { ko: "안녕히 계세요.", en: "Goodbye. (to the person staying)" },
      { ko: "할머니께서 집에 계세요.", en: "Grandmother is at home." }
    ],
    "거|pronoun": [
      { ko: "이거 뭐예요?", en: "What is this?", note: "거 is 것 in speech, and turns up in 이거, 그거, 저거, 제 거." },
      { ko: "제 거예요.", en: "It is mine.", casual: "내 거야." },
      { ko: "맛있는 거 먹고 싶어요.", en: "I want to eat something tasty." }
    ],
    "깨끗하다|adjective": [
      { ko: "방이 깨끗해요.", en: "The room is clean.", note: "Its opposite is 더럽다, and 깨끗이 is the adverb." },
      { ko: "손을 깨끗이 씻으세요.", en: "Wash your hands thoroughly." },
      { ko: "깨끗한 옷으로 갈아입었어요.", en: "I changed into clean clothes." }
    ],
    "신발|noun": [
      { ko: "신발을 벗으세요.", en: "Please take your shoes off.", note: "Shoes take 신다 to put on and 벗다 to take off." },
      { ko: "신발 한 켤레를 샀어요.", en: "I bought a pair of shoes." },
      { ko: "신발이 편해요.", en: "The shoes are comfortable." }
    ],
    "김치|noun": [
      { ko: "김치를 좋아해요?", en: "Do you like kimchi?" },
      { ko: "김치를 담가요.", en: "We make kimchi.", note: "김치 pairs with 담그다 — kimchi is not 만들다 but 담그다." },
      { ko: "김치가 좀 매워요.", en: "The kimchi is a bit spicy." }
    ],
    "감기에 걸리다|expression": [
      { ko: "감기에 걸렸어요.", en: "I have caught a cold.", note: "A fixed pairing: 감기 takes 에 걸리다." },
      { ko: "감기에 걸리지 않게 조심하세요.", en: "Take care not to catch a cold." },
      { ko: "감기에 걸려서 못 갔어요.", en: "I could not go because I had a cold." }
    ],
    "이쪽으로 오세요|phrase": [
      { ko: "이쪽으로 오세요.", en: "Please come this way.", casual: "이쪽으로 와.", note: "What staff say while showing you to a table or a room." },
      { ko: "이쪽으로 오세요, 자리가 있어요.", en: "Come this way, there is a seat." },
      { ko: "손님, 이쪽으로 오세요.", en: "This way, please, sir." }
    ],
    "호주|proper noun": [
      { ko: "호주에서 왔어요.", en: "I am from Australia." },
      { ko: "호주는 계절이 반대예요.", en: "The seasons are the other way round in Australia." },
      { ko: "호주에 가 보고 싶어요.", en: "I would like to visit Australia." }
    ],
    "식사 예절|noun phrase": [
      { ko: "한국 식사 예절을 배웠어요.", en: "I learned Korean table manners." },
      { ko: "식사 예절이 중요해요.", en: "Table manners matter." },
      { ko: "어른보다 먼저 먹는 것은 식사 예절에 어긋나요.", en: "Eating before your elders goes against table manners." }
    ],
    "설탕|noun": [
      { ko: "설탕 넣으세요?", en: "Do you take sugar?" },
      { ko: "설탕을 조금만 넣으세요.", en: "Just a little sugar, please." },
      { ko: "설탕이 다 떨어졌어요.", en: "We have run out of sugar." }
    ],
    "찍다|verb": [
      { ko: "사진 좀 찍어 주세요.", en: "Could you take a photo?" },
      { ko: "도장을 찍으세요.", en: "Please stamp it here.", note: "도장 is a personal seal, still used on Korean paperwork." },
      { ko: "여기에서 찍어도 돼요?", en: "May I take a photo here?" }
    ],
    "어제|noun": [
      { ko: "어제 뭐 했어요?", en: "What did you do yesterday?", note: "어제, 오늘 and 내일 take no 에." },
      { ko: "어제부터 아팠어요.", en: "I have been ill since yesterday." },
      { ko: "어제보다 따뜻해요.", en: "It is warmer than yesterday." }
    ],
    "넷째|determiner": [
      { ko: "넷째 아이가 어려요.", en: "The fourth child is young." },
      { ko: "넷째 줄에 앉으세요.", en: "Please sit in the fourth row." },
      { ko: "넷째 주에 시험이 있어요.", en: "There is an exam in the fourth week." }
    ],
    "점심|noun": [
      { ko: "점심 먹었어요?", en: "Have you had lunch?", note: "점심 is both midday and the meal eaten then." },
      { ko: "같이 점심 먹을까요?", en: "Shall we have lunch together?" },
      { ko: "점심시간이 한 시간이에요.", en: "The lunch break is an hour." }
    ],
    "만큼|dependent noun": [
      { ko: "저만큼 할 수 있어요?", en: "Can you do as much as me?", note: "Noun + 만큼 is 'as much as'; after a verb it is -(으)ㄴ/는 만큼." },
      { ko: "노력한 만큼 결과가 나와요.", en: "You get out what you put in." },
      { ko: "생각만큼 어렵지 않아요.", en: "It is not as hard as you think." }
    ],
    "칼|noun": [
      { ko: "칼로 잘라 주세요.", en: "Please cut it with a knife." },
      { ko: "칼이 잘 안 들어요.", en: "The knife is blunt.", note: "칼이 들다 is what a sharp knife does." },
      { ko: "칼 조심하세요.", en: "Careful with the knife." }
    ],
    "잠시|adverb": [
      { ko: "잠시 기다려 주세요.", en: "Please wait a moment.", note: "잠시 is the formal twin of 잠깐." },
      { ko: "잠시 후에 다시 걸겠습니다.", en: "I will call again shortly." },
      { ko: "잠시 쉬었다 갈까요?", en: "Shall we rest a moment before going on?" }
    ],
    "이며|particle": [
      { ko: "책이며 옷이며 다 샀어요.", en: "I bought books, clothes, everything.", note: "이며 after a consonant, 며 after a vowel — it lists things loosely, 'and what have you'." },
      { ko: "밥이며 반찬이며 많이 차렸어요.", en: "There was rice, side dishes and more laid out." },
      { ko: "친구며 가족이며 다 왔어요.", en: "Friends, family, everyone came." }
    ],
    "피우다|verb": [
      { ko: "여기에서 담배를 피우면 안 돼요.", en: "You must not smoke here.", note: "Cigarettes are 'blown' in Korean: 담배를 피우다." },
      { ko: "꽃이 피었어요.", en: "The flowers have bloomed.", note: "The intransitive twin 피다 is what flowers do, and takes no object." },
      { ko: "담배를 안 피워요.", en: "I do not smoke." }
    ],
    "시험을 보다|expression": [
      { ko: "내일 시험을 봐요.", en: "I have an exam tomorrow.", note: "시험 pairs with 보다 — exams are 'seen' in Korean." },
      { ko: "시험 잘 보세요.", en: "Good luck in the exam." },
      { ko: "시험을 잘 봤어요.", en: "The exam went well." }
    ],
    "의자|noun": [
      { ko: "의자에 앉으세요.", en: "Please take a seat." },
      { ko: "의자가 불편해요.", en: "The chair is uncomfortable." },
      { ko: "의자 하나 더 가져오세요.", en: "Bring one more chair." }
    ],
    "미안하다|adjective": [
      { ko: "미안해요.", en: "Sorry.", casual: "미안해.", note: "Lighter than 죄송하다, and used with people you know." },
      { ko: "늦어서 미안해요.", en: "Sorry I am late." },
      { ko: "미안하지만 못 갈 것 같아요.", en: "Sorry, but I do not think I can make it.", note: "미안하지만 softens a refusal." }
    ],
    "카메라|noun": [
      { ko: "카메라를 가져왔어요.", en: "I brought a camera." },
      { ko: "카메라로 찍어 주세요.", en: "Please take it with the camera." },
      { ko: "새 카메라를 샀어요.", en: "I bought a new camera." }
    ],
    "예순|numeral": [
      { ko: "아버지가 예순이세요.", en: "My father is sixty.", note: "Ages take native numbers: 쉰, 예순, 일흔." },
      { ko: "예순 명이 왔어요.", en: "Sixty people came." },
      { ko: "예순이 넘으셨어요.", en: "They are over sixty." }
    ],
    "토요일|noun": [
      { ko: "토요일에 만날까요?", en: "Shall we meet on Saturday?" },
      { ko: "토요일에는 일 안 해요.", en: "I do not work on Saturdays." },
      { ko: "다음 토요일이 생일이에요.", en: "Next Saturday is my birthday." }
    ],
    "불다|verb": [
      { ko: "바람이 불어요.", en: "The wind is blowing.", note: "불다 is ㄹ-irregular: 붑니다." },
      { ko: "촛불을 불어서 껐어요.", en: "I blew out the candle." },
      { ko: "플루트를 불 수 있어요?", en: "Can you play the flute?", note: "Wind instruments take 불다; struck ones take 치다." }
    ],
    "경찰관|noun": [
      { ko: "경찰관에게 물어봤어요.", en: "I asked a police officer.", note: "경찰 is the force, 경찰관 the individual officer." },
      { ko: "경찰관이 되고 싶어요.", en: "I want to become a police officer." },
      { ko: "경찰관이 길을 막고 있어요.", en: "A police officer is blocking the road." }
    ],
    "극장|noun": [
      { ko: "극장에서 영화를 봤어요.", en: "I saw a film at the cinema.", note: "영화관 is the more common modern word for a cinema." },
      { ko: "극장이 어디에 있어요?", en: "Where is the theatre?" },
      { ko: "극장 앞에서 만나요.", en: "Let's meet in front of the cinema." }
    ],
    "계획을 세우다|expression": [
      { ko: "여행 계획을 세웠어요.", en: "I have made travel plans.", note: "계획 pairs with 세우다 — plans are 'stood up' in Korean." },
      { ko: "계획을 잘 세워야 해요.", en: "You need to plan properly." },
      { ko: "같이 계획을 세울까요?", en: "Shall we make a plan together?" }
    ],

    // ================================================================ day 19
    "오랜만|noun": [
      { ko: "오랜만이에요.", en: "Long time no see.", casual: "오랜만이야.", note: "오래간만 shortened. Only for someone you already know." },
      { ko: "오랜만에 친구를 만났어요.", en: "I met a friend for the first time in ages." },
      { ko: "오랜만에 한국 음식을 먹었어요.", en: "I had Korean food for the first time in a long while." }
    ],
    "여기 있어요|phrase": [
      { ko: "여기 있어요.", en: "Here you are.", casual: "여기 있어.", note: "What you say handing something over — literally 'it is here'." },
      { ko: "여기 있어요, 받으세요.", en: "Here you go, take it." },
      { ko: "잔돈 여기 있어요.", en: "Here is your change." }
    ],
    "저거|pronoun": [
      { ko: "저거 뭐예요?", en: "What is that over there?", note: "저것 in speech. 이거 near me, 그거 near you, 저거 away from us both." },
      { ko: "저거 주세요.", en: "That one over there, please." },
      { ko: "저거 얼마예요?", en: "How much is that one?" }
    ],
    "층|counter": [
      { ko: "삼 층으로 오세요.", en: "Come up to the third floor.", note: "층 takes Sino-Korean numbers: 일 층, 이 층." },
      { ko: "몇 층에서 내리세요?", en: "Which floor are you getting off at?" },
      { ko: "이 건물은 십 층이에요.", en: "This building has ten floors." }
    ],
    "자|interjection": [
      { ko: "자, 시작합시다.", en: "Right then, let's begin.", note: "자 opens an action — the Korean equivalent of 'right' or 'here we go'." },
      { ko: "자, 여기 있어요.", en: "Here you are." },
      { ko: "자, 이제 가 볼까요?", en: "Well then, shall we get going?" }
    ],
    "아줌마|noun": [
      { ko: "아줌마, 여기요!", en: "Excuse me!", note: "아줌마 is 아주머니 shortened and noticeably blunter — 이모님 is safer in a restaurant." },
      { ko: "시장 아줌마가 친절해요.", en: "The lady at the market is kind." },
      { ko: "아줌마한테 물어보세요.", en: "Ask the lady over there." }
    ],
    "다만|conjunction": [
      { ko: "좋아요. 다만 값이 비싸요.", en: "It is good. Only, the price is high.", note: "다만 adds a single reservation; 하지만 contrasts more broadly." },
      { ko: "갈게요. 다만 조금 늦을 거예요.", en: "I will come. Only I will be a little late." },
      { ko: "다만 한 가지 문제가 있어요.", en: "There is just one problem." }
    ],
    "도착하다|verb": [
      { ko: "언제 도착해요?", en: "When do you arrive?", note: "Where you arrive takes 에: 서울에 도착했어요." },
      { ko: "방금 도착했어요.", en: "I have just arrived." },
      { ko: "도착하면 전화할게요.", en: "I will call when I get there." }
    ],
    "유명하다|adjective": [
      { ko: "이 식당이 유명해요.", en: "This restaurant is famous." },
      { ko: "뭐로 유명해요?", en: "What is it known for?", note: "What it is famous for takes 로/으로." },
      { ko: "유명한 가수예요.", en: "They are a famous singer." }
    ],
    "공항|noun": [
      { ko: "공항까지 어떻게 가요?", en: "How do I get to the airport?" },
      { ko: "공항에서 만나요.", en: "Let's meet at the airport." },
      { ko: "공항에 두 시간 전에 도착하세요.", en: "Get to the airport two hours before." }
    ],
    "치고|particle": [
      { ko: "겨울치고 따뜻해요.", en: "It is warm for winter.", note: "치고 sets something against what you would expect of its kind." },
      { ko: "초보치고 잘하네요.", en: "That is good for a beginner." },
      { ko: "한국 사람치고 매운 걸 못 먹어요.", en: "For a Korean, they cannot take spice." }
    ],
    "아마|adverb": [
      { ko: "아마 올 거예요.", en: "They will probably come.", note: "아마 usually pairs with -(으)ㄹ 거예요 or -겠-." },
      { ko: "아마 모를 거예요.", en: "They probably do not know." },
      { ko: "아마 내일쯤 도착할 거예요.", en: "It will probably arrive tomorrow." }
    ],
    "군인|noun": [
      { ko: "제 형은 군인이에요.", en: "My older brother is a soldier." },
      { ko: "군인들이 지나갔어요.", en: "The soldiers went past." },
      { ko: "군인 할인이 있어요?", en: "Is there a military discount?" }
    ],
    "지|dependent noun": [
      { ko: "한국에 온 지 일 년 됐어요.", en: "It has been a year since I came to Korea.", note: "-(으)ㄴ 지 … 되다 counts the time since something happened." },
      { ko: "배운 지 얼마나 됐어요?", en: "How long have you been learning?" },
      { ko: "만난 지 오래됐어요.", en: "It has been a long time since we met." }
    ],
    "결정을 내리다|expression": [
      { ko: "결정을 내렸어요.", en: "I have made my decision.", note: "결정 pairs with 내리다 — decisions are 'brought down' in Korean." },
      { ko: "빨리 결정을 내려야 해요.", en: "We need to decide quickly." },
      { ko: "어려운 결정을 내렸어요.", en: "It was a hard decision to make." }
    ],
    "치마|noun": [
      { ko: "치마를 입었어요.", en: "I am wearing a skirt." },
      { ko: "이 치마 어때요?", en: "How does this skirt look?" },
      { ko: "치마가 좀 길어요.", en: "The skirt is a bit long." }
    ],
    "적다|verb": [
      { ko: "여기에 적어 주세요.", en: "Please write it down here.", note: "적다 is jotting something down; 쓰다 is the general 'to write'." },
      { ko: "이름을 적으세요.", en: "Write your name." },
      { ko: "전화번호를 적어 두었어요.", en: "I wrote the number down for later." }
    ],
    "다섯째|determiner": [
      { ko: "다섯째 줄에 앉으세요.", en: "Please sit in the fifth row." },
      { ko: "다섯째 주에 시험이 있어요.", en: "There is an exam in the fifth week." },
      { ko: "다섯째 아이가 태어났어요.", en: "Their fifth child was born." }
    ],
    "호텔|noun": [
      { ko: "호텔을 예약했어요.", en: "I booked a hotel." },
      { ko: "호텔이 역에서 가까워요.", en: "The hotel is near the station." },
      { ko: "어느 호텔에 묵으세요?", en: "Which hotel are you staying at?" }
    ],
    "청소|noun": [
      { ko: "방을 청소했어요.", en: "I cleaned my room.", note: "청소하다 is one verb: 청소했어요." },
      { ko: "청소 좀 도와주세요.", en: "Help me clean up, would you?" },
      { ko: "청소가 다 끝났어요.", en: "The cleaning is all done." }
    ],
    "오|numeral": [
      { ko: "오월에 만나요.", en: "Let's meet in May.", note: "Sino-Korean 오 names months and dates; native 다섯 counts objects." },
      { ko: "오 층에 있어요.", en: "It is on the fifth floor." },
      { ko: "오 분만 기다려 주세요.", en: "Please wait just five minutes." }
    ],
    "캐나다|proper noun": [
      { ko: "캐나다에서 왔어요.", en: "I am from Canada." },
      { ko: "캐나다는 겨울이 길어요.", en: "Winters are long in Canada." },
      { ko: "캐나다에 가 본 적이 있어요?", en: "Have you ever been to Canada?" }
    ],
    "교통 체증|noun phrase": [
      { ko: "교통 체증이 심해요.", en: "The traffic jam is bad." },
      { ko: "교통 체증 때문에 늦었어요.", en: "I was late because of the traffic." },
      { ko: "이 시간에는 교통 체증이 있어요.", en: "There is congestion at this hour." }
    ],
    "구름|noun": [
      { ko: "구름이 많아요.", en: "It is cloudy." },
      { ko: "구름 사이로 해가 보여요.", en: "The sun shows through the clouds." },
      { ko: "구름 한 점 없어요.", en: "There is not a cloud in the sky." }
    ],
    "말씀하다|verb": [
      { ko: "천천히 말씀해 주세요.", en: "Please speak slowly.", note: "말씀하다 is the honorific 말하다, used about someone senior." },
      { ko: "선생님께서 말씀하셨어요.", en: "The teacher said so." },
      { ko: "말씀 좀 묻겠습니다.", en: "May I ask you something?", note: "How you stop a stranger to ask directions." }
    ],
    "계절|noun": [
      { ko: "무슨 계절을 좋아해요?", en: "Which season do you like?" },
      { ko: "한국은 사계절이 뚜렷해요.", en: "Korea has four distinct seasons." },
      { ko: "계절이 바뀌었어요.", en: "The season has changed." }
    ],
    "영향을 미치다|expression": [
      { ko: "날씨가 기분에 영향을 미쳐요.", en: "The weather affects your mood.", note: "What is affected takes 에. 영향을 주다 works the same way." },
      { ko: "큰 영향을 미쳤어요.", en: "It had a big impact." },
      { ko: "환경에 나쁜 영향을 미쳐요.", en: "It has a bad effect on the environment." }
    ],
    "춥다|adjective": [
      { ko: "오늘 정말 추워요.", en: "It is really cold today.", note: "춥다 is ㅂ-irregular: 추워요. It is for weather; 차갑다 is cold to the touch." },
      { ko: "추우니까 따뜻하게 입으세요.", en: "It is cold, so dress warmly." },
      { ko: "겨울에는 아주 추워요.", en: "It gets very cold in winter." }
    ],
    "운동장|noun": [
      { ko: "운동장에서 축구를 해요.", en: "We play football on the field." },
      { ko: "운동장을 한 바퀴 돌았어요.", en: "I ran a lap of the field.", note: "바퀴 counts laps and turns." },
      { ko: "학교 운동장이 넓어요.", en: "The school field is big." }
    ],
    "얼마예요|phrase": [
      { ko: "이거 얼마예요?", en: "How much is this?", casual: "이거 얼마야?", note: "The single most useful shopping line there is." },
      { ko: "전부 얼마예요?", en: "How much altogether?" },
      { ko: "한 개에 얼마예요?", en: "How much each?" }
    ],
    "동쪽|noun": [
      { ko: "해는 동쪽에서 떠요.", en: "The sun rises in the east." },
      { ko: "동쪽으로 가세요.", en: "Head east." },
      { ko: "동쪽에 바다가 있어요.", en: "The sea is to the east." }
    ],
    "으로부터|particle": [
      { ko: "친구로부터 편지를 받았어요.", en: "I received a letter from a friend.", note: "으로부터 is the written 'from'; speech uses 에게서 or 한테서." },
      { ko: "어릴 때로부터 알고 지냈어요.", en: "We have known each other since childhood." },
      { ko: "회사로부터 연락이 왔어요.", en: "Word came from the company." }
    ],
    "소개하다|verb": [
      { ko: "제 친구를 소개할게요.", en: "Let me introduce my friend." },
      { ko: "자기소개를 해 주세요.", en: "Please introduce yourself." },
      { ko: "좋은 식당 좀 소개해 주세요.", en: "Could you recommend a good restaurant?" }
    ],
    "잠깐|noun": [
      { ko: "잠깐만 기다려 주세요.", en: "Please wait just a moment.", note: "잠깐 is the casual twin of 잠시." },
      { ko: "잠깐 이야기할 수 있어요?", en: "Can we talk for a minute?" },
      { ko: "잠깐 쉬었다 갈까요?", en: "Shall we take a quick break?" }
    ],
    "조금|adverb": [
      { ko: "조금 더 주세요.", en: "A little more, please." },
      { ko: "조금 늦을 것 같아요.", en: "I think I will be a bit late." },
      { ko: "한국어를 조금 할 수 있어요.", en: "I can speak a little Korean." }
    ],
    "요즈음|noun": [
      { ko: "요즈음 어떻게 지내세요?", en: "How have you been lately?", note: "요즈음 is the full form; 요즘 is what people say." },
      { ko: "요즈음 날씨가 좋아요.", en: "The weather has been good lately." },
      { ko: "요즈음 바빠서 못 만났어요.", en: "I have been too busy to meet lately." }
    ],
    "채|dependent noun": [
      { ko: "신발을 신은 채로 들어왔어요.", en: "They came in with their shoes still on.", note: "-(으)ㄴ 채(로): one state left as it was while something else happens." },
      { ko: "불을 켠 채 잤어요.", en: "I fell asleep with the light still on." },
      { ko: "문을 열어 놓은 채 나갔어요.", en: "They went out leaving the door open." }
    ],
    "내다|auxiliary verb": [
      { ko: "끝까지 해냈어요.", en: "I saw it through to the end.", note: "-아/어 내다 is managing something difficult through to completion." },
      { ko: "어려운 문제를 풀어 냈어요.", en: "They managed to solve the hard problem." },
      { ko: "포기하지 않고 이겨 냈어요.", en: "They did not give up and came through it." }
    ],
    "저것|pronoun": [
      { ko: "저것은 무엇입니까?", en: "What is that over there?", casual: "저거 뭐야?", note: "저것 is the written form; 저거 is what people say." },
      { ko: "저것도 보여 주세요.", en: "Show me that one as well." },
      { ko: "이것과 저것 중에 뭐가 좋아요?", en: "Which do you prefer, this or that?" }
    ],
    "도움이 되다|expression": [
      { ko: "도움이 됐어요?", en: "Was that helpful?", note: "Who it helps takes 에게/한테: 저에게 도움이 됐어요." },
      { ko: "많이 도움이 됐어요. 감사합니다.", en: "That helped a lot. Thank you." },
      { ko: "조금이라도 도움이 되면 좋겠어요.", en: "I hope it helps, even a little." }
    ],
    "한복|noun": [
      { ko: "한복을 입어 봤어요.", en: "I tried on a hanbok." },
      { ko: "한복이 정말 예뻐요.", en: "The hanbok is beautiful." },
      { ko: "설날에 한복을 입어요.", en: "We wear hanbok at New Year." }
    ],
    "라면|noun": [
      { ko: "라면 끓여 줄까요?", en: "Shall I make you some ramyeon?", note: "라면 pairs with 끓이다 — noodles are 'boiled'." },
      { ko: "밤에 라면을 먹었어요.", en: "I had ramyeon late at night." },
      { ko: "라면이 좀 매워요.", en: "The ramyeon is a bit spicy." }
    ],
    "끝내다|verb": [
      { ko: "오늘까지 끝내야 해요.", en: "It has to be finished by today.", note: "끝내다 is finishing something; 끝나다 is what ends by itself." },
      { ko: "숙제를 다 끝냈어요.", en: "I have finished all my homework." },
      { ko: "빨리 끝내고 쉬어요.", en: "Let's finish quickly and rest." }
    ],
    "무겁다|adjective": [
      { ko: "가방이 무거워요.", en: "The bag is heavy.", note: "무겁다 is ㅂ-irregular: 무거워요. Its opposite is 가볍다." },
      { ko: "무거우면 제가 들어 드릴게요.", en: "If it is heavy, let me carry it." },
      { ko: "분위기가 무거웠어요.", en: "The mood was heavy." }
    ],
    "칸|counter": [
      { ko: "다음 칸으로 가세요.", en: "Move to the next carriage.", note: "칸 counts train carriages, and the squares and compartments of anything divided up." },
      { ko: "이 칸은 여성 전용이에요.", en: "This carriage is women only." },
      { ko: "빈 칸에 이름을 쓰세요.", en: "Write your name in the blank box." }
    ],
    "글쎄|interjection": [
      { ko: "글쎄요, 잘 모르겠어요.", en: "Well, I am not sure.", note: "글쎄 is casual; 글쎄요 is the polite form, and buys you a moment." },
      { ko: "글쎄, 생각해 볼게.", en: "Hmm, let me think about it." },
      { ko: "글쎄요, 어려울 것 같아요.", en: "Well, I think it might be difficult." }
    ],
    "바지|noun": [
      { ko: "바지를 입었어요.", en: "I am wearing trousers." },
      { ko: "이 바지가 좀 커요.", en: "These trousers are a bit big." },
      { ko: "바지를 사러 갔어요.", en: "I went to buy trousers." }
    ],
    "십|numeral": [
      { ko: "십 분 걸려요.", en: "It takes ten minutes.", note: "Sino-Korean 십 is for minutes, money and dates; native 열 counts objects." },
      { ko: "시월은 십월이 아니에요.", en: "October is 시월, not 십월.", note: "The ㅂ drops in the month name." },
      { ko: "십 층에 있어요.", en: "It is on the tenth floor." }
    ],
    "테이블|noun": [
      { ko: "테이블 위에 놓으세요.", en: "Put it on the table." },
      { ko: "네 명 테이블 있어요?", en: "Do you have a table for four?" },
      { ko: "창가 테이블로 주세요.", en: "A table by the window, please." }
    ],
    "단|conjunction": [
      { ko: "괜찮아요. 단, 조건이 있어요.", en: "That is fine. However, there is a condition.", note: "단 introduces a single proviso, and is written Korean." },
      { ko: "참가할 수 있어요. 단, 회원만 가능해요.", en: "You may take part — provided you are a member." },
      { ko: "무료예요. 단, 예약이 필요해요.", en: "It is free. However, booking is required." }
    ],

    // ================================================================ day 20
    "한국어|noun": [
      { ko: "한국어를 배우고 있어요.", en: "I am learning Korean.", note: "한국어 is the formal word for the language; 한국말 is the everyday one." },
      { ko: "한국어로 말해 주세요.", en: "Please say it in Korean." },
      { ko: "한국어가 어렵지만 재미있어요.", en: "Korean is hard but fun." }
    ],
    "마음에 들다|expression": [
      { ko: "마음에 들어요.", en: "I like it.", note: "Literally 'it enters my heart' — for something just shown or given. 들다 is ㄹ-irregular: 마음에 듭니다." },
      { ko: "이 색이 마음에 들어요.", en: "I like this colour." },
      { ko: "마음에 드는 게 없어요.", en: "There is nothing I like." }
    ],
    "각|determiner": [
      { ko: "각 나라마다 문화가 달라요.", en: "Each country has its own culture.", note: "각 sits in front of a noun and takes no particle." },
      { ko: "각 방에 화장실이 있어요.", en: "Each room has a bathroom." },
      { ko: "각 사람에게 하나씩 주세요.", en: "Give one to each person." }
    ],
    "드리다|verb": [
      { ko: "선생님께 드렸어요.", en: "I gave it to the teacher.", note: "드리다 is the humble 주다, used when the receiver is senior." },
      { ko: "뭘 도와드릴까요?", en: "How may I help you?" },
      { ko: "말씀드릴 게 있어요.", en: "There is something I would like to tell you." }
    ],
    "한자|noun": [
      { ko: "한자를 읽을 수 있어요?", en: "Can you read hanja?", note: "한자 are the Chinese characters behind much Korean vocabulary." },
      { ko: "이름을 한자로 써 주세요.", en: "Please write your name in hanja." },
      { ko: "한자를 알면 단어를 외우기 쉬워요.", en: "Knowing hanja makes words easier to memorise." }
    ],
    "이야말로|particle": [
      { ko: "이것이야말로 진짜예요.", en: "This is the real thing.", note: "이야말로 after a consonant, 야말로 after a vowel — it singles something out with emphasis." },
      { ko: "지금이야말로 기회예요.", en: "Now is precisely the moment." },
      { ko: "건강이야말로 제일 중요해요.", en: "Health above all else is what matters." }
    ],
    "시|noun": [
      { ko: "시를 읽는 것을 좋아해요.", en: "I like reading poetry." },
      { ko: "서울시에 살아요.", en: "I live in the city of Seoul.", note: "The same 시 names a city: 서울시, 부산시." },
      { ko: "시 한 편을 외웠어요.", en: "I memorised a poem." }
    ],
    "계산해 주세요|phrase": [
      { ko: "계산해 주세요.", en: "The bill, please.", casual: "계산해 줘.", note: "Said at the counter — in most Korean restaurants you pay on the way out." },
      { ko: "따로 계산해 주세요.", en: "Separate bills, please." },
      { ko: "카드로 계산해 주세요.", en: "By card, please." }
    ],
    "항상|adverb": [
      { ko: "항상 감사합니다.", en: "Thank you, always." },
      { ko: "항상 일찍 일어나요.", en: "I always get up early." },
      { ko: "항상 조심하세요.", en: "Always take care." }
    ],
    "안경|noun": [
      { ko: "안경을 써요.", en: "I wear glasses.", note: "Glasses take 쓰다, like hats." },
      { ko: "안경을 어디에 뒀어요?", en: "Where did I put my glasses?" },
      { ko: "새 안경을 맞췄어요.", en: "I had new glasses made." }
    ],
    "물어보다|verb": [
      { ko: "하나만 물어봐도 돼요?", en: "May I ask you just one thing?", note: "묻다 is ㄷ-irregular, and 물어보다 is its everyday form." },
      { ko: "길을 물어봤어요.", en: "I asked for directions." },
      { ko: "선생님께 여쭤보세요.", en: "Ask the teacher.", note: "여쭙다 is the humble version, for asking someone senior." }
    ],
    "취미|noun": [
      { ko: "취미가 뭐예요?", en: "What are your hobbies?" },
      { ko: "제 취미는 사진 찍기예요.", en: "My hobby is photography.", note: "-기 turns a verb into a noun: 찍기, 읽기." },
      { ko: "취미로 기타를 배워요.", en: "I learn guitar as a hobby." }
    ],
    "김|dependent noun": [
      { ko: "나가는 김에 우유 좀 사 오세요.", en: "While you are out, pick up some milk.", note: "-는 김에: taking the chance offered by something you are doing anyway." },
      { ko: "온 김에 차 한잔하고 가세요.", en: "Since you are here, stay for a cup of tea." },
      { ko: "말이 나온 김에 정해요.", en: "While we are on the subject, let's decide." }
    ],
    "비싸다|adjective": [
      { ko: "너무 비싸요.", en: "It is too expensive.", note: "Its opposite is 싸다, cheap — one syllable apart." },
      { ko: "비싼 옷은 안 사요.", en: "I do not buy expensive clothes." },
      { ko: "생각보다 비싸네요.", en: "It is dearer than I thought." }
    ],
    "신경을 쓰다|expression": [
      { ko: "너무 신경 쓰지 마세요.", en: "Do not let it bother you.", note: "신경을 쓰다 is letting something occupy your mind, or fussing over a detail." },
      { ko: "건강에 신경을 써야 해요.", en: "You should pay attention to your health." },
      { ko: "작은 일까지 신경을 써 주셔서 감사합니다.", en: "Thank you for taking care of even the small things." }
    ],
    "야구|noun": [
      { ko: "야구를 좋아해요.", en: "I like baseball." },
      { ko: "야구 경기를 보러 갔어요.", en: "I went to watch a baseball game." },
      { ko: "한국에서 야구가 인기가 많아요.", en: "Baseball is popular in Korea." }
    ],
    "러시아|proper noun": [
      { ko: "러시아에서 왔어요.", en: "I am from Russia." },
      { ko: "러시아는 겨울이 아주 추워요.", en: "Winters in Russia are very cold." },
      { ko: "러시아어를 배우고 싶어요.", en: "I want to learn Russian." }
    ],
    "주차 공간|noun phrase": [
      { ko: "주차 공간이 있어요?", en: "Is there parking space?" },
      { ko: "주차 공간이 부족해요.", en: "There is not enough parking." },
      { ko: "주차 공간을 찾고 있어요.", en: "I am looking for a parking space." }
    ],
    "이|noun": [
      { ko: "이가 아파요.", en: "My tooth hurts.", note: "치아 is the polite word used in dental clinics." },
      { ko: "이를 닦았어요?", en: "Have you brushed your teeth?" },
      { ko: "이가 하나 빠졌어요.", en: "One of my teeth came out." }
    ],
    "뛰다|verb": [
      { ko: "뛰지 마세요.", en: "Do not run." },
      { ko: "버스를 타려고 뛰었어요.", en: "I ran to catch the bus." },
      { ko: "가슴이 뛰어요.", en: "My heart is racing." }
    ],
    "구경|noun": [
      { ko: "구경 좀 할게요.", en: "I am just having a look.", note: "구경하다 is looking round for pleasure — a shop, a sight, a show." },
      { ko: "서울 구경을 했어요.", en: "I went sightseeing in Seoul." },
      { ko: "같이 구경 갈까요?", en: "Shall we go and have a look together?" }
    ],
    "이분|pronoun": [
      { ko: "이분이 제 선생님이세요.", en: "This is my teacher.", note: "이분 is the honorific 이 사람, used when introducing someone senior." },
      { ko: "이분께 여쭤보세요.", en: "Please ask this gentleman." },
      { ko: "이분이 누구세요?", en: "Who is this, please?" }
    ],
    "생선|noun": [
      { ko: "생선을 좋아해요?", en: "Do you like fish?", note: "생선 is fish as food; 물고기 is the living creature." },
      { ko: "생선을 구웠어요.", en: "I grilled some fish." },
      { ko: "생선보다 고기를 좋아해요.", en: "I prefer meat to fish." }
    ],
    "천|numeral": [
      { ko: "천 원이에요.", en: "It is a thousand won." },
      { ko: "천 명이 모였어요.", en: "A thousand people gathered." },
      { ko: "이천 년에 태어났어요.", en: "I was born in the year 2000." }
    ],
    "눈치를 보다|expression": [
      { ko: "눈치를 보지 마세요.", en: "Do not worry about what others think.", note: "눈치 is the read you take of a room or a person's mood — a very Korean idea." },
      { ko: "사장님 눈치를 봤어요.", en: "I was watching the boss's mood." },
      { ko: "눈치가 빨라요.", en: "They are quick to read a situation." }
    ],
    "졸업|noun": [
      { ko: "졸업 축하합니다!", en: "Congratulations on your graduation!" },
      { ko: "졸업이 언제예요?", en: "When do you graduate?" },
      { ko: "졸업 후에 취직했어요.", en: "I got a job after graduating." }
    ],
    "닭|noun": [
      { ko: "닭고기를 좋아해요.", en: "I like chicken.", note: "Pronounced 닥. 닭고기 is the meat." },
      { ko: "닭이 울어요.", en: "The cockerel is crowing." },
      { ko: "닭을 키워요.", en: "We keep chickens." }
    ],
    "이나마|particle": [
      { ko: "조금이나마 도움이 됐으면 좋겠어요.", en: "I hope it helps, even if only a little.", note: "이나마 after a consonant, 나마 after a vowel: less than you would want, but better than nothing." },
      { ko: "이것이나마 받아 주세요.", en: "Please accept this, small though it is." },
      { ko: "잠깐이나마 쉴 수 있어서 좋았어요.", en: "It was good to rest, even briefly." }
    ],
    "않다|verb": [
      { ko: "저는 담배를 피우지 않아요.", en: "I do not smoke.", note: "-지 않다 is the long negative; 안 피워요 is the short spoken one." },
      { ko: "그렇지 않아요.", en: "That is not the case." },
      { ko: "가고 싶지 않아요.", en: "I do not want to go." }
    ],
    "시원하다|adjective": [
      { ko: "바람이 시원해요.", en: "The breeze is refreshing." },
      { ko: "국물이 시원해요.", en: "The soup is refreshing.", note: "Korean calls a hot soup 시원하다 too — it means it clears you out, not that it is cold." },
      { ko: "시원한 물 좀 주세요.", en: "Some cold water, please." }
    ],
    "맥주|noun": [
      { ko: "맥주 두 병 주세요.", en: "Two bottles of beer, please." },
      { ko: "맥주 한잔할까요?", en: "Shall we have a beer?" },
      { ko: "저는 맥주보다 소주를 좋아해요.", en: "I prefer soju to beer." }
    ],
    "그러니까|adverb": [
      { ko: "그러니까 제 말이 그 말이에요.", en: "That is exactly what I am saying.", note: "As an adverb 그러니까 restates what you just said — the Korean 'I mean'." },
      { ko: "그러니까 조심하라고 했잖아요.", en: "That is why I told you to be careful." },
      { ko: "그러니까 언제 만날까요?", en: "So then, when shall we meet?" }
    ],
    "알|counter": [
      { ko: "계란 두 알 주세요.", en: "Two eggs, please.", note: "알 counts small round things: eggs, pills, beads, grapes." },
      { ko: "약 한 알을 먹었어요.", en: "I took one tablet." },
      { ko: "포도 몇 알만 먹었어요.", en: "I only ate a few grapes." }
    ],
    "참|interjection": [
      { ko: "참, 그 얘기 들었어요?", en: "Oh, by the way — did you hear about that?", note: "참 at the front of a sentence is the 'that reminds me' of Korean." },
      { ko: "참, 내일 약속 잊지 마세요.", en: "Oh, do not forget our appointment tomorrow." },
      { ko: "참 잘했어요.", en: "That really was well done." }
    ],
    "교과서|noun": [
      { ko: "교과서를 펴세요.", en: "Open your textbooks." },
      { ko: "교과서를 가져왔어요?", en: "Did you bring your textbook?" },
      { ko: "이 교과서가 어려워요.", en: "This textbook is difficult." }
    ],
    "포장해 주세요|phrase": [
      { ko: "포장해 주세요.", en: "To take away, please.", casual: "포장해 줘.", note: "Also how you ask for leftovers to be boxed up." },
      { ko: "남은 음식 포장해 주세요.", en: "Could you pack up the leftovers?" },
      { ko: "선물이니까 예쁘게 포장해 주세요.", en: "It is a gift, so please wrap it nicely." }
    ],
    "온갖|determiner": [
      { ko: "온갖 음식이 다 있어요.", en: "There is every kind of food.", note: "온갖 sits in front of a noun and takes no particle." },
      { ko: "온갖 방법을 다 써 봤어요.", en: "I tried every method there is." },
      { ko: "가게에 온갖 물건이 있어요.", en: "The shop has all sorts of things." }
    ],
    "돼지|noun": [
      { ko: "돼지고기를 좋아해요.", en: "I like pork." },
      { ko: "돼지꿈을 꿨어요.", en: "I dreamt of a pig.", note: "A pig in a dream is a sign of money coming, so people buy a lottery ticket." },
      { ko: "농장에서 돼지를 키워요.", en: "They keep pigs on the farm." }
    ],
    "셈|dependent noun": [
      { ko: "거의 끝난 셈이에요.", en: "It is as good as finished.", note: "-(으)ㄴ/는 셈이다: not literally so, but it comes to the same thing." },
      { ko: "이 정도면 싼 셈이에요.", en: "At this price it counts as cheap." },
      { ko: "한 달에 한 번 보는 셈이에요.", en: "It works out at seeing each other once a month." }
    ],
    "다녀오다|verb": [
      { ko: "잘 다녀오세요.", en: "Have a good trip.", note: "Literally 'go and come back' — Korean assumes you are returning." },
      { ko: "잠깐 은행에 다녀올게요.", en: "I am just popping to the bank." },
      { ko: "여행 잘 다녀왔어요?", en: "Did your trip go well?" }
    ],
    "정신을 차리다|expression": [
      { ko: "정신 차리세요!", en: "Pull yourself together!", note: "Said to someone flustered, half asleep, or about to make a mistake." },
      { ko: "정신을 차리고 다시 시작했어요.", en: "I got a grip and started again." },
      { ko: "정신 차리고 운전하세요.", en: "Keep your wits about you and drive." }
    ],
    "수영|noun": [
      { ko: "수영할 수 있어요?", en: "Can you swim?" },
      { ko: "여름에 수영을 배웠어요.", en: "I learned to swim in the summer." },
      { ko: "수영장에 가요.", en: "I am going to the pool." }
    ],
    "결국|conjunction": [
      { ko: "결국 못 갔어요.", en: "In the end I could not go." },
      { ko: "결국 이렇게 됐어요.", en: "This is how it turned out in the end." },
      { ko: "결국 제 말이 맞았어요.", en: "In the end I was right." }
    ],
    "기차|noun": [
      { ko: "기차를 타고 갔어요.", en: "We went by train." },
      { ko: "기차가 몇 시에 출발해요?", en: "What time does the train leave?" },
      { ko: "기차표를 예매했어요.", en: "I booked train tickets." }
    ],
    "식탁|noun": [
      { ko: "식탁에 앉으세요.", en: "Please sit at the table." },
      { ko: "식탁을 차렸어요.", en: "I set the table.", note: "상을 차리다 is the more traditional phrase." },
      { ko: "식탁 위에 놓으세요.", en: "Put it on the dining table." }
    ],
    "닫다|verb": [
      { ko: "문 좀 닫아 주세요.", en: "Please close the door.", note: "Pronounced 닫따. Its opposite is 열다." },
      { ko: "가게가 문을 닫았어요.", en: "The shop has closed." },
      { ko: "창문을 닫고 나가세요.", en: "Close the window on your way out." }
    ],
    "공원|noun": [
      { ko: "공원에서 산책해요.", en: "I take walks in the park." },
      { ko: "집 근처에 공원이 있어요.", en: "There is a park near my house." },
      { ko: "공원에서 만날까요?", en: "Shall we meet at the park?" }
    ],
    "반갑다|adjective": [
      { ko: "만나서 반가워요.", en: "Nice to meet you.", formal: "만나서 반갑습니다.", note: "반갑다 is ㅂ-irregular: 반가워요. Only on a first meeting." },
      { ko: "목소리 들으니 반가워요.", en: "It is good to hear your voice." },
      { ko: "반가운 소식이에요.", en: "That is welcome news." }
    ],
    "쉰|numeral": [
      { ko: "어머니가 쉰이세요.", en: "My mother is fifty.", note: "Ages take native numbers: 마흔, 쉰, 예순." },
      { ko: "쉰 명쯤 왔어요.", en: "About fifty people came." },
      { ko: "쉰이 넘으셨어요.", en: "They are over fifty." }
    ],
    "손을 잡다|expression": [
      { ko: "아이 손을 잡으세요.", en: "Hold the child's hand." },
      { ko: "두 회사가 손을 잡았어요.", en: "The two companies joined forces.", note: "손을 잡다 is also to team up with someone." },
      { ko: "손 잡고 걸었어요.", en: "We walked hand in hand." }
    ],

    // ================================================================ day 21
    "날짜|noun": [
      { ko: "날짜가 언제예요?", en: "What is the date?" },
      { ko: "날짜를 정했어요?", en: "Have you set a date?" },
      { ko: "날짜를 바꿀 수 있어요?", en: "Can the date be changed?" }
    ],
    "이야|particle": [
      { ko: "그 정도야 할 수 있어요.", en: "That much I can manage.", note: "이야 after a consonant, 야 after a vowel: it singles the thing out, often dismissively." },
      { ko: "말이야 쉽지요.", en: "Saying it is the easy part." },
      { ko: "돈이야 있지만 시간이 없어요.", en: "Money I have; it is time I lack." }
    ],
    "샌드위치|noun": [
      { ko: "샌드위치 하나 주세요.", en: "One sandwich, please." },
      { ko: "아침으로 샌드위치를 먹었어요.", en: "I had a sandwich for breakfast." },
      { ko: "샌드위치를 만들었어요.", en: "I made sandwiches." }
    ],
    "저곳|pronoun": [
      { ko: "저곳이 유명한 절이에요.", en: "That place over there is a famous temple.", note: "저곳 is the written 저기." },
      { ko: "저곳에서 만나기로 했어요.", en: "We agreed to meet over there." },
      { ko: "저곳은 위험하니 가지 마세요.", en: "That place is dangerous, so do not go." }
    ],
    "걸어가다|verb": [
      { ko: "걸어가도 돼요?", en: "Is it walkable?", note: "걸어가다 goes on foot away from the speaker; 걸어오다 comes on foot toward them." },
      { ko: "십 분쯤 걸어가세요.", en: "Walk for about ten minutes." },
      { ko: "역까지 걸어갔어요.", en: "I walked to the station." }
    ],
    "검은색|noun": [
      { ko: "검은색이 있어요?", en: "Do you have it in black?", note: "검은색 and 까만색 are both used; 검다 is the adjective." },
      { ko: "검은색 옷을 자주 입어요.", en: "I often wear black." },
      { ko: "검은색으로 주세요.", en: "The black one, please." }
    ],
    "언제나|adverb": [
      { ko: "언제나 여기에 있어요.", en: "I am always here.", note: "언제나 is 'always, every single time'; 항상 is its close twin." },
      { ko: "언제나 응원할게요.", en: "I will always be cheering you on." },
      { ko: "그 사람은 언제나 늦어요.", en: "They are late every time." }
    ],
    "서쪽|noun": [
      { ko: "해는 서쪽으로 져요.", en: "The sun sets in the west." },
      { ko: "서쪽으로 가세요.", en: "Head west." },
      { ko: "인천은 서울 서쪽에 있어요.", en: "Incheon is west of Seoul." }
    ],
    "경찰서|noun": [
      { ko: "경찰서가 어디에 있어요?", en: "Where is the police station?" },
      { ko: "경찰서에 신고했어요.", en: "I reported it at the police station." },
      { ko: "지갑을 잃어버려서 경찰서에 갔어요.", en: "I lost my wallet, so I went to the police station." }
    ],
    "길을 잃다|expression": [
      { ko: "길을 잃었어요.", en: "I have lost my way.", note: "Past tense, because the losing already happened." },
      { ko: "길을 잃으면 전화하세요.", en: "Call me if you get lost." },
      { ko: "숲에서 길을 잃었어요.", en: "We got lost in the woods." }
    ],
    "도와주세요|phrase": [
      { ko: "도와주세요!", en: "Please help me!", casual: "도와줘!", note: "돕다 is ㅂ-irregular: 돕 + 아 gives 도와." },
      { ko: "좀 도와주시겠어요?", en: "Could you give me a hand?", note: "-시겠어요? is the softest request form there is." },
      { ko: "누가 좀 도와주세요!", en: "Somebody help, please!" }
    ],
    "듯|dependent noun": [
      { ko: "비가 올 듯해요.", en: "It looks like rain.", note: "-(으)ㄹ 듯하다 hedges a guess, much like -(으)ㄹ 것 같다 but more bookish." },
      { ko: "아는 듯 모르는 듯 웃었어요.", en: "They smiled as if they both knew and did not." },
      { ko: "그런 듯해요.", en: "It would seem so." }
    ],
    "나가다|auxiliary verb": [
      { ko: "이 일을 계속해 나갈 거예요.", en: "I will carry on with this work.", note: "-아/어 나가다 carries an action forward, step by step." },
      { ko: "하나씩 해결해 나가요.", en: "Let's work through them one at a time." },
      { ko: "잘 이겨 나가고 있어요.", en: "They are getting through it well." }
    ],
    "인도네시아|proper noun": [
      { ko: "인도네시아에서 왔어요.", en: "I am from Indonesia." },
      { ko: "인도네시아는 일 년 내내 더워요.", en: "Indonesia is hot all year round." },
      { ko: "인도네시아 음식을 좋아해요.", en: "I like Indonesian food." }
    ],
    "근무 환경|noun phrase": [
      { ko: "근무 환경이 좋아요.", en: "The working conditions are good." },
      { ko: "근무 환경을 개선해야 해요.", en: "Working conditions need to improve." },
      { ko: "근무 환경 때문에 회사를 옮겼어요.", en: "I changed companies because of the working conditions." }
    ],
    "구두|noun": [
      { ko: "구두를 신었어요.", en: "I am wearing dress shoes.", note: "Shoes take 신다. 구두 is formal leather footwear; 운동화 is trainers." },
      { ko: "구두 한 켤레를 샀어요.", en: "I bought a pair of dress shoes." },
      { ko: "구두가 좀 불편해요.", en: "These shoes are a bit uncomfortable." }
    ],
    "출발하다|verb": [
      { ko: "몇 시에 출발해요?", en: "What time do we leave?", note: "출발하다 is departing; 도착하다 is arriving." },
      { ko: "지금 출발할게요.", en: "I am setting off now." },
      { ko: "기차가 곧 출발합니다.", en: "The train will depart shortly." }
    ],
    "안녕하다|adjective": [
      { ko: "안녕하세요.", en: "Hello.", casual: "안녕.", note: "Literally 'are you at peace' — the root of every Korean greeting." },
      { ko: "안녕히 가세요.", en: "Goodbye. (to the person leaving)" },
      { ko: "그동안 안녕하셨어요?", en: "Have you been well all this time?" }
    ],
    "사과|noun": [
      { ko: "사과 세 개 주세요.", en: "Three apples, please." },
      { ko: "사과가 정말 달아요.", en: "The apples are really sweet." },
      { ko: "사과를 깎아 주세요.", en: "Please peel the apple.", note: "깎다 is to peel fruit as well as to cut a price." }
    ],
    "여학생|noun": [
      { ko: "여학생이 몇 명이에요?", en: "How many female students are there?", note: "여학생 and 남학생 are the pair." },
      { ko: "이 반은 여학생이 많아요.", en: "This class has a lot of girls." },
      { ko: "여학생 기숙사는 저쪽이에요.", en: "The women's dormitory is over there." }
    ],
    "옛|determiner": [
      { ko: "옛 친구를 만났어요.", en: "I met an old friend.", note: "옛 goes straight in front of a noun: 옛날, 옛 친구." },
      { ko: "옛 모습 그대로예요.", en: "It is just as it used to be." },
      { ko: "옛 추억이 생각나요.", en: "It brings back old memories." }
    ],
    "자리|counter": [
      { ko: "두 자리 예약했어요.", en: "I booked two seats." },
      { ko: "세 자리 있어요?", en: "Do you have three seats?" },
      { ko: "네 자리로 주세요.", en: "A table for four, please." }
    ],
    "어라|interjection": [
      { ko: "어라, 이상하네요.", en: "Huh, that is odd.", note: "The noise you make when something is not as expected." },
      { ko: "어라, 어디 갔지?", en: "Huh? Where did it go?" },
      { ko: "어라, 벌써 다 했어요?", en: "Oh? You have finished already?" }
    ],
    "냉장고|noun": [
      { ko: "냉장고에 넣어 두세요.", en: "Put it in the fridge." },
      { ko: "냉장고가 비었어요.", en: "The fridge is empty." },
      { ko: "냉장고에서 꺼내 주세요.", en: "Take it out of the fridge, please." }
    ],
    "졸업하다|verb": [
      { ko: "대학교를 졸업했어요.", en: "I graduated from university.", note: "The school takes 을/를: 대학교를 졸업하다." },
      { ko: "언제 졸업해요?", en: "When do you graduate?" },
      { ko: "졸업하면 뭐 할 거예요?", en: "What will you do after you graduate?" }
    ],
    "이든가|particle": [
      { ko: "커피든가 차든가 주세요.", en: "Coffee or tea, either is fine.", note: "이든가 after a consonant, 든가 after a vowel — it offers alternatives loosely." },
      { ko: "가든가 말든가 마음대로 하세요.", en: "Go or do not go, as you please." },
      { ko: "언제든가 편할 때 오세요.", en: "Come whenever suits you." }
    ],
    "기회를 잡다|expression": [
      { ko: "기회를 잡으세요.", en: "Seize the opportunity.", note: "기회 pairs with 잡다 — chances are 'caught' in Korean." },
      { ko: "좋은 기회를 잡았어요.", en: "I got a good opportunity." },
      { ko: "이번 기회를 놓치지 마세요.", en: "Do not miss this chance.", note: "놓치다 is to miss or let slip." }
    ],
    "육십|numeral": [
      { ko: "육십 분은 한 시간이에요.", en: "Sixty minutes is one hour." },
      { ko: "육십 명이 왔어요.", en: "Sixty people came." },
      { ko: "육십 퍼센트가 찬성했어요.", en: "Sixty percent were in favour." }
    ],
    "감기|noun": [
      { ko: "감기에 걸렸어요.", en: "I have caught a cold.", note: "감기 always takes 에 걸리다." },
      { ko: "감기 조심하세요.", en: "Mind you do not catch a cold." },
      { ko: "감기약을 먹었어요.", en: "I took some cold medicine." }
    ],
    "결혼식|noun": [
      { ko: "결혼식이 언제예요?", en: "When is the wedding?" },
      { ko: "친구 결혼식에 갔어요.", en: "I went to a friend's wedding." },
      { ko: "결혼식에 초대해 주셔서 감사합니다.", en: "Thank you for inviting me to the wedding." }
    ],
    "아니|adverb": [
      { ko: "이것은 책이 아니라 공책이에요.", en: "This is not a book but a notebook.", note: "A가 아니라 B is 'not A but B'." },
      { ko: "아니 그게 아니고요.", en: "No, that is not what I meant." },
      { ko: "돈이 아니라 시간이 문제예요.", en: "It is not money but time that is the problem." }
    ],
    "연필|noun": [
      { ko: "연필로 쓰세요.", en: "Write it in pencil." },
      { ko: "연필 한 자루만 빌려주세요.", en: "Lend me a pencil, would you?" },
      { ko: "연필을 깎았어요.", en: "I sharpened my pencil." }
    ],
    "도와주다|verb": [
      { ko: "도와주셔서 감사합니다.", en: "Thank you for your help." },
      { ko: "제가 도와드릴까요?", en: "Shall I help you?", note: "도와드리다 is the humble form, for helping someone senior." },
      { ko: "친구를 도와줬어요.", en: "I helped my friend." }
    ],
    "대신에|conjunction": [
      { ko: "커피 대신에 차를 마셨어요.", en: "I drank tea instead of coffee.", note: "Noun + 대신에. After a verb it is -는 대신에." },
      { ko: "제가 대신에 갈게요.", en: "I will go in your place." },
      { ko: "돈 대신에 선물을 줬어요.", en: "I gave a present instead of money." }
    ],
    "운전|noun": [
      { ko: "운전할 수 있어요?", en: "Can you drive?" },
      { ko: "운전 조심하세요.", en: "Drive carefully." },
      { ko: "운전면허를 땄어요.", en: "I got my driving licence.", note: "면허를 따다 is the fixed pairing for getting a licence." }
    ],
    "위험하다|adjective": [
      { ko: "위험해요!", en: "It is dangerous!" },
      { ko: "밤에 혼자 다니면 위험해요.", en: "It is dangerous to go about alone at night." },
      { ko: "위험한 곳에는 가지 마세요.", en: "Do not go anywhere dangerous." }
    ],
    "불고기|noun": [
      { ko: "불고기를 먹어 봤어요?", en: "Have you tried bulgogi?" },
      { ko: "불고기 이 인분 주세요.", en: "Two portions of bulgogi, please." },
      { ko: "불고기는 맵지 않아요.", en: "Bulgogi is not spicy." }
    ],
    "목숨을 걸다|expression": [
      { ko: "목숨을 걸고 싸웠어요.", en: "They fought for their lives.", note: "목숨 pairs with 걸다 — a life is 'staked' in Korean, as money is on a bet." },
      { ko: "그 일에 목숨을 걸었어요.", en: "They staked everything on that work." },
      { ko: "목숨을 걸 만한 일이 아니에요.", en: "It is not worth risking your life for." }
    ],
    "제|pronoun": [
      { ko: "제 이름은 마이클이에요.", en: "My name is Michael.", casual: "내 이름은 마이클이야.", note: "제 is 저의 contracted, the humble 'my'; 내 is 나의, the casual one." },
      { ko: "제가 할게요.", en: "I will do it.", note: "제가 is the subject form — 저가 does not exist." },
      { ko: "제 생각에는 좀 비싸요.", en: "In my opinion it is a bit expensive." }
    ],
    "바|dependent noun": [
      { ko: "제가 아는 바로는 사실이에요.", en: "As far as I know, it is true.", note: "바 is a bound noun meaning 'the thing that' — formal and written." },
      { ko: "말씀하신 바를 잘 알겠습니다.", en: "I understand what you have said." },
      { ko: "느낀 바가 많아요.", en: "It gave me a lot to think about." }
    ],
    "목욕|noun": [
      { ko: "목욕했어요?", en: "Have you had a bath?" },
      { ko: "따뜻하게 목욕하고 자세요.", en: "Have a warm bath and go to bed." },
      { ko: "목욕탕에 갔어요.", en: "I went to the bathhouse.", note: "목욕탕 is the public bathhouse, still common in Korea." }
    ],
    "길을 잃었어요|phrase": [
      { ko: "길을 잃었어요.", en: "I am lost.", casual: "길 잃었어.", note: "Follow it with 좀 도와주세요." },
      { ko: "길을 잃었는데 도와주시겠어요?", en: "I am lost — could you help me?" },
      { ko: "여기가 어디예요? 길을 잃었어요.", en: "Where am I? I have lost my way." }
    ],
    "날다|verb": [
      { ko: "새가 날아요.", en: "The bird is flying.", note: "날다 is ㄹ-irregular: 납니다, 나는." },
      { ko: "비행기가 하늘을 날아요.", en: "The plane flies through the sky." },
      { ko: "종이가 바람에 날아갔어요.", en: "The paper blew away in the wind." }
    ],
    "전화번호|noun": [
      { ko: "전화번호가 뭐예요?", en: "What is your phone number?" },
      { ko: "전화번호를 적어 주세요.", en: "Please write down your number." },
      { ko: "전화번호를 바꿨어요.", en: "I have changed my number." }
    ],
    "지갑|noun": [
      { ko: "지갑을 잃어버렸어요.", en: "I have lost my wallet." },
      { ko: "지갑을 두고 왔어요.", en: "I left my wallet behind." },
      { ko: "지갑에 돈이 없어요.", en: "There is no money in my wallet." }
    ],
    "하며|particle": [
      { ko: "옷하며 신발하며 다 샀어요.", en: "Clothes, shoes, I bought the lot.", note: "하며 lists things loosely in speech, much like 이며 in writing." },
      { ko: "음식하며 분위기하며 다 좋았어요.", en: "The food, the atmosphere, everything was good." },
      { ko: "책하며 공책하며 가방에 넣었어요.", en: "Books, notebooks and all went into the bag." }
    ],
    "모자|noun": [
      { ko: "모자를 썼어요.", en: "I am wearing a hat.", note: "Hats take 쓰다, like glasses." },
      { ko: "모자 벗으세요.", en: "Please take your hat off." },
      { ko: "이 모자 어때요?", en: "How does this hat look?" }
    ],
    "자리를 잡다|expression": [
      { ko: "자리 잡았어요?", en: "Have you settled in?", note: "자리를 잡다 is both bagging a spot and settling into a new life." },
      { ko: "미리 가서 자리를 잡을게요.", en: "I will go ahead and save us a seat." },
      { ko: "한국에서 자리를 잡고 싶어요.", en: "I want to settle down in Korea." }
    ],
    "소파|noun": [
      { ko: "소파에 앉으세요.", en: "Have a seat on the sofa." },
      { ko: "소파에서 잤어요.", en: "I slept on the sofa." },
      { ko: "새 소파를 샀어요.", en: "We bought a new sofa." }
    ],
    "추다|verb": [
      { ko: "춤을 춰요.", en: "I dance.", note: "추다 only ever goes with 춤 — 춤을 추다." },
      { ko: "같이 춤출까요?", en: "Shall we dance?" },
      { ko: "춤을 잘 추네요!", en: "You dance well!" }
    ],
    "팔십|numeral": [
      { ko: "팔십 퍼센트가 넘어요.", en: "It is over eighty percent." },
      { ko: "팔십 명이 참가했어요.", en: "Eighty people took part." },
      { ko: "팔십 분 걸렸어요.", en: "It took eighty minutes." }
    ],

    // ================================================================ day 22
    "싸다|adjective": [
      { ko: "여기가 더 싸요.", en: "It is cheaper here.", note: "싸다 cheap, 비싸다 expensive — one syllable apart." },
      { ko: "싼 게 비지떡이에요.", en: "You get what you pay for.", note: "A set saying — literally 'the cheap thing is a bean-curd cake'." },
      { ko: "싸게 해 주세요.", en: "Could you do it cheaper?" }
    ],
    "역|noun": [
      { ko: "역이 어디예요?", en: "Where is the station?" },
      { ko: "서울역에서 만나요.", en: "Let's meet at Seoul Station." },
      { ko: "다음 역에서 내리세요.", en: "Get off at the next station." }
    ],
    "가끔|adverb": [
      { ko: "가끔 만나요.", en: "We meet now and then.", note: "자주 often, 가끔 sometimes, 별로 rarely." },
      { ko: "가끔 한국 음식을 먹어요.", en: "I eat Korean food occasionally." },
      { ko: "가끔 생각이 나요.", en: "I think of it from time to time." }
    ],
    "헌|determiner": [
      { ko: "헌 옷을 버렸어요.", en: "I threw out the old clothes.", note: "헌 is worn out from use; 옛 is old in time. Its opposite is 새." },
      { ko: "헌 책을 팔았어요.", en: "I sold my old books." },
      { ko: "헌 신발이 더 편해요.", en: "Worn-in shoes are more comfortable." }
    ],
    "여권|noun": [
      { ko: "여권을 보여 주세요.", en: "Please show me your passport." },
      { ko: "여권을 잃어버렸어요.", en: "I have lost my passport." },
      { ko: "여권이 내년에 만료돼요.", en: "My passport expires next year." }
    ],
    "베트남|proper noun": [
      { ko: "베트남에서 왔어요.", en: "I am from Vietnam." },
      { ko: "베트남 음식을 좋아해요.", en: "I like Vietnamese food." },
      { ko: "베트남에 가 본 적이 있어요.", en: "I have been to Vietnam." }
    ],
    "취업 준비|noun phrase": [
      { ko: "취업 준비를 하고 있어요.", en: "I am job hunting." },
      { ko: "취업 준비가 힘들어요.", en: "Preparing for the job market is hard." },
      { ko: "졸업하고 취업 준비를 시작했어요.", en: "I started job hunting after graduating." }
    ],
    "열쇠|noun": [
      { ko: "열쇠를 잃어버렸어요.", en: "I have lost my key." },
      { ko: "열쇠로 문을 열었어요.", en: "I opened the door with the key." },
      { ko: "열쇠 좀 주세요.", en: "The key, please." }
    ],
    "켜다|verb": [
      { ko: "불 좀 켜 주세요.", en: "Please turn the light on.", note: "켜다 turns on, 끄다 turns off." },
      { ko: "에어컨을 켤까요?", en: "Shall I put the air conditioning on?" },
      { ko: "텔레비전을 켰어요.", en: "I turned on the television." }
    ],
    "그릇|counter": [
      { ko: "밥 두 그릇 주세요.", en: "Two bowls of rice, please.", note: "그릇 counts bowlfuls of food, with native numbers." },
      { ko: "국 한 그릇 더 주세요.", en: "One more bowl of soup, please." },
      { ko: "몇 그릇 드릴까요?", en: "How many bowls shall I bring?" }
    ],
    "아차|interjection": [
      { ko: "아차, 잊어버렸어요!", en: "Oops, I forgot!", note: "The noise for catching your own mistake a moment too late." },
      { ko: "아차, 지갑을 두고 왔어요.", en: "Oh no, I left my wallet behind." },
      { ko: "아차 하는 순간에 놓쳤어요.", en: "I lost it in the blink of an eye." }
    ],
    "오렌지|noun": [
      { ko: "오렌지 주스 주세요.", en: "Orange juice, please." },
      { ko: "오렌지가 달아요.", en: "The oranges are sweet." },
      { ko: "오렌지를 세 개 샀어요.", en: "I bought three oranges." }
    ],
    "화를 내다|expression": [
      { ko: "화를 내지 마세요.", en: "Do not get angry.", note: "화가 나다 is feeling the anger; 화를 내다 is showing it." },
      { ko: "왜 화를 냈어요?", en: "Why did you lose your temper?" },
      { ko: "화를 내도 소용없어요.", en: "There is no use getting angry." }
    ],
    "데|dependent noun": [
      { ko: "갈 데가 없어요.", en: "I have nowhere to go.", note: "데 is a bound noun for a place or a case, and always follows a modifier." },
      { ko: "아픈 데가 있어요?", en: "Is anything hurting?" },
      { ko: "이거 어디에 쓰는 데예요?", en: "What is this used for?" }
    ],
    "다|noun": [
      { ko: "이게 다예요.", en: "This is all of it." },
      { ko: "다 같이 가요.", en: "Let's all go together." },
      { ko: "다 끝났어요.", en: "It is all finished." }
    ],
    "배가 고파요|phrase": [
      { ko: "배가 고파요.", en: "I am hungry.", casual: "배고파.", note: "Literally 'the stomach is empty'. 고프다 is ㅡ-irregular: 고파요." },
      { ko: "배가 고픈데 뭐 먹을까요?", en: "I am hungry — what shall we eat?" },
      { ko: "아침을 안 먹어서 배가 고파요.", en: "I skipped breakfast, so I am hungry." }
    ],
    "번호|noun": [
      { ko: "번호가 몇 번이에요?", en: "What is the number?" },
      { ko: "전화번호를 알려 주세요.", en: "Please give me your phone number." },
      { ko: "번호표를 뽑으세요.", en: "Take a queue ticket." }
    ],
    "깎다|verb": [
      { ko: "좀 깎아 주세요.", en: "Could you lower the price?", note: "깎다 is to shave something down — a price, hair, or the skin of a fruit." },
      { ko: "사과를 깎아 주세요.", en: "Please peel the apple." },
      { ko: "머리를 깎았어요.", en: "I got my hair cut." }
    ],
    "마는|particle": [
      { ko: "좋습니다마는 너무 비싸요.", en: "It is good, but it is too expensive.", note: "마는 attaches to a finished sentence and concedes it; 지만 attaches to the stem instead." },
      { ko: "가고 싶습니다마는 시간이 없어요.", en: "I would like to go, but there is no time." },
      { ko: "알겠습니다마는 조금 어렵네요.", en: "I understand, though it is a little difficult." }
    ],
    "수박|noun": [
      { ko: "여름에는 수박이 맛있어요.", en: "Watermelon is good in summer." },
      { ko: "수박 한 통 샀어요.", en: "I bought a whole watermelon.", note: "통 counts whole melons and buckets." },
      { ko: "수박을 잘라 주세요.", en: "Please cut the watermelon." }
    ],
    "내|pronoun": [
      { ko: "내 이름은 마이클이야.", en: "My name is Michael.", note: "내 is 나의 contracted, the casual 'my'; 제 is the humble one." },
      { ko: "내가 할게.", en: "I will do it.", note: "내가 is the subject form — 나가 does not exist in this sense." },
      { ko: "내 생각에는 좀 비싸.", en: "I think it is a bit expensive." }
    ],
    "슬프다|adjective": [
      { ko: "슬픈 영화를 봤어요.", en: "I watched a sad film.", note: "슬프다 is ㅡ-irregular: 슬퍼요." },
      { ko: "너무 슬퍼요.", en: "It is so sad." },
      { ko: "슬퍼하지 마세요.", en: "Do not be sad.", note: "슬퍼하다 is showing the sadness, as 화를 내다 is showing anger." }
    ],
    "과자|noun": [
      { ko: "과자 한 봉지 주세요.", en: "One packet of biscuits, please." },
      { ko: "아이들이 과자를 좋아해요.", en: "Children love snacks." },
      { ko: "과자를 너무 많이 먹었어요.", en: "I ate too many snacks." }
    ],
    "살을 빼다|expression": [
      { ko: "살을 빼고 싶어요.", en: "I want to lose weight.", note: "살 is body flesh; 빼다 is to take it off. Putting it on is 살이 찌다." },
      { ko: "운동해서 살을 뺐어요.", en: "I lost weight by exercising." },
      { ko: "살을 빼기가 어려워요.", en: "Losing weight is hard." }
    ],
    "대학교|noun": [
      { ko: "대학교에 다녀요.", en: "I go to university.", note: "대학교 is the institution; 대학 also names a college within it." },
      { ko: "어느 대학교를 다니세요?", en: "Which university do you attend?" },
      { ko: "대학교를 졸업했어요.", en: "I graduated from university." }
    ],
    "예를 들어|conjunction": [
      { ko: "예를 들어 설명해 주세요.", en: "Please explain with an example." },
      { ko: "예를 들어, 김치가 있어요.", en: "For example, there is kimchi." },
      { ko: "예를 들어 말해 볼게요.", en: "Let me give you an example." }
    ],
    "걱정하다|verb": [
      { ko: "걱정하지 마세요.", en: "Do not worry." },
      { ko: "뭘 걱정해요?", en: "What are you worried about?" },
      { ko: "부모님이 걱정하세요.", en: "My parents are worried." }
    ],
    "여덟|numeral": [
      { ko: "여덟 시에 만나요.", en: "Let's meet at eight.", note: "Pronounced 여덜. Hours take native numbers." },
      { ko: "여덟 개 주세요.", en: "Eight, please." },
      { ko: "여덟 명이 왔어요.", en: "Eight people came." }
    ],
    "보다|adverb": [
      { ko: "보다 나은 방법이 있어요.", en: "There is a better way.", note: "As an adverb 보다 goes in front of the adjective, and is bookish — speech uses 더." },
      { ko: "보다 빠르게 처리하겠습니다.", en: "We will handle it more quickly." },
      { ko: "보다 나은 미래를 위해 노력해요.", en: "We work for a better future." }
    ],
    "돼지고기|noun": [
      { ko: "돼지고기를 좋아해요.", en: "I like pork." },
      { ko: "돼지고기 이 인분 주세요.", en: "Two portions of pork, please." },
      { ko: "돼지고기는 잘 익혀 드세요.", en: "Make sure the pork is well cooked." }
    ],
    "수건|noun": [
      { ko: "수건 좀 주세요.", en: "Could I have a towel?" },
      { ko: "수건으로 닦으세요.", en: "Dry yourself with the towel." },
      { ko: "수건이 젖었어요.", en: "The towel is wet." }
    ],
    "양복|noun": [
      { ko: "양복을 입었어요.", en: "I am wearing a suit." },
      { ko: "양복 한 벌을 샀어요.", en: "I bought a suit.", note: "벌 counts sets of clothing." },
      { ko: "결혼식에는 양복을 입으세요.", en: "Wear a suit to the wedding." }
    ],
    "잠이 들다|expression": [
      { ko: "금방 잠이 들었어요.", en: "I fell asleep quickly.", note: "잠이 들다 is dropping off; 자다 is sleeping. 들다 is ㄹ-irregular: 잠이 듭니다." },
      { ko: "잠이 안 들어요.", en: "I cannot get to sleep." },
      { ko: "텔레비전을 보다가 잠이 들었어요.", en: "I fell asleep watching television." }
    ],
    "끄다|verb": [
      { ko: "불 좀 꺼 주세요.", en: "Please turn the light off.", note: "끄다 is ㅡ-irregular: 꺼요. Its opposite is 켜다." },
      { ko: "휴대폰을 꺼 주세요.", en: "Please switch off your phone." },
      { ko: "나가기 전에 에어컨을 끄세요.", en: "Turn the air conditioning off before you leave." }
    ],
    "젓가락|noun": [
      { ko: "젓가락 좀 주세요.", en: "Chopsticks, please." },
      { ko: "젓가락질을 잘하시네요!", en: "You are good with chopsticks!" },
      { ko: "젓가락으로 먹어 보세요.", en: "Try eating it with chopsticks." }
    ],
    "리|dependent noun": [
      { ko: "그럴 리가 없어요.", en: "There is no way that is so.", note: "리 is a bound noun meaning likelihood, and lives almost entirely in -(으)ㄹ 리가 없다." },
      { ko: "그 사람이 거짓말할 리가 없어요.", en: "There is no way they would lie." },
      { ko: "이 시간에 올 리가 없어요.", en: "They could not possibly come at this hour." }
    ],
    "가지다|auxiliary verb": [
      { ko: "돈이 없어 가지고 못 샀어요.", en: "I had no money, so I could not buy it.", note: "-아/어 가지고 links a cause to what followed, and is very common in speech." },
      { ko: "늦게 일어나 가지고 지각했어요.", en: "I got up late and so was late." },
      { ko: "김치를 만들어 가지고 왔어요.", en: "I made kimchi and brought it along." }
    ],
    "조용하다|adjective": [
      { ko: "조용히 해 주세요.", en: "Please be quiet.", note: "조용히 is the adverb." },
      { ko: "여기는 조용해요.", en: "It is quiet here." },
      { ko: "조용한 곳에서 만나요.", en: "Let's meet somewhere quiet." }
    ],
    "피아노|noun": [
      { ko: "피아노를 칠 수 있어요?", en: "Can you play the piano?", note: "Struck instruments take 치다." },
      { ko: "어릴 때 피아노를 배웠어요.", en: "I learned piano as a child." },
      { ko: "피아노 소리가 좋아요.", en: "The piano sounds lovely." }
    ],
    "첫|determiner": [
      { ko: "첫 번째 줄에 앉으세요.", en: "Please sit in the first row.", note: "첫 goes straight in front of a noun: 첫날, 첫 시간, 첫 번째." },
      { ko: "오늘이 첫날이에요.", en: "Today is the first day." },
      { ko: "첫인상이 좋았어요.", en: "The first impression was good." }
    ],
    "더러|particle": [
      { ko: "누구더러 그런 말을 해요?", en: "Who are you saying that to?", note: "더러 is a colloquial 에게, and usually turns up when something was said to someone." },
      { ko: "저더러 가라고 했어요.", en: "They told me to go." },
      { ko: "친구더러 도와 달라고 했어요.", en: "I asked a friend to help." }
    ],
    "기숙사|noun": [
      { ko: "기숙사에 살아요.", en: "I live in the dormitory." },
      { ko: "기숙사가 학교 안에 있어요.", en: "The dormitory is on campus." },
      { ko: "기숙사 방을 같이 써요.", en: "We share a dorm room." }
    ],
    "배가 불러요|phrase": [
      { ko: "배가 불러요.", en: "I am full.", casual: "배불러.", note: "부르다 is 르-irregular: 불러요. The polite way to refuse a second helping." },
      { ko: "많이 먹어서 배가 불러요.", en: "I ate a lot, so I am full." },
      { ko: "배가 부르면 그만 드세요.", en: "If you are full, do stop." }
    ],
    "산책|noun": [
      { ko: "산책하러 갈까요?", en: "Shall we go for a walk?" },
      { ko: "매일 저녁에 산책해요.", en: "I take a walk every evening." },
      { ko: "공원에서 산책했어요.", en: "I strolled in the park." }
    ],
    "잃어버리다|verb": [
      { ko: "지갑을 잃어버렸어요.", en: "I have lost my wallet.", note: "-어 버리다 makes the loss final: it is gone for good." },
      { ko: "열쇠를 잃어버렸어요.", en: "I have lost my key." },
      { ko: "잃어버리지 않게 조심하세요.", en: "Be careful not to lose it." }
    ],
    "월요일|noun": [
      { ko: "월요일에 만나요.", en: "Let's meet on Monday.", note: "Days of the week take 에." },
      { ko: "월요일이 제일 바빠요.", en: "Monday is the busiest day." },
      { ko: "다음 월요일에 시작해요.", en: "It starts next Monday." }
    ],
    "문제를 일으키다|expression": [
      { ko: "문제를 일으키지 마세요.", en: "Do not cause trouble.", note: "일으키다 is to raise or set something off." },
      { ko: "그 일이 큰 문제를 일으켰어요.", en: "That matter caused a big problem." },
      { ko: "문제를 일으킬 수 있어요.", en: "It could cause problems." }
    ],
    "병|counter": [
      { ko: "맥주 두 병 주세요.", en: "Two bottles of beer, please." },
      { ko: "물 한 병만 주세요.", en: "Just one bottle of water, please." },
      { ko: "몇 병 시킬까요?", en: "How many bottles shall we order?" }
    ],
    "흠|interjection": [
      { ko: "흠, 잘 모르겠네요.", en: "Hmm, I am not sure.", note: "흠 is a sceptical or considering noise, a touch cooler than 음." },
      { ko: "흠, 그럴 수도 있겠네요.", en: "Hmm, I suppose that is possible." },
      { ko: "흠, 다시 생각해 볼게요.", en: "Hmm, let me reconsider." }
    ],
    "주소|noun": [
      { ko: "주소가 어떻게 되세요?", en: "What is your address?", note: "어떻게 되세요 is the polite way to ask for someone's details." },
      { ko: "주소를 적어 주세요.", en: "Please write down the address." },
      { ko: "이메일 주소를 알려 주세요.", en: "Please give me your email address." }
    ],

    // ================================================================ day 23
    "언제|adverb": [
      { ko: "언제든지 오세요.", en: "Come any time.", note: "언제나 is 'always'; 언제든지 is 'whenever you like'." },
      { ko: "언제 한번 만나요.", en: "Let's meet up sometime." },
      { ko: "언제 끝날지 몰라요.", en: "I do not know when it will end." }
    ],
    "태국|proper noun": [
      { ko: "태국에 가 봤어요?", en: "Have you been to Thailand?" },
      { ko: "태국 음식이 맛있어요.", en: "Thai food is delicious." },
      { ko: "태국은 일 년 내내 더워요.", en: "Thailand is hot all year." }
    ],
    "자기 계발|noun phrase": [
      { ko: "자기 계발을 위해 공부해요.", en: "I study for my own development." },
      { ko: "자기 계발 책을 읽어요.", en: "I read self-improvement books." },
      { ko: "자기 계발이 중요해요.", en: "Developing yourself matters." }
    ],
    "파티|noun": [
      { ko: "파티에 초대해 주셔서 감사합니다.", en: "Thank you for inviting me to the party." },
      { ko: "생일 파티를 했어요.", en: "We had a birthday party." },
      { ko: "파티가 몇 시에 시작해요?", en: "What time does the party start?" }
    ],
    "저희|pronoun": [
      { ko: "저희 집에 오세요.", en: "Please come to our house.", note: "저희 is the humble 우리, used downward-facing to customers and elders. Never 저희 나라 — that is always 우리나라." },
      { ko: "저희가 준비하겠습니다.", en: "We will take care of it." },
      { ko: "저희 회사는 서울에 있어요.", en: "Our company is in Seoul." }
    ],
    "아흔|numeral": [
      { ko: "할머니가 아흔이세요.", en: "My grandmother is ninety.", note: "Ages take native numbers: 일흔, 여든, 아흔." },
      { ko: "아흔 살까지 건강하셨어요.", en: "They stayed healthy until ninety." },
      { ko: "아흔 명이 넘었어요.", en: "There were over ninety people." }
    ],
    "싫어하다|verb": [
      { ko: "매운 음식을 싫어해요.", en: "I dislike spicy food.", note: "싫어하다 is a verb and takes 을/를; 싫다 is an adjective and takes 이/가." },
      { ko: "뭘 싫어해요?", en: "What do you dislike?" },
      { ko: "저를 싫어하는 것 같아요.", en: "I think they dislike me." }
    ],
    "등산|noun": [
      { ko: "주말에 등산 갈까요?", en: "Shall we go hiking at the weekend?", note: "Literally 'climbing a mountain'." },
      { ko: "등산이 취미예요.", en: "Hiking is my hobby." },
      { ko: "등산할 때 물을 꼭 가져가세요.", en: "Take water with you when you hike." }
    ],
    "피곤하다|adjective": [
      { ko: "오늘 정말 피곤해요.", en: "I am really tired today.", note: "피곤하다 is your own state; 힘들다 is what makes you tired." },
      { ko: "피곤하면 쉬세요.", en: "Rest if you are tired." },
      { ko: "잠을 못 자서 피곤해요.", en: "I am tired because I could not sleep." }
    ],
    "메뉴|noun": [
      { ko: "메뉴 좀 주세요.", en: "The menu, please." },
      { ko: "메뉴에 뭐가 있어요?", en: "What is on the menu?" },
      { ko: "추천 메뉴가 뭐예요?", en: "What do you recommend?" }
    ],
    "발이 넓다|expression": [
      { ko: "그 사람은 발이 넓어요.", en: "They know everybody.", note: "Literally 'their feet are wide' — a wide circle of acquaintances, not big feet." },
      { ko: "발이 넓어서 도움이 될 거예요.", en: "They know a lot of people, so they will be useful." },
      { ko: "저는 발이 넓지 않아요.", en: "I do not know that many people." }
    ],
    "외국어|noun": [
      { ko: "외국어를 할 수 있어요?", en: "Can you speak a foreign language?" },
      { ko: "외국어를 배우는 것이 재미있어요.", en: "Learning foreign languages is fun." },
      { ko: "외국어 공부를 시작했어요.", en: "I have started studying a foreign language." }
    ],
    "중|dependent noun": [
      { ko: "지금 회의 중이에요.", en: "I am in a meeting.", note: "Noun + 중이다 is 'in the middle of'." },
      { ko: "세 개 중에 하나를 고르세요.", en: "Choose one of the three.", note: "중에 is also 'among, out of'." },
      { ko: "공사 중이니 조심하세요.", en: "Work is in progress, so take care." }
    ],
    "약속하다|verb": [
      { ko: "약속할게요.", en: "I promise." },
      { ko: "친구와 만나기로 약속했어요.", en: "I arranged to meet a friend.", note: "-기로 약속하다 is agreeing to do something." },
      { ko: "약속한 시간에 오세요.", en: "Come at the agreed time." }
    ],
    "깨나|particle": [
      { ko: "돈깨나 벌었겠어요.", en: "They must have made quite a bit of money.", note: "깨나 attaches to a noun and implies a fair amount, often with a hint of sarcasm." },
      { ko: "고생깨나 했겠네요.", en: "You must have been through quite a lot." },
      { ko: "힘깨나 쓰는 사람이에요.", en: "They are quite the strong one." }
    ],
    "자장면|noun": [
      { ko: "자장면 두 그릇 주세요.", en: "Two bowls of jajangmyeon, please." },
      { ko: "이사할 때 자장면을 시켜 먹어요.", en: "We order jajangmyeon on moving day.", note: "A Korean moving-day tradition." },
      { ko: "자장면이 짬뽕보다 안 매워요.", en: "Jajangmyeon is less spicy than jjamppong." }
    ],
    "중학생|noun": [
      { ko: "제 동생은 중학생이에요.", en: "My younger sibling is in middle school." },
      { ko: "중학생 때 한국어를 시작했어요.", en: "I started Korean in middle school." },
      { ko: "중학생 할인이 있어요?", en: "Is there a discount for middle school students?" }
    ],
    "무엇보다|conjunction": [
      { ko: "무엇보다 건강이 중요해요.", en: "Above all, health matters." },
      { ko: "무엇보다 먼저 쉬세요.", en: "Before anything else, get some rest." },
      { ko: "무엇보다 가족이 제일이에요.", en: "Family comes above everything." }
    ],
    "휴일|noun": [
      { ko: "내일은 휴일이에요.", en: "Tomorrow is a holiday." },
      { ko: "휴일에 뭐 해요?", en: "What do you do on your days off?" },
      { ko: "휴일이라서 가게가 문을 닫았어요.", en: "The shop is shut because it is a holiday." }
    ],
    "목이 말라요|phrase": [
      { ko: "목이 말라요.", en: "I am thirsty.", casual: "목말라.", note: "Literally 'my throat is dry'. 마르다 is 르-irregular: 말라요." },
      { ko: "목이 마른데 물 좀 주세요.", en: "I am thirsty — could I have some water?" },
      { ko: "운동해서 목이 말라요.", en: "I am thirsty from exercising." }
    ],
    "신다|verb": [
      { ko: "신발을 신으세요.", en: "Put your shoes on.", note: "신다 is only for footwear; clothes take 입다 and hats 쓰다." },
      { ko: "양말을 신고 자요.", en: "I sleep with socks on." },
      { ko: "이 구두를 신어 봐도 돼요?", en: "May I try these shoes on?" }
    ],
    "달력|noun": [
      { ko: "달력에 표시해 두었어요.", en: "I marked it on the calendar." },
      { ko: "달력을 보니 다음 주네요.", en: "Looking at the calendar, it is next week." },
      { ko: "새 달력을 걸었어요.", en: "I hung up a new calendar." }
    ],
    "손이 크다|expression": [
      { ko: "어머니는 손이 크세요.", en: "My mother always cooks far too much.", note: "Literally 'a big hand' — generous with food and money, not large-handed." },
      { ko: "손이 커서 늘 음식이 남아요.", en: "They cook so generously that food is always left over." },
      { ko: "손이 큰 사람이에요.", en: "They are a generous sort." }
    ],
    "소풍|noun": [
      { ko: "소풍 가고 싶어요.", en: "I want to go on a picnic." },
      { ko: "학교에서 소풍을 갔어요.", en: "We went on a school outing." },
      { ko: "날씨가 좋아서 소풍하기 좋아요.", en: "The weather is good for a picnic." }
    ],
    "덥다|adjective": [
      { ko: "오늘 너무 더워요.", en: "It is far too hot today.", note: "덥다 is ㅂ-irregular: 더워요. It is for weather; 뜨겁다 is hot to the touch." },
      { ko: "여름에는 아주 더워요.", en: "It gets very hot in summer." },
      { ko: "더우면 창문을 여세요.", en: "Open the window if it is hot." }
    ],
    "오래|adverb": [
      { ko: "오래 기다렸어요.", en: "I waited a long time." },
      { ko: "오래간만이에요.", en: "Long time no see.", note: "오래간만 shortens to 오랜만." },
      { ko: "오래 살고 싶어요.", en: "I want to live a long life." }
    ],
    "매|determiner": [
      { ko: "매일 운동해요.", en: "I exercise every day.", note: "매 goes straight in front: 매일, 매주, 매년." },
      { ko: "매주 월요일에 만나요.", en: "We meet every Monday." },
      { ko: "매년 한국에 가요.", en: "I go to Korea every year." }
    ],
    "테니스|noun": [
      { ko: "테니스를 쳐요.", en: "I play tennis.", note: "Racket sports take 치다." },
      { ko: "테니스를 배우고 싶어요.", en: "I want to learn tennis." },
      { ko: "같이 테니스 칠까요?", en: "Shall we play tennis?" }
    ],
    "이십|numeral": [
      { ko: "이십 분 걸려요.", en: "It takes twenty minutes.", note: "Minutes take Sino-Korean numbers; ages take native 스물." },
      { ko: "이십 층에 있어요.", en: "It is on the twentieth floor." },
      { ko: "이십 퍼센트 할인해요.", en: "It is twenty percent off." }
    ],
    "공책|noun": [
      { ko: "공책에 적으세요.", en: "Write it in your notebook." },
      { ko: "공책 한 권 주세요.", en: "One notebook, please.", note: "권 counts books and notebooks." },
      { ko: "공책을 가져왔어요?", en: "Did you bring your notebook?" }
    ],
    "크다|verb": [
      { ko: "아이가 많이 컸어요.", en: "The child has grown a lot.", note: "As a verb 크다 means to grow; as an adjective it means big." },
      { ko: "커서 뭐가 되고 싶어요?", en: "What do you want to be when you grow up?" },
      { ko: "이 나무는 빨리 커요.", en: "This tree grows fast." }
    ],
    "서점|noun": [
      { ko: "서점에서 책을 샀어요.", en: "I bought a book at the bookshop." },
      { ko: "근처에 서점이 있어요?", en: "Is there a bookshop nearby?" },
      { ko: "서점에서 만날까요?", en: "Shall we meet at the bookshop?" }
    ],
    "귀가 얇다|expression": [
      { ko: "저는 귀가 얇아요.", en: "I am easily talked into things.", note: "Literally 'thin ears' — swayed by whatever you are told." },
      { ko: "귀가 얇아서 자꾸 사요.", en: "I am easily persuaded, so I keep buying things." },
      { ko: "귀가 얇으면 손해를 봐요.", en: "Being easily swayed costs you." }
    ],
    "당신|pronoun": [
      { ko: "당신은 누구세요?", en: "Who are you?", note: "당신 is risky: warm between spouses, cold or hostile with strangers. Use a name plus 씨 instead." },
      { ko: "여보, 당신 어디 있어요?", en: "Darling, where are you?" },
      { ko: "당신의 도움이 필요합니다.", en: "We need your help.", note: "In writing and song lyrics 당신 is a neutral 'you'." }
    ],
    "양말|noun": [
      { ko: "양말을 신으세요.", en: "Put your socks on." },
      { ko: "양말 두 켤레를 샀어요.", en: "I bought two pairs of socks.", note: "켤레 counts footwear in pairs." },
      { ko: "양말에 구멍이 났어요.", en: "There is a hole in my sock." }
    ],
    "이라든지|particle": [
      { ko: "커피라든지 차라든지 아무거나 좋아요.", en: "Coffee or tea, anything is fine.", note: "이라든지 after a consonant, 라든지 after a vowel — it lists examples loosely." },
      { ko: "운동이라든지 산책이라든지 해 보세요.", en: "Try exercise or a walk or something." },
      { ko: "책이라든지 영화라든지 좋아해요.", en: "I like books, films, that sort of thing." }
    ],
    "겸|dependent noun": [
      { ko: "아침 겸 점심을 먹었어요.", en: "I had brunch.", note: "겸 joins two roles in one: 아침 겸 점심, 거실 겸 서재." },
      { ko: "운동 겸 산책을 해요.", en: "I walk, partly for the exercise." },
      { ko: "인사도 할 겸 들렀어요.", en: "I dropped in, partly to say hello.", note: "-(으)ㄹ 겸 gives one of several reasons." }
    ],
    "줄기|counter": [
      { ko: "꽃 한 줄기를 샀어요.", en: "I bought a single stem of flowers.", note: "줄기 counts stems, and streams of water or light." },
      { ko: "빛 한 줄기가 들어왔어요.", en: "A ray of light came in." },
      { ko: "눈물 한 줄기가 흘렀어요.", en: "A tear ran down." }
    ],
    "헉|interjection": [
      { ko: "헉, 정말요?", en: "Whoa, really?", note: "The gasp of shock — casual, and common in messages." },
      { ko: "헉, 벌써 시간이 이렇게 됐어요?", en: "Gosh, is it that late already?" },
      { ko: "헉, 지갑을 놓고 왔어요.", en: "Oh no, I left my wallet behind." }
    ],
    "경치|noun": [
      { ko: "경치가 아름다워요.", en: "The scenery is beautiful." },
      { ko: "여기 경치가 정말 좋네요.", en: "The view here really is lovely." },
      { ko: "산 위에서 경치를 봤어요.", en: "We looked at the view from the mountain." }
    ],
    "지우다|verb": [
      { ko: "여기를 지워 주세요.", en: "Please rub this out." },
      { ko: "지우개로 지웠어요.", en: "I erased it with a rubber." },
      { ko: "문자를 지웠어요.", en: "I deleted the message." }
    ],
    "발음|noun": [
      { ko: "발음이 좋으시네요!", en: "Your pronunciation is good!" },
      { ko: "발음이 어려워요.", en: "The pronunciation is difficult." },
      { ko: "발음을 연습하고 있어요.", en: "I am practising pronunciation." }
    ],
    "죄송하다|adjective": [
      { ko: "죄송합니다.", en: "I am sorry.", casual: "미안해.", note: "죄송하다 is heavier than 미안하다, and the one for strangers and seniors." },
      { ko: "늦어서 죄송합니다.", en: "I am sorry I am late." },
      { ko: "죄송하지만 다시 말씀해 주세요.", en: "Sorry, but could you say that again?" }
    ],
    "주스|noun": [
      { ko: "주스 한 잔 주세요.", en: "A glass of juice, please." },
      { ko: "무슨 주스가 있어요?", en: "What juices do you have?" },
      { ko: "오렌지 주스를 좋아해요.", en: "I like orange juice." }
    ],
    "콜라|noun": [
      { ko: "콜라 한 병 주세요.", en: "One bottle of cola, please." },
      { ko: "콜라 말고 물 주세요.", en: "Water rather than cola, please.", note: "말고 is 'not that, but'." },
      { ko: "콜라에 얼음 넣어 주세요.", en: "Ice in the cola, please." }
    ],
    "입이 무겁다|expression": [
      { ko: "그 사람은 입이 무거워요.", en: "They can keep a secret.", note: "Literally 'a heavy mouth'. Its opposite, 입이 가볍다, is someone who talks." },
      { ko: "입이 무거우니까 걱정하지 마세요.", en: "They are discreet, so do not worry." },
      { ko: "입이 무거운 친구예요.", en: "They are a friend who keeps things to themselves." }
    ],
    "피곤해요|phrase": [
      { ko: "피곤해요.", en: "I am tired.", casual: "피곤해.", note: "About your own state; 힘들어요 is about what wore you out." },
      { ko: "오늘은 너무 피곤해요.", en: "I am so tired today." },
      { ko: "피곤해 보여요.", en: "You look tired.", note: "-아/어 보이다 is 'to look, to seem'." }
    ],
    "필리핀|proper noun": [
      { ko: "필리핀에서 왔어요.", en: "I am from the Philippines." },
      { ko: "필리핀은 섬이 많아요.", en: "The Philippines has many islands." },
      { ko: "필리핀에 가 보고 싶어요.", en: "I would like to visit the Philippines." }
    ],
    "여가 활동|noun phrase": [
      { ko: "여가 활동으로 뭘 하세요?", en: "What do you do in your free time?" },
      { ko: "여가 활동이 중요해요.", en: "Leisure activities matter." },
      { ko: "여가 활동을 즐겨요.", en: "I enjoy my leisure time." }
    ],
    "일찍|adverb": [
      { ko: "일찍 일어났어요.", en: "I got up early.", note: "Its opposite is 늦게." },
      { ko: "오늘은 일찍 자세요.", en: "Get an early night today." },
      { ko: "일찍 오셨네요.", en: "You are here early." }
    ],

    // ================================================================ day 24
    "잊어버리다|verb": [
      { ko: "완전히 잊어버렸어요.", en: "I completely forgot.", note: "-어 버리다 makes it final: it is gone from your head for good." },
      { ko: "잊어버리기 전에 적어 두세요.", en: "Write it down before you forget." },
      { ko: "비밀번호를 잊어버렸어요.", en: "I have forgotten the password." }
    ],
    "남학생|noun": [
      { ko: "남학생이 몇 명이에요?", en: "How many male students are there?", note: "남학생 and 여학생 are the pair." },
      { ko: "이 반은 남학생이 많아요.", en: "This class has a lot of boys." },
      { ko: "남학생 기숙사는 저쪽이에요.", en: "The men's dormitory is over there." }
    ],
    "우체국|noun": [
      { ko: "우체국이 어디에 있어요?", en: "Where is the post office?" },
      { ko: "우체국에서 소포를 보냈어요.", en: "I sent a parcel at the post office." },
      { ko: "우체국은 다섯 시에 문을 닫아요.", en: "The post office closes at five." }
    ],
    "십만|numeral": [
      { ko: "십만 원이에요.", en: "It is a hundred thousand won.", note: "Korean counts in units of ten thousand, so a hundred thousand is 십만, never 백천." },
      { ko: "십만 명이 넘게 왔어요.", en: "Over a hundred thousand people came." },
      { ko: "십만 원짜리가 없어요.", en: "There is no hundred thousand won note." }
    ],
    "대사관|noun": [
      { ko: "대사관에 가야 해요.", en: "I have to go to the embassy." },
      { ko: "한국 대사관이 어디예요?", en: "Where is the Korean embassy?" },
      { ko: "대사관에 비자를 신청했어요.", en: "I applied for a visa at the embassy." }
    ],
    "안되다|verb": [
      { ko: "일이 잘 안돼요.", en: "Things are not working out.", note: "안되다 written together is 'to not work out'; 안 되다 spaced is 'must not'." },
      { ko: "여기에서 담배를 피우면 안 돼요.", en: "You must not smoke here." },
      { ko: "공부가 잘 안돼요.", en: "I cannot get my studying to go well." }
    ],
    "정류장|noun": [
      { ko: "버스 정류장이 어디예요?", en: "Where is the bus stop?" },
      { ko: "다음 정류장에서 내리세요.", en: "Get off at the next stop." },
      { ko: "정류장에서 십 분 기다렸어요.", en: "I waited ten minutes at the stop." }
    ],
    "이라든가|particle": [
      { ko: "커피라든가 차라든가 주세요.", en: "Coffee or tea or something, please.", note: "이라든가 after a consonant, 라든가 after a vowel — it offers loose examples, like 이라든지." },
      { ko: "책이라든가 영화라든가 좋아해요.", en: "I like books, films, that sort of thing." },
      { ko: "주말이라든가 휴일에 만나요.", en: "Let's meet at a weekend or on a holiday." }
    ],
    "웬|determiner": [
      { ko: "웬일이에요?", en: "What brings you here?", note: "웬 asks what sort of, with a note of surprise. 왠 is a different word — 왠지, 'somehow'." },
      { ko: "웬 사람이 이렇게 많아요?", en: "Why on earth are there so many people?" },
      { ko: "웬 선물이에요?", en: "What is this present for?" }
    ],
    "눈이 높다|expression": [
      { ko: "눈이 높으시네요.", en: "You have high standards.", note: "Literally 'high eyes' — picky about partners, clothes or quality." },
      { ko: "눈이 높아서 아직 결혼 안 했어요.", en: "They are picky, so they are not married yet." },
      { ko: "저는 눈이 높지 않아요.", en: "I am not that fussy." }
    ],
    "첫째로|conjunction": [
      { ko: "첫째로 건강이 중요해요.", en: "Firstly, health is important.", note: "첫째로, 둘째로, 셋째로 number the points of an argument." },
      { ko: "첫째로 시간을 지켜야 해요.", en: "First of all, you must be on time." },
      { ko: "첫째로 감사드리고 싶습니다.", en: "First of all, I would like to say thank you." }
    ],
    "여동생|noun": [
      { ko: "여동생이 한 명 있어요.", en: "I have one younger sister.", note: "동생 does not mark gender; 여동생 and 남동생 do." },
      { ko: "여동생이 대학생이에요.", en: "My younger sister is at university." },
      { ko: "여동생하고 사이가 좋아요.", en: "I get on well with my younger sister." }
    ],
    "감사하다|adjective": [
      { ko: "정말 감사합니다.", en: "Thank you very much.", note: "감사하다 is the Sino-Korean word and already formal; 고맙다 is the native one." },
      { ko: "도와주셔서 감사합니다.", en: "Thank you for your help." },
      { ko: "감사한 마음뿐이에요.", en: "I am nothing but grateful." }
    ],
    "등|dependent noun": [
      { ko: "사과, 배 등을 샀어요.", en: "I bought apples, pears and so on.", note: "등 closes a list, like 'etc.' It follows the last item directly." },
      { ko: "한국, 일본, 중국 등 여러 나라에 갔어요.", en: "I visited Korea, Japan, China and other countries." },
      { ko: "책, 공책 등이 필요해요.", en: "You need a book, a notebook and the like." }
    ],
    "드리다|auxiliary verb": [
      { ko: "제가 도와드릴게요.", en: "Let me help you.", note: "-아/어 드리다 is the humble -아/어 주다, for doing something for someone senior." },
      { ko: "말씀드릴 게 있어요.", en: "There is something I would like to tell you." },
      { ko: "사진 찍어 드릴까요?", en: "Shall I take a photo for you?" }
    ],
    "오래간만|noun": [
      { ko: "오래간만이에요.", en: "Long time no see.", casual: "오래간만이야.", note: "오래간만 shortens to 오랜만, which is what people usually say." },
      { ko: "오래간만에 친구를 만났어요.", en: "I met a friend after a long time." },
      { ko: "정말 오래간만입니다.", en: "It really has been a long time." }
    ],
    "점심시간|noun": [
      { ko: "점심시간이 몇 시예요?", en: "When is the lunch break?" },
      { ko: "점심시간에 만나요.", en: "Let's meet at lunchtime." },
      { ko: "점심시간이 한 시간이에요.", en: "The lunch break is an hour." }
    ],
    "노래하다|verb": [
      { ko: "노래해 주세요.", en: "Please sing for us.", note: "노래를 부르다 is the more natural pairing in speech." },
      { ko: "같이 노래할까요?", en: "Shall we sing together?" },
      { ko: "새가 노래해요.", en: "The birds are singing." }
    ],
    "그녀|pronoun": [
      { ko: "그녀는 한국 사람이에요.", en: "She is Korean.", note: "그녀 is written Korean only — it was coined for translation. In speech people say 그 사람 or 그분." },
      { ko: "그녀가 말했어요.", en: "She said so." },
      { ko: "그녀의 이름을 몰라요.", en: "I do not know her name." }
    ],
    "휴지|noun": [
      { ko: "휴지 좀 주세요.", en: "Could I have some tissue?", note: "휴지 covers toilet paper and tissues alike." },
      { ko: "휴지가 다 떨어졌어요.", en: "We have run out of toilet paper." },
      { ko: "휴지는 휴지통에 버리세요.", en: "Put tissues in the bin." }
    ],
    "태권도|noun": [
      { ko: "태권도를 배워요.", en: "I learn taekwondo." },
      { ko: "태권도는 한국의 전통 무술이에요.", en: "Taekwondo is a traditional Korean martial art." },
      { ko: "태권도 수업이 몇 시에 시작해요?", en: "What time does the taekwondo class start?" }
    ],
    "머리가 아프다|expression": [
      { ko: "머리가 아파요.", en: "I have a headache.", note: "Also used of a problem that is giving you a headache." },
      { ko: "이 문제 때문에 머리가 아파요.", en: "This problem is giving me a headache." },
      { ko: "머리가 아프면 약을 드세요.", en: "Take some medicine if your head hurts." }
    ],
    "매일|adverb": [
      { ko: "매일 운동해요.", en: "I exercise every day." },
      { ko: "매일 한국어를 공부해요.", en: "I study Korean every day." },
      { ko: "매일 아침 커피를 마셔요.", en: "I drink coffee every morning." }
    ],
    "재미있었어요|phrase": [
      { ko: "정말 재미있었어요.", en: "It really was fun.", casual: "정말 재미있었어.", note: "What you say on leaving a good gathering." },
      { ko: "오늘 재미있었어요. 또 만나요.", en: "Today was fun. Let's do it again." },
      { ko: "영화가 재미있었어요?", en: "Was the film good?" }
    ],
    "햄버거|noun": [
      { ko: "햄버거 하나 주세요.", en: "One hamburger, please." },
      { ko: "점심으로 햄버거를 먹었어요.", en: "I had a burger for lunch." },
      { ko: "햄버거보다 김밥이 좋아요.", en: "I prefer gimbap to burgers." }
    ],
    "늦다|verb": [
      { ko: "늦어서 죄송합니다.", en: "I am sorry I am late.", note: "늦다 works as both verb and adjective — 늦었어요 covers both." },
      { ko: "기차가 늦었어요.", en: "The train was late." },
      { ko: "늦지 마세요.", en: "Do not be late." }
    ],
    "다발|counter": [
      { ko: "꽃 한 다발 주세요.", en: "One bunch of flowers, please.", note: "다발 counts bundles and bouquets." },
      { ko: "장미 한 다발을 받았어요.", en: "I was given a bouquet of roses." },
      { ko: "파 두 다발 샀어요.", en: "I bought two bunches of spring onions." }
    ],
    "쯧쯧|interjection": [
      { ko: "쯧쯧, 안됐네요.", en: "Tsk, what a shame.", note: "The clicking noise of pity or disapproval." },
      { ko: "쯧쯧, 또 늦었어요?", en: "Tsk tsk, late again?" },
      { ko: "쯧쯧, 그러게 조심하라고 했잖아요.", en: "Tsk, I did tell you to be careful." }
    ],
    "감사|noun": [
      { ko: "감사의 말씀을 드립니다.", en: "I would like to express my thanks." },
      { ko: "감사 인사를 드렸어요.", en: "I paid my thanks." },
      { ko: "감사 편지를 썼어요.", en: "I wrote a thank-you letter." }
    ],
    "친절하다|adjective": [
      { ko: "정말 친절하시네요.", en: "You are very kind." },
      { ko: "그 가게 주인이 친절해요.", en: "The owner of that shop is kind." },
      { ko: "친절하게 설명해 주셨어요.", en: "They explained it kindly." }
    ],
    "슈퍼마켓|noun": [
      { ko: "슈퍼마켓에서 장을 봤어요.", en: "I did the shopping at the supermarket.", note: "장을 보다 is the fixed pairing for grocery shopping." },
      { ko: "근처에 슈퍼마켓이 있어요?", en: "Is there a supermarket nearby?" },
      { ko: "슈퍼마켓이 몇 시까지 해요?", en: "How late is the supermarket open?" }
    ],
    "서|particle": [
      { ko: "어디서 왔어요?", en: "Where are you from?", note: "서 is 에서 contracted, and very common in speech: 여기서, 거기서, 어디서." },
      { ko: "여기서 기다릴게요.", en: "I will wait here." },
      { ko: "학교서 만나요.", en: "Let's meet at school." }
    ],
    "백만|numeral": [
      { ko: "백만 원이에요.", en: "It is a million won." },
      { ko: "백만 명이 넘어요.", en: "It is over a million people." },
      { ko: "백만 번 말했어요.", en: "I have said it a million times." }
    ],
    "비누|noun": [
      { ko: "비누로 손을 씻으세요.", en: "Wash your hands with soap." },
      { ko: "비누가 다 떨어졌어요.", en: "We have run out of soap." },
      { ko: "비누 냄새가 좋아요.", en: "The soap smells nice." }
    ],
    "배가 아프다|expression": [
      { ko: "배가 아파요.", en: "I have a stomach ache." },
      { ko: "친구가 잘돼서 배가 아파요.", en: "I am jealous that my friend is doing well.", note: "A sore stomach is also how Korean says envy — 사촌이 땅을 사면 배가 아프다." },
      { ko: "배가 아프면 병원에 가세요.", en: "If your stomach hurts, see a doctor." }
    ],
    "걸어오다|verb": [
      { ko: "걸어왔어요.", en: "I came on foot.", note: "걸어오다 comes on foot toward the speaker; 걸어가다 goes away from them." },
      { ko: "역에서 걸어왔어요.", en: "I walked from the station." },
      { ko: "여기까지 걸어오셨어요?", en: "Did you walk all the way here?" }
    ],
    "세수|noun": [
      { ko: "세수했어요?", en: "Have you washed your face?", note: "세수하다 is specifically washing the face; 목욕하다 is bathing." },
      { ko: "일어나서 세수부터 해요.", en: "I wash my face first thing after getting up." },
      { ko: "세수하고 나갈게요.", en: "I will wash my face and head out." }
    ],
    "따위|dependent noun": [
      { ko: "연필 따위를 샀어요.", en: "I bought pencils and such.", note: "따위 lists things dismissively — aimed at a person it is rude." },
      { ko: "그런 일 따위는 걱정하지 마세요.", en: "Do not worry about things like that." },
      { ko: "돈 따위는 중요하지 않아요.", en: "Money and the like do not matter." }
    ],
    "찌개|noun": [
      { ko: "김치찌개를 좋아해요.", en: "I like kimchi stew.", note: "찌개 is thicker and saltier than 국, and shared from one pot." },
      { ko: "찌개가 좀 매워요.", en: "The stew is a bit spicy." },
      { ko: "된장찌개 이 인분 주세요.", en: "Two portions of soybean stew, please." }
    ],
    "넥타이|noun": [
      { ko: "넥타이를 맸어요.", en: "I put on a tie.", note: "Ties take 매다, to tie." },
      { ko: "넥타이가 잘 어울려요.", en: "The tie suits you." },
      { ko: "넥타이를 풀었어요.", en: "I loosened my tie." }
    ],
    "한글|proper noun": [
      { ko: "한글은 세종대왕이 만들었어요.", en: "Hangul was created by King Sejong." },
      { ko: "한글날은 시월 구일이에요.", en: "Hangul Day is the ninth of October." },
      { ko: "한글은 과학적인 글자예요.", en: "Hangul is a scientific writing system." }
    ],
    "건강 검진|noun phrase": [
      { ko: "건강 검진을 받았어요.", en: "I had a health check.", note: "검진 pairs with 받다 — a check-up is 'received'." },
      { ko: "일 년에 한 번 건강 검진을 해요.", en: "I have a check-up once a year." },
      { ko: "건강 검진 결과가 좋았어요.", en: "The check-up results were good." }
    ],
    "인사하다|verb": [
      { ko: "선생님께 인사했어요.", en: "I greeted the teacher." },
      { ko: "인사하세요.", en: "Say hello." },
      { ko: "인사도 없이 갔어요.", en: "They left without so much as a goodbye." }
    ],
    "매일|noun": [
      { ko: "매일이 바빠요.", en: "Every day is busy.", note: "As a noun 매일 can take particles: 매일이, 매일을." },
      { ko: "매일을 소중히 보내세요.", en: "Make each day count." },
      { ko: "매일매일이 즐거워요.", en: "Every single day is enjoyable." }
    ],
    "별|determiner": [
      { ko: "별 문제 없어요.", en: "There is no particular problem.", note: "별 in front of a noun means 'particular', and usually brings a negative with it." },
      { ko: "별일 없어요?", en: "Everything all right?" },
      { ko: "별말씀을요.", en: "Not at all.", note: "The polite reply to thanks — literally 'what a thing to say'." }
    ],
    "어서|adverb": [
      { ko: "어서 오세요.", en: "Welcome.", note: "어서 is 'quickly, do go on' — in greetings it has softened to a warm welcome." },
      { ko: "어서 드세요.", en: "Please, do eat." },
      { ko: "어서 가세요.", en: "Off you go." }
    ],
    "얼굴이 두껍다|expression": [
      { ko: "얼굴이 참 두꺼워요.", en: "They have no shame.", note: "Literally 'a thick face' — the Korean equivalent of brazen." },
      { ko: "얼굴이 두꺼워서 부탁을 잘해요.", en: "They are shameless enough to ask for anything." },
      { ko: "제가 얼굴이 두껍지 않아서 못 물어봤어요.", en: "I was too embarrassed to ask." }
    ],
    "한국말|noun": [
      { ko: "한국말을 잘하시네요!", en: "Your Korean is good!", note: "한국말 is the everyday word; 한국어 is the formal one." },
      { ko: "한국말로 어떻게 말해요?", en: "How do you say it in Korean?" },
      { ko: "한국말을 조금 할 수 있어요.", en: "I can speak a little Korean." }
    ],
    "못하다|adjective": [
      { ko: "이것보다 못해요.", en: "It is not as good as this one.", note: "As an adjective 못하다 compares unfavourably: A보다 못하다." },
      { ko: "생각보다 못했어요.", en: "It was worse than I expected." },
      { ko: "작년보다 못한 것 같아요.", en: "It seems worse than last year." }
    ],
    "계란|noun": [
      { ko: "계란 두 알 주세요.", en: "Two eggs, please.", note: "계란 and 달걀 are both standard." },
      { ko: "계란을 삶았어요.", en: "I boiled some eggs." },
      { ko: "계란 프라이를 만들었어요.", en: "I made a fried egg." }
    ],
    "정말이에요|phrase": [
      { ko: "정말이에요.", en: "It is true.", casual: "정말이야.", note: "As a question, 정말이에요? is 'really?'" },
      { ko: "정말이에요? 믿을 수 없어요.", en: "Really? I cannot believe it." },
      { ko: "거짓말이 아니라 정말이에요.", en: "It is not a lie — it is true." }
    ],

    // ================================================================ day 25
    "그들|pronoun": [
      { ko: "그들은 친구예요.", en: "They are friends.", note: "그들 is written Korean; speech uses 그 사람들 or 그분들." },
      { ko: "그들의 이야기를 들었어요.", en: "I heard their story." },
      { ko: "그들이 먼저 도착했어요.", en: "They arrived first." }
    ],
    "에어컨|noun": [
      { ko: "에어컨을 켤까요?", en: "Shall I put the air conditioning on?" },
      { ko: "에어컨이 고장 났어요.", en: "The air conditioner is broken." },
      { ko: "에어컨 때문에 추워요.", en: "It is cold because of the air conditioning." }
    ],
    "마지막으로|conjunction": [
      { ko: "마지막으로 질문이 있어요.", en: "Lastly, I have a question." },
      { ko: "마지막으로 한 번만 더 해 보세요.", en: "Give it one last try." },
      { ko: "마지막으로 감사드립니다.", en: "Finally, let me say thank you." }
    ],
    "전화하다|verb": [
      { ko: "나중에 전화할게요.", en: "I will call you later." },
      { ko: "저한테 전화해 주세요.", en: "Please call me.", note: "The person called takes 에게/한테." },
      { ko: "어제 전화했는데 안 받으셨어요.", en: "I called yesterday but you did not pick up." }
    ],
    "에게로|particle": [
      { ko: "저에게로 오세요.", en: "Come over to me.", note: "에게로 adds direction to 에게 — movement toward a person. 한테로 is its spoken twin." },
      { ko: "편지가 저에게로 왔어요.", en: "The letter came to me." },
      { ko: "마음이 그 사람에게로 갔어요.", en: "My heart went out to them." }
    ],
    "초대|noun": [
      { ko: "초대해 주셔서 감사합니다.", en: "Thank you for the invitation." },
      { ko: "초대장을 받았어요.", en: "I received an invitation card." },
      { ko: "생일 파티에 초대하고 싶어요.", en: "I would like to invite you to my birthday party." }
    ],
    "억|numeral": [
      { ko: "일억 원이에요.", en: "It is a hundred million won.", note: "만, 억, 조 — Korean's big units, each ten thousand times the last." },
      { ko: "인구가 일억 명이 넘어요.", en: "The population is over a hundred million." },
      { ko: "집값이 오억이에요.", en: "The house costs five hundred million." }
    ],
    "사전|noun": [
      { ko: "사전을 찾아보세요.", en: "Look it up in the dictionary.", note: "사전을 찾다 is the fixed pairing for looking a word up." },
      { ko: "전자사전을 써요.", en: "I use an electronic dictionary." },
      { ko: "사전에 이 단어가 없어요.", en: "This word is not in the dictionary." }
    ],
    "목이 빠지다|expression": [
      { ko: "목이 빠지게 기다렸어요.", en: "I waited and waited.", note: "Literally 'my neck fell off' from craning to look — waiting impatiently." },
      { ko: "연락을 목이 빠지게 기다리고 있어요.", en: "I am waiting anxiously to hear." },
      { ko: "목이 빠지도록 기다렸는데 안 왔어요.", en: "I waited forever and they never came." }
    ],
    "실례|noun": [
      { ko: "실례가 많았습니다.", en: "Forgive the intrusion.", note: "Said on leaving after taking up someone's time." },
      { ko: "실례지만 성함이 어떻게 되세요?", en: "Excuse me, but what is your name?" },
      { ko: "실례를 무릅쓰고 말씀드립니다.", en: "At the risk of being rude, let me say this." }
    ],
    "잠자다|verb": [
      { ko: "잠자기 전에 이를 닦으세요.", en: "Brush your teeth before going to sleep.", note: "잠자다 is 잠을 자다 written as one word." },
      { ko: "아기가 잠자고 있어요.", en: "The baby is asleep." },
      { ko: "잠자는 시간이 부족해요.", en: "I am not getting enough sleep." }
    ],
    "나름|dependent noun": [
      { ko: "사람 나름이에요.", en: "It depends on the person.", note: "Noun + 나름이다: it varies with that. After a verb, -기 나름이다." },
      { ko: "생각하기 나름이에요.", en: "It depends how you look at it." },
      { ko: "저 나름대로 열심히 했어요.", en: "I worked hard in my own way." }
    ],
    "약국|noun": [
      { ko: "약국이 어디에 있어요?", en: "Where is the pharmacy?" },
      { ko: "약국에서 약을 샀어요.", en: "I bought medicine at the pharmacy." },
      { ko: "병원 옆에 약국이 있어요.", en: "There is a pharmacy beside the hospital." }
    ],
    "달다|adjective": [
      { ko: "너무 달아요.", en: "It is too sweet.", note: "달다 is ㄹ-irregular: 답니다, 단." },
      { ko: "단 음식을 좋아해요.", en: "I like sweet things." },
      { ko: "이 사과가 정말 달아요.", en: "This apple is really sweet." }
    ],
    "포기|counter": [
      { ko: "배추 한 포기를 샀어요.", en: "I bought a head of cabbage.", note: "포기 counts whole heads of cabbage and lettuce — essential at kimchi time." },
      { ko: "김치를 담그려고 배추 열 포기를 샀어요.", en: "I bought ten cabbages to make kimchi." },
      { ko: "한 포기에 얼마예요?", en: "How much for one head?" }
    ],
    "만세|interjection": [
      { ko: "만세!", en: "Hurrah!", note: "Literally 'ten thousand years'. Shouted three times at celebrations and on Independence Day." },
      { ko: "우리가 이겼어요. 만세!", en: "We won. Hurrah!" },
      { ko: "만세를 불렀어요.", en: "We gave three cheers.", note: "만세를 부르다 is the fixed pairing." }
    ],
    "지난주|noun": [
      { ko: "지난주에 만났어요.", en: "We met last week.", note: "Written as one word: 지난주, 지난달." },
      { ko: "지난주보다 바빠요.", en: "I am busier than last week." },
      { ko: "지난주 금요일이었어요.", en: "It was last Friday." }
    ],
    "간호사|noun": [
      { ko: "간호사에게 물어보세요.", en: "Ask the nurse." },
      { ko: "제 언니는 간호사예요.", en: "My older sister is a nurse." },
      { ko: "간호사 선생님이 친절해요.", en: "The nurse is kind.", note: "Nurses are addressed as 간호사 선생님." }
    ],
    "천천히|adverb": [
      { ko: "천천히 말해 주세요.", en: "Please speak slowly." },
      { ko: "천천히 하세요.", en: "Take your time." },
      { ko: "천천히 드세요.", en: "Eat slowly." }
    ],
    "축하하다|verb": [
      { ko: "축하합니다!", en: "Congratulations!", casual: "축하해!", note: "What is celebrated takes 을/를: 졸업을 축하해요." },
      { ko: "생일을 축하해요.", en: "Happy birthday." },
      { ko: "합격을 축하드립니다.", en: "Congratulations on passing.", note: "축하드리다 is the humble form, used upward." }
    ],
    "발 벗고 나서다|expression": [
      { ko: "친구를 위해 발 벗고 나섰어요.", en: "They threw themselves into helping a friend.", note: "Literally 'took their shoes off and stepped up' — pitching in wholeheartedly." },
      { ko: "모두 발 벗고 나서서 도왔어요.", en: "Everyone rolled up their sleeves and helped." },
      { ko: "발 벗고 나서 주셔서 감사합니다.", en: "Thank you for going out of your way to help." }
    ],
    "고등학생|noun": [
      { ko: "제 동생은 고등학생이에요.", en: "My younger sibling is in high school." },
      { ko: "고등학생 때 한국에 왔어요.", en: "I came to Korea in high school." },
      { ko: "고등학생은 할인이 돼요.", en: "There is a discount for high school students." }
    ],
    "닭고기|noun": [
      { ko: "닭고기를 좋아해요.", en: "I like chicken." },
      { ko: "닭고기로 요리했어요.", en: "I cooked with chicken." },
      { ko: "저는 닭고기만 먹어요.", en: "I only eat chicken." }
    ],
    "이라야|particle": [
      { ko: "이것이라야 해요.", en: "It has to be this one.", note: "이라야 after a consonant, 라야 after a vowel: only this will do." },
      { ko: "학생이라야 할인을 받을 수 있어요.", en: "Only students can get the discount." },
      { ko: "회원이라야 들어갈 수 있어요.", en: "Only members may enter." }
    ],
    "숟가락|noun": [
      { ko: "숟가락 좀 주세요.", en: "A spoon, please." },
      { ko: "숟가락으로 드세요.", en: "Eat it with a spoon.", note: "Rice and soup take the spoon; side dishes take chopsticks." },
      { ko: "숟가락하고 젓가락을 놓으세요.", en: "Set out the spoon and chopsticks." }
    ],
    "진짜예요|phrase": [
      { ko: "진짜예요?", en: "Seriously?", casual: "진짜?", note: "진짜 is the casual twin of 정말." },
      { ko: "진짜예요, 농담 아니에요.", en: "It is true, I am not joking." },
      { ko: "이거 진짜예요? 가짜 아니에요?", en: "Is this genuine? Not a fake?" }
    ],
    "총|determiner": [
      { ko: "총 얼마예요?", en: "How much in total?", note: "총 sits in front of a noun or a number: 총 십 명." },
      { ko: "총 열 명이 왔어요.", en: "Ten people came in all." },
      { ko: "총 세 시간 걸렸어요.", en: "It took three hours altogether." }
    ],
    "운동하다|verb": [
      { ko: "매일 운동해요.", en: "I exercise every day." },
      { ko: "같이 운동할까요?", en: "Shall we work out together?" },
      { ko: "운동하고 나면 기분이 좋아요.", en: "I feel good after exercising." }
    ],
    "요일|noun": [
      { ko: "무슨 요일이에요?", en: "What day of the week is it?" },
      { ko: "요일마다 수업이 달라요.", en: "The classes differ by day." },
      { ko: "무슨 요일에 만날까요?", en: "Which day shall we meet?" }
    ],
    "치약|noun": [
      { ko: "치약이 다 떨어졌어요.", en: "We have run out of toothpaste." },
      { ko: "치약 좀 사다 주세요.", en: "Could you pick up some toothpaste?" },
      { ko: "칫솔에 치약을 짜세요.", en: "Squeeze the toothpaste onto the brush." }
    ],
    "재미없다|adjective": [
      { ko: "이 영화는 재미없어요.", en: "This film is boring.", note: "Written as one word, like its opposite 재미있다." },
      { ko: "재미없으면 그만 보세요.", en: "If it is dull, stop watching." },
      { ko: "재미없는 이야기예요.", en: "It is a dull story." }
    ],
    "조|numeral": [
      { ko: "일 조 원이에요.", en: "It is a trillion won.", note: "만, 억, 조 — each unit is ten thousand times the one before." },
      { ko: "예산이 십 조가 넘어요.", en: "The budget is over ten trillion." },
      { ko: "조 단위의 돈이에요.", en: "It is money on a trillion scale." }
    ],
    "시치미를 떼다|expression": [
      { ko: "시치미를 떼지 마세요.", en: "Do not play innocent.", note: "From falconry: removing the owner's name tag from a hawk and pretending it is yours." },
      { ko: "알면서 시치미를 뗐어요.", en: "They knew, and played dumb." },
      { ko: "시치미를 떼도 소용없어요.", en: "There is no use pretending you do not know." }
    ],
    "자신|pronoun": [
      { ko: "자신을 믿으세요.", en: "Believe in yourself." },
      { ko: "자기 자신부터 돌보세요.", en: "Look after yourself first." },
      { ko: "자신 있어요?", en: "Are you confident?", note: "자신이 있다 is 'to be confident'." }
    ],
    "금요일|noun": [
      { ko: "금요일에 만나요.", en: "Let's meet on Friday." },
      { ko: "금요일 저녁이 제일 좋아요.", en: "Friday evening is the best." },
      { ko: "다음 금요일까지 끝내야 해요.", en: "It has to be done by next Friday." }
    ],
    "터|dependent noun": [
      { ko: "갈 터이니 기다리세요.", en: "I am going to go, so wait for me.", note: "-(으)ㄹ 터이다 states an intention or expectation; in speech it contracts to -(으)ㄹ 테니까." },
      { ko: "곧 도착할 테니까 걱정하지 마세요.", en: "I will be there soon, so do not worry." },
      { ko: "바쁠 텐데 쉬세요.", en: "You must be busy — do get some rest." }
    ],
    "계시다|auxiliary verb": [
      { ko: "선생님께서 기다리고 계세요.", en: "The teacher is waiting.", note: "-고 계시다 is the honorific -고 있다, used about someone senior." },
      { ko: "할아버지께서 주무시고 계세요.", en: "Grandfather is sleeping." },
      { ko: "뭐 하고 계세요?", en: "What are you doing?" }
    ],
    "세종대왕|proper noun": [
      { ko: "세종대왕이 한글을 만들었어요.", en: "King Sejong created Hangul." },
      { ko: "광화문에 세종대왕 동상이 있어요.", en: "There is a statue of King Sejong at Gwanghwamun." },
      { ko: "만 원에 세종대왕이 그려져 있어요.", en: "King Sejong is on the ten thousand won note." }
    ],
    "예방 접종|noun phrase": [
      { ko: "예방 접종을 받았어요.", en: "I had a vaccination.", note: "접종 pairs with 받다 — a jab is 'received'." },
      { ko: "독감 예방 접종을 했어요.", en: "I got the flu jab." },
      { ko: "아이들은 예방 접종이 필요해요.", en: "Children need vaccinations." }
    ],
    "김밥|noun": [
      { ko: "김밥 한 줄 주세요.", en: "One roll of gimbap, please.", note: "줄 counts rolls of gimbap." },
      { ko: "소풍에 김밥을 싸 갔어요.", en: "We packed gimbap for the picnic." },
      { ko: "김밥이 간단하고 맛있어요.", en: "Gimbap is simple and tasty." }
    ],
    "청소하다|verb": [
      { ko: "방을 청소했어요.", en: "I cleaned my room." },
      { ko: "같이 청소할까요?", en: "Shall we clean up together?" },
      { ko: "청소하고 쉬세요.", en: "Clean up and then rest." }
    ],
    "바나나|noun": [
      { ko: "바나나 한 개 주세요.", en: "One banana, please." },
      { ko: "바나나가 잘 익었어요.", en: "The bananas are nicely ripe." },
      { ko: "아침에 바나나를 먹어요.", en: "I eat a banana in the morning." }
    ],
    "어제|adverb": [
      { ko: "어제 뭐 했어요?", en: "What did you do yesterday?", note: "어제 takes no 에." },
      { ko: "어제 늦게 잤어요.", en: "I went to bed late yesterday." },
      { ko: "어제 본 영화가 재미있었어요.", en: "The film I saw yesterday was good." }
    ],
    "수요일|noun": [
      { ko: "수요일에 시험이 있어요.", en: "There is an exam on Wednesday." },
      { ko: "수요일까지 끝내야 해요.", en: "It has to be finished by Wednesday." },
      { ko: "다음 수요일에 만나요.", en: "Let's meet next Wednesday." }
    ],
    "끝으로|conjunction": [
      { ko: "끝으로 한 말씀 드리겠습니다.", en: "In closing, let me say one thing.", note: "The standard closing line of a speech." },
      { ko: "끝으로 감사의 인사를 드립니다.", en: "Finally, let me offer my thanks." },
      { ko: "끝으로 질문을 받겠습니다.", en: "Lastly, I will take questions." }
    ],
    "미역국을 먹다|expression": [
      { ko: "시험에서 미역국을 먹었어요.", en: "I failed the exam.", note: "Seaweed soup is slippery, so eating it means you slipped up. Never say it to someone before an exam." },
      { ko: "미역국을 먹지 않게 열심히 공부하세요.", en: "Study hard so you do not fail." },
      { ko: "생일에는 미역국을 먹어요.", en: "We eat seaweed soup on birthdays.", note: "The literal sense, and a birthday tradition." }
    ],
    "노트|noun": [
      { ko: "노트에 적어 두세요.", en: "Note it down." },
      { ko: "노트를 가져왔어요?", en: "Did you bring a notebook?" },
      { ko: "수업 노트를 빌려주세요.", en: "Lend me your class notes." }
    ],
    "감사하다|verb": [
      { ko: "도와주셔서 감사합니다.", en: "Thank you for helping." },
      { ko: "초대해 주셔서 감사해요.", en: "Thank you for the invitation." },
      { ko: "늘 감사하고 있어요.", en: "I am always grateful." }
    ],
    "만치|particle": [
      { ko: "이만치 주세요.", en: "About this much, please.", note: "만치 is a variant of 만큼, and sounds a touch old-fashioned." },
      { ko: "노력한 만치 결과가 나와요.", en: "You get out as much as you put in." },
      { ko: "생각한 만치 어렵지 않아요.", en: "It is not as hard as I thought." }
    ],
    "딸기|noun": [
      { ko: "딸기가 제철이에요.", en: "Strawberries are in season." },
      { ko: "딸기 한 상자 샀어요.", en: "I bought a box of strawberries." },
      { ko: "딸기 우유를 좋아해요.", en: "I like strawberry milk." }
    ],

    // ================================================================ day 26
    "고프다|adjective": [
      { ko: "배가 고파요.", en: "I am hungry.", note: "고프다 only ever goes with 배. It is ㅡ-irregular: 고파요." },
      { ko: "배가 고프면 먼저 드세요.", en: "If you are hungry, start without me." },
      { ko: "배고픈 것보다 목마른 게 더 힘들어요.", en: "Thirst is harder to bear than hunger." }
    ],
    "초콜릿|noun": [
      { ko: "초콜릿을 좋아해요.", en: "I like chocolate." },
      { ko: "초콜릿을 선물했어요.", en: "I gave chocolate as a gift." },
      { ko: "초콜릿이 너무 달아요.", en: "The chocolate is too sweet." }
    ],
    "접시|counter": [
      { ko: "한 접시 더 주세요.", en: "One more plate, please.", note: "접시 is the plate itself and the counter for platefuls." },
      { ko: "만두 두 접시 시켰어요.", en: "We ordered two plates of dumplings." },
      { ko: "접시를 치워 주세요.", en: "Could you clear the plates?" }
    ],
    "얘|interjection": [
      { ko: "얘, 이리 와.", en: "Hey, come here.", note: "얘 is for children and close friends only — to anyone else it is rude." },
      { ko: "얘, 그거 뭐야?", en: "Hey, what is that?" },
      { ko: "얘들아, 모여!", en: "Everyone, gather round!", note: "얘들아 is how you call a group of children or friends." }
    ],
    "피자|noun": [
      { ko: "피자 한 판 시킬까요?", en: "Shall we order a pizza?", note: "판 counts whole pizzas." },
      { ko: "피자가 식었어요.", en: "The pizza has gone cold." },
      { ko: "피자보다 치킨이 좋아요.", en: "I prefer chicken to pizza." }
    ],
    "그렇군요|phrase": [
      { ko: "아, 그렇군요.", en: "Ah, I see.", casual: "아, 그렇구나.", note: "-군요 marks something you have just learned and accepted." },
      { ko: "그렇군요, 몰랐어요.", en: "I see — I had no idea." },
      { ko: "그렇군요. 알려 주셔서 감사합니다.", en: "I see. Thank you for letting me know." }
    ],
    "춤추다|verb": [
      { ko: "같이 춤출까요?", en: "Shall we dance?", note: "춤추다 is 춤을 추다 written as one word." },
      { ko: "밤새 춤췄어요.", en: "We danced all night." },
      { ko: "춤추는 걸 좋아해요.", en: "I like dancing." }
    ],
    "노란색|noun": [
      { ko: "노란색이 있어요?", en: "Do you have it in yellow?", note: "노랗다 is the adjective: 노란 옷." },
      { ko: "노란색 우산을 샀어요.", en: "I bought a yellow umbrella." },
      { ko: "은행잎이 노란색으로 변했어요.", en: "The ginkgo leaves have turned yellow." }
    ],
    "바가지를 쓰다|expression": [
      { ko: "바가지를 썼어요.", en: "I got ripped off.", note: "Literally 'wearing a gourd bowl' — being charged well over the odds." },
      { ko: "관광지에서 바가지를 쓰지 마세요.", en: "Do not let them overcharge you at tourist spots." },
      { ko: "바가지 아니에요?", en: "Is that not a rip-off?" }
    ],
    "영|numeral": [
      { ko: "영 도예요.", en: "It is zero degrees.", note: "영 is the Sino-Korean zero; phone numbers use 공 instead." },
      { ko: "점수가 영 점이에요.", en: "The score is zero." },
      { ko: "영하 십 도예요.", en: "It is minus ten degrees.", note: "영하 is 'below zero'." }
    ],
    "달러|noun": [
      { ko: "달러로 바꿔 주세요.", en: "Please change it into dollars." },
      { ko: "달러가 올랐어요.", en: "The dollar has risen." },
      { ko: "달러로 낼 수 있어요?", en: "Can I pay in dollars?" }
    ],
    "무렵|dependent noun": [
      { ko: "해가 질 무렵에 도착했어요.", en: "We arrived around sunset.", note: "무렵 follows a modifier and means 'around the time of'." },
      { ko: "그 무렵에는 바빴어요.", en: "I was busy around that time." },
      { ko: "봄이 올 무렵이에요.", en: "It is around the time spring arrives." }
    ],
    "칫솔|noun": [
      { ko: "칫솔을 바꿨어요.", en: "I changed my toothbrush." },
      { ko: "칫솔과 치약을 챙기세요.", en: "Pack a toothbrush and toothpaste." },
      { ko: "새 칫솔 하나 주세요.", en: "One new toothbrush, please." }
    ],
    "본|determiner": [
      { ko: "본 상품은 교환이 안 됩니다.", en: "This item cannot be exchanged.", note: "본 is a formal 'this, the present', at home in notices and contracts." },
      { ko: "본 회의는 두 시에 시작합니다.", en: "This meeting begins at two." },
      { ko: "본 사항을 확인해 주세요.", en: "Please check the present item." }
    ],
    "초대하다|verb": [
      { ko: "집으로 초대하고 싶어요.", en: "I would like to invite you to my home." },
      { ko: "친구를 파티에 초대했어요.", en: "I invited a friend to the party." },
      { ko: "초대해 주셔서 감사합니다.", en: "Thank you for inviting me." }
    ],
    "포도|noun": [
      { ko: "포도가 달아요.", en: "The grapes are sweet." },
      { ko: "포도 한 송이 주세요.", en: "One bunch of grapes, please.", note: "송이 counts bunches on a stem." },
      { ko: "포도 주스를 좋아해요.", en: "I like grape juice." }
    ],
    "잠깐|adverb": [
      { ko: "잠깐 기다려 주세요.", en: "Please wait a moment." },
      { ko: "잠깐 쉬었다 갈까요?", en: "Shall we rest a moment?" },
      { ko: "잠깐 들렀어요.", en: "I just dropped in for a second." }
    ],
    "아무것|pronoun": [
      { ko: "아무것도 없어요.", en: "There is nothing at all.", note: "아무것도 always takes a negative behind it." },
      { ko: "아무것도 안 먹었어요.", en: "I have not eaten a thing." },
      { ko: "아무거나 괜찮아요.", en: "Anything is fine.", note: "With 나 instead, it turns positive: anything at all." }
    ],
    "공중전화|noun": [
      { ko: "공중전화가 어디에 있어요?", en: "Where is there a payphone?" },
      { ko: "요즘은 공중전화가 별로 없어요.", en: "There are not many payphones these days." },
      { ko: "공중전화로 전화했어요.", en: "I called from a payphone." }
    ],
    "배고프다|adjective": [
      { ko: "배고파요.", en: "I am hungry.", casual: "배고파.", note: "배가 고프다 written as one word." },
      { ko: "배고파서 아무거나 먹었어요.", en: "I was hungry, so I ate whatever there was." },
      { ko: "배고프면 말하세요.", en: "Say so if you get hungry." }
    ],
    "국수를 먹다|expression": [
      { ko: "언제 국수 먹여 줄 거예요?", en: "When are you getting married?", note: "Noodles were served at weddings, so 'when will you feed me noodles' asks when the wedding is." },
      { ko: "친구 국수 먹으러 가요.", en: "I am going to a friend's wedding." },
      { ko: "올해는 국수를 먹을 수 있을까요?", en: "Will there be a wedding this year, I wonder?" }
    ],
    "인들|particle": [
      { ko: "누구인들 그걸 모르겠어요?", en: "Who would not know that?", note: "인들 concedes a case and then dismisses it, always with a rhetorical question." },
      { ko: "아이인들 그 정도는 알아요.", en: "Even a child knows that much." },
      { ko: "부모인들 어쩔 수 없어요.", en: "Even a parent could do nothing." }
    ],
    "샤워|noun": [
      { ko: "샤워하고 나갈게요.", en: "I will shower and head out." },
      { ko: "아침마다 샤워해요.", en: "I shower every morning." },
      { ko: "샤워실이 어디예요?", en: "Where is the shower room?" }
    ],
    "연습하다|verb": [
      { ko: "발음을 연습하고 있어요.", en: "I am practising pronunciation." },
      { ko: "매일 연습해야 늘어요.", en: "You only improve by practising daily." },
      { ko: "같이 연습할까요?", en: "Shall we practise together?" }
    ],
    "세탁기|noun": [
      { ko: "세탁기를 돌렸어요.", en: "I put a wash on.", note: "세탁기를 돌리다 is the fixed pairing — the machine is 'turned'." },
      { ko: "세탁기가 고장 났어요.", en: "The washing machine is broken." },
      { ko: "세탁기에 넣어 주세요.", en: "Put it in the washing machine." }
    ],
    "남동생|noun": [
      { ko: "남동생이 한 명 있어요.", en: "I have one younger brother." },
      { ko: "남동생이 군대에 갔어요.", en: "My younger brother went into the army." },
      { ko: "남동생하고 자주 싸워요.", en: "I often argue with my younger brother." }
    ],
    "도착|noun": [
      { ko: "도착 시간이 몇 시예요?", en: "What is the arrival time?" },
      { ko: "도착하면 연락 주세요.", en: "Let me know when you arrive." },
      { ko: "비행기 도착이 늦어졌어요.", en: "The plane's arrival was delayed." }
    ],
    "쇼핑|noun": [
      { ko: "쇼핑하러 갈까요?", en: "Shall we go shopping?" },
      { ko: "쇼핑을 좋아해요.", en: "I like shopping." },
      { ko: "인터넷 쇼핑을 자주 해요.", en: "I often shop online." }
    ],
    "손을 떼다|expression": [
      { ko: "그 일에서 손을 뗐어요.", en: "I washed my hands of that business.", note: "Literally taking your hand off something — quitting it for good." },
      { ko: "이제 손을 떼고 싶어요.", en: "I want out of it now." },
      { ko: "손 떼세요.", en: "Stay out of it." }
    ],
    "알겠습니다|phrase": [
      { ko: "알겠습니다.", en: "Understood.", casual: "알겠어.", note: "The reply to an instruction. 알아요 would sound like a correction." },
      { ko: "네, 알겠습니다. 그렇게 하겠습니다.", en: "Yes, understood. I will do that." },
      { ko: "잘 알겠습니다.", en: "I understand perfectly." }
    ],
    "이순신|proper noun": [
      { ko: "이순신 장군은 유명한 영웅이에요.", en: "Admiral Yi Sun-sin is a famous hero." },
      { ko: "광화문에 이순신 동상이 있어요.", en: "There is a statue of Yi Sun-sin at Gwanghwamun." },
      { ko: "이순신에 대해 배웠어요.", en: "We learned about Yi Sun-sin." }
    ],
    "응급 상황|noun phrase": [
      { ko: "응급 상황이에요!", en: "It is an emergency!" },
      { ko: "응급 상황에는 119에 전화하세요.", en: "In an emergency, call 119.", note: "119 is the Korean number for fire and ambulance." },
      { ko: "응급 상황에 대비해야 해요.", en: "We should prepare for emergencies." }
    ],
    "식사하다|verb": [
      { ko: "식사하셨어요?", en: "Have you eaten?", note: "The polite twin of 밥 먹었어요?" },
      { ko: "같이 식사할까요?", en: "Shall we have a meal together?" },
      { ko: "식사하고 이야기해요.", en: "Let's eat first and talk after." }
    ],
    "반|numeral": [
      { ko: "한 시 반이에요.", en: "It is half past one." },
      { ko: "반만 주세요.", en: "Half will do." },
      { ko: "케이크를 반으로 잘랐어요.", en: "I cut the cake in half." }
    ],
    "스키|noun": [
      { ko: "스키를 탈 수 있어요?", en: "Can you ski?", note: "Skis are ridden: 스키를 타다." },
      { ko: "겨울에 스키장에 가요.", en: "I go to the ski resort in winter." },
      { ko: "스키를 배우고 싶어요.", en: "I want to learn to ski." }
    ],
    "요컨대|conjunction": [
      { ko: "요컨대 시간이 부족해요.", en: "In short, there is not enough time.", note: "Formal written Korean for summing up; speech uses 그러니까." },
      { ko: "요컨대 이것이 문제예요.", en: "In a word, this is the problem." },
      { ko: "요컨대 준비가 필요합니다.", en: "In short, preparation is needed." }
    ],
    "맵다|adjective": [
      { ko: "이거 매워요?", en: "Is this spicy?", note: "맵다 is ㅂ-irregular: 매워요." },
      { ko: "맵지 않게 해 주세요.", en: "Please make it not spicy." },
      { ko: "한국 음식이 좀 매워요.", en: "Korean food is a bit spicy." }
    ],
    "잔|dependent noun": [
      { ko: "커피 두 잔 주세요.", en: "Two coffees, please.", note: "잔 counts cups and glasses of a drink." },
      { ko: "한 잔 더 하실래요?", en: "Would you like another?" },
      { ko: "물 한 잔만 주세요.", en: "Just a glass of water, please." }
    ],
    "운동화|noun": [
      { ko: "운동화를 신었어요.", en: "I am wearing trainers." },
      { ko: "운동화 한 켤레를 샀어요.", en: "I bought a pair of trainers." },
      { ko: "운동화가 편해요.", en: "Trainers are comfortable." }
    ],
    "초등학교|noun": [
      { ko: "초등학교에 다녀요.", en: "I go to primary school.", note: "초등학교, 중학교, 고등학교 — primary, middle, high." },
      { ko: "초등학교 때 친구예요.", en: "We were friends in primary school." },
      { ko: "아이가 초등학교에 들어갔어요.", en: "My child has started primary school." }
    ],
    "내일|adverb": [
      { ko: "내일 만나요.", en: "See you tomorrow.", note: "내일 takes no 에." },
      { ko: "내일 다시 올게요.", en: "I will come again tomorrow." },
      { ko: "내일 시간 있으세요?", en: "Are you free tomorrow?" }
    ],
    "여행하다|verb": [
      { ko: "한국을 여행하고 싶어요.", en: "I want to travel around Korea." },
      { ko: "여름에 유럽을 여행했어요.", en: "I travelled in Europe in the summer." },
      { ko: "혼자 여행해 봤어요?", en: "Have you ever travelled alone?" }
    ],
    "상|counter": [
      { ko: "상 하나를 차렸어요.", en: "I laid out a table of food.", note: "상 is the low table of dishes, and also counts awards: 상을 받다." },
      { ko: "생일상을 차려 주셨어요.", en: "They laid on a birthday spread for me." },
      { ko: "일 등 상을 받았어요.", en: "I won first prize." }
    ],
    "옳지|interjection": [
      { ko: "옳지, 바로 그거예요.", en: "That is it, exactly.", note: "The noise of approval when someone gets it right." },
      { ko: "옳지, 잘했어요.", en: "That is it — well done." },
      { ko: "옳지, 그렇게 하면 돼요.", en: "Right, that is how to do it." }
    ],
    "공휴일|noun": [
      { ko: "내일은 공휴일이에요.", en: "Tomorrow is a public holiday." },
      { ko: "공휴일에는 은행이 문을 닫아요.", en: "Banks close on public holidays." },
      { ko: "올해 공휴일이 며칠이에요?", en: "How many public holidays are there this year?" }
    ],
    "이란|particle": [
      { ko: "사랑이란 무엇일까요?", en: "What is love, I wonder?", note: "이란 after a consonant, 란 after a vowel — it names a topic for definition." },
      { ko: "행복이란 작은 것에서 와요.", en: "Happiness comes from small things." },
      { ko: "친구란 그런 거예요.", en: "That is what a friend is." }
    ],
    "어깨가 무겁다|expression": [
      { ko: "어깨가 무거워요.", en: "It is a heavy responsibility.", note: "Literally 'heavy shoulders' — the weight of what is expected of you." },
      { ko: "큰 일을 맡아서 어깨가 무거워요.", en: "I have been given a big job, and the weight of it sits on me." },
      { ko: "어깨가 무겁지만 열심히 하겠습니다.", en: "It is a weighty task, but I will do my best." }
    ],
    "볼펜|noun": [
      { ko: "볼펜으로 쓰세요.", en: "Write it in pen." },
      { ko: "볼펜 한 자루만 빌려주세요.", en: "Lend me a pen, would you?" },
      { ko: "볼펜이 안 나와요.", en: "The pen has run out." }
    ],
    "갖은|determiner": [
      { ko: "갖은 노력을 다했어요.", en: "I made every effort there was.", note: "갖은 goes straight in front of a noun, and is a shade more literary than 온갖." },
      { ko: "갖은 고생을 했어요.", en: "I went through every hardship." },
      { ko: "갖은 방법을 써 봤어요.", en: "I tried every method going." }
    ],
    "빨간색|noun": [
      { ko: "빨간색이 있어요?", en: "Do you have it in red?", note: "빨갛다 is the adjective: 빨간 옷." },
      { ko: "빨간색 옷을 입었어요.", en: "I wore red." },
      { ko: "빨간색 신호에는 서세요.", en: "Stop at the red light." }
    ],

    // ================================================================ day 27
    "서로|pronoun": [
      { ko: "서로를 이해해야 해요.", en: "We have to understand each other.", note: "As a pronoun 서로 can take particles: 서로를, 서로에게." },
      { ko: "서로에게 도움이 됐어요.", en: "It helped us both." },
      { ko: "서로의 생각을 존중해요.", en: "We respect each other's views." }
    ],
    "잡수시다|verb": [
      { ko: "많이 잡수세요.", en: "Please help yourself.", note: "잡수시다 is a strong honorific of 먹다, used to much older people. 드시다 is the everyday one." },
      { ko: "할아버지께서 잡수시고 계세요.", en: "Grandfather is eating." },
      { ko: "천천히 잡수세요.", en: "Do eat slowly." }
    ],
    "청바지|noun": [
      { ko: "청바지를 입었어요.", en: "I am wearing jeans." },
      { ko: "청바지가 잘 어울려요.", en: "Jeans suit you." },
      { ko: "새 청바지를 샀어요.", en: "I bought new jeans." }
    ],
    "핸드폰|noun": [
      { ko: "핸드폰을 잃어버렸어요.", en: "I have lost my phone.", note: "핸드폰, 휴대폰 and 폰 are all used; 핸드폰 is the most common in speech." },
      { ko: "핸드폰 번호를 알려 주세요.", en: "Please give me your mobile number." },
      { ko: "수업 중에는 핸드폰을 꺼 주세요.", en: "Please switch phones off during class." }
    ],
    "배부르다|adjective": [
      { ko: "배불러요.", en: "I am full.", casual: "배불러.", note: "부르다 is 르-irregular: 불러요." },
      { ko: "배불러서 더 못 먹겠어요.", en: "I am too full to eat any more." },
      { ko: "배부르게 먹었어요.", en: "I ate my fill." }
    ],
    "코가 높다|expression": [
      { ko: "그 사람은 코가 높아요.", en: "They are full of themselves.", note: "Literally 'a high nose' — proud or stuck up. 콧대가 높다 is the same idea." },
      { ko: "코가 높아서 인사도 안 해요.", en: "They are too proud even to say hello." },
      { ko: "코가 높은 사람은 별로예요.", en: "I do not care for arrogant people." }
    ],
    "휴지통|noun": [
      { ko: "휴지통이 어디에 있어요?", en: "Where is the bin?" },
      { ko: "휴지통에 버리세요.", en: "Put it in the bin." },
      { ko: "휴지통이 가득 찼어요.", en: "The bin is full." }
    ],
    "모르겠습니다|phrase": [
      { ko: "잘 모르겠습니다.", en: "I am not sure.", casual: "잘 모르겠어.", note: "-겠- makes it a guess rather than a flat statement, which softens it." },
      { ko: "죄송하지만 모르겠습니다.", en: "I am sorry, but I do not know." },
      { ko: "왜 그런지 모르겠습니다.", en: "I do not know why that is." }
    ],
    "질문하다|verb": [
      { ko: "질문해도 돼요?", en: "May I ask a question?" },
      { ko: "선생님께 질문했어요.", en: "I asked the teacher a question." },
      { ko: "질문할 게 있으면 하세요.", en: "Ask if you have any questions." }
    ],
    "칠판|noun": [
      { ko: "칠판을 보세요.", en: "Look at the board." },
      { ko: "칠판에 이름을 썼어요.", en: "I wrote my name on the board." },
      { ko: "칠판을 지워 주세요.", en: "Please wipe the board." }
    ],
    "몇몇|numeral": [
      { ko: "몇몇 사람은 안 왔어요.", en: "A few people did not come.", note: "몇몇 is 'some, a few' and sits in front of a noun." },
      { ko: "몇몇은 반대했어요.", en: "Some were against it." },
      { ko: "몇몇 문제가 남아 있어요.", en: "A few problems remain." }
    ],
    "님|dependent noun": [
      { ko: "선생님, 질문 있어요.", en: "Teacher, I have a question.", note: "님 is the honorific suffix on titles: 선생님, 사장님, 손님." },
      { ko: "고객님, 이쪽으로 오세요.", en: "This way please, sir." },
      { ko: "김민수 님께 전해 주세요.", en: "Please pass it to Mr Kim Minsu.", note: "Spaced after a full name, it is the polite form used on documents." }
    ],
    "먹다|auxiliary verb": [
      { ko: "겁먹지 마세요.", en: "Do not be scared.", note: "-어 먹다 turns some verbs into something done to yourself: 겁먹다, 잊어먹다. Casual." },
      { ko: "또 잊어먹었어요.", en: "I forgot again." },
      { ko: "마음먹은 대로 하세요.", en: "Do as you have set your mind on.", note: "마음먹다 is to make up your mind." }
    ],
    "크리스마스|noun": [
      { ko: "메리 크리스마스!", en: "Merry Christmas!" },
      { ko: "크리스마스에 뭐 할 거예요?", en: "What are you doing at Christmas?" },
      { ko: "크리스마스는 공휴일이에요.", en: "Christmas is a public holiday." }
    ],
    "안녕히|adverb": [
      { ko: "안녕히 가세요.", en: "Goodbye. (to the person leaving)", note: "안녕히 only appears in these set farewells." },
      { ko: "안녕히 계세요.", en: "Goodbye. (to the person staying)" },
      { ko: "안녕히 주무세요.", en: "Good night." }
    ],
    "목요일|noun": [
      { ko: "목요일에 만나요.", en: "Let's meet on Thursday." },
      { ko: "목요일까지 끝내야 해요.", en: "It has to be done by Thursday." },
      { ko: "다음 목요일이 휴일이에요.", en: "Next Thursday is a holiday." }
    ],
    "야|particle": [
      { ko: "민수야, 이리 와.", en: "Minsu, come here.", note: "야 after a vowel, 아 after a consonant — the casual vocative, for friends and juniors only." },
      { ko: "지수야, 밥 먹자.", en: "Jisu, let's eat." },
      { ko: "얘들아, 조용히 해.", en: "Quiet, everyone." }
    ],
    "지우개|noun": [
      { ko: "지우개 좀 빌려주세요.", en: "Could you lend me a rubber?" },
      { ko: "지우개로 지웠어요.", en: "I rubbed it out." },
      { ko: "지우개가 어디 갔지요?", en: "Where has the rubber gone?" }
    ],
    "운전하다|verb": [
      { ko: "운전할 수 있어요?", en: "Can you drive?" },
      { ko: "조심해서 운전하세요.", en: "Drive carefully." },
      { ko: "술을 마시고 운전하면 안 돼요.", en: "You must not drink and drive." }
    ],
    "간이 크다|expression": [
      { ko: "간이 크시네요.", en: "You are a brave one.", note: "Literally 'a big liver' — the liver, not the heart, is where Korean puts courage." },
      { ko: "간이 커서 무서운 게 없어요.", en: "They are fearless — nothing frightens them." },
      { ko: "저는 간이 작아요.", en: "I am the timid sort." }
    ],
    "수영장|noun": [
      { ko: "수영장에 가요.", en: "I am going to the pool." },
      { ko: "호텔에 수영장이 있어요?", en: "Does the hotel have a pool?" },
      { ko: "수영장에서 두 시간 놀았어요.", en: "We spent two hours at the pool." }
    ],
    "짜다|adjective": [
      { ko: "좀 짜요.", en: "It is a bit salty." },
      { ko: "짜지 않게 해 주세요.", en: "Please do not make it too salty." },
      { ko: "국이 너무 짜요.", en: "The soup is far too salty." }
    ],
    "일본어|noun": [
      { ko: "일본어를 배우고 있어요.", en: "I am learning Japanese." },
      { ko: "일본어를 할 수 있어요?", en: "Can you speak Japanese?" },
      { ko: "일본어가 한국어와 비슷해요.", en: "Japanese is similar to Korean." }
    ],
    "갈비|noun": [
      { ko: "갈비를 먹으러 갈까요?", en: "Shall we go for galbi?" },
      { ko: "갈비 이 인분 주세요.", en: "Two portions of galbi, please." },
      { ko: "갈비탕이 맛있어요.", en: "The short rib soup is good." }
    ],
    "추석|proper noun": [
      { ko: "추석에 고향에 가요.", en: "I go home for Chuseok.", note: "Chuseok is the autumn harvest festival, and the biggest holiday of the Korean year." },
      { ko: "추석에는 송편을 먹어요.", en: "We eat songpyeon at Chuseok." },
      { ko: "추석 연휴가 길어요.", en: "The Chuseok holiday is long." }
    ],
    "안전 사고|noun phrase": [
      { ko: "안전 사고가 났어요.", en: "There has been a safety accident." },
      { ko: "안전 사고를 예방해야 해요.", en: "Safety accidents must be prevented." },
      { ko: "안전 사고에 주의하세요.", en: "Watch out for safety hazards." }
    ],
    "선물하다|verb": [
      { ko: "친구에게 책을 선물했어요.", en: "I gave a book to a friend as a present." },
      { ko: "뭘 선물할까요?", en: "What shall we give as a gift?" },
      { ko: "꽃을 선물했어요.", en: "I gave flowers." }
    ],
    "이처럼|conjunction": [
      { ko: "이처럼 간단해요.", en: "It is as simple as this.", note: "이처럼 refers back to what you have just shown or said — written Korean." },
      { ko: "이처럼 좋은 기회는 없어요.", en: "There is no opportunity like this one." },
      { ko: "이처럼 하면 됩니다.", en: "Do it in this way and it will work." }
    ],
    "장미|noun": [
      { ko: "장미 한 송이 주세요.", en: "One rose, please." },
      { ko: "장미가 예쁘게 폈어요.", en: "The roses have come out beautifully." },
      { ko: "빨간 장미를 선물했어요.", en: "I gave red roses." }
    ],
    "토막|counter": [
      { ko: "생선 두 토막 주세요.", en: "Two pieces of fish, please.", note: "토막 counts chunks cut from something long: fish, radish, wood." },
      { ko: "무를 세 토막으로 잘랐어요.", en: "I cut the radish into three pieces." },
      { ko: "이야기 한 토막을 들었어요.", en: "I heard a snippet of the story." }
    ],
    "어이|interjection": [
      { ko: "어이, 잠깐만!", en: "Hey, hold on!", note: "Casual and a touch rough — calling out to a friend or a stranger you are not being polite to." },
      { ko: "어이, 거기 누구야?", en: "Hey, who is there?" },
      { ko: "어이가 없어요.", en: "I am speechless.", note: "어이없다 is a separate word: dumbfounded by something absurd." }
    ],
    "낯이 익다|expression": [
      { ko: "낯이 익은데요?", en: "You look familiar.", note: "Literally 'the face is worn in' — you have seen it before but cannot place it." },
      { ko: "이 장소가 낯이 익어요.", en: "This place looks familiar." },
      { ko: "어디서 봤는지 낯이 익어요.", en: "Your face rings a bell from somewhere." }
    ],
    "파란색|noun": [
      { ko: "파란색을 좋아해요.", en: "I like blue.", note: "파랗다 is the adjective: 파란 하늘." },
      { ko: "파란색 셔츠를 입었어요.", en: "I am wearing a blue shirt." },
      { ko: "하늘이 파란색이에요.", en: "The sky is blue." }
    ],
    "딴|determiner": [
      { ko: "딴 사람 같아요.", en: "You seem like a different person.", note: "딴 is a casual 다른, and goes straight in front of a noun." },
      { ko: "딴생각 하지 마세요.", en: "Do not let your mind wander.", note: "딴생각 is written as one word." },
      { ko: "딴 데 가고 싶어요.", en: "I want to go somewhere else." }
    ],
    "남|pronoun": [
      { ko: "남의 물건을 만지지 마세요.", en: "Do not touch other people's things." },
      { ko: "남 얘기를 하지 마세요.", en: "Do not talk about other people." },
      { ko: "남이 뭐라고 해도 신경 쓰지 마세요.", en: "Never mind what others say." }
    ],
    "냉면|noun": [
      { ko: "여름에는 냉면이 최고예요.", en: "Nothing beats naengmyeon in summer." },
      { ko: "냉면 두 그릇 주세요.", en: "Two bowls of cold noodles, please." },
      { ko: "물냉면과 비빔냉면이 있어요.", en: "There is the broth kind and the spicy mixed kind." }
    ],
    "이해했어요|phrase": [
      { ko: "이해했어요.", en: "I have understood.", casual: "이해했어.", note: "For grasping an explanation; 알겠어요 is the reply to an instruction." },
      { ko: "이제 이해했어요. 감사합니다.", en: "I understand now. Thank you." },
      { ko: "다 이해했어요?", en: "Did you follow all of it?" }
    ],
    "요리하다|verb": [
      { ko: "요리할 수 있어요?", en: "Can you cook?" },
      { ko: "오늘은 제가 요리할게요.", en: "I will cook today." },
      { ko: "요리하는 걸 좋아해요.", en: "I like cooking." }
    ],
    "여럿|numeral": [
      { ko: "여럿이 함께 갔어요.", en: "Several of us went together.", note: "여럿 stands alone as a noun; 여러 must sit in front of another noun." },
      { ko: "여럿 중에 하나를 골랐어요.", en: "I chose one out of several." },
      { ko: "여럿이 모이면 즐거워요.", en: "It is fun when a group gets together." }
    ],
    "나위|dependent noun": [
      { ko: "말할 나위도 없어요.", en: "It goes without saying.", note: "나위 means room or need for, and lives almost entirely in -(으)ㄹ 나위(가) 없다." },
      { ko: "더할 나위 없이 좋아요.", en: "It could not be better." },
      { ko: "의심할 나위가 없어요.", en: "There is no room for doubt." }
    ],
    "비빔밥|noun": [
      { ko: "비빔밥 하나 주세요.", en: "One bibimbap, please." },
      { ko: "비빔밥을 잘 비벼서 드세요.", en: "Mix the bibimbap well before eating." },
      { ko: "전주 비빔밥이 유명해요.", en: "Jeonju bibimbap is famous." }
    ],
    "똑바로|adverb": [
      { ko: "똑바로 가세요.", en: "Go straight ahead." },
      { ko: "똑바로 앉으세요.", en: "Sit up straight." },
      { ko: "똑바로 말씀해 주세요.", en: "Tell me straight." }
    ],
    "아|particle": [
      { ko: "민수야, 어디 가?", en: "Minsu, where are you going?", note: "아 after a consonant, 야 after a vowel — the casual vocative: 지훈아, 민수야." },
      { ko: "지훈아, 밥 먹었어?", en: "Jihun, have you eaten?" },
      { ko: "영민아, 이것 좀 봐.", en: "Yeongmin, take a look at this." }
    ],
    "화요일|noun": [
      { ko: "화요일에 시간 있어요?", en: "Are you free on Tuesday?" },
      { ko: "화요일마다 수업이 있어요.", en: "I have a class every Tuesday." },
      { ko: "다음 화요일에 만나요.", en: "Let's meet next Tuesday." }
    ],
    "맛없다|adjective": [
      { ko: "맛없어요.", en: "It does not taste good.", note: "Written as one word, like 맛있다. Pronounced 마덥따." },
      { ko: "맛없으면 남기세요.", en: "If you do not like it, leave it." },
      { ko: "이 식당은 맛없어요.", en: "The food at this restaurant is poor." }
    ],
    "아이스크림|noun": [
      { ko: "아이스크림 하나 주세요.", en: "One ice cream, please." },
      { ko: "더워서 아이스크림을 먹었어요.", en: "It was hot, so I had an ice cream." },
      { ko: "무슨 맛 아이스크림을 좋아해요?", en: "What flavour ice cream do you like?" }
    ],
    "속이 타다|expression": [
      { ko: "속이 타요.", en: "I am worried sick.", note: "Literally 'the insides are burning' — anxious waiting rather than sadness." },
      { ko: "연락이 없어서 속이 탔어요.", en: "I heard nothing, and it was eating me up." },
      { ko: "속이 타서 잠도 못 잤어요.", en: "I was so worried I could not sleep." }
    ],
    "실례하다|verb": [
      { ko: "실례하겠습니다.", en: "Excuse me.", note: "Said before interrupting, leaving early, or squeezing past." },
      { ko: "잠깐 실례할게요.", en: "Excuse me for a moment." },
      { ko: "먼저 실례하겠습니다.", en: "Please excuse me for leaving first." }
    ],
    "중국어|noun": [
      { ko: "중국어를 배우고 있어요.", en: "I am learning Chinese." },
      { ko: "중국어가 어려워요.", en: "Chinese is difficult." },
      { ko: "중국어도 할 수 있어요?", en: "Can you speak Chinese as well?" }
    ],
    "사탕|noun": [
      { ko: "사탕 하나 드릴까요?", en: "Would you like a sweet?" },
      { ko: "아이들이 사탕을 좋아해요.", en: "Children love sweets." },
      { ko: "사탕을 너무 많이 먹지 마세요.", en: "Do not eat too many sweets." }
    ]
  };

  return { BY_WORD: BY_WORD };
});
