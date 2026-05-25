/**
 * FairSplit – App Icon Generator
 * Generates a 1024×1024 icon matching the app's exact color palette.
 * Outputs: assets/icon-only.png
 *
 * Design:
 *  - Deep dark background  (#0a0a0c)
 *  - Amber gradient logo box (matching --bg-logo-a / --bg-logo-b)
 *  - Amber lightning bolt  (electricity theme)
 *  - Split/divide line      (bill-splitting theme)
 *  - Amber border glow
 *
 * Usage:  node generate-icon.js
 * Deps:   npm install sharp  (already in the GitHub Actions step)
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

// ── Brand colours (from app CSS variables) ─────────────────────────────────
const BG_DEEP   = '#0a0a0c';   // --bg-deep
const BG_LOGO_A = '#001a0d';   // --bg-logo-a  (dark amber, inner)
const BG_LOGO_B = '#002d16';   // --bg-logo-b  (dark amber, outer)
const AMBER     = '#10b981';   // --amber
const AMBER_DRK = '#065f46';   // --amber-dark
const AMBER_LIT = '#6ee7b7';   // --amber-light
const WHITE     = '#f4f4f8';   // --text-1

// ── SVG (1024 × 1024) ──────────────────────────────────────────────────────
const SVG = `<svg xmlns="http://www.w3.org/2000/svg"
     width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <!-- Deep background radial glow -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="70%">
      <stop offset="0%"   stop-color="#1a1000"/>
      <stop offset="100%" stop-color="${BG_DEEP}"/>
    </radialGradient>

    <!-- Logo box gradient (top-left → bottom-right) -->
    <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${BG_LOGO_B}"/>
      <stop offset="100%" stop-color="${BG_LOGO_A}"/>
    </linearGradient>

    <!-- Amber bolt gradient (top → bottom) -->
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="${AMBER_LIT}"/>
      <stop offset="60%"  stop-color="${AMBER}"/>
      <stop offset="100%" stop-color="${AMBER_DRK}"/>
    </linearGradient>

    <!-- Glow filter for bolt -->
    <filter id="boltGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- Soft shadow on the box -->
    <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="30"
                    flood-color="${AMBER}" flood-opacity="0.35"/>
    </filter>

    <!-- Clip to rounded square -->
    <clipPath id="roundClip">
      <rect width="1024" height="1024" rx="200" ry="200"/>
    </clipPath>
  </defs>

  <!-- ── Background ──────────────────────────────────────── -->
  <rect width="1024" height="1024" fill="url(#bgGlow)" rx="200" ry="200"/>

  <!-- Subtle amber ambient ring -->
  <ellipse cx="512" cy="512" rx="370" ry="370"
           fill="none" stroke="${AMBER}" stroke-width="1"
           stroke-opacity="0.06"/>
  <ellipse cx="512" cy="512" rx="440" ry="440"
           fill="none" stroke="${AMBER}" stroke-width="1"
           stroke-opacity="0.04"/>

  <!-- ── Rounded logo card ───────────────────────────────── -->
  <rect x="192" y="192" width="640" height="640" rx="120" ry="120"
        fill="url(#boxGrad)"
        stroke="${AMBER}" stroke-width="3" stroke-opacity="0.45"
        filter="url(#boxShadow)"/>

  <!-- ── Lightning bolt (electricity symbol) ────────────── -->
  <!--
    Centred on 512,512.
    Top spike → crossing line → bottom spike.
    Classic "Z" bolt shape.
  -->
  <path d="
    M 560 210
    L 390 530
    L 490 530
    L 460 810
    L 640 480
    L 535 480
    Z
  "
    fill="url(#boltGrad)"
    filter="url(#boltGlow)"/>

  <!-- ── Dividing line (bill-split symbol) ──────────────── -->
  <!--
    A thin horizontal bar crossing the bolt at mid-height,
    evoking the ÷ symbol and the idea of splitting.
  -->
  <rect x="230" y="496" width="560" height="6"
        rx="3" ry="3"
        fill="${AMBER}" fill-opacity="0.22"/>

  <!-- Two small dots completing the ÷ look -->
  <circle cx="512" cy="420" r="14" fill="${AMBER}" fill-opacity="0.30"/>
  <circle cx="512" cy="600" r="14" fill="${AMBER}" fill-opacity="0.30"/>

  <!-- ── Corner accent dots ──────────────────────────────── -->
  <circle cx="236" cy="236" r="6" fill="${AMBER}" fill-opacity="0.5"/>
  <circle cx="788" cy="236" r="6" fill="${AMBER}" fill-opacity="0.5"/>
  <circle cx="236" cy="788" r="6" fill="${AMBER}" fill-opacity="0.5"/>
  <circle cx="788" cy="788" r="6" fill="${AMBER}" fill-opacity="0.5"/>
</svg>`;

// ── Write output ────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, 'assets');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, 'icon-only.png');

sharp(Buffer.from(SVG))
  .resize(1024, 1024)
  .png()
  .toFile(outPath)
  .then(() => console.log(`✅  Icon saved → ${outPath}`))
  .catch(err => { console.error('❌  Icon generation failed:', err); process.exit(1); });
