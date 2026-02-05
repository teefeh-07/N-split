const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) { return execSync(cmd, { encoding: 'utf8', stdio: 'inherit' }); }
function save(type, msg) {
    try {
        run('git add .');
        run(`git commit -m "${type}: ${msg}"`);
    } catch (e) { /* ignore if empty */ }
}

run('node automation/auto-git.cjs start-feature stacks-implementation-upgrade');

// 1. Create StacksContext.tsx
const STACKS_CONTEXT_FILE = 'frontend/src/context/StacksContext.tsx';
const STACKS_CONTEXT_CONTENT = `
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet, StacksNetwork } from '@stacks/network';

interface StacksContextValue {
  network: StacksNetwork;
  userSession: UserSession;
  userData: any;
  authenticate: () => void;
  disconnect: () => void;
  isMainnet: boolean;
  setNetwork: (network: 'mainnet' | 'testnet') => void;
}

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const StacksContext = createContext<StacksContextValue | undefined>(undefined);

export function StacksProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any>(null);
  const [isMainnet, setIsMainnet] = useState(false);
  const [network, setNetworkState] = useState<StacksNetwork>(new StacksTestnet());

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const authenticate = () => {
    showConnect({
      appDetails: {
        name: 'SereneHub',
        icon: typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    setUserData(null);
  };

  const setNetwork = (type: 'mainnet' | 'testnet') => {
    if (type === 'mainnet') {
      setNetworkState(new StacksMainnet());
      setIsMainnet(true);
    } else {
      setNetworkState(new StacksTestnet());
      setIsMainnet(false);
    }
  };

  return (
    <StacksContext.Provider value={{
      network,
      userSession,
      userData,
      authenticate,
      disconnect,
      isMainnet,
      setNetwork
    }}>
      {children}
    </StacksContext.Provider>
  );
}

export function useStacks() {
  const context = useContext(StacksContext);
  if (!context) throw new Error('useStacks must be used within StacksProvider');
  return context;
}
`;

fs.writeFileSync(STACKS_CONTEXT_FILE, STACKS_CONTEXT_CONTENT);
save('feat', 'create stacks context with auth and network support');

// 2. Remove old provider file and update providers.tsx
try { fs.unlinkSync('frontend/src/components/providers/StacksProvider.tsx'); } catch (e) { }
save('refactor', 'remove old stacks provider component');

const PROVIDERS_FILE = 'frontend/src/app/providers.tsx';
let providersContent = fs.readFileSync(PROVIDERS_FILE, 'utf8');
providersContent = providersContent.replace(
    "import { StacksProvider } from '@/components/providers/StacksProvider';",
    "import { StacksProvider } from '@/context/StacksContext';"
);
fs.writeFileSync(PROVIDERS_FILE, providersContent);
save('refactor', 'update providers to use new StacksContext');

// 3. Create Transaction Helper
const TX_HELPER_FILE = 'frontend/src/lib/transactions.ts';
const TX_HELPER_CONTENT = `
import { openContractCall } from '@stacks/connect';
import { 
  StacksNetwork, 
  PostConditionMode, 
  AnchorMode,
  ClarityValue
} from '@stacks/transactions';

export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  network: StacksNetwork;
  postConditions?: any[];
  postConditionMode?: PostConditionMode;
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}

export async function callContract(options: ContractCallOptions) {
  const {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network,
    postConditions = [],
    postConditionMode = PostConditionMode.Deny,
    onFinish,
    onCancel
  } = options;

  await openContractCall({
    network,
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
    postConditionMode,
    anchorMode: AnchorMode.Any,
    onFinish,
    onCancel,
  });
}
`;
fs.writeFileSync(TX_HELPER_FILE, TX_HELPER_CONTENT);
save('feat', 'implement transaction helper with stacks transactions');

run('node automation/auto-git.cjs finish');
