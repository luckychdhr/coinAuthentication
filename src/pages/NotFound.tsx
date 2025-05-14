import { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

const NotFound = () => {
  useEffect(() => {
    document.title = 'Page Not Found - Coinauthenticator'
  }, [])

  const pageAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: { tension: 300, friction: 20 }
  })

  return (
    <main className="not-found-page">
      <animated.div style={pageAnimation} className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          The page you were looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Button 
            label="Go Back Home" 
            variant="primary" 
            path="/" 
            size="large" 
          />
          <Link to="/contact" className="not-found-link">
            Contact Support
          </Link>
        </div>
      </animated.div>
    </main>
  )
}

export default NotFound