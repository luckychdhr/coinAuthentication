import { useSpring, animated } from 'react-spring'
import { useInView } from 'react-intersection-observer'

const HowItWorks = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const titleAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 300, friction: 20 },
    delay: 100
  })

  const subtitleAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 300, friction: 20 },
    delay: 200
  })

  const steps = [
    {
      number: '01',
      title: 'Enter Token Address',
      description: 'Paste the cryptocurrency contract address or token ID you want to verify.'
    },
    {
      number: '02',
      title: 'Automated Scanning',
      description: 'Our system scans multiple blockchains and security databases for verification.'
    },
    {
      number: '03',
      title: 'Receive Analysis',
      description: 'Get a comprehensive report on legitimacy, security risks, and market performance.'
    },
    {
      number: '04',
      title: 'Make Informed Decisions',
      description: 'Use our detailed insights to make safe cryptocurrency investment decisions.'
    }
  ]

  const stepsAnimation = steps.map((_, index) => 
    useSpring({
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-20px)',
      config: { tension: 300, friction: 20 },
      delay: 300 + (index * 100)
    })
  )

  return (
    <section ref={ref} className="how-it-works-section">
      <div className="section-header">
        <animated.h2 style={titleAnimation} className="section-title">
          How It Works
        </animated.h2>
        <animated.p style={subtitleAnimation} className="section-subtitle">
          Verify cryptocurrency legitimacy in four simple steps
        </animated.p>
      </div>
      
      <div className="steps-container">
        {steps.map((step, index) => (
          <animated.div 
            key={index} 
            style={stepsAnimation[index]} 
            className="step"
          >
            <div className="step-number">{step.number}</div>
            <div className="step-content">
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          </animated.div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks