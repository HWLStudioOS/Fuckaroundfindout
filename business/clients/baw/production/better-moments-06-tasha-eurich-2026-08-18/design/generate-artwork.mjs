#!/usr/bin/env node
// Better Moments #6 artwork generator.
// Rebuilds the approved #5 Jennifer Moss template as SVG with live text,
// then renders PNGs through headless Chromium so the embedded Montserrat
// subsets are honoured exactly. Run from the package root:
//
//   node design/generate-artwork.mjs
//
// Chromium is found via CHROME_BIN, the Playwright cache, or the Mac path.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const TOKENS = JSON.parse(readFileSync(join(HERE, 'brand-tokens.json'), 'utf8'));
const C = TOKENS.color;

// Prefer a headless-shell build: its screenshot equals the viewport exactly.
// Full Chrome's new headless subtracts ~87px of window furniture from
// --window-size, which crops the frame.
const CHROME =
  process.env.CHROME_BIN ||
  ['/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
   '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
   '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
   '/usr/bin/chromium'].find(existsSync);
if (!CHROME) throw new Error('No Chromium found. Set CHROME_BIN.');

// ---------------------------------------------------------------- fonts
const WEIGHTS = { 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold' };
const fontCss = Object.entries(WEIGHTS).map(([w, name]) => {
  const b64 = readFileSync(join(HERE, 'fonts/subset', `Montserrat-${name}-subset.ttf`)).toString('base64');
  return `@font-face{font-family:'Montserrat';font-weight:${w};src:url(data:font/ttf;base64,${b64}) format('truetype');}`;
}).join('\n');

// ---------------------------------------------------------------- logo
const logoRaw = readFileSync(join(HERE, 'better-at-work-logo.svg'), 'utf8');
const logoInner = logoRaw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const logo = (x, y, w) =>
  `<svg x="${x}" y="${y}" width="${w}" height="${(w * 417.5) / 827.3}" viewBox="0 0 827.3 417.5">${logoInner}</svg>`;

// ---------------------------------------------------------------- helpers
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = (x, y, size, weight, fill, text, { ls = 0, anchor = 'start', opacity = 1 } = {}) =>
  `<text x="${x}" y="${y}" font-family="Montserrat" font-size="${size}" font-weight="${weight}" fill="${fill}"` +
  `${ls ? ` letter-spacing="${ls}"` : ''}${anchor !== 'start' ? ` text-anchor="${anchor}"` : ''}` +
  `${opacity !== 1 ? ` opacity="${opacity}"` : ''}>${esc(text)}</text>`;
const lines = (x, y0, lh, size, weight, fill, arr, opts = {}) =>
  arr.map((t, i) => T(x, y0 + i * lh, size, weight, fill, t, opts)).join('\n');

// Number pill: rounded capsule with centred label.
const pill = (x, y, w, h, bg, fg, label) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${bg}"/>` +
  T(x + w / 2, y + h / 2 + 9, 24, 700, fg, label, { ls: 2, anchor: 'middle' });

// Organic background blobs, tuned to the #5 cover language.
const blobs = (w, h) => `
  <path fill="${C.violetBlobLight}" d="M ${w * 0.52} ${-h * 0.10} C ${w * 0.78} ${-h * 0.16} ${w * 1.08} ${h * 0.02} ${w * 1.05} ${h * 0.22} C ${w * 1.02} ${h * 0.40} ${w * 0.82} ${h * 0.47} ${w * 0.66} ${h * 0.40} C ${w * 0.50} ${h * 0.33} ${w * 0.44} ${h * 0.22} ${w * 0.47} ${h * 0.10} C ${w * 0.49} ${h * 0.02} ${w * 0.46} ${-h * 0.06} ${w * 0.52} ${-h * 0.10} Z"/>
  <path fill="${C.violetBlobLight}" d="M ${-w * 0.12} ${h * 0.36} C ${w * 0.06} ${h * 0.30} ${w * 0.28} ${h * 0.36} ${w * 0.32} ${h * 0.50} C ${w * 0.36} ${h * 0.64} ${w * 0.24} ${h * 0.76} ${w * 0.08} ${h * 0.76} C ${-w * 0.08} ${h * 0.76} ${-w * 0.18} ${h * 0.64} ${-w * 0.16} ${h * 0.50} C ${-w * 0.15} ${h * 0.42} ${-w * 0.16} ${h * 0.38} ${-w * 0.12} ${h * 0.36} Z"/>
  <path fill="${C.violetBlobDark}" d="M ${w * 0.86} ${h * 0.62} C ${w * 1.02} ${h * 0.58} ${w * 1.16} ${h * 0.68} ${w * 1.14} ${h * 0.84} C ${w * 1.12} ${h * 1.00} ${w * 0.98} ${h * 1.10} ${w * 0.82} ${h * 1.06} C ${w * 0.66} ${h * 1.02} ${w * 0.60} ${h * 0.88} ${w * 0.66} ${h * 0.76} C ${w * 0.70} ${h * 0.68} ${w * 0.76} ${h * 0.64} ${w * 0.86} ${h * 0.62} Z"/>
  <path fill="${C.violetBlobLight}" d="M ${w * 0.30} ${h * 0.86} C ${w * 0.44} ${h * 0.82} ${w * 0.56} ${h * 0.90} ${w * 0.55} ${h * 1.02} C ${w * 0.54} ${h * 1.14} ${w * 0.40} ${h * 1.20} ${w * 0.26} ${h * 1.16} C ${w * 0.12} ${h * 1.12} ${w * 0.08} ${h * 1.00} ${w * 0.16} ${h * 0.92} C ${w * 0.21} ${h * 0.87} ${w * 0.24} ${h * 0.88} ${w * 0.30} ${h * 0.86} Z"/>`;

const svgDoc = (w, h, body) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n<style>\n${fontCss}\n</style>\n${body}\n</svg>`;

// ---------------------------------------------------------------- content
const SERIES = 'BETTER MOMENTS 06';
const FOOTER_LEFT = 'TASHA EURICH / BETTER MOMENTS 06';

const cover = {
  eyebrowPill: 'A BETTER WAY TO THINK ABOUT RESILIENCE',
  headWhite: 'TOUGHING IT OUT IS',
  headYellow: 'NOT RESILIENCE.',
  sub: ['What doesn’t kill you does not', 'make you stronger.'],
};

const slides = [
  {
    n: 2, theme: 'cream', eyebrow: 'THE MYTH', pill: '01',
    head: ['“Bounce back”', 'is bad advice.'],
    body: ['Chronic pressure without recovery', 'does not build strength. It drains it.', 'The people praised for coping are', 'often closest to the edge.'],
    card: 'violet', label: 'TASHA’S POINT', callout: 'Endurance is not evidence of health.',
  },
  {
    n: 3, theme: 'ink', eyebrow: 'THE CEILING', pill: '02',
    head: ['Resilience', 'runs out.'],
    body: ['It behaves like a budget, not a trait.', 'Every unresolved stressor spends from it,', 'and nothing refills it by itself.'],
    card: 'violet', label: 'TASHA’S POINT', callout: 'Spend without recovery and the account empties.',
  },
  {
    n: 4, theme: 'cream', eyebrow: 'THE PRAISE TRAP', pill: '03', headSize: 68, headLh: 80,
    head: ['“She’s so resilient”', 'is a warning sign.'],
    body: ['When coping gets rewarded, people learn', 'to hide the cost. The strongest performer', 'quietly becomes the highest risk.'],
    card: 'ink', label: 'THE RISK', callout: 'Praise the recovery, not the endurance.',
  },
  {
    n: 5, theme: 'ink', eyebrow: 'SELF-AWARENESS', pill: '04',
    head: ['Most of us can’t', 'see it coming.'],
    body: ['Tasha’s research: 95 percent of people', 'believe they are self-aware. Roughly 10 to', '15 percent actually are. You cannot manage', 'a cost you refuse to see.'],
    card: 'violet', label: 'TASHA’S RESEARCH', callout: 'The gap is the risk.',
  },
  {
    n: 6, theme: 'cream', eyebrow: 'TWO LENSES', pill: '05',
    head: ['Know yourself.', 'Then ask around.'],
    body: ['Internal self-awareness is what you see.', 'External is what others see. They are', 'different skills, and one without the', 'other misleads.'],
    card: 'violet', label: 'TRY THIS', callout: 'One honest outside view beats a week of reflection.',
  },
  {
    n: 7, theme: 'ink', eyebrow: 'THE LEADER’S MOVE', pill: '06',
    head: ['Fix the load,', 'not the person.'],
    body: ['Resilience training cannot outrun a broken', 'workload. Remove the chronic stressor at', 'source, then design recovery into the plan,', 'not around it.'],
    card: 'violet', label: 'TASHA’S POINT', callout: 'The fix sits upstream of the person.',
  },
  {
    n: 8, theme: 'violet', eyebrow: 'TRY THIS THIS WEEK', pill: 'DO',
    head: ['Protect', 'the capacity.'],
    list: ['Remove one cause of chronic stress.', 'Ask one person for the outside view.', 'Put recovery in the calendar.'],
    card: 'yellow', label: 'BETTER MOMENTS 06', callout: 'Tasha Eurich. The full conversation lands Thursday.',
  },
];

const launch = {
  eyebrow: 'BETTER MOMENTS 06',
  headWhite: 'RESILIENCE',
  headYellow: 'HAS A CEILING.',
  sub: 'Capacity. Awareness. Recovery.',
  guest: 'TASHA EURICH',
  desc: ['Why resilience runs out, and what', 'leaders should fix instead.'],
  button: 'OUT NOW',
  footer: 'BEST BITS FROM BETTER AT WORK / SEASON 4',
};

// ---------------------------------------------------------------- themes
const themes = {
  cream:  { bg: C.cream, eyebrow: C.violetInterior, head: C.violetInterior, body: C.ink, footer: C.footerOnCream, pillBg: C.yellow, pillFg: C.ink },
  ink:    { bg: C.ink, eyebrow: C.yellow, head: '#FFFFFF', body: '#FFFFFF', footer: C.footerOnDark, pillBg: C.violetInterior, pillFg: '#FFFFFF' },
  violet: { bg: C.violetInterior, eyebrow: C.yellow, head: '#FFFFFF', body: '#FFFFFF', footer: '#FFFFFF', pillBg: C.yellow, pillFg: C.ink },
};
const cards = {
  violet: { bg: C.violetInterior, label: C.yellow, text: '#FFFFFF' },
  ink:    { bg: C.ink, label: C.yellow, text: '#FFFFFF' },
  yellow: { bg: C.yellow, label: C.ink, text: C.ink },
};

// ---------------------------------------------------------------- frames
function coverFrame(w, h) {
  const M = 72;
  const li = h === 1080;
  const pillW = Math.min(cover.eyebrowPill.length * 17 + 136, w - 2 * M);
  const y = li
    ? { pill: 325, h1: 462, h2: 552, sub: 650, footer: 1006 }
    : { pill: 435, h1: 578, h2: 668, sub: 766, footer: 1272 };
  return svgDoc(w, h, `
  <rect width="${w}" height="${h}" fill="${C.violetCover}"/>
  ${blobs(w, h)}
  ${logo(M, 64, 235)}
  <rect x="${M}" y="${y.pill}" width="${pillW}" height="58" rx="29" fill="${C.yellow}"/>
  ${T(M + pillW / 2, y.pill + 38, 22, 700, C.ink, cover.eyebrowPill, { ls: 3, anchor: 'middle' })}
  ${T(M, y.h1, 68, 800, '#FFFFFF', cover.headWhite)}
  ${T(M, y.h2, 84, 800, C.yellow, cover.headYellow)}
  ${lines(M, y.sub, 52, 40, 500, '#FFFFFF', cover.sub)}
  ${T(M, y.footer, 22, 700, '#FFFFFF', FOOTER_LEFT, { ls: 2.5, opacity: 0.9 })}
  ${T(w - M, y.footer, 22, 700, '#FFFFFF', '01 / 08', { ls: 2.5, anchor: 'end', opacity: 0.9 })}`);
}

function interiorFrame(s, w, h) {
  const M = 72;
  const t = themes[s.theme];
  const card = cards[s.card];
  const li = h === 1080;
  const headSize = li ? Math.round((s.headSize || 84) * 0.88) : (s.headSize || 84);
  const headLh = li ? Math.round((s.headLh || 96) * 0.88) : (s.headLh || 96);
  const y = li
    ? { eyebrow: 84, pill: 132, head: 296, body: 520, bodyLh: 48, cardBottom: 906, footer: 1010 }
    : { eyebrow: 90, pill: 150, head: 330, body: 598, bodyLh: 58, cardBottom: 1181, footer: 1278 };
  const bodySize = li ? 36 : 40;
  const cardH = 150;
  const cardY = y.cardBottom - cardH;

  let middle;
  if (s.list) {
    // Numbers sit in their own text element; SVG collapses double spaces.
    middle = s.list.map((item, i) =>
      T(M, y.body + i * (y.bodyLh + 4), bodySize, 500, t.body, `0${i + 1}`) +
      T(M + 66, y.body + i * (y.bodyLh + 4), bodySize, 500, t.body, item)
    ).join('\n');
  } else {
    middle = lines(M, y.body, y.bodyLh, bodySize, 500, t.body, s.body);
  }

  // Callout text shrinks until it clears the card's right padding.
  let calloutSize = li ? 30 : 32;
  while (calloutSize > 26 && (M + 40) + s.callout.length * calloutSize * 0.55 > w - M - 40) calloutSize -= 1;

  return svgDoc(w, h, `
  <rect width="${w}" height="${h}" fill="${t.bg}"/>
  ${T(M, y.eyebrow, 24, 700, t.eyebrow, s.eyebrow, { ls: 3 })}
  ${pill(M, y.pill, 116, 56, t.pillBg, t.pillFg, s.pill)}
  ${lines(M, y.head, headLh, headSize, 800, t.head, s.head)}
  ${middle}
  <rect x="${M}" y="${cardY}" width="${w - 2 * M}" height="${cardH}" rx="32" fill="${card.bg}"/>
  ${T(M + 40, cardY + 48, 22, 700, card.label, s.label, { ls: 2.5 })}
  ${T(M + 40, cardY + 102, calloutSize, 500, card.text, s.callout)}
  ${T(M, y.footer, 22, 700, t.footer, FOOTER_LEFT, { ls: 2.5 })}
  ${T(w - M, y.footer, 22, 700, t.footer, `0${s.n} / 08`, { ls: 2.5, anchor: 'end' })}`);
}

function launchFrame(w, h) {
  const M = 72;
  // Portrait slot: the studio pass may add a circular guest still at
  // cx 790 cy 400 r 215 with a 14px white ring, per the #5 composition.
  return svgDoc(w, h, `
  <rect width="${w}" height="${h}" fill="${C.violetCover}"/>
  ${blobs(w, h)}
  ${logo(M, 64, 235)}
  ${T(M, 292, 24, 700, C.yellow, launch.eyebrow, { ls: 3 })}
  ${T(M, 412, 88, 800, '#FFFFFF', launch.headWhite)}
  ${T(M, 516, 96, 800, C.yellow, launch.headYellow)}
  ${T(M, 600, 40, 500, '#FFFFFF', launch.sub)}
  ${T(M, 924, 24, 700, C.yellow, launch.guest, { ls: 3 })}
  ${lines(M, 990, 56, 44, 500, '#FFFFFF', launch.desc)}
  <rect x="${M}" y="1150" width="182" height="56" rx="10" fill="${C.yellow}"/>
  ${T(M + 91, 1186, 22, 700, C.ink, launch.button, { ls: 2.5, anchor: 'middle' })}
  ${T(M, 1288, 20, 700, '#FFFFFF', launch.footer, { ls: 2.5, opacity: 0.9 })}`);
}

function youtubeFrame(w, h) {
  const M = 96;
  return svgDoc(w, h, `
  <rect width="${w}" height="${h}" fill="${C.violetCover}"/>
  ${blobs(w, h)}
  ${logo(M, 64, 220)}
  ${T(M, 388, 30, 700, C.yellow, 'BETTER MOMENTS 06', { ls: 4 })}
  ${T(M, 540, 128, 800, '#FFFFFF', 'RESILIENCE')}
  ${T(M, 688, 128, 800, C.yellow, 'HAS A CEILING.')}
  ${T(M, 812, 34, 700, '#FFFFFF', 'TASHA EURICH', { ls: 5 })}
  ${T(M, 984, 24, 700, '#FFFFFF', 'BEST BITS FROM BETTER AT WORK / SEASON 4', { ls: 2.5, opacity: 0.85 })}`);
}

// ---------------------------------------------------------------- render
const jobs = [];
const add = (rel, svg, w, h) => {
  const out = join(ROOT, rel);
  mkdirSync(dirname(out), { recursive: true });
  const src = join(ROOT, 'artwork/source', rel.split('/').pop().replace(/\.png$/, '.svg'));
  mkdirSync(dirname(src), { recursive: true });
  writeFileSync(src, svg);
  jobs.push({ src, out, w, h });
};

const names = { 2: '02-myth', 3: '03-ceiling', 4: '04-praise-trap', 5: '05-self-awareness', 6: '06-two-lenses', 7: '07-leaders-move', 8: '08-action' };

add('artwork/carousel/01-cover.png', coverFrame(1080, 1350), 1080, 1350);
for (const s of slides) add(`artwork/carousel/${names[s.n]}.png`, interiorFrame(s, 1080, 1350), 1080, 1350);
// LinkedIn set: separately composed 1080 x 1080 with distinct source names.
writeFileSync(join(ROOT, 'artwork/source/li-01-cover.svg'), coverFrame(1080, 1080));
jobs.push({ src: join(ROOT, 'artwork/source/li-01-cover.svg'), out: join(ROOT, 'artwork/carousel-linkedin/01-cover.png'), w: 1080, h: 1080 });
for (const s of slides) {
  const src = join(ROOT, 'artwork/source', `li-${names[s.n]}.svg`);
  writeFileSync(src, interiorFrame(s, 1080, 1080));
  jobs.push({ src, out: join(ROOT, `artwork/carousel-linkedin/${names[s.n]}.png`), w: 1080, h: 1080 });
}
add('artwork/launch/BetterAtWork-BetterMoments-06-TashaEurich-Instagram.png', launchFrame(1080, 1350), 1080, 1350);
add('artwork/launch/BetterAtWork-BetterMoments-06-TashaEurich-LinkedIn.png', launchFrame(1080, 1350), 1080, 1350);
add('artwork/launch/BetterAtWork-BetterMoments-06-TashaEurich-YouTube.png', youtubeFrame(1920, 1080), 1920, 1080);

mkdirSync(join(ROOT, 'artwork/carousel-linkedin'), { recursive: true });
for (const j of jobs) {
  mkdirSync(dirname(j.out), { recursive: true });
  // Chromium's standalone SVG viewer adds layout of its own; a zero-margin
  // HTML wrapper with the SVG inlined renders the frame edge to edge.
  const wrapper = j.src.replace(/\.svg$/, '.render.html');
  const svgBody = readFileSync(j.src, 'utf8').replace(/^<\?xml[^>]*\?>\s*/, '');
  writeFileSync(wrapper, `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0}svg{display:block}</style></head><body>${svgBody}</body></html>`);
  execFileSync(CHROME, [
    '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', `--window-size=${j.w},${j.h}`,
    `--screenshot=${j.out}`, `file://${wrapper}`,
  ], { stdio: 'pipe' });
  console.log('rendered', j.out.replace(ROOT + '/', ''));
}
execFileSync('sh', ['-c', `rm -f ${JSON.stringify(join(ROOT, 'artwork/source'))}/*.render.html`]);
console.log(`\n${jobs.length} frames rendered.`);
