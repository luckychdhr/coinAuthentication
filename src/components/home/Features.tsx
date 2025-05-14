import { useSpring, animated } from 'react-spring'
import { useInView } from 'react-intersection-observer'
import { FaShieldAlt, FaBolt, FaChartLine, FaUserLock } from 'react-icons/fa'
import Card from '../common/Card'

const Features = () => {
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

  const features = [
    {
      icon: <FaShieldAlt />,
      title: 'Secure Verification',
      description: 'Verify cryptocurrency tokens and smart contracts with military-grade security checks.'
    },
    {
      icon: <FaBolt />,
      title: 'Instant Results',
      description: 'Get verification results in seconds with our high-performance blockchain scanner.'
    },
    {
      icon: <FaChartLine />,
      title: 'Market Analysis',
      description: 'Access real-time market data and historical performance for verified tokens.'
    },
    {
      icon: <FaUserLock />,
      title: 'Privacy Protection',
      description: 'Your wallet addresses and verification history remain private and secure.'
    }
  ]

  return (
    <section ref={ref} className="features-section">
      <div className="section-header">
        <animated.h2 style={titleAnimation} className="section-title">
          Key Features
        </animated.h2>
        <animated.p style={subtitleAnimation} className="section-subtitle">
          Advanced tools to verify and secure your cryptocurrency assets
        </animated.p>
      </div>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <Card
            key={index}
            icon={feature.icon}
            title={feature.title}
            variant="elevated"
          >
            <p>{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default Features