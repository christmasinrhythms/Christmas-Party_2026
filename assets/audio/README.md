# Christmas in Rhythms — local soundscape

三首網站音樂為 Terry 原檔衍生的 AAC-LC m4a：160 kbps、立體聲、48 kHz，排除字幕、來源歌詞metadata及chapters，啟用faststart。原始Opus MP4在系統afinfo無法開啟，因此作相容性轉換；三首AAC均通過afinfo。Downloads原檔未改動。來源與衍生SHA-256見 audio-manifest.json。 Website music files are AAC-LC derivatives for native/Safari compatibility; source files remain unchanged. Input and derived hashes are recorded.

十種 WAV 為原創程序合成，無外部採樣或人聲模仿；生成程式為 `build-sfx.py`，44.1 kHz mono 16-bit PCM，短淡入淡出，所有檔案零削波。單個音效 0.12–1.45 秒，`sfx-preview.wav` 為 12.42 秒音效串聽，不含音樂。 Original procedural effects use decaying sinusoids, filtered seeded noise, chord tones, and fade envelopes; no external samples or voice imitation.

```js
import { Soundscape } from './soundscape.mjs';
const sound = new Soundscape();
const unsubscribe = sound.subscribe(state => updateYourControls(state));
// Inside a real user click/tap:
const unlock = sound.gestureUnlock();
const playback = sound.play();
await Promise.all([unlock, playback]);
// Other real interaction:
await sound.playSfx('uiWoodTap');
// A single call per clock update, not per digit:
await sound.playSfx('woodFlip');
// Skip intro / cancel current cue:
sound.stopSfx();
// App teardown:
unsubscribe(); sound.destroy();
```

音樂只用一個 HTMLAudioElement，無三首預載等待；三首播完輪回第一首。SFX 使用一個在真實gesture建立及resume的 WebAudioContext、解碼AudioBuffer快取及最多四個同時播放的source。stopSfx只停止音效及取消待播觸發，不中斷BGM或關閉Context。默認音樂音量0.32、SFX音量0.22；木翻頁聲本身峰值僅0.055，且全局最短相隔1秒。預覽檔保留輸出本身音量；模組播放時再乘SFX音量。

Only one music player, no blocking playlist preload. SFX uses one gesture-created/resumed WebAudioContext, cached decoded AudioBuffers and at most four sources. stopSfx stops active and pending effects without interrupting music or closing the context. Defaults: music 0.32, SFX 0.22; file peak for woodFlip is 0.055, with a global minimum one-second gap. The preview contains file levels before runtime gain.

`play()` only reports playing after successful playback. Browser denial becomes `blocked`; call `gestureUnlock()` directly from a genuine gesture. If starting music at the same click, invoke both `gestureUnlock()` and `play()` before awaiting either promise, preserving the activation opportunity for both channels. Explicit pause remains paused through tab hide/show. Hidden pages pause music and stop SFX; only prior playing intent resumes on visibility. If all three sources fail, stop and expose an error; Play starts a new bounded retry. Music mute, SFX mute and master mute are independent; master mute overrides both without discarding individual preferences.

SFX mapping / 觸發建議：
- uiWoodTap: real UI tap / 普通按鈕
- doorRing: door-lock interaction / 門鎖
- magicChime: infrequent magic reveal / 少量魔法光顯現
- woodFlip: at most once per second, not once per digit / 每秒至多一次
- elfBell / snowPuff: occasional character interaction / 精靈、雪人互動
- introArrival / throwWhoosh / discoShimmer / titleBloom: Platform maps to actual video cue crossings, once per intended cue; avoid playing again on every timeupdate. / 平台按實際影片時間接入，不逐幀重播。

本機檢查頁 / Local preview: `/assets/audio/preview.html`.
No app/index/CSS/flip files were changed for this delivery. Main-scene cue integration belongs to Platform.

SFX decoding warms asynchronously after unlock and never blocks the original Loading UI. playSfx returns false when context is suspended; getState exposes sfxContextState, lastSfxPlayed and sfxError. lastSfxPlayed changes only after a source is started in a running context.
