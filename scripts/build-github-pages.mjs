import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const normalizeProjectSlug = (name) =>
  String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-demo$/, '');

const inferProjectName = () => {
  const explicitName = process.env.PROJECT_NAME || process.env.PROJECT_SLUG;
  if (explicitName) {
    return explicitName;
  }

  const githubRepoName = process.env.GITHUB_REPOSITORY?.split('/').pop();
  if (githubRepoName) {
    return githubRepoName;
  }

  return path.basename(repoRoot);
};

const projectSlug = normalizeProjectSlug(inferProjectName());

if (!projectSlug) {
  console.error('Unable to derive a project slug for the GitHub Pages build.');
  process.exit(1);
}

const publicUrl = `/${projectSlug}-demo`;

console.log(`Building static demo for ${publicUrl}/`);

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
