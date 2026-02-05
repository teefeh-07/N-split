// Validation Utilities

export function isValidStxAddress(address: string): boolean {
  return /^S[PT][A-Z0-9]{38,40}$/.test(address);
}

export function isValidAmount(amount: string): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
}

export function isValidTokenName(name: string): boolean {
  return name.length >= 3 && name.length <= 32;
}

export function isValidTokenSymbol(symbol: string): boolean {
  return /^[A-Z]{2,6}$/.test(symbol);
}

