"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Former Marketing Manager",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "After 5 years at my company, I wanted my departure to be as memorable as my time there. theend.page helped me create the perfect goodbye that left everyone speechless.",
      mood: "heartfelt",
    },
    {
      name: "Jamie Smith",
      role: "Ex-Relationship",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Breaking up is hard, but creating a page that expressed all my feelings made it a bit easier. It was cathartic and helped me move on.",
      mood: "sad",
    },
    {
      name: "Taylor Wilson",
      role: "Former Team Lead",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "I used the rage mode to quit my toxic job. The animations and effects perfectly captured how I felt. Best decision ever!",
      mood: "rage",
    },
    {
      name: "Jordan Lee",
      role: "Relocated Friend",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Moving to another country was emotional. I created a funny goodbye page that made my friends laugh instead of cry. Mission accomplished!",
      mood: "funny",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Memorable Exits</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          See how others have used theend.page to create their perfect goodbye.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card
              className={`border-none shadow-lg ${
                testimonial.mood === "heartfelt"
                  ? "bg-gradient-to-br from-pink-500/10 to-purple-500/10"
                  : testimonial.mood === "rage"
                    ? "bg-gradient-to-br from-red-600/10 to-orange-500/10"
                    : testimonial.mood === "funny"
                      ? "bg-gradient-to-br from-yellow-400/10 to-orange-400/10"
                      : "bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-gray-300">{testimonial.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
