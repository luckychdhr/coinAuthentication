import { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { useInView } from 'react-intersection-observer'
import { FaQuoteLeft, FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const testimonials = [
  {
    quote: "Coinauthenticator helped me avoid a major scam by identifying a fraudulent token before I invested. The detailed security report saved me thousands.",
    author: "Michael R.",
    position: "Crypto Investor",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
  },
  {
    quote: "As a crypto fund manager, I need reliable verification tools. Coinauthenticator provides the fastest and most accurate token authentication service I've used.",
    author: "Sarah L.",
    position: "Fund Manager",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
  },
  {
    quote: "The real-time market analysis combined with security verification makes this platform essential for any serious cryptocurrency trader.",
    author: "David K.",
    position: "Day Trader",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
  }
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const titleAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 300, friction: 20 },
    delay: 100
  })
  
  const testimonialAnimation = useSpring({
    opacity: 1,
    transform: 'translateX(0)',
    from: { opacity: 0, transform: 'translateX(50px)' },
    reset: true,
    config: { tension: 300, friction: 20 }
  })

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section ref={ref} className="testimonials-section">
      <animated.h2 style={titleAnimation} className="section-title">
        What Our Users Say
      </animated.h2>

      <div className="testimonials-container">
        <button 
          className="testimonial-nav-button prev"
          onClick={prevTestimonial}
          aria-label="Previous testimonial"
        >
          <FaArrowLeft />
        </button>

        <animated.div 
          style={testimonialAnimation} 
          className="testimonial"
          key={currentIndex}
        >
          <div className="testimonial-quote-icon">
            <FaQuoteLeft />
          </div>
          <p className="testimonial-text">{currentTestimonial.quote}</p>
          <div className="testimonial-author">
            <img 
              src={currentTestimonial.image} 
              alt={currentTestimonial.author} 
              className="testimonial-author-image" 
            />
            <div className="testimonial-author-info">
              <h4 className="testimonial-author-name">{currentTestimonial.author}</h4>
              <p className="testimonial-author-position">{currentTestimonial.position}</p>
            </div>
          </div>
        </animated.div>

        <button 
          className="testimonial-nav-button next"
          onClick={nextTestimonial}
          aria-label="Next testimonial"
        >
          <FaArrowRight />
        </button>
      </div>
      
      <div className="testimonial-indicators">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`testimonial-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Testimonials