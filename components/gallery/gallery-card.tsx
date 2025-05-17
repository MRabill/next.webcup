"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Heart,
  MessageSquare,
  Eye,
  ArrowRight,
  Flame,
  Laugh,
  Frown,
  Cloud,
  Cpu,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReactionBar from "@/components/gallery/ReactionBar"
import { Player } from "@lottiefiles/react-lottie-player"
import likeAnimation from "./lottie/Animation - 1747509269087.json"
import sadAnimation from "./lottie/Animation - 1747509360758.json"
import angryAnimation from "./lottie/Animation - 1747509318081.json"
import funnyAnimation from "./lottie/laigh.json"

const emojiAnimations = {
  like: likeAnimation,
  sad: sadAnimation,
  angry: angryAnimation,
  funny: funnyAnimation,
}

interface GalleryCardProps {
  page: {
    id: number
    title: string
    excerpt: string
    author: {
      name: string
      avatar: string
    }
    mood: string
    views: number
    likes: number
    comments: number
    date: string
    slug: string
    reactions: {
      like: number
      sad: number
      angry: number
      funny: number
    }
  }
}

export default function GalleryCard({ page }: GalleryCardProps) {
  const [reactions, setReactions] = useState(page.reactions)
  const [activeAnimation, setActiveAnimation] = useState<keyof typeof emojiAnimations | null>(null)

  const handleReact = (type: keyof typeof emojiAnimations) => {
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))
    setActiveAnimation(type)
    setTimeout(() => setActiveAnimation(null), 4000)
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "heartfelt":
        return <Heart className="h-4 w-4 text-pink-400" />
      case "rage":
        return <Flame className="h-4 w-4 text-red-500" />
      case "funny":
        return <Laugh className="h-4 w-4 text-yellow-400" />
      case "sad":
        return <Frown className="h-4 w-4 text-blue-400" />
      case "calm":
        return <Cloud className="h-4 w-4 text-green-400" />
      case "robotic":
        return <Cpu className="h-4 w-4 text-slate-400" />
      default:
        return <Heart className="h-4 w-4 text-pink-400" />
    }
  }

  const getMoodGradient = (mood: string) => {
    switch (mood) {
      case "heartfelt":
        return "from-pink-500/40 to-purple-500/40"
      case "rage":
        return "from-red-600/40 to-orange-500/40"
      case "funny":
        return "from-yellow-400/30 to-orange-400/30"
      case "sad":
        return "from-blue-500/40 to-indigo-500/40"
      case "calm":
        return "from-green-400/40 to-teal-500/40"
      case "robotic":
        return "from-slate-600/40 to-slate-700/40"
      default:
        return "from-pink-500/40 to-purple-500/40"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full relative"
    >
      {activeAnimation && (
        <div className="absolute inset-0 z-50 flex justify-center items-center pointer-events-none">
          <Player
            key={activeAnimation} // ✅ ensures it restarts
            autoplay
            loop={false}
            src={emojiAnimations[activeAnimation]}
            style={{ height: "150px", width: "150px" }}
          />
        </div>
      )}


      <Card
        className={`relative flex flex-col justify-between h-full bg-gradient-to-br ${getMoodGradient(
          page.mood
        )} border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/30 z-0" />

        <CardContent className="p-6 flex-grow flex flex-col relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={page.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{page.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm md:text-base font-medium text-white">{page.author.name}</p>
              <p className="text-xs text-gray-300">{page.date}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {getMoodIcon(page.mood)}
              <span className="text-xs capitalize text-white">{page.mood}</span>
            </div>
          </div>

          <Link href={`/preview`} className="block group flex-grow">
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
              {page.title}
            </h3>
            <p className="text-sm md:text-base text-gray-200 line-clamp-3 mb-4">
              {page.excerpt}
            </p>
          </Link>

          <div className="flex items-center text-xs md:text-sm text-gray-300 mt-auto">
            <div className="flex items-center mr-4">
              <Eye className="h-4 w-4 mr-1" />
              {page.views}
            </div>
            <div className="relative mr-4">
              <div className="flex items-center text-white/80 transition">
                <div className="group relative">
                  <Heart className="h-4 w-4 mr-1 cursor-pointer hover:scale-110 transition-transform" />


                  <div className="absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto pointer-events-none transition-all duration-200 bg-black/80 px-3 py-2 rounded-xl shadow-lg z-20">
                    <ReactionBar onReact={handleReact} reactions={reactions} />
                  </div>
                </div>
                <span>{reactions.like}</span>
              </div>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {page.comments}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
