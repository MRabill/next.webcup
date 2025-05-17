"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0)
  const exitWords = ["Job", "Relationship", "Team", "City", "Project", "Era"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % exitWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold mb-6"
      >
        Your{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          Grand Exit
        </span>{" "}
        from Your{" "}
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
        >
          {exitWords[currentWord]}
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl md:text-2xl max-w-3xl mb-10 text-gray-300"
      >
        Create a customized departure page with style, rage, GIFs, tears, sounds, and regrets (or not). Make your exit
        memorable.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Link href="/create">
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white px-8 py-6 text-lg rounded-full"
          >
            Create Your End Page
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </motion.div>
    </main>
  )
}
