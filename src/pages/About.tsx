import { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import { useInView } from 'react-intersection-observer'

const About = () => {
  useEffect(() => {
    document.title = 'About Us - Coinauthenticator'
  }, [])

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const headerAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 300, friction: 20 }
  })

  const contentAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 300, friction: 20 },
    delay: 200
  })

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
      <div ref={ref} className="about-header">
        <animated.h1 style={headerAnimation}>About Coinauthenticator</animated.h1>
        <animated.p style={headerAnimation} className="page-subtitle">
          Our mission is to make cryptocurrency safer for everyone
        </animated.p>
      </div>

      <animated.div style={contentAnimation} className="about-content">
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
            <div className="mission-value">
              <h3>Security First</h3>
              <p>
                We believe that security is the foundation of a healthy cryptocurrency ecosystem. 
                We're committed to providing the most accurate, comprehensive security analysis 
                available.
              </p>
            </div>
            <div className="mission-value">
              <h3>Transparency</h3>
              <p>
                We believe in full transparency about how we verify tokens and evaluate security 
                risks. Our methodology is always available for review.
              </p>
            </div>
            <div className="mission-value">
              <h3>Education</h3>
              <p>
                We're dedicated to educating users about cryptocurrency security and helping them 
                develop the skills to identify potential risks on their own.
              </p>
            </div>
            <div className="mission-value">
              <h3>Innovation</h3>
              <p>
                As cryptocurrency technology evolves, so do the methods used by scammers. We're 
                constantly innovating to stay ahead of new threats.
              </p>
            </div>
          </div>
        </div>

        <div className="about-team">
          <h2>Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="team-member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3 className="team-member-name">{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </animated.div>
    </main>
  )
}

export default About