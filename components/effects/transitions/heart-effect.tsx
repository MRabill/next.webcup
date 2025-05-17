"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function HeartEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create hearts
    const heartCount = 100
    const hearts: any[] = []

    // Heart drawing function
    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      ctx.save()
      ctx.beginPath()
      ctx.translate(x, y)
      ctx.scale(size, size)

      // Heart shape
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(-0.5, -0.3, -1, 0.1, -0.5, 0.5)
      ctx.bezierCurveTo(-0.1, 0.8, 0, 1, 0, 1)
      ctx.bezierCurveTo(0, 1, 0.1, 0.8, 0.5, 0.5)
      ctx.bezierCurveTo(1, 0.1, 0.5, -0.3, 0, 0)

      ctx.fillStyle = color
      ctx.fill()
      ctx.restore()
    }

    // Create heart particles
    for (let i = 0; i < heartCount; i++) {
      const size = Math.random() * 20 + 10
      hearts.push({
        x: Math.random() * canvas.width,
        y: canvas.height + size,
        size: size,
        color: `rgba(${Math.floor(Math.random() * 55 + 200)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 100)}, ${Math.random() * 0.5 + 0.5})`,
        velocity: {
          x: Math.random() * 2 - 1,
          y: -Math.random() * 3 - 2,
        },
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        opacity: Math.random() * 0.5 + 0.5,
        scale: 0,
      })
    }

    // Play sound effect
    const audio = new Audio("/sounds/heart-beat.mp3")
    audio.volume = 0.3
    audio.play().catch((err) => console.error("Failed to play sound:", err))

    // Animation loop
    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add pink overlay
      ctx.fillStyle = "rgba(236, 72, 153, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < hearts.length; i++) {
        const heart = hearts[i]

        // Update heart position
        heart.x += heart.velocity.x
        heart.y += heart.velocity.y
        heart.rotation += heart.rotationSpeed

        // Grow hearts
        if (heart.scale < 1) {
          heart.scale += 0.02
        }

        // Add floating effect
        heart.velocity.x += Math.random() * 0.2 - 0.1
        heart.velocity.y += 0.01 // slight gravity

        // Fade out when reaching top
        if (heart.y < canvas.height * 0.2) {
          heart.opacity -= 0.01
        }

        // Draw heart
        ctx.save()
        ctx.globalAlpha = heart.opacity * heart.scale
        ctx.translate(heart.x, heart.y)
        ctx.rotate((heart.rotation * Math.PI) / 180)
        drawHeart(ctx, 0, 0, heart.size * 0.05 * heart.scale, heart.color)
        ctx.restore()

        // Reset heart when it fades out
        if (heart.opacity <= 0 || heart.y < -50) {
          heart.y = canvas.height + heart.size
          heart.x = Math.random() * canvas.width
          heart.opacity = Math.random() * 0.5 + 0.5
          heart.scale = 0
        }
      }

      animationFrame = requestAnimationFrame(animate)
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
