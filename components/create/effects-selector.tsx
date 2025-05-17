"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { visualEffects } from "@/lib/data"
import EffectPreview from "@/components/create/effect-preview"
import { Sparkles, Flame, Cloud, Heart, Star, Zap, Wand2, GlassWater, PartyPopper, Cpu } from "lucide-react"

interface EffectsSelectorProps {
  mood: string
  visualEffects: string[]
  onUpdate: (data: { visualEffects: string[] }) => void
}

const effectIcons: Record<string, React.ReactNode> = {
  fire: <Flame className="h-5 w-5 text-orange-400" />,
  rain: <Cloud className="h-5 w-5 text-blue-400" />,
  confetti: <PartyPopper className="h-5 w-5 text-yellow-400" />,
  hearts: <Heart className="h-5 w-5 text-pink-400" />,
  bubbles: <GlassWater className="h-5 w-5 text-teal-400" />,
  glitch: <Cpu className="h-5 w-5 text-slate-400" />,
  shatter: <Zap className="h-5 w-5 text-purple-400" />,
  stars: <Star className="h-5 w-5 text-white" />,
}

export default function EffectsSelector({ mood, visualEffects: selectedEffects, onUpdate }: EffectsSelectorProps) {
  const [effects, setEffects] = useState<string[]>(selectedEffects || [])

  const handleEffectToggle = (effectId: string) => {
    let newEffects
    if (effects.includes(effectId)) {
      newEffects = effects.filter((id) => id !== effectId)
    } else {
      newEffects = [...effects, effectId]
    }
    setEffects(newEffects)
    onUpdate({ visualEffects: newEffects })
  }

  // Filter effects by mood, but also include some general effects
  const filteredEffects = visualEffects.filter(
    (effect) => effect.mood === mood || effect.mood === "all" || effects.includes(effect.id),
  )

  return (
    <div>
      {/* Animated/illustrated header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, -10, 0], opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <Sparkles className="h-8 w-8 text-purple-400 drop-shadow-lg" />
          </motion.div>
          <h2 className="text-2xl font-bold">Add Visual Effects</h2>
        </div>
        <p className="text-gray-300">Enhance your exit page with dynamic visual effects that match your mood.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-none">
          <CardHeader>
            <CardTitle>Choose Effects</CardTitle>
            <CardDescription>Select the visual effects for your exit page</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEffects.map((effect) => (
                <motion.div
                  key={effect.id}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 0 1.5px #a78bfa" }}
                  whileTap={{ scale: 0.97 }}
                  animate={effects.includes(effect.id) ? { scale: 1.02, boxShadow: "0 0 0 2px #a78bfa" } : {}}
                  className="flex items-center justify-between rounded-lg px-2 py-1 transition-all"
                >
                  <div className="flex items-center gap-2">
                    {effectIcons[effect.id]}
                    <Label htmlFor={`effect-${effect.id}`} className="font-medium">
                      {effect.name}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400 mr-2">{effect.description}</p>
                    <Switch
                      id={`effect-${effect.id}`}
                      checked={effects.includes(effect.id)}
                      onCheckedChange={() => handleEffectToggle(effect.id)}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-none">
          <CardHeader>
            <CardTitle>Effect Preview</CardTitle>
            <CardDescription>See how your selected effects will look</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              className="relative h-[300px] rounded-lg overflow-hidden bg-slate-900/50 border-2 border-purple-400/30"
              initial={{ boxShadow: "0 0 0 0px #a78bfa" }}
              animate={{ boxShadow: ["0 0 0 0px #a78bfa", "0 0 24px 4px #a78bfa", "0 0 0 0px #a78bfa"] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <EffectPreview mood={mood} effects={effects} />
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
