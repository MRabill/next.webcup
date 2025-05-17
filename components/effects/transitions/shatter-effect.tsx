"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function ShatterEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create glass shards
    const shardCount = 150
    const shards: any[] = []

    // Center point of the shatter
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Create shards
    for (let i = 0; i < shardCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 50 + 50

      // Create a triangular shard
      const shard = {
        x: centerX,
        y: centerY,
        targetX: centerX + Math.cos(angle) * distance * (canvas.width / 1000),
        targetY: centerY + Math.sin(angle) * distance * (canvas.height / 1000),
        size: Math.random() * 30 + 10,
        angle: angle,
        rotationSpeed: Math.random() * 10 - 5,
        rotation: Math.random() * 360,
        opacity: 1,
        vertices: [
          { x: -Math.random() * 20 - 5, y: -Math.random() * 20 - 5 },
          { x: Math.random() * 20 + 5, y: -Math.random() * 10 - 5 },
          { x: Math.random() * 15, y: Math.random() * 20 + 5 },
        ],
        color: `rgba(255, ${Math.floor(Math.random() * 100 + 50)}, ${Math.floor(Math.random() * 50)}, ${Math.random() * 0.3 + 0.7})`,
        velocity: {
          x: 0,
          y: 0,
        },
        gravity: Math.random() * 0.2 + 0.1,
      }

      shards.push(shard)
    }

    // Play sound effect
    const audio = new Audio("/sounds/glass-break.mp3")
    audio.volume = 0.4
    audio.play().catch((err) => console.error("Failed to play sound:", err))

    // Animation loop
    let animationFrame: number
    let progress = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add red overlay
      ctx.fillStyle = "rgba(220, 38, 38, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update progress
      progress += 0.01

      for (let i = 0; i < shards.length; i++) {
        const shard = shards[i]

        // Accelerate shards outward
        if (progress < 1) {
          shard.x = centerX + (shard.targetX - centerX) * progress * progress * 10
          shard.y = centerY + (shard.targetY - centerY) * progress * progress * 10
        } else {
          // Apply gravity after initial explosion
          shard.velocity.y += shard.gravity
          shard.x += shard.velocity.x
          shard.y += shard.velocity.y
        }

        shard.rotation += shard.rotationSpeed

        // Fade out shards
        if (progress > 0.5) {
          shard.opacity -= 0.01
        }

        // Draw shard
        if (shard.opacity > 0) {
          ctx.save()
          ctx.translate(shard.x, shard.y)
          ctx.rotate((shard.rotation * Math.PI) / 180)
          ctx.globalAlpha = shard.opacity

          // Draw triangular shard
          ctx.beginPath()
          ctx.moveTo(shard.vertices[0].x, shard.vertices[0].y)
          ctx.lineTo(shard.vertices[1].x, shard.vertices[1].y)
          ctx.lineTo(shard.vertices[2].x, shard.vertices[2].y)
          ctx.closePath()

          // Add gradient to make it look like glass
          const gradient = ctx.createLinearGradient(
            shard.vertices[0].x,
            shard.vertices[0].y,
            shard.vertices[2].x,
            shard.vertices[2].y,
          )
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
          gradient.addColorStop(1, shard.color)

          ctx.fillStyle = gradient
          ctx.fill()

          // Add edge highlight
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
          ctx.lineWidth = 0.5
          ctx.stroke()

          ctx.restore()
        }
      }

      // Stop animation when all shards are invisible
      let allInvisible = true
      for (let i = 0; i < shards.length; i++) {
        if (shards[i].opacity > 0) {
          allInvisible = false
          break
        }
      }

      if (!allInvisible) {
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
