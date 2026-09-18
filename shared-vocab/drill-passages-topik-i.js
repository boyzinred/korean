/*
  drill-passages-topik-i.js
  ----------------------------------------------------------------------------
  One very short passage per study day of the TOPIK I word bank.

  The word bank is a list, and a list cannot be put in order, read for its
  meaning, or continued with the sentence that comes next. Those questions need
  connected prose, so each of the 27 study days gets five sentences of it,
  written out of that day's own batch of words and the days before it.

  They are deliberately plain: 해요체 throughout, one idea per sentence, no
  clause the bank has not already taught. That is what makes them usable as
  puzzle material — a learner who can read the day's words can read the
  passage, and any sentence of it can be cut into pieces or hidden behind a
  blank without becoming a guessing game.

  Read by tutoring-topik-i-word-bank.html and handed to drill-exercise.js as
  its units, where the day number is what the "which days to include" picker
  ticks.

  Browser: script src -> window.TopikIDrillPassages
*/
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TopikIDrillPassages = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const PASSAGES = [
    { day: 1, titleKo: "자기소개",
      lines: [
        "안녕하세요. 제 이름은 민수예요.",
        "저는 한국 사람이에요.",
        "우리 집은 학교 앞에 있어요.",
        "저는 매일 학교에 가요.",
        "학교에서 친구를 만나요."
      ] },
    { day: 2, titleKo: "우리 학교",
      lines: [
        "우리 학교는 서울에 있어요.",
        "학교 앞에 큰 나무가 있어요.",
        "저는 친구하고 같이 학교에 가요.",
        "우리는 아침마다 버스를 타요.",
        "학교 생활은 아주 재미있어요."
      ] },
    { day: 3, titleKo: "시장에서",
      lines: [
        "저는 어머니하고 시장에 가요.",
        "시장에는 사람이 아주 많아요.",
        "우리는 거기에서 과일을 사요.",
        "오늘은 사과 세 개를 샀어요.",
        "집에 와서 같이 먹었어요."
      ] },
    { day: 4, titleKo: "아침 시간",
      lines: [
        "저는 아침 일곱 시에 일어나요.",
        "얼굴을 씻고 밥을 먹어요.",
        "그리고 가방을 가지고 학교에 가요.",
        "오늘은 조금 늦었어요.",
        "그래서 아주 빨리 걸었어요."
      ] },
    { day: 5, titleKo: "우리 가족",
      lines: [
        "우리 가족은 네 명이에요.",
        "아버지, 어머니, 언니, 그리고 저예요.",
        "아버지는 회사에 다녀요.",
        "어머니는 음식을 아주 잘 만들어요.",
        "주말에는 가족이 함께 공원에 가요."
      ] },
    { day: 6, titleKo: "공원에서",
      lines: [
        "우리 집 옆에 큰 공원이 있어요.",
        "공원에는 나무와 꽃이 많아요.",
        "저는 거기에서 노래를 들어요.",
        "가끔 친구하고 같이 걸어요.",
        "바람이 불면 아주 좋아요."
      ] },
    { day: 7, titleKo: "은행에 가요",
      lines: [
        "오후에 은행에 가요.",
        "은행은 큰 건물 옆에 있어요.",
        "사람이 많아서 조금 기다렸어요.",
        "저는 돈을 조금 찾았어요.",
        "그리고 집으로 돌아왔어요."
      ] },
    { day: 8, titleKo: "병원에서",
      lines: [
        "어제부터 머리가 아팠어요.",
        "그래서 오늘 병원에 갔어요.",
        "의사 선생님이 제 이야기를 들었어요.",
        "저는 약을 먹고 푹 쉬었어요.",
        "지금은 조금 괜찮아요."
      ] },
    { day: 9, titleKo: "한국의 여름",
      lines: [
        "한국의 여름은 아주 더워요.",
        "그리고 비도 자주 와요.",
        "저는 여름에 수박을 많이 먹어요.",
        "친구하고 바다에 가고 싶어요.",
        "올해 여름은 정말 길었어요."
      ] },
    { day: 10, titleKo: "주말",
      lines: [
        "주말에는 조금 늦게 일어나요.",
        "아침을 먹고 텔레비전을 봐요.",
        "오후에는 친구하고 게임을 해요.",
        "저녁에는 가족하고 같이 식사해요.",
        "주말은 언제나 빨리 끝나요."
      ] },
    { day: 11, titleKo: "여행",
      lines: [
        "지난주에 여행을 갔어요.",
        "기차를 타고 네 시간쯤 갔어요.",
        "바다가 아주 넓고 예뻤어요.",
        "저는 사진도 많이 찍었어요.",
        "나중에 가족하고 다시 가고 싶어요."
      ] },
    { day: 12, titleKo: "우리 누나",
      lines: [
        "우리 누나는 대학생이에요.",
        "누나는 영어를 아주 잘해요.",
        "매일 아침 일찍 학교에 가요.",
        "저녁에는 저하고 이야기해요.",
        "저는 누나가 정말 좋아요."
      ] },
    { day: 13, titleKo: "오늘 날씨",
      lines: [
        "오늘은 날씨가 나빠요.",
        "아침부터 비가 왔어요.",
        "그래서 우산을 가지고 나갔어요.",
        "오후에는 바람도 많이 불었어요.",
        "내일은 날씨가 좋으면 좋겠어요."
      ] },
    { day: 14, titleKo: "동생의 생일",
      lines: [
        "오늘은 제 동생의 생일이에요.",
        "어머니가 떡과 과일을 준비했어요.",
        "친구들도 우리 집에 왔어요.",
        "우리는 같이 노래를 불렀어요.",
        "동생이 아주 즐거워했어요."
      ] },
    { day: 15, titleKo: "숙제",
      lines: [
        "오늘은 숙제가 아주 많아요.",
        "저는 방에서 책상 앞에 앉았어요.",
        "한 시간 동안 열심히 공부했어요.",
        "어려운 문제는 형에게 물어봤어요.",
        "숙제를 끝내고 조금 쉬었어요."
      ] },
    { day: 16, titleKo: "도서관",
      lines: [
        "토요일에 도서관에 갔어요.",
        "도서관 안은 아주 조용해요.",
        "저는 잡지를 한 권 읽었어요.",
        "친구는 제 옆에서 공부했어요.",
        "우리는 세 시간 동안 거기에 있었어요."
      ] },
    { day: 17, titleKo: "사진 찍기",
      lines: [
        "저는 사진 찍는 것을 좋아해요.",
        "주말마다 카메라를 가지고 나가요.",
        "어제는 백화점 앞에서 사진을 찍었어요.",
        "하늘이 아주 밝았어요.",
        "그 사진을 친구에게 보냈어요."
      ] },
    { day: 18, titleKo: "김치",
      lines: [
        "저는 김치를 아주 좋아해요.",
        "김치는 조금 맵지만 맛있어요.",
        "어머니가 집에서 김치를 만들어요.",
        "저도 어제 옆에서 도왔어요.",
        "오늘 점심에 같이 먹었어요."
      ] },
    { day: 19, titleKo: "공항에서",
      lines: [
        "오늘 친구가 한국에 왔어요.",
        "저는 아침 일찍 공항에 갔어요.",
        "공항에는 사람이 아주 많았어요.",
        "친구를 만나서 정말 반가웠어요.",
        "우리는 택시를 타고 집에 왔어요."
      ] },
    { day: 20, titleKo: "한국어 공부",
      lines: [
        "저는 한국어를 배워요.",
        "한국어는 조금 어렵지만 재미있어요.",
        "매일 새 단어를 열 개씩 외워요.",
        "교과서를 읽고 문장도 써요.",
        "나중에 한국 친구하고 이야기하고 싶어요."
      ] },
    { day: 21, titleKo: "길을 잃었어요",
      lines: [
        "어제 저는 길을 잃었어요.",
        "지도를 봤지만 잘 몰랐어요.",
        "그래서 경찰서에 갔어요.",
        "경찰관이 길을 알려 줬어요.",
        "저는 정말 고마웠어요."
      ] },
    { day: 22, titleKo: "냉장고",
      lines: [
        "우리 집 냉장고는 아주 커요.",
        "안에 과일하고 수박이 있어요.",
        "어머니가 어제 시장에서 싸게 샀어요.",
        "저는 오렌지를 하나 먹었어요.",
        "아주 달고 맛있었어요."
      ] },
    { day: 23, titleKo: "등산",
      lines: [
        "일요일에 친구하고 등산을 갔어요.",
        "산이 아주 높았어요.",
        "날씨가 더워서 물을 많이 마셨어요.",
        "위에서 본 경치가 아름다웠어요.",
        "집에 와서 아주 피곤했어요."
      ] },
    { day: 24, titleKo: "우체국",
      lines: [
        "오늘 저는 우체국에 갔어요.",
        "친구에게 편지를 보냈어요.",
        "우체국은 정류장 앞에 있어요.",
        "사람들이 아주 친절했어요.",
        "저는 걸어서 집에 왔어요."
      ] },
    { day: 25, titleKo: "약국",
      lines: [
        "어제 저는 감기에 걸렸어요.",
        "그래서 약국에 갔어요.",
        "약국에서 약을 샀어요.",
        "집에 와서 약을 먹고 잤어요.",
        "오늘 아침에는 괜찮았어요."
      ] },
    { day: 26, titleKo: "친구의 초대",
      lines: [
        "어제 친구가 저를 초대했어요.",
        "우리는 피자하고 초콜릿을 먹었어요.",
        "친구가 노래를 불렀어요.",
        "모두 아주 즐거웠어요.",
        "저는 밤 열 시에 집에 왔어요."
      ] },
    { day: 27, titleKo: "한국의 겨울",
      lines: [
        "한국의 겨울은 아주 추워요.",
        "저는 청바지하고 따뜻한 옷을 입어요.",
        "크리스마스에는 가족하고 밥을 먹어요.",
        "겨울에는 냉면보다 뜨거운 음식이 좋아요.",
        "그래도 저는 겨울을 아주 좋아해요."
      ] }
  ];

  return { PASSAGES };
});
