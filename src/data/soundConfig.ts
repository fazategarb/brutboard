// Audio samples using publicly available CDN sounds
// Using Freesound-compatible URLs and Web Audio API tones

export interface SoundSample {
  label: string;
  emoji: string;
  description: string;
}

// Meme mode: generated tones mapped to meme archetypes
// In production, swap these with actual .mp3 URLs
export const MEME_SOUND_CONFIG: Record<string, SoundSample> = {
  a: { label: 'BRUH', emoji: '🤡', description: 'Classic bruh moment' },
  s: { label: 'SKULL', emoji: '💀', description: 'I am literally dead' },
  d: { label: 'STONE', emoji: '🗿', description: 'No thoughts, head empty' },
  f: { label: 'NPC', emoji: '😤', description: 'NPC dialogue activated' },
  g: { label: 'PEPE', emoji: '🐸', description: 'Rare Pepe detected' },
  h: { label: 'SAD TROMBONE', emoji: '🎺', description: 'Sad trombone wah wah' },
  j: { label: 'MIND BLOWN', emoji: '🤯', description: 'Mind = absolutely deleted' },
  k: { label: 'CRYING', emoji: '😭', description: 'Not okay fr fr' },
  l: { label: 'SHEESH', emoji: '🤙', description: 'SHEEEESH no cap' },
  q: { label: 'SLAY', emoji: '💅', description: 'Slay bestie periodt' },
  w: { label: 'SUS', emoji: '👀', description: 'Kinda sus ngl' },
  e: { label: 'QUACK', emoji: '🦆', description: 'You quacked' },
  r: { label: 'EGG', emoji: '🍳', description: 'This is fine' },
  t: { label: 'NYAN', emoji: '🐱', description: 'Nyan cat vibes' },
  y: { label: 'DING', emoji: '🎵', description: 'Achievement unlocked' },
  u: { label: 'ALERT', emoji: '🚨', description: 'Red alert activated' },
  i: { label: 'BOOM', emoji: '💥', description: 'Explosion time' },
  o: { label: 'DROOL', emoji: '🤤', description: 'Gimme gimme' },
  p: { label: 'ALIEN', emoji: '👾', description: 'They are among us' },
  z: { label: 'BIG BRAIN', emoji: '🧠', description: '200 IQ play' },
  x: { label: 'COPIUM', emoji: '☕', description: 'Huffing copium' },
  c: { label: 'SPICY', emoji: '🌶️', description: 'Too hot to handle' },
  v: { label: 'WOOZY', emoji: '🥴', description: 'It be like that' },
  b: { label: 'ROFL', emoji: '😂', description: 'Crying laughing' },
  n: { label: 'LINUX BTW', emoji: '🐧', description: 'BTW I use Linux' },
  m: { label: 'TRASH', emoji: '🗑️', description: 'This goes in trash' },
};

// Coding error mode sounds
export const CODING_SOUND_CONFIG: Record<string, SoundSample> = {
  a: { label: 'ERROR 500', emoji: '❌', description: 'Internal Server Error' },
  s: { label: 'BUG FOUND', emoji: '🚨', description: 'Critical bug detected' },
  d: { label: 'NULL PTR', emoji: '☠️', description: 'NullPointerException' },
  f: { label: 'IT BURNS', emoji: '🔥', description: 'Production is on fire' },
  g: { label: 'GIT PUSH', emoji: '💾', description: 'Pushed to main... oops' },
  h: { label: 'NPM AUDIT', emoji: '📦', description: '247 vulnerabilities found' },
  j: { label: 'INF LOOP', emoji: '🌀', description: 'Infinite loop detected' },
  k: { label: 'WRONG KEY', emoji: '🔑', description: 'KeyError: wrong key' },
  l: { label: 'LINT ERR', emoji: '⚡', description: 'ESLint is not happy' },
  q: { label: 'STOP IT', emoji: '🛑', description: 'Please just stop' },
  w: { label: 'DEPRECAT', emoji: '⚠️', description: 'DeprecationWarning!' },
  e: { label: 'CONSOLE', emoji: '📝', description: 'console.log("here")' },
  r: { label: 'FORCE PUSH', emoji: '🔃', description: 'git push --force' },
  t: { label: 'OPEN PR', emoji: '📤', description: 'Opened 47th PR today' },
  y: { label: 'CI PASS', emoji: '✅', description: 'Finally CI is green!' },
  u: { label: 'DEBUGGER', emoji: '🐛', description: 'Breakpoint hit' },
  i: { label: 'GOOD IDEA', emoji: '💡', description: 'I have a brilliant plan' },
  o: { label: 'GREP -R', emoji: '🔍', description: 'Searching codebase...' },
  p: { label: 'UNIT TEST', emoji: '🧪', description: '0/99 tests passing' },
  z: { label: 'DEPLOY!', emoji: '🚀', description: 'Deploying to prod on Friday' },
  x: { label: 'SEGFAULT', emoji: '💣', description: 'Segmentation fault (core dumped)' },
  c: { label: 'COPY IT', emoji: '📋', description: 'StackOverflow to the rescue' },
  v: { label: 'NO DOCS', emoji: '📜', description: '"The code is self-documenting"' },
  b: { label: 'BUILD', emoji: '🧩', description: 'Building... (3 of ∞)' },
  n: { label: 'NOTIF', emoji: '🔔', description: 'Slack ping at 2AM' },
  m: { label: 'MERGED!', emoji: '🎉', description: 'Finally merged after 3 weeks' },
};
