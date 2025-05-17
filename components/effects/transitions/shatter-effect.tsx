"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

// The following is a React adaptation of https://codepen.io/marcellegane/pen/kBYwoO

function triggerShatter(canvas: HTMLCanvasElement, x: number, y: number) {
  // This is a simplified version. For full effect, port the CodePen JS logic here.
  // For now, just draw a simple shatter at (x, y)
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  // Draw a simple shatter (for demo, replace with full port for production)
  ctx.save()
  ctx.strokeStyle = "rgba(255,255,255,0.8)"
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(angle) * 80, y + Math.sin(angle) * 80)
  }
  ctx.stroke()
  ctx.restore()
}

const CANVAS_IDS = [
  "draw-refract",
  "draw-reflect",
  "draw-fractures",
  "draw-mainline",
  "draw-noise"
]

// --- Utility and rendering functions ported from CodePen ---
function findPointOnCircle(c: {x: number, y: number}, r: number, a: number) {
  const RAD = Math.PI / 180
  return {
    x: c.x + r * Math.cos(a * RAD) - r * Math.sin(a * RAD),
    y: c.y + r * Math.sin(a * RAD) + r * Math.cos(a * RAD)
  }
}

function describeLinePath(p1: any, p2: any, cv: number) {
  let o: any = {}
  cv = 5 * cv
  o.dx = (p2.x - p1.x)
  o.dy = (p2.y - p1.y)
  o.dl = Math.sqrt(o.dx * o.dx + o.dy * o.dy)
  o.sx = o.dx / o.dl
  o.sy = o.dy / o.dl
  o.tx = o.dy / o.dl
  o.ty = -o.dx / o.dl
  o.mpp = Math.random() * 0.5 + 0.3
  o.mpl1 = o.dl * o.mpp
  o.mpl2 = o.dl - o.mpl1
  let ll = Math.log(o.dl * Math.E)
  o.cma = Math.random() * ll * cv - ll * cv / 2
  o.cpt = { x: p1.x + o.sx * o.mpl1 + o.tx * o.cma, y: p1.y + o.sy * o.mpl1 + o.ty * o.cma }
  o.bbx1 = Math.min(p1.x, p2.x, o.cpt.x)
  o.bby1 = Math.min(p1.y, p2.y, o.cpt.y)
  o.bbx2 = Math.max(p1.x, p2.x, o.cpt.x)
  o.bby2 = Math.max(p1.y, p2.y, o.cpt.y)
  o.bbwidth = o.bbx2 - o.bbx1
  o.bbheight = o.bby2 - o.bby1
  return o
}

function findCrackEffectPaths(width: number, height: number, center: {x: number, y: number}) {
  let main: any[][] = [[]]
  let lines: any[] = []
  let level = 1, maxl = 0, r = 15, num = 22 + Math.floor(Math.random()*8), ang = 360 / (num + 1), c = center, pt1, pt2, num2
  while (main[0].length < num) {
    num2 = (ang * main[0].length) + 10 + Math.random()*8
    pt2 = findPointOnCircle(c, 5 + Math.random()*3, num2)
    main[0].push({ angle: num2, point: pt2 })
  }
  while (r < Math.min(width, height) / 1.5) {
    main[level] = []
    for (num2 = 0; num2 < num; num2++) {
      pt1 = main[level - 1][num2]
      main[level][num2] = null
      if (pt1) {
        let ang2 = pt1.angle + Math.random() * 10 / num - 10 / 2 / num + Math.random()*6
        if (ang2 > 350) ang2 = 350
        pt1 = pt1.point
        pt2 = findPointOnCircle(c, r + Math.random() * r / level - r / (level * 2), ang2)
        main[level][num2] = { angle: ang2, point: { x: pt2.x, y: pt2.y } }
      }
    }
    level++
    r *= Math.random() * 1.5 + (1.5 - 50 / 100)
  }
  if (maxl === 0) maxl = level
  let l = 1, g = 0
  for (; l < level; l++) {
    for (g = 0; g < num; g++) {
      pt1 = main[l - 1][g]
      pt2 = main[l][g]
      if (pt1 && pt2) {
        lines.push({
          p1: { x: pt1.point.x, y: pt1.point.y },
          p2: { x: pt2.point.x, y: pt2.point.y },
          desc: describeLinePath(pt1.point, pt2.point, 30 / 100),
          level: l
        })
        if (Math.random() < (60 / 100)) {
          let pt3 = main[l][(g + 1) % num]
          if (pt3) {
            lines.push({
              p1: { x: pt2.point.x, y: pt2.point.y },
              p2: { x: pt3.point.x, y: pt3.point.y },
              desc: describeLinePath(pt2.point, pt3.point, 30 / 100),
              level: l
            })
          }
        }
        if (l < level - 1 && Math.random() < (30 / 100)) {
          let pt4 = main[l + 1][(g + 1) % num]
          if (pt4) {
            lines.push({
              p1: { x: pt2.point.x, y: pt2.point.y },
              p2: { x: pt4.point.x, y: pt4.point.y },
              desc: describeLinePath(pt2.point, pt4.point, 30 / 100),
              level: l
            })
          }
        }
      }
    }
  }
  return lines
}

