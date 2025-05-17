"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import ConstellationBackground from "@/components/effects/constellation-background"
import { ThemeToggle } from "@/components/theme-toggle"

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("trending")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Mock data for the gallery
  const exitPages = [
    {
      id: 1,
      title: "My Dramatic Exit: The Final Curtain Call",
      excerpt:
        "After 5 years of pouring my heart and soul into this company, it's time for the grand finale. This isn't just a resignation; it's the closing act of a chapter that deserved a standing ovation...",
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      mood: "rage",
      views: 1243,
      likes: 89,
      comments: 12,
      date: "2 days ago",
      slug: "my-dramatic-exit",
    },
    {
      id: 2,
      title: "So Long, and Thanks for All the Fish!",
      excerpt:
        "Well folks, it's been real, it's been fun, but it hasn't been real fun! After much consideration (and by 'much' I mean approximately 3 minutes while waiting for my coffee), I've decided it's time to make like a banana and split...",
      author: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      mood: "funny",
      views: 876,
      likes: 54,
      comments: 8,
      date: "1 week ago",
      slug: "so-long-and-thanks",
    },
    {
      id: 3,
      title: "With a Heavy Heart: My Final Goodbye",
      excerpt:
        "With a heavy heart and tears I cannot hide, I find myself writing these words of goodbye. Every departure carries its weight of sorrow, and this one feels almost too heavy to bear...",
      author: {
        name: "Taylor Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      mood: "sad",
      views: 1567,
      likes: 132,
      comments: 24,
      date: "3 days ago",
      slug: "with-a-heavy-heart",
    },
    {
      id: 4,
      title: "Moving Forward: A Peaceful Departure",
      excerpt:
        "As I embark on a new path, I wanted to take a moment to express my gratitude for the journey we've shared. With clarity and peace, I've made the decision to move forward in a different direction...",
      author: {
        name: "Jordan Lee",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      mood: "calm",
      views: 743,
      likes: 67,
      comments: 9,
      date: "5 days ago",
      slug: "moving-forward",
    },
    {
      id: 5,
      title: "NOTICE OF TERMINATION",
      excerpt:
        "This communication serves as formal notification that effective immediately, all association between the relevant parties is hereby discontinued. Reason for termination: Optimal functioning requires reallocation of resources...",
      author: {
        name: "Riley Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      mood: "robotic",
      views: 621,
      likes: 42,
      comments: 7,
      date: "1 day ago",
      slug: "notice-of-termination",
    },
    {
      id: 6,
      title: "A Heartfelt Farewell: My Journey Ends Here",
      excerpt:
        "As I write this farewell message, my heart is filled with gratitude for the time we've shared. The memories we've created together will forever be a cherished part of my journey...",
      author: {
        name: "Casey Kim",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      mood: "heartfelt",
      views: 932,
      likes: 78,
      comments: 15,
      date: "4 days ago",
      slug: "a-heartfelt-farewell",
    },
  ]

  const filteredPages = exitPages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.author.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>

    </div>
  )};
    // <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-white relative">
    //   {/* Background */}
    //   <ConstellationBackground className="z-0" />
      
    //   <div className="container mx-auto px-4 py-8 relative z-10">
    //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    //       <div className="flex items-center justify-between w-full md:w-auto">
    //         <div>
    //           <h1 className="text-3xl font-bold">Exit Page Gallery</h1>
    //           <p className="text-slate-600 dark:text-gray-300">Browse memorable departures from the community</p>
    //         </div>
    //         <div className="md:hidden">
    //           <ThemeToggle />
    //         </div>
    //       </div>
    //       <div className="flex gap-4 items-center w-full md:w-auto">
    //         <div className="relative flex-1 md:flex-none">
    //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-400 h-4 w-4" />
    //           <Input
    //             placeholder="Search exit pages..."
    //             className="pl-10 bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white w-full md:w-[250px]"
    //             value={searchTerm}
    //             onChange={(e) => setSearchTerm(e.target.value)}
    //           />
    //         </div>
    //         <div className="hidden md:block">
    //           <ThemeToggle />
    //         </div>
    //         <Link href="/create">
    //           <Button>Create Your Exit</Button>
    //         </Link>
    //       </div>
    //     </div>

    //     <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab} className="w-full">
    //       <TabsList className="grid grid-cols-3 bg-white/20 dark:bg-white/10 rounded-lg mb-8 w-full md:w-[300px]">
    //         <TabsTrigger value="trending" className="data-[state=active]:bg-white/40 dark:data-[state=active]:bg-white/20">
    //           Trending
    //         </TabsTrigger>
    //         <TabsTrigger value="recent" className="data-[state=active]:bg-white/40 dark:data-[state=active\
