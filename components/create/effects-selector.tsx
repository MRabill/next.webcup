"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { visualEffects } from "@/lib/data"
import EffectPreview from "@/components/create/effect-preview"

interface EffectsSelectorProps {
  mood: string
  visualEffects: string[]
  onUpdate: (data: { visualEffects: string[] }) => void
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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Add Visual Effects</h2>
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
                <div key={effect.id} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={`effect-${effect.id}`} className="font-medium">
                      {effect.name}
                    </Label>
                    <p className="text-sm text-gray-400">{effect.description}</p>
                  </div>
                  <Switch
                    id={`effect-${effect.id}`}
                    checked={effects.includes(effect.id)}
                    onCheckedChange={() => handleEffectToggle(effect.id)}
                  />
                </div>
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
            <div className="relative h-[300px] rounded-lg overflow-hidden bg-slate-900/50">
              <EffectPreview mood={mood} effects={effects} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
