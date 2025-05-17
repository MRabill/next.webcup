"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create raindrops
    const rainCount = 200
    const raindrops: any[] = []

    for (let i = 0; i < rainCount; i++) {
      raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        length: Math.random() * 20 + 10,
        velocity: Math.random() * 10 + 15,
        thickness: Math.random() * 2 + 1,
        color: `rgba(120, 160, 255, ${Math.random() * 0.3 + 0.2})`,
        splashed: false,
        splashSize: 0,
        splashOpacity: 1,
      })
    }

    // Play sound effect
    const audio = new Audio("/sounds/rain-ambient.mp3")
    audio.volume = 0.2
    audio.loop = true
    audio.play().catch((err) => console.error("Failed to play sound:", err))

    // Animation loop
    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add blue overlay
      ctx.fillStyle = "rgba(30, 64, 175, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < raindrops.length; i++) {
        const drop = raindrops[i]

        // Update raindrop position
        drop.y += drop.velocity

        // Draw raindrop
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.lineWidth = drop.thickness
        ctx.strokeStyle = drop.color
        ctx.stroke()

        // Create splash when raindrop hits bottom
        if (drop.y > canvas.height && !drop.splashed) {
          drop.splashed = true
          drop.splashSize = 0
          drop.splashOpacity = 1
        }

        // Draw and update splash
        if (drop.splashed) {
          ctx.beginPath()
          ctx.arc(drop.x, canvas.height, drop.splashSize, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(120, 160, 255, ${drop.splashOpacity})`
          ctx.lineWidth = 1
          ctx.stroke()

          drop.splashSize += 0.5
          drop.splashOpacity -= 0.05

          // Reset raindrop when splash is done
          if (drop.splashOpacity <= 0) {
            drop.y = Math.random() * canvas.height - canvas.height
            drop.x = Math.random() * canvas.width
            drop.splashed = false
          }
        }

        // Reset raindrop when it goes off screen
        if (drop.y > canvas.height + 100 && !drop.splashed) {
          drop.y = Math.random() * canvas.height - canvas.height
          drop.x = Math.random() * canvas.width
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    // Fade out audio after 3 seconds
    const fadeOutTimer = setTimeout(() => {
      const fadeInterval = setInterval(() => {
        if (audio.volume > 0.01) {
          audio.volume -= 0.01
        } else {
          clearInterval(fadeInterval)
          audio.pause()
        }
      }, 50)
    }, 3000)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(fadeOutTimer)
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
