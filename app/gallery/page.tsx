"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Eye, Heart, Sparkles, ArrowRight } from "lucide-react"
import ConstellationBackground from "@/components/effects/constellation-background"
import { ThemeToggle } from "@/components/theme-toggle"
import GalleryCard from "@/components/gallery/gallery-card"
import EnhancedParticles from "@/components/effects/enhanced-particles"
import { CardFooter } from "@/components/ui/card"

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
      reactions: {
        like: 14,
        sad: 3,
        angry: 1,
        funny: 5,
      }
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
      reactions: {
        like: 14,
        sad: 3,
        angry: 1,
        funny: 5,
      }
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
      reactions: {
        like: 14,
        sad: 3,
        angry: 1,
        funny: 5,
      }
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
      reactions: {
        like: 14,
        sad: 3,
        angry: 1,
        funny: 5,
      }
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
      reactions: {
        like: 14,
        sad: 3,
        angry: 1,
        funny: 5,
      }
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
      reactions: {
        like: 14,
        sad: 3,
        angry: 1,
        funny: 5,
      }
    },
  ]

  const filteredPages = exitPages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.author.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort pages based on active tab
  const sortedPages = [...filteredPages].sort((a, b) => {
    if (activeTab === "trending") {
      return b.views - a.views
    } else if (activeTab === "recent") {
      // Simple mock sorting by date (in a real app, this would use actual date objects)
      return a.date.includes("day") && b.date.includes("day")
        ? Number.parseInt(a.date) - Number.parseInt(b.date)
        : a.date.includes("week")
          ? 1
          : -1
    }
    return 0
  })


  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-slate-950 text-white relative">
      {/* Background */}
      <ConstellationBackground
        dotColor="rgba(255, 255, 255, 0.8)"
        lineColor="rgba(255, 255, 255, 0.2)"
        dotCount={380}
        className="z-0"
      />
      <EnhancedParticles mood="default" intensity="low" className="z-0" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">Exit Page Gallery</h1>
              <p className="text-slate-600 dark:text-gray-300">Browse memorable departures from the community</p>
            </div>
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
          <div className="flex gap-4 items-center w-full md:w-auto">
            <Link href="/create">
              <Button
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                size="lg"
              >
                Create Your Exit
              </Button>
            </Link>
          </div>
        </div>
        <section className="mb-12 px-4">
          <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            Hall of Fame 🏆
          </h2>

          <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end gap-8 sm:gap-4 max-w-5xl mx-auto">
            {[
              {
                rank: "#2",
                title: "So Long, and Thanks...",
                name: "Jamie Smith",
                bg: "#C0C0C0",
                height: "h-44",
              },
              {
                rank: "#1",
                title: "My Dramatic Exit...",
                name: "Alex Johnson",
                bg: "#FFD700",
                height: "h-52",
              },
              {
                rank: "#3",
                title: "With a Heavy Heart...",
                name: "Taylor Wilson",
                bg: "#CD7F32",
                height: "h-40",
              },
            ].map(({ rank, title, name, bg, height }, idx) => (
              <div key={idx} className="flex flex-col items-center relative w-full max-w-[540px] sm:max-w-[260px] md:max-w-[280px]">

                {/* Glow Effect */}
                <div
                  className={`absolute -z-10 w-full ${height} rounded-xl`}
                  style={{
                    backgroundColor: `${bg}80`,
                    filter: "blur(40px)",
                    opacity: 0.3,
                  }}
                />

                <span className="mb-2 font-bold text-white">{rank}</span>
                <div
                  className={`rounded-xl shadow-md p-4 w-full ${height} text-white text-left flex flex-col justify-between`}
                  style={{
                    backgroundColor: `${bg}4D`,
                    border: `1px solid ${bg}66`,
                    backdropFilter: "blur(8px) saturate(150%)",
                  }}
                >
                  <div>
                    <h3 className="font-bold truncate">{title}</h3>
                    <p className="text-sm mt-2">{name}</p>
                  </div>
                  <div className="mt-3 flex justify-center">
                    <Link href={`/preview`} className="w-full">
                      <Button variant="outline" className="w-full border-white/20 text-white hover:border-purple-400 hover:text-purple-400 transition">
                        View Exit Page
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
         Cast your vote for the next Hall of Fame member!
        </h2>

        <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            {/* Tabs */}
            <TabsList className="grid grid-cols-2 bg-white/20 dark:bg-white/10 rounded-lg w-full md:w-[300px]">
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-white/40 dark:data-[state=active]:bg-white/20"
              >
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="data-[state=active]:bg-white/40 dark:data-[state=active]:bg-white/20"
              >
                Recent
              </TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className="relative w-full md:w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search exit pages..."
                className="pl-10 bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPages.length > 0 ? (
              sortedPages.map((page) => <GalleryCard key={page.id} page={page} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium mb-2">No exit pages found</h3>
                <p className="text-slate-500 dark:text-gray-400 mb-6">
                  {searchTerm ? `No results found for "${searchTerm}"` : "There are no exit pages in this category yet"}
                </p>
                <Link href="/create">
                  <Button>Create Your Own Exit Page</Button>
                </Link>
              </div>
            )}
          </div>
        </Tabs>

        {/* Featured section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Featured Exit Pages</h2>
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 p-6 rounded-xl backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Create Your Own Memorable Exit
                </h3>
                <p className="text-slate-700 dark:text-gray-300 mb-4">
                  Ready to make your grand exit? Create a customized departure page with style, rage, GIFs, tears,
                  sounds, and regrets (or not).
                </p>
                <Link href="/create">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Start Creating Now
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="grid grid-cols-2 gap-4">
                  {exitPages.slice(0, 4).map((page, index) => (
                    <div key={index} className="bg-white/20 dark:bg-white/10 p-3 rounded-lg">
                      <p className="font-medium text-sm truncate">{page.title}</p>
                      <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {page.views}
                        </span>
                        <span className="flex items-center ml-2">
                          <Heart className="h-3 w-3 mr-1" />
                          {page.likes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500 dark:text-gray-400 py-6 border-t border-slate-200 dark:border-slate-700">
          <p>© 2025 theend.page — Your grand exit, your way.</p>
        </footer>
      </div>
    </div>
  )
}
