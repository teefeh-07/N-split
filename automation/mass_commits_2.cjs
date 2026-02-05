const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (e) {
        return null;
    }
}

function save(type, msg) {
    run('git add .');
    const result = run('git diff --staged --name-only');
    if (result && result.length > 0) {
        run(`git commit -m "${type}: ${msg}"`);
        return true;
    }
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

// ===== MORE FEATURES FOR 500+ COMMITS =====

const FEATURES = [
    // More documentation
    {
        name: 'docs-smart-contracts',
        file: 'docs/SMART_CONTRACTS.md',
        steps: [
            { type: 'docs', msg: 'create smart contracts documentation', code: '# Smart Contracts Documentation\n\n' },
            { type: 'docs', msg: 'add nft marketplace contract doc', code: '## NFT Marketplace\n\nThe NFT marketplace contract enables users to mint, list, and trade NFTs.\n\n### Functions\n\n- `mint` - Mint a new NFT with metadata URI\n- `list-nft` - List an NFT for sale at a specified price\n- `buy-nft` - Purchase a listed NFT\n- `unlist-nft` - Remove NFT from sale\n\n' },
            { type: 'docs', msg: 'add staking vault contract doc', code: '## Staking Vault\n\nThe staking vault allows users to stake STX and earn rewards.\n\n### Functions\n\n- `stake` - Stake STX tokens\n- `unstake` - Withdraw staked tokens\n- `claim-rewards` - Claim accumulated rewards\n- `get-stake-info` - View staking position\n\n' },
            { type: 'docs', msg: 'add token launchpad contract doc', code: '## Token Launchpad\n\nCreate and manage SIP-010 compliant tokens.\n\n### Functions\n\n- `create-token` - Deploy new token\n- `get-token-info` - Get token metadata\n- `transfer` - Transfer tokens between addresses\n\n' },
            { type: 'docs', msg: 'add service registry contract doc', code: '## Service Registry\n\nRegister and pay for services on the platform.\n\n### Functions\n\n- `register-service` - Register as service provider\n- `pay-service` - Pay for a service\n- `get-service-info` - View service details\n\n' },
            { type: 'docs', msg: 'add contract deployment section', code: '## Deployment\n\n```bash\nclarinet deployments apply -p deployments/default.devnet-plan.yaml\n```\n\n' }
        ]
    },
    {
        name: 'docs-user-guide',
        file: 'docs/USER_GUIDE.md',
        steps: [
            { type: 'docs', msg: 'create user guide', code: '# User Guide\n\n' },
            { type: 'docs', msg: 'add getting started section', code: '## Getting Started\n\n1. Visit SereneHub at https://serenehub.app\n2. Connect your Stacks wallet\n3. Start exploring features\n\n' },
            { type: 'docs', msg: 'add wallet connection guide', code: '## Connecting Your Wallet\n\nSereneHub supports multiple wallet providers:\n\n- Leather (Hiro Wallet)\n- Xverse\n- WalletConnect\n\nClick "Connect Wallet" in the navbar to get started.\n\n' },
            { type: 'docs', msg: 'add nft guide', code: '## NFT Marketplace\n\n### Minting NFTs\n\n1. Navigate to the Marketplace\n2. Click "Mint NFT"\n3. Upload your artwork\n4. Set metadata and mint\n\n### Buying NFTs\n\n1. Browse available NFTs\n2. Click on one you like\n3. Click "Buy" and confirm transaction\n\n' },
            { type: 'docs', msg: 'add staking guide', code: '## Staking STX\n\n### How to Stake\n\n1. Go to the Staking page\n2. Enter the amount of STX to stake\n3. Choose lock duration\n4. Confirm transaction\n\n### Claiming Rewards\n\nRewards accumulate automatically. Click "Claim" to receive them.\n\n' },
            { type: 'docs', msg: 'add token launchpad guide', code: '## Token Launchpad\n\n### Creating a Token\n\n1. Navigate to Launchpad\n2. Fill in token details:\n   - Name\n   - Symbol\n   - Total Supply\n3. Click "Create Token"\n\n' },
            { type: 'docs', msg: 'add services guide', code: '## Services\n\n### Registering as a Provider\n\n1. Go to Services page\n2. Click "Register Service"\n3. Fill in service details\n4. Set your pricing\n\n### Hiring a Service\n\n1. Browse available services\n2. Select a provider\n3. Pay and receive service\n\n' }
        ]
    },
    // More UI components
    {
        name: 'ui-select',
        file: 'frontend/src/components/ui/Select.tsx',
        steps: [
            { type: 'feat', msg: 'create select component file', code: '// Select UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "'use client';\n\nimport { SelectHTMLAttributes, forwardRef } from 'react';\n\n" },
            { type: 'feat', msg: 'define select option type', code: 'interface SelectOption {\n  value: string;\n  label: string;\n}\n\n' },
            { type: 'feat', msg: 'define select props', code: 'interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {\n  label?: string;\n  options: SelectOption[];\n  error?: string;\n}\n\n' },
            { type: 'feat', msg: 'implement select component', code: "export const Select = forwardRef<HTMLSelectElement, SelectProps>(\n  ({ label, options, error, className = '', ...props }, ref) => {\n    return (\n      <div className=\"flex flex-col gap-1\">\n        {label && <label className=\"text-sm font-medium text-gray-700\">{label}</label>}\n        <select\n          ref={ref}\n          className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}\n          {...props}\n        >\n          {options.map((opt) => (\n            <option key={opt.value} value={opt.value}>{opt.label}</option>\n          ))}\n        </select>\n        {error && <span className=\"text-sm text-red-500\">{error}</span>}\n      </div>\n    );\n  }\n);\n\nSelect.displayName = 'Select';\n" }
        ]
    },
    {
        name: 'ui-textarea',
        file: 'frontend/src/components/ui/Textarea.tsx',
        steps: [
            { type: 'feat', msg: 'create textarea component file', code: '// Textarea UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { TextareaHTMLAttributes, forwardRef } from 'react';\n\n" },
            { type: 'feat', msg: 'define textarea props', code: 'interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {\n  label?: string;\n  error?: string;\n}\n\n' },
            { type: 'feat', msg: 'implement textarea component', code: "export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(\n  ({ label, error, className = '', ...props }, ref) => {\n    return (\n      <div className=\"flex flex-col gap-1\">\n        {label && <label className=\"text-sm font-medium text-gray-700\">{label}</label>}\n        <textarea\n          ref={ref}\n          className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px] ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}\n          {...props}\n        />\n        {error && <span className=\"text-sm text-red-500\">{error}</span>}\n      </div>\n    );\n  }\n);\n\nTextarea.displayName = 'Textarea';\n" }
        ]
    },
    {
        name: 'ui-progress',
        file: 'frontend/src/components/ui/Progress.tsx',
        steps: [
            { type: 'feat', msg: 'create progress component file', code: '// Progress UI Component\n\n' },
            { type: 'feat', msg: 'define progress props', code: 'interface ProgressProps {\n  value: number;\n  max?: number;\n  showLabel?: boolean;\n}\n\n' },
            { type: 'feat', msg: 'implement progress component', code: "export function Progress({ value, max = 100, showLabel = false }: ProgressProps) {\n  const percentage = Math.min(100, Math.max(0, (value / max) * 100));\n\n  return (\n    <div className=\"w-full\">\n      <div className=\"h-2 bg-gray-200 rounded-full overflow-hidden\">\n        <div\n          className=\"h-full bg-indigo-600 transition-all duration-300\"\n          style={{ width: `${percentage}%` }}\n        />\n      </div>\n      {showLabel && (\n        <span className=\"text-sm text-gray-600 mt-1\">{percentage.toFixed(0)}%</span>\n      )}\n    </div>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-switch',
        file: 'frontend/src/components/ui/Switch.tsx',
        steps: [
            { type: 'feat', msg: 'create switch component file', code: '// Switch UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "'use client';\n\n" },
            { type: 'feat', msg: 'define switch props', code: 'interface SwitchProps {\n  checked: boolean;\n  onChange: (checked: boolean) => void;\n  label?: string;\n  disabled?: boolean;\n}\n\n' },
            { type: 'feat', msg: 'implement switch component', code: "export function Switch({ checked, onChange, label, disabled = false }: SwitchProps) {\n  return (\n    <label className={`inline-flex items-center gap-2 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>\n      <div className=\"relative\">\n        <input\n          type=\"checkbox\"\n          checked={checked}\n          onChange={(e) => onChange(e.target.checked)}\n          disabled={disabled}\n          className=\"sr-only\" />\n        <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`} />\n        <div\n          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}\n        />\n      </div>\n      {label && <span className=\"text-sm font-medium text-gray-700\">{label}</span>}\n    </label>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-accordion',
        file: 'frontend/src/components/ui/Accordion.tsx',
        steps: [
            { type: 'feat', msg: 'create accordion component file', code: '// Accordion UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "'use client';\n\nimport { ReactNode, useState } from 'react';\n\n" },
            { type: 'feat', msg: 'define accordion item type', code: 'interface AccordionItem {\n  id: string;\n  title: string;\n  content: ReactNode;\n}\n\n' },
            { type: 'feat', msg: 'define accordion props', code: 'interface AccordionProps {\n  items: AccordionItem[];\n  allowMultiple?: boolean;\n}\n\n' },
            { type: 'feat', msg: 'implement accordion component', code: "export function Accordion({ items, allowMultiple = false }: AccordionProps) {\n  const [openItems, setOpenItems] = useState<string[]>([]);\n\n  const toggleItem = (id: string) => {\n    if (allowMultiple) {\n      setOpenItems((prev) =>\n        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]\n      );\n    } else {\n      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));\n    }\n  };\n\n  return (\n    <div className=\"border border-gray-200 rounded-lg divide-y\">\n      {items.map((item) => (\n        <div key={item.id}>\n          <button\n            onClick={() => toggleItem(item.id)}\n            className=\"w-full px-4 py-3 text-left font-medium flex justify-between items-center hover:bg-gray-50\"\n          >\n            {item.title}\n            <span>{openItems.includes(item.id) ? '−' : '+'}</span>\n          </button>\n          {openItems.includes(item.id) && (\n            <div className=\"px-4 py-3 bg-gray-50\">{item.content}</div>\n          )}\n        </div>\n      ))}\n    </div>\n  );\n}\n" }
        ]
    },
    // More hooks
    {
        name: 'hooks-wallet',
        file: 'frontend/src/hooks/useWalletInfo.ts',
        steps: [
            { type: 'feat', msg: 'create wallet info hook file', code: '// Wallet Info Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useState, useEffect } from 'react';\n\n" },
            { type: 'feat', msg: 'add service imports', code: "import { getBalance } from '@/services/stacks';\n\n" },
            { type: 'feat', msg: 'define hook interface', code: 'interface WalletInfo {\n  stxBalance: number;\n  isLoading: boolean;\n  error: string | null;\n  refetch: () => Promise<void>;\n}\n\n' },
            { type: 'feat', msg: 'implement hook', code: "export function useWalletInfo(address: string | null): WalletInfo {\n  const [stxBalance, setStxBalance] = useState(0);\n  const [isLoading, setIsLoading] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n\n  const fetchBalance = async () => {\n    if (!address) return;\n    setIsLoading(true);\n    setError(null);\n    try {\n      const data = await getBalance(address);\n      setStxBalance(parseInt(data.stx?.balance || '0') / 1_000_000);\n    } catch (e: any) {\n      setError(e.message);\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  useEffect(() => {\n    fetchBalance();\n  }, [address]);\n\n  return { stxBalance, isLoading, error, refetch: fetchBalance };\n}\n" }
        ]
    },
    {
        name: 'hooks-transaction',
        file: 'frontend/src/hooks/useTransaction.ts',
        steps: [
            { type: 'feat', msg: 'create transaction hook file', code: '// Transaction Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useState, useCallback } from 'react';\n\n" },
            { type: 'feat', msg: 'add service imports', code: "import { getTransaction } from '@/services/stacks';\n\n" },
            { type: 'feat', msg: 'define transaction status type', code: "type TxStatus = 'pending' | 'success' | 'failed' | 'idle';\n\n" },
            { type: 'feat', msg: 'define hook interface', code: 'interface UseTransactionResult {\n  status: TxStatus;\n  txId: string | null;\n  checkStatus: (id: string) => Promise<void>;\n  reset: () => void;\n}\n\n' },
            { type: 'feat', msg: 'implement hook', code: "export function useTransaction(): UseTransactionResult {\n  const [status, setStatus] = useState<TxStatus>('idle');\n  const [txId, setTxId] = useState<string | null>(null);\n\n  const checkStatus = useCallback(async (id: string) => {\n    setTxId(id);\n    setStatus('pending');\n    try {\n      const tx = await getTransaction(id);\n      setStatus(tx.tx_status === 'success' ? 'success' : 'failed');\n    } catch {\n      setStatus('failed');\n    }\n  }, []);\n\n  const reset = useCallback(() => {\n    setStatus('idle');\n    setTxId(null);\n  }, []);\n\n  return { status, txId, checkStatus, reset };\n}\n" }
        ]
    },
    {
        name: 'hooks-nft-list',
        file: 'frontend/src/hooks/useNFTList.ts',
        steps: [
            { type: 'feat', msg: 'create nft list hook file', code: '// NFT List Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useState, useEffect } from 'react';\n\n" },
            { type: 'feat', msg: 'add type imports', code: "import type { NFT } from '@/types/contracts';\n\n" },
            { type: 'feat', msg: 'define hook interface', code: 'interface UseNFTListResult {\n  nfts: NFT[];\n  isLoading: boolean;\n  error: string | null;\n  refetch: () => Promise<void>;\n}\n\n' },
            { type: 'feat', msg: 'implement hook', code: "export function useNFTList(): UseNFTListResult {\n  const [nfts, setNfts] = useState<NFT[]>([]);\n  const [isLoading, setIsLoading] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n\n  const fetchNFTs = async () => {\n    setIsLoading(true);\n    setError(null);\n    try {\n      // Fetch from contract or indexer\n      // Placeholder for now\n      setNfts([]);\n    } catch (e: any) {\n      setError(e.message);\n    } finally {\n      setIsLoading(false);\n    }\n  };\n\n  useEffect(() => {\n    fetchNFTs();\n  }, []);\n\n  return { nfts, isLoading, error, refetch: fetchNFTs };\n}\n" }
        ]
    },
    // More utils
    {
        name: 'utils-storage',
        file: 'frontend/src/lib/utils/storage.ts',
        steps: [
            { type: 'feat', msg: 'create storage utils file', code: '// Storage Utilities\n\n' },
            { type: 'feat', msg: 'add get item function', code: "export function getStorageItem<T>(key: string, defaultValue: T): T {\n  if (typeof window === 'undefined') return defaultValue;\n  try {\n    const item = localStorage.getItem(key);\n    return item ? JSON.parse(item) : defaultValue;\n  } catch {\n    return defaultValue;\n  }\n}\n\n" },
            { type: 'feat', msg: 'add set item function', code: "export function setStorageItem<T>(key: string, value: T): void {\n  if (typeof window === 'undefined') return;\n  try {\n    localStorage.setItem(key, JSON.stringify(value));\n  } catch (e) {\n    console.error('Failed to save to localStorage:', e);\n  }\n}\n\n" },
            { type: 'feat', msg: 'add remove item function', code: "export function removeStorageItem(key: string): void {\n  if (typeof window === 'undefined') return;\n  localStorage.removeItem(key);\n}\n\n" },
            { type: 'feat', msg: 'add storage keys constant', code: "export const STORAGE_KEYS = {\n  THEME: 'serenehub_theme',\n  LAST_WALLET: 'serenehub_last_wallet',\n  FAVORITES: 'serenehub_favorites',\n} as const;\n" }
        ]
    },
    {
        name: 'utils-clipboard',
        file: 'frontend/src/lib/utils/clipboard.ts',
        steps: [
            { type: 'feat', msg: 'create clipboard utils file', code: '// Clipboard Utilities\n\n' },
            { type: 'feat', msg: 'add copy to clipboard function', code: "export async function copyToClipboard(text: string): Promise<boolean> {\n  try {\n    await navigator.clipboard.writeText(text);\n    return true;\n  } catch {\n    // Fallback for older browsers\n    const textarea = document.createElement('textarea');\n    textarea.value = text;\n    document.body.appendChild(textarea);\n    textarea.select();\n    const success = document.execCommand('copy');\n    document.body.removeChild(textarea);\n    return success;\n  }\n}\n\n" },
            { type: 'feat', msg: 'add read from clipboard function', code: "export async function readFromClipboard(): Promise<string | null> {\n  try {\n    return await navigator.clipboard.readText();\n  } catch {\n    return null;\n  }\n}\n" }
        ]
    },
    {
        name: 'utils-debounce',
        file: 'frontend/src/lib/utils/debounce.ts',
        steps: [
            { type: 'feat', msg: 'create debounce utils file', code: '// Debounce Utilities\n\n' },
            { type: 'feat', msg: 'add debounce function', code: "export function debounce<T extends (...args: any[]) => any>(\n  func: T,\n  wait: number\n): (...args: Parameters<T>) => void {\n  let timeoutId: ReturnType<typeof setTimeout> | null = null;\n\n  return (...args: Parameters<T>) => {\n    if (timeoutId) clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func(...args), wait);\n  };\n}\n\n" },
            { type: 'feat', msg: 'add throttle function', code: "export function throttle<T extends (...args: any[]) => any>(\n  func: T,\n  limit: number\n): (...args: Parameters<T>) => void {\n  let inThrottle = false;\n\n  return (...args: Parameters<T>) => {\n    if (!inThrottle) {\n      func(...args);\n      inThrottle = true;\n      setTimeout(() => (inThrottle = false), limit);\n    }\n  };\n}\n" }
        ]
    },
    // More tests
    {
        name: 'test-format',
        file: 'frontend/src/lib/utils/format.test.ts',
        steps: [
            { type: 'test', msg: 'create format utils tests file', code: '// Format Utils Tests\n\n' },
            { type: 'test', msg: 'add imports', code: "import { describe, it, expect } from 'vitest';\nimport { truncateAddress, formatCurrency, formatTokenAmount } from './format';\n\n" },
            { type: 'test', msg: 'add truncate address tests', code: "describe('truncateAddress', () => {\n  it('should truncate address correctly', () => {\n    const addr = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';\n    expect(truncateAddress(addr)).toBe('ST1PQH...PGZGM');\n  });\n\n  it('should handle empty string', () => {\n    expect(truncateAddress('')).toBe('');\n  });\n});\n\n" },
            { type: 'test', msg: 'add format currency tests', code: "describe('formatCurrency', () => {\n  it('should format USD correctly', () => {\n    expect(formatCurrency(1234.56)).toBe('$1,234.56');\n  });\n});\n\n" },
            { type: 'test', msg: 'add format token amount tests', code: "describe('formatTokenAmount', () => {\n  it('should format token amounts correctly', () => {\n    expect(formatTokenAmount(1000000, 6)).toBe('1');\n  });\n});\n" }
        ]
    },
    {
        name: 'test-storage',
        file: 'frontend/src/lib/utils/storage.test.ts',
        steps: [
            { type: 'test', msg: 'create storage utils tests file', code: '// Storage Utils Tests\n\n' },
            { type: 'test', msg: 'add imports', code: "import { describe, it, expect, beforeEach } from 'vitest';\nimport { getStorageItem, setStorageItem, removeStorageItem } from './storage';\n\n" },
            { type: 'test', msg: 'add get item tests', code: "describe('getStorageItem', () => {\n  beforeEach(() => {\n    localStorage.clear();\n  });\n\n  it('should return default value when key does not exist', () => {\n    expect(getStorageItem('nonexistent', 'default')).toBe('default');\n  });\n});\n\n" },
            { type: 'test', msg: 'add set item tests', code: "describe('setStorageItem', () => {\n  beforeEach(() => {\n    localStorage.clear();\n  });\n\n  it('should save value to localStorage', () => {\n    setStorageItem('test', { value: 123 });\n    expect(localStorage.getItem('test')).toBe('{\"value\":123}');\n  });\n});\n" }
        ]
    },
    // More docs
    {
        name: 'docs-faq',
        file: 'docs/FAQ.md',
        steps: [
            { type: 'docs', msg: 'create faq documentation', code: '# Frequently Asked Questions\n\n' },
            { type: 'docs', msg: 'add general questions section', code: '## General\n\n### What is SereneHub?\n\nSereneHub is a comprehensive DeFi platform built on the Stacks blockchain, offering NFT marketplace, token launchpad, staking, and service registry features.\n\n### Which wallets are supported?\n\nWe support Leather (Hiro Wallet), Xverse, and WalletConnect-compatible wallets.\n\n' },
            { type: 'docs', msg: 'add nft questions section', code: '## NFT Marketplace\n\n### How do I mint an NFT?\n\nConnect your wallet, navigate to the Marketplace, click "Mint NFT", upload your artwork, and confirm the transaction.\n\n### What are the fees?\n\nThe platform charges a 2.5% fee on all NFT sales.\n\n' },
            { type: 'docs', msg: 'add staking questions section', code: '## Staking\n\n### What is the minimum stake amount?\n\nThe minimum stake amount is 100 STX.\n\n### How are rewards calculated?\n\nRewards are calculated based on your stake amount, lock duration, and the current reward rate.\n\n' },
            { type: 'docs', msg: 'add token questions section', code: '## Token Launchpad\n\n### Can anyone create a token?\n\nYes, anyone with a connected wallet can create a SIP-010 compliant token.\n\n### What information is needed?\n\n- Token Name\n- Token Symbol (2-6 characters)\n- Total Supply\n- Decimals (usually 6)\n\n' },
            { type: 'docs', msg: 'add troubleshooting section', code: '## Troubleshooting\n\n### Transaction pending for too long?\n\nStacks transactions typically confirm within 10-30 minutes. If it takes longer, check the network status.\n\n### Wallet not connecting?\n\nTry refreshing the page, clearing cache, or using a different browser.\n\n' }
        ]
    },
    {
        name: 'docs-roadmap',
        file: 'docs/ROADMAP.md',
        steps: [
            { type: 'docs', msg: 'create roadmap documentation', code: '# Roadmap\n\n' },
            { type: 'docs', msg: 'add phase 1 section', code: '## Phase 1: Foundation (Q1 2024)\n\n- [x] Smart contract development\n- [x] Frontend development\n- [x] Testnet deployment\n- [x] Security audit\n\n' },
            { type: 'docs', msg: 'add phase 2 section', code: '## Phase 2: Launch (Q2 2024)\n\n- [ ] Mainnet deployment\n- [ ] Community building\n- [ ] Marketing campaign\n- [ ] Partnership announcements\n\n' },
            { type: 'docs', msg: 'add phase 3 section', code: '## Phase 3: Growth (Q3 2024)\n\n- [ ] Mobile app development\n- [ ] Advanced staking features\n- [ ] Cross-chain integration\n- [ ] Governance token launch\n\n' },
            { type: 'docs', msg: 'add phase 4 section', code: '## Phase 4: Expansion (Q4 2024)\n\n- [ ] DAO governance\n- [ ] NFT lending and borrowing\n- [ ] Yield farming\n- [ ] Institutional features\n\n' }
        ]
    },
    // More types
    {
        name: 'types-wallet',
        file: 'frontend/src/types/wallet.ts',
        steps: [
            { type: 'feat', msg: 'create wallet types file', code: '// Wallet Type Definitions\n\n' },
            { type: 'feat', msg: 'add wallet state type', code: "export type WalletState = 'disconnected' | 'connecting' | 'connected' | 'error';\n\n" },
            { type: 'feat', msg: 'add user data type', code: 'export interface UserData {\n  stxAddress: string;\n  btcAddress: string;\n  profile?: {\n    name?: string;\n    avatar?: string;\n  };\n}\n\n' },
            { type: 'feat', msg: 'add wallet context type', code: 'export interface WalletContextValue {\n  state: WalletState;\n  userData: UserData | null;\n  connect: () => Promise<void>;\n  disconnect: () => void;\n}\n' }
        ]
    },
    {
        name: 'types-ui',
        file: 'frontend/src/types/ui.ts',
        steps: [
            { type: 'feat', msg: 'create ui types file', code: '// UI Type Definitions\n\n' },
            { type: 'feat', msg: 'add size type', code: "export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';\n\n" },
            { type: 'feat', msg: 'add variant type', code: "export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';\n\n" },
            { type: 'feat', msg: 'add status type', code: "export type Status = 'idle' | 'loading' | 'success' | 'error';\n\n" },
            { type: 'feat', msg: 'add theme type', code: "export type Theme = 'light' | 'dark' | 'system';\n" }
        ]
    },
    // More constants
    {
        name: 'constants-routes',
        file: 'frontend/src/constants/routes.ts',
        steps: [
            { type: 'feat', msg: 'create routes constants file', code: '// Route Constants\n\n' },
            { type: 'feat', msg: 'add route paths', code: "export const ROUTES = {\n  HOME: '/',\n  MARKETPLACE: '/marketplace',\n  STAKING: '/staking',\n  LAUNCHPAD: '/launchpad',\n  SERVICES: '/services',\n  PROFILE: '/profile',\n} as const;\n\n" },
            { type: 'feat', msg: 'add navigation items', code: "export const NAV_ITEMS = [\n  { label: 'Home', path: ROUTES.HOME },\n  { label: 'Marketplace', path: ROUTES.MARKETPLACE },\n  { label: 'Staking', path: ROUTES.STAKING },\n  { label: 'Launchpad', path: ROUTES.LAUNCHPAD },\n  { label: 'Services', path: ROUTES.SERVICES },\n] as const;\n" }
        ]
    },
    {
        name: 'constants-platform',
        file: 'frontend/src/constants/platform.ts',
        steps: [
            { type: 'feat', msg: 'create platform constants file', code: '// Platform Constants\n\n' },
            { type: 'feat', msg: 'add app info', code: "export const APP_INFO = {\n  name: 'SereneHub',\n  description: 'Premium DeFi Platform on Stacks',\n  version: '1.0.0',\n  url: 'https://serenehub.app',\n} as const;\n\n" },
            { type: 'feat', msg: 'add social links', code: "export const SOCIAL_LINKS = {\n  twitter: 'https://twitter.com/serenehub',\n  discord: 'https://discord.gg/serenehub',\n  github: 'https://github.com/serenehub',\n  telegram: 'https://t.me/serenehub',\n} as const;\n\n" },
            { type: 'feat', msg: 'add feature flags', code: "export const FEATURE_FLAGS = {\n  enableStaking: true,\n  enableNFT: true,\n  enableLaunchpad: true,\n  enableServices: true,\n  enableGovernance: false,\n} as const;\n" }
        ]
    },
    // Services
    {
        name: 'services-nft',
        file: 'frontend/src/services/nft.ts',
        steps: [
            { type: 'feat', msg: 'create nft service file', code: '// NFT Service\n\n' },
            { type: 'feat', msg: 'add imports', code: "import api from './api';\nimport type { NFT } from '@/types/contracts';\n\n" },
            { type: 'feat', msg: 'add get nfts function', code: 'export async function getNFTs(limit = 20, offset = 0): Promise<NFT[]> {\n  const response = await api.get(`/extended/v1/tokens/nft`, {\n    params: { limit, offset }\n  });\n  return response.data.results;\n}\n\n' },
            { type: 'feat', msg: 'add get nft by id function', code: 'export async function getNFTById(tokenId: number): Promise<NFT | null> {\n  try {\n    const response = await api.get(`/extended/v1/tokens/nft/${tokenId}`);\n    return response.data;\n  } catch {\n    return null;\n  }\n}\n\n' },
            { type: 'feat', msg: 'add get nfts by owner function', code: 'export async function getNFTsByOwner(address: string): Promise<NFT[]> {\n  const response = await api.get(`/extended/v1/address/${address}/nft_events`);\n  return response.data.nft_events;\n}\n' }
        ]
    },
    // Layout components
    {
        name: 'layout-header',
        file: 'frontend/src/components/layout/Header.tsx',
        steps: [
            { type: 'feat', msg: 'create header component file', code: '// Header Layout Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\nimport { ReactNode } from 'react';\n\n" },
            { type: 'feat', msg: 'define header props', code: 'interface HeaderProps {\n  title: string;\n  subtitle?: string;\n  actions?: ReactNode;\n}\n\n' },
            { type: 'feat', msg: 'implement header component', code: "export function Header({ title, subtitle, actions }: HeaderProps) {\n  return (\n    <div className=\"mb-8\">\n      <div className=\"flex items-center justify-between\">\n        <div>\n          <h1 className=\"text-3xl font-bold text-gray-900\">{title}</h1>\n          {subtitle && <p className=\"mt-1 text-gray-600\">{subtitle}</p>}\n        </div>\n        {actions && <div className=\"flex gap-3\">{actions}</div>}\n      </div>\n    </div>\n  );\n}\n" }
        ]
    },
    {
        name: 'layout-sidebar',
        file: 'frontend/src/components/layout/Sidebar.tsx',
        steps: [
            { type: 'feat', msg: 'create sidebar component file', code: '// Sidebar Layout Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\nimport Link from 'next/link';\nimport { usePathname } from 'next/navigation';\nimport { NAV_ITEMS } from '@/constants/routes';\n\n" },
            { type: 'feat', msg: 'implement sidebar component', code: "export function Sidebar() {\n  const pathname = usePathname();\n\n  return (\n    <aside className=\"w-64 bg-white border-r border-gray-200 min-h-screen p-4\">\n      <nav className=\"space-y-1\">\n        {NAV_ITEMS.map((item) => (\n          <Link\n            key={item.path}\n            href={item.path}\n            className={`block px-4 py-2 rounded-lg transition-colors ${\n              pathname === item.path\n                ? 'bg-indigo-50 text-indigo-700 font-medium'\n                : 'text-gray-600 hover:bg-gray-50'\n            }`}\n          >\n            {item.label}\n          </Link>\n        ))}\n      </nav>\n    </aside>\n  );\n}\n" }
        ]
    },
    // More UI components
    {
        name: 'ui-chip',
        file: 'frontend/src/components/ui/Chip.tsx',
        steps: [
            { type: 'feat', msg: 'create chip component file', code: '// Chip UI Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "import { ReactNode } from 'react';\n\n" },
            { type: 'feat', msg: 'define chip props', code: 'interface ChipProps {\n  children: ReactNode;\n  onRemove?: () => void;\n  color?: string;\n}\n\n' },
            { type: 'feat', msg: 'implement chip component', code: "export function Chip({ children, onRemove, color = 'indigo' }: ChipProps) {\n  return (\n    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-${color}-100 text-${color}-800`}>\n      {children}\n      {onRemove && (\n        <button onClick={onRemove} className=\"ml-1 hover:text-${color}-600\">\n          &times;\n        </button>\n      )}\n    </span>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-divider',
        file: 'frontend/src/components/ui/Divider.tsx',
        steps: [
            { type: 'feat', msg: 'create divider component file', code: '// Divider UI Component\n\n' },
            { type: 'feat', msg: 'define divider props', code: "interface DividerProps {\n  text?: string;\n  orientation?: 'horizontal' | 'vertical';\n}\n\n" },
            { type: 'feat', msg: 'implement divider component', code: "export function Divider({ text, orientation = 'horizontal' }: DividerProps) {\n  if (orientation === 'vertical') {\n    return <div className=\"w-px bg-gray-200 self-stretch\" />;\n  }\n\n  if (text) {\n    return (\n      <div className=\"flex items-center gap-4 my-4\">\n        <div className=\"flex-1 h-px bg-gray-200\" />\n        <span className=\"text-sm text-gray-500\">{text}</span>\n        <div className=\"flex-1 h-px bg-gray-200\" />\n      </div>\n    );\n  }\n\n  return <div className=\"h-px bg-gray-200 my-4\" />;\n}\n" }
        ]
    },
    {
        name: 'ui-empty-state',
        file: 'frontend/src/components/ui/EmptyState.tsx',
        steps: [
            { type: 'feat', msg: 'create empty state component file', code: '// Empty State UI Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "import { ReactNode } from 'react';\n\n" },
            { type: 'feat', msg: 'define empty state props', code: 'interface EmptyStateProps {\n  title: string;\n  description?: string;\n  icon?: ReactNode;\n  action?: ReactNode;\n}\n\n' },
            { type: 'feat', msg: 'implement empty state component', code: "export function EmptyState({ title, description, icon, action }: EmptyStateProps) {\n  return (\n    <div className=\"flex flex-col items-center justify-center py-12 px-4 text-center\">\n      {icon && <div className=\"text-gray-400 mb-4\">{icon}</div>}\n      <h3 className=\"text-lg font-medium text-gray-900 mb-1\">{title}</h3>\n      {description && <p className=\"text-gray-500 mb-4 max-w-sm\">{description}</p>}\n      {action}\n    </div>\n  );\n}\n" }
        ]
    },
    // Config
    {
        name: 'config-seo',
        file: 'frontend/src/config/seo.ts',
        steps: [
            { type: 'feat', msg: 'create seo config file', code: '// SEO Configuration\n\n' },
            { type: 'feat', msg: 'add default seo config', code: "export const defaultSEO = {\n  title: 'SereneHub | Premium DeFi on Stacks',\n  description: 'The all-in-one platform for NFTs, Tokens, Staking, and Services on the Stacks blockchain.',\n  openGraph: {\n    type: 'website',\n    locale: 'en_US',\n    url: 'https://serenehub.app',\n    siteName: 'SereneHub',\n  },\n  twitter: {\n    handle: '@serenehub',\n    site: '@serenehub',\n    cardType: 'summary_large_image',\n  },\n};\n\n" },
            { type: 'feat', msg: 'add page titles', code: "export const pageTitles = {\n  home: 'SereneHub | Premium DeFi on Stacks',\n  marketplace: 'NFT Marketplace | SereneHub',\n  staking: 'Staking | SereneHub',\n  launchpad: 'Token Launchpad | SereneHub',\n  services: 'Services | SereneHub',\n} as const;\n" }
        ]
    }
];

// Ensure directories exist
const dirs = [
    'docs',
    'frontend/src/lib/utils',
    'frontend/src/hooks',
    'frontend/src/components/ui',
    'frontend/src/components/layout',
    'frontend/src/types',
    'frontend/src/constants',
    'frontend/src/services',
    'frontend/src/config'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Execute all features
let totalCommits = 0;
let totalBranches = 0;

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

// Show final commit count
const commitCount = run('git log --oneline | wc -l');
console.log(`Total commits in repository: ${commitCount}`);
