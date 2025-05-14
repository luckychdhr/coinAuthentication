import { motion } from 'framer-motion'
import Button from '../common/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: 'easeOut' },
  }),
}

const imageFade = {
  hidden: { opacity: 0.5, scale: 0.985 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.3, duration: 0.6, ease: 'easeOut' },
  },
}

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <motion.h1
          className="hero-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={0}
        >
          Secure Cryptocurrency Verification
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={0.1}
        >
          Instantly verify the authenticity of any cryptocurrency token or contract. 
          Protect yourself from scams and ensure your investments are legitimate.
        </motion.p>

       
          <Button label="Verify Now" variant="primary" size="large" path="/verify" />
      </div>

      <motion.div
        className="hero-image"
        variants={imageFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <img
          src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg"
          alt="Cryptocurrency security verification"
          className="hero-img"
          loading="lazy"
        />
        <div className="hero-image-overlay" />
      </motion.div>

      <div className="hero-particles" />
    </section>
  )
}

export default Hero