// --- Renderers for each canvas layer ---
function renderMainline(ctx: CanvasRenderingContext2D, line: any) {
  ctx.save()
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 1 + Math.random()*0.7
  ctx.strokeStyle = "rgba(255,255,255,0.7)"
  ctx.shadowColor = "#fff"
  ctx.shadowBlur = 2
  ctx.beginPath()
  ctx.moveTo(line.p1.x, line.p1.y)
  ctx.quadraticCurveTo(line.desc.cpt.x, line.desc.cpt.y, line.p2.x, line.p2.y)
  ctx.stroke()
  ctx.restore()
}
function renderFractures(ctx: CanvasRenderingContext2D, line: any) {
  ctx.save()
  ctx.globalAlpha = 0.25
  ctx.lineWidth = 0.7 + Math.random()*0.5
  ctx.strokeStyle = "rgba(255,255,255,0.3)"
  ctx.beginPath()
  ctx.moveTo(line.p1.x, line.p1.y)
  ctx.lineTo(line.p2.x, line.p2.y)
  ctx.stroke()
  ctx.restore()
}
function renderReflect(ctx: CanvasRenderingContext2D, line: any) {
  ctx.save()
  ctx.globalAlpha = 0.18
  let dd = line.desc.dl / 3
  let grd = ctx.createLinearGradient(
    line.p1.x + dd * line.desc.tx,
    line.p1.y + dd * line.desc.ty,
    line.p1.x - dd * line.desc.tx,
    line.p1.y - dd * line.desc.ty
  )
  grd.addColorStop(0, "rgba(255,255,255,0)")
  grd.addColorStop(0.5, "rgba(255,255,255,0.3)")
  grd.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = grd
  ctx.beginPath()
  ctx.moveTo(line.p1.x + dd * line.desc.tx, line.p1.y + dd * line.desc.ty)
  ctx.lineTo(line.p2.x + dd * line.desc.tx, line.p2.y + dd * line.desc.ty)
  ctx.lineTo(line.p2.x - dd * line.desc.tx, line.p2.y - dd * line.desc.ty)
  ctx.lineTo(line.p1.x - dd * line.desc.tx, line.p1.y - dd * line.desc.ty)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}
function renderRefract(ctx: CanvasRenderingContext2D, line: any) {
  ctx.save()
  ctx.globalAlpha = 0.13
  ctx.beginPath()
  ctx.moveTo(line.p1.x, line.p1.y)
  ctx.quadraticCurveTo(line.desc.cpt.x, line.desc.cpt.y, line.p2.x, line.p2.y)
  ctx.lineTo(line.p2.x, line.p2.y)
  ctx.quadraticCurveTo(line.desc.cpt.x, line.desc.cpt.y, line.p1.x, line.p1.y)
  ctx.closePath()
  ctx.fillStyle = "rgba(255,255,255,0.09)"
  ctx.fill()
  ctx.restore()
}
function renderNoise(ctx: CanvasRenderingContext2D, line: any) {
  ctx.save()
  ctx.globalAlpha = 0.09
  ctx.lineWidth = 0.5
  ctx.strokeStyle = "rgba(255,255,255,0.13)"
  ctx.beginPath()
  ctx.moveTo(line.p1.x, line.p1.y)
  ctx.lineTo(line.p2.x, line.p2.y)
  ctx.stroke()
  ctx.restore()
}

