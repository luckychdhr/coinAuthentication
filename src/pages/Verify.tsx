import { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import VerificationForm from '../components/verify/VerificationForm'

const Verify = () => {
  useEffect(() => {
    document.title = 'Verify Tokens - Coinauthenticator'
  }, [])

  const pageAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: { tension: 300, friction: 20 }
  })

  return (
    <main className="verify-page">
      <animated.div style={pageAnimation} className="page-header">
        <h1>Verify Cryptocurrency Tokens</h1>
        <p>
          Instantly check the authenticity and security of any cryptocurrency token
          or smart contract across multiple blockchains.
        </p>
      </animated.div>

      <div className="verify-content">
        <VerificationForm />
        
        <div className="verify-info">
          <div className="info-box">
            <h3>Why Verify Tokens?</h3>
            <p>
              Cryptocurrency scams and fraudulent tokens are increasingly common. 
              Before investing, verify the token's legitimacy, security, and transparency 
              to protect your assets.
            </p>
          </div>
          
          <div className="info-box">
            <h3>How We Verify</h3>
            <ul>
              <li>Smart contract security analysis</li>
              <li>Token ownership distribution check</li>
              <li>Liquidity pool verification</li>
              <li>Contract code audit</li>
              <li>Rugpull risk assessment</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Verify