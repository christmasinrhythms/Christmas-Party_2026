/* =====================================================================
   ⚙️ The Ballroom — behaviour and animation. You normally DON'T edit this.
   Words live in room-content.js; pictures in assets/room/.
   ===================================================================== */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var params = new URLSearchParams(location.search);
  var lang = params.get("lang") === "zh" ? "zh" : "en";
  var R = null;
  var state = { genre: null, idea: 0, lib: "ideas", panel: null };
  var NS = "http://www.w3.org/2000/svg";

  var UI = {
    en: { back: "Back to the house", toggle: "繁中", skip: "Skip", close: "Close", updated: "Last updated",
          dressingRoom: "The dressing room", directorsSet: "The director's set", easel: "On the easel",
          guide: "Guide", tentative: "Tentative", zoom: "Open full size ↗",
          pieces: "Key pieces", extras: "Finishing touches", easy: "Easy version", allOut: "Go all out",
          pinterest: "More looks on Pinterest ↗", reference: "Reference look", watch: "Watch reference ↗",
          seated: "Seated-friendly", min: "min", pickHint: "Pick a genre on the stage to see the look.",
          realLooks: "Real-life looks", seeReal: "See real people wearing it on Pinterest ↗",
          realNote: "Real outfit photos for this genre will appear here soon.", ideasTab: "Challenge ideas",
          oops: "Content is being updated — please check back in a few minutes.",
          genres: { rock: "Rock & Punk", disco: "Disco Vibe", kpop: "K-pop", jazz: "Jazz & Classic" },
          title: "Christmas in Rhythms · The Ballroom", langLabel: "切換至繁體中文" },
    zh: { back: "返回大屋", toggle: "EN", skip: "略過", close: "關閉", updated: "最後更新",
          dressingRoom: "更衣室", directorsSet: "導演片場", easel: "畫架上",
          guide: "參考", tentative: "暫定", zoom: "開啟原圖 ↗",
          pieces: "主要單品", extras: "點睛配飾", easy: "輕鬆版", allOut: "全力出擊",
          pinterest: "到 Pinterest 看更多造型 ↗", reference: "參考造型", watch: "觀看參考 ↗",
          seated: "可坐着演出", min: "分鐘", pickHint: "在舞台上揀選曲風，看看造型。",
          realLooks: "真人造型參考", seeReal: "到 Pinterest 看真人穿搭 ↗",
          realNote: "此曲風的真人穿搭相片即將在此展示。", ideasTab: "挑戰點子",
          oops: "內容更新中——請稍後再回來看看。",
          genres: { rock: "搖滾龐克", disco: "迪斯可熱潮", kpop: "韓流K-pop", jazz: "爵士古典" },
          title: "Christmas in Rhythms · 宴會廳", langLabel: "Switch to English" }
  };
  function u(k) { return UI[lang][k]; }
  function tx(v) { if (v == null) return ""; if (typeof v === "string" || Array.isArray(v)) return v; return v[lang] != null ? v[lang] : (v.en != null ? v.en : ""); }
  function get(path) { return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, R); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function safeUrl(x) { return /^https?:\/\//i.test(x || "") ? x : "#"; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function el(tag, attrs) { var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }

  /* =================== the ballroom drawing (repeated details) =================== */
  function buildScene() {
    var g = $("#floorLines");
    for (var i = -8; i <= 8; i++) g.appendChild(el("path", { d: "M" + (800 + i * 62.5) + " 500L" + (800 + i * 187.5) + " 900" }));
    [530, 568, 615, 675, 750, 845].forEach(function (y) { g.appendChild(el("path", { d: "M0 " + y + "H1600", "stroke-opacity": ".18" })); });

    var lights = $("#lights"), cols = ["#ff5a5a", "#f3d58c", "#5fc27a", "#fff4de"];
    [[40, 24, 400, 200, 770, 40], [830, 40, 1200, 200, 1560, 24]].forEach(function (c, si) {
      lights.appendChild(el("path", { d: "M" + c[0] + " " + c[1] + "Q" + c[2] + " " + c[3] + " " + c[4] + " " + c[5], fill: "none", stroke: "#2b1a12", "stroke-width": "2" }));
      for (var k = 1; k < 16; k++) {
        var t = k / 16, x = (1 - t) * (1 - t) * c[0] + 2 * (1 - t) * t * c[2] + t * t * c[4], y = (1 - t) * (1 - t) * c[1] + 2 * (1 - t) * t * c[3] + t * t * c[5];
        var b = el("circle", { cx: x.toFixed(1), cy: (y + 7).toFixed(1), r: "5.5", fill: cols[(k + si) % 4], class: "bulb" });
        b.style.animationDelay = (-(k * 0.37 + si) % 1.8).toFixed(2) + "s";
        lights.appendChild(b);
      }
    });

    var spots = $("#spots");
    for (var s = 0; s < 46; s++) {
      var a = rnd(0, Math.PI * 2), d = rnd(180, 760);
      var sp = el("circle", { cx: (800 + Math.cos(a) * d).toFixed(0), cy: (58 + Math.abs(Math.sin(a)) * d * 0.9).toFixed(0), r: rnd(3, 7).toFixed(1), fill: Math.random() < .5 ? "#ffd36a" : "#fff7e0" });
      sp.style.animationDelay = rnd(-2.4, 0).toFixed(2) + "s";
      spots.appendChild(sp);
    }

    [["#snowL", 360, 480], ["#snowR", 1120, 1240]].forEach(function (w) {
      var grp = $(w[0]);
      for (var n = 0; n < 24; n++) {
        var f = el("circle", { cx: rnd(w[1], w[2]).toFixed(0), cy: rnd(150, 200).toFixed(0), r: rnd(1.2, 3.2).toFixed(1), fill: "#fff", opacity: rnd(.5, .95).toFixed(2) });
        f.style.animationDuration = rnd(4, 9).toFixed(1) + "s";
        f.style.animationDelay = rnd(-9, 0).toFixed(1) + "s";
        grp.appendChild(f);
      }
    });

    var tb = $("#treeBaubles"), bc = ["#d23a3f", "#f3d58c", "#f4efe6", "#c0392b"];
    [[150, 440], [196, 452], [120, 520], [214, 530], [168, 548], [96, 610], [146, 628], [204, 612], [248, 640], [176, 600], [132, 470], [232, 584]].forEach(function (p, i) {
      tb.appendChild(el("circle", { cx: p[0], cy: p[1], r: "7", fill: bc[i % 4] }));
    });

    var tables = $("#tables");
    function table(cx, cy, rx, ry) {
      var t = el("g", {});
      for (var c = 0; c < 6; c++) {
        var ang = Math.PI + (c / 5) * Math.PI;
        t.appendChild(el("rect", { x: (cx + Math.cos(ang) * rx * 1.15 - 7).toFixed(0), y: (cy + Math.sin(ang) * ry * 1.6 - 16).toFixed(0), width: "14", height: "22", rx: "4", fill: "#7a1f24" }));
      }
      t.appendChild(el("path", { d: "M" + (cx - rx) + " " + cy + "v" + (ry * 1.4) + "q" + rx + " " + (ry * 1.2) + " " + (rx * 2) + " 0v-" + (ry * 1.4) + "z", fill: "#e8e0d2" }));
      t.appendChild(el("ellipse", { cx: cx, cy: cy, rx: rx, ry: ry, fill: "#fbf7ef" }));
      t.appendChild(el("circle", { cx: cx, cy: cy - ry * .6, r: ry * 1.4, fill: "url(#gGlow)" }));
      t.appendChild(el("rect", { x: cx - 2, y: cy - ry * 1.2, width: "4", height: ry * .9, fill: "#f3d58c" }));
      tables.appendChild(t);
    }
    [700, 900].forEach(function (x) { table(x, 566, 38, 10); });
    [700, 900].forEach(function (x) { table(x, 644, 46, 12); });

    var dust = $("#dust");
    for (var m = 0; m < 30; m++) {
      var p = el("circle", { cx: rnd(80, 1520).toFixed(0), cy: rnd(140, 720).toFixed(0), r: rnd(1.2, 3).toFixed(1), fill: "#ffe39a" });
      p.style.animationDuration = rnd(3.5, 8).toFixed(1) + "s"; p.style.animationDelay = rnd(-8, 0).toFixed(1) + "s";
      dust.appendChild(p);
    }
  }

  function fit() {
    var v = $("#viewport"), w = v.clientWidth, h = v.clientHeight;
    $("#stage").style.setProperty("--s", Math.max(w / 1600, h / 900).toFixed(4));
  }

  /* =================== outfits (the character on the stage) =================== */
  var SKIN = "#e7bb94", SKIN_SH = "#d29f76";
  function body(o) {
    var legs = o.flare ? "M78 160 L72 232 L96 232 L99 168 L101 168 L104 232 L128 232 L122 160Z"
                       : "M78 160 L80 230 L97 230 L99 170 L101 170 L103 230 L120 230 L122 160Z";
    return '<svg viewBox="0 0 200 262" aria-hidden="true">' + (o.back || "") +
      '<ellipse cx="100" cy="246" rx="52" ry="7" fill="rgba(40,20,10,.25)"/>' +
      '<path d="' + legs + '" fill="' + o.bottom + '"/>' + (o.bottomTrim || "") +
      '<path d="M76 229h22l2 10H70q0-10 6-10zM102 229h22q6 0 6 10H100z" fill="' + o.shoes + '"/>' +
      '<path d="M68 96 Q100 86 132 96 L126 164 L74 164Z" fill="' + o.top + '"/>' + (o.topTrim || "") +
      '<path d="M68 97 L54 150 L63 154 L77 112Z" fill="' + (o.sleeve || o.top) + '"/>' +
      '<path d="M132 97 L146 150 L137 154 L123 112Z" fill="' + (o.sleeve || o.top) + '"/>' +
      '<circle cx="58" cy="156" r="6" fill="' + SKIN + '"/><circle cx="142" cy="156" r="6" fill="' + SKIN + '"/>' +
      '<rect x="93" y="80" width="14" height="14" rx="4" fill="' + SKIN_SH + '"/>' + (o.hairBack || "") +
      '<circle cx="100" cy="62" r="21" fill="' + SKIN + '"/>' +
      '<circle cx="92" cy="64" r="2" fill="#3a2a20"/><circle cx="108" cy="64" r="2" fill="#3a2a20"/>' +
      '<path d="M94 73 q6 4 12 0" stroke="#7a4a35" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<circle cx="87" cy="70" r="3" fill="#f0a08a" opacity=".5"/><circle cx="113" cy="70" r="3" fill="#f0a08a" opacity=".5"/>' +
      (o.hair || "") + (o.hat || "") + (o.extra || "") + "</svg>";
  }
  var FIG = {
    base: body({ top: "#f6f1e7", bottom: "#4f6f96", shoes: "#f4f4f4",
      topTrim: '<path d="M90 92q10 8 20 0" stroke="#d9cfbf" stroke-width="2" fill="none"/>',
      hair: '<path d="M79 60 Q80 40 100 40 Q120 40 121 60 Q112 48 100 50 Q88 48 79 60Z" fill="#4a2e1c"/>' }),
    rock: body({ top: "#8f1f24", sleeve: "#1d1a19", bottom: "#3d4148", shoes: "#141212",
      topTrim: '<path d="M68 96 L86 92 L92 164 L74 164Z M132 96 L114 92 L108 164 L126 164Z" fill="#1d1a19"/>' +
               '<g fill="#d8d2c6"><circle cx="74" cy="100" r="1.8"/><circle cx="80" cy="99" r="1.8"/><circle cx="126" cy="100" r="1.8"/><circle cx="120" cy="99" r="1.8"/></g><path d="M96 118 l4-8 4 8 -4 8z" fill="#f1e6d2"/>',
      bottomTrim: '<path d="M83 190h10M106 202h10M84 210h8" stroke="#c9c3b8" stroke-width="2.4" stroke-linecap="round"/>',
      hair: '<path d="M79 58 L84 38 L90 50 L96 32 L101 48 L108 30 L112 48 L120 38 L121 58 Q100 46 79 58Z" fill="#1d1a19"/>',
      back: '<g transform="rotate(-28 150 150)"><rect x="146" y="70" width="8" height="70" rx="2" fill="#5b3a26"/><path d="M138 136 q-14 10 -6 26 q10 14 22 4 q14 -8 8 -22 q-6 -12 -24 -8z" fill="#8f1f24"/><rect x="144" y="62" width="12" height="12" rx="2" fill="#2a2523"/></g>' }),
    disco: body({ top: "#d4a537", bottom: "#2f6f8f", flare: true, shoes: "#b8336a",
      topTrim: '<g fill="#fff3c4"><circle cx="84" cy="104" r="1.8"/><circle cx="100" cy="112" r="1.8"/><circle cx="116" cy="104" r="1.8"/><circle cx="90" cy="128" r="1.8"/><circle cx="110" cy="126" r="1.8"/><circle cx="100" cy="146" r="1.8"/><circle cx="82" cy="150" r="1.8"/><circle cx="118" cy="148" r="1.8"/></g><path d="M88 92 L100 112 L112 92" fill="none" stroke="#9b7420" stroke-width="3"/>',
      hairBack: '<circle cx="100" cy="56" r="34" fill="#3b2418"/>',
      hat: '<path d="M78 50 Q100 40 122 50" stroke="#b8336a" stroke-width="5" fill="none" stroke-linecap="round"/>',
      extra: '<rect x="84" y="58" width="14" height="10" rx="4" fill="#2a2a2a"/><rect x="102" y="58" width="14" height="10" rx="4" fill="#2a2a2a"/><path d="M98 62h4" stroke="#2a2a2a" stroke-width="2"/>',
      back: '<path d="M158 0v22" stroke="#8a7a62" stroke-width="1.5"/><circle cx="158" cy="42" r="20" fill="#cfd6dc"/><path d="M138 42h40M158 22v40M143 30q15 6 30 0M143 54q15 -6 30 0" stroke="#9aa7b2" stroke-width="1.5" fill="none"/>' }),
    kpop: body({ top: "#f2b8c6", bottom: "#9fc6e7", shoes: "#ffffff",
      topTrim: '<path d="M88 94 L100 120 L112 94Z" fill="#ffffff"/><path d="M86 140 q14 10 28 0" stroke="#c9c9c9" stroke-width="2.4" fill="none"/><path d="M74 120 L90 124 M126 120 L110 124" stroke="#e39aad" stroke-width="3"/>',
      bottomTrim: '<rect x="80" y="192" width="10" height="12" rx="2" fill="#86b2d6"/><rect x="110" y="192" width="10" height="12" rx="2" fill="#86b2d6"/>',
      hair: '<path d="M79 60 Q80 40 100 40 Q120 40 121 60 Q112 50 100 52 Q88 50 79 60Z" fill="#2b2b2b"/>',
      hat: '<path d="M76 50 Q78 30 100 30 Q122 30 124 50 L132 56 Q100 50 68 56Z" fill="#232323"/>',
      extra: '<path d="M140 150 l6 -10 l6 10 l-6 6z" fill="#e39aad"/>',
      back: '<g fill="#f2b8c6" opacity=".8"><path d="M30 60 c-6-8 6-14 8-4 c2-10 14-4 8 4 l-8 8z"/><path d="M162 96 c-4-6 4-10 6-3 c2-7 10-3 6 3 l-6 6z"/></g>' }),
    jazz: body({ top: "#1f2a3a", bottom: "#1f2a3a", shoes: "#3a2418",
      topTrim: '<path d="M90 92 L100 128 L110 92Z" fill="#f3ead7"/><path d="M92 98 l8 5 8-5 -2 10 -6-4 -6 4z" fill="#6b2232"/><path d="M74 110 L88 106 M126 110 L112 106" stroke="#c8a24a" stroke-width="2"/><path d="M84 100v60M116 100v60" stroke="#2c3a4f" stroke-width="1.2"/>',
      bottomTrim: '<path d="M88 168v58M112 168v58" stroke="#2c3a4f" stroke-width="1.2"/>',
      hair: '<path d="M80 58 Q82 44 100 44 Q118 44 120 58 Q110 50 100 50 Q90 50 80 58Z" fill="#3a2418"/>',
      hat: '<path d="M72 48 Q100 40 128 48 Q124 54 100 52 Q76 54 72 48Z" fill="#2a2a2a"/><path d="M82 46 Q84 26 100 26 Q116 26 118 46Z" fill="#2a2a2a"/><path d="M83 42 h34" stroke="#c8a24a" stroke-width="3"/>',
      back: '<g transform="translate(140 96) rotate(18)"><path d="M6 0 q10 2 8 14 l-2 60 q0 18 -16 18 q-12 0 -14 -10" fill="none" stroke="#c8a24a" stroke-width="9" stroke-linecap="round"/><path d="M-26 84 q4 -14 14 -12 l8 4" fill="#c8a24a"/></g>' })
  };

  function themeById(id) { return (R.themes.list || []).filter(function (t) { return t.id === id; })[0]; }

  function renderPicker() {
    $("#genrePicker").innerHTML = (R.themes.list || []).map(function (t) {
      return '<button type="button" role="tab" data-g="' + esc(t.id) + '" aria-selected="' + (state.genre === t.id) + '">' +
        '<span class="disc" style="--c:' + esc((t.colours || [])[1] || "#a5783e") + '"></span>' + esc(tx(t.name)) + "</button>";
    }).join("");
  }

  function list(items) { return "<ul>" + (items || []).map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>"; }

  /* photo wall: before a genre is picked, one cover per genre; afterwards, that genre's photos */
  function photosOf(t) { return (t && t.photos || []).filter(function (p) { return p && p.src; }); }
  function renderDressInfo(animate) {
    var box = $("#dressInfo"), t = state.genre && themeById(state.genre);
    if (!t) {
      box.innerHTML = '<div class="covers">' + (R.themes.list || []).map(function (g) {
        var p = photosOf(g)[0];
        return '<button type="button" class="cover" data-g="' + esc(g.id) + '" style="--c:' + esc((g.colours || [])[1] || "#a5783e") + '">' +
          (p ? '<img src="' + esc(p.src) + '" alt="" loading="lazy">' : "") +
          '<span class="cover-name">' + esc(tx(g.name)) + "</span></button>";
      }).join("") + "</div>";
    } else {
      var ps = photosOf(t);
      box.innerHTML = '<h3 class="wall-title">' + esc(tx(t.name)) + ' <small>' + ps.length + "</small></h3>" +
        '<div class="wall">' + ps.map(function (p, i) {
          return '<button type="button" class="shot" data-shot="' + i + '"><img src="' + esc(p.src) + '" alt="' + esc(tx(t.name)) + " " + (i + 1) +
            '" loading="lazy" onerror="this.parentNode.remove()"></button>';
        }).join("") + "</div>";
    }
    if (animate) { box.classList.remove("fade"); void box.offsetWidth; box.classList.add("fade"); }
  }

  /* lightbox: tap a photo to see it big, then flip through */
  var lb = { list: [], i: 0, el: null };
  function lightbox(list, i) {
    if (!lb.el) {
      lb.el = document.createElement("div");
      lb.el.className = "lightbox"; lb.el.hidden = true; lb.el.setAttribute("role", "dialog"); lb.el.setAttribute("aria-modal", "true");
      lb.el.innerHTML = '<button type="button" class="lb-close" aria-label="Close">×</button>' +
        '<button type="button" class="lb-prev" aria-label="Previous">‹</button><figure><img alt=""><figcaption></figcaption></figure>' +
        '<button type="button" class="lb-next" aria-label="Next">›</button>';
      document.body.appendChild(lb.el);
      lb.el.addEventListener("click", function (e) {
        if (e.target.closest(".lb-prev")) step(-1); else if (e.target.closest(".lb-next")) step(1);
        else if (e.target.closest(".lb-close") || e.target === lb.el) closeLb();
      });
      var x0 = null;
      lb.el.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      lb.el.addEventListener("touchend", function (e) { if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1); x0 = null; });
    }
    lb.list = list; lb.i = i; show(); lb.el.hidden = false;
    requestAnimationFrame(function () { lb.el.classList.add("on"); });
    $(".lb-close", lb.el).focus({ preventScroll: true });
  }
  function show() {
    var img = $("img", lb.el); img.src = lb.list[lb.i].src;
    $("figcaption", lb.el).textContent = (lb.i + 1) + " / " + lb.list.length;
  }
  function step(d) { lb.i = (lb.i + d + lb.list.length) % lb.list.length; show(); }
  function closeLb() { if (!lb.el) return; lb.el.classList.remove("on"); lb.el.hidden = true; }
  function lbOpen() { return lb.el && !lb.el.hidden; }

  function setFigure(id) {
    $("#figWrap").innerHTML = '<div class="fig-inner">' + (FIG[id] || FIG.base) + "</div>";
  }

  function chooseGenre(id) {
    if (state.genre === id) return;
    state.genre = id;
    var t = themeById(id), stage = $("#dressStage"), wrap = $("#figWrap");
    stage.style.setProperty("--tone", (t.colours || [])[1] || "#c9a15b");
    renderPicker();
    $("#bubble").textContent = tx(t.name) + " ✦";
    renderDressInfo(true);
    if (reduced) { setFigure(id); return; }
    var puff = document.createElement("div"); puff.className = "puff"; stage.appendChild(puff);
    setTimeout(function () { puff.remove(); }, 900);
    var sp = $("#sparkles");
    for (var i = 0; i < 18; i++) {
      var s = document.createElement("i"), a = (i / 18) * Math.PI * 2;
      s.style.setProperty("--dx", (Math.cos(a) * rnd(90, 170)).toFixed(0) + "px");
      s.style.setProperty("--dy", (Math.sin(a) * rnd(90, 170)).toFixed(0) + "px");
      s.style.background = Math.random() < .5 ? "#ffe08a" : "#ffffff";
      sp.appendChild(s);
      setTimeout(function (n) { n.remove(); }.bind(null, s), 1000);
    }
    wrap.classList.remove("idle"); wrap.classList.remove("twirl"); void wrap.offsetWidth; wrap.classList.add("twirl");
    setTimeout(function () { setFigure(id); }, 360);
    setTimeout(function () { wrap.classList.remove("twirl"); wrap.classList.add("idle"); }, 820);
  }

  /* =================== reel challenge =================== */
  var loops = { how: null, idea: null };

  // The elf and the snowman act out each challenge on the phone.
  // Props appear per beat (0, 1, 2) through CSS: see "mini scenes" in room.css.
  var PAW = '<svg viewBox="0 0 40 40"><ellipse cx="20" cy="26" rx="11" ry="9" fill="#fff4ea" stroke="#c9a38a" stroke-width="2"/><g fill="#f2a7b5"><ellipse cx="20" cy="27" rx="6" ry="4.5"/><circle cx="10" cy="15" r="4"/><circle cx="17" cy="10" r="4"/><circle cx="24" cy="10" r="4"/><circle cx="31" cy="15" r="4"/></g></svg>';
  var HAT = '<svg viewBox="0 0 60 50"><path d="M8 40 Q20 6 46 4 Q40 18 52 40z" fill="#c62f36"/><rect x="2" y="38" width="56" height="10" rx="5" fill="#fff"/><circle cx="47" cy="5" r="5" fill="#fff"/></svg>';
  var SHADES = '<svg viewBox="0 0 60 20"><rect x="2" y="3" width="24" height="14" rx="6" fill="#1b1b1b"/><rect x="34" y="3" width="24" height="14" rx="6" fill="#1b1b1b"/><path d="M26 8h8" stroke="#1b1b1b" stroke-width="3"/><path d="M7 6l8 0" stroke="#fff" stroke-width="2" opacity=".6"/></svg>';
  var OAR = '<svg viewBox="0 0 20 120"><rect x="8" y="0" width="5" height="88" rx="2" fill="#8a5a32"/><path d="M3 86h15l-2 30q-6 6-11 0z" fill="#b07a45"/></svg>';
  var HEART = '<svg viewBox="0 0 24 22"><path d="M12 21C5 15 1 11 1 6.5A5.5 5.5 0 0 1 12 4a5.5 5.5 0 0 1 11 2.5C23 11 19 15 12 21z" fill="#e0607e"/></svg>';
  function props(who) {
    return '<i class="p paw paw-l">' + PAW + '</i><i class="p paw paw-r">' + PAW + "</i>" +
      '<i class="p hat">' + HAT + '</i><i class="p q">?</i><i class="p grr">GRR!</i><i class="p pfft">pfft…</i>' +
      '<i class="p heart">' + HEART + "</i>" + (who === "elf" ? '<i class="p shades">' + SHADES + "</i>" : '<i class="p oar">' + OAR + "</i>");
  }
  function miniScene(scene, beat, extra) {
    return '<div class="mini ' + (extra || "") + '" data-idea="' + esc(scene || "meow") + '" data-beat="' + (beat || 0) + '">' +
      '<div class="mini-bg"></div><i class="corners"></i>' +
      '<div class="ch ch-elf"><img src="assets/room/elf.png" alt="">' + props("elf") + "</div>" +
      '<div class="ch ch-snow"><img src="assets/room/snowman.png" alt="">' + props("snow") + "</div>" +
      '<i class="sparks"></i></div>';
  }
  function setBeat(box, scene, beat) {
    var m = box.firstElementChild;
    if (!m || m.dataset.idea !== scene) { box.innerHTML = miniScene(scene, beat); return; }
    m.dataset.beat = beat;
  }

  function renderReels() {
    var r = R.reels;
    $("#howSteps").innerHTML = (r.facts || []).map(function (f, i) {
      return '<li data-step="' + i + '"><b>' + esc(tx(f.label)) + "</b><span>" + esc(tx(f.text)) + "</span><i></i></li>";
    }).join("");
    $("#ideaTabs").innerHTML = (r.ideas || []).map(function (d, i) {
      return '<button type="button" role="tab" data-idea="' + i + '" aria-selected="' + (state.idea === i) + '">' +
        '<span class="thumb">' + miniScene(d.scene, 1, "still") + "</span><b>" + esc(tx(d.name)) + "</b></button>";
    }).join("");
    renderIdeaInfo();
    renderLibrary();
    $("#reelTips").innerHTML = (tx(r.tips) || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
    var d0 = (r.ideas || [])[0]; if (d0) setBeat($("#howFrame"), d0.scene, 0);
  }

  function renderIdeaInfo() {
    var d = (R.reels.ideas || [])[state.idea]; if (!d) return;
    setBeat($("#ideaFrame"), d.scene, 0);
    $("#ideaInfo").innerHTML = "<h4>" + esc(tx(d.name)) + '</h4><p class="beats">' +
      (tx(d.beats) || []).map(function (b) { return "<span>" + esc(b) + "</span>"; }).join("") + "</p>" +
      "<p>" + esc(tx(d.how)) + '</p><p class="chips"><span>' + esc(d.length || "") + "</span>" + (d.seated ? "<span>" + u("seated") + "</span>" : "") + "</p>" +
      (d.watch ? '<a class="pin" href="' + esc(safeUrl(d.watch)) + '" target="_blank" rel="noopener">' + u("watch") + "</a>" : "");
  }

  function renderLibrary() {
    var lib = {}, base = R.reels.library || {};
    lib.ideas = (R.reels.ideas || []).filter(function (d) { return d.watch; }).map(function (d) { return { title: tx(d.name), url: d.watch }; });
    Object.keys(base).forEach(function (k) { lib[k] = base[k]; });
    var keys = Object.keys(lib).filter(function (k) { return (lib[k] || []).length; });
    if (keys.indexOf(state.lib) < 0) state.lib = keys[0];
    $("#libTabs").innerHTML = keys.map(function (k) {
      return '<button type="button" role="tab" data-lib="' + esc(k) + '" aria-selected="' + (k === state.lib) + '">' + esc(k === "ideas" ? u("ideasTab") : (u("genres")[k] || k)) + " <small>" + (lib[k] || []).length + "</small></button>";
    }).join("");
    $("#libList").innerHTML = (lib[state.lib] || []).map(function (v) {
      return '<li><a href="' + esc(safeUrl(v.url)) + '" target="_blank" rel="noopener"><span class="play" aria-hidden="true">▶</span><span>' + esc(v.title) + '</span><span class="ext" aria-hidden="true">↗</span></a></li>';
    }).join("");
  }

  function mmss(sec) { sec = Math.floor(sec); return "00:" + (sec < 10 ? "0" : "") + sec; }

  // "How it works": the phone records 0→30s while the four steps light up in turn,
  // and the elf and snowman run through a challenge on screen.
  var how = { start: 0, step: -1, beat: -1, STEP: 3600 };
  function howTick(now) {
    var facts = R.reels.facts || [], n = facts.length || 1, total = how.STEP * n, ideas = R.reels.ideas || [];
    var e = (now - how.start) % total, step = Math.floor(e / how.STEP);
    var f = Math.floor((e % how.STEP) / (how.STEP / 3));
    if (step !== how.step) {
      how.step = step;
      $$("#howSteps li").forEach(function (li, i) { li.classList.toggle("on", i === step); li.style.setProperty("--dur", (how.STEP / 1000) + "s"); });
    }
    if (f !== how.beat || step !== how.stepShown) {
      how.beat = f; how.stepShown = step;
      var d = ideas[step % (ideas.length || 1)];
      if (d) setBeat($("#howFrame"), d.scene, f);
    }
    $("#howTimer").textContent = mmss(e / total * 30);
    $("#howBar").style.width = (e / total * 100).toFixed(1) + "%";
    loops.how = requestAnimationFrame(howTick);
  }
  // Challenge idea: the elf and snowman perform its three beats
  var idea = { start: 0, beat: -1, BEAT: 1800 };
  function ideaTick(now) {
    var d = (R.reels.ideas || [])[state.idea]; if (!d) return;
    var total = idea.BEAT * 3, e = (now - idea.start) % total, b = Math.floor(e / idea.BEAT);
    if (b !== idea.beat) {
      idea.beat = b;
      setBeat($("#ideaFrame"), d.scene, b);
      var beat = $("#ideaBeat"); beat.textContent = (tx(d.beats) || [])[b] || "";
      beat.classList.remove("pop"); void beat.offsetWidth; beat.classList.add("pop");
    }
    var secs = parseInt(d.length, 10) || 15;
    $("#ideaTimer").textContent = mmss(e / total * secs);
    $("#ideaBar").style.width = (e / total * 100).toFixed(1) + "%";
    loops.idea = requestAnimationFrame(ideaTick);
  }
  function startReelLoops() {
    stopReelLoops();
    if (reduced) {
      $$("#howSteps li").forEach(function (li) { li.classList.add("on"); });
      var d0 = (R.reels.ideas || [])[0]; if (d0) setBeat($("#howFrame"), d0.scene, 1);
      var d = (R.reels.ideas || [])[state.idea]; if (d) { setBeat($("#ideaFrame"), d.scene, 1); $("#ideaBeat").textContent = (tx(d.beats) || []).join(" → "); }
      return;
    }
    how.start = performance.now(); how.step = -1; how.beat = -1; how.stepShown = -1; idea.start = performance.now(); idea.beat = -1;
    loops.how = requestAnimationFrame(howTick); loops.idea = requestAnimationFrame(ideaTick);
  }
  function stopReelLoops() { cancelAnimationFrame(loops.how); cancelAnimationFrame(loops.idea); }

  /* =================== floor plan =================== */
  function renderFloor() {
    var f = R.floor, img = $("#floorImg");
    img.onerror = function () { $(".blueprint").hidden = true; };
    if (img.getAttribute("src") !== f.image) img.src = f.image;
    $("#floorLink").href = f.image;
    $("#floorAreas").innerHTML = (f.areas || []).map(function (a, i) {
      return '<li><span class="pin-no">' + (i + 1) + "</span><b>" + esc(tx(a)) + "</b><span>" + esc(tx(a.note)) + "</span></li>";
    }).join("");
  }

  /* =================== text + language =================== */
  function renderText() {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    document.title = u("title");
    $$("[data-c]").forEach(function (n) { var v = tx(get(n.dataset.c)); n.textContent = Array.isArray(v) ? v.join(" ") : v; });
    $$("[data-ui]").forEach(function (n) { n.textContent = u(n.dataset.ui); });
    $("#langToggle").textContent = u("toggle");
    $("#langToggle").setAttribute("aria-label", u("langLabel"));
    var back = "index.html?return=1" + (lang === "zh" ? "&lang=zh" : "");
    $("#backHouse").href = back;
    if (state.genre) $("#bubble").textContent = tx(themeById(state.genre).name) + " ✦";
  }
  function planOn() { return !!(R && R.floor && R.floor.show); }
  function applyFeatures() {
    $$("[data-feature=plan]").forEach(function (n) { if (planOn()) n.removeAttribute("hidden"); else n.setAttribute("hidden", ""); });
    if (!planOn()) $$("[data-feature=plan]").forEach(function (n) { if (n.namespaceURI === NS) n.setAttribute("display", "none"); });
  }
  function markTabs() {
    $$("[data-switch]").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.switch === state.panel)); });
  }
  function renderAll() { renderText(); applyFeatures(); renderPicker(); renderDressInfo(false); renderReels(); renderFloor(); markTabs(); }

  /* =================== panels (zoom into an object, then open) =================== */
  var lastTrigger = null;
  function openPanel(name, trigger) {
    var p = $("#panel-" + name); if (!p || state.panel === name) return;
    if (name === "plan" && !planOn()) return;
    if (state.panel) closePanel(true);
    state.panel = name; lastTrigger = trigger || null;
    var v = $("#viewport");
    var show = function () {
      p.hidden = false; document.body.classList.add("panel-open");
      requestAnimationFrame(function () { p.classList.add("shown"); });
      p.scrollTop = 0;
      var c = $(".close", p); if (c) c.focus({ preventScroll: true });
      if (name === "reels") startReelLoops();
      markTabs();
    };
    if (trigger && trigger.closest && trigger.closest("#stage") && !reduced) {
      var vr = v.getBoundingClientRect(), tr = trigger.getBoundingClientRect();
      v.style.transformOrigin = (tr.left + tr.width / 2 - vr.left) + "px " + (tr.top + tr.height / 2 - vr.top) + "px";
      v.classList.add("zoom");
      setTimeout(show, 420);
    } else show();
    try { history.replaceState(null, "", location.pathname + location.search + "#" + name); } catch (e) {}
  }
  function closePanel(quick) {
    var name = state.panel; if (!name) return;
    var p = $("#panel-" + name); state.panel = null;
    stopReelLoops();
    p.classList.remove("shown");
    document.body.classList.remove("panel-open");
    $("#viewport").classList.remove("zoom");
    setTimeout(function () { if (state.panel !== name) p.hidden = true; }, quick ? 0 : 420);
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    if (lastTrigger && !quick) lastTrigger.focus({ preventScroll: true });
  }

  /* =================== the entrance =================== */
  function finishEntrance() {
    var en = $("#entrance");
    document.body.classList.remove("is-entering");
    en.classList.add("gone");
    document.body.classList.add("ready");
    $("#viewport").classList.remove("walking");
    var vid = $("#entranceVideo"); try { vid.pause(); } catch (e) {}
    setTimeout(function () { en.hidden = true; }, 750);
  }
  function doors() {
    setTimeout(function () {
      $("#entrance").classList.add("open");
      document.body.classList.remove("is-entering");
      $("#viewport").classList.add("walking");
    }, 650);
    setTimeout(finishEntrance, 2600);
  }
  function runEntrance(skip) {
    if (skip || reduced) {
      document.body.classList.remove("is-entering");
      var en = $("#entrance"); en.hidden = true; document.body.classList.add("ready");
      return;
    }
    var src = R.scene && R.scene.entranceVideo, done = false;
    if (!src || !window.fetch) { doors(); return; }
    var timer = setTimeout(function () { if (!done) { done = true; doors(); } }, 900);
    fetch(src, { method: "HEAD", cache: "no-store" }).then(function (res) {
      if (done) return; done = true; clearTimeout(timer);
      if (!res.ok) { doors(); return; }
      var en = $("#entrance"), vid = $("#entranceVideo");
      en.classList.add("has-video"); vid.src = src;
      vid.onended = finishEntrance; vid.onerror = function () { en.classList.remove("has-video"); doors(); };
      document.body.classList.remove("is-entering");
      var pr = vid.play(); if (pr && pr.catch) pr.catch(function () { en.classList.remove("has-video"); doors(); });
    }).catch(function () { if (!done) { done = true; clearTimeout(timer); doors(); } });
  }

  /* =================== events =================== */
  function bind() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return;
      var o = t.closest("[data-open]"); if (o) { openPanel(o.dataset.open, o); return; }
      if (t.closest("[data-close]")) { closePanel(); return; }
      var sw = t.closest("[data-switch]");
      if (sw) { var to = sw.dataset.switch; if (to !== state.panel) { var keep = lastTrigger; closePanel(true); lastTrigger = keep; openPanel(to, null); } return; }
      var g = t.closest("#genrePicker button, .cover"); if (g) { chooseGenre(g.dataset.g); return; }
      var sh = t.closest(".shot"); if (sh) { lightbox(photosOf(themeById(state.genre)), Number(sh.dataset.shot)); return; }
      var s = t.closest("#howSteps li"); if (s && !reduced) { how.start = performance.now() - Number(s.dataset.step) * how.STEP; how.step = -1; return; }
      var i = t.closest("#ideaTabs button");
      if (i) { state.idea = Number(i.dataset.idea); $$("#ideaTabs button").forEach(function (b) { b.setAttribute("aria-selected", String(b === i)); });
               renderIdeaInfo(); idea.start = performance.now(); idea.beat = -1; if (reduced) startReelLoops(); return; }
      var l = t.closest("#libTabs button"); if (l) { state.lib = l.dataset.lib; renderLibrary(); var nb = $('#libTabs [data-lib="' + state.lib + '"]'); if (nb) nb.focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (lbOpen()) { if (e.key === "Escape") closeLb(); else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1); return; }
      if (e.key === "Escape" && state.panel) closePanel();
    });
    $("#skipEntrance").addEventListener("click", finishEntrance);
    $("#langToggle").addEventListener("click", function () {
      lang = lang === "zh" ? "en" : "zh";
      var p = new URLSearchParams(location.search);
      if (lang === "zh") p.set("lang", "zh"); else p.delete("lang");
      try { history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : "") + location.hash); } catch (e) {}
      if (R) { renderAll(); if (state.panel === "reels") startReelLoops(); }
    });
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fit, 80); });
    window.addEventListener("hashchange", function () {
      var h = location.hash.slice(1);
      if (["dress", "reels", "plan"].indexOf(h) >= 0) openPanel(h); else if (state.panel) closePanel();
    });
  }

  /* =================== start: load the words fresh every visit =================== */
  function fail() {
    document.body.classList.remove("is-entering");
    $("#entrance").hidden = true;
    $("#oops").hidden = false; $("#oops p").textContent = u("oops");
  }
  buildScene(); fit(); setFigure("base"); $("#figWrap").classList.add("idle"); bind();
  var sc = document.createElement("script");
  sc.src = "room-content.js?t=" + Date.now();
  sc.onload = function () {
    R = window.ROOM;
    if (!R || !R.themes || !R.reels) { fail(); return; }
    try { renderAll(); } catch (err) { console.error(err); fail(); return; }
    var h = location.hash.slice(1), deep = ["dress", "reels"].indexOf(h) >= 0 || (h === "plan" && planOn());
    runEntrance(deep);
    if (deep) openPanel(h);
  };
  sc.onerror = fail;
  document.head.appendChild(sc);
})();
