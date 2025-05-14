import { useSpring, animated } from 'react-spring'

const LoadingSpinner = () => {
  const spinnerAnimation = useSpring({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    loop: true,
    config: { duration: 1500 }
  })

  const pulseAnimation = useSpring({
    from: { opacity: 0.5, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    loop: { reverse: true },
    config: { tension: 300, friction: 20 }
  })

  return (
    <div className="loading-container">
      <animated.div style={pulseAnimation} className="loading-wrapper">
        <animated.div style={spinnerAnimation} className="loading-spinner">
          <span className="spinner-icon">₿</span>
        </animated.div>
        <p className="loading-text">Loading...</p>
      </animated.div>
    </div>
  )
}

export default LoadingSpinner