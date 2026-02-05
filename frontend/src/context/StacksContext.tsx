
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
