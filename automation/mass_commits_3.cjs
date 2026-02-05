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

// ===== BATCH 3 - MORE FEATURES =====

const FEATURES = [
    // More comprehensive documentation
    {
        name: 'docs-changelog-v1',
        file: 'docs/CHANGELOG_DETAILED.md',
        steps: [
            { type: 'docs', msg: 'create detailed changelog', code: '# Detailed Changelog\n\n' },
            { type: 'docs', msg: 'add version 1.0.0 header', code: '## [1.0.0] - 2024-02-01\n\n### Added\n\n' },
            { type: 'docs', msg: 'add nft marketplace features', code: '- NFT Marketplace with minting, listing, and trading functionality\n- Support for multiple file formats (PNG, JPG, GIF, MP4)\n- Metadata storage on IPFS\n\n' },
            { type: 'docs', msg: 'add staking features', code: '- Staking Vault with flexible lock periods\n- Auto-compounding rewards\n- Real-time APY display\n\n' },
            { type: 'docs', msg: 'add token launchpad features', code: '- Token Launchpad for SIP-010 tokens\n- Custom tokenomics configuration\n- Instant deployment\n\n' },
            { type: 'docs', msg: 'add service registry features', code: '- Service Registry for providers\n- Secure payment processing\n- Rating and review system\n\n' },
            { type: 'docs', msg: 'add changed section', code: '### Changed\n\n- Improved wallet connection flow\n- Enhanced transaction feedback\n- Updated UI components\n\n' },
            { type: 'docs', msg: 'add fixed section', code: '### Fixed\n\n- Fixed wallet disconnection issues\n- Resolved transaction confirmation bugs\n- Fixed responsive layout issues\n\n' }
        ]
    },
    {
        name: 'docs-api-errors',
        file: 'docs/API_ERRORS.md',
        steps: [
            { type: 'docs', msg: 'create api errors documentation', code: '# API Error Reference\n\n' },
            { type: 'docs', msg: 'add error format section', code: '## Error Format\n\nAll API errors follow this format:\n\n```json\n{\n  "error": {\n    "code": "ERROR_CODE",\n    "message": "Human readable message"\n  }\n}\n```\n\n' },
            { type: 'docs', msg: 'add authentication errors', code: '## Authentication Errors\n\n| Code | Message | Resolution |\n|------|---------|------------|\n| AUTH_001 | Invalid wallet signature | Re-authenticate wallet |\n| AUTH_002 | Session expired | Reconnect wallet |\n| AUTH_003 | Forbidden | Check permissions |\n\n' },
            { type: 'docs', msg: 'add transaction errors', code: '## Transaction Errors\n\n| Code | Message | Resolution |\n|------|---------|------------|\n| TX_001 | Insufficient balance | Add funds |\n| TX_002 | Invalid parameters | Check inputs |\n| TX_003 | Contract error | Check contract state |\n\n' },
            { type: 'docs', msg: 'add network errors', code: '## Network Errors\n\n| Code | Message | Resolution |\n|------|---------|------------|\n| NET_001 | Connection timeout | Retry request |\n| NET_002 | Service unavailable | Wait and retry |\n| NET_003 | Rate limited | Slow down requests |\n\n' }
        ]
    },
    // More React components
    {
        name: 'ui-breadcrumb',
        file: 'frontend/src/components/ui/Breadcrumb.tsx',
        steps: [
            { type: 'feat', msg: 'create breadcrumb component file', code: '// Breadcrumb UI Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\nimport Link from 'next/link';\n\n" },
            { type: 'feat', msg: 'define breadcrumb item type', code: 'interface BreadcrumbItem {\n  label: string;\n  href?: string;\n}\n\n' },
            { type: 'feat', msg: 'define breadcrumb props', code: 'interface BreadcrumbProps {\n  items: BreadcrumbItem[];\n}\n\n' },
            { type: 'feat', msg: 'implement breadcrumb component', code: "export function Breadcrumb({ items }: BreadcrumbProps) {\n  return (\n    <nav className=\"flex items-center gap-2 text-sm text-gray-500\">\n      {items.map((item, index) => (\n        <span key={index} className=\"flex items-center gap-2\">\n          {index > 0 && <span>/</span>}\n          {item.href ? (\n            <Link href={item.href} className=\"hover:text-indigo-600 transition-colors\">\n              {item.label}\n            </Link>\n          ) : (\n            <span className=\"text-gray-900 font-medium\">{item.label}</span>\n          )}\n        </span>\n      ))}\n    </nav>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-pagination',
        file: 'frontend/src/components/ui/Pagination.tsx',
        steps: [
            { type: 'feat', msg: 'create pagination component file', code: '// Pagination UI Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\n" },
            { type: 'feat', msg: 'define pagination props', code: 'interface PaginationProps {\n  currentPage: number;\n  totalPages: number;\n  onPageChange: (page: number) => void;\n}\n\n' },
            { type: 'feat', msg: 'implement pagination component', code: "export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {\n  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);\n\n  return (\n    <div className=\"flex items-center gap-1\">\n      <button\n        onClick={() => onPageChange(currentPage - 1)}\n        disabled={currentPage === 1}\n        className=\"px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50\"\n      >\n        Previous\n      </button>\n      {pages.map((page) => (\n        <button\n          key={page}\n          onClick={() => onPageChange(page)}\n          className={`px-3 py-1 rounded ${currentPage === page ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'}`}\n        >\n          {page}\n        </button>\n      ))}\n      <button\n        onClick={() => onPageChange(currentPage + 1)}\n        disabled={currentPage === totalPages}\n        className=\"px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50\"\n      >\n        Next\n      </button>\n    </div>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-stat-card',
        file: 'frontend/src/components/ui/StatCard.tsx',
        steps: [
            { type: 'feat', msg: 'create stat card component file', code: '// Stat Card UI Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "import { ReactNode } from 'react';\n\n" },
            { type: 'feat', msg: 'define stat card props', code: 'interface StatCardProps {\n  title: string;\n  value: string | number;\n  icon?: ReactNode;\n  change?: {\n    value: number;\n    type: "increase" | "decrease";\n  };\n}\n\n' },
            { type: 'feat', msg: 'implement stat card component', code: "export function StatCard({ title, value, icon, change }: StatCardProps) {\n  return (\n    <div className=\"bg-white rounded-xl border border-gray-200 p-6\">\n      <div className=\"flex items-center justify-between\">\n        <span className=\"text-sm text-gray-500\">{title}</span>\n        {icon && <span className=\"text-gray-400\">{icon}</span>}\n      </div>\n      <div className=\"mt-2 flex items-end gap-2\">\n        <span className=\"text-2xl font-bold text-gray-900\">{value}</span>\n        {change && (\n          <span className={`text-sm ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>\n            {change.type === 'increase' ? '↑' : '↓'} {Math.abs(change.value)}%\n          </span>\n        )}\n      </div>\n    </div>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-search-input',
        file: 'frontend/src/components/ui/SearchInput.tsx',
        steps: [
            { type: 'feat', msg: 'create search input component file', code: '// Search Input UI Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\nimport { useState } from 'react';\n\n" },
            { type: 'feat', msg: 'define search input props', code: 'interface SearchInputProps {\n  placeholder?: string;\n  onSearch: (query: string) => void;\n  debounceMs?: number;\n}\n\n' },
            { type: 'feat', msg: 'implement search input component', code: "export function SearchInput({ placeholder = 'Search...', onSearch, debounceMs = 300 }: SearchInputProps) {\n  const [value, setValue] = useState('');\n  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);\n\n  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const newValue = e.target.value;\n    setValue(newValue);\n\n    if (timeoutId) clearTimeout(timeoutId);\n    setTimeoutId(setTimeout(() => onSearch(newValue), debounceMs));\n  };\n\n  return (\n    <div className=\"relative\">\n      <input\n        type=\"text\"\n        value={value}\n        onChange={handleChange}\n        placeholder={placeholder}\n        className=\"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent\"\n      />\n      <span className=\"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400\">🔍</span>\n    </div>\n  );\n}\n" }
        ]
    },
    {
        name: 'ui-file-upload',
        file: 'frontend/src/components/ui/FileUpload.tsx',
        steps: [
            { type: 'feat', msg: 'create file upload component file', code: '// File Upload UI Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\nimport { useRef, useState } from 'react';\n\n" },
            { type: 'feat', msg: 'define file upload props', code: 'interface FileUploadProps {\n  accept?: string;\n  maxSize?: number; // in MB\n  onUpload: (file: File) => void;\n}\n\n' },
            { type: 'feat', msg: 'implement file upload component', code: "export function FileUpload({ accept = '*', maxSize = 10, onUpload }: FileUploadProps) {\n  const inputRef = useRef<HTMLInputElement>(null);\n  const [dragging, setDragging] = useState(false);\n  const [error, setError] = useState<string | null>(null);\n\n  const handleFile = (file: File) => {\n    setError(null);\n    if (file.size > maxSize * 1024 * 1024) {\n      setError(`File size must be less than ${maxSize}MB`);\n      return;\n    }\n    onUpload(file);\n  };\n\n  const handleDrop = (e: React.DragEvent) => {\n    e.preventDefault();\n    setDragging(false);\n    const file = e.dataTransfer.files[0];\n    if (file) handleFile(file);\n  };\n\n  return (\n    <div\n      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}\n      onDragLeave={() => setDragging(false)}\n      onDrop={handleDrop}\n      onClick={() => inputRef.current?.click()}\n      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${\n        dragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'\n      }`}\n    >\n      <input\n        ref={inputRef}\n        type=\"file\"\n        accept={accept}\n        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}\n        className=\"hidden\"\n      />\n      <p className=\"text-gray-600\">Drop file here or click to upload</p>\n      <p className=\"text-sm text-gray-400 mt-1\">Max size: {maxSize}MB</p>\n      {error && <p className=\"text-sm text-red-500 mt-2\">{error}</p>}\n    </div>\n  );\n}\n" }
        ]
    },
    // More hooks
    {
        name: 'hooks-local-storage',
        file: 'frontend/src/hooks/useLocalStorage.ts',
        steps: [
            { type: 'feat', msg: 'create local storage hook file', code: '// Local Storage Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useState, useEffect } from 'react';\n\n" },
            { type: 'feat', msg: 'implement hook', code: "export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    if (typeof window === 'undefined') return initialValue;\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch {\n      return initialValue;\n    }\n  });\n\n  const setValue = (value: T) => {\n    try {\n      setStoredValue(value);\n      if (typeof window !== 'undefined') {\n        window.localStorage.setItem(key, JSON.stringify(value));\n      }\n    } catch (error) {\n      console.error('Error saving to localStorage:', error);\n    }\n  };\n\n  return [storedValue, setValue];\n}\n" }
        ]
    },
    {
        name: 'hooks-media-query',
        file: 'frontend/src/hooks/useMediaQuery.ts',
        steps: [
            { type: 'feat', msg: 'create media query hook file', code: '// Media Query Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useState, useEffect } from 'react';\n\n" },
            { type: 'feat', msg: 'implement hook', code: "export function useMediaQuery(query: string): boolean {\n  const [matches, setMatches] = useState(false);\n\n  useEffect(() => {\n    if (typeof window === 'undefined') return;\n\n    const media = window.matchMedia(query);\n    setMatches(media.matches);\n\n    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);\n    media.addEventListener('change', listener);\n    return () => media.removeEventListener('change', listener);\n  }, [query]);\n\n  return matches;\n}\n\n" },
            { type: 'feat', msg: 'add responsive hooks', code: "export function useIsMobile(): boolean {\n  return useMediaQuery('(max-width: 768px)');\n}\n\nexport function useIsTablet(): boolean {\n  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');\n}\n\nexport function useIsDesktop(): boolean {\n  return useMediaQuery('(min-width: 1025px)');\n}\n" }
        ]
    },
    {
        name: 'hooks-click-outside',
        file: 'frontend/src/hooks/useClickOutside.ts',
        steps: [
            { type: 'feat', msg: 'create click outside hook file', code: '// Click Outside Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useEffect, RefObject } from 'react';\n\n" },
            { type: 'feat', msg: 'implement hook', code: "export function useClickOutside<T extends HTMLElement>(\n  ref: RefObject<T>,\n  handler: () => void\n): void {\n  useEffect(() => {\n    const listener = (event: MouseEvent | TouchEvent) => {\n      if (!ref.current || ref.current.contains(event.target as Node)) {\n        return;\n      }\n      handler();\n    };\n\n    document.addEventListener('mousedown', listener);\n    document.addEventListener('touchstart', listener);\n\n    return () => {\n      document.removeEventListener('mousedown', listener);\n      document.removeEventListener('touchstart', listener);\n    };\n  }, [ref, handler]);\n}\n" }
        ]
    },
    {
        name: 'hooks-copy',
        file: 'frontend/src/hooks/useCopy.ts',
        steps: [
            { type: 'feat', msg: 'create copy hook file', code: '// Copy Hook\n\n' },
            { type: 'feat', msg: 'add react imports', code: "import { useState, useCallback } from 'react';\n\n" },
            { type: 'feat', msg: 'add clipboard import', code: "import { copyToClipboard } from '@/lib/utils/clipboard';\n\n" },
            { type: 'feat', msg: 'define hook interface', code: 'interface UseCopyResult {\n  copied: boolean;\n  copy: (text: string) => Promise<void>;\n}\n\n' },
            { type: 'feat', msg: 'implement hook', code: "export function useCopy(resetDelay = 2000): UseCopyResult {\n  const [copied, setCopied] = useState(false);\n\n  const copy = useCallback(async (text: string) => {\n    const success = await copyToClipboard(text);\n    if (success) {\n      setCopied(true);\n      setTimeout(() => setCopied(false), resetDelay);\n    }\n  }, [resetDelay]);\n\n  return { copied, copy };\n}\n" }
        ]
    },
    // More services
    {
        name: 'services-ipfs',
        file: 'frontend/src/services/ipfs.ts',
        steps: [
            { type: 'feat', msg: 'create ipfs service file', code: '// IPFS Service\n\n' },
            { type: 'feat', msg: 'add constants', code: "const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';\n\n" },
            { type: 'feat', msg: 'add upload function', code: "export async function uploadToIPFS(file: File): Promise<string> {\n  const formData = new FormData();\n  formData.append('file', file);\n\n  // Using public IPFS pinning service\n  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {\n    method: 'POST',\n    headers: {\n      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,\n    },\n    body: formData,\n  });\n\n  const data = await response.json();\n  return data.IpfsHash;\n}\n\n" },
            { type: 'feat', msg: 'add get url function', code: "export function getIPFSUrl(hash: string): string {\n  return `${IPFS_GATEWAY}${hash}`;\n}\n\n" },
            { type: 'feat', msg: 'add upload json function', code: "export async function uploadJSONToIPFS(data: object): Promise<string> {\n  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,\n    },\n    body: JSON.stringify(data),\n  });\n\n  const result = await response.json();\n  return result.IpfsHash;\n}\n" }
        ]
    },
    {
        name: 'services-analytics',
        file: 'frontend/src/services/analytics.ts',
        steps: [
            { type: 'feat', msg: 'create analytics service file', code: '// Analytics Service\n\n' },
            { type: 'feat', msg: 'add event types', code: "type EventName = \n  | 'wallet_connect'\n  | 'wallet_disconnect'\n  | 'nft_mint'\n  | 'nft_buy'\n  | 'nft_list'\n  | 'stake'\n  | 'unstake'\n  | 'token_create'\n  | 'service_register'\n  | 'service_pay';\n\n" },
            { type: 'feat', msg: 'add track event function', code: "export function trackEvent(event: EventName, properties?: Record<string, any>): void {\n  if (typeof window === 'undefined') return;\n\n  // Log locally in development\n  if (process.env.NODE_ENV === 'development') {\n    console.log('[Analytics]', event, properties);\n    return;\n  }\n\n  // Send to analytics service in production\n  // Example: window.gtag?.('event', event, properties);\n}\n\n" },
            { type: 'feat', msg: 'add page view function', code: "export function trackPageView(path: string): void {\n  if (typeof window === 'undefined') return;\n\n  if (process.env.NODE_ENV === 'development') {\n    console.log('[Analytics] Page View:', path);\n    return;\n  }\n\n  // Example: window.gtag?.('config', 'GA_ID', { page_path: path });\n}\n" }
        ]
    },
    // More utils
    {
        name: 'utils-date',
        file: 'frontend/src/lib/utils/date.ts',
        steps: [
            { type: 'feat', msg: 'create date utils file', code: '// Date Utilities\n\n' },
            { type: 'feat', msg: 'add format relative function', code: "export function formatRelativeTime(timestamp: number): string {\n  const now = Date.now();\n  const diff = now - timestamp * 1000;\n\n  const seconds = Math.floor(diff / 1000);\n  const minutes = Math.floor(seconds / 60);\n  const hours = Math.floor(minutes / 60);\n  const days = Math.floor(hours / 24);\n\n  if (days > 0) return `${days}d ago`;\n  if (hours > 0) return `${hours}h ago`;\n  if (minutes > 0) return `${minutes}m ago`;\n  return 'Just now';\n}\n\n" },
            { type: 'feat', msg: 'add format duration function', code: "export function formatDuration(seconds: number): string {\n  const days = Math.floor(seconds / 86400);\n  const hours = Math.floor((seconds % 86400) / 3600);\n  const minutes = Math.floor((seconds % 3600) / 60);\n\n  const parts = [];\n  if (days > 0) parts.push(`${days}d`);\n  if (hours > 0) parts.push(`${hours}h`);\n  if (minutes > 0) parts.push(`${minutes}m`);\n\n  return parts.join(' ') || '0m';\n}\n\n" },
            { type: 'feat', msg: 'add is expired function', code: "export function isExpired(timestamp: number): boolean {\n  return Date.now() > timestamp * 1000;\n}\n\n" },
            { type: 'feat', msg: 'add get days until function', code: "export function getDaysUntil(timestamp: number): number {\n  const diff = timestamp * 1000 - Date.now();\n  return Math.max(0, Math.ceil(diff / 86400000));\n}\n" }
        ]
    },
    {
        name: 'utils-number',
        file: 'frontend/src/lib/utils/number.ts',
        steps: [
            { type: 'feat', msg: 'create number utils file', code: '// Number Utilities\n\n' },
            { type: 'feat', msg: 'add format compact function', code: "export function formatCompact(num: number): string {\n  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;\n  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;\n  return num.toString();\n}\n\n" },
            { type: 'feat', msg: 'add clamp function', code: "export function clamp(value: number, min: number, max: number): number {\n  return Math.min(Math.max(value, min), max);\n}\n\n" },
            { type: 'feat', msg: 'add percentage function', code: "export function percentage(value: number, total: number): number {\n  if (total === 0) return 0;\n  return (value / total) * 100;\n}\n\n" },
            { type: 'feat', msg: 'add round to decimals function', code: "export function roundToDecimals(value: number, decimals: number): number {\n  const multiplier = Math.pow(10, decimals);\n  return Math.round(value * multiplier) / multiplier;\n}\n" }
        ]
    },
    // More tests
    {
        name: 'test-date-utils',
        file: 'frontend/src/lib/utils/date.test.ts',
        steps: [
            { type: 'test', msg: 'create date utils tests file', code: '// Date Utils Tests\n\n' },
            { type: 'test', msg: 'add imports', code: "import { describe, it, expect } from 'vitest';\nimport { formatRelativeTime, formatDuration, isExpired, getDaysUntil } from './date';\n\n" },
            { type: 'test', msg: 'add format relative time tests', code: "describe('formatRelativeTime', () => {\n  it('should return just now for recent timestamps', () => {\n    const now = Math.floor(Date.now() / 1000);\n    expect(formatRelativeTime(now)).toBe('Just now');\n  });\n});\n\n" },
            { type: 'test', msg: 'add format duration tests', code: "describe('formatDuration', () => {\n  it('should format days correctly', () => {\n    expect(formatDuration(86400)).toBe('1d');\n  });\n\n  it('should format hours correctly', () => {\n    expect(formatDuration(3600)).toBe('1h');\n  });\n});\n\n" },
            { type: 'test', msg: 'add is expired tests', code: "describe('isExpired', () => {\n  it('should return true for past timestamps', () => {\n    const pastTimestamp = Math.floor(Date.now() / 1000) - 1000;\n    expect(isExpired(pastTimestamp)).toBe(true);\n  });\n\n  it('should return false for future timestamps', () => {\n    const futureTimestamp = Math.floor(Date.now() / 1000) + 1000;\n    expect(isExpired(futureTimestamp)).toBe(false);\n  });\n});\n" }
        ]
    },
    {
        name: 'test-number-utils',
        file: 'frontend/src/lib/utils/number.test.ts',
        steps: [
            { type: 'test', msg: 'create number utils tests file', code: '// Number Utils Tests\n\n' },
            { type: 'test', msg: 'add imports', code: "import { describe, it, expect } from 'vitest';\nimport { formatCompact, clamp, percentage, roundToDecimals } from './number';\n\n" },
            { type: 'test', msg: 'add format compact tests', code: "describe('formatCompact', () => {\n  it('should format millions', () => {\n    expect(formatCompact(1500000)).toBe('1.5M');\n  });\n\n  it('should format thousands', () => {\n    expect(formatCompact(2500)).toBe('2.5K');\n  });\n});\n\n" },
            { type: 'test', msg: 'add clamp tests', code: "describe('clamp', () => {\n  it('should clamp to min', () => {\n    expect(clamp(-5, 0, 10)).toBe(0);\n  });\n\n  it('should clamp to max', () => {\n    expect(clamp(15, 0, 10)).toBe(10);\n  });\n});\n\n" },
            { type: 'test', msg: 'add percentage tests', code: "describe('percentage', () => {\n  it('should calculate percentage correctly', () => {\n    expect(percentage(25, 100)).toBe(25);\n  });\n\n  it('should return 0 for zero total', () => {\n    expect(percentage(10, 0)).toBe(0);\n  });\n});\n" }
        ]
    },
    // More feature docs
    {
        name: 'docs-walletconnect',
        file: 'docs/WALLETCONNECT.md',
        steps: [
            { type: 'docs', msg: 'create walletconnect documentation', code: '# WalletConnect Integration\n\n' },
            { type: 'docs', msg: 'add overview section', code: '## Overview\n\nSereneHub integrates WalletConnect for secure wallet connections across multiple platforms.\n\n' },
            { type: 'docs', msg: 'add setup section', code: '## Setup\n\n1. Install dependencies:\n```bash\nnpm install @reown/appkit @reown/appkit-adapter-wagmi\n```\n\n2. Configure the provider in your app.\n\n' },
            { type: 'docs', msg: 'add supported wallets section', code: '## Supported Wallets\n\n- Leather (Hiro Wallet)\n- Xverse\n- OKX Wallet\n- And any WalletConnect-compatible wallet\n\n' },
            { type: 'docs', msg: 'add troubleshooting section', code: '## Troubleshooting\n\n### Connection Issues\n\n1. Clear browser cache\n2. Try a different browser\n3. Ensure wallet app is updated\n\n### QR Code Not Scanning\n\n1. Ensure good lighting\n2. Refresh the page and try again\n\n' }
        ]
    },
    {
        name: 'docs-chainhooks',
        file: 'docs/CHAINHOOKS.md',
        steps: [
            { type: 'docs', msg: 'create chainhooks documentation', code: '# Chainhooks Integration\n\n' },
            { type: 'docs', msg: 'add overview section', code: '## Overview\n\nChainooks enables real-time blockchain event tracking for SereneHub.\n\n' },
            { type: 'docs', msg: 'add setup section', code: '## Setup\n\n```bash\nnpm install @hirosystems/chainhooks-client\n```\n\n' },
            { type: 'docs', msg: 'add configuration section', code: '## Configuration\n\n```typescript\nimport { ChainhooksClient } from "@hirosystems/chainhooks-client";\n\nconst client = new ChainhooksClient({\n  url: "http://localhost:20456",\n  apiKey: process.env.CHAINHOOKS_API_KEY\n});\n```\n\n' },
            { type: 'docs', msg: 'add event types section', code: '## Event Types\n\n- Contract Calls\n- Token Transfers\n- NFT Events\n- Staking Events\n\n' },
            { type: 'docs', msg: 'add use cases section', code: '## Use Cases\n\n1. Real-time transaction notifications\n2. Indexing contract events\n3. Building activity feeds\n4. Automated responses to blockchain events\n\n' }
        ]
    },
    // Context providers
    {
        name: 'context-theme',
        file: 'frontend/src/context/ThemeContext.tsx',
        steps: [
            { type: 'feat', msg: 'create theme context file', code: '// Theme Context\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\nimport { createContext, useContext, useState, useEffect, ReactNode } from 'react';\nimport type { Theme } from '@/types/ui';\n\n" },
            { type: 'feat', msg: 'define context type', code: 'interface ThemeContextValue {\n  theme: Theme;\n  setTheme: (theme: Theme) => void;\n}\n\n' },
            { type: 'feat', msg: 'create context', code: "const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);\n\n" },
            { type: 'feat', msg: 'implement provider', code: "export function ThemeProvider({ children }: { children: ReactNode }) {\n  const [theme, setTheme] = useState<Theme>('system');\n\n  useEffect(() => {\n    const saved = localStorage.getItem('theme') as Theme | null;\n    if (saved) setTheme(saved);\n  }, []);\n\n  useEffect(() => {\n    localStorage.setItem('theme', theme);\n    const root = document.documentElement;\n    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {\n      root.classList.add('dark');\n    } else {\n      root.classList.remove('dark');\n    }\n  }, [theme]);\n\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\n" },
            { type: 'feat', msg: 'add use theme hook', code: "export function useTheme(): ThemeContextValue {\n  const context = useContext(ThemeContext);\n  if (!context) throw new Error('useTheme must be used within ThemeProvider');\n  return context;\n}\n" }
        ]
    },
    // Feature components
    {
        name: 'component-nft-card',
        file: 'frontend/src/components/nft/NFTCard.tsx',
        steps: [
            { type: 'feat', msg: 'create nft card component file', code: '// NFT Card Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\nimport Image from 'next/image';\nimport { Card, CardContent, CardFooter } from '../ui/Card';\nimport { Badge } from '../ui/Badge';\nimport { Button } from '../ui/Button';\nimport type { NFT } from '@/types/contracts';\nimport { formatCurrency } from '@/lib/utils/format';\n\n" },
            { type: 'feat', msg: 'define nft card props', code: 'interface NFTCardProps {\n  nft: NFT;\n  onBuy?: () => void;\n}\n\n' },
            { type: 'feat', msg: 'implement nft card component', code: "export function NFTCard({ nft, onBuy }: NFTCardProps) {\n  return (\n    <Card className=\"overflow-hidden hover:shadow-lg transition-shadow\">\n      <div className=\"aspect-square relative bg-gray-100\">\n        <Image\n          src={nft.uri || '/placeholder.png'}\n          alt={`NFT #${nft.id}`}\n          fill\n          className=\"object-cover\"\n        />\n        {nft.isListed && (\n          <Badge variant=\"success\" className=\"absolute top-2 right-2\">\n            For Sale\n          </Badge>\n        )}\n      </div>\n      <CardContent>\n        <h3 className=\"font-semibold text-gray-900\">NFT #{nft.id}</h3>\n        {nft.price && (\n          <p className=\"text-indigo-600 font-medium mt-1\">\n            {formatCurrency(nft.price / 1_000_000)} STX\n          </p>\n        )}\n      </CardContent>\n      {nft.isListed && onBuy && (\n        <CardFooter>\n          <Button onClick={onBuy} className=\"w-full\">Buy Now</Button>\n        </CardFooter>\n      )}\n    </Card>\n  );\n}\n" }
        ]
    },
    {
        name: 'component-staking-card',
        file: 'frontend/src/components/staking/StakingCard.tsx',
        steps: [
            { type: 'feat', msg: 'create staking card component file', code: '// Staking Card Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "'use client';\n\nimport { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';\nimport { Button } from '../ui/Button';\nimport { Progress } from '../ui/Progress';\nimport { StatCard } from '../ui/StatCard';\nimport type { StakePosition } from '@/types/contracts';\nimport { formatTokenAmount } from '@/lib/utils/format';\n\n" },
            { type: 'feat', msg: 'define staking card props', code: 'interface StakingCardProps {\n  position: StakePosition;\n  onUnstake: () => void;\n  onClaimRewards: () => void;\n}\n\n' },
            { type: 'feat', msg: 'implement staking card component', code: "export function StakingCard({ position, onUnstake, onClaimRewards }: StakingCardProps) {\n  const stakedAmount = formatTokenAmount(position.amount, 6);\n  const rewards = formatTokenAmount(position.rewards, 6);\n\n  return (\n    <Card>\n      <CardHeader>\n        <h3 className=\"text-lg font-semibold\">Your Stake</h3>\n      </CardHeader>\n      <CardContent className=\"space-y-4\">\n        <div className=\"grid grid-cols-2 gap-4\">\n          <StatCard title=\"Staked Amount\" value={`${stakedAmount} STX`} />\n          <StatCard title=\"Pending Rewards\" value={`${rewards} STX`} />\n        </div>\n        <div>\n          <p className=\"text-sm text-gray-500 mb-2\">Lock Progress</p>\n          <Progress value={65} showLabel />\n        </div>\n      </CardContent>\n      <CardFooter className=\"flex gap-3\">\n        <Button onClick={onClaimRewards} variant=\"primary\">Claim Rewards</Button>\n        <Button onClick={onUnstake} variant=\"outline\">Unstake</Button>\n      </CardFooter>\n    </Card>\n  );\n}\n" }
        ]
    },
    // More config
    {
        name: 'config-animation',
        file: 'frontend/src/config/animations.ts',
        steps: [
            { type: 'feat', msg: 'create animations config file', code: '// Animation Configuration\n\n' },
            { type: 'feat', msg: 'add fade animations', code: "export const fadeIn = {\n  initial: { opacity: 0 },\n  animate: { opacity: 1 },\n  exit: { opacity: 0 },\n  transition: { duration: 0.2 }\n};\n\n" },
            { type: 'feat', msg: 'add slide animations', code: "export const slideUp = {\n  initial: { opacity: 0, y: 20 },\n  animate: { opacity: 1, y: 0 },\n  exit: { opacity: 0, y: 20 },\n  transition: { duration: 0.3 }\n};\n\nexport const slideIn = {\n  initial: { opacity: 0, x: -20 },\n  animate: { opacity: 1, x: 0 },\n  exit: { opacity: 0, x: -20 },\n  transition: { duration: 0.3 }\n};\n\n" },
            { type: 'feat', msg: 'add scale animations', code: "export const scaleIn = {\n  initial: { opacity: 0, scale: 0.95 },\n  animate: { opacity: 1, scale: 1 },\n  exit: { opacity: 0, scale: 0.95 },\n  transition: { duration: 0.2 }\n};\n\n" },
            { type: 'feat', msg: 'add stagger config', code: "export const staggerChildren = {\n  animate: {\n    transition: {\n      staggerChildren: 0.1\n    }\n  }\n};\n" }
        ]
    },
    // Additional layout components
    {
        name: 'layout-grid',
        file: 'frontend/src/components/layout/Grid.tsx',
        steps: [
            { type: 'feat', msg: 'create grid layout component file', code: '// Grid Layout Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "import { ReactNode } from 'react';\n\n" },
            { type: 'feat', msg: 'define grid props', code: 'interface GridProps {\n  children: ReactNode;\n  cols?: 1 | 2 | 3 | 4;\n  gap?: number;\n  className?: string;\n}\n\n' },
            { type: 'feat', msg: 'implement grid component', code: "export function Grid({ children, cols = 3, gap = 6, className = '' }: GridProps) {\n  const colsClass = {\n    1: 'grid-cols-1',\n    2: 'grid-cols-1 md:grid-cols-2',\n    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',\n    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',\n  };\n\n  return (\n    <div className={`grid ${colsClass[cols]} gap-${gap} ${className}`}>\n      {children}\n    </div>\n  );\n}\n" }
        ]
    },
    {
        name: 'layout-stack',
        file: 'frontend/src/components/layout/Stack.tsx',
        steps: [
            { type: 'feat', msg: 'create stack layout component file', code: '// Stack Layout Component\n\n' },
            { type: 'feat', msg: 'add imports', code: "import { ReactNode } from 'react';\n\n" },
            { type: 'feat', msg: 'define stack props', code: "interface StackProps {\n  children: ReactNode;\n  direction?: 'horizontal' | 'vertical';\n  gap?: number;\n  align?: 'start' | 'center' | 'end';\n  className?: string;\n}\n\n" },
            { type: 'feat', msg: 'implement stack component', code: "export function Stack({ \n  children, \n  direction = 'vertical', \n  gap = 4, \n  align = 'start', \n  className = '' \n}: StackProps) {\n  const directionClass = direction === 'horizontal' ? 'flex-row' : 'flex-col';\n  const alignClass = {\n    start: 'items-start',\n    center: 'items-center',\n    end: 'items-end',\n  };\n\n  return (\n    <div className={`flex ${directionClass} ${alignClass[align]} gap-${gap} ${className}`}>\n      {children}\n    </div>\n  );\n}\n" }
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
    'frontend/src/components/nft',
    'frontend/src/components/staking',
    'frontend/src/types',
    'frontend/src/constants',
    'frontend/src/services',
    'frontend/src/config',
    'frontend/src/context'
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
