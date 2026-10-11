/* ---------------------------------------------------------------------------
   QuizPopout
   Two things for a running vocabulary test.

   Pop out. A button in the test's runtime bar pins the test's own card over
   the whole screen, and puts it back. It is the same card, not a copy, so the
   page's script keeps driving it and nothing about the run changes; no tab or
   window is opened.

     <button type="button" data-quiz-popout>⤢ Pop out</button>

   The card is the button's nearest .exercise or .quiz-card. It stays out
   through the results, and goes back by itself when the setup menu comes
   back into it or the card is hidden. Esc and the phone's back gesture put it
   back too. The page's stylesheet does the rest from .is-popout on the card,
   .popout-results while the runtime bar is gone (the results), .is-long on a
   prompt too long for the big size, and .has-quiz-popout on <html>.

   Ending early. The end button asks first:

     QuizPopout.confirmEnd(button, () => finish(...));

   shows the .end-confirm row in the button's .runtime-bar, which holds a
   [data-end-keep] and a [data-end-yes] button. Without that row it ends at
   once.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  const LABEL_OUT = "⤢ Pop out";
  const LABEL_BACK = "⤡ Back to page";
  /* A prompt longer than this is set smaller, so a long English gloss does
     not push the answer box under a phone's keyboard. */
  const LONG_PROMPT = 26;
  /* A second tap on End lands on the confirm row before a finger can lift,
     so the row ignores taps for this long after it opens. */
  const CONFIRM_GUARD_MS = 400;
  const CONFIRM_TIMEOUT_MS = 10000;

  let open = null;
  /* Set while the pop-out's own history entry is being stepped back over, so
     the popstate that follows is not taken for the back gesture. */
  let steppingBack = false;

  const cardOf = button => button.closest(".exercise, .quiz-card");
  const shown = node => Boolean(node) && node.getClientRects().length > 0;

  function labelToggles(card, out) {
    card.querySelectorAll("[data-quiz-popout]").forEach(button => {
      button.textContent = out ? LABEL_BACK : LABEL_OUT;
      button.setAttribute("aria-label", out ? "Back to the page" : "Pop the test out to fill the screen");
    });
  }

  /* The results have no runtime bar, so the card carries a second way back
     that only the stylesheet shows, while the bar is gone. It copies the look
     of the bar's own button. */
  function ensureExitBar(card, button) {
    if (card.querySelector(":scope > .popout-exit-bar")) return;
    const bar = document.createElement("div");
    bar.className = "popout-exit-bar";
    const exit = document.createElement("button");
    exit.type = "button";
    exit.className = button.className;
    exit.setAttribute("data-quiz-popout", "");
    bar.appendChild(exit);
    card.insertBefore(bar, card.firstChild);
  }

  /* The card follows the visual viewport rather than the layout one. When a
     phone's keyboard comes up, the visual viewport is what is left above it;
     a card the height of the layout viewport would have its answer box behind
     the keys. */
  function fitToViewport() {
    if (!open) return;
    const viewport = window.visualViewport;
    if (!viewport) return;
    open.card.style.setProperty("--popout-top", viewport.offsetTop + "px");
    open.card.style.setProperty("--popout-height", viewport.height + "px");
  }

  function sync() {
    if (!open) return;
    const card = open.card;
    const menu = card.querySelector(".exercise-menu");
    if (!shown(card) || shown(menu)) {
      closePopout();
      return;
    }
    const results = !shown(card.querySelector(".runtime-bar"));
    if (card.classList.contains("popout-results") !== results) card.classList.toggle("popout-results", results);
    card.querySelectorAll(".prompt").forEach(prompt => {
      const long = prompt.textContent.trim().length > LONG_PROMPT;
      if (prompt.classList.contains("is-long") !== long) prompt.classList.toggle("is-long", long);
    });
  }

  function focusTarget(card) {
    const fields = [...card.querySelectorAll(".answer-input, .hw-reveal, .sp-reveal, .hw-got")];
    return fields.find(field => shown(field) && !field.disabled) || null;
  }

  function openPopout(button) {
    const card = cardOf(button);
    if (!card || open) return;
    ensureExitBar(card, button);
    open = {
      card,
      scrollY: window.scrollY,
      observer: new MutationObserver(sync),
      pushed: false
    };
    card.classList.add("is-popout");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    const title = card.querySelector("h3");
    if (title) card.setAttribute("aria-label", title.textContent.trim());
    document.documentElement.classList.add("has-quiz-popout");
    labelToggles(card, true);
    card.scrollTop = 0;

    open.observer.observe(card, { attributes: true, attributeFilter: ["class"], childList: true, subtree: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", fitToViewport);
      window.visualViewport.addEventListener("scroll", fitToViewport);
    }
    fitToViewport();

    /* An entry in the history, so the phone's back gesture closes the pop-out
       instead of leaving the page. */
    try {
      history.pushState({ quizPopout: true }, "");
      open.pushed = true;
    } catch (_) {}

    sync();
    const target = focusTarget(card);
    (target || button).focus({ preventScroll: true });
  }

  function closePopout(options) {
    if (!open) return;
    const state = open;
    open = null;
    const card = state.card;
    state.observer.disconnect();
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", fitToViewport);
      window.visualViewport.removeEventListener("scroll", fitToViewport);
    }
    card.classList.remove("is-popout", "popout-results");
    card.removeAttribute("role");
    card.removeAttribute("aria-modal");
    card.removeAttribute("aria-label");
    card.style.removeProperty("--popout-top");
    card.style.removeProperty("--popout-height");
    card.querySelectorAll(".prompt.is-long").forEach(prompt => prompt.classList.remove("is-long"));
    document.documentElement.classList.remove("has-quiz-popout");
    labelToggles(card, false);
    /* The pages scroll smoothly; this is putting the page back, not moving it. */
    window.scrollTo({ top: state.scrollY, behavior: "instant" });

    const fromHistory = Boolean(options && options.fromHistory);
    if (state.pushed && !fromHistory && history.state && history.state.quizPopout) {
      steppingBack = true;
      history.back();
    }

    const toggle = [...card.querySelectorAll(".runtime-bar [data-quiz-popout]")].find(shown);
    if (toggle) toggle.focus({ preventScroll: true });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-quiz-popout]");
    if (!button) return;
    if (open && open.card === cardOf(button)) closePopout();
    else openPopout(button);
  });

  window.addEventListener("popstate", () => {
    if (steppingBack) {
      steppingBack = false;
      return;
    }
    if (open) closePopout({ fromHistory: true });
  });

  /* ---- ending early ---------------------------------------------------- */

  function dismissConfirm(panel, refocus) {
    clearTimeout(panel.quizTimer);
    panel.classList.add("hidden");
    const button = panel.quizEndButton;
    if (button) {
      button.disabled = false;
      button.removeAttribute("aria-expanded");
      if (refocus && shown(button)) button.focus({ preventScroll: true });
    }
  }

  function wireConfirm(panel) {
    if (panel.quizWired) return;
    panel.quizWired = true;
    panel.addEventListener("click", event => {
      if (event.target.closest("[data-end-keep]")) {
        dismissConfirm(panel, true);
        return;
      }
      if (!event.target.closest("[data-end-yes]")) return;
      if (Date.now() - panel.quizOpenedAt < CONFIRM_GUARD_MS) return;
      const end = panel.quizEnd;
      dismissConfirm(panel, false);
      if (end) end();
    });
  }

  /* The end button stays where it is, disabled, while the row is open: if it
     disappeared, the button beside it would slide under the finger that is
     about to tap again. */
  function confirmEnd(button, onEnd) {
    const bar = button.closest(".runtime-bar");
    const panel = bar && bar.querySelector(".end-confirm");
    if (!panel) {
      onEnd();
      return;
    }
    wireConfirm(panel);
    panel.quizEnd = onEnd;
    panel.quizEndButton = button;
    panel.quizOpenedAt = Date.now();
    panel.classList.remove("hidden");
    button.disabled = true;
    button.setAttribute("aria-expanded", "true");
    const keep = panel.querySelector("[data-end-keep]");
    if (keep) keep.focus({ preventScroll: true });
    clearTimeout(panel.quizTimer);
    /* Left alone, the question goes away again rather than waiting on the
       next run's bar. */
    panel.quizTimer = setTimeout(() => dismissConfirm(panel, false), CONFIRM_TIMEOUT_MS);
  }

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const panel = [...document.querySelectorAll(".end-confirm")].find(shown);
    if (panel) {
      event.preventDefault();
      dismissConfirm(panel, true);
      return;
    }
    if (open) {
      event.preventDefault();
      closePopout();
    }
  });

  window.QuizPopout = { confirmEnd, close: closePopout };
})();
