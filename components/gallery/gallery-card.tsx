"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Eye, ArrowRight, Flame, Laugh, Frown, Cloud, Cpu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  }
}

export default function GalleryCard({ page }: GalleryCardProps) {
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
        return "from-pink-500/10 to-purple-500/10"
      case "rage":
        return "from-red-600/10 to-orange-500/10"
      case "funny":
        return "from-yellow-400/10 to-orange-400/10"
      case "sad":
        return "from-blue-500/10 to-indigo-500/10"
      case "calm":
        return "from-green-400/10 to-teal-500/10"
      case "robotic":
        return "from-slate-600/10 to-slate-700/10"
      default:
        return "from-pink-500/10 to-purple-500/10"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className={`bg-gradient-to-br ${getMoodGradient(page.mood)} border-none hover:shadow-lg transition-shadow`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={page.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{page.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{page.author.name}</p>
              <p className="text-xs text-gray-400">{page.date}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {getMoodIcon(page.mood)}
              <span className="text-xs capitalize">{page.mood}</span>
            </div>
          </div>

          <Link href={`/preview`} className="block group">
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{page.title}</h3>
            <p className="text-gray-300 text-sm line-clamp-3 mb-4">{page.excerpt}</p>
          </Link>

          <div className="flex items-center text-sm text-gray-400">
            <div className="flex items-center mr-4">
              <Eye className="h-4 w-4 mr-1" />
              {page.views}
            </div>
            <div className="flex items-center mr-4">
              <Heart className="h-4 w-4 mr-1" />
              {page.likes}
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              {page.comments}
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
          <Link href={`/preview`} className="w-full">
            <Button variant="outline" className="w-full border-white/20 text-white">
              View Exit Page
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
