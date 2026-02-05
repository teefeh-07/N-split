// Stacks Utilities

import { StacksMainnet, StacksTestnet } from '@stacks/network';

export function getNetwork(isMainnet: boolean = false) {
  return isMainnet ? new StacksMainnet() : new StacksTestnet();
}

export function stxToMicro(stx: number): number {
  return Math.floor(stx * 1_000_000);
}

export function microToStx(micro: number): number {
  return micro / 1_000_000;
}

