import { ReactNode } from 'react'
import { useSpring, animated } from 'react-spring'
import { useInView } from 'react-intersection-observer'

interface CardProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
}

const Card = ({
  title,
  subtitle,
  icon,
  children,
  variant = 'default'
}: CardProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const cardAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 300, friction: 20, delay: 100 }
  })

  return (
    <animated.div
      ref={ref}
      style={cardAnimation}
      className={`card card-${variant}`}
    >
      {(icon || title || subtitle) && (
        <div className="card-header">
          {icon && <div className="card-icon">{icon}</div>}
          <div className="card-titles">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="card-content">{children}</div>
    </animated.div>
  )
}

export default Card