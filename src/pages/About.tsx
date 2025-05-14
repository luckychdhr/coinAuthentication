import { useEffect } from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: 'easeOut' }
  })
}

const About = () => {
  useEffect(() => {
    document.title = 'About Us - Coinauthenticator'
  }, [])

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former cybersecurity analyst with 10+ years of experience in blockchain technology and cryptocurrency security.',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg'
    },
    {
      name: 'Alex Chen',
      role: 'CTO',
      bio: 'Blockchain developer and security researcher with expertise in smart contract auditing and crypto forensics.',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
    },
    {
      name: 'Marcus Williams',
      role: 'Head of Research',
      bio: 'Market analyst specializing in cryptocurrency trends, token evaluation, and blockchain economics.',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
    },
    {
      name: 'Jessica Lee',
      role: 'Security Lead',
      bio: 'Former security consultant for major exchanges with expertise in identifying crypto scams and vulnerabilities.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    }
  ]

  return (
    <main className="about-page">
      <motion.div
        className="about-header"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h1>About Coinauthenticator</h1>
        <p className="page-subtitle">
          Our mission is to make cryptocurrency safer for everyone
        </p>
      </motion.div>

      <motion.div
        className="about-content"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={0.2}
      >
        <div className="about-story">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Coinauthenticator was founded in 2022 in response to the growing number of cryptocurrency
              scams and fraudulent tokens. Our founder, Sarah Johnson, lost a significant investment in
              a rugpull and vowed to create a solution that would help other investors avoid similar
              experiences.
            </p>
            <p>
              What began as a simple verification tool has evolved into a comprehensive platform that
              combines advanced security analysis with market insights to help cryptocurrency investors
              make safer, more informed decisions.
            </p>
            <p>
              Today, Coinauthenticator is trusted by over 500,000 users worldwide, from individual
              investors to major cryptocurrency funds. We've helped prevent thousands of potential
              scams and protected millions in assets.
            </p>
          </div>
          <div className="story-image">
            <img
              src="https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg"
              alt="Coinauthenticator team working"
            />
          </div>
        </div>

        <div className="about-mission">
          <h2>Our Mission & Values</h2>
          <div className="mission-values">
            {['Security First', 'Transparency', 'Education', 'Innovation'].map((title, i) => (
              <motion.div
                className="mission-value"
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                custom={0.3 + i * 0.1}
              >
                <h3>{title}</h3>
                <p>
                  {{
                    'Security First': `We believe that security is the foundation of a healthy cryptocurrency ecosystem. We're committed to providing the most accurate, comprehensive security analysis available.`,
                    'Transparency': `We believe in full transparency about how we verify tokens and evaluate security risks. Our methodology is always available for review.`,
                    'Education': `We're dedicated to educating users about cryptocurrency security and helping them develop the skills to identify potential risks on their own.`,
                    'Innovation': `As cryptocurrency technology evolves, so do the methods used by scammers. We're constantly innovating to stay ahead of new threats.`
                  }[title]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="about-team">
          <h2>Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-member"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                custom={0.4 + index * 0.1}
              >
                <div className="team-member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-bio">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  )
}

export default About
