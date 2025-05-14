import { useEffect } from 'react'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import HowItWorks from '../components/home/HowItWorks'
import Testimonials from '../components/home/Testimonials'
import CTASection from '../components/home/CTASection'

const Home = () => {
  useEffect(() => {
    document.title = 'Coinauthenticator - Secure Cryptocurrency Verification'
  }, [])

  return (
    <main className="home-page">
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </main>
  )
}

export default Home