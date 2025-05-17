"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Briefcase, Heart, Users, MapPin, Rocket, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { relationshipTypes } from "@/lib/data"

interface RelationshipContextProps {
  relationship: string
  context: string
  onUpdate: (data: { relationship: string; context: string }) => void
}

const typeIcons: Record<string, React.ReactNode> = {
  job: <Briefcase className="h-5 w-5 text-blue-400" />,
  relationship: <Heart className="h-5 w-5 text-pink-400" />,
  team: <Users className="h-5 w-5 text-green-400" />,
  location: <MapPin className="h-5 w-5 text-purple-400" />,
  project: <Rocket className="h-5 w-5 text-orange-400" />,
  custom: <Sparkles className="h-5 w-5 text-yellow-400" />,
}

export default function RelationshipContext({ relationship, context, onUpdate }: RelationshipContextProps) {
  const [selectedRelationship, setSelectedRelationship] = useState(relationship)
  const [contextText, setContextText] = useState(context)

  const handleRelationshipChange = (value: string) => {
    setSelectedRelationship(value)
    onUpdate({ relationship: value, context: contextText })
  }

  const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContextText(e.target.value)
    onUpdate({ relationship: selectedRelationship, context: e.target.value })
  }

  return (
    <div className="relative">
      {/* Animated/illustrated header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <motion.div
          initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, -10, 0], opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <Sparkles className="h-8 w-8 text-purple-400 drop-shadow-lg" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold mb-1">What Are You Leaving?</h2>
          <p className="text-gray-300">Tell us about your departure context to help generate the perfect message.</p>
        </div>
      </div>

      <Card className="bg-white/5 border-none mb-6">
        <CardHeader>
          <CardTitle>Relationship Type</CardTitle>
          <CardDescription>Select what kind of departure this is</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedRelationship}
            onValueChange={handleRelationshipChange}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {relationshipTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.04, boxShadow: "0 0 0 4px rgba(168,85,247,0.15)" }}
                whileTap={{ scale: 0.97 }}
                animate={selectedRelationship === type.id ? { scale: 1.03, boxShadow: "0 0 0 6px rgba(168,85,247,0.25)" } : {}}
                className="relative"
              >
                <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                <Label
                  htmlFor={type.id}
                  className="flex flex-col gap-2 p-4 rounded-md border border-white/20 cursor-pointer hover:bg-white/10 transition-colors peer-data-[state=checked]:border-2 peer-data-[state=checked]:border-purple-500 peer-data-[state=checked]:bg-purple-500/10"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {typeIcons[type.id]}
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {type.examples.map((ex, i) => (
                      <span key={i}>
                        {ex}
                        {i < type.examples.length - 1 ? " • " : ""}
                      </span>
                    ))}
                  </span>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-none">
        <CardHeader>
          <CardTitle>Departure Context</CardTitle>
          <CardDescription>Provide details about your situation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe your departure situation (e.g., 'Leaving my toxic job after 3 years', 'Breaking up with my partner of 2 years', 'Moving away from my hometown')"
              className="min-h-[150px] bg-white/5 border-white/20 text-white"
              value={contextText}
              onChange={handleContextChange}
            />
            <p className="text-sm text-gray-400">
              This information will be used to generate your personalized farewell message.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
