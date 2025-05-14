import { motion } from 'framer-motion'
import { FaShieldAlt, FaBolt, FaChartLine, FaUserLock } from 'react-icons/fa'
import Card from '../common/Card'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom, duration: 0.5, ease: 'easeOut' },
  }),
}

const Features = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: 'Secure Verification',
      description:
        'Verify cryptocurrency tokens and smart contracts with military-grade security checks.',
    },
    {
      icon: <FaBolt />,
      title: 'Instant Results',
      description:
        'Get verification results in seconds with our high-performance blockchain scanner.',
    },
    {
      icon: <FaChartLine />,
      title: 'Market Analysis',
      description:
        'Access real-time market data and historical performance for verified tokens.',
    },
    {
      icon: <FaUserLock />,
      title: 'Privacy Protection',
      description:
        'Your wallet addresses and verification history remain private and secure.',
    },
  ]

  return (
    <section className="features-section">
      <div className="section-header">
        <motion.h2
          className="section-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
        >
          Key Features
        </motion.h2>

        <motion.p
          className="section-subtitle"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0.1}
        >
          Advanced tools to verify and secure your cryptocurrency assets
        </motion.p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card-wrapper"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            custom={0.2 + index * 0.1}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Card icon={feature.icon} title={feature.title} variant="elevated">
              <p>{feature.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Features
