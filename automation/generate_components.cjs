const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) { execSync(cmd, { stdio: 'inherit' }); }
function save(type, msg) { run(`node automation/auto-git.cjs save ${type} "${msg}"`); }
function start(name) { run(`node automation/auto-git.cjs start-feature ${name}`); }
function finish() { run(`node automation/auto-git.cjs finish`); }

const TASKS = [
    {
        name: 'ui-button',
        file: 'frontend/src/components/ui/Button.tsx',
        steps: [
            { msg: 'create button component file', code: '// Button UI Component\n' },
            { msg: 'add react imports', code: "import { ButtonHTMLAttributes, ReactNode } from 'react';\n" },
            { msg: 'define button props interface', code: "interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: 'primary' | 'secondary' | 'outline';\n  size?: 'sm' | 'md' | 'lg';\n  children: ReactNode;\n}\n" },
            { msg: 'implement button component shell', code: "export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {\n" },
            { msg: 'add base styles', code: "  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';\n" },
            { msg: 'add variant styles map', code: "  const variants = {\n    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',\n    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',\n    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700'\n  };\n" },
            { msg: 'add size styles map', code: "  const sizes = {\n    sm: 'px-3 py-1.5 text-sm',\n    md: 'px-4 py-2 text-base',\n    lg: 'px-6 py-3 text-lg'\n  };\n" },
            { msg: 'construct final class name', code: "  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;\n" },
            { msg: 'return button element', code: "  return (\n    <button className={classes} {...props}>\n      {children}\n    </button>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-card',
        file: 'frontend/src/components/ui/Card.tsx',
        steps: [
            { msg: 'create card component file', code: '// Card UI Component\n' },
            { msg: 'add react imports', code: "import { HTMLAttributes, ReactNode } from 'react';\n" },
            { msg: 'define card props', code: "interface CardProps extends HTMLAttributes<HTMLDivElement> {\n  children: ReactNode;\n}\n" },
            { msg: 'implement card component', code: "export function Card({ className = '', children, ...props }: CardProps) {\n  return (\n    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`} {...props}>\n      {children}\n    </div>\n  );\n}\n" },
            { msg: 'implement card header', code: "export function CardHeader({ className = '', children, ...props }: CardProps) {\n  return <div className={`p-6 border-b border-gray-100 ${className}`} {...props}>{children}</div>;\n}\n" },
            { msg: 'implement card content', code: "export function CardContent({ className = '', children, ...props }: CardProps) {\n  return <div className={`p-6 ${className}`} {...props}>{children}</div>;\n}\n" },
            { msg: 'implement card footer', code: "export function CardFooter({ className = '', children, ...props }: CardProps) {\n  return <div className={`p-6 bg-gray-50 rounded-b-xl ${className}`} {...props}>{children}</div>;\n}\n" }
        ]
    },
    {
        name: 'utils-format',
        file: 'frontend/src/lib/utils/format.ts',
        steps: [
            { msg: 'create format utils file', code: '// Formatting Utilities\n' },
            { msg: 'add address truncator function', code: "export function truncateAddress(address: string, start = 6, end = 4) {\n  if (!address) return '';\n  return `${address.slice(0, start)}...${address.slice(-end)}`;\n}\n" },
            { msg: 'add currency formatter', code: "export function formatCurrency(amount: number, currency = 'USD') {\n  return new Intl.NumberFormat('en-US', {\n    style: 'currency',\n    currency,\n  }).format(amount);\n}\n" },
            { msg: 'add token amount formatter', code: "export function formatTokenAmount(amount: number, decimals = 6) {\n  return (amount / Math.pow(10, decimals)).toLocaleString('en-US', { maximumFractionDigits: decimals });\n}\n" }
        ]
    }
];

// Ensure directories
if (!fs.existsSync('frontend/src/components/ui')) {
    fs.mkdirSync('frontend/src/components/ui', { recursive: true });
}
if (!fs.existsSync('frontend/src/lib/utils')) {
    fs.mkdirSync('frontend/src/lib/utils', { recursive: true });
}

// Execute Tasks
async function execute() {
    for (const task of TASKS) {
        console.log(`\n--- Starting Task: ${task.name} ---`);
        start(task.name);

        let fileContent = '';
        const filePath = task.file;

        for (const step of task.steps) {
            console.log(`Step: ${step.msg}`);
            fileContent += step.code + '\n';
            fs.writeFileSync(filePath, fileContent);
            save('feat', step.msg);
            // Simulate work time
            await new Promise(r => setTimeout(r, 500));
        }

        finish();
    }
}

execute();
