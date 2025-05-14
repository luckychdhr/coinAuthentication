import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import Logo from './common/Logo'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  // Animation for navbar background on scroll
  const navbarAnimation = useSpring({
    background: isScrolled 
      ? theme === 'dark' 
        ? 'rgba(10, 25, 47, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)'
      : 'transparent',
    boxShadow: isScrolled 
      ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
      : 'none',
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
    config: { tension: 300, friction: 20 }
  })

  // Mobile menu animation
  const mobileMenuAnimation = useSpring({
    transform: mobileMenuOpen ? 'translateX(0%)' : 'translateX(100%)',
    opacity: mobileMenuOpen ? 1 : 0,
    config: { tension: 300, friction: 26 }
  })

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Verify', path: '/verify' },
    { title: 'Features', path: '/features' },
    // { title: 'Pricing', path: '/pricing' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' }
  ]

  return (
    <animated.nav 
      style={navbarAnimation} 
      className="navbar"
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
          </button>
          {/* Mobile menu toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <animated.div 
          style={mobileMenuAnimation} 
          className="mobile-menu"
        >
          <div className="mobile-menu-links">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </animated.div>
      </div>
    </animated.nav>
  )
}

export default Navbar