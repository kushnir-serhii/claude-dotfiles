// ALMA — seed content + cover art identities (image-based + a few gradients).
// ALMA_GRADIENTS is the single map used by <Orb> — values are valid CSS background shorthand.

const ALMA_GRADIENTS = {
  // ── Image covers (master tracks) — premium photo-painting artwork
  sun:     "url('images/sun.webp') center / cover no-repeat",
  evening: "url('images/evening.webp') center / cover no-repeat",
  flower:  "url('images/flower.webp') center / cover no-repeat",
  light:   "url('images/light.webp') center / cover no-repeat",
  weve:    "url('images/weve.webp') center / cover no-repeat",
  sea:     "url('images/sea.webp') center / cover no-repeat",
  searay:  "url('images/sea light.webp') center / cover no-repeat",
  day:     "url('images/day.webp') center / cover no-repeat",
  morning: "url('images/morning.webp') center / cover no-repeat",
  ocean:   "url('images/ocean.webp') center / cover no-repeat",
  waves:   "url('images/waves.webp') center / cover no-repeat",
  dust:    "url('images/dust.webp') center / cover no-repeat",

  // ── Ritual gradient images
  g1:      "url('alma/img/gradient1.webp') center / cover no-repeat",
  g2:      "url('alma/img/gradient2.webp') center / cover no-repeat",
  g3:      "url('alma/img/gradient3.webp') center / cover no-repeat",
  g4:      "url('alma/img/gradient4.webp') center / cover no-repeat",
  g5:      "url('alma/img/gradient5.webp') center / cover no-repeat",
  g6:      "url('alma/img/gradient6.webp') center / cover no-repeat",

  // ── Subtle gradients (ambient layers — small thumbs only)
  rain:    'radial-gradient(120% 120% at 45% 30%, #93C5FD 0%, #3B6EA5 55%, #16304D 100%)',
  forest:  'radial-gradient(120% 120% at 40% 30%, #86EFAC 0%, #2E7D5B 55%, #123226 100%)',
  ember:   'radial-gradient(120% 120% at 35% 25%, #FDBA74 0%, #C2541F 55%, #4A1E0A 100%)',
  dawn:    'radial-gradient(120% 120% at 60% 20%, #FCD9B6 0%, #B98A6A 50%, #5C4533 100%)',
  oceang:  'radial-gradient(120% 120% at 30% 30%, #5EEAD4 0%, #2563A8 55%, #0E2A52 100%)',
  theta:   'radial-gradient(120% 120% at 40% 80%, #6366F1 0%, #3730A3 55%, #1E1B4B 100%)',
  violet:  'radial-gradient(120% 120% at 70% 25%, #C4B5FD 0%, #8B5CF6 50%, #4C1D95 100%)',
  bound:   'radial-gradient(120% 120% at 70% 30%, #F0ABFC 0%, #A855F7 50%, #581C87 100%)',

  // ── Muted Pin-File gradients (curated palette for user choice)
  blu:     'linear-gradient(140deg, #7B96BA 0%, #4A6485 55%, #2B3D55 100%)',
  plum:    'linear-gradient(140deg, #8E80A8 0%, #5F5479 55%, #382E4C 100%)',
  ink:     'linear-gradient(140deg, #4A5066 0%, #2A2F3F 55%, #14171F 100%)',
  honey:   'linear-gradient(140deg, #C9AE7B 0%, #91754A 55%, #4F3F26 100%)',
  seaish:  'linear-gradient(140deg, #7CB0A8 0%, #4E807A 55%, #2A4B47 100%)',
};

// Curated Pin-File customization palette
const PIN_COLORS = [
  { id: 'blu',    name: 'Blue' },
  { id: 'plum',   name: 'Plum' },
  { id: 'ink',    name: 'Ink' },
  { id: 'honey',  name: 'Honey' },
  { id: 'seaish', name: 'Sea' },
];

// Curated Pin-File icon set (Lucide outline, white over color)
const PIN_ICONS = [
  { id: 'wave',       label: 'Wave' },
  { id: 'droplets',   label: 'Rain' },
  { id: 'flame',      label: 'Flame' },
  { id: 'leaf',       label: 'Leaf' },
  { id: 'mic',        label: 'Voice' },
  { id: 'music',      label: 'Music' },
  { id: 'bell',       label: 'Bell' },
  { id: 'sparkles',   label: 'Spark' },
  { id: 'headphones', label: 'Phones' },
  { id: 'flower',     label: 'Bloom' },
];

