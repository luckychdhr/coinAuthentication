import { useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { FaCheck } from 'react-icons/fa'
import Button from '../components/common/Button'

const Pricing = () => {
  useEffect(() => {
    document.title = 'Pricing - Coinauthenticator'
  }, [])

  const [annualBilling, setAnnualBilling] = useState(true)

  const headerAnimation = useSpring({
    from: { 
      opacity: 0,
      y: 20 
    },
    to: { 
      opacity: 1,
      y: 0 
    },
    config: { tension: 300, friction: 20 }
  })

  const plans = [
    {
      name: 'Free',
      description: 'Basic verification for casual users',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        'Basic token verification',
        '5 verifications per day',
        'Standard security reports',
        'Community support'
      ]
    },
    {
      name: 'Pro',
      description: 'Advanced features for active investors',
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      popular: true,
      features: [
        'Advanced token verification',
        'Unlimited verifications',
        'Detailed security reports',
        'Market analytics',
        'Email alerts',
        'Priority support'
      ]
    },
    {
      name: 'Enterprise',
      description: 'Complete solution for professional traders',
      monthlyPrice: 49.99,
      annualPrice: 499.99,
      features: [
        'Premium token verification',
        'Unlimited verifications',
        'In-depth security analysis',
        'Advanced market analytics',
        'Custom alerts and notifications',
        'API access',
        'Dedicated support',
        'Team accounts'
      ]
    }
  ]

  return (
    <main className="pricing-page">
      <animated.div style={{ 
        opacity: headerAnimation.opacity,
        transform: headerAnimation.y.to(y => `translateY(${y}px)`)
      }} className="page-header">
        <h1>Pricing Plans</h1>
        <p className="page-subtitle">
          Choose the plan that's right for your crypto investment needs
        </p>

        <div className="billing-toggle">
          <span className={!annualBilling ? 'active' : ''}>Monthly</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={annualBilling}
              onChange={() => setAnnualBilling(!annualBilling)}
            />
            <span className="slider"></span>
          </label>
          <span className={annualBilling ? 'active' : ''}>
            Annual <span className="discount">Save 20%</span>
          </span>
        </div>
      </animated.div>

      <div className="pricing-plans">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <div className="plan-header">
              <h2 className="plan-name">{plan.name}</h2>
              <p className="plan-description">{plan.description}</p>
            </div>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">
                {annualBilling
                  ? Math.floor(plan.annualPrice / 12)
                  : plan.monthlyPrice}
              </span>
              <span className="period">
                /month
                {annualBilling && <span className="billed-annually"> billed annually</span>}
              </span>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  <FaCheck className="feature-icon" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="plan-action">
              <Button
                label={plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
                variant={plan.popular ? 'primary' : 'outline'}
                size="large"
                fullWidth
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I upgrade or downgrade my plan?</h3>
            <p>
              Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be 
              prorated for the remainder of your billing cycle. When downgrading, changes will 
              take effect at the start of your next billing cycle.
            </p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>
              We accept all major credit cards, PayPal, and several cryptocurrencies including 
              Bitcoin, Ethereum, and USDC.
            </p>
          </div>
          <div className="faq-item">
            <h3>Is there a refund policy?</h3>
            <p>
              Yes, we offer a 14-day money-back guarantee if you're not satisfied with our service. 
              Contact support within 14 days of your purchase to request a refund.
            </p>
          </div>
          <div className="faq-item">
            <h3>Do I need technical knowledge to use the service?</h3>
            <p>
              No, our platform is designed to be user-friendly for both beginners and experienced 
              crypto users. You simply need to paste the token address to get started.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Pricing