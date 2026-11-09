/* =====================================================================
   ⚙️ SCRIPT — page behaviour and animations.
   You normally DON'T need to edit this file.
   Event details and the schedule live in event.js.
   ===================================================================== */
(function () {
  "use strict";

  var E = window.EVENT || {};
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  function $(s) { return document.querySelector(s); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ===================== text from event.js ============================ */

  function fillFields() {
    var nodes = document.querySelectorAll("[data-field]");
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i], v = E[n.getAttribute("data-field")];
      if (v == null || v === "") { n.hidden = true; continue; }
      n.textContent = v;
    }
    var venue = $("#venueLink");
    if (venue && E.mapLink) venue.href = E.mapLink;
    if (E.title) document.title = E.title + " · Christmas Party";
  }

  /* ===================== add to calendar =============================== */

  function calendarLink() {
    var a = $("#calLink");
    if (!a) return;
    var s = new Date(E.startsAt), e = new Date(E.endsAt);
    if (isNaN(s) || isNaN(e)) { a.hidden = true; return; }
    function fmt(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
    var details = [E.theme, E.themeNote].filter(Boolean).join(" — ") + "\n" + location.href;
    a.href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(E.title || "Christmas Party") +
      "&dates=" + fmt(s) + "/" + fmt(e) +
      "&location=" + encodeURIComponent([E.venue, E.address].filter(Boolean).join(", ")) +
      "&details=" + encodeURIComponent(details);
  }

  /* ===================== countdown ===================================== */

  function countdown() {
    var box = $("#countdown");
    if (!box) return;
    var start = new Date(E.startsAt).getTime(), end = new Date(E.endsAt).getTime();
    if (isNaN(start)) { box.hidden = true; return; }
    var grid = box.querySelector(".cd-grid"), msg = box.querySelector(".cd-msg");
    var c = {
      d: box.querySelector('[data-u="d"]'), h: box.querySelector('[data-u="h"]'),
      m: box.querySelector('[data-u="m"]'), s: box.querySelector('[data-u="s"]')
    };
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function tick() {
      var now = Date.now(), diff = start - now;
      if (diff <= 0) {
        grid.hidden = true; msg.hidden = false;
        if (!isNaN(end) && now < end) {
          msg.textContent = "The party is on — see you there!";
          setTimeout(tick, 60000);
        } else {
          msg.textContent = "Thank you for celebrating with us!";
        }
        return;
      }
      var t = Math.floor(diff / 1000);
      c.d.textContent = Math.floor(t / 86400);
      c.h.textContent = pad(Math.floor((t % 86400) / 3600));
      c.m.textContent = pad(Math.floor((t % 3600) / 60));
      c.s.textContent = pad(t % 60);
      setTimeout(tick, 1000 - (now % 1000) + 5);
    }
    tick();
  }

  /* ===================== schedule ====================================== */

  var ICONS = {
    bell:    '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    drinks:  '<path d="M7 3h10l-1.2 6.2a3.9 3.9 0 0 1-7.6 0z"/><path d="M12 13v7"/><path d="M8 21h8"/>',
    food:    '<path d="M6 3v6a2 2 0 0 0 4 0V3"/><path d="M8 3v18"/><path d="M18 21V3c-2.5 1-4 3.5-4 8h4"/>',
    music:   '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    fashion: '<path d="M12 7.5a2.2 2.2 0 1 1 2.2-2.2"/><path d="M12 7.5v1.8L3 17h18l-9-7.7"/>',
    gift:    '<rect x="3.5" y="9" width="17" height="11" rx="1"/><path d="M2.5 6.5h19V9h-19z"/><path d="M12 6.5V20"/><path d="M12 6.5C10 2.5 6 3 7.5 6.5M12 6.5c2-4 6-3.5 4.5 0"/>',
    star:    '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    camera:  '<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>',
    tree:    '<path d="M12 2.5l5 6.5h-3l4.5 6h-13L10 9H7z"/><path d="M12 15v5.5"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[name] || ICONS.star) + "</svg>";
  }

  function renderSchedule() {
    var list = $("#timeline"), sec = $("#schedule"), soon = $("#soon");
    if (!list) return;
    var items = Array.isArray(E.schedule) ? E.schedule : [];

    // not confirmed yet → keep the schedule hidden, show "coming soon"
    if (!E.scheduleConfirmed || !items.length) {
      sec.hidden = true;
      if (soon) soon.hidden = false;
      return;
    }
    sec.hidden = false;
    var cue = $(".scroll-cue");
    if (cue) cue.innerHTML = 'See the invitation &amp; schedule <span aria-hidden="true">↓</span>';

    items.forEach(function (item, i) {
      var li = el("li", "stop");

      var b = el("span", "bauble tone-" + (i % 3));
      b.setAttribute("aria-hidden", "true");
      b.style.setProperty("--sd", (-i * 0.7) + "s");
      b.innerHTML = icon(item.icon);

      var card = el("div", "card");
      var t = el("p", "time");
      t.appendChild(el("span", "", item.time || "TBC"));
      card.appendChild(t);
      card.appendChild(el("h3", "stop-title", item.title || ""));
      if (item.note) card.appendChild(el("p", "note", item.note));

      li.appendChild(b);
      li.appendChild(card);
      list.appendChild(li);
    });
  }

  /* ===================== poster ======================================== */

  function poster() {
    var img = $("#posterImg"), sec = $("#invitation");
    if (!img || !sec) return;
    if (!E.poster) { sec.hidden = true; return; }
    img.onerror = function () { sec.hidden = true; };
    img.src = E.poster;
  }

  /* ===================== reveal on scroll ============================== */

  function reveal() {
    var nodes = document.querySelectorAll(".stop, .reveal");
    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].classList.add("in");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    for (var j = 0; j < nodes.length; j++) io.observe(nodes[j]);
  }

  /* ===================== snow + music notes ============================
     Snowflakes, gold sparkles and music notes drift down the page.
     Moving the mouse (or a finger) pushes them aside and leaves a soft
     golden glow. A slow automatic sweep plays once after the page loads
     so first-time visitors discover it.                                  */

  function sky() {
    var c = $("#sky");
    if (!c || !c.getContext) return;
    var ctx = c.getContext("2d");
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, parts = [], trail = [];
    var ptr = { x: -9999, y: -9999, on: false };
    var lastReal = -1e9, sweep = null;
    var NOTES = ["♪", "♫", "♩", "♬"];

    function make(anyY) {
      var r = Math.random();
      var kind = r < 0.14 ? "note" : r < 0.28 ? "spark" : "flake";
      return {
        kind: kind,
        x: Math.random() * W,
        y: anyY ? Math.random() * H : -24,
        vx: 0, vy: 0,
        size: kind === "note" ? 13 + Math.random() * 11 : kind === "spark" ? 1.2 + Math.random() * 1.6 : 2 + Math.random() * 3,
        fall: kind === "note" ? 14 + Math.random() * 14 : 16 + Math.random() * 28,
        sway: Math.random() * 6.28, swaySpeed: 0.4 + Math.random() * 0.8,
        rot: Math.random() * 6.28, rotV: (Math.random() - 0.5) * 0.7,
        alpha: kind === "note" ? 0.2 + Math.random() * 0.2 : 0.25 + Math.random() * 0.35,
        glyph: NOTES[Math.floor(Math.random() * NOTES.length)],
        red: Math.random() < 0.35
      };
    }

    function resize(force) {
      var nw = window.innerWidth, nh = window.innerHeight;
      // ignore tiny height changes from mobile address bars
      if (!force && nw === W && Math.abs(nh - H) < 120) return;
      W = nw; H = nh;
      c.width = Math.round(W * DPR); c.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      var target = Math.max(30, Math.min(170, Math.round(W * H / 8500)));
      while (parts.length < target) parts.push(make(true));
      parts.length = target;
    }

    function setPtr(x, y, now) {
      ptr.x = x; ptr.y = y; ptr.on = true;
      trail.push({ x: x, y: y, t: now });
      if (trail.length > 50) trail.shift();
    }

    window.addEventListener("pointermove", function (e) {
      lastReal = performance.now();
      setPtr(e.clientX, e.clientY, lastReal);
    }, { passive: true });
    window.addEventListener("pointerdown", function (e) {
      lastReal = performance.now();
      setPtr(e.clientX, e.clientY, lastReal);
    }, { passive: true });
    window.addEventListener("pointerup", function (e) {
      if (e.pointerType !== "mouse") ptr.on = false;
    }, { passive: true });
    document.addEventListener("pointerout", function (e) {
      if (!e.relatedTarget) ptr.on = false;
    }, { passive: true });

    function runSweep(now) {
      if (!sweep) return;
      if (now - lastReal < 1500) { sweep = null; return; }   // real input wins
      var p = (now - sweep.t0) / sweep.dur;
      if (p < 0) return;
      if (p >= 1) { sweep = null; ptr.on = false; return; }
      var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setPtr((-0.05 + 1.1 * e) * W, (0.3 + 0.12 * Math.sin(e * Math.PI * 2)) * H, now);
    }

    function step(dt) {
      var R = 120;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.sway += p.swaySpeed * dt;
        p.rot += p.rotV * dt;
        if (ptr.on) {
          var dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy;
          if (d2 < R * R && d2 > 0.01) {
            var d = Math.sqrt(d2), f = (1 - d / R) * 900;
            p.vx += (dx / d) * f * dt;
            p.vy += (dy / d) * f * dt;
          }
        }
        var damp = Math.pow(0.05, dt);
        p.vx *= damp; p.vy *= damp;
        p.x += (p.vx + Math.cos(p.sway) * 14) * dt;
        p.y += (p.fall + p.vy) * dt;
        if (p.y > H + 30) { parts[i] = make(false); continue; }
        if (p.y < -60) p.y = -60;
        if (p.x < -30) p.x = W + 30; else if (p.x > W + 30) p.x = -30;
      }
    }

    function draw(now) {
      ctx.clearRect(0, 0, W, H);

      // golden glow trail
      for (var k = 0; k < trail.length; k++) {
        var tp = trail[k], age = (now - tp.t) / 900;
        if (age >= 1) continue;
        var a = (1 - age) * 0.10, rad = 26 + age * 30;
        var g = ctx.createRadialGradient(tp.x, tp.y, 0, tp.x, tp.y, rad);
        g.addColorStop(0, "rgba(201,162,74," + a + ")");
        g.addColorStop(1, "rgba(201,162,74,0)");
        ctx.fillStyle = g;
        ctx.fillRect(tp.x - rad, tp.y - rad, rad * 2, rad * 2);
      }
      while (trail.length && now - trail[0].t > 900) trail.shift();

      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (p.kind === "flake") {
          ctx.save();
          ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.strokeStyle = "rgba(26,68,194," + p.alpha + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (var s = 0; s < 3; s++) {
            var ang = s * Math.PI / 3, cx = Math.cos(ang) * p.size, cy = Math.sin(ang) * p.size;
            ctx.moveTo(-cx, -cy); ctx.lineTo(cx, cy);
          }
          ctx.stroke();
          ctx.restore();
        } else if (p.kind === "spark") {
          var tw = 0.5 + 0.5 * Math.sin(now / 300 + p.sway * 3);
          ctx.fillStyle = "rgba(201,162,74," + (p.alpha + 0.3 * tw) + ")";
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (0.7 + 0.5 * tw), 0, 6.283); ctx.fill();
        } else {
          ctx.save();
          ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.sway) * 0.35);
          ctx.font = p.size + "px Georgia, serif";
          ctx.fillStyle = p.red ? "rgba(200,50,60," + p.alpha + ")" : "rgba(26,68,194," + p.alpha + ")";
          ctx.fillText(p.glyph, -p.size / 3, p.size / 3);
          ctx.restore();
        }
      }
    }

    resize(true);
    window.addEventListener("resize", function () { resize(false); });

    if (reduced) { draw(performance.now()); return; }   // calm, static snow

    var last = performance.now();
    function loop(now) {
      requestAnimationFrame(loop);
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      runSweep(now);
      step(dt);
      draw(now);
    }
    requestAnimationFrame(loop);
    setTimeout(function () { sweep = { t0: performance.now(), dur: 3800 }; }, 1200);
  }

  /* ===================== fairy lights ================================== */

  function lights() {
    var svg = $("#lights");
    if (!svg) return;
    var NS = "http://www.w3.org/2000/svg";
    var COLORS = ["#C8323C", "#E7C04B", "#2F8F5B", "#2E58D6"];
    function build() {
      var W = svg.getBoundingClientRect().width || window.innerWidth;
      var gap = W < 600 ? 46 : 64, n = Math.max(4, Math.round(W / gap)), step = W / n;
      svg.setAttribute("viewBox", "0 0 " + W + " 54");
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      var d = "M0 6";
      for (var i = 0; i < n; i++) d += " Q" + (i * step + step / 2) + " 30 " + ((i + 1) * step) + " 6";
      var wire = document.createElementNS(NS, "path");
      wire.setAttribute("d", d); wire.setAttribute("class", "wire");
      svg.appendChild(wire);
      for (var j = 0; j < n; j++) {
        var g = document.createElementNS(NS, "g");
        g.setAttribute("transform", "translate(" + (j * step + step / 2) + " 18)");
        var cap = document.createElementNS(NS, "rect");
        cap.setAttribute("x", -3); cap.setAttribute("y", 0); cap.setAttribute("width", 6); cap.setAttribute("height", 5);
        cap.setAttribute("rx", 1); cap.setAttribute("class", "cap");
        var bulb = document.createElementNS(NS, "ellipse");
        bulb.setAttribute("cx", 0); bulb.setAttribute("cy", 13); bulb.setAttribute("rx", 6); bulb.setAttribute("ry", 9);
        bulb.setAttribute("fill", COLORS[j % COLORS.length]);
        bulb.style.color = COLORS[j % COLORS.length];   // used for the glow
        bulb.setAttribute("class", "bulb");
        bulb.style.animationDelay = ((j * 0.37) % 2.4).toFixed(2) + "s";
        g.appendChild(cap); g.appendChild(bulb);
        svg.appendChild(g);
      }
    }
    build();
    var t;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(build, 150); });
  }

  /* ===================== running Santa ================================= */

  function santa() {
    var s = $("#santa");
    if (!s) return;
    if (reduced || E.santa === false) { s.hidden = true; return; }
    var rest = Math.max(1, Number(E.santaEvery) || 5) * 1000;
    var ho = s.querySelector(".ho"), dir = 1;

    function run() {
      // about 230px per second, whatever the screen width
      s.style.setProperty("--dur", ((window.innerWidth + 260) / 230).toFixed(2) + "s");
      s.classList.remove("run-r", "run-l");
      void s.offsetWidth;                       // restart the animation
      ho.classList.toggle("show", Math.random() < 0.5);
      s.classList.add(dir > 0 ? "run-r" : "run-l");
      dir = -dir;                               // next time, run the other way
    }
    s.addEventListener("animationend", function (e) {
      if (e.animationName !== "run-r" && e.animationName !== "run-l") return;
      s.classList.remove("run-r", "run-l");
      setTimeout(run, rest);
    });
    setTimeout(run, 2500);
  }

  /* ===================== start ========================================= */

  function init() {
    fillFields();
    calendarLink();
    countdown();
    renderSchedule();
    poster();
    reveal();
    lights();
    santa();
    sky();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
