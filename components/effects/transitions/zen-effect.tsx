"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function ZenEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create ripples
    const rippleCount = 5
    const ripples: any[] = []

    // Create stars
    const starCount = 200
    const stars: any[] = []

    // Create ripples
    for (let i = 0; i < rippleCount; i++) {
      ripples.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: Math.random() * 200 + 100,
        speed: Math.random() * 2 + 1,
        color: `rgba(20, 184, 166, ${Math.random() * 0.2 + 0.1})`,
        delay: i * 300,
      })
    }

    // Create stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      })
    }

    // Play sound effect
    const audio = new Audio("/sounds/chirping.mp3")
    audio.volume = 0.3
    audio.play().catch((err) => console.error("Failed to play sound:", err))

    // Animation loop
    let animationFrame: number
    const startTime = Date.now()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const currentTime = Date.now()
      const elapsed = currentTime - startTime

      // Add teal overlay
      ctx.fillStyle = "rgba(20, 184, 166, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        // Pulsing effect
        const pulse = Math.sin(elapsed * star.pulseSpeed + star.pulseOffset) * 0.5 + 0.5

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * (0.5 + pulse * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * pulse})`
        ctx.fill()
      }

      // Draw ripples
      for (let i = 0; i < ripples.length; i++) {
        const ripple = ripples[i]

        if (elapsed > ripple.delay) {
          // Expand ripple
          ripple.radius += ripple.speed

          // Fade out as it expands
          const opacity = 1 - ripple.radius / ripple.maxRadius

          if (opacity > 0) {
            ctx.beginPath()
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
            ctx.strokeStyle = ripple.color.replace(/[\d.]+\)$/g, `${opacity})`)
            ctx.lineWidth = 2
            ctx.stroke()
          }

          // Reset ripple when it reaches max size
          if (ripple.radius > ripple.maxRadius) {
            ripple.x = Math.random() * canvas.width
            ripple.y = Math.random() * canvas.height
            ripple.radius = 0
            ripple.delay = elapsed + Math.random() * 1000
          }
        }
      }

      // Stop animation after 3 seconds
      if (elapsed < 3000) {
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
