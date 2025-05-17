"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Heart, Flame, Laugh, Cloud, Frown, Cpu } from "lucide-react"

interface EffectPreviewProps {
  mood: string
  effects: string[]
}

export default function EffectPreview({ mood, effects }: EffectPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (effects.includes("fire") || effects.includes("rain") || effects.includes("confetti")) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      const handleResize = () => {
        if (canvas) {
          canvas.width = canvas.offsetWidth
          canvas.height = canvas.offsetHeight
        }
      }

      window.addEventListener("resize", handleResize)

      const particles: any[] = []

      if (effects.includes("fire")) {
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            radius: Math.random() * 3 + 1,
            color: `hsl(${Math.random() * 30 + 15}, 100%, 50%)`,
            velocity: {
              x: Math.random() * 2 - 1,
              y: -Math.random() * 5 - 2,
            },
            life: Math.random() * 100 + 50,
            type: "fire",
          })
        }
      }

      if (effects.includes("rain")) {
        for (let i = 0; i < 100; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            length: Math.random() * 20 + 10,
            velocity: {
              x: 0,
              y: Math.random() * 5 + 10,
            },
            color: "rgba(120, 160, 255, 0.5)",
            type: "rain",
          })
        }
      }

      if (effects.includes("confetti")) {
        for (let i = 0; i < 100; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: -20,
            size: Math.random() * 8 + 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            velocity: {
              x: Math.random() * 4 - 2,
              y: Math.random() * 3 + 2,
            },
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            type: "confetti",
          })
        }
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]

          if (p.type === "fire") {
            p.x += p.velocity.x
            p.y += p.velocity.y
            p.life--

            if (p.life <= 0) {
              p.x = Math.random() * canvas.width
              p.y = canvas.height + 10
              p.life = Math.random() * 100 + 50
            }

            const alpha = p.life / 150
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
            ctx.fillStyle = p.color.replace("hsl", "hsla").replace(")", `, ${alpha})`)
            ctx.fill()
          } else if (p.type === "rain") {
            p.x += p.velocity.x
            p.y += p.velocity.y

            if (p.y > canvas.height) {
              p.x = Math.random() * canvas.width
              p.y = -20
            }

            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x, p.y + p.length)
            ctx.strokeStyle = p.color
            ctx.lineWidth = 1
            ctx.stroke()
          } else if (p.type === "confetti") {
            p.x += p.velocity.x
            p.y += p.velocity.y
            p.rotation += p.rotationSpeed

            if (p.y > canvas.height) {
              p.x = Math.random() * canvas.width
              p.y = -20
              p.velocity.y = Math.random() * 3 + 2
            }

            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate((p.rotation * Math.PI) / 180)
            ctx.fillStyle = p.color
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
            ctx.restore()
          }
        }

        requestAnimationFrame(animate)
      }

      animate()

      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [effects])

  const getIconComponent = (mood: string) => {
    switch (mood) {
      case "heartfelt":
        return Heart
      case "rage":
        return Flame
      case "funny":
        return Laugh
      case "sad":
        return Frown
      case "calm":
        return Cloud
      case "robotic":
        return Cpu
      default:
        return Heart
    }
  }

  const Icon = getIconComponent(mood)

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 flex items-center justify-center">
        {mood === "heartfelt" && effects.includes("hearts") && (
          <div className="relative w-full h-full">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: Math.random() * 300,
                  y: Math.random() * 300,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  x: [Math.random() * 300, Math.random() * 300 + 50, Math.random() * 300 - 50],
                  y: [Math.random() * 300, Math.random() * 300 - 100, Math.random() * 300 + 100],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                }}
              >
                <Heart size={20 + Math.random() * 30} className="text-pink-400" />
              </motion.div>
            ))}
          </div>
        )}

        {mood === "robotic" && effects.includes("glitch") && (
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 bg-slate-400/30"
                style={{
                  width: `${Math.random() * 50 + 10}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  width: [`${Math.random() * 50 + 10}px`, `${Math.random() * 100 + 50}px`],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        {mood === "calm" && effects.includes("stars") && (
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        )}

        {effects.includes("shatter") && (
          <div className="absolute inset-0 pointer-events-none">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <radialGradient id="crack-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
              </defs>
              {Array.from({ length: 10 }).map((_, i) => {
                const x1 = 50
                const y1 = 50
                const angle = (Math.PI * 2 * i) / 10
                const length = 30 + Math.random() * 20
                const x2 = x1 + Math.cos(angle) * length
                const y2 = y1 + Math.sin(angle) * length

                return (
                  <motion.line
                    key={i}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="url(#crack-gradient)"
                    strokeWidth={1 + Math.random() * 2}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                )
              })}
            </svg>
          </div>
        )}

        <motion.div
          className={`z-10 p-6 rounded-full ${
            mood === "heartfelt"
              ? "bg-pink-500/30"
              : mood === "rage"
              ? "bg-red-500/30"
              : mood === "funny"
              ? "bg-yellow-400/30"
              : mood === "sad"
              ? "bg-blue-500/30"
              : mood === "calm"
              ? "bg-green-400/30"
              : "bg-slate-400/30"
          }`}
          animate={{
            scale: [1, 1.1, 1],
            rotate: mood === "rage" ? [0, 5, -5, 0] : 0,
            opacity: [0.8, 1, 0.8], // <-- Opacity animation here
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <Icon size={60} className="text-white" />
        </motion.div>
      </div>
    </div>
  )
}
