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

export interface WalletContextValue {
  state: WalletState;
  userData: UserData | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}
