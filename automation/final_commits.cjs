const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
    try { return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim(); } catch (e) { return null; }
}
function save(type, msg) {
    run('git add .');
    const result = run('git diff --staged --name-only');
    if (result && result.length > 0) { run(`git commit -m "${type}: ${msg}"`); return true; }
    return false;
}
function createBranch(name) {
    const branchName = `feat/${name}-${Date.now()}`;
    run(`git checkout -b ${branchName}`);
    return branchName;
}
function finishBranch(branchName) {
    run('git checkout main');
    run(`git merge ${branchName} --no-ff -m "Merge branch '${branchName}' into main"`);
}

const FEATURES = [
    {
        name: 'docs-license-details',
        file: 'docs/LICENSE_DETAILS.md',
        steps: [
            { type: 'docs', msg: 'create license details doc', code: '# License Details\n\n## MIT License\n\nThis project is licensed under the MIT License.\n\n' },
            { type: 'docs', msg: 'add permissions section', code: '## Permissions\n\n- Commercial use\n- Modification\n- Distribution\n- Private use\n\n' },
            { type: 'docs', msg: 'add limitations section', code: '## Limitations\n\n- No liability\n- No warranty\n\n' }
        ]
    },
    {
        name: 'utils-string',
        file: 'frontend/src/lib/utils/string.ts',
        steps: [
            { type: 'feat', msg: 'create string utils file', code: '// String Utilities\n\n' },
            { type: 'feat', msg: 'add capitalize function', code: 'export function capitalize(str: string): string {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}\n\n' },
            { type: 'feat', msg: 'add slugify function', code: 'export function slugify(str: string): string {\n  return str.toLowerCase().replace(/\\s+/g, "-").replace(/[^a-z0-9-]/g, "");\n}\n\n' },
            { type: 'feat', msg: 'add truncate function', code: 'export function truncate(str: string, length: number): string {\n  return str.length > length ? str.slice(0, length) + "..." : str;\n}\n' }
        ]
    },
    {
        name: 'hooks-debounce',
        file: 'frontend/src/hooks/useDebounce.ts',
        steps: [
            { type: 'feat', msg: 'create debounce hook file', code: '// Debounce Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: 'import { useState, useEffect } from "react";\n\n' },
            { type: 'feat', msg: 'implement debounce hook', code: 'export function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n' }
        ]
    },
    {
        name: 'ui-radio-group',
        file: 'frontend/src/components/ui/RadioGroup.tsx',
        steps: [
            { type: 'feat', msg: 'create radio group component', code: '// Radio Group UI Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\n" },
            { type: 'feat', msg: 'define radio option type', code: 'interface RadioOption {\n  value: string;\n  label: string;\n}\n\n' },
            { type: 'feat', msg: 'define radio group props', code: 'interface RadioGroupProps {\n  options: RadioOption[];\n  value: string;\n  onChange: (value: string) => void;\n  name: string;\n}\n\n' },
            { type: 'feat', msg: 'implement radio group component', code: 'export function RadioGroup({ options, value, onChange, name }: RadioGroupProps) {\n  return (\n    <div className="space-y-2">\n      {options.map((option) => (\n        <label key={option.value} className="flex items-center gap-2 cursor-pointer">\n          <input\n            type="radio"\n            name={name}\n            value={option.value}\n            checked={value === option.value}\n            onChange={(e) => onChange(e.target.value)}\n            className="w-4 h-4 text-indigo-600"\n          />\n          <span>{option.label}</span>\n        </label>\n      ))}\n    </div>\n  );\n}\n' }
        ]
    },
    {
        name: 'ui-checkbox',
        file: 'frontend/src/components/ui/Checkbox.tsx',
        steps: [
            { type: 'feat', msg: 'create checkbox component', code: '// Checkbox UI Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\n" },
            { type: 'feat', msg: 'define checkbox props', code: 'interface CheckboxProps {\n  checked: boolean;\n  onChange: (checked: boolean) => void;\n  label?: string;\n  disabled?: boolean;\n}\n\n' },
            { type: 'feat', msg: 'implement checkbox component', code: 'export function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {\n  return (\n    <label className={`flex items-center gap-2 ${disabled ? "opacity-50" : "cursor-pointer"}`}>\n      <input\n        type="checkbox"\n        checked={checked}\n        onChange={(e) => onChange(e.target.checked)}\n        disabled={disabled}\n        className="w-4 h-4 rounded text-indigo-600"\n      />\n      {label && <span className="text-sm">{label}</span>}\n    </label>\n  );\n}\n' }
        ]
    },
    {
        name: 'docs-glossary',
        file: 'docs/GLOSSARY.md',
        steps: [
            { type: 'docs', msg: 'create glossary doc', code: '# Glossary\n\n' },
            { type: 'docs', msg: 'add stacks terms', code: '## Stacks Terms\n\n- **STX**: Native token of Stacks blockchain\n- **Clarity**: Smart contract language for Stacks\n- **SIP-010**: Fungible token standard\n\n' },
            { type: 'docs', msg: 'add defi terms', code: '## DeFi Terms\n\n- **APY**: Annual Percentage Yield\n- **TVL**: Total Value Locked\n- **LP**: Liquidity Provider\n\n' },
            { type: 'docs', msg: 'add nft terms', code: '## NFT Terms\n\n- **Mint**: Create a new NFT\n- **Floor Price**: Lowest available price\n- **Royalty**: Creator earnings percentage\n\n' }
        ]
    }
];

if (!fs.existsSync('frontend/src/lib/utils')) fs.mkdirSync('frontend/src/lib/utils', { recursive: true });
if (!fs.existsSync('frontend/src/hooks')) fs.mkdirSync('frontend/src/hooks', { recursive: true });
if (!fs.existsSync('frontend/src/components/ui')) fs.mkdirSync('frontend/src/components/ui', { recursive: true });

let totalCommits = 0, totalBranches = 0;

for (const feature of FEATURES) {
    console.log(`\n=== Starting feature: ${feature.name} ===`);
    const branchName = createBranch(feature.name);
    totalBranches++;
    let fileContent = '';
    for (const step of feature.steps) {
        fileContent += step.code;
        fs.writeFileSync(feature.file, fileContent);
        if (save(step.type, step.msg)) {
            totalCommits++;
            console.log(`  ✓ ${step.type}: ${step.msg}`);
        }
    }
    finishBranch(branchName);
    console.log(`  Merged ${branchName} into main`);
}

console.log(`\n========================================`);
console.log(`Total new branches: ${totalBranches}`);
console.log(`Total new commits: ${totalCommits}`);
console.log(`========================================`);
const commitCount = run('git log --oneline | wc -l');
console.log(`Total commits in repository: ${commitCount}`);
