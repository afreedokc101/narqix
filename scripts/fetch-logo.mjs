#!/usr/bin/env node
// Downloads the Narqix logo into public/logo.png (the site never hotlinks it). Run once, then commit public/logo.png.
import fs from 'node:fs';

const res = await fetch('https://narqix.com/HomeLogo.png');
if (!res.ok) throw new Error(`Logo download failed: HTTP ${res.status}`);
const buf = Buffer.from(await res.arrayBuffer());
if (buf.subarray(1, 4).toString() !== 'PNG') throw new Error('Downloaded file is not a PNG');
fs.writeFileSync(new URL('../public/logo.png', import.meta.url), buf);
console.log(`Saved public/logo.png (${buf.length} bytes). Rebuild the site to use it.`);
