// @ts-nocheck

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import VConsole from 'vconsole';
import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.global = window;
window.process = process;
window.global = window;

// const projectId = '150d746f7722fa489e9df7ad9ddcd955'
new VConsole();
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieStorage, createStorage } from 'wagmi';
import { tron } from '@reown/appkit/networks';

const projectId = '150d746f7722fa489e9df7ad9ddcd955'; // Replace with your actual Project ID

const networks = [tron];

const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  networks,
  projectId,
});

const queryClient = new QueryClient();

const metadata = {
  name: 'AppKit TRON Approve',
  description: 'TRC20 Approve via Trust Wallet',
  url: 'https://yourdapp.com',
  icons: ['https://yourdapp.com/icon.png'],
};

const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  features: {
    analytics: true,
  },
  themeMode: 'light',
});

export { wagmiAdapter, queryClient, appKit };

// Use createRoot API for React 18
createRoot(document.getElementById('root')!).render(
  // <WagmiProvider config={wagmiAdapter.wagmiConfig}>
  //   <QueryClientProvider client={queryClient}>
      <App />
    // </QueryClientProvider>
  // </WagmiProvider>
)
