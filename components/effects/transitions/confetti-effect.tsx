"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function ConfettiEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create confetti particles
    const confettiCount = 200
    const confetti: any[] = []

    const colors = [
      "#facc15", // yellow
      "#fb923c", // orange
      "#f87171", // red
      "#4ade80", // green
      "#60a5fa", // blue
      "#c084fc", // purple
      "#f472b6", // pink
    ]

    const shapes = ["circle", "square", "triangle", "line"]

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        velocity: {
          x: Math.random() * 6 - 3,
          y: Math.random() * 3 + 2,
        },
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        opacity: 1,
      })
    }

    // Play sound effect
    const audio = new Audio("/sounds/confetti-pop.mp3")
    audio.volume = 0.3
    audio.play().catch((err) => console.error("Failed to play sound:", err))

    // Animation loop
    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let stillActive = false

      for (let i = 0; i < confetti.length; i++) {
        const p = confetti[i]

        p.x += p.velocity.x
        p.y += p.velocity.y
        p.rotation += p.rotationSpeed

        // Add gravity and wind
        p.velocity.y += 0.1
        p.velocity.x += Math.random() * 0.1 - 0.05

        // Fade out when reaching bottom
        if (p.y > canvas.height * 0.7) {
          p.opacity -= 0.01
        }

        if (p.opacity > 0) {
          stillActive = true

          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.globalAlpha = p.opacity
          ctx.fillStyle = p.color

          // Draw different shapes
          if (p.shape === "square") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
          } else if (p.shape === "circle") {
            ctx.beginPath()
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
            ctx.fill()
          } else if (p.shape === "triangle") {
            ctx.beginPath()
            ctx.moveTo(0, -p.size / 2)
            ctx.lineTo(p.size / 2, p.size / 2)
            ctx.lineTo(-p.size / 2, p.size / 2)
            ctx.closePath()
            ctx.fill()
          } else if (p.shape === "line") {
            ctx.lineWidth = p.size / 4
            ctx.strokeStyle = p.color
            ctx.beginPath()
            ctx.moveTo(-p.size / 2, 0)
            ctx.lineTo(p.size / 2, 0)
            ctx.stroke()
          }

          ctx.restore()
        }
      }

      if (stillActive) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
      audio.pause()
      audio.src = ""
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}
