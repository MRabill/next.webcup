import Link from "next/link"
import { Eye, Heart, MessageCircle } from "lucide-react"

export default function GalleryCard({ page }: { page: any }) {
  // Determine mood color
  const getMoodColor = () => {
    switch (page.mood) {
      case "rage":
        return "bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
      case "funny":
        return "bg-yellow-500/10 hover:bg-yellow-500/20 border-yellow-500/20"
      case "sad":
        return "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20"
      case "calm":
        return "bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
      case "robotic":
        return "bg-gray-500/10 hover:bg-gray-500/20 border-gray-500/20"
      case "heartfelt":
        return "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20"
      default:
        return "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20"
    }
  }

  return (
    <Link href={`/gallery/${page.slug}`}>
      <div
        className={`h-full flex flex-col rounded-xl p-6 border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${getMoodColor()}`}
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            <img
              src={page.author.avatar}
              alt={page.author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3">
            <h4 className="font-medium">{page.author.name}</h4>
            <p className="text-xs text-slate-500 dark:text-gray-400">{page.date}</p>
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{page.title}</h3>
          <p className="text-slate-700 dark:text-gray-300 mb-4 line-clamp-3">{page.excerpt}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/20">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-white/20 dark:bg-black/20">
            {page.mood}
          </span>
          <div className="flex space-x-4 text-sm text-slate-500 dark:text-gray-400">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {page.views}
            </span>
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {page.likes}
            </span>
            <span className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {page.comments}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}