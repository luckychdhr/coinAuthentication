import { useSpring, animated } from 'react-spring'
import { useInView } from 'react-intersection-observer'
import Button from '../common/Button'

const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const titleAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(10px)', // Reduced translate distance
    config: { tension: 170, friction: 14 }, // Lowered tension and friction
    delay: 100
  })

  const subtitleAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(10px)', // Reduced translate distance
    config: { tension: 170, friction: 14 },
    delay: 200
  })

  const buttonAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(8px)', // Reduced translate distance
    config: { tension: 170, friction: 14 },
    delay: 300
  })

  const imageAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'scale(1)' : 'scale(0.98)', // Reduced scale difference
    config: { tension: 160, friction: 12 }, // Lowered tension and friction
    delay: 400
  })

  return (
    <section ref={ref} className="hero-section">
      <div className="hero-content">
        <animated.h1 style={titleAnimation} className="hero-title">
          Secure Cryptocurrency Verification
        </animated.h1>
        
        <animated.p style={subtitleAnimation} className="hero-subtitle">
          Instantly verify the authenticity of any cryptocurrency token or contract. 
          Protect yourself from scams and ensure your investments are legitimate.
        </animated.p>
        
        <animated.div style={buttonAnimation} className="hero-buttons">
          <Button 
            label="Verify Now" 
            variant="primary" 
            size="large" 
            path="/verify" 
          />
          <Button 
            label="Learn More" 
            variant="outline" 
            size="large" 
            path="/features" 
          />
        </animated.div>
      </div>
      
      <animated.div style={imageAnimation} className="hero-image">
        <img 
          src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg" 
          alt="Cryptocurrency security verification" 
          className="hero-img"
          loading="lazy" // Lazy load the image
        />
        <div className="hero-image-overlay"></div>
      </animated.div>
      
      <div className="hero-particles"></div>
    </section>
  )
}

export default Hero