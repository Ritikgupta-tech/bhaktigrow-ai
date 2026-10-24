import { existsSync, mkdirSync, cpSync } from 'fs';
import { execSync } from 'child_process';

const inRoot = existsSync('bhaktigrow-ai/frontend/package.json');
const targetDir = inRoot ? 'bhaktigrow-ai/frontend' : '.';
console.log(`[Vercel Build] Running npm run build in ${targetDir}...`);
execSync('npm run build', { cwd: targetDir, stdio: 'inherit' });

if (inRoot) {
  console.log('[Vercel Build] Copying dist to root dist...');
  mkdirSync('dist', { recursive: true });
  cpSync('bhaktigrow-ai/frontend/dist', 'dist', { recursive: true });
}
