const models = 'assets/tryon/models/';
const fittedModels = models + 'tripo/';
const upperBodyModels = fittedModels + 'upper-body/';
const referencePhotos = 'assets/interior/wall-photos/';
const lookImages = 'assets/tryon/looks/';

const head = (id, label, size = 1, rise = 0, { directory = fittedModels, ...fit } = {}) => ({
  model: directory + id + '.glb', label, size, rise, ...fit,
});
const look = (id, label, reference, options = {}) => ({
  id, label, reference, src: lookImages + id + '.webp', model: fittedModels + id + '.glb', sleeves: true, ...options,
});

export const tryonSchools = {
  rock: {
    name: ['Rock & Punk', 'Rock & Punk'], marque: 'ROCK & PUNK',
    tint: '#42121b', trim: '#ffc777', accent: '#dc3958', highlight: '#ff9859',
    looks: [
      look('rock', ['Studded Vest', '銀釘背心'], 'assets/tryon/rock-3d/outfit-reference.webp', {
        focus: '42% center', previewZoom: 1.18,
        src: 'assets/tryon/rock-3d/reference.webp', model: 'assets/tryon/rock-3d/rock-punk-vest-rigged.glb',
        sleeves: false, paint: true,
      }),
      look('punk-tongue', ['Tongue Tee & Leather', '紅唇 T 恤配皮褸'], referencePhotos + 'rock/ballroom-02.jpg', {
        head: head('punk-hair', ['Punk hair', '龐克尖刺髮型'], 1.04, .03),
      }),
    ],
  },
  jazz: {
    name: ['Jazz & Classic', 'Jazz & Classic'], marque: 'JAZZ & CLASSIC',
    tint: '#182749', trim: '#f4d087', accent: '#254bad', highlight: '#a2cfe9',
    looks: [
      look('jazz-baroque', ['Baroque Brocade', '巴洛克織錦禮服'], referencePhotos + 'jazz/images (80).jpeg', {
        head: head('jazz-wig', ['Powdered wig', '古典白色假髮'], 1.01, .02),
      }),
      look('jazz-gatsby', ['Gatsby Pinstripe', '蓋茨比直紋西裝'], referencePhotos + 'jazz/ballroom-01.jpg', {
        focus: 'right top', previewZoom: 1.38,
        head: head('jazz-fedora', ['Fedora', '復古禮帽'], 1, .05),
      }),
      look('jazz-flapper', ['Silver Flapper', '銀珠流蘇舞裙'], referencePhotos + 'jazz/ballroom-01.jpg', {
        focus: 'left top', previewZoom: 1.38, sleeves: false, head: head('jazz-feather', ['Feather headband', '羽毛頭帶'], 1.06, -.09),
      }),
    ],
  },
  kpop: {
    name: ['K-pop & Hip-Hop', 'K-pop & Hip-Hop'], marque: 'K-POP & HIP-HOP',
    tint: '#34135b', trim: '#ffc3f0', accent: '#bd42db', highlight: '#43e8e7',
    looks: [
      look('kpop-gold', ['Black & Gold Idol', '黑金偶像舞台裝'], referencePhotos + 'kpop/images (87).jpeg'),
      look('kpop-night', ['Dark Stage Armor + Crimson Hair', '暗黑舞台裝配酒紅挑染'], referencePhotos + 'kpop/images (91).jpeg', {
        head: head('kpop-crimson-hair', ['Crimson Hair', '酒紅挑染長髮'], 1.12, -.035, {
          directory: upperBodyModels, setback: .62, longHair: true,
        }),
      }),
      look('kpop-pink', ['Pink Royal Stage', '粉紅皇冠舞台裝'], referencePhotos + 'kpop/images (92).jpeg', {
        head: head('kpop-crown', ['Pink crown', '粉紅皇冠'], .99, .075),
      }),
      look('kpop-jersey', ['42 Street Jersey + Red Cap', '42 街頭球衣配紅帽'], referencePhotos + 'kpop/ce01e5690f53743945ee4faf486da4f9.jpg', {
        model: upperBodyModels + 'kpop-jersey.glb',
        preview: upperBodyModels + 'kpop-jersey.webp',
        upperBody: true,
        head: head('kpop-snapback', ['Red cap and hair', '紅色平頂帽連髮型'], 1.04, .015, { directory: upperBodyModels, setback: .49 }),
      }),
      look('kpop-tracksuit', ['Black & Gold Track Jacket', '復古黑金運動外套'], referencePhotos + 'kpop/images (80) copy.jpeg', {
        model: upperBodyModels + 'kpop-tracksuit.glb',
        preview: upperBodyModels + 'kpop-tracksuit.webp',
        upperBody: true,
        head: head('kpop-bucket-hat', ['Black bucket hat', '黑色漁夫帽'], 1.02, .046),
      }),
    ],
  },
  disco: {
    name: ['Disco Vibe', 'Disco Vibe'], marque: 'DISCO VIBE',
    tint: '#44154e', trim: '#ffc6ec', accent: '#e139b1', highlight: '#73c5ff',
    looks: [
      look('disco-magenta', ['Magenta Sequins', '桃紅閃片西裝'], referencePhotos + 'disco/images (79).jpeg', {
        head: head('disco-silver-hair', ['Silver hair plate', '銀色亮片髮甲'], 1.02, .031),
      }),
      look('disco-silver-shirt', ['Silver Lamé Shirt', '銀色尖領恤衫'], referencePhotos + 'disco/ballroom-01.jpg', {
        model: upperBodyModels + 'disco-silver-shirt.glb',
        preview: upperBodyModels + 'disco-silver-shirt.webp',
        upperBody: true,
        openCollar: true,
      }),
      look('disco-silver-jumpsuit', ['Silver Halter', '銀閃掛頸連身裝'], referencePhotos + 'disco/ballroom-01.jpg', { focus: 'right top', previewZoom: 1.38, sleeves: false }),
    ],
  },
};
