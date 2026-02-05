const { execSync } = require('child_process');
const fs = require('fs');

const FILE = 'frontend/src/components/providers/StacksProvider.tsx';

function run(cmd) {
    try {
        console.log(`Running: ${cmd}`);
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
function save(msg) { run(`node automation/auto-git.cjs save feat "${msg}"`); }

// Start
run(`node automation/auto-git.cjs start-feature stacks-connect`);

// 1. Create directory
fs.mkdirSync('frontend/src/components/providers', { recursive: true });

// 2. Create file empty
fs.writeFileSync(FILE, '// Stacks Provider implementation\n');
save('create StacksProvider file');

// 3. Add Imports
const IMPORTS = `
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
`;
fs.appendFileSync(FILE, IMPORTS);
save('add dependencies imports');

// 4. Define Config
const CONFIG = `
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });
`;
fs.appendFileSync(FILE, CONFIG);
save('initialize user session and config');

// 5. Component Shell
const SHELL_START = `
export function StacksProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);
`;
fs.appendFileSync(FILE, SHELL_START);
save('add component shell and auth check');

// 6. Auth Function
const AUTH_FN = `
  const authenticate = () => {
    showConnect({
      appDetails: {
        name: 'SereneHub',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };
`;
fs.appendFileSync(FILE, AUTH_FN);
save('implement authentication function');

// 7. Close and Export
const CLOSE = `
  return (
    <div className="stacks-provider">
      {/* Context provider logic can go here */}
      {children}
    </div>
  );
}
`;
fs.appendFileSync(FILE, CLOSE);
save('finalize component render');

// Finish
run(`node automation/auto-git.cjs finish`);
