import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/common/LoadingSpinner'
import ScrollToTop from './components/common/ScrollToTop'
import { ThemeProvider } from './context/ThemeContext'
import './styles/global.css'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Verify = lazy(() => import('./pages/Verify'))
const Features = lazy(() => import('./pages/Features'))
const Pricing = lazy(() => import('./pages/Pricing'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </ThemeProvider>
  )
}

export default App