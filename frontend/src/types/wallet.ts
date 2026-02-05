// Wallet Type Definitions

export type WalletState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface UserData {
  stxAddress: string;
  btcAddress: string;
  profile?: {
    name?: string;
    avatar?: string;
  };
}

