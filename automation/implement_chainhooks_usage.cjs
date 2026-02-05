const { execSync } = require('child_process');
const fs = require('fs');
const FILE = 'frontend/src/lib/chainhooks.ts';

function run(cmd) { execSync(cmd, { stdio: 'inherit' }); }
function save(msg) { run(`node automation/auto-git.cjs save feat "${msg}"`); }

run(`node automation/auto-git.cjs start-feature chainhooks-setup`);

// 1. Create directory if not exists
// fs.mkdirSync('frontend/src/lib', {recursive: true}); // Exists

// 2. Create file
fs.writeFileSync(FILE, '// Chainhooks Client Setup\n');
save('create chainhooks config file');

// 3. Import
fs.appendFileSync(FILE, `import { ChainhooksClient } from '@hirosystems/chainhooks-client';\n`);
save('add chainhooks import');

// 4. Config
fs.appendFileSync(FILE, `
export const chainhooksClient = new ChainhooksClient({
    url: 'http://localhost:20456', // Default Clarinet Chainhooks port
    apiKey: process.env.CHAINHOOKS_API_KEY || ''
});
`);
save('initialize chainhooks client');

run(`node automation/auto-git.cjs finish`);
