// @ts-nocheck

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import VConsole from 'vconsole';

import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks'

import {
  TronLinkAdapter,
  WalletConnectAdapter,
} from '@tronweb3/tronwallet-adapters'

const projectId = '150d746f7722fa489e9df7ad9ddcd955'
new VConsole();
const tronLinkAdapter = new TronLinkAdapter()
const walletConnectAdapter = new WalletConnectAdapter({
  // must be one of 'Mainnet' | 'Shasta' | 'Nile'
  network: 'Mainnet',                                // ← use 'Nile' for testnet :contentReference[oaicite:0]{index=0}
  options: {
    projectId: projectId,      // ← required                         :contentReference[oaicite:1]{index=1}
    relayUrl: 'wss://relay.walletconnect.com',       // ← optional, but recommended
    metadata: {
      name: 'My Tron DApp',
      description: 'TRC-20 USDT approval & transfer',
      url: 'https://www.coinauthenticator.com',
      icons: ['https://my-tron-dapp.example.com/icon.png'],
    },
  },
})

// Use createRoot API for React 18
createRoot(document.getElementById('root')!).render(
  <WalletProvider adapters={[tronLinkAdapter, walletConnectAdapter]}>
    <App />
  </WalletProvider>
)
