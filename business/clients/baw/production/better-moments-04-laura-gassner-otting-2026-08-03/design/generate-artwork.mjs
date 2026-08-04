#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const sourceDir = join(root, 'artwork', 'source');
const carouselDir = join(root, 'artwork', 'carousel');
const linkedinDir = join(root, 'artwork', 'carousel-linkedin');
const launchDir = join(root, 'artwork', 'launch');
const fontDir = join(here, 'fonts');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const renderQueue = [];

for (const directory of [sourceDir, carouselDir, linkedinDir, launchDir]) {
  mkdirSync(directory, { recursive: true });
}

// Locked Brand Primitives from Better Work Brand Playground, Utilities 115:250.
const token = {
  paper: '#F4F0E7',
  paperDeep: '#E9E2D5',
  ink: '#171817',
  inkMuted: '#5B5A55',
  warmWhite: '#FFFDF8',
  yellow: '#F6DF4F',
  violet: '#6A43D5',
  violetDeep: '#3C266E',
  coral: '#EF6B68',
  green: '#26735D',
  blue: '#68C5DC',
};

const family = {
  editorial: 'Newsreader',
  body: 'Manrope',
  utility: 'IBM Plex Mono',
};

const fontData = {
  newsreader: readFileSync(join(fontDir, 'Newsreader[opsz,wght].ttf')).toString('base64'),
  newsreaderItalic: readFileSync(join(fontDir, 'Newsreader-Italic[opsz,wght].ttf')).toString('base64'),
  manrope: readFileSync(join(fontDir, 'Manrope[wght].ttf')).toString('base64'),
  plexMonoMedium: readFileSync(join(fontDir, 'IBMPlexMono-Medium.ttf')).toString('base64'),
};

const fontCss = `
  @font-face {
    font-family: 'Newsreader';
    src: url('data:font/ttf;base64,${fontData.newsreader}') format('truetype');
    font-style: normal;
    font-weight: 200 800;
  }
  @font-face {
    font-family: 'Newsreader';
    src: url('data:font/ttf;base64,${fontData.newsreaderItalic}') format('truetype');
    font-style: italic;
    font-weight: 200 800;
  }
  @font-face {
    font-family: 'Manrope';
    src: url('data:font/ttf;base64,${fontData.manrope}') format('truetype');
    font-style: normal;
    font-weight: 200 800;
  }
  @font-face {
    font-family: 'IBM Plex Mono';
    src: url('data:font/ttf;base64,${fontData.plexMonoMedium}') format('truetype');
    font-style: normal;
    font-weight: 500;
  }
  text { font-kerning: normal; font-optical-sizing: auto; }
`;

const portrait = readFileSync(join(root, 'assets', 'laura-portrait-07m45.jpg')).toString('base64');
const portraitUri = `data:image/jpeg;base64,${portrait}`;

