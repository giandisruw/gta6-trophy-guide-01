// Leonida Platinum — the hand-in program (Node 22, standard library only).
// It gathers the finished guide — app/ and screenshots/ beside this file — into the
// output directory and writes dossier.json with the kit's vendored library, which is
// what the judge reads. The grader runs this twice and expects identical bytes both
// times, so nothing here depends on the clock or the environment beyond the output
// directory itself. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from an empty output directory so a stale file from an earlier run can
// never leak into this one.
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps are the scorer's own: at most 4 screenshots of 256 KiB each, app/ within
// 993 files and 48 MiB, and the dossier text within 160 KiB (1.5 MiB total).
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`Leonida Platinum dossier: ${Buffer.byteLength(dossier, 'utf8')} bytes in ${outputDir}`);
