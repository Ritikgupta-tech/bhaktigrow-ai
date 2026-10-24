import { existsSync } from 'fs';
import { execSync } from 'child_process';

const targetDir = existsSync('bhaktigrow-ai/frontend/package.json') ? 'bhaktigrow-ai/frontend' : '.';
console.log(`[Vercel Install] Running npm install in ${targetDir}...`);
execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