// Canonical Better at Work logo. This is the exact outlined live-site vector,
// including the TM. The hash excludes trailing whitespace only.
const canonicalLogoSource = readFileSync(join(here, 'better-at-work-logo.svg'), 'utf8');
const canonicalLogoHash = createHash('sha256').update(canonicalLogoSource.trimEnd()).digest('hex');
const expectedCanonicalLogoHash = 'd096bd164e714c784289dba52fe096b958a1b04016d0d8f9464879fcadabe65c';
if (canonicalLogoHash !== expectedCanonicalLogoHash) {
  throw new Error(`Canonical Better at Work logo changed: ${canonicalLogoHash}`);
}
const normalizeSvgWhitespace = (value) => value.replace(/[ \t]+$/gm, '');
const canonicalLogoBody = normalizeSvgWhitespace(canonicalLogoSource
  .replace(/^<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .replace(/<style>[\s\S]*?<\/style>/, '')
  .replaceAll(' class="st0"', ' fill="#fff"')
  .replace(/\s+id="[^"]+"/g, ''));
const canonicalLogoViewBox = { width: 827.3, height: 417.5 };

const slides = [
  {
    cover: true,
    eyebrow: 'THE CAREER SCORECARD',
    headline: ["A good job isn't", 'one thing.'],
    subhead: ['Score yours across calling, connection,', 'contribution and control.'],
    footer: 'BETTER MOMENTS 04 / CAREERS',
  },
  {
    eyebrow: 'START WITH THE REAL QUESTION',
    number: '01',
    headline: ['Good for whom?'],
    body: [
      'A role can look excellent on paper and still be',
      'wrong for the person doing it. The useful question',
      'is not “Is this a good job?” It is “Is this a good',
      'job for me, now?”',
    ],
    calloutLabel: 'LAURA’S POINT',
    callout: ['Every person has a different definition of success.', 'That definition changes with age and life stage.'],
    footer: 'LAURA GASSNER OTTING / CAREERS',
    accent: 'coral',
  },
  {
    eyebrow: '01 / CALLING',
    number: '02',
    headline: ['What pulls you', 'forward?'],
    body: [
      'A leader who inspires you. A mission you want to fulfil.',
      'A problem you care about. A business you want to build.',
      'A family you want to nurture.',
    ],
    calloutLabel: 'ASK YOURSELF',
    callout: ['What is the gravitational force', 'that gets you out of bed?'],
    footer: 'CALLING / THE FOUR Cs',
    accent: 'yellow',
  },
  {
    eyebrow: '02 / CONNECTION',
    number: '03',
    headline: ['Does your work', 'matter?'],
    body: [
      'Connection is the relevance and impact of the work.',
      'Look at your calendar, inbox and task list. Do those',
      'things move you towards what matters, or away from it?',
    ],
    calloutLabel: 'ASK YOURSELF',
    callout: ['If you called in sick tomorrow,', 'would anybody notice?'],
    footer: 'CONNECTION / THE FOUR Cs',
    accent: 'blue',
  },
  {
    eyebrow: '03 / CONTRIBUTION',
    number: '04',
    headline: ['What does work', 'give you?'],
    body: [
      'This is not how you contribute to work. It is how work',
      'contributes to your life: money, flexibility, growth,',
      'stability and the ability to live your values.',
    ],
    calloutLabel: 'ASK YOURSELF',
    callout: ['Does the work support the life', 'you are trying to build?'],
    footer: 'CONTRIBUTION / THE FOUR Cs',
    accent: 'green',
  },
  {
    eyebrow: '04 / CONTROL',
    number: '05',
    headline: ['What is actually', 'yours?'],
    body: [
      'Your time. Your decisions. The teams you join. The metrics',
      'used to judge you. The conditions in which you do your',
      'best work.',
    ],
    calloutLabel: 'LAURA’S POINT',
    callout: ['People will choose control', 'over power.'],
    footer: 'CONTROL / THE FOUR Cs',
    accent: 'violet',
  },
  {
    eyebrow: 'THE MIX IS PERSONAL',
    number: '06',
    headline: ['Your answer', 'can change.'],
    body: [
      'Children, debt, caring responsibilities, health and ambition',
      'all change what a good role needs to provide. The answer',
      'at 26 may be wrong at 36.',
    ],
    calloutLabel: 'THE DIALS MOVE',
    callout: ['You need the right mix', 'for this stage.'],
    footer: 'LIFE STAGE / THE FOUR Cs',
    accent: 'coral',
  },
  {
    eyebrow: 'TEN MINUTES',
    number: '07',
    headline: ['Score the', 'four Cs.'],
    body: [
      'For each C, write two scores from 0 to 10:',
      'what you have today and what you need now.',
      'The largest gap is the conversation to have.',
    ],
    calloutLabel: 'LISTEN THURSDAY',
    callout: ['Better Moments #4', 'Laura Gassner Otting'],
    footer: 'BETTER MOMENTS 04 / BETTER AT WORK',
    accent: 'violet',
    endCard: true,
  },
];

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function textLines(lines, x, y, options = {}) {
  const {
    size = 48,
    lineHeight = 1.08,
    colour = token.ink,
    weight = 400,
    spacing = 0,
    anchor = 'start',
    fontFamily = family.editorial,
    style = 'normal',
  } = options;
  return lines
    .map((line, index) => `<text x="${x}" y="${y + index * size * lineHeight}" fill="${colour}" font-family="${fontFamily}" font-size="${size}" font-style="${style}" font-weight="${weight}" letter-spacing="${spacing}" text-anchor="${anchor}">${esc(line)}</text>`)
    .join('');
}

function canonicalLogoHeight(width) {
  return width * canonicalLogoViewBox.height / canonicalLogoViewBox.width;
}

function canonicalLogoMark(x, y, width) {
  const scale = width / canonicalLogoViewBox.width;
  return `<g transform="translate(${x} ${y}) scale(${scale})" aria-label="Better at Work original logo including trademark" data-canonical-logo="true">
    ${canonicalLogoBody}
  </g>`;
}

function svgFrame(width, height, body, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs><style>${fontCss}</style>${defs}</defs>
  ${body}
</svg>\n`;
}

function accentText(accent) {
  return ['violet', 'green'].includes(accent) ? token.warmWhite : token.ink;
}

function carouselSvg(slide, index, linkedin = false) {
  const width = linkedin ? 1200 : 1080;
  const height = linkedin ? 1500 : 1350;
  const margin = linkedin ? 82 : 72;
  const contentWidth = width - margin * 2;
  const page = `${String(index + 1).padStart(2, '0')} / 08`;

  if (slide.cover) {
    const markY = linkedin ? 76 : 70;
    const eyebrowY = linkedin ? 438 : 394;
    const headlineY = linkedin ? 590 : 536;
    const subheadY = linkedin ? 874 : 792;
    const markWidth = linkedin ? 430 : 390;
    const markBottom = markY + canonicalLogoHeight(markWidth);
    const ruleY = markBottom + (linkedin ? 24 : 20);
    const headlineSize = linkedin ? 112 : 100;
    const bodySize = linkedin ? 38 : 34;
    return svgFrame(width, height, `<rect width="${width}" height="${height}" fill="${token.violet}"/>
      <circle cx="${width * 0.92}" cy="${height * 0.90}" r="${width * 0.34}" fill="${token.violetDeep}" opacity="0.40"/>
      ${canonicalLogoMark(margin, markY, markWidth)}
      <line x1="${margin}" y1="${ruleY}" x2="${width - margin}" y2="${ruleY}" stroke="${token.warmWhite}" stroke-opacity="0.56"/>
      <text x="${margin}" y="${ruleY + 38}" fill="${token.warmWhite}" font-family="${family.utility}" font-size="13" font-weight="500" letter-spacing="1.45">S05 / CONVERSATIONS FOR THE WORK AHEAD</text>
      <text x="${width - margin}" y="${ruleY + 38}" fill="${token.warmWhite}" font-family="${family.utility}" font-size="13" font-weight="500" letter-spacing="1.45" text-anchor="end">BETTER AT WORK</text>
      <rect x="${margin}" y="${eyebrowY}" width="${linkedin ? 390 : 350}" height="52" rx="26" fill="${token.yellow}"/>
      <text x="${margin + (linkedin ? 195 : 175)}" y="${eyebrowY + 34}" fill="${token.ink}" font-family="${family.utility}" font-size="${linkedin ? 15 : 14}" font-weight="500" letter-spacing="1.7" text-anchor="middle">${slide.eyebrow}</text>
      ${textLines(slide.headline, margin, headlineY, { size: headlineSize, lineHeight: 0.98, colour: token.warmWhite, weight: 600, spacing: -2.2 })}
      ${textLines(slide.subhead, margin + 4, subheadY, { size: bodySize, lineHeight: 1.34, colour: token.warmWhite, weight: 400, fontFamily: family.body })}
      <line x1="${margin}" y1="${height - 118}" x2="${width - margin}" y2="${height - 118}" stroke="${token.warmWhite}" stroke-opacity="0.42"/>
      <text x="${margin}" y="${height - 70}" fill="${token.warmWhite}" font-family="${family.utility}" font-size="14" font-weight="500" letter-spacing="1.4">${slide.footer}</text>
      <text x="${width - margin}" y="${height - 70}" fill="${token.warmWhite}" font-family="${family.utility}" font-size="14" font-weight="500" letter-spacing="1.4" text-anchor="end">${page}</text>`);
  }

  const accent = token[slide.accent];
  const onAccent = accentText(slide.accent);
  const brandFieldWidth = linkedin ? 270 : 250;
  const brandFieldHeight = linkedin ? 148 : 138;
  const brandFieldX = width - margin - brandFieldWidth;
  const brandFieldY = linkedin ? 28 : 26;
  const brandLogoWidth = linkedin ? 220 : 204;
  const brandLogoX = brandFieldX + (brandFieldWidth - brandLogoWidth) / 2;
  const brandLogoY = brandFieldY + (brandFieldHeight - canonicalLogoHeight(brandLogoWidth)) / 2;
  const headlineY = linkedin ? 368 : 340;
  const bodyY = linkedin ? 644 : 574;
  const calloutY = linkedin ? 1040 : 930;
  const calloutHeight = linkedin ? 310 : 286;
  const headlineSize = linkedin ? 86 : 78;
  const bodySize = linkedin ? 34 : 31;
  const bodyLines = slide.body;
  const calloutTextSize = linkedin ? 36 : 32;
  return svgFrame(width, height, `<rect width="${width}" height="${height}" fill="${token.paper}"/>
    <rect x="0" y="0" width="${linkedin ? 18 : 16}" height="${height}" fill="${accent}"/>
    <text x="${margin}" y="92" fill="${token.inkMuted}" font-family="${family.utility}" font-size="14" font-weight="500" letter-spacing="1.7">${slide.eyebrow}</text>
    ${slide.endCard ? '' : `<rect x="${brandFieldX}" y="${brandFieldY}" width="${brandFieldWidth}" height="${brandFieldHeight}" rx="22" fill="${token.violet}"/>
    ${canonicalLogoMark(brandLogoX, brandLogoY, brandLogoWidth)}`}
    <rect x="${margin}" y="154" width="92" height="50" rx="25" fill="${accent}"/>
    <text x="${margin + 46}" y="188" fill="${onAccent}" font-family="${family.utility}" font-size="20" font-weight="500" text-anchor="middle">${slide.number}</text>
    ${textLines(slide.headline, margin, headlineY, { size: headlineSize, lineHeight: 0.98, colour: token.ink, weight: 600, spacing: -1.7 })}
    ${textLines(bodyLines, margin, bodyY, { size: bodySize, lineHeight: 1.42, colour: token.ink, weight: 400, fontFamily: family.body })}
    <rect x="${margin}" y="${calloutY}" width="${contentWidth}" height="${calloutHeight}" rx="26" fill="${accent}"/>
    <text x="${margin + 40}" y="${calloutY + 52}" fill="${onAccent}" font-family="${family.utility}" font-size="14" font-weight="500" letter-spacing="1.7">${slide.calloutLabel}</text>
    ${textLines(slide.callout, margin + 40, calloutY + 124, { size: calloutTextSize, lineHeight: 1.22, colour: onAccent, weight: 600, fontFamily: family.editorial })}
    ${slide.endCard ? canonicalLogoMark(width - margin - (linkedin ? 230 : 208) - 38, calloutY + (calloutHeight - canonicalLogoHeight(linkedin ? 230 : 208)) / 2, linkedin ? 230 : 208) : ''}
    <line x1="${margin}" y1="${height - 104}" x2="${width - margin}" y2="${height - 104}" stroke="${token.ink}" stroke-opacity="0.18"/>
    <text x="${margin}" y="${height - 56}" fill="${token.inkMuted}" font-family="${family.utility}" font-size="13" font-weight="500" letter-spacing="1.2">${slide.footer}</text>
    <text x="${width - margin}" y="${height - 56}" fill="${token.inkMuted}" font-family="${family.utility}" font-size="13" font-weight="500" letter-spacing="1.2" text-anchor="end">${page}</text>`);
}

function launchSvg(width, height, linkedin = false) {
  const margin = linkedin ? 72 : 62;
  const contentWidth = width - margin * 2;
  const panelY = linkedin ? 52 : 46;
  const panelHeight = linkedin ? 286 : 260;
  const markWidth = linkedin ? 370 : 340;
  const markX = margin + (linkedin ? 36 : 32);
  const markY = panelY + (panelHeight - canonicalLogoHeight(markWidth)) / 2;
  const metaX = markX + markWidth + (linkedin ? 70 : 58);
  const headlineY = linkedin ? 770 : 700;
  const headlineSize = linkedin ? 100 : 90;
  const footerY = height - 110;
  const defs = `<linearGradient id="launchWash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${token.ink}" stop-opacity="0.10"/><stop offset="0.48" stop-color="${token.ink}" stop-opacity="0.38"/><stop offset="1" stop-color="${token.ink}" stop-opacity="0.96"/></linearGradient>`;
  return svgFrame(width, height, `<rect width="${width}" height="${height}" fill="${token.ink}"/>
    <image href="${portraitUri}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
    <rect width="${width}" height="${height}" fill="url(#launchWash)"/>
    <rect x="${margin}" y="${panelY}" width="${contentWidth}" height="${panelHeight}" rx="24" fill="${token.violet}" fill-opacity="0.98"/>
    ${canonicalLogoMark(markX, markY, markWidth)}
    <line x1="${metaX - 30}" y1="${panelY + 46}" x2="${metaX - 30}" y2="${panelY + panelHeight - 46}" stroke="${token.yellow}" stroke-width="3"/>
    <text x="${metaX}" y="${panelY + 108}" fill="${token.warmWhite}" font-family="${family.utility}" font-size="14" font-weight="500" letter-spacing="1.5">S05 / BETTER MOMENTS 04</text>
    <text x="${metaX}" y="${panelY + 154}" fill="${token.warmWhite}" font-family="${family.utility}" font-size="14" font-weight="500" letter-spacing="1.5">LAURA GASSNER OTTING</text>
    <rect x="${margin}" y="${panelY + panelHeight + 30}" width="${linkedin ? 336 : 310}" height="54" rx="27" fill="${token.yellow}"/>
    <text x="${margin + (linkedin ? 168 : 155)}" y="${panelY + panelHeight + 66}" fill="${token.ink}" font-family="${family.utility}" font-size="15" font-weight="500" letter-spacing="1.5" text-anchor="middle">BETTER MOMENTS 04</text>
    ${textLines(['The four things', 'that make work', 'worth doing.'], margin, headlineY, { size: headlineSize, lineHeight: 0.98, colour: token.warmWhite, weight: 600, spacing: -2 })}
    <line x1="${margin}" y1="${footerY - 68}" x2="${width - margin}" y2="${footerY - 68}" stroke="${token.warmWhite}" stroke-opacity="0.48"/>
    <text x="${margin}" y="${footerY}" fill="${token.warmWhite}" font-family="${family.utility}" font-size="16" font-weight="500" letter-spacing="1.4">LAURA GASSNER OTTING</text>
    <text x="${margin}" y="${footerY + 38}" fill="${token.warmWhite}" font-family="${family.body}" font-size="23" font-weight="500">10 minutes</text>
    <rect x="${width - margin - 248}" y="${footerY - 20}" width="248" height="68" rx="34" fill="${token.yellow}"/>
    <text x="${width - margin - 124}" y="${footerY + 25}" fill="${token.ink}" font-family="${family.utility}" font-size="18" font-weight="500" letter-spacing="1.5" text-anchor="middle">OUT NOW</text>`, defs);
}

function youtubeSvg() {
  const width = 1280;
  const height = 720;
  const defs = `<linearGradient id="youtubeWash" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${token.ink}" stop-opacity="0.98"/><stop offset="0.46" stop-color="${token.ink}" stop-opacity="0.78"/><stop offset="0.72" stop-color="${token.ink}" stop-opacity="0.16"/><stop offset="1" stop-color="${token.ink}" stop-opacity="0.08"/></linearGradient>`;
  return svgFrame(width, height, `<rect width="${width}" height="${height}" fill="${token.violet}"/>
    <image href="${portraitUri}" x="520" y="0" width="760" height="720" preserveAspectRatio="xMidYMid slice"/>
    <rect width="${width}" height="${height}" fill="url(#youtubeWash)"/>
    <rect x="32" y="14" width="350" height="184" rx="24" fill="${token.violet}"/>
    ${canonicalLogoMark(48, 28, 300)}
    <text x="50" y="220" fill="${token.warmWhite}" font-family="${family.utility}" font-size="11" font-weight="500" letter-spacing="1.3">S05 / BETTER MOMENTS 04</text>
    <rect x="48" y="238" width="256" height="44" rx="22" fill="${token.yellow}"/>
    <text x="176" y="267" fill="${token.ink}" font-family="${family.utility}" font-size="12" font-weight="500" letter-spacing="1.3" text-anchor="middle">LAURA GASSNER OTTING</text>
    ${textLines(['The 4 things', 'a good job', 'needs'], 48, 350, { size: 76, lineHeight: 0.93, colour: token.warmWhite, weight: 600, spacing: -1.6 })}
    <text x="50" y="662" fill="${token.warmWhite}" font-family="${family.body}" font-size="22" font-weight="500">Calling. Connection. Contribution. Control.</text>`, defs);
}

function writeSource(svgName, pngPath, svg, width, height) {
  const svgPath = join(sourceDir, svgName);
  const normalizedSvg = normalizeSvgWhitespace(svg);
  writeFileSync(svgPath, normalizedSvg, 'utf8');
  renderQueue.push({
    svgPath,
    url: pathToFileURL(svgPath).href,
    pngPath,
    width,
    height,
  });
}

function verifyCanonicalLogoPlacements(items) {
  const legacyMark = /Better at Work (masthead|live mark|seal)/;
  const logoTransform = /<g transform="translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)" aria-label="Better at Work original logo including trademark" data-canonical-logo="true">/g;

  for (const item of items) {
    const svg = readFileSync(item.svgPath, 'utf8');
    const placements = [...svg.matchAll(logoTransform)];
    if (placements.length !== 1) {
      throw new Error(`${item.svgPath} has ${placements.length} canonical logo placements; expected 1.`);
    }
    if (legacyMark.test(svg)) {
      throw new Error(`${item.svgPath} still contains a rejected logo construction.`);
    }
    if (!svg.includes(canonicalLogoBody)) {
      throw new Error(`${item.svgPath} does not contain the exact canonical outline body.`);
    }

    const [, xValue, yValue, scaleValue] = placements[0];
    const x = Number(xValue);
    const y = Number(yValue);
    const scale = Number(scaleValue);
    const logoWidth = canonicalLogoViewBox.width * scale;
    const logoHeight = canonicalLogoViewBox.height * scale;
    const aspectRatio = logoWidth / logoHeight;
    const canonicalAspectRatio = canonicalLogoViewBox.width / canonicalLogoViewBox.height;
    if (Math.abs(aspectRatio - canonicalAspectRatio) > 1e-9) {
      throw new Error(`${item.svgPath} distorts the canonical logo.`);
    }
    if (logoWidth < 200) {
      throw new Error(`${item.svgPath} places the canonical logo below the 200 px working minimum.`);
    }
    if (x < 0 || y < 0 || x + logoWidth > item.width || y + logoHeight > item.height) {
      throw new Error(`${item.svgPath} clips the canonical logo.`);
    }
  }
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

async function openSocket(url) {
  return new Promise((resolveSocket, rejectSocket) => {
    const socket = new WebSocket(url);
    socket.addEventListener('open', () => resolveSocket(socket), { once: true });
    socket.addEventListener('error', (event) => rejectSocket(event), { once: true });
  });
}

async function renderAll(items) {
  if (!existsSync(chromePath)) {
    throw new Error(`Google Chrome is required at ${chromePath}`);
  }

  const profileDir = mkdtempSync(join(tmpdir(), 'baw-artwork-chrome-'));
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-sync',
    '--disable-extensions',
    '--metrics-recording-only',
    '--mute-audio',
    'about:blank',
  ], { stdio: 'ignore' });

  try {
    const portFile = join(profileDir, 'DevToolsActivePort');
    for (let attempt = 0; attempt < 200 && !existsSync(portFile); attempt += 1) {
      await delay(25);
    }
    if (!existsSync(portFile)) throw new Error('Chrome DevTools port did not become available.');

    const [port] = readFileSync(portFile, 'utf8').trim().split('\n');
    let targets = [];
    for (let attempt = 0; attempt < 100; attempt += 1) {
      try {
        targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
        if (targets.length) break;
      } catch {
        await delay(25);
      }
    }
    const target = targets.find((item) => item.type === 'page');
    if (!target) throw new Error('Chrome page target was not available.');

    const socket = await openSocket(target.webSocketDebuggerUrl);
    let commandId = 0;
    const pending = new Map();
    const eventWaiters = new Map();

    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) {
        const { resolveCommand, rejectCommand } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) rejectCommand(new Error(message.error.message));
        else resolveCommand(message.result);
      }
      if (message.method && eventWaiters.has(message.method)) {
        const waiters = eventWaiters.get(message.method);
        eventWaiters.delete(message.method);
        waiters.forEach((resolveEvent) => resolveEvent(message.params));
      }
    });

    const command = (method, params = {}) => new Promise((resolveCommand, rejectCommand) => {
      commandId += 1;
      pending.set(commandId, { resolveCommand, rejectCommand });
      socket.send(JSON.stringify({ id: commandId, method, params }));
    });

    const waitForEvent = (method) => new Promise((resolveEvent) => {
      const waiters = eventWaiters.get(method) || [];
      waiters.push(resolveEvent);
      eventWaiters.set(method, waiters);
    });

    await command('Page.enable');
    await command('Runtime.enable');

    for (const item of items) {
      await command('Emulation.setDeviceMetricsOverride', {
        width: item.width,
        height: item.height,
        screenWidth: item.width,
        screenHeight: item.height,
        deviceScaleFactor: 1,
        mobile: false,
      });
      const loaded = waitForEvent('Page.loadEventFired');
      await command('Page.navigate', { url: item.url });
      await loaded;
      await command('Runtime.evaluate', {
        expression: 'document.fonts.ready',
        awaitPromise: true,
        returnByValue: true,
      });
      const layoutCheck = await command('Runtime.evaluate', {
        expression: `(() => {
          const tolerance = 0.5;
          return Array.from(document.querySelectorAll('text')).map((element) => {
            const box = element.getBoundingClientRect();
            return {
              text: element.textContent,
              left: box.left,
              top: box.top,
              right: box.right,
              bottom: box.bottom,
            };
          }).filter((box) => box.left < -tolerance || box.top < -tolerance || box.right > innerWidth + tolerance || box.bottom > innerHeight + tolerance);
        })()`,
        returnByValue: true,
      });
      const clippedText = layoutCheck.result.value;
      if (clippedText.length) {
        throw new Error(`Text outside ${item.width} x ${item.height}: ${JSON.stringify(clippedText)}`);
      }
      const capture = await command('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false,
      });
      writeFileSync(item.pngPath, Buffer.from(capture.data, 'base64'));
    }

    socket.close();
  } finally {
    chrome.kill('SIGTERM');
    await delay(100);
    rmSync(profileDir, { recursive: true, force: true });
  }
}

