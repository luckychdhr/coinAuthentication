import { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import Button from '../common/Button'

interface FormState {
  contractAddress: string
  blockchain: string
}

const VerificationForm = () => {
  const [formData, setFormData] = useState<FormState>({
    contractAddress: '',
    blockchain: 'ethereum'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate verification process
    setTimeout(() => {
      setIsSubmitting(false)
      setShowResults(true)
    }, 2000)
  }

  const blockchainOptions = [
    { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'binance', label: 'Binance Smart Chain (BSC)' },
    { value: 'polygon', label: 'Polygon (MATIC)' },
    { value: 'solana', label: 'Solana (SOL)' },
    { value: 'avalanche', label: 'Avalanche (AVAX)' }
  ]

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
              <span className="result-value">92/100</span>
            </div>
            <div className="result-item">
              <span className="result-label">Contract Type:</span>
              <span className="result-value">ERC-20 Token</span>
            </div>
            <div className="result-item">
              <span className="result-label">Creation Date:</span>
              <span className="result-value">2023-05-15</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Supply:</span>
              <span className="result-value">1,000,000,000</span>
            </div>
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