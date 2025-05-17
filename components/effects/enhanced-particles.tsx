"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface EnhancedParticlesProps {
  mood?: string
  intensity?: "low" | "medium" | "high"
  className?: string
}

export default function EnhancedParticles({
  mood = "default",
  intensity = "medium",
  className = "",
}: EnhancedParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const particlesRef = useRef<any[]>([])
  const { theme } = useTheme()

  // Set particle count based on intensity
  const getParticleCount = () => {
    switch (intensity) {
      case "low":
        return 40
      case "medium":
        return 80
      case "high":
        return 150
      default:
        return 80
    }
  }

  // Get particle color based on mood and theme
  const getParticleColor = (mood: string, theme: string | undefined) => {
    const isDark = theme !== "light"

    const colors = {
      heartfelt: isDark ? ["#ec4899", "#d946ef", "#c026d3"] : ["#db2777", "#c026d3", "#a21caf"],
      rage: isDark ? ["#ef4444", "#f97316", "#f59e0b"] : ["#dc2626", "#ea580c", "#d97706"],
      funny: isDark ? ["#facc15", "#fb923c", "#fbbf24"] : ["#eab308", "#f97316", "#f59e0b"],
      sad: isDark ? ["#3b82f6", "#6366f1", "#8b5cf6"] : ["#2563eb", "#4f46e5", "#7c3aed"],
      calm: isDark ? ["#10b981", "#14b8a6", "#06b6d4"] : ["#059669", "#0d9488", "#0891b2"],
      robotic: isDark ? ["#94a3b8", "#64748b", "#475569"] : ["#64748b", "#475569", "#334155"],
      default: isDark ? ["#a855f7", "#8b5cf6", "#6366f1"] : ["#9333ea", "#7c3aed", "#4f46e5"],
    }

    return colors[mood as keyof typeof colors] || colors.default
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
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Initialize particles
    const colors = getParticleColor(mood, theme)
    const particleCount = getParticleCount()
    const particles: any[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() * canvas.width) / window.devicePixelRatio,
        y: (Math.random() * canvas.height) / window.devicePixelRatio,
        radius: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 0.7,
          y: (Math.random() - 0.5) * 0.7,
        },
        opacity: Math.random() * 0.5 + 0.2,
        pulse: {
          speed: Math.random() * 0.02 + 0.01,
          offset: Math.random() * Math.PI * 2,
        },
      })
    }

    particlesRef.current = particles

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.velocity.x
        p.y += p.velocity.y

        // Pulse effect
        const pulse = Math.sin(Date.now() * p.pulse.speed + p.pulse.offset) * 0.5 + 0.5
        const currentRadius = p.radius * (0.8 + pulse * 0.4)
        const currentOpacity = p.opacity * (0.8 + pulse * 0.4)

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width / window.devicePixelRatio) p.velocity.x *= -1
        if (p.y < 0 || p.y > canvas.height / window.devicePixelRatio) p.velocity.y *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace("rgb", "rgba").replace(")", `, ${currentOpacity})`)
        ctx.fill()

        // Draw glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius * 2)
        gradient.addColorStop(0, p.color.replace("rgb", "rgba").replace(")", `, ${currentOpacity * 0.3})`))
        gradient.addColorStop(1, p.color.replace("rgb", "rgba").replace(")", ", 0)"))

        ctx.beginPath()
        ctx.arc(p.x, p.y, currentRadius * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [mood, intensity, theme])

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}
