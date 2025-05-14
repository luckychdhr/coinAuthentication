import { useSpring, animated } from 'react-spring'
import { useTheme } from '../../context/ThemeContext'

const Logo = () => {
  const { theme } = useTheme()
  
  const logoAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 200, friction: 20 }
  })

  return (
    <animated.div style={logoAnimation} className="logo">
      <span className="logo-icon">₿</span>
      <span className="logo-text">
        <span className="logo-text-coin">Coin</span>
        <span className="logo-text-authenticator">authenticator</span>
      </span>
    </animated.div>
  )
}

export default Logo