"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface ConstellationBackgroundProps {
  dotColor?: string
  lineColor?: string
  dotCount?: number
  maxDistance?: number
  speed?: number
  className?: string
  mood?: string
}

export default function ConstellationBackground({
  dotColor = "rgba(255, 255, 255, 0.8)",
  lineColor = "rgba(255, 255, 255, 0.15)",
  dotCount = 70,
  maxDistance = 160,
  speed = 0.5,
  className = "",
  mood = "default",
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const animationFrameRef = useRef<number>(0)
  const starsRef = useRef<any[]>([])
  const shootingStarsRef = useRef<any[]>([])
  const { theme } = useTheme()

  // Get colors based on mood
  const getMoodColors = (mood: string) => {
    switch (mood) {
      case "angry":
        return {
          dot: "rgba(239, 68, 68, 0.8)", // red-500
          line: "rgba(239, 68, 68, 0.15)",
          glow: "rgba(239, 68, 68, 0.1)"
        }
      case "sad":
        return {
          dot: "rgba(59, 130, 246, 0.8)", // blue-500
          line: "rgba(59, 130, 246, 0.15)",
          glow: "rgba(59, 130, 246, 0.1)"
        }
      case "happy":
        return {
          dot: "rgba(234, 179, 8, 0.8)", // yellow-500
          line: "rgba(234, 179, 8, 0.15)",
          glow: "rgba(234, 179, 8, 0.1)"
        }
      case "sarcastic":
        return {
          dot: "rgba(168, 85, 247, 0.8)", // purple-500
          line: "rgba(168, 85, 247, 0.15)",
          glow: "rgba(168, 85, 247, 0.1)"
        }
      case "grateful":
        return {
          dot: "rgba(34, 197, 94, 0.8)", // green-500
          line: "rgba(34, 197, 94, 0.15)",
          glow: "rgba(34, 197, 94, 0.1)"
        }
      case "dramatic":
        return {
          dot: "rgba(249, 115, 22, 0.8)", // orange-500
          line: "rgba(249, 115, 22, 0.15)",
          glow: "rgba(249, 115, 22, 0.1)"
        }
      default:
        return {
          dot: "rgba(255, 255, 255, 0.8)",
          line: "rgba(255, 255, 255, 0.15)",
          glow: "rgba(255, 255, 255, 0.1)"
        }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      if (canvas) {
        const { width, height } = canvas.getBoundingClientRect()
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        setDimensions({ width, height })
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)

    // Get colors based on mood
    const colors = getMoodColors(mood)

    // Initialize stars (small, twinkling)
    const stars: any[] = []
    for (let i = 0; i < dotCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 1.2,
        baseOpacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.002 + 0.001,
        twinkleOffset: Math.random() * Math.PI * 2,
      })
    }
    starsRef.current = stars

    // Shooting stars
    const shootingStars: any[] = []
    shootingStarsRef.current = shootingStars
    let lastShootingStar = Date.now()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height / window.devicePixelRatio)
      gradient.addColorStop(0, colors.glow)
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Draw stars (twinkling)
      for (let i = 0; i < starsRef.current.length; i++) {
        const star = starsRef.current[i]
        // Twinkle effect
        const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinkleOffset) * 0.4 + 0.6
        ctx.globalAlpha = star.baseOpacity * twinkle
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = colors.dot
        ctx.shadowColor = colors.dot
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      }

      // Draw constellation lines (between close stars)
      for (let i = 0; i < starsRef.current.length; i++) {
        for (let j = i + 1; j < starsRef.current.length; j++) {
          const a = starsRef.current[i]
          const b = starsRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = colors.line
            ctx.globalAlpha = 0.15 * (1 - distance / maxDistance)
            ctx.lineWidth = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      // Shooting stars logic
      // Occasionally add a shooting star
      if (Date.now() - lastShootingStar > 700 + Math.random() * 1200) {
        shootingStarsRef.current.push({
          x: Math.random() * canvas.width * 0.7,
          y: Math.random() * canvas.height * 0.5,
          length: 120 + Math.random() * 60,
          speed: 8 + Math.random() * 4,
          angle: Math.PI / 4 + Math.random() * Math.PI / 8,
          opacity: 1,
        })
        lastShootingStar = Date.now()
      }
      // Draw and update shooting stars
      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const s = shootingStarsRef.current[i]
        ctx.save()
        ctx.globalAlpha = s.opacity
        ctx.strokeStyle = colors.dot
        ctx.shadowColor = colors.dot
        ctx.shadowBlur = 12
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x + Math.cos(s.angle) * s.length, s.y + Math.sin(s.angle) * s.length)
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
        ctx.restore()
        // Move shooting star
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.opacity -= 0.02
        if (s.opacity <= 0) {
          shootingStarsRef.current.splice(i, 1)
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [dotColor, lineColor, dotCount, maxDistance, speed, mood])

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
