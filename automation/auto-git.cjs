const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Automates micro-commits and branching.
 */

const OPERATIONS = {
    BRANCH: 'branch',
    COMMIT: 'commit',
    MERGE: 'merge'
};

function run(cmd) {
    try {
        // console.log(`> ${cmd}`);
        return execSync(cmd, { encoding: 'utf8' }).trim();
    } catch (e) {
        // console.error(`Error running command: ${cmd}`);
        // console.error(e.stderr);
        throw e;
    }
}

function ensureMain() {
    try {
        const branch = run('git branch --show-current');
        if (branch !== 'main') {
            run('git checkout main');
        }
    } catch (e) {
        // If generated for the first time
        run('git checkout -b main');
    }
}

function createBranch(featureName) {
    const branchName = `feat/${featureName}-${Date.now()}`;
    run(`git checkout -b ${branchName}`);
    return branchName;
}

function microCommit(type, message) {
    run('git add .');
    // Check if there are changes
    try {
        run('git diff --staged --quiet');
        console.log('No changes to commit.');
        return false;
    } catch (e) {
        // diff returns exit code 1 if there are differences, which implies changes exist
        run(`git commit -m "${type}: ${message}"`);
        return true;
    }
}

function mergeBranch(branchName) {
    run('git checkout main');
    run(`git merge ${branchName} --no-ff -m "Merge branch '${branchName}' into main"`);
    // run(\`git branch -d ${branchName}\`); // Optional: delete after merge
}

// CLI usage
const args = process.argv.slice(2);
const command = args[0];

if (command === 'start-feature') {
    const name = args[1];
    if (!name) throw new Error('Feature name required');
    const branch = createBranch(name);
    console.log(`Switched to branch: ${branch}`);
} else if (command === 'save') {
    const type = args[1] || 'feat';
    const msg = args[2] || 'update';
    microCommit(type, msg);
} else if (command === 'finish') {
    const branch = run('git branch --show-current');
    if (branch === 'main') {
        console.log('Already on main');
    } else {
        mergeBranch(branch);
        console.log(`Merged ${branch} into main`);
    }
} else {
    console.log('Usage: node auto-git.cjs [start-feature <name> | save <type> <msg> | finish]');
}