function renderImpact(ctxs: (CanvasRenderingContext2D|null)[], center: {x: number, y: number}) {
  // Draw a dark spot at the impact center for realism
  ctxs.forEach(ctx => {
    if (!ctx) return
    ctx.save()
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.arc(center.x, center.y, 10 + Math.random()*4, 0, 2 * Math.PI)
    ctx.fillStyle = "rgba(0,0,0,0.45)"
    ctx.shadowColor = "#000"
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.restore()
  })
}

function renderCrackEffectAll(canvases: (HTMLCanvasElement|null)[], width: number, height: number, center: {x: number, y: number}) {
  const lines = findCrackEffectPaths(width, height, center)
  const ctxs = canvases.map(c => c?.getContext("2d"))
  lines.forEach(line => {
    if (ctxs[0]) renderRefract(ctxs[0], line)
    if (ctxs[1]) renderReflect(ctxs[1], line)
    if (ctxs[2]) renderFractures(ctxs[2], line)
    if (ctxs[3]) renderMainline(ctxs[3], line)
    if (ctxs[4]) renderNoise(ctxs[4], line)
  })
  renderImpact(ctxs, center)
}

// --- Main component ---
export default function ShatterEffect() {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const [visible, setVisible] = useState(true)
  const [shake, setShake] = useState(false)

  // Responsive sizing
  const setCanvasSizes = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    canvasRefs.current.forEach((c) => {
      if (c) {
        c.width = width
        c.height = height
        const ctx = c.getContext("2d")
        if (ctx) ctx.clearRect(0, 0, width, height)
      }
    })
  }

  useEffect(() => {
    setCanvasSizes()
    window.addEventListener("resize", setCanvasSizes)
    return () => window.removeEventListener("resize", setCanvasSizes)
  }, [])

  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    // Staggered shatters with shake and sound
    const shatterPoints = [
      { x: width - 170, y: 130 }, // top right
      { x: 100, y: height - 100 }, // bottom left
      { x: 100, y: 100 }, // top left
      { x: width - 100, y: height - 100 }, // bottom right
      { x: width / 2, y: height / 2 } // center
    ]
    shatterPoints.forEach((pt, i) => {
      setTimeout(() => {
        setShake(true)
        renderCrackEffectAll(canvasRefs.current, width, height, pt)
        // Play sound effect
        const audio = new Audio("/sounds/glass.mp3")
        audio.volume = 0.5
        audio.play()
        setTimeout(() => setShake(false), 400)
      }, 100 + i * 500)
    })
    // Fade out 3s after last shatter
    const fadeTimeout = setTimeout(() => setVisible(false), 100 + shatterPoints.length * 500 + 3000)
    return () => clearTimeout(fadeTimeout)
  }, [])

  if (!visible) return null

  return (
    <motion.div
      className={`fixed inset-0 z-50 pointer-events-none ${shake ? "shatter-shake" : ""}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: "none" }}
    >
      {CANVAS_IDS.map((id, i) => (
        <canvas
          key={id}
          ref={el => (canvasRefs.current[i] = el)}
          className="absolute top-0 left-0 w-full h-full"
          style={{ zIndex: i + 1 }}
        />
      ))}
      <style>{`
        .shatter-shake {
          animation: shatter-shake-anim 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shatter-shake-anim {
          10%, 90% { transform: translate3d(-2px, 1px, 0); }
          20%, 80% { transform: translate3d(-4px, -2px, 0); }
          30%, 50%, 70% { transform: translate3d(4px, 2px, 0); }
          40%, 60% { transform: translate3d(2px, -4px, 0); }
        }
      `}</style>
    </motion.div>
  )
} 