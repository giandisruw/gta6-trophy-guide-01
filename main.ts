// Leonida Platinum — the hand-in program for the gta6-trophy-guide-01 entry.
// Node 22, standard library only. It copies this repository's app/ and
// screenshots/ into the output directory and writes /output/dossier.json with
// the vendored make.fun library, exactly as the kit's starter does — the
// scorer rebuilds the dossier from the same library and compares byte for byte,
// so vendor/makefun-frontend.ts must stay untouched.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps (from the kit's reference/gate.json): only
// text_max_bytes shapes the dossier's bytes; the rest refuse an entry the
// scorer would refuse — more than 4 screenshots or one over 256 KiB, more than
// 993 files and directories in app/, or app/ over 48 MiB.
const dossierPath = join(outputDir, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

// A short build summary for the grading log: what was handed in.
const appFiles = readdirSync(join(outputDir, 'app'), { recursive: true }).length;
const shotFiles = readdirSync(join(outputDir, 'screenshots')).length;
console.log(`Leonida Platinum: app/ (${appFiles} entries), ${shotFiles} screenshots, dossier.json (${statSync(dossierPath).size} bytes) written to ${outputDir}`);
