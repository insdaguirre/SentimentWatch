import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const publicUrl = process.env.PUBLIC_URL || '.';

console.log(`Building static demo with PUBLIC_URL=${publicUrl}`);

const result = spawnSync('npm', ['run', 'build', '--prefix', 'frontend'], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    PUBLIC_URL: publicUrl,
  },
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
