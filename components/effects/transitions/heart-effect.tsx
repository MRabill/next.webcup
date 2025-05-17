"use client"

import { useEffect, useState, useRef } from "react"

interface HeartfeltAnimationProps {
  isActive: boolean
  onComplete?: () => void
}

export function HeartfeltAnimation({ isActive, onComplete }: HeartfeltAnimationProps) {
  const [showHearts, setShowHearts] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)

  // Hearts
  const heartsRef = useRef<
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

  // Colors for hearts
  const colors = ["#FF577F", "#FF84B7", "#FFA6C1", "#FFCCD5", "#FF4D6D", "#FF758F", "#FF8FA3", "#FFB3C1"]

  useEffect(() => {
    if (isActive) {
      setShowHearts(true)

      // Play heartfelt music
      if (audioRef.current) {
        audioRef.current.volume = 0.4
        audioRef.current.play().catch((e) => console.error("Audio play failed:", e))
      }

      // Initialize hearts animation
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // Create hearts
        heartsRef.current = Array.from({ length: 50 }, () => ({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 100,
          size: Math.random() * 20 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: -Math.random() * 3 - 1, // Upward
          },
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 2,
        }))

        // Start animation
        animateHearts()
      }

      // Clean up after a while
      const timeout = setTimeout(() => {
        setShowHearts(false)
        if (onComplete) onComplete()
      }, 8000)

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
      setShowHearts(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, onComplete])

  const animateHearts = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw hearts
    heartsRef.current.forEach((heart, index) => {
      // Update position
      heart.x += heart.velocity.x
      heart.y += heart.velocity.y

      // Add some wobble
      heart.x += Math.sin(Date.now() / 1000 + index) * 0.5

      // Update rotation
      heart.rotation += heart.rotationSpeed

      // Draw heart
      ctx.save()
      ctx.translate(heart.x, heart.y)
      ctx.rotate((heart.rotation * Math.PI) / 180)
      ctx.fillStyle = heart.color

      // Draw heart shape
      ctx.beginPath()
      const topCurveHeight = heart.size * 0.3
      ctx.moveTo(0, heart.size * 0.2)
      // Left curve
      ctx.bezierCurveTo(-heart.size / 2, -topCurveHeight, -heart.size, heart.size / 3, 0, heart.size)
      // Right curve
      ctx.bezierCurveTo(heart.size, heart.size / 3, heart.size / 2, -topCurveHeight, 0, heart.size * 0.2)
      ctx.closePath()
      ctx.fill()

      ctx.restore()

      // Reset hearts that are off screen
      if (heart.y < -heart.size) {
        heartsRef.current[index] = {
          ...heart,
          y: canvas.height + heart.size,
          x: Math.random() * canvas.width,
        }
      }
    })

    // Continue animation
    animationRef.current = requestAnimationFrame(animateHearts)
  }

  if (!isActive && !showHearts) {
    return null
  }

  return (
    <>
      <audio ref={audioRef} src="/sounds/warm.mp3" />

      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Soft glow overlay */}
        <div className="absolute inset-0 bg-pink-500/5 animate-pulse-slow" />

        {/* Hearts canvas */}
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </>
  )
}

export default HeartfeltAnimation