slides.forEach((slide, index) => {
  const number = String(index + 1).padStart(2, '0');
  writeSource(
    `BetterAtWork-Laura-4Cs-Carousel-${number}.svg`,
    join(carouselDir, `BetterAtWork-Laura-4Cs-Carousel-${number}.png`),
    carouselSvg(slide, index, false),
    1080,
    1350,
  );
  writeSource(
    `BetterAtWork-Laura-4Cs-LinkedIn-${number}.svg`,
    join(linkedinDir, `BetterAtWork-Laura-4Cs-LinkedIn-${number}.png`),
    carouselSvg(slide, index, true),
    1200,
    1500,
  );
});

writeSource(
  'BetterAtWork-BetterMoments-04-Laura-IG.svg',
  join(launchDir, 'BetterAtWork-BetterMoments-04-Laura-IG.png'),
  launchSvg(1080, 1350, false),
  1080,
  1350,
);
writeSource(
  'BetterAtWork-BetterMoments-04-Laura-LinkedIn.svg',
  join(launchDir, 'BetterAtWork-BetterMoments-04-Laura-LinkedIn.png'),
  launchSvg(1200, 1500, true),
  1200,
  1500,
);
writeSource(
  'BetterAtWork-BetterMoments-04-Laura-YouTube.svg',
  join(launchDir, 'BetterAtWork-BetterMoments-04-Laura-YouTube.png'),
  youtubeSvg(),
  1280,
  720,
);

verifyCanonicalLogoPlacements(renderQueue);
await renderAll(renderQueue);

console.log('Generated 19 canonical-logo SVG sources and 19 PNG exports. Canonical outline, TM, proportion and placement checks passed.');
