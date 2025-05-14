import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

const quoteVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.4 } }
}

const titleVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="testimonials-section">
      <motion.h2
        className="section-title"
        variants={titleVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        What Our Users Say
      </motion.h2>

      <div className="testimonials-container">
        <button
          className="testimonial-nav-button prev"
          onClick={prevTestimonial}
          aria-label="Previous testimonial"
        >
          <FaArrowLeft />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="testimonial"
            variants={quoteVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="testimonial-quote-icon" style={{ color: '#FFD700' }}>
              <FaQuoteLeft />
            </div>
            <p className="testimonial-text">{testimonials[currentIndex].quote}</p>
            <div className="testimonial-author">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].author}
                className="testimonial-author-image"
              />
              <div className="testimonial-author-info">
                <h4 className="testimonial-author-name">{testimonials[currentIndex].author}</h4>
                <p className="testimonial-author-position">{testimonials[currentIndex].position}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

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
