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
    elfSays:     { en: "Let's get you dressed!", zh: "一齊換衫啦！" },
    snowmanSays: { en: "Lights, camera, action!", zh: "準備，開機！" },
    // Optional Higgsfield video of walking in through the doors (MP4).
    // If the file isn't there, the page plays its own door animation.
    entranceVideo: "assets/room/entrance.mp4"
  },

  hotspots: {
    dress: { label: { en: "How should I dress?", zh: "應該怎樣打扮？" }, sub: { en: "4 genres to try on", zh: "四種曲風任你試" } },
    reels: { label: { en: "Reel challenge", zh: "短片挑戰" },       sub: { en: "15–30s · one per table", zh: "15–30秒・每桌一段" } },
    plan:  { label: { en: "Floor plan", zh: "場地佈局" },           sub: { en: "Tentative", zh: "暫定" } }
  },

  /* ---------- 1. How should I dress? ---------- */
  themes: {
    title:  { en: "How should I dress for the Christmas party?", zh: "聖誕派對應該怎樣打扮？" },
    intro:  {
      en: "Dress code: wear your favourite music genre. Pick one and watch the look change — then remix what you already own, no need to buy anything new.",
      zh: "服裝主題：穿出你最愛的音樂曲風。揀一個曲風，看看造型如何變身——用衣櫃現有衣物配搭便可，毋須特意添置。"
    },
    prompt: { en: "Pick a genre and I'll change!", zh: "揀個曲風，我即刻換裝！" },
    // Optional reference pictures (Higgsfield or free photos):
    // assets/room/theme-rock.jpg, theme-disco.jpg, theme-kpop.jpg, theme-jazz.jpg
    list: [
      {
        id: "rock", image: "assets/room/theme-rock.jpg",
        // REAL-LIFE LOOKS: paste a Pinterest board link between the quotes,
        // e.g. "https://www.pinterest.com/yourname/rock-punk-looks/"
        pinterestBoard: "",
        // …or list photos saved in assets/room/looks/ (credit is optional)
        photos: [
          { src: "assets/room/looks/rock-1.jpg", credit: "" },
          { src: "assets/room/looks/rock-2.jpg", credit: "" }
        ],
        name:    { en: "Rock & Punk", zh: "搖滾龐克" },
        tagline: { en: "Loud, a little rebellious, all attitude.", zh: "大聲、帶點反叛、氣場全開。" },
        colours: ["#1d1a19", "#8f1f24", "#c9c3b8", "#4a4f57"],
        pieces:  { en: ["Leather or denim jacket", "Band T-shirt or black tee", "Ripped black jeans or tartan skirt", "Boots or high-top sneakers"],
                   zh: ["皮褸或牛仔外套", "樂隊T恤或黑色T恤", "破洞黑牛仔褲或格仔裙", "靴或高筒波鞋"] },
        extras:  { en: ["Studs, chains, safety pins", "Wristbands and rings", "Smoky eyeliner, spiky hair"],
                   zh: ["鉚釘、鏈條、扣針", "手帶及戒指", "煙燻眼線、尖刺髮型"] },
        easy:    { en: "Black tee + denim jacket + one studded accessory.", zh: "黑T恤＋牛仔外套＋一件鉚釘配飾。" },
        allOut:  { en: "Full leather, tartan, chains and coloured hair spray.", zh: "全身皮革、格仔、鏈條，再加彩色噴髮。" },
        search:  "rock punk party outfit"
      },
      {
        id: "disco", image: "assets/room/theme-disco.jpg",
        // REAL-LIFE LOOKS: paste a Pinterest board link between the quotes,
        // e.g. "https://www.pinterest.com/yourname/rock-punk-looks/"
        pinterestBoard: "",
        // …or list photos saved in assets/room/looks/ (credit is optional)
        photos: [
          { src: "assets/room/looks/disco-1.jpg", credit: "" },
          { src: "assets/room/looks/disco-2.jpg", credit: "" }
        ],
        name:    { en: "Disco Vibe", zh: "迪斯可熱潮" },
        tagline: { en: "Sparkle under the mirror ball.", zh: "在鏡面球下閃閃發光。" },
        colours: ["#d4a537", "#b8336a", "#2f6f8f", "#e8e1d0"],
        pieces:  { en: ["Sequin, satin or metallic top", "Flared trousers or a jumpsuit", "Wide-collar shirt", "Platform shoes or boots"],
                   zh: ["亮片、緞面或金屬感上衣", "喇叭褲或連身褲", "大翻領恤衫", "厚底鞋或靴"] },
        extras:  { en: ["Big sunglasses", "Headband or afro wig", "Gold jewellery and glitter"],
                   zh: ["大框太陽眼鏡", "頭帶或爆炸頭假髮", "金色首飾及閃粉"] },
        easy:    { en: "One sparkly top + flares or wide-leg trousers.", zh: "一件閃亮上衣＋喇叭褲或闊腳褲。" },
        allOut:  { en: "Head-to-toe sequins, platforms and a mirror-ball prop.", zh: "全身亮片、厚底鞋，再拿一個鏡面球道具。" },
        search:  "70s disco party outfit"
      },
      {
        id: "kpop", image: "assets/room/theme-kpop.jpg",
        // REAL-LIFE LOOKS: paste a Pinterest board link between the quotes,
        // e.g. "https://www.pinterest.com/yourname/rock-punk-looks/"
        pinterestBoard: "",
        // …or list photos saved in assets/room/looks/ (credit is optional)
        photos: [
          { src: "assets/room/looks/kpop-1.jpg", credit: "" },
          { src: "assets/room/looks/kpop-2.jpg", credit: "" }
        ],
        name:    { en: "K-pop", zh: "韓流K-pop" },
        tagline: { en: "Stage-ready, coordinated, camera-friendly.", zh: "舞台感、整齊劃一、上鏡一流。" },
        colours: ["#f2b8c6", "#6d9cc7", "#ffffff", "#232323"],
        pieces:  { en: ["Oversized blazer or bomber jacket", "Cargo pants or pleated skirt", "Layered streetwear", "Chunky sneakers"],
                   zh: ["寬身西裝外套或飛行褸", "工裝褲或百褶裙", "多層次街頭服飾", "厚底波鞋"] },
        extras:  { en: ["Bucket hat or beanie", "Chains and hair clips", "A little glitter"],
                   zh: ["漁夫帽或冷帽", "鏈飾及髮夾", "少量閃粉"] },
        easy:    { en: "Match one colour with your table, like a group concept.", zh: "全桌配襯同一顏色，像團體概念造型。" },
        allOut:  { en: "Coordinated stage outfits with a shared colour story.", zh: "全桌整套舞台造型，用同一色系呼應。" },
        search:  "kpop stage outfit"
      },
      {
        id: "jazz", image: "assets/room/theme-jazz.jpg",
        // REAL-LIFE LOOKS: paste a Pinterest board link between the quotes,
        // e.g. "https://www.pinterest.com/yourname/rock-punk-looks/"
        pinterestBoard: "",
        // …or list photos saved in assets/room/looks/ (credit is optional)
        photos: [
          { src: "assets/room/looks/jazz-1.jpg", credit: "" },
          { src: "assets/room/looks/jazz-2.jpg", credit: "" }
        ],
        name:    { en: "Jazz & Classic", zh: "爵士古典" },
        tagline: { en: "Old-school glamour, swing and strings.", zh: "復古華麗，搖擺與弦樂之間。" },
        colours: ["#1f2a3a", "#c8a24a", "#f3ead7", "#6b2232"],
        pieces:  { en: ["Suit, waistcoat or tuxedo", "Bow tie and suspenders", "Flapper or cocktail dress", "Polished shoes"],
                   zh: ["西裝、背心或禮服", "煲呔及吊帶", "1920年代流蘇裙或雞尾酒裙", "擦亮的皮鞋"] },
        extras:  { en: ["Fedora or feather headband", "Pearls and gloves", "Pocket square"],
                   zh: ["紳士帽或羽毛頭飾", "珍珠及手套", "袋巾"] },
        easy:    { en: "White shirt + bow tie, or a little black dress + pearls.", zh: "白恤衫＋煲呔，或黑色小禮服＋珍珠。" },
        allOut:  { en: "Full Gatsby glamour: feathers, pearls and pinstripes.", zh: "全套大亨小傳風格：羽毛、珍珠、細條紋。" },
        search:  "1920s jazz gatsby outfit"
      }
    ],
    tips: {
      en: ["Comfort first — you'll be filming a reel, so wear shoes you can move in.", "Coordinate with your table for a stronger reel.", "Keep props light and easy to carry."],
      zh: ["舒適至上——當日要拍短片，請穿方便活動的鞋。", "與同桌協調造型，拍出來更有氣勢。", "道具宜輕便易攜。"]
    }
  },

  /* ---------- 2. Reel challenge ---------- */
  reels: {
    title: { en: "Reel challenge", zh: "短片挑戰" },
    // Change this note when the final brief is confirmed.
    status: {
      en: "A guide to help you prepare — the final challenge, table line-up, clip length and judging will be announced on the day.",
      zh: "此為準備參考——正式題目、桌別安排、片長及評選方式將於當日公布。"
    },
    howTitle: { en: "How it works", zh: "玩法" },
    snowmanSays: { en: "Here's how your table's reel works!", zh: "你們這桌的短片，玩法如下！" },
    // The animated steps beside the phone.
    facts: [
      { icon: "table", label: { en: "One reel per table",  zh: "每桌一段" },  text: { en: "The whole table joins in — faces and comic timing beat dance skills.", zh: "全桌一齊參與——表情和笑位比舞技更重要。" } },
      { icon: "phone", label: { en: "15–30 seconds",       zh: "15–30秒" },   text: { en: "Vertical 9:16, filmed on one phone.", zh: "直向9:16，用一部手機拍攝。" } },
      { icon: "clock", label: { en: "About 25 minutes",    zh: "約25分鐘" },  text: { en: "Filmed at the hotel before the MC opening.", zh: "於酒店現場、司儀開場前拍攝。" } },
      { icon: "star",  label: { en: "Screened on the day", zh: "當日播放" },  text: { en: "Every table's reel is shown at the party.", zh: "各桌作品將於派對上播放。" } }
    ],
    rolesTitle: { en: "Roles at your table", zh: "全桌分工" },
    roles: [
      { en: "Director",   zh: "導演", note: { en: "Keeps the idea and timing", zh: "掌握構思及節奏" } },
      { en: "Camera",     zh: "攝影", note: { en: "Films steady, vertical takes", zh: "穩定直向拍攝" } },
      { en: "Performers", zh: "演出", note: { en: "Everyone else — commit to it!", zh: "其餘所有人——全情投入！" } },
      { en: "Submitter",  zh: "交片", note: { en: "Sends the final clip", zh: "負責提交最終片段" } }
    ],
    planTitle: { en: "Your 25 minutes", zh: "你的25分鐘" },
    plan: [
      { min: 3, en: "Read the brief, split roles",   zh: "看題目、分工" },
      { min: 5, en: "Learn 2–3 moves",               zh: "學兩至三個動作" },
      { min: 4, en: "Plan your genre and formation", zh: "設計曲風及隊形" },
      { min: 8, en: "Record 2–3 takes",              zh: "試拍兩至三次" },
      { min: 5, en: "Review and retake",             zh: "檢視及補拍" }
    ],

    // Challenge ideas. Each storyboard picture has 3 frames side by side.
    ideasTitle: { en: "Challenge ideas", zh: "挑戰點子" },
    ideas: [
      {
        image: "assets/room/reel-meow-poker-face.jpg",
        name:  { en: "Meow Poker Face", zh: "貓爪忍笑" },
        beats: { en: ["Deadpan", "Cat paws", "Hold the laugh"], zh: ["冷面", "貓爪", "忍笑定格"] },
        how:   { en: "5s everyone deadpan, 5s one person suddenly makes cat paws and the rest copy, 5s stay serious while trying not to laugh.",
                 zh: "5秒全員冷面，5秒一人突然做貓爪、其餘跟做，5秒保持嚴肅卻努力忍笑。" },
        length: "15s", seated: true,
        watch: "https://www.youtube.com/watch?v=BcZStyz6KcQ&t=234s"
      },
      {
        image: "assets/room/reel-expectation-vs-reality.jpg",
        name:  { en: "Expectation vs Reality", zh: "期望與現實" },
        beats: { en: ["Perfect photo", "Prop reveal", "Confident freeze"], zh: ["完美合照", "道具出錯", "自信定格"] },
        how:   { en: "4s elegant photo pose, 7s pull back to reveal upside-down props or mismatched hats, 4s everyone freezes, totally confident.",
                 zh: "4秒優雅合照，7秒鏡頭拉遠發現道具拿反或聖誕帽戴錯，4秒全員自信定格。" },
        length: "15–20s", seated: true,
        watch: "https://www.youtube.com/watch?v=nV02ig0Ahog"
      },
      {
        image: "assets/room/reel-grrr-call-response.jpg",
        name:  { en: "Grrr Call & Response", zh: "Grrr反差接力" },
        beats: { en: ["Puzzled", "Deadpan paws", "Cute freeze"], zh: ["疑惑", "冷面貓爪", "可愛定格"] },
        how:   { en: "5s half the table looks puzzled, 5s the other half answers with deadpan claws, 5s everyone switches to an over-the-top cute freeze.",
                 zh: "5秒半桌做疑惑表情，5秒另一半冷面貓爪回應，5秒全桌突然轉成誇張可愛定格。" },
        length: "15s", seated: true,
        watch: "https://www.youtube.com/watch?v=wHlAnhkLUvw"
      },
      {
        image: "assets/room/reel-aura-captain.jpg",
        name:  { en: "Aura Captain", zh: "冷面隊長" },
        beats: { en: ["Calm captain", "Pretend rowing", "Freeze"], zh: ["冷面隊長", "假划船", "一起定格"] },
        how:   { en: "A seated captain in sunglasses makes two slow hand moves while everyone behind mimes rowing, then the whole table freezes deadpan.",
                 zh: "戴墨鏡的隊長坐在前方做兩個慢手勢，後排同步假裝划船，最後全桌冷面定格。" },
        length: "15–20s", seated: true,
        watch: "https://www.youtube.com/watch?v=ciZBZtX3vN4"
      }
    ],

    // Genre inspiration videos (YouTube). Add or remove lines freely.
    libraryTitle: { en: "Reference links", zh: "參考連結" },
    libraryNote:  { en: "Videos to spark ideas — the challenge ideas first, then by genre. Not the official brief.", zh: "參考影片，助你構思——先看挑戰點子，再按曲風瀏覽。並非正式題目。" },
    library: {
      rock: [
        { title: "Rock Around the Clock — retro partner dance", url: "https://youtube.com/shorts/-aCYYTSNsy4" },
        { title: "Rock Around the Clock — Miranda Derrick & Bdash", url: "https://youtube.com/shorts/rWUKuIXjU1Q" }
      ],
      disco: [
        { title: "When We Disco — dance tutorial (J.Y. Park)", url: "https://youtube.com/shorts/B8IJIAyLDco" },
        { title: "You Should Be Dancing — 70s moves", url: "https://youtube.com/shorts/pcBmj3bumCg" },
        { title: "Retro disco mix — 80s dance", url: "https://youtube.com/shorts/JvmEne2Nslw" },
        { title: "When We Disco — group dance cover", url: "https://youtube.com/shorts/mUS8wq6cPcA" },
        { title: "When We Disco — challenge version", url: "https://youtube.com/shorts/hCw9VjBOL_k" }
      ],
      kpop: [
        { title: "Catch Catch challenge (YENA)", url: "https://youtube.com/shorts/2wXtGuQY6rA" },
        { title: "Disco in New York (NCT DREAM)", url: "https://youtube.com/shorts/zLJv7AHIRVM" },
        { title: "Yodel rush ride (TXT)", url: "https://youtube.com/shorts/MpOExZMtEc4" },
        { title: "dyk kyn dyk kyn (TXT)", url: "https://youtube.com/shorts/qrpsPc9y5sA" },
        { title: "c'mon MOA (TXT)", url: "https://youtube.com/shorts/NU6uFAUeVCM" },
        { title: "Soda Pop (NCT DREAM)", url: "https://youtube.com/shorts/UXRIZpomK50" }
      ],
      jazz: [
        { title: "Opera challenge #1", url: "https://youtube.com/shorts/3NV3M0gAmGQ" },
        { title: "Opera challenge #2", url: "https://youtube.com/shorts/g55Gac8nB0Y" },
        { title: "Viral opera challenge — try not to laugh", url: "https://youtube.com/shorts/pd66ZdMZ5g4" },
        { title: "Echoes of the jungle — singing challenge", url: "https://youtube.com/shorts/VdnslYwa1cU" },
        { title: "Can-can running trend", url: "https://youtube.com/shorts/zpchXk7oCDI" },
        { title: "Can you dance the Can-can?", url: "https://youtube.com/shorts/0fR2xPEzeCY" }
      ]
    },
    tipsTitle: { en: "Filming tips", zh: "拍攝小貼士" },
    tips: {
      en: ["Charge your phone and clear some storage.", "Film vertically, in good light, facing the light.", "Seated versions are welcome — no standing on chairs.", "Do a quick sound check before your final take."],
      zh: ["手機充滿電，並預留儲存空間。", "直向拍攝，面向光源，光線要充足。", "歡迎坐着演出——請勿站在椅上。", "最後一次拍攝前，先試試收音。"]
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