const MASTER_TRACKS = [
  { id: 't1', title: 'OM Waves',        sub: 'Chant · Deep Rest',     dur: 10, grad: 'sea',     state: 'downloaded', audioSrc: 'nature/master-tracks/aum-waves-om.mp3' },
  { id: 't2', title: 'Healing Light',   sub: 'Piano · Restore',       dur: 9,  grad: 'light',   state: 'downloaded', audioSrc: 'nature/master-tracks/healing-light-over-piano.mp3' },
  { id: 't3', title: 'Flowing Balance', sub: 'Yoga · Movement',       dur: 9,  grad: 'weve',    state: 'downloaded', audioSrc: 'nature/master-tracks/background-music-yoga.mp3' },
  { id: 't4', title: 'Gayatri',         sub: 'Mantra · Dawn',         dur: 7,  grad: 'sun',     state: 'downloaded', audioSrc: 'nature/master-tracks/gayatri-mantra.mp3' },
  { id: 't5', title: 'Zen Garden',      sub: 'Nature · Peace',        dur: 9,  grad: 'day',     state: 'downloaded', audioSrc: 'nature/master-tracks/japanese-bamboo-garden-peace.mp3' },
  { id: 't6', title: 'Gregorian Chant', sub: 'Sacred · Choir',        dur: 4,  grad: 'evening', state: 'downloaded', audioSrc: 'nature/master-tracks/mysterious-gregorian-chant.mp3' },
  { id: 't7', title: 'Desert Soul',     sub: 'Sufi · Transcendence',  dur: 8,  grad: 'dust',    state: 'downloaded', audioSrc: 'nature/master-tracks/arabian-sufi.mp3' },
];

const SAVED_RITUALS = [
  { id: 'r1', title: 'Deep Morning Focus', layers: 'Flowing Balance + Rainfall', dur: 9,  grad: 'weve',    audioSrc: 'nature/master-tracks/background-music-yoga.mp3', layerSrc: 'nature/calming rain.mp3' },
  { id: 'r2', title: 'Evening Wind-Down',  layers: 'Healing Light + Chimes',     dur: 9,  grad: 'light',   audioSrc: 'nature/master-tracks/healing-light-over-piano.mp3', layerSrc: 'nature/effects/deep-healing-tibetan-bowl-frequencies.mp3' },
  { id: 'r3', title: 'Sacred Stillness',   layers: 'OM Waves + Ocean',           dur: 10, grad: 'sea',     audioSrc: 'nature/master-tracks/aum-waves-om.mp3', layerSrc: 'nature/ocean-waves-crashing-on-the-coast.wav' },
];

const AMBIENT_LAYERS = [
  // ── Nature ambience ──
  { id: 'a1', name: 'Gentle Rain',     desc: 'Soft steady rainfall',       grad: 'rain',  audioSrc: 'nature/calming rain.mp3' },
  { id: 'a2', name: 'Ocean Waves',     desc: 'Slow tidal breath',          grad: 'oceang',audioSrc: 'nature/ocean-waves-crashing-on-the-coast.wav' },
  { id: 'a3', name: 'Forest Night',    desc: 'Crickets & night sounds',    grad: 'forest',audioSrc: 'nature/forest.mp3' },
  { id: 'a4', name: 'Hearthfire',      desc: 'Warm crackling fire',        grad: 'ember', audioSrc: 'nature/hearthfire.wav' },
  // ── Healing frequencies ──
  { id: 'a5', name: 'Gamma Waves',     desc: '40 Hz focus & clarity',      grad: 'theta', audioSrc: 'nature/effects/40-hz-gamma-beats-noise.mp3' },
  { id: 'a6', name: 'Solfeggio',       desc: '174 · 396 · 528 Hz healing', grad: 'bound', audioSrc: 'nature/effects/solfegio-174hz-396hz-528hz.mp3' },
  { id: 'a7', name: 'Tibetan Bowls',   desc: 'Deep resonant sustain',      grad: 'honey', audioSrc: 'nature/effects/deep-healing-tibetan-bowl-frequencies.mp3' },
  // ── Session markers (short strikes) ──
  { id: 'a8', name: 'Keisu Bell',       desc: 'Plays at start & end',        grad: 'dawn',  audioSrc: 'nature/effects/intro-outro-keisu-temple-bell.mp3', isIntroOutro: true },
  { id: 'a9', name: 'Interval Bell',   desc: 'Rings at selected intervals',  grad: 'dust',  audioSrc: 'nature/effects/temple-bell-interval.mp3', isInterval: true },
];

const RAW_AUDIO = [
  { id: 'p1', name: 'Calming Rain',         meta: 'MP3 · Nature', color: 'blu',    icon: 'droplets',   pinned: true,  audioSrc: 'nature/calming rain.mp3' },
  { id: 'p2', name: 'Tibetan Bowl',         meta: 'MP3 · Effects',color: 'honey',  icon: 'bell',       pinned: true,  audioSrc: 'nature/effects/bowl.mp3' },
  { id: 'p3', name: 'Gregorian Chant',      meta: 'MP3 · Vocal',  color: 'plum',   icon: 'music',      pinned: true,  audioSrc: 'nature/master-tracks/mysterious-gregorian-chant.mp3' },
  { id: 'p4', name: 'Ocean Waves',          meta: 'WAV · Nature', color: 'seaish', icon: 'wave',       pinned: false, audioSrc: 'nature/ocean-waves-crashing-on-the-coast.wav' },
];

const DURATIONS = [5, 15, 30, 45];

function fmtTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

Object.assign(window, {
  ALMA_GRADIENTS, MASTER_TRACKS, SAVED_RITUALS,
  AMBIENT_LAYERS, RAW_AUDIO, DURATIONS, PIN_COLORS, PIN_ICONS, fmtTime,
});
