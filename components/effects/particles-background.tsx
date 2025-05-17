"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"

interface ParticlesBackgroundProps {
  mood?: string
  intensity?: "low" | "medium" | "high"
  className?: string
}

export default function ParticlesBackground({
  mood = "default",
  intensity = "medium",
  className = "",
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const animationFrameRef = useRef<number>(0)
  const particlesRef = useRef<any[]>([])
  const controls = useAnimation()

  // Set particle count based on intensity
  const getParticleCount = () => {
    switch (intensity) {
      case "low":
        return 30
      case "medium":
        return 60
      case "high":
        return 120
      default:
        return 60
    }
  }

  // Get particle color based on mood
  const getParticleColor = (mood: string) => {
    switch (mood) {
      case "heartfelt":
        return ["#ec4899", "#d946ef", "#c026d3"]
      case "rage":
        return ["#ef4444", "#f97316", "#f59e0b"]
      case "funny":
        return ["#facc15", "#fb923c", "#fbbf24"]
      case "sad":
        return ["#3b82f6", "#6366f1", "#8b5cf6"]
      case "calm":
        return ["#10b981", "#14b8a6", "#06b6d4"]
      case "robotic":
        return ["#94a3b8", "#64748b", "#475569"]
      default:
        return ["#a855f7", "#8b5cf6", "#6366f1"]
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
        canvas.width = width
        canvas.height = height
        setDimensions({ width, height })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Initialize particles
    const colors = getParticleColor(mood)
    const particleCount = getParticleCount()
    const particles: any[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
        },
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    particlesRef.current = particles

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.velocity.x
        p.y += p.velocity.y

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.velocity.x *= -1
        if (p.y < 0 || p.y > canvas.height) p.velocity.y *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace("rgb", "rgba").replace(")", `, ${p.opacity})`)
        ctx.fill()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [mood, intensity])

  // Animate in when mood changes
  useEffect(() => {
    controls.start({
      opacity: 1,
      transition: { duration: 1 },
    })
  }, [mood, controls])

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={controls}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}
