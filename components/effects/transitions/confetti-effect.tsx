"use client"

import { useEffect, useState, useRef } from "react"

interface FunnyAnimationProps {
  isActive: boolean
  onComplete?: () => void
}

export function FunnyAnimation({ isActive, onComplete }: FunnyAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [emojis, setEmojis] = useState<Array<{ emoji: string; style: React.CSSProperties }>>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)

  // Confetti particles
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      size: number
      color: string
      velocity: { x: number; y: number }
      rotation: number
      rotationSpeed: number
    }>
  >([])

  // Colors for confetti
  const colors = ["#FF577F", "#FF884B", "#FFBD9B", "#F9F871", "#7ED7C1", "#DC84F3", "#BFEA7C", "#FFCF96"]
  const emojiList = ["😂", "🎉", "🎊", "👋", "😁", "🤣", "👍"]

  // Initialize emojis
  useEffect(() => {
    if (isActive) {
      const newEmojis = Array.from({ length: 10 }, () => ({
        emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          fontSize: `${Math.random() * 2 + 1}rem`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${3 + Math.random() * 5}s`,
        },
      }))
      setEmojis(newEmojis)
    }
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      setShowConfetti(true)

      // Play confetti pop sound
      if (audioRef.current) {
        audioRef.current.volume = 0.5
        audioRef.current.play().catch((e) => {
          console.error("Audio play failed:", e)
          // Continue with animation even if audio fails
        })
      }

      // Initialize confetti particles
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // Create particles
        particlesRef.current = Array.from({ length: 200 }, () => ({
          x: canvas.width / 2,
          y: canvas.height / 2,
          size: Math.random() * 10 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          velocity: {
            x: (Math.random() - 0.5) * 15,
            y: (Math.random() - 0.5) * 15 - 3, // Mostly upward
          },
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 5,
        }))

        // Start animation
        animateConfetti()
      }

      // Clean up after a while
      const timeout = setTimeout(() => {
        setShowConfetti(false)
        if (onComplete) onComplete()
      }, 5000)

      return () => {
        clearTimeout(timeout)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      }
    } else {
      setShowConfetti(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, onComplete])

  const animateConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      // Apply gravity
      particle.velocity.y += 0.1

      // Update position
      particle.x += particle.velocity.x
      particle.y += particle.velocity.y

      // Update rotation
      particle.rotation += particle.rotationSpeed

      // Draw particle
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate((particle.rotation * Math.PI) / 180)
      ctx.fillStyle = particle.color

      // Draw different shapes
      if (index % 3 === 0) {
        // Rectangle
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
      } else if (index % 3 === 1) {
        // Circle
        ctx.beginPath()
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Triangle
        ctx.beginPath()
        ctx.moveTo(0, -particle.size / 2)
        ctx.lineTo(particle.size / 2, particle.size / 2)
        ctx.lineTo(-particle.size / 2, particle.size / 2)
        ctx.closePath()
        ctx.fill()
      }

      ctx.restore()

      // Remove particles that are off screen
      if (particle.y > canvas.height) {
        particlesRef.current[index] = {
          ...particle,
          y: -particle.size,
          x: Math.random() * canvas.width,
        }
      }
    })

    // Continue animation
    animationRef.current = requestAnimationFrame(animateConfetti)
  }

  if (!isActive && !showConfetti) {
    return null
  }

  return (
    <>
      <audio ref={audioRef} src="/sounds/confetti-pop.mp3" preload="auto" />

      <div className="fixed inset-0 pointer-events-none z-50">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Bouncing elements effect */}
        <div className="absolute inset-0 overflow-hidden">
          {emojis.map((item, i) => (
            <div
              key={i}
              className="absolute animate-bounce-around"
              style={item.style}
            >
              {item.emoji}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
