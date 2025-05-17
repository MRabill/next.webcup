"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function GlitchEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create glitch lines
    const lineCount = 50
    const lines: any[] = []

    for (let i = 0; i < lineCount; i++) {
      lines.push({
        y: Math.random() * canvas.height,
        width: Math.random() * canvas.width,
        height: Math.random() * 10 + 1,
        x: Math.random() * canvas.width - canvas.width / 2,
        color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.5 + 0.2})`,
        speed: Math.random() * 100 - 50,
        delay: Math.random() * 2000,
      })
    }

    // Create digital noise
    const noiseCount = 500
    const noiseParticles: any[] = []

    for (let i = 0; i < noiseCount; i++) {
      noiseParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.5 + 0.2})`,
        lifespan: Math.random() * 60 + 10,
        life: 0,
      })
    }

    // Play sound effect
    const audio = new Audio("/sounds/digital-glitch.mp3")
    audio.volume = 0.3
    audio.play().catch((err) => console.error("Failed to play sound:", err))

    // Animation loop
    let animationFrame: number
    const startTime = Date.now()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const currentTime = Date.now()
      const elapsed = currentTime - startTime

      // Draw glitch lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        if (elapsed > line.delay) {
          // Move line horizontally
          line.x += line.speed

          // Reset line when it goes off screen
          if (line.x > canvas.width || line.x + line.width < 0) {
            line.x = Math.random() > 0.5 ? -line.width : canvas.width
            line.y = Math.random() * canvas.height
            line.width = Math.random() * canvas.width
            line.height = Math.random() * 10 + 1
            line.speed = Math.random() * 100 - 50
          }

          // Draw line
          ctx.fillStyle = line.color
          ctx.fillRect(line.x, line.y, line.width, line.height)
        }
      }

      // Draw digital noise
      for (let i = 0; i < noiseParticles.length; i++) {
        const particle = noiseParticles[i]

        particle.life++

        // Reset particle when lifespan is reached
        if (particle.life > particle.lifespan) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.size = Math.random() * 3 + 1
          particle.color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.5 + 0.2})`
          particle.life = 0
        }

        // Draw particle
        ctx.fillStyle = particle.color
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
      }

      // Add RGB split effect
      if (Math.random() > 0.9) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Shift red channel
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Shift red channel slightly
          if (i + 4 < data.length) {
            data[i] = data[i + 4]
          }
        }

        ctx.putImageData(imageData, 0, 0)
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
