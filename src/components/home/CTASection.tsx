import { useSpring, animated } from 'react-spring'
import { useInView } from 'react-intersection-observer'
import Button from '../common/Button'

const CTASection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const ctaAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)', // Reduced translate distance
    config: { tension: 200, friction: 15 } // Lowered tension and friction for smoother animation
  })

  return (
    <section ref={ref} className="cta-section">
      <animated.div style={ctaAnimation} className="cta-content">
        <h2 className="cta-title">Ready to Secure Your Crypto Investments?</h2>
        <p className="cta-text">
          Join thousands of investors who trust Coinauthenticator to verify cryptocurrency tokens
          and make informed investment decisions.
        </p>
        <div className="cta-buttons">
          <Button 
            label="Start Free Verification" 
            variant="primary" 
            size="large" 
            path="/verify" 
          />
          <Button 
            label="View Premium Plans" 
            variant="outline" 
            size="large" 
            path="/pricing" 
          />
        </div>
      </animated.div>
    </section>
  )
}

export default CTASection