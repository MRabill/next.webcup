"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface GifSelectorProps {
  onSelect: (gifUrl: string) => void
}

export default function GifSelector({ onSelect }: GifSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock GIF data - in a real app, this would come from a GIF API like Giphy or Tenor
  const mockGifs = [
    "https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif",
    "https://media.giphy.com/media/3o7btQsLqXMJAPu6Na/giphy.gif",
    "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif",
    "https://media.giphy.com/media/l378rrt5tAawaCQ9i/giphy.gif",
    "https://media.giphy.com/media/l0HlDJhyI8qoh7Wfu/giphy.gif",
    "https://media.giphy.com/media/3o7btQMdq4a44tXod2/giphy.gif",
    "https://media.giphy.com/media/3o7btPCwlw9CaFH9Cg/giphy.gif",
    "https://media.giphy.com/media/3o7btSHUTdraHEsx0Y/giphy.gif",
  ]

  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <div className="flex mb-4">
        <Input
          placeholder="Search GIFs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white/10 border-white/20 text-white"
        />
        <Button className="ml-2">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {mockGifs.map((gif, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-md overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
            onClick={() => onSelect(gif)}
          >
            <img src={gif || "/placeholder.svg"} alt={`GIF ${index + 1}`} className="w-full h-24 object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
