"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Flame, Laugh, Cloud, Frown, Cpu } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { moods } from "@/lib/data"

export default function MoodShowcase() {
  const [activeTab, setActiveTab] = useState("heartfelt")

  const getIconComponent = (mood: string) => {
    switch (mood) {
      case "heartfelt":
        return Heart
      case "rage":
        return Flame
      case "funny":
        return Laugh
      case "sad":
        return Frown
      case "calm":
        return Cloud
      case "robotic":
        return Cpu
      default:
        return Heart
    }
  }

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Exit Mood</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Your departure, your emotions. Select a tone and watch as everything adapts to match your feelings.
        </p>
      </div>

      <Tabs
        defaultValue="heartfelt"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full max-w-4xl mx-auto"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-white/10 rounded-full p-1 mb-8">
          {moods.map((mood) => {
            const Icon = getIconComponent(mood.id)
            return (
              <TabsTrigger
                key={mood.id}
                value={mood.id}
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">{mood.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {moods.map((mood) => (
          <TabsContent key={mood.id} value={mood.id} className="mt-0">
            <Card
              className={`border-none shadow-xl overflow-hidden ${
                mood.id === "heartfelt"
                  ? "bg-gradient-to-br from-pink-500/20 to-purple-500/20"
                  : mood.id === "rage"
                    ? "bg-gradient-to-br from-red-600/20 to-orange-500/20"
                    : mood.id === "funny"
                      ? "bg-gradient-to-br from-yellow-400/20 to-orange-400/20"
                      : mood.id === "sad"
                        ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
                        : mood.id === "calm"
                          ? "bg-gradient-to-br from-green-400/20 to-teal-500/20"
                          : "bg-gradient-to-br from-slate-600/20 to-slate-700/20"
              }`}
            >
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-8 flex flex-col justify-center">
                    <h3
                      className={`text-2xl font-bold mb-4 ${
                        mood.id === "heartfelt"
                          ? "text-pink-400"
                          : mood.id === "rage"
                            ? "text-red-500"
                            : mood.id === "funny"
                              ? "text-yellow-400"
                              : mood.id === "sad"
                                ? "text-blue-400"
                                : mood.id === "calm"
                                  ? "text-green-400"
                                  : "text-slate-400"
                      }`}
                    >
                      {mood.name} Exit
                    </h3>
                    <p className="text-gray-300 mb-6">{mood.description}</p>
                    <ul className="space-y-2">
                      {mood.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
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
                  </div>
                  <div className="relative overflow-hidden h-64 md:h-auto">
                    <div
                      className={`absolute inset-0 ${
                        mood.id === "heartfelt"
                          ? "bg-gradient-to-br from-pink-500/30 to-purple-500/30"
                          : mood.id === "rage"
                            ? "bg-gradient-to-br from-red-600/30 to-orange-500/30"
                            : mood.id === "funny"
                              ? "bg-gradient-to-br from-yellow-400/30 to-orange-400/30"
                              : mood.id === "sad"
                                ? "bg-gradient-to-br from-blue-500/30 to-indigo-500/30"
                                : mood.id === "calm"
                                  ? "bg-gradient-to-br from-green-400/30 to-teal-500/30"
                                  : "bg-gradient-to-br from-slate-600/30 to-slate-700/30"
                      }`}
                    ></div>

                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {mood.id === "heartfelt" && <HeartfeltAnimation className="w-full h-full" />}
                      {mood.id === "rage" && <RageAnimation className="w-full h-full" />}
                      {mood.id === "funny" && <FunnyAnimation className="w-full h-full" />}
                      {mood.id === "sad" && <SadAnimation className="w-full h-full" />}
                      {mood.id === "calm" && <CalmAnimation className="w-full h-full" />}
                      {mood.id === "robotic" && <RoboticAnimation className="w-full h-full" />}
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

// Mood animations
function HeartfeltAnimation({ className }: { className: string }) {
  return (
    <div className={`${className} relative`}>
      <motion.div
        className="absolute"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <Heart size={100} className="text-pink-500" fill="rgba(236, 72, 153, 0.3)" />
      </motion.div>
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * 300 - 150,
            y: Math.random() * 300 - 150,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
          }}
        >
          <Heart size={20 + Math.random() * 30} className="text-pink-400" />
        </motion.div>
      ))}
    </div>
  )
}

function RageAnimation({ className }: { className: string }) {
  return (
    <div className={`${className} relative`}>
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-orange-500"
          initial={{
            x: 150,
            y: 150,
            opacity: 0,
          }}
          animate={{
            x: 150 + Math.cos(i) * 150,
            y: 150 + Math.sin(i) * 150,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <Flame size={80} className="text-red-500" />
      </motion.div>
    </div>
  )
}

function FunnyAnimation({ className }: { className: string }) {
  return (
    <div className={`${className} relative`}>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          rotate: [0, 10, -10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <Laugh size={80} className="text-yellow-400" />
      </motion.div>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`,
            left: `${Math.random() * 100}%`,
            top: 0,
          }}
          animate={{
            y: [0, 300],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

function SadAnimation({ className }: { className: string }) {
  return (
    <div className={`${className} relative overflow-hidden`}>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          y: [0, 5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <Frown size={80} className="text-blue-400" />
      </motion.div>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-6 bg-blue-400/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: [0, 300],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  )
}

function CalmAnimation({ className }: { className: string }) {
  return (
    <div className={`${className} relative`}>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <Cloud size={80} className="text-green-400" />
      </motion.div>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * 300,
            y: Math.random() * 300,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * 300,
            y: Math.random() * 300,
            opacity: [0, 0.5, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
          }}
        >
          <Cloud size={30 + Math.random() * 20} className="text-teal-400/30" />
        </motion.div>
      ))}
    </div>
  )
}

function RoboticAnimation({ className }: { className: string }) {
  return (
    <div className={`${className} relative`}>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <Cpu size={80} className="text-slate-400" />
      </motion.div>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 bg-slate-400/30"
          style={{
            width: `${Math.random() * 50 + 10}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            width: [`${Math.random() * 50 + 10}px`, `${Math.random() * 100 + 50}px`],
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}
