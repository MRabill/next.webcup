"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { moods } from "@/lib/data"
import type { MoodType } from "@/lib/data"

interface MoodSelectorProps {
  selectedMood: string
  onSelect: (mood: string) => void
}

export default function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2">Choose Your Exit Mood</h2>
        <p className="text-gray-300 text-sm">
          Select the emotional tone for your departure. This will influence the style, effects, and AI-generated
          content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moods.map((mood: MoodType) => {
          const Icon = mood.icon
          const isSelected = selectedMood === mood.id

          return (
            <motion.div
              key={mood.id}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(mood.id)}
              className="transform transition-all duration-300"
            >
              <Card
                className={`cursor-pointer border-2 transition-all ${
                  isSelected
                    ? mood.id === "heartfelt"
                      ? "border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20"
                      : mood.id === "rage"
                        ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20"
                        : mood.id === "funny"
                          ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20"
                          : mood.id === "sad"
                            ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                            : mood.id === "calm"
                              ? "border-green-400 bg-green-400/10 shadow-lg shadow-green-400/20"
                              : "border-slate-400 bg-slate-400/10 shadow-lg shadow-slate-400/20"
                    : "border-transparent bg-white/5 hover:bg-white/10"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        mood.id === "heartfelt"
                          ? "bg-pink-500"
                          : mood.id === "rage"
                            ? "bg-red-500"
                            : mood.id === "funny"
                              ? "bg-yellow-400"
                              : mood.id === "sad"
                                ? "bg-blue-500"
                                : mood.id === "calm"
                                  ? "bg-green-400"
                                  : "bg-slate-400"
                      }`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle>{mood.name}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-300">{mood.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {mood.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span
                          className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                            mood.id === "heartfelt"
                              ? "bg-pink-500"
                              : mood.id === "rage"
                                ? "bg-red-500"
                                : mood.id === "funny"
                                  ? "bg-yellow-400"
                                  : mood.id === "sad"
                                    ? "bg-blue-500"
                                    : mood.id === "calm"
                                      ? "bg-green-400"
                                      : "bg-slate-400"
                          }`}
                        ></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
