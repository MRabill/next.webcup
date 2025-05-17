"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Heart, Frown, Angry, Laugh, ThumbsUp, Zap } from "lucide-react"
import type { GeneratedContent } from "@/lib/types"

export default function LoadingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)

  // Mock generated content
  const mockContent: GeneratedContent = {
    title: "My Dramatic Exit: The Final Curtain Call",
    content:
      "After 5 years of pouring my heart and soul into this company, it's time for the grand finale. This isn't just a resignation; it's the closing act of a chapter that deserved a standing ovation but got lukewarm applause instead. As I take my final bow, I'm not just walking away – I'm making an exit so spectacular, it'll be remembered long after the lights dim on my empty desk.",
  }

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 50)

    // Simulate content generation at 70%
    setTimeout(() => {
      setGeneratedContent(mockContent)
    }, 3500)

    // Navigate to dashboard after loading completes
    setTimeout(() => {
      router.push("/dashboard")
    }, 5000)

    return () => clearInterval(interval)
  }, [router])

  const emotions = [
    { icon: Heart, color: "bg-red-500" },
    { icon: Frown, color: "bg-blue-500" },
    { icon: Angry, color: "bg-orange-500" },
    { icon: Laugh, color: "bg-yellow-500" },
    { icon: ThumbsUp, color: "bg-green-500" },
    { icon: Zap, color: "bg-purple-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-8">Creating Your End Page</h1>

        {/* Floating emotions */}
        <div className="relative h-40 mb-8">
          {emotions.map((Emotion, index) => (
            <motion.div
              key={index}
              className={`absolute ${Emotion.color} p-3 rounded-full`}
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                x: [0, ((index % 2 === 0 ? -100 : 100) * (index + 1)) / emotions.length, 0],
                y: [0, (-50 * (index + 1)) / emotions.length, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3 + index,
                delay: index * 0.5,
                ease: "easeInOut",
              }}
              style={{
                left: `${50 + (index - emotions.length / 2) * 10}%`,
                top: "50%",
              }}
            >
              <Emotion.icon size={24} />
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-4 mb-6">
          <motion.div
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-4 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-xl mb-8">
          {progress < 30 && "Analyzing your emotions..."}
          {progress >= 30 && progress < 60 && "Crafting your narrative..."}
          {progress >= 60 && progress < 90 && "Adding emotional depth..."}
          {progress >= 90 && "Finalizing your end page..."}
        </p>

        {/* Generated content preview */}
        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 p-6 rounded-lg backdrop-blur-sm text-left"
          >
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              {generatedContent.title}
            </h2>
            <p className="text-gray-300 line-clamp-3">{generatedContent.content}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
