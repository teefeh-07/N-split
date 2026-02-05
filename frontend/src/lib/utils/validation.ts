// Validation Utilities

export function isValidStxAddress(address: string): boolean {
  return /^S[PT][A-Z0-9]{38,40}$/.test(address);
}

