import { Link } from 'react-router-dom'
import { FaTwitter, FaDiscord, FaTelegram, FaGithub } from 'react-icons/fa'
import Logo from './common/Logo'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo-section">
            <Logo />
            <p className="footer-tagline">
              Secure cryptocurrency verification for investors and traders
            </p>
            <div className="footer-social">
              <a href="#" className="social-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon" aria-label="Discord">
                <FaDiscord />
              </a>
              <a href="#" className="social-icon" aria-label="Telegram">
                <FaTelegram />
              </a>
              <a href="#" className="social-icon" aria-label="GitHub">
                <FaGithub />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h3 className="footer-links-title">Product</h3>
              <ul className="footer-links-list">
                <li><Link to="/verify">Verify Token</Link></li>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/">Security</Link></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="footer-links-title">Company</h3>
              <ul className="footer-links-list">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/">Careers</Link></li>
                <li><Link to="/">Blog</Link></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="footer-links-title">Resources</h3>
              <ul className="footer-links-list">
                <li><Link to="/">Documentation</Link></li>
                <li><Link to="/">API</Link></li>
                <li><Link to="/">Status</Link></li>
                <li><Link to="/">Support</Link></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="footer-links-title">Legal</h3>
              <ul className="footer-links-list">
                <li><Link to="/">Terms of Service</Link></li>
                <li><Link to="/">Privacy Policy</Link></li>
                <li><Link to="/">Cookies</Link></li>
                <li><Link to="/">Compliance</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Coinauthenticator. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <Link to="/">Terms</Link>
            <Link to="/">Privacy</Link>
            <Link to="/">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer