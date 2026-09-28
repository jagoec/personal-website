(function () {
  var el = document.querySelector("[data-drag]");
  var panel = document.querySelector(".toy-panel");
  if (!el) return;

  var defaults = { stiffness: 170, damping: 18, gravity: false };
  var params = { stiffness: defaults.stiffness, damping: defaults.damping, gravity: defaults.gravity };

  var GRAVITY = 3000;
  var RESTITUTION = 0.35;
  var FLOOR_FRICTION = 0.7;
  var MAX_FLING = 3000;

  var dragging = false;
  var startX = 0, startY = 0;
  var baseX = 0, baseY = 0;
  var x = 0, y = 0, vx = 0, vy = 0;
  var lastT = 0;
  var rafId = null;
  var history = [];

  function applyTransform() {
    el.style.transform = "translate(" + x + "px," + y + "px)";
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function startLoop() {
    stopLoop();
    lastT = performance.now();
    rafId = requestAnimationFrame(step);
  }

  function step(t) {
    rafId = null;
    var dt = Math.min((t - lastT) / 1000, 0.032);
    lastT = t;

    if (params.gravity) {
      vy += GRAVITY * dt;
      vx -= vx * 0.8 * dt;
    } else {
      vx += (-params.stiffness * x - params.damping * vx) * dt;
      vy += (-params.stiffness * y - params.damping * vy) * dt;
    }
    x += vx * dt;
    y += vy * dt;
    applyTransform();

    if (params.gravity) {
      var rect = el.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        y -= rect.bottom - window.innerHeight;
        applyTransform();
        vy = Math.abs(vy) > 80 ? -vy * RESTITUTION : 0;
        vx *= FLOOR_FRICTION;
      }
    }

    var offset = Math.sqrt(x * x + y * y);
    var speed = Math.sqrt(vx * vx + vy * vy);
    if (params.gravity ? speed < 2 : offset < 0.5 && speed < 8) {
      if (!params.gravity) {
        x = 0; y = 0;
        applyTransform();
      }
      vx = 0; vy = 0;
      return;
    }
    rafId = requestAnimationFrame(step);
  }

  function flingVelocity() {
    var cutoff = performance.now() - 120;
    var old = history[0];
    for (var i = 0; i < history.length; i++) {
      if (history[i].t >= cutoff) { old = history[i]; break; }
    }
    if (!old || history.length < 2) return { x: 0, y: 0 };
    var last = history[history.length - 1];
    var dt = (last.t - old.t) / 1000;
    if (dt <= 0) return { x: 0, y: 0 };
    var fx = (last.x - old.x) / dt;
    var fy = (last.y - old.y) / dt;
    var mag = Math.sqrt(fx * fx + fy * fy);
    if (mag > MAX_FLING) {
      fx = fx / mag * MAX_FLING;
      fy = fy / mag * MAX_FLING;
    }
    return { x: fx, y: fy };
  }

  el.addEventListener("pointerdown", function (e) {
    stopLoop();
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    baseX = x;
    baseY = y;
    vx = 0; vy = 0;
    history = [{ t: performance.now(), x: x, y: y }];
    el.setPointerCapture(e.pointerId);
    el.classList.add("dragging");
  });

  el.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    x = baseX + (e.clientX - startX);
    y = baseY + (e.clientY - startY);
    applyTransform();
    history.push({ t: performance.now(), x: x, y: y });
    while (history.length > 2 && history[0].t < performance.now() - 150) history.shift();
  });

  function release(e) {
    if (!dragging) return;
    dragging = false;
    if (e && e.pointerId !== undefined && el.hasPointerCapture && el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    el.classList.remove("dragging");
    var f = flingVelocity();
    vx = f.x;
    vy = f.y;
    startLoop();
  }
  el.addEventListener("pointerup", release);
  el.addEventListener("pointercancel", release);

  function showPanel() { if (panel) panel.hidden = false; }
  function hidePanel() { if (panel) panel.hidden = true; }
  function togglePanel() { if (panel) panel.hidden = !panel.hidden; }

  if (panel) {
    var stiffness = panel.querySelector('[name="stiffness"]');
    var damping = panel.querySelector('[name="damping"]');
    var gravity = panel.querySelector('[name="gravity"]');
    var stiffnessOut = panel.querySelector('[data-out="stiffness"]');
    var dampingOut = panel.querySelector('[data-out="damping"]');

    function syncLabels() {
      stiffnessOut.textContent = params.stiffness;
      dampingOut.textContent = params.damping;
    }

    stiffness.addEventListener("input", function () {
      params.stiffness = Number(stiffness.value);
      syncLabels();
    });
    damping.addEventListener("input", function () {
      params.damping = Number(damping.value);
      syncLabels();
    });
    gravity.addEventListener("change", function () {
      params.gravity = gravity.checked;
      if (!dragging) startLoop();
    });
    panel.querySelector('[name="reset"]').addEventListener("click", function () {
      params.stiffness = defaults.stiffness;
      params.damping = defaults.damping;
      params.gravity = defaults.gravity;
      stiffness.value = defaults.stiffness;
      damping.value = defaults.damping;
      gravity.checked = false;
      syncLabels();
      if (!dragging) startLoop();
    });
    panel.querySelector('[name="close"]').addEventListener("click", hidePanel);
    syncLabels();
  }

  var CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "KeyB", "KeyA"];
  var ki = 0;
  document.addEventListener("keydown", function (e) {
    var tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (e.code === CODE[ki]) {
      ki++;
      if (ki === CODE.length) {
        ki = 0;
        togglePanel();
      }
    } else {
      ki = e.code === CODE[0] ? 1 : 0;
    }
  });

  if (panel) {
    var handle = panel.querySelector(".toy-panel-header");
    var pd = false, px = 0, py = 0, tx = 0, ty = 0;
    handle.addEventListener("pointerdown", function (e) {
      pd = true;
      px = e.clientX;
      py = e.clientY;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", function (e) {
      if (!pd) return;
      tx += e.clientX - px;
      ty += e.clientY - py;
      px = e.clientX;
      py = e.clientY;
      panel.style.transform = "translate(" + tx + "px," + ty + "px)";
    });
    function panelUp() { pd = false; }
    handle.addEventListener("pointerup", panelUp);
    handle.addEventListener("pointercancel", panelUp);
  }
})();
