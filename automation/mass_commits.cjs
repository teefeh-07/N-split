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
    // Check if there are staged changes
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

// ===== MICRO-COMMIT GENERATORS =====

const FEATURES = [
    // Documentation commits
    {
        name: 'docs-api-reference',
        file: 'docs/API_REFERENCE.md',
        steps: [
            { type: 'docs', msg: 'create api reference file', code: '# API Reference\n\n' },
            { type: 'docs', msg: 'add api overview section', code: '## Overview\n\nThis document provides a comprehensive reference for the SereneHub API.\n\n' },
            { type: 'docs', msg: 'add authentication section', code: '## Authentication\n\nAll API calls require wallet authentication via Stacks Connect.\n\n' },
            { type: 'docs', msg: 'add endpoints section header', code: '## Endpoints\n\n' },
            { type: 'docs', msg: 'add nft marketplace endpoints', code: '### NFT Marketplace\n\n- `mint-nft` - Mint a new NFT\n- `list-nft` - List NFT for sale\n- `buy-nft` - Purchase listed NFT\n\n' },
            { type: 'docs', msg: 'add staking endpoints', code: '### Staking\n\n- `stake` - Stake STX tokens\n- `unstake` - Unstake and claim rewards\n- `claim-rewards` - Claim pending rewards\n\n' },
            { type: 'docs', msg: 'add token launchpad endpoints', code: '### Token Launchpad\n\n- `create-token` - Create new SIP-010 token\n- `get-token-info` - Get token metadata\n\n' },
            { type: 'docs', msg: 'add error codes section', code: '## Error Codes\n\n| Code | Description |\n|------|-------------|\n| u100 | Unauthorized |\n| u101 | Insufficient funds |\n| u102 | Invalid parameters |\n\n' }
        ]
    },
    {
        name: 'docs-deployment',
        file: 'docs/DEPLOYMENT.md',
        steps: [
            { type: 'docs', msg: 'create deployment guide', code: '# Deployment Guide\n\n' },
            { type: 'docs', msg: 'add prerequisites section', code: '## Prerequisites\n\n- Node.js 18+\n- Clarinet CLI\n- GitHub account\n\n' },
            { type: 'docs', msg: 'add environment setup', code: '## Environment Setup\n\n```bash\ncp .env.example .env\n# Edit .env with your configuration\n```\n\n' },
            { type: 'docs', msg: 'add contract deployment steps', code: '## Contract Deployment\n\n1. Navigate to contracts directory\n2. Run `clarinet check`\n3. Deploy to testnet\n\n' },
            { type: 'docs', msg: 'add frontend deployment steps', code: '## Frontend Deployment\n\n```bash\ncd frontend\nnpm run build\nnpm run start\n```\n\n' }
        ]
    },
    // Utility functions
    {
        name: 'utils-validation',
        file: 'frontend/src/lib/utils/validation.ts',
        steps: [
            { type: 'feat', msg: 'create validation utils file', code: '// Validation Utilities\n\n' },
            { type: 'feat', msg: 'add stx address validator', code: 'export function isValidStxAddress(address: string): boolean {\n  return /^S[PT][A-Z0-9]{38,40}$/.test(address);\n}\n\n' },
            { type: 'feat', msg: 'add amount validator', code: 'export function isValidAmount(amount: string): boolean {\n  const num = parseFloat(amount);\n  return !isNaN(num) && num > 0;\n}\n\n' },
            { type: 'feat', msg: 'add token name validator', code: 'export function isValidTokenName(name: string): boolean {\n  return name.length >= 3 && name.length <= 32;\n}\n\n' },
            { type: 'feat', msg: 'add token symbol validator', code: 'export function isValidTokenSymbol(symbol: string): boolean {\n  return /^[A-Z]{2,6}$/.test(symbol);\n}\n\n' }
        ]
    },
    {
        name: 'utils-stacks',
        file: 'frontend/src/lib/utils/stacks.ts',
        steps: [
            { type: 'feat', msg: 'create stacks utils file', code: '// Stacks Utilities\n\n' },
            { type: 'feat', msg: 'add imports', code: "import { StacksMainnet, StacksTestnet } from '@stacks/network';\n\n" },
            { type: 'feat', msg: 'add network getter', code: "export function getNetwork(isMainnet: boolean = false) {\n  return isMainnet ? new StacksMainnet() : new StacksTestnet();\n}\n\n" },
            { type: 'feat', msg: 'add microSTX converter', code: 'export function stxToMicro(stx: number): number {\n  return Math.floor(stx * 1_000_000);\n}\n\n' },
            { type: 'feat', msg: 'add STX converter', code: 'export function microToStx(micro: number): number {\n  return micro / 1_000_000;\n}\n\n' }
        ]
    },
    // React Hooks
    {
        name: 'hooks-staking',
        file: 'frontend/src/hooks/useStaking.ts',
        steps: [
            { type: 'feat', msg: 'create staking hook file', code: '// Staking Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useState, useCallback } from 'react';\n\n" },
            { type: 'feat', msg: 'add stacks imports', code: "import { openContractCall } from '@stacks/connect';\nimport { StacksTestnet } from '@stacks/network';\nimport { uintCV, PostConditionMode } from '@stacks/transactions';\n\n" },
            { type: 'feat', msg: 'define hook interface', code: 'interface UseStakingResult {\n  stake: (amount: number) => Promise<void>;\n  unstake: () => Promise<void>;\n  isLoading: boolean;\n  error: string | null;\n}\n\n' },
            { type: 'feat', msg: 'implement hook shell', code: 'export function useStaking(): UseStakingResult {\n  const [isLoading, setIsLoading] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n\n' },
            { type: 'feat', msg: 'implement stake function', code: '  const stake = useCallback(async (amount: number) => {\n    setIsLoading(true);\n    setError(null);\n    try {\n      await openContractCall({\n        network: new StacksTestnet(),\n        contractAddress: "ST...",\n        contractName: "serenehub-staking-vault",\n        functionName: "stake",\n        functionArgs: [uintCV(amount * 1_000_000)],\n        postConditionMode: PostConditionMode.Allow,\n      });\n    } catch (e: any) {\n      setError(e.message);\n    } finally {\n      setIsLoading(false);\n    }\n  }, []);\n\n' },
            { type: 'feat', msg: 'implement unstake function', code: '  const unstake = useCallback(async () => {\n    setIsLoading(true);\n    setError(null);\n    try {\n      await openContractCall({\n        network: new StacksTestnet(),\n        contractAddress: "ST...",\n        contractName: "serenehub-staking-vault",\n        functionName: "unstake",\n        functionArgs: [],\n        postConditionMode: PostConditionMode.Allow,\n      });\n    } catch (e: any) {\n      setError(e.message);\n    } finally {\n      setIsLoading(false);\n    }\n  }, []);\n\n' },
            { type: 'feat', msg: 'return hook values', code: '  return { stake, unstake, isLoading, error };\n}\n' }
        ]
    },
    {
        name: 'hooks-nft',
        file: 'frontend/src/hooks/useNFT.ts',
        steps: [
            { type: 'feat', msg: 'create nft hook file', code: '// NFT Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useState, useCallback } from 'react';\n\n" },
            { type: 'feat', msg: 'add stacks imports', code: "import { openContractCall } from '@stacks/connect';\nimport { StacksTestnet } from '@stacks/network';\nimport { uintCV, stringAsciiCV, PostConditionMode } from '@stacks/transactions';\n\n" },
            { type: 'feat', msg: 'define hook interface', code: 'interface UseNFTResult {\n  mintNFT: (uri: string) => Promise<void>;\n  listNFT: (tokenId: number, price: number) => Promise<void>;\n  buyNFT: (tokenId: number) => Promise<void>;\n  isLoading: boolean;\n}\n\n' },
            { type: 'feat', msg: 'implement hook shell', code: 'export function useNFT(): UseNFTResult {\n  const [isLoading, setIsLoading] = useState(false);\n\n' },
            { type: 'feat', msg: 'implement mint function', code: '  const mintNFT = useCallback(async (uri: string) => {\n    setIsLoading(true);\n    try {\n      await openContractCall({\n        network: new StacksTestnet(),\n        contractAddress: "ST...",\n        contractName: "serenehub-nft-marketplace",\n        functionName: "mint",\n        functionArgs: [stringAsciiCV(uri)],\n        postConditionMode: PostConditionMode.Allow,\n      });\n    } finally {\n      setIsLoading(false);\n    }\n  }, []);\n\n' },
            { type: 'feat', msg: 'implement list function', code: '  const listNFT = useCallback(async (tokenId: number, price: number) => {\n    setIsLoading(true);\n    try {\n      await openContractCall({\n        network: new StacksTestnet(),\n        contractAddress: "ST...",\n        contractName: "serenehub-nft-marketplace",\n        functionName: "list-nft",\n        functionArgs: [uintCV(tokenId), uintCV(price * 1_000_000)],\n        postConditionMode: PostConditionMode.Allow,\n      });\n    } finally {\n      setIsLoading(false);\n    }\n  }, []);\n\n' },
            { type: 'feat', msg: 'implement buy function', code: '  const buyNFT = useCallback(async (tokenId: number) => {\n    setIsLoading(true);\n    try {\n      await openContractCall({\n        network: new StacksTestnet(),\n        contractAddress: "ST...",\n        contractName: "serenehub-nft-marketplace",\n        functionName: "buy-nft",\n        functionArgs: [uintCV(tokenId)],\n        postConditionMode: PostConditionMode.Allow,\n      });\n    } finally {\n      setIsLoading(false);\n    }\n  }, []);\n\n' },
            { type: 'feat', msg: 'return hook values', code: '  return { mintNFT, listNFT, buyNFT, isLoading };\n}\n' }
        ]
    },
    {
        name: 'hooks-token',
        file: 'frontend/src/hooks/useToken.ts',
        steps: [
            { type: 'feat', msg: 'create token hook file', code: '// Token Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useState, useCallback } from 'react';\n\n" },
            { type: 'feat', msg: 'add stacks imports', code: "import { openContractCall } from '@stacks/connect';\nimport { StacksTestnet } from '@stacks/network';\nimport { stringAsciiCV, uintCV, PostConditionMode } from '@stacks/transactions';\n\n" },
            { type: 'feat', msg: 'define hook interface', code: 'interface UseTokenResult {\n  createToken: (name: string, symbol: string, supply: number) => Promise<void>;\n  isLoading: boolean;\n}\n\n' },
            { type: 'feat', msg: 'implement hook', code: 'export function useToken(): UseTokenResult {\n  const [isLoading, setIsLoading] = useState(false);\n\n  const createToken = useCallback(async (name: string, symbol: string, supply: number) => {\n    setIsLoading(true);\n    try {\n      await openContractCall({\n        network: new StacksTestnet(),\n        contractAddress: "ST...",\n        contractName: "serenehub-token-launchpad",\n        functionName: "create-token",\n        functionArgs: [stringAsciiCV(name), stringAsciiCV(symbol), uintCV(supply)],\n        postConditionMode: PostConditionMode.Allow,\n      });\n    } finally {\n      setIsLoading(false);\n    }\n  }, []);\n\n  return { createToken, isLoading };\n}\n' }
        ]
    },
    // UI Components
    {
        name: 'ui-input',
        file: 'frontend/src/components/ui/Input.tsx',
        steps: [
            { type: 'feat', msg: 'create input component file', code: '// Input UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { InputHTMLAttributes, forwardRef } from 'react';\n\n" },
            { type: 'feat', msg: 'define input props', code: 'interface InputProps extends InputHTMLAttributes<HTMLInputElement> {\n  label?: string;\n  error?: string;\n}\n\n' },
            { type: 'feat', msg: 'implement input component', code: "export const Input = forwardRef<HTMLInputElement, InputProps>(\n  ({ label, error, className = '', ...props }, ref) => {\n    return (\n      <div className=\"flex flex-col gap-1\">\n        {label && <label className=\"text-sm font-medium text-gray-700\">{label}</label>}\n        <input\n          ref={ref}\n          className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}\n          {...props}\n        />\n        {error && <span className=\"text-sm text-red-500\">{error}</span>}\n      </div>\n    );\n  }\n);\n\nInput.displayName = 'Input';\n" }
        ]
    },
    {
        name: 'ui-modal',
        file: 'frontend/src/components/ui/Modal.tsx',
        steps: [
            { type: 'feat', msg: 'create modal component file', code: '// Modal UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "'use client';\n\nimport { ReactNode, useEffect } from 'react';\n\n" },
            { type: 'feat', msg: 'define modal props', code: 'interface ModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  title?: string;\n  children: ReactNode;\n}\n\n' },
            { type: 'feat', msg: 'implement modal component', code: 'export function Modal({ isOpen, onClose, title, children }: ModalProps) {\n  useEffect(() => {\n    const handleEsc = (e: KeyboardEvent) => {\n      if (e.key === "Escape") onClose();\n    };\n    if (isOpen) document.addEventListener("keydown", handleEsc);\n    return () => document.removeEventListener("keydown", handleEsc);\n  }, [isOpen, onClose]);\n\n  if (!isOpen) return null;\n\n  return (\n    <div className="fixed inset-0 z-50 flex items-center justify-center">\n      <div className="absolute inset-0 bg-black/50" onClick={onClose} />\n      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">\n        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}\n        {children}\n      </div>\n    </div>\n  );\n}\n' }
        ]
    },
    {
        name: 'ui-spinner',
        file: 'frontend/src/components/ui/Spinner.tsx',
        steps: [
            { type: 'feat', msg: 'create spinner component file', code: '// Spinner UI Component\n\n' },
            { type: 'feat', msg: 'define spinner props', code: "interface SpinnerProps {\n  size?: 'sm' | 'md' | 'lg';\n}\n\n" },
            { type: 'feat', msg: 'implement spinner component', code: "export function Spinner({ size = 'md' }: SpinnerProps) {\n  const sizes = {\n    sm: 'w-4 h-4',\n    md: 'w-8 h-8',\n    lg: 'w-12 h-12'\n  };\n\n  return (\n    <div className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600`} />\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-badge',
        file: 'frontend/src/components/ui/Badge.tsx',
        steps: [
            { type: 'feat', msg: 'create badge component file', code: '// Badge UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { ReactNode } from 'react';\n\n" },
            { type: 'feat', msg: 'define badge props', code: "interface BadgeProps {\n  variant?: 'default' | 'success' | 'warning' | 'error';\n  children: ReactNode;\n}\n\n" },
            { type: 'feat', msg: 'implement badge component', code: "export function Badge({ variant = 'default', children }: BadgeProps) {\n  const variants = {\n    default: 'bg-gray-100 text-gray-800',\n    success: 'bg-green-100 text-green-800',\n    warning: 'bg-yellow-100 text-yellow-800',\n    error: 'bg-red-100 text-red-800'\n  };\n\n  return (\n    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>\n      {children}\n    </span>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-alert',
        file: 'frontend/src/components/ui/Alert.tsx',
        steps: [
            { type: 'feat', msg: 'create alert component file', code: '// Alert UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { ReactNode } from 'react';\n\n" },
            { type: 'feat', msg: 'define alert props', code: "interface AlertProps {\n  type?: 'info' | 'success' | 'warning' | 'error';\n  title?: string;\n  children: ReactNode;\n}\n\n" },
            { type: 'feat', msg: 'implement alert component', code: "export function Alert({ type = 'info', title, children }: AlertProps) {\n  const styles = {\n    info: 'bg-blue-50 border-blue-200 text-blue-800',\n    success: 'bg-green-50 border-green-200 text-green-800',\n    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',\n    error: 'bg-red-50 border-red-200 text-red-800'\n  };\n\n  return (\n    <div className={`p-4 rounded-lg border ${styles[type]}`}>\n      {title && <h4 className=\"font-semibold mb-1\">{title}</h4>}\n      {children}\n    </div>\n  );\n}\n" }
        ]
    },
    // Config files
    {
        name: 'config-env',
        file: 'frontend/.env.local.example',
        steps: [
            { type: 'feat', msg: 'create env example file', code: '# Environment Variables\n\n' },
            { type: 'feat', msg: 'add network config', code: 'NEXT_PUBLIC_NETWORK=testnet\n' },
            { type: 'feat', msg: 'add contract addresses', code: 'NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM\n' },
            { type: 'feat', msg: 'add api config', code: 'NEXT_PUBLIC_API_URL=https://api.hiro.so\n' },
            { type: 'feat', msg: 'add chainhooks config', code: 'CHAINHOOKS_API_KEY=your_api_key_here\n' }
        ]
    },
    // Types
    {
        name: 'types-contracts',
        file: 'frontend/src/types/contracts.ts',
        steps: [
            { type: 'feat', msg: 'create contract types file', code: '// Contract Type Definitions\n\n' },
            { type: 'feat', msg: 'add nft types', code: 'export interface NFT {\n  id: number;\n  owner: string;\n  uri: string;\n  price?: number;\n  isListed: boolean;\n}\n\n' },
            { type: 'feat', msg: 'add staking types', code: 'export interface StakePosition {\n  amount: number;\n  stakedAt: number;\n  rewards: number;\n}\n\n' },
            { type: 'feat', msg: 'add token types', code: 'export interface Token {\n  name: string;\n  symbol: string;\n  decimals: number;\n  totalSupply: number;\n}\n\n' },
            { type: 'feat', msg: 'add service types', code: 'export interface Service {\n  id: number;\n  provider: string;\n  name: string;\n  description: string;\n  price: number;\n  active: boolean;\n}\n\n' }
        ]
    },
    {
        name: 'types-api',
        file: 'frontend/src/types/api.ts',
        steps: [
            { type: 'feat', msg: 'create api types file', code: '// API Type Definitions\n\n' },
            { type: 'feat', msg: 'add response type', code: 'export interface ApiResponse<T> {\n  success: boolean;\n  data?: T;\n  error?: string;\n}\n\n' },
            { type: 'feat', msg: 'add pagination type', code: 'export interface PaginatedResponse<T> {\n  items: T[];\n  total: number;\n  page: number;\n  limit: number;\n}\n\n' },
            { type: 'feat', msg: 'add transaction type', code: 'export interface TransactionStatus {\n  txId: string;\n  status: "pending" | "success" | "failed";\n  blockHeight?: number;\n}\n\n' }
        ]
    },
    // Tests
    {
        name: 'test-validation',
        file: 'frontend/src/lib/utils/validation.test.ts',
        steps: [
            { type: 'test', msg: 'create validation tests file', code: '// Validation Tests\n\n' },
            { type: 'test', msg: 'add imports', code: "import { describe, it, expect } from 'vitest';\nimport { isValidStxAddress, isValidAmount, isValidTokenName, isValidTokenSymbol } from './validation';\n\n" },
            { type: 'test', msg: 'add stx address tests', code: "describe('isValidStxAddress', () => {\n  it('should return true for valid testnet address', () => {\n    expect(isValidStxAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')).toBe(true);\n  });\n\n  it('should return false for invalid address', () => {\n    expect(isValidStxAddress('invalid')).toBe(false);\n  });\n});\n\n" },
            { type: 'test', msg: 'add amount tests', code: "describe('isValidAmount', () => {\n  it('should return true for positive numbers', () => {\n    expect(isValidAmount('100')).toBe(true);\n  });\n\n  it('should return false for zero', () => {\n    expect(isValidAmount('0')).toBe(false);\n  });\n});\n\n" },
            { type: 'test', msg: 'add token name tests', code: "describe('isValidTokenName', () => {\n  it('should accept valid names', () => {\n    expect(isValidTokenName('MyToken')).toBe(true);\n  });\n\n  it('should reject short names', () => {\n    expect(isValidTokenName('AB')).toBe(false);\n  });\n});\n\n" }
        ]
    },
    {
        name: 'test-stacks-utils',
        file: 'frontend/src/lib/utils/stacks.test.ts',
        steps: [
            { type: 'test', msg: 'create stacks utils tests file', code: '// Stacks Utils Tests\n\n' },
            { type: 'test', msg: 'add imports', code: "import { describe, it, expect } from 'vitest';\nimport { stxToMicro, microToStx } from './stacks';\n\n" },
            { type: 'test', msg: 'add stxToMicro tests', code: "describe('stxToMicro', () => {\n  it('should convert STX to microSTX', () => {\n    expect(stxToMicro(1)).toBe(1_000_000);\n    expect(stxToMicro(0.5)).toBe(500_000);\n  });\n});\n\n" },
            { type: 'test', msg: 'add microToStx tests', code: "describe('microToStx', () => {\n  it('should convert microSTX to STX', () => {\n    expect(microToStx(1_000_000)).toBe(1);\n    expect(microToStx(500_000)).toBe(0.5);\n  });\n});\n\n" }
        ]
    },
    // More docs
    {
        name: 'docs-contributing',
        file: 'docs/CONTRIBUTING_GUIDE.md',
        steps: [
            { type: 'docs', msg: 'create contributing guide', code: '# Contributing Guide\n\n' },
            { type: 'docs', msg: 'add getting started section', code: '## Getting Started\n\nThank you for your interest in contributing to SereneHub!\n\n' },
            { type: 'docs', msg: 'add development setup', code: '## Development Setup\n\n1. Fork the repository\n2. Clone your fork\n3. Install dependencies: `npm install`\n4. Start development server: `npm run dev`\n\n' },
            { type: 'docs', msg: 'add code style section', code: '## Code Style\n\n- Use TypeScript\n- Follow ESLint rules\n- Write meaningful commit messages\n- Add tests for new features\n\n' },
            { type: 'docs', msg: 'add pr guidelines', code: '## Pull Request Guidelines\n\n1. Create a feature branch\n2. Make your changes\n3. Write tests\n4. Submit PR with clear description\n\n' }
        ]
    },
    {
        name: 'docs-testing',
        file: 'docs/TESTING.md',
        steps: [
            { type: 'docs', msg: 'create testing guide', code: '# Testing Guide\n\n' },
            { type: 'docs', msg: 'add overview section', code: '## Overview\n\nThis project uses Vitest for frontend testing and Clarinet for smart contract testing.\n\n' },
            { type: 'docs', msg: 'add frontend testing section', code: '## Frontend Testing\n\n```bash\ncd frontend\nnpm run test\n```\n\n' },
            { type: 'docs', msg: 'add contract testing section', code: '## Contract Testing\n\n```bash\ncd contracts\nclarinet test\n```\n\n' },
            { type: 'docs', msg: 'add coverage section', code: '## Coverage\n\nRun with coverage:\n```bash\nnpm run test:coverage\n```\n\n' }
        ]
    },
    // Constants
    {
        name: 'constants-errors',
        file: 'frontend/src/constants/errors.ts',
        steps: [
            { type: 'feat', msg: 'create error constants file', code: '// Error Constants\n\n' },
            { type: 'feat', msg: 'add contract error codes', code: 'export const CONTRACT_ERRORS = {\n  UNAUTHORIZED: "u100",\n  INSUFFICIENT_FUNDS: "u101",\n  INVALID_PARAMS: "u102",\n  NOT_FOUND: "u103",\n  ALREADY_EXISTS: "u104",\n} as const;\n\n' },
            { type: 'feat', msg: 'add error messages', code: 'export const ERROR_MESSAGES: Record<string, string> = {\n  [CONTRACT_ERRORS.UNAUTHORIZED]: "You are not authorized to perform this action",\n  [CONTRACT_ERRORS.INSUFFICIENT_FUNDS]: "Insufficient funds for this transaction",\n  [CONTRACT_ERRORS.INVALID_PARAMS]: "Invalid parameters provided",\n  [CONTRACT_ERRORS.NOT_FOUND]: "Resource not found",\n  [CONTRACT_ERRORS.ALREADY_EXISTS]: "Resource already exists",\n};\n\n' },
            { type: 'feat', msg: 'add error helper', code: 'export function getErrorMessage(code: string): string {\n  return ERROR_MESSAGES[code] || "An unknown error occurred";\n}\n' }
        ]
    },
    {
        name: 'constants-networks',
        file: 'frontend/src/constants/networks.ts',
        steps: [
            { type: 'feat', msg: 'create network constants file', code: '// Network Constants\n\n' },
            { type: 'feat', msg: 'add network enum', code: "export enum Network {\n  MAINNET = 'mainnet',\n  TESTNET = 'testnet',\n  DEVNET = 'devnet',\n}\n\n" },
            { type: 'feat', msg: 'add network config', code: 'export const NETWORK_CONFIG = {\n  [Network.MAINNET]: {\n    apiUrl: "https://stacks-node-api.mainnet.stacks.co",\n    explorerUrl: "https://explorer.stacks.co",\n  },\n  [Network.TESTNET]: {\n    apiUrl: "https://stacks-node-api.testnet.stacks.co",\n    explorerUrl: "https://explorer.stacks.co/?chain=testnet",\n  },\n  [Network.DEVNET]: {\n    apiUrl: "http://localhost:3999",\n    explorerUrl: "http://localhost:8000",\n  },\n} as const;\n' }
        ]
    },
    {
        name: 'constants-contracts',
        file: 'frontend/src/constants/contracts.ts',
        steps: [
            { type: 'feat', msg: 'create contracts constants file', code: '// Contract Constants\n\n' },
            { type: 'feat', msg: 'add contract names', code: 'export const CONTRACT_NAMES = {\n  NFT_MARKETPLACE: "serenehub-nft-marketplace",\n  STAKING_VAULT: "serenehub-staking-vault",\n  TOKEN_LAUNCHPAD: "serenehub-token-launchpad",\n  SERVICE_REGISTRY: "serenehub-service-registry",\n} as const;\n\n' },
            { type: 'feat', msg: 'add deployer address', code: 'export const DEPLOYER_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";\n\n' },
            { type: 'feat', msg: 'add contract builder', code: 'export function getContractId(name: string): string {\n  return `${DEPLOYER_ADDRESS}.${name}`;\n}\n' }
        ]
    },
    // Services
    {
        name: 'services-api',
        file: 'frontend/src/services/api.ts',
        steps: [
            { type: 'feat', msg: 'create api service file', code: '// API Service\n\n' },
            { type: 'feat', msg: 'add axios import', code: "import axios from 'axios';\n\n" },
            { type: 'feat', msg: 'add base config', code: 'const api = axios.create({\n  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.hiro.so",\n  timeout: 10000,\n});\n\n' },
            { type: 'feat', msg: 'add request interceptor', code: 'api.interceptors.request.use((config) => {\n  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);\n  return config;\n});\n\n' },
            { type: 'feat', msg: 'add response interceptor', code: 'api.interceptors.response.use(\n  (response) => response,\n  (error) => {\n    console.error("[API Error]", error.message);\n    return Promise.reject(error);\n  }\n);\n\n' },
            { type: 'feat', msg: 'export api instance', code: 'export default api;\n' }
        ]
    },
    {
        name: 'services-stacks',
        file: 'frontend/src/services/stacks.ts',
        steps: [
            { type: 'feat', msg: 'create stacks service file', code: '// Stacks Service\n\n' },
            { type: 'feat', msg: 'add imports', code: "import api from './api';\n\n" },
            { type: 'feat', msg: 'add account info fetcher', code: 'export async function getAccountInfo(address: string) {\n  const response = await api.get(`/v2/accounts/${address}`);\n  return response.data;\n}\n\n' },
            { type: 'feat', msg: 'add balance fetcher', code: 'export async function getBalance(address: string) {\n  const response = await api.get(`/extended/v1/address/${address}/balances`);\n  return response.data;\n}\n\n' },
            { type: 'feat', msg: 'add transaction fetcher', code: 'export async function getTransaction(txId: string) {\n  const response = await api.get(`/extended/v1/tx/${txId}`);\n  return response.data;\n}\n\n' }
        ]
    },
    // Additional features
    {
        name: 'ui-card',
        file: 'frontend/src/components/ui/Card.tsx',
        steps: [
            { type: 'feat', msg: 'create card component file', code: '// Card UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { HTMLAttributes, ReactNode } from 'react';\n\n" },
            { type: 'feat', msg: 'define card props', code: 'interface CardProps extends HTMLAttributes<HTMLDivElement> {\n  children: ReactNode;\n}\n\n' },
            { type: 'feat', msg: 'implement card component', code: "export function Card({ className = '', children, ...props }: CardProps) {\n  return (\n    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`} {...props}>\n      {children}\n    </div>\n  );\n}\n\n" },
            { type: 'feat', msg: 'implement card header', code: "export function CardHeader({ className = '', children, ...props }: CardProps) {\n  return <div className={`p-6 border-b border-gray-100 ${className}`} {...props}>{children}</div>;\n}\n\n" },
            { type: 'feat', msg: 'implement card content', code: "export function CardContent({ className = '', children, ...props }: CardProps) {\n  return <div className={`p-6 ${className}`} {...props}>{children}</div>;\n}\n\n" },
            { type: 'feat', msg: 'implement card footer', code: "export function CardFooter({ className = '', children, ...props }: CardProps) {\n  return <div className={`p-6 bg-gray-50 rounded-b-xl ${className}`} {...props}>{children}</div>;\n}\n" }
        ]
    },
    {
        name: 'ui-skeleton',
        file: 'frontend/src/components/ui/Skeleton.tsx',
        steps: [
            { type: 'feat', msg: 'create skeleton component file', code: '// Skeleton UI Component\n\n' },
            { type: 'feat', msg: 'define skeleton props', code: 'interface SkeletonProps {\n  className?: string;\n}\n\n' },
            { type: 'feat', msg: 'implement skeleton component', code: "export function Skeleton({ className = '' }: SkeletonProps) {\n  return (\n    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-tooltip',
        file: 'frontend/src/components/ui/Tooltip.tsx',
        steps: [
            { type: 'feat', msg: 'create tooltip component file', code: '// Tooltip UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "'use client';\n\nimport { ReactNode, useState } from 'react';\n\n" },
            { type: 'feat', msg: 'define tooltip props', code: 'interface TooltipProps {\n  content: string;\n  children: ReactNode;\n}\n\n' },
            { type: 'feat', msg: 'implement tooltip component', code: "export function Tooltip({ content, children }: TooltipProps) {\n  const [visible, setVisible] = useState(false);\n\n  return (\n    <div className=\"relative inline-block\">\n      <div\n        onMouseEnter={() => setVisible(true)}\n        onMouseLeave={() => setVisible(false)}\n      >\n        {children}\n      </div>\n      {visible && (\n        <div className=\"absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap\">\n          {content}\n        </div>\n      )}\n    </div>\n  );\n}\n" }
        ]
    },
    // Additional hooks
    {
        name: 'hooks-service',
        file: 'frontend/src/hooks/useService.ts',
        steps: [
            { type: 'feat', msg: 'create service hook file', code: '// Service Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useState, useCallback } from 'react';\n\n" },
            { type: 'feat', msg: 'add stacks imports', code: "import { openContractCall } from '@stacks/connect';\nimport { StacksTestnet } from '@stacks/network';\nimport { stringAsciiCV, uintCV, PostConditionMode } from '@stacks/transactions';\n\n" },
            { type: 'feat', msg: 'define hook interface', code: 'interface UseServiceResult {\n  registerService: (name: string, description: string, price: number) => Promise<void>;\n  payService: (serviceId: number) => Promise<void>;\n  isLoading: boolean;\n}\n\n' },
            { type: 'feat', msg: 'implement register function', code: 'export function useService(): UseServiceResult {\n  const [isLoading, setIsLoading] = useState(false);\n\n  const registerService = useCallback(async (name: string, description: string, price: number) => {\n    setIsLoading(true);\n    try {\n      await openContractCall({\n        network: new StacksTestnet(),\n        contractAddress: "ST...",\n        contractName: "serenehub-service-registry",\n        functionName: "register-service",\n        functionArgs: [stringAsciiCV(name), stringAsciiCV(description), uintCV(price * 1_000_000)],\n        postConditionMode: PostConditionMode.Allow,\n      });\n    } finally {\n      setIsLoading(false);\n    }\n  }, []);\n\n' },
            { type: 'feat', msg: 'implement pay function', code: '  const payService = useCallback(async (serviceId: number) => {\n    setIsLoading(true);\n    try {\n      await openContractCall({\n        network: new StacksTestnet(),\n        contractAddress: "ST...",\n        contractName: "serenehub-service-registry",\n        functionName: "pay-service",\n        functionArgs: [uintCV(serviceId)],\n        postConditionMode: PostConditionMode.Allow,\n      });\n    } finally {\n      setIsLoading(false);\n    }\n  }, []);\n\n  return { registerService, payService, isLoading };\n}\n' }
        ]
    },
    // Additional docs
    {
        name: 'docs-security',
        file: 'docs/SECURITY_GUIDELINES.md',
        steps: [
            { type: 'docs', msg: 'create security guidelines', code: '# Security Guidelines\n\n' },
            { type: 'docs', msg: 'add overview section', code: '## Overview\n\nThis document outlines security best practices for SereneHub development.\n\n' },
            { type: 'docs', msg: 'add smart contract section', code: '## Smart Contract Security\n\n- Always validate inputs\n- Use proper access controls\n- Avoid re-entrancy vulnerabilities\n- Test thoroughly before deployment\n\n' },
            { type: 'docs', msg: 'add frontend security section', code: '## Frontend Security\n\n- Never expose private keys\n- Validate all user inputs\n- Use secure wallet connections\n- Implement proper error handling\n\n' },
            { type: 'docs', msg: 'add reporting section', code: '## Reporting Vulnerabilities\n\nIf you discover a security vulnerability, please report it to security@serenehub.app\n\n' }
        ]
    },
    // Utilities
    {
        name: 'utils-format',
        file: 'frontend/src/lib/utils/format.ts',
        steps: [
            { type: 'feat', msg: 'create format utils file', code: '// Formatting Utilities\n\n' },
            { type: 'feat', msg: 'add address truncator function', code: "export function truncateAddress(address: string, start = 6, end = 4) {\n  if (!address) return '';\n  return `${address.slice(0, start)}...${address.slice(-end)}`;\n}\n\n" },
            { type: 'feat', msg: 'add currency formatter', code: "export function formatCurrency(amount: number, currency = 'USD') {\n  return new Intl.NumberFormat('en-US', {\n    style: 'currency',\n    currency,\n  }).format(amount);\n}\n\n" },
            { type: 'feat', msg: 'add token amount formatter', code: "export function formatTokenAmount(amount: number, decimals = 6) {\n  return (amount / Math.pow(10, decimals)).toLocaleString('en-US', { maximumFractionDigits: decimals });\n}\n\n" },
            { type: 'feat', msg: 'add date formatter', code: "export function formatDate(timestamp: number) {\n  return new Date(timestamp * 1000).toLocaleDateString('en-US', {\n    year: 'numeric',\n    month: 'short',\n    day: 'numeric'\n  });\n}\n" }
        ]
    },
    // More components
    {
        name: 'ui-tabs',
        file: 'frontend/src/components/ui/Tabs.tsx',
        steps: [
            { type: 'feat', msg: 'create tabs component file', code: '// Tabs UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "'use client';\n\nimport { ReactNode, useState } from 'react';\n\n" },
            { type: 'feat', msg: 'define tabs props', code: 'interface Tab {\n  id: string;\n  label: string;\n  content: ReactNode;\n}\n\ninterface TabsProps {\n  tabs: Tab[];\n  defaultTab?: string;\n}\n\n' },
            { type: 'feat', msg: 'implement tabs component', code: "export function Tabs({ tabs, defaultTab }: TabsProps) {\n  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);\n\n  return (\n    <div>\n      <div className=\"flex border-b border-gray-200\">\n        {tabs.map((tab) => (\n          <button\n            key={tab.id}\n            onClick={() => setActiveTab(tab.id)}\n            className={`px-4 py-2 font-medium transition-colors ${\n              activeTab === tab.id\n                ? 'border-b-2 border-indigo-600 text-indigo-600'\n                : 'text-gray-500 hover:text-gray-700'\n            }`}\n          >\n            {tab.label}\n          </button>\n        ))}\n      </div>\n      <div className=\"py-4\">\n        {tabs.find((tab) => tab.id === activeTab)?.content}\n      </div>\n    </div>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-avatar',
        file: 'frontend/src/components/ui/Avatar.tsx',
        steps: [
            { type: 'feat', msg: 'create avatar component file', code: '// Avatar UI Component\n\n' },
            { type: 'feat', msg: 'define avatar props', code: "interface AvatarProps {\n  src?: string;\n  alt?: string;\n  size?: 'sm' | 'md' | 'lg';\n  fallback?: string;\n}\n\n" },
            { type: 'feat', msg: 'implement avatar component', code: "export function Avatar({ src, alt = '', size = 'md', fallback }: AvatarProps) {\n  const sizes = {\n    sm: 'w-8 h-8 text-xs',\n    md: 'w-10 h-10 text-sm',\n    lg: 'w-12 h-12 text-base'\n  };\n\n  if (src) {\n    return (\n      <img\n        src={src}\n        alt={alt}\n        className={`${sizes[size]} rounded-full object-cover`}\n      />\n    );\n  }\n\n  return (\n    <div className={`${sizes[size]} rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium`}>\n      {fallback?.slice(0, 2).toUpperCase() || '?'}\n    </div>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-dropdown',
        file: 'frontend/src/components/ui/Dropdown.tsx',
        steps: [
            { type: 'feat', msg: 'create dropdown component file', code: '// Dropdown UI Component\n\n' },
            { type: 'feat', msg: 'add react imports', code: "'use client';\n\nimport { ReactNode, useState, useRef, useEffect } from 'react';\n\n" },
            { type: 'feat', msg: 'define dropdown props', code: 'interface DropdownProps {\n  trigger: ReactNode;\n  children: ReactNode;\n}\n\n' },
            { type: 'feat', msg: 'implement dropdown component', code: "export function Dropdown({ trigger, children }: DropdownProps) {\n  const [isOpen, setIsOpen] = useState(false);\n  const ref = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    const handleClickOutside = (event: MouseEvent) => {\n      if (ref.current && !ref.current.contains(event.target as Node)) {\n        setIsOpen(false);\n      }\n    };\n    document.addEventListener('mousedown', handleClickOutside);\n    return () => document.removeEventListener('mousedown', handleClickOutside);\n  }, []);\n\n  return (\n    <div ref={ref} className=\"relative\">\n      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>\n      {isOpen && (\n        <div className=\"absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50\">\n          {children}\n        </div>\n      )}\n    </div>\n  );\n}\n" }
        ]
    }
];

// Ensure directories exist
const dirs = [
    'docs',
    'frontend/src/lib/utils',
    'frontend/src/hooks',
    'frontend/src/components/ui',
    'frontend/src/types',
    'frontend/src/constants',
    'frontend/src/services'
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
console.log(`Total branches created: ${totalBranches}`);
console.log(`Total commits made: ${totalCommits}`);
console.log(`========================================`);

// Show final commit count
const commitCount = run('git log --oneline | wc -l');
console.log(`Total commits in repository: ${commitCount}`);
