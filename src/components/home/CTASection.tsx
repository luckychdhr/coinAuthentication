import { motion } from 'framer-motion'
import Button from '../common/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

const CTASection = () => {
  return (
    <section className="cta-section">
      <motion.div
        className="cta-content"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
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
        </div>
      </motion.div>
    </section>
  )
}

export default CTASection
