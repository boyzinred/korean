/* ---------------------------------------------------------------------------
   HandwritingPad
   A canvas to write an answer on with a finger, a stylus, or a mouse. It only
   draws: nothing is recognised or sent anywhere, because the quizzes that use
   it have the learner reveal the answer and mark themselves.

     const pad = HandwritingPad.create(canvas, {
       penOnly: false,          // ignore fingers, so a resting palm draws nothing
       color: () => "#000",     // read on every redraw, so a theme switch follows
       onChange: pad => {}      // after every stroke, undo, and clear
     });
     pad.undo(); pad.clear(); pad.isEmpty(); pad.lock(); pad.setPenOnly(true);
     pad.destroy();             // before the canvas is thrown away

   Strokes are kept as points in CSS pixels, so a resize or a theme change
   redraws them rather than losing them.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  /* A pen reports real pressure; a finger or a mouse reports a flat 0.5 or
     nothing at all, so those get one steady width. */
  function widthOf(point) {
    if (point.type === "pen") return 2.5 + 6 * Math.max(0.05, point.pressure || 0.5);
    return 5.5;
  }

  function create(canvas, options) {
    const settings = Object.assign({ penOnly: false, color: () => "#000", onChange: null }, options);
    const context = canvas.getContext("2d");
    const strokes = [];
    let current = null;
    let locked = false;
    let penOnly = Boolean(settings.penOnly);

    function drawSegment(from, to) {
      context.strokeStyle = settings.color();
      context.lineWidth = (widthOf(from) + widthOf(to)) / 2;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
    function drawStroke(stroke) {
      if (stroke.length === 1) {
        /* A tap is a dot, not nothing: it is how ㅣ's short tick gets drawn. */
        context.fillStyle = settings.color();
        context.beginPath();
        context.arc(stroke[0].x, stroke[0].y, widthOf(stroke[0]) / 2, 0, Math.PI * 2);
        context.fill();
        return;
      }
      for (let i = 1; i < stroke.length; i += 1) drawSegment(stroke[i - 1], stroke[i]);
    }
    function redraw() {
      const ratio = window.devicePixelRatio || 1;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
      context.lineCap = "round";
      context.lineJoin = "round";
      strokes.forEach(drawStroke);
    }

    /* The backing store follows the box the stylesheet gives the canvas, at
       the screen's pixel density, so lines stay sharp on a retina tablet. */
    function fit() {
      const box = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.round(box.width * ratio));
      const height = Math.max(1, Math.round(box.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      redraw();
    }

    function changed() { if (settings.onChange) settings.onChange(api); }

    function pointOf(event) {
      const box = canvas.getBoundingClientRect();
      return {
        x: event.clientX - box.left,
        y: event.clientY - box.top,
        pressure: event.pressure,
        type: event.pointerType
      };
    }
    function accepts(event) {
      if (locked) return false;
      if (penOnly && event.pointerType === "touch") return false;
      return event.pointerType !== "mouse" || event.button === 0;
    }

    function down(event) {
      if (!accepts(event) || current) return;
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      current = { id: event.pointerId, points: [pointOf(event)] };
      strokes.push(current.points);
      redraw();
    }
    function move(event) {
      if (!current || event.pointerId !== current.id) return;
      event.preventDefault();
      /* Coalesced events carry the points the browser sampled between frames;
         without them a quick curve comes out as a polygon. */
      const samples = event.getCoalescedEvents ? event.getCoalescedEvents() : [];
      (samples.length ? samples : [event]).forEach(sample => {
        const points = current.points;
        const point = pointOf(sample);
        points.push(point);
        drawSegment(points[points.length - 2], point);
      });
    }
    function up(event) {
      if (!current || event.pointerId !== current.id) return;
      current = null;
      changed();
    }

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    /* iOS opens a magnifier or a copy menu on a long press unless told not to. */
    const block = event => event.preventDefault();
    canvas.addEventListener("contextmenu", block);
    canvas.addEventListener("touchstart", block, { passive: false });

    const resizer = typeof ResizeObserver === "function" ? new ResizeObserver(fit) : null;
    if (resizer) resizer.observe(canvas);
    else window.addEventListener("resize", fit);
    /* The ink colour comes from the theme, so a switch mid-question redraws. */
    const themeWatch = typeof MutationObserver === "function"
      ? new MutationObserver(redraw) : null;
    if (themeWatch) themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const api = {
      undo() {
        if (locked || current || !strokes.length) return;
        strokes.pop();
        redraw();
        changed();
      },
      clear() {
        if (locked || current || !strokes.length) return;
        strokes.length = 0;
        redraw();
        changed();
      },
      isEmpty() { return strokes.length === 0; },
      lock() { locked = true; current = null; },
      setPenOnly(on) { penOnly = Boolean(on); },
      destroy() {
        if (resizer) resizer.disconnect();
        else window.removeEventListener("resize", fit);
        if (themeWatch) themeWatch.disconnect();
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up);
        canvas.removeEventListener("pointercancel", up);
        canvas.removeEventListener("contextmenu", block);
        canvas.removeEventListener("touchstart", block);
      }
    };
    fit();
    return api;
  }

  window.HandwritingPad = { create };
})();
