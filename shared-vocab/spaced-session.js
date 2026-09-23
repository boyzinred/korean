/*
  spaced-session.js
  ----------------------------------------------------------------------------
  The queue behind the spaced repetition mode in the vocabulary exercises.

  This is spacing inside one sitting, not a schedule across days. Nothing here
  is written down and nothing here expires: a run starts, every word in it is
  carried up a short ladder by getting it right, and the run ends when the last
  one is off the top. A word you miss drops a rung and comes back almost at
  once; a word you get right waits longer each time before it is asked again.
  That is the whole idea — the gap between two sightings of a word is measured
  in questions rather than in days.

  It holds no words, no English, and no HTML. A page hands over one card per
  item with the box it starts in, asks for a card, says whether the answer was
  right, and renders whatever it likes. What the box means to the page — here,
  the familiarity stars — is the page's business.

  Using it
  --------
    const session = SpacedSession.create({
      items: [{ id, item, box }],   // box: the rung it starts on
      retireAt: 3,                  // the rung that takes a card out of the run
      spread: [0.1, 0.35, 0.8],     // gap per rung, as a share of what is left
      cap: 400                      // questions after which the run stops
    });

    session.next()              -> a card, or null when the run is over
    session.grade(card, true)   -> { retired, box }
    session.stats()             -> { total, retired, live, asked, cap,
                                     climbed, needed, started, nearly }

  climbed and needed are the run measured in rungs rather than in words, which
  is the only honest way to show how far through it you are. Words retire in a
  clump near the end — every card climbs at much the same rate, so a fifty-word
  run finishes its first word around question sixty and its last ten in the
  final twenty — and a bar drawn on retirements alone sits at nothing for a
  third of the run while the work is plainly being done.

  started and nearly split the words still in the run: how many have climbed at
  all, and how many are one right answer from leaving. Between them they give a
  page something that moves on the second question rather than on the sixtieth.

  A card
  ------
    { id, item, box, due, seen, missed }

    due   the question number this card may be asked again at, which is what
          the spacing actually is
    seen  how many times it has been asked
    missed how many of those went wrong, which is what tells a page whether the
          word was carried clean

  Cards are plain objects and the page is free to hang its own fields on them.

  The stars
  ---------
  A page decides for itself what a finished card is worth, but all three pages
  that use this decide it the same way, so the two rules live here rather than
  in three copies:

    SpacedSession.stars.earned(clean, lastCleanDay, today)  -> 1, 2 or 3
    SpacedSession.stars.after(level, earned, { produced, manual })  -> the level

  What a page still owns is its own store: which word the card was, where the
  rating is kept, and when it is written.
*/
(function (global) {
  "use strict";

  function shuffle(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = out[i];
      out[i] = out[j];
      out[j] = swap;
    }
    return out;
  }

  /* The gap a card waits, one entry per rung, written as a share of the cards
     still in the run rather than as a flat number of questions.

     A flat number does not survive contact with a real pool. Fifty words are
     fifty questions apart however the ladder is written, so "come back in two"
     and "come back in eight" both come out as "come back in about fifty", and
     the ladder stops saying anything at all. A share scales with the run, and
     goes on meaning something as the run empties: with six words left, four
     fifths of six is five.

     What comes out is flatter than what goes in, because every other card is
     being pushed forward at the same time. Over a fifty-word run these shares
     land a missed word about half a lap away and a nearly-learnt one about a
     lap and a half — a ratio nearer two than the three the numbers suggest.
     The ordering is the part that matters and the ordering is right: what you
     missed comes back first, and it costs another right answer to climb back
     to where it was. */
  const DEFAULT_SPREAD = [0.1, 0.35, 0.8];
  const MIN_GAP = 2;

  function create(config) {
    const settings = config || {};
    const retireAt = Math.max(1, Number(settings.retireAt) || 3);
    const spread = (settings.spread && settings.spread.length) ? settings.spread : DEFAULT_SPREAD;
    const cards = shuffle(settings.items || []).map((entry, index) => ({
      id: entry.id,
      item: entry.item,
      /* A card never starts on the rung that would retire it unasked: a word
         the page already considers known still has to be answered once. */
      box: Math.max(0, Math.min(retireAt - 1, Number(entry.box) || 0)),
      from: Math.max(0, Math.min(retireAt - 1, Number(entry.box) || 0)),
      /* Every card starts already waiting, one question apart, rather than all
         at zero. That puts the whole run on one timeline: a word missed at
         question seven comes back at question nine, ahead of the words that
         have not been asked yet, instead of waiting for the end of a pass that
         is forty questions long. The order is shuffled first, so the queue is
         not the order the page happened to hand the words over in. */
      due: index,
      seen: 0,
      missed: 0,
      retired: false
    }));
    const cap = Math.max(1, Number(settings.cap) || cards.length * 6);

    let asked = 0;
    let last = null;

    const live = () => cards.filter(card => !card.retired);

    /* How far ahead a card is pushed. A gap is only a gap while there are other
       cards to fill it, so it is capped at what the run can actually deliver —
       with three words left, "come back in eight" is a promise the queue cannot
       keep, and pretending otherwise just asks the same word twice in a row. */
    function gapFor(box, alive) {
      const share = spread[Math.max(0, Math.min(spread.length - 1, box))];
      const wanted = Math.round(share * alive);
      return Math.max(0, Math.min(Math.max(MIN_GAP, wanted), alive - 1));
    }

    function next() {
      const alive = live();
      if (!alive.length || asked >= cap) return null;
      /* The card that has been waiting longest — which is what makes the ladder
         mean anything while a run is wide. With fifty words still live every
         card is technically due, and picking at random among them would ask a
         word you just missed no sooner than one you have nearly learnt. Taking
         the earliest due first puts the miss back in two questions and holds
         the other one for eight, which is the whole point of the gaps.

         When nothing is due yet the same rule picks the next one up, so the
         queue never stalls. Ties are common — every card starts due at zero —
         and are broken at random, so no two runs open in the same order. */
      let soonest = Infinity;
      alive.forEach(card => { if (card.due < soonest) soonest = card.due; });
      let pool = alive.filter(card => card.due === soonest);
      /* Never the same word twice running while there is anything else to ask,
         however overdue it is. */
      if (last && pool.length === 1 && pool[0] === last && alive.length > 1) {
        const rest = alive.filter(card => card !== last);
        let nextSoonest = Infinity;
        rest.forEach(card => { if (card.due < nextSoonest) nextSoonest = card.due; });
        pool = rest.filter(card => card.due === nextSoonest);
      } else if (pool.length > 1 && last) {
        const others = pool.filter(card => card !== last);
        if (others.length) pool = others;
      }
      const card = shuffle(pool)[0];
      card.seen += 1;
      asked += 1;
      last = card;
      return card;
    }

    /* Right carries a card up one rung, wrong drops it one — never below the
       bottom, and never all the way back for a word that was nearly there. */
    function grade(card, correct) {
      if (!card || card.retired) return { retired: Boolean(card && card.retired), box: card ? card.box : 0 };
      if (correct) {
        card.box += 1;
        if (card.box >= retireAt) {
          card.retired = true;
          if (last === card) last = null;
          return { retired: true, box: card.box };
        }
      } else {
        card.missed += 1;
        card.box = Math.max(0, card.box - 1);
      }
      card.due = asked + gapFor(correct ? card.box : 0, live().length);
      return { retired: false, box: card.box };
    }

    function stats() {
      const alive = live();
      let climbed = 0;
      let needed = 0;
      let started = 0;
      let nearly = 0;
      cards.forEach(card => {
        needed += retireAt - card.from;
        /* A card that slipped back below where it started has climbed nothing,
           rather than owing the run a negative amount of work. */
        climbed += Math.max(0, Math.min(retireAt, card.box) - card.from);
      });
      alive.forEach(card => {
        if (card.box >= retireAt - 1) nearly += 1;
        else if (card.box > card.from) started += 1;
      });
      return {
        total: cards.length,
        retired: cards.length - alive.length,
        live: alive.length,
        asked,
        cap,
        climbed,
        needed,
        started,
        nearly
      };
    }

    /* What a full run costs, for the menu to quote before anyone starts: the
       number of right answers still owed, with nothing going wrong. */
    function shortestRun() {
      return cards.reduce((sum, card) => sum + (retireAt - card.box), 0);
    }


    return { cards, next, grade, stats, shortestRun };
  }

  /* What a word is worth once a run is done with it. Clean on a day of its own
     is the top rung, clean for the first time — or twice in one sitting — is
     the middle one, and anything that had to be fished for is the bottom. The
     day is the only thing a run remembers about a word between sittings, and
     the only thing an evening of cramming cannot fake. */
  function starEarned(clean, lastCleanDay, stamp) {
    if (!clean) return 1;
    return lastCleanDay && lastCleanDay !== stamp ? STAR_RUNGS : 2;
  }

  /* And where that leaves the star the word already had. Three rules:

       a run may only raise a star on the strength of an answer given in the
         language being learnt, since the higher rungs are meant to mean
         production rather than recognition;
       only a miss can take a star down, and it takes it down one rung rather
         than resetting it — carrying a three-star word clean a second time in
         one evening proves less than the third star did, but it disproves
         nothing, and must not cost the word anything;
       a star set by hand is left exactly where it was put. */
  function starAfter(level, earned, options) {
    const settings = options || {};
    if (earned > level) return settings.produced ? earned : level;
    if (earned === 1 && level > 1) return settings.manual ? level : level - 1;
    return level;
  }

  const STAR_RUNGS = 3;

  global.SpacedSession = {
    create,
    stars: { earned: starEarned, after: starAfter, RUNGS: STAR_RUNGS }
  };
})(window);
