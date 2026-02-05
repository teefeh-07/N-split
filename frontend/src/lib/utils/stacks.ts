// Stacks Utilities

import { StacksMainnet, StacksTestnet } from '@stacks/network';

export function getNetwork(isMainnet: boolean = false) {
  return isMainnet ? new StacksMainnet() : new StacksTestnet();
}

