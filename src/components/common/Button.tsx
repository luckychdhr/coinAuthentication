import { Link } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { useState } from 'react'

interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'small' | 'medium' | 'large'
  path?: string
  onClick?: () => void
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const Button = ({
  label,
  variant = 'primary',
  size = 'medium',
  path,
  onClick,
  fullWidth = false,
  type = 'button',
  disabled = false
}: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const buttonAnimation = useSpring({
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0px)',
    opacity: isHovered ? 1 : 0.8,
    config: { tension: 300, friction: 20 }
  })

  // Construct the box shadow separately using the animated opacity value
  const shadowStyle = {
    ...buttonAnimation,
    boxShadow: buttonAnimation.opacity.to(
      opacity => `0 ${isHovered ? '6px 20px' : '2px 5px'} rgba(255, 215, 0, ${opacity})`
    )
  }

  const className = `
    button 
    button-${variant} 
    button-${size}
    ${fullWidth ? 'button-full-width' : ''}
    ${disabled ? 'button-disabled' : ''}
  `

  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  if (path) {
    return (
      <Link to={path}>
        <animated.button
          style={shadowStyle}
          className={className}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
        >
          {label}
        </animated.button>
      </Link>
    )
  }

  return (
    <animated.button
      style={shadowStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      type={type}
      disabled={disabled}
    >
      {label}
    </animated.button>
  )
}

export default Button