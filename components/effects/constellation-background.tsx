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
}

export default function ConstellationBackground({
  dotColor = "rgba(255, 255, 255, 0.8)",
  lineColor = "rgba(255, 255, 255, 0.15)",
  dotCount = 70,
  maxDistance = 160,
  speed = 0.5,
  className = "",
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const animationFrameRef = useRef<number>(0)
  const dotsRef = useRef<any[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    // Adjust colors based on theme
    if (theme === "light") {
      dotColor = "rgba(0, 0, 0, 0.5)"
      lineColor = "rgba(0, 0, 0, 0.1)"
    } else {
      dotColor = "rgba(255, 255, 255, 0.8)"
      lineColor = "rgba(255, 255, 255, 0.15)"
    }
  }, [theme])

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

    // Initialize dots
    const dots: any[] = []
    for (let i = 0; i < dotCount; i++) {
      const size = Math.random() * 2 + 1
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: size,
        originalRadius: size,
        color: dotColor,
        velocity: {
          x: (Math.random() - 0.5) * speed,
          y: (Math.random() - 0.5) * speed,
        },
        hovered: false,
      })
    }
    dotsRef.current = dots

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const mouseRadius = 100

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    })

    canvas.addEventListener("mouseleave", () => {
      mouseX = -1000
      mouseY = -1000
    })

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Update and draw dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]

        // Move dots
        dot.x += dot.velocity.x
        dot.y += dot.velocity.y

        // Bounce off edges
        if (dot.x < 0 || dot.x > canvas.width / window.devicePixelRatio) dot.velocity.x *= -1
        if (dot.y < 0 || dot.y > canvas.height / window.devicePixelRatio) dot.velocity.y *= -1

        // Check mouse proximity
        const dx = mouseX - dot.x
        const dy = mouseY - dot.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouseRadius) {
          dot.radius = dot.originalRadius * (1 + (mouseRadius - distance) / mouseRadius)
          dot.hovered = true
        } else {
          dot.radius = dot.originalRadius
          dot.hovered = false
        }

        // Draw dot
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = dot.color
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < dots.length; j++) {
          const otherDot = dots[j]
          const dx = dot.x - otherDot.x
          const dy = dot.y - otherDot.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.moveTo(dot.x, dot.y)
            ctx.lineTo(otherDot.x, otherDot.y)
            ctx.strokeStyle = lineColor
            ctx.globalAlpha = 1 - distance / maxDistance
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [dotColor, lineColor, dotCount, maxDistance, speed])

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
