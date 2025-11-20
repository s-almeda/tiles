'use client'

import { useEffect, useState, useRef } from 'react'

interface SpriteProps {
  name: string
  frames: number[]
  height: number
  fps?: number // frames per second, default 10
  loop?: boolean // whether to loop the animation, default true
  onMouseDownAnimation?: { name: string; frames: number[]; loop?: boolean }
  onMouseUpAnimation?: { name: string; frames: number[]; loop?: boolean }
}

export default function Sprite({ 
  name, 
  frames, 
  height, 
  fps = 10, 
  loop = true,
  onMouseDownAnimation,
  onMouseUpAnimation
}: SpriteProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [animationState, setAnimationState] = useState<'idle' | 'mousedown' | 'holding' | 'mouseup'>('idle')
  const animationCompleteRef = useRef(false)

  // Determine current animation based on state
  const getCurrentAnimation = () => {
    if (animationState === 'idle') {
      return { name, frames, loop }
    } else if (animationState === 'mousedown' && onMouseDownAnimation) {
      return { 
        name: onMouseDownAnimation.name, 
        frames: onMouseDownAnimation.frames, 
        loop: onMouseDownAnimation.loop ?? false 
      }
    } else if (animationState === 'holding' && onMouseDownAnimation) {
      // Hold on last frame of onMouseDown animation
      return { 
        name: onMouseDownAnimation.name, 
        frames: [onMouseDownAnimation.frames[onMouseDownAnimation.frames.length - 1]],
        loop: true 
      }
    } else if (animationState === 'mouseup' && onMouseUpAnimation) {
      return { 
        name: onMouseUpAnimation.name, 
        frames: onMouseUpAnimation.frames, 
        loop: onMouseUpAnimation.loop ?? false 
      }
    }
    // Default fallback
    return { name, frames, loop }
  }

  const currentAnimation = getCurrentAnimation()

  // Handle mouse down
  const handleMouseDown = () => {
    if (onMouseDownAnimation) {
      setIsMouseDown(true)
      setAnimationState('mousedown')
      setCurrentFrameIndex(0)
      animationCompleteRef.current = false
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    if (onMouseUpAnimation && isMouseDown) {
      setIsMouseDown(false)
      setAnimationState('mouseup')
      setCurrentFrameIndex(0)
      animationCompleteRef.current = false
    }
  }

  // Animation frame advancement
  useEffect(() => {
    if (currentAnimation.frames.length === 0) return

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => {
        const nextIndex = prev + 1

        // Check if animation is complete
        if (nextIndex >= currentAnimation.frames.length) {
          if (currentAnimation.loop) {
            return 0 // Loop back
          } else {
            // Animation complete - transition to next state
            animationCompleteRef.current = true
            
            if (animationState === 'mousedown') {
              setAnimationState('holding')
              return 0
            } else if (animationState === 'mouseup') {
              setAnimationState('idle')
              return 0
            }
            
            return prev // Stay on last frame
          }
        }
        
        return nextIndex
      })
    }, 1000 / fps)

    return () => clearInterval(interval)
  }, [currentAnimation.frames.length, currentAnimation.loop, fps, animationState])

  if (currentAnimation.frames.length === 0) return null

  const currentFrame = currentAnimation.frames[currentFrameIndex]
  const imageSrc = `/sprites/${currentAnimation.name}_${currentFrame}.png`

  return (
    <img
      src={imageSrc}
      alt={`${currentAnimation.name} sprite frame ${currentFrame}`}
      className="pixel-perfect"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Release if mouse leaves while holding
      style={{
        height: `${height}px`,
        imageRendering: 'pixelated',
        width: 'auto',
        cursor: onMouseDownAnimation ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    />
  )
}
