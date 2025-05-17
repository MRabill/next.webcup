"use client"

import { useState } from "react"
import { Heart, ThumbsUp, Smile, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Comment {
  id: number
  author: {
    name: string
    avatar: string
  }
  content: string
  gif?: string
  timestamp: string
  likes: number
  hasLiked: boolean
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "This is such a powerful goodbye! I'm going to miss working with you.",
      timestamp: "2 hours ago",
      likes: 12,
      hasLiked: false,
    },
    {
      id: 2,
      author: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "You always knew how to make an exit! Best of luck on your new journey.",
      gif: "https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif",
      timestamp: "1 hour ago",
      likes: 8,
      hasLiked: true,
    },
    {
      id: 3,
      author: {
        name: "Taylor Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "I'm speechless. This is the most dramatic exit I've ever seen!",
      timestamp: "45 minutes ago",
      likes: 5,
      hasLiked: false,
    },
  ])

  const handleLike = (id: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            likes: comment.hasLiked ? comment.likes - 1 : comment.likes + 1,
            hasLiked: !comment.hasLiked,
          }
        }
        return comment
      }),
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4">
          <Avatar>
            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="font-medium">{comment.author.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{comment.timestamp}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Copy text</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-gray-300">{comment.content}</p>

              {comment.gif && (
                <div className="mt-2 rounded-md overflow-hidden">
                  <img src={comment.gif || "/placeholder.svg"} alt="GIF" className="max-h-60 object-cover" />
                </div>
              )}
            </div>

            <div className="flex items-center mt-2 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs ${comment.hasLiked ? "text-pink-500" : "text-gray-400"}`}
                onClick={() => handleLike(comment.id)}
              >
                {comment.hasLiked ? (
                  <Heart className="h-4 w-4 mr-1 fill-pink-500 text-pink-500" />
                ) : (
                  <Heart className="h-4 w-4 mr-1" />
                )}
                {comment.likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-gray-400">
                <Smile className="h-4 w-4 mr-1" />
                React
              </Button>
              <Button variant="ghost" size="sm" className="text-xs text-gray-400">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Support
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
