"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Volume2, VolumeX, ArrowLeft, Heart, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export default function PreviewPage() {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [comment, setComment] = useState("")

  // Mock data for the preview
  const exitPage = {
    title: "My Dramatic Exit: The Final Curtain Call",
    message: `After 5 years of pouring my heart and soul into this company, it's time for the grand finale. This isn't just a resignation; it's the closing act of a chapter that deserved a standing ovation but got lukewarm applause instead.

As I take my final bow, I'm not just walking away – I'm making an exit so spectacular, it'll be remembered long after the lights dim on my empty desk. The spotlight may have shifted, but my performance will echo in these halls.

To those who supported me: thank you for being the audience that kept me going. To those who didn't: watch as I steal the show one last time.

The curtain falls, but my story continues on a grander stage.`,
    mood: "dramatic",
    gifs: ["https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif"],
    visualEffects: ["confetti", "fire"],
  }

  const comments = [
    {
      id: 1,
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "This is such a powerful goodbye! I'm going to miss working with you.",
      timestamp: "2 hours ago",
      likes: 12,
    },
    {
      id: 2,
      author: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "You always knew how to make an exit! Best of luck on your new journey.",
      timestamp: "1 hour ago",
      likes: 8,
    },
  ]

  const handleCopyLink = () => {
    // In a real app, this would copy a link to the clipboard
    alert("Link copied to clipboard!")
  }

  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert("Share dialog opened!")
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleSubmitComment = () => {
    if (comment.trim()) {
      // In a real app, this would submit the comment to a database
      setComment("")
      alert("Comment submitted!")
    }
  }

  // Simulate the "slam the door" effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const doorSlam = new Audio("/sounds/door-slam.mp3")
      if (!isMuted) {
        doorSlam.play()
      }

      // Shake the screen
      document.body.classList.add("shake-effect")
      setTimeout(() => {
        document.body.classList.remove("shake-effect")
      }, 500)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isMuted])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .shake-effect {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push("/create")} className="mb-8 text-white hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Editor
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-lg shadow-2xl">
            <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 min-h-[600px]">
              {/* Visual effects layer */}
              <div className="absolute inset-0 pointer-events-none">
                {exitPage.visualEffects.includes("confetti") && (
                  <div className="absolute inset-0">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                          top: -20,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, 800],
                          x: [0, (Math.random() - 0.5) * 200],
                          rotate: [0, Math.random() * 360],
                          opacity: [1, 0],
                        }}
                        transition={{
                          duration: 4 + Math.random() * 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: Math.random() * 5,
                        }}
                      />
                    ))}
                  </div>
                )}

                {exitPage.visualEffects.includes("fire") && (
                  <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute bottom-0 w-4 h-16 rounded-t-full"
                        style={{
                          backgroundColor: `hsl(${Math.random() * 30 + 15}, 100%, 50%)`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          height: [16, 24, 16],
                          y: [0, -10, 0],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1 + Math.random(),
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10 p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-sm text-gray-400">theend.page/my-dramatic-exit</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-6 text-pink-400">{exitPage.title}</h1>

                  <div className="prose prose-invert max-w-none mb-8">
                    {exitPage.message.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {exitPage.gifs.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 mb-8">
                      {exitPage.gifs.map((gif, index) => (
                        <Card key={index} className="overflow-hidden bg-transparent border-none">
                          <CardContent className="p-0">
                            <img
                              src={gif || "/placeholder.svg"}
                              alt={`GIF ${index + 1}`}
                              className="w-full rounded-lg"
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="mt-12 text-center">
                    <p className="text-sm text-gray-400">
                      This exit page was created on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>

            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{comment.author.name}</p>
                        <p className="text-xs text-gray-400">{comment.timestamp}</p>
                      </div>
                      <p className="text-gray-300 mt-1">{comment.content}</p>
                      <div className="flex items-center mt-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-pink-400">
                          <Heart className="h-4 w-4 mr-1" />
                          {comment.likes}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  placeholder="Add a comment..."
                  className="bg-white/5 border-white/20 text-white mb-2"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmitComment()
                    }
                  }}
                />
                <Button variant="default" size="sm" disabled={!comment.trim()} onClick={handleSubmitComment}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Comment
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Ready to create your own exit page?</p>
            <Button
              onClick={() => router.push("/create")}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
            >
              Create Your Exit Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
