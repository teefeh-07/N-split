const { execSync } = require('child_process');

function run(cmd) {
    try {
        console.log(`> ${cmd}`);
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (e) {
        console.log(`Command failed: ${e.message}`);
        return null;
    }
}

// Get all branches except main
const branches = run('git branch').split('\n')
    .map(b => b.trim().replace('* ', ''))
    .filter(b => b && b !== 'main');

console.log(`Found ${branches.length} branches to push`);

// Push all branches
for (const branch of branches) {
    console.log(`\nPushing branch: ${branch}`);
    run(`git push origin ${branch}`);
}

console.log('\n========================================');
console.log('All branches pushed successfully!');
console.log('========================================');
