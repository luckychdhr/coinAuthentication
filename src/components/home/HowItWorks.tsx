import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: 'easeOut' },
  }),
}

const slideLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay, duration: 0.5, ease: 'easeOut' },
  }),
}

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Enter Token Address',
      description:
        'Paste the cryptocurrency contract address or token ID you want to verify.',
    },
    {
      number: '02',
      title: 'Automated Scanning',
      description:
        'Our system scans multiple blockchains and security databases for verification.',
    },
    {
      number: '03',
      title: 'Receive Analysis',
      description:
        'Get a comprehensive report on legitimacy, security risks, and market performance.',
    },
    {
      number: '04',
      title: 'Make Informed Decisions',
      description:
        'Use our detailed insights to make safe cryptocurrency investment decisions.',
    },
  ]

  return (
    <section className="how-it-works-section">
      <div className="section-header">
        <motion.h2
          className="section-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0}
        >
          How It Works
        </motion.h2>

        <motion.p
          className="section-subtitle"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={0.1}
        >
          Verify cryptocurrency legitimacy in four simple steps
        </motion.p>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="step"
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.2 + index * 0.1}
          >
            <div className="step-number">{step.number}</div>
            <div className="step-content">
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
