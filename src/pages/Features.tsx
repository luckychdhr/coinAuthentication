import { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import { useInView } from 'react-intersection-observer'
import { FaShieldAlt, FaSearch, FaChartLine, FaUserLock, FaBell, FaMobileAlt } from 'react-icons/fa'
import Card from '../components/common/Card'

const Features = () => {
  useEffect(() => {
    document.title = 'Features - Coinauthenticator'
  }, [])

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const headerAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 300, friction: 20 }
  })

  const features = [
    {
      icon: <FaShieldAlt />,
      title: 'Security Scanning',
      description: 'Comprehensive security analysis of tokens and smart contracts to identify potential vulnerabilities, backdoors, and malicious code.'
    },
    {
      icon: <FaSearch />,
      title: 'Deep Verification',
      description: 'Multi-layer verification process that checks contract source code, ownership distribution, liquidity locks, and transaction patterns.'
    },
    {
      icon: <FaChartLine />,
      title: 'Market Analytics',
      description: 'Real-time market data, historical performance, and price analysis to help you make informed investment decisions.'
    },
    {
      icon: <FaUserLock />,
      title: 'Privacy Protection',
      description: 'Secure and private verification process that doesn\'t require wallet connection or personal information.'
    },
    {
      icon: <FaBell />,
      title: 'Alert System',
      description: 'Set up custom alerts for price movements, security issues, or important updates for your verified tokens.'
    },
    {
      icon: <FaMobileAlt />,
      title: 'Mobile Access',
      description: 'Responsive design allows you to verify tokens and access reports from any device, anywhere.'
    }
  ]

  return (
    <main className="features-page">
      <div ref={ref} className="page-header">
        <animated.h1 style={headerAnimation}>Features</animated.h1>
        <animated.p style={headerAnimation} className="page-subtitle">
          Advanced tools to verify and secure your cryptocurrency investments
        </animated.p>
      </div>

      <div className="features-page-grid">
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
    </main>
  )
}

export default Features