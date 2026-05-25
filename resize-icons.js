/**
 * FairSplit – Android Icon Resizer
 * Uses the already-installed sharp to copy icons into all Android mipmap folders.
 * Run: node resize-icons.js
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const SOURCE = path.join(__dirname, 'assets', 'icon-only.png');

// All Android icon sizes
const SIZES = [
  { folder: 'mipmap-mdpi',    size: 48  },
  { folder: 'mipmap-hdpi',    size: 72  },
  { folder: 'mipmap-xhdpi',   size: 96  },
  { folder: 'mipmap-xxhdpi',  size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

const RES_DIR = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

async function generate() {
  if (!fs.existsSync(SOURCE)) {
    console.error('❌  Source icon not found at assets/icon-only.png');
    process.exit(1);
  }

  for (const { folder, size } of SIZES) {
    const dir = path.join(RES_DIR, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Standard icon
    await sharp(SOURCE)
      .resize(size, size)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    // Round icon (same image — Android clips it to circle)
    await sharp(SOURCE)
      .resize(size, size)
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    console.log(`✅  ${folder} → ${size}x${size}px`);
  }

  console.log('\n🎉  All Android icons generated successfully!');
}

generate().catch(err => {
  console.error('❌  Failed:', err);
  process.exit(1);
});
