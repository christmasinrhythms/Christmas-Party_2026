/* =====================================================================
   ✏️  INSIDE THE HOUSE — all the words on the ballroom page live here.

   How to edit safely:
     • Only change text inside the "quotes".
     • Every line that ends with "…" needs a comma , after it
       (except the last item before a closing ] or }).
     • en = English, zh = 繁體中文. Update both if you can.
     • If the page shows "Content is being updated", a comma or quote
       is missing here. Undo your last change in GitHub → History.

   Pictures go in assets/room/ with the exact names written below.
   A missing picture never breaks the page; it just isn't shown.
   ===================================================================== */

window.ROOM = {

  lastUpdated: { en: "25 Nov 2026", zh: "2026年11月25日" },

  /* ---------- The ballroom (first screen after the doors open) ---------- */
  scene: {
    title: { en: "Welcome to the ballroom", zh: "歡迎來到宴會廳" },
    hint:  { en: "Tap a sign — or the mirror or camera — to explore", zh: "點按木牌、鏡子或攝影機，開始探索" },
    // What the elf and the snowman say in the ballroom (they take turns).
    elfLines: {
      en: ["Merry Christmas!", "Let's get you dressed!", "Ho ho ho!", "Snowball fight!", "Tap the mirror!"],
      zh: ["聖誕快樂！", "一齊換衫啦！", "Ho ho ho！", "擲雪球啦！", "點按鏡子！"]
    },
    snowmanLines: {
      en: ["Merry Christmas!", "Lights, camera, action!", "Brrr… dance with me!", "Missed me!", "Tap the camera!"],
      zh: ["聖誕快樂！", "準備，開機！", "好凍呀…一齊跳舞！", "擲唔中！", "點按攝影機！"]
    },
    // Optional Higgsfield video of walking in through the doors (MP4).
    // If the file isn't there, the page plays its own door animation.
    entranceVideo: "assets/room/entrance.mp4"
  },

  hotspots: {
    dress: { label: { en: "How should I dress?", zh: "應該怎樣打扮？" }, sub: { en: "4 genres to try on", zh: "四種曲風任你試" } },
    reels: { label: { en: "Reel challenge", zh: "短片挑戰" },       sub: { en: "30s–1 min · funny MVs", zh: "30秒至1分鐘・搞笑MV" } },
    plan:  { label: { en: "Floor plan", zh: "場地佈局" },           sub: { en: "Tentative", zh: "暫定" } }
  },

  /* ---------- 1. How should I dress? ---------- */
  themes: {
    title:  { en: "How should I dress?", zh: "應該怎樣打扮？" },
    intro:  { en: "Pick a genre and get inspired — then freestyle your own look!", zh: "揀個曲風，睇吓靈感——然後自由發揮！" },
    prompt: { en: "Pick a genre!", zh: "揀個曲風！" },

    // Each genre's reference photos live in assets/room/looks/.
    // To add a photo: upload it there, then copy one { src: … } line below,
    // change the file name, and keep a comma between lines.
    list: [
      {
        id: "rock",
        name: { en: "Rock & Punk", zh: "搖滾龐克" },
        colours: ["#1d1a19", "#8f1f24"],
        photos: [
          { src: "assets/room/looks/rock-1.jpg" },
          { src: "assets/room/looks/rock-2.jpg" },
          { src: "assets/room/looks/rock-3.jpg" },
          { src: "assets/room/looks/rock-4.jpg" },
          { src: "assets/room/looks/rock-5.jpg" },
          { src: "assets/room/looks/rock-6.jpg" }
        ]
      },
      {
        id: "disco",
        name: { en: "Disco Vibe", zh: "迪斯可熱潮" },
        colours: ["#d4a537", "#b8336a"],
        photos: [
          { src: "assets/room/looks/disco-1.jpg" },
          { src: "assets/room/looks/disco-2.jpg" },
          { src: "assets/room/looks/disco-3.jpg" },
          { src: "assets/room/looks/disco-4.jpg" },
          { src: "assets/room/looks/disco-5.jpg" }
        ]
      },
      {
        id: "kpop",
        name: { en: "K-pop", zh: "韓流K-pop" },
        colours: ["#f2b8c6", "#6d9cc7"],
        photos: [
          { src: "assets/room/looks/kpop-1.jpg" },
          { src: "assets/room/looks/kpop-2.jpg" },
          { src: "assets/room/looks/kpop-3.jpg" },
          { src: "assets/room/looks/kpop-4.jpg" },
          { src: "assets/room/looks/kpop-5.jpg" },
          { src: "assets/room/looks/kpop-6.jpg" }
        ]
      },
      {
        id: "jazz",
        name: { en: "Jazz & Classic", zh: "爵士古典" },
        colours: ["#1f2a3a", "#c8a24a"],
        photos: [
          { src: "assets/room/looks/jazz-1.jpg" },
          { src: "assets/room/looks/jazz-2.jpg" },
          { src: "assets/room/looks/jazz-3.jpg" },
          { src: "assets/room/looks/jazz-4.jpg" },
          { src: "assets/room/looks/jazz-5.jpg" },
          { src: "assets/room/looks/jazz-6.jpg" },
          { src: "assets/room/looks/jazz-7.jpg" },
          { src: "assets/room/looks/jazz-8.jpg" },
          { src: "assets/room/looks/jazz-9.jpg" }
        ]
      }
    ]
  },

  /* ---------- 2. Reel challenge ---------- */
  reels: {
    title: { en: "Reel challenge", zh: "短片挑戰" },
    snowmanSays: { en: "Have fun with it!", zh: "盡情玩得開心！" },
    rulesTitle: { en: "The rules", zh: "規則" },
    rules: {
      en: "Make a 30-second to 1-minute reel with your table. Recreate a funny MV — freestyle and have fun!",
      zh: "全桌合力拍一段30秒至1分鐘的短片，重現一段搞笑MV——自由發揮，玩得開心！"
    },

    // Links are just for fun — teams can pick anything.
    // Each line: title, artist, and a url. Without a url, the button searches YouTube.
    mvTitle: { en: "Need ideas? Just for fun", zh: "想要靈感？純粹參考" },
    featuredTitle: { en: "Hot picks", zh: "熱門推介" },
    featured: [
      { title: "Riau boat race dance (aura farming)", artist: "Viral", genre: "fun", url: "https://www.youtube.com/watch?v=ciZBZtX3vN4" },
      { title: "Nothing beats a Jet2 holiday", artist: "Viral", genre: "fun", search: "nothing beats a jet2 holiday" },
      { title: "When We Disco (Duet with SUNMI) — dance tutorial", artist: "J.Y. Park", genre: "disco", url: "https://www.youtube.com/shorts/B8IJIAyLDco" },
      { title: "Hong Kong (feat. Faye Wong)", artist: "The Weeknd", genre: "jazz", search: "The Weeknd Hong Kong official video" }
    ],
    mvs: {
      fun: [
        { title: "Riau boat race dance (aura farming)", artist: "Viral", url: "https://www.youtube.com/watch?v=ciZBZtX3vN4" },
        { title: "Nothing beats a Jet2 holiday", artist: "Viral", search: "nothing beats a jet2 holiday" }
      ],
      rock: [
        { title: "Don't Stop Me Now", artist: "Queen" },
        { title: "Livin' On A Prayer", artist: "Bon Jovi" },
        { title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
        { title: "Sk8er Boi", artist: "Avril Lavigne" },
        { title: "海闊天空", artist: "Beyond" }
      ],
      disco: [
        { title: "When We Disco (Duet with SUNMI)", artist: "J.Y. Park" },
        { title: "Stayin' Alive", artist: "Bee Gees" },
        { title: "Dancing Queen", artist: "ABBA" },
        { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
        { title: "Levitating", artist: "Dua Lipa" }
      ],
      kpop: [
        { title: "Dynamite", artist: "BTS" },
        { title: "APT.", artist: "ROSÉ & Bruno Mars" },
        { title: "Gangnam Style", artist: "PSY" },
        { title: "How You Like That", artist: "BLACKPINK" },
        { title: "Super Shy", artist: "NewJeans" }
      ],
      jazz: [
        { title: "Hong Kong (feat. Faye Wong)", artist: "The Weeknd", search: "The Weeknd Hong Kong official video" },
        { title: "Leave the Door Open", artist: "Silk Sonic" },
        { title: "It's Beginning to Look a Lot Like Christmas", artist: "Michael Bublé" },
        { title: "Ain't No Other Man", artist: "Christina Aguilera" },
        { title: "Lone Digger", artist: "Caravan Palace" }
      ]
    },

    tipsTitle: { en: "Quick tips", zh: "小貼士" },
    tips: {
      en: ["Film vertically, facing the light.", "Seated moves are welcome — no standing on chairs.", "30 seconds to 1 minute."],
      zh: ["直向拍攝，面向光源。", "歡迎坐着演出——請勿站在椅上。", "片長30秒至1分鐘。"]
    }
  },

  /* ---------- 3. Floor plan ---------- */
  floor: {
    // Change false to true to show the floor plan in the ballroom again.
    show: false,
    title:  { en: "The ballroom plan", zh: "宴會廳佈局" },
    status: { en: "The layout may still change.", zh: "佈局或有更改。" },
    intro:  {
      en: "Here's how the Grand Ballroom is shaping up. Your table number will be shared closer to the day.",
      zh: "以下是宴會廳的初步佈局。桌號將於臨近活動時公布。"
    },
    // Replace this picture when the plan changes (keep the same file name).
    image: "assets/room/floor-plan.png",
    areas: [
      { en: "Reception & welcome drinks", zh: "接待處及迎賓飲品", note: { en: "Outside the ballroom, with cocktail tables and the bar", zh: "宴會廳外，設雞尾酒桌及酒吧" } },
      { en: "Buffet",                     zh: "自助餐",         note: { en: "Hot dishes, appetisers, desserts, coffee & tea", zh: "熱盤、小食、甜品、咖啡及茶" } },
      { en: "Dining tables",              zh: "餐桌",           note: { en: "About 20 round tables", zh: "約20張圓桌" } },
      { en: "Stage & screens",            zh: "舞台及屏幕",     note: { en: "Stage at the far end; screens at both ends", zh: "舞台在盡頭，兩端設有屏幕" } }
    ]
  }

};
