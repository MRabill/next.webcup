"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, RefreshCw, FileText, Heading as HeadingIcon, MessageCircle, Sparkles } from "lucide-react"
import { moods } from "@/lib/data"
import { generateFarewellMessage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import ApiStatusBadge from "./api-status-badge"
import { motion } from "framer-motion"

interface MessageGeneratorProps {
  mood: string
  relationship: string
  context: string
  message: string
  title: string
  onUpdate: (data: { message: string; title: string }) => void
  username?: string
  email?: string
}

export default function MessageGenerator({
  mood,
  relationship,
  context,
  message,
  title,
  onUpdate,
  username = "User",
  email = "user@example.com",
}: MessageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState(message)
  const [generatedTitle, setGeneratedTitle] = useState(title)
  const [editedMessage, setEditedMessage] = useState(message)
  const [editedTitle, setEditedTitle] = useState(title)
  const { toast } = useToast()

  const generateContent = useCallback(async () => {
    if (!mood || !relationship || !context) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields before generating a message.",
        variant: "destructive",
        className: "top-0 right-0",
        duration: 3000,
      })
      return
    }

    setIsGenerating(true)

    let newTitle = ""
    if (mood === "heartfelt") {
      newTitle = `A Heartfelt Farewell: My Journey Ends Here`
    } else if (mood === "rage") {
      newTitle = `Burning Bridges: Why I'm Done With This`
    } else if (mood === "funny") {
      newTitle = `So Long, and Thanks for All the Fish!`
    } else if (mood === "sad") {
      newTitle = `The Hardest Goodbye: Parting Ways`
    } else if (mood === "calm") {
      newTitle = `Moving Forward: A Peaceful Departure`
    } else if (mood === "robotic") {
      newTitle = `Termination Notice: End of Engagement`
    }

    const finalTitle = title || editedTitle || newTitle

    try {
      let apiAvailable = true;
      if (typeof window !== 'undefined') {
        const apiStatus = sessionStorage.getItem('api_connection_status');
        if (apiStatus === 'error') {
          apiAvailable = false;
        }
      }

      if (!apiAvailable) {
        throw new Error('API is currently unavailable');
      }

      toast({
        title: "Generating message",
        description: "Contacting the AI service to create your personalized farewell...",
        className: "top-0 right-0",
        duration: 3000,
      })

      const generatedFarewell = await generateFarewellMessage(
        username,
        email,
        mood,
        relationship,
        context,
        finalTitle
      )

      setGeneratedTitle(finalTitle)
      setGeneratedMessage(generatedFarewell)
      setEditedTitle(finalTitle)
      setEditedMessage(generatedFarewell)
      onUpdate({ title: finalTitle, message: generatedFarewell })

      toast({
        title: "Message generated",
        description: "Your personalized farewell message is ready. Feel free to edit it to make it perfect!",
        className: "top-0 right-0",
        duration: 3000,
      })
    } catch (error) {
      let errorMessage = "There was a problem connecting to the AI service. Using a fallback message instead.";

      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.name === 'AbortError') {
          errorMessage = "The AI service is taking too long to respond. Using a fallback message instead.";
        } else if (error.message.includes('unavailable')) {
          errorMessage = "The AI service is currently unavailable. Using a locally generated message instead.";
        }
      }

      toast({
        title: "Message generation limited",
        description: errorMessage,
        variant: "destructive",
        className: "top-0 right-0",
        duration: 3000,
      })

      const selectedMood = moods.find((m) => m.id === mood)
      if (selectedMood) {
        let fallbackMessage = ""
        if (mood === "heartfelt") {
          fallbackMessage = `As I write this farewell message, my heart is filled with gratitude...`
        } else if (mood === "rage") {
          fallbackMessage = `I've reached my breaking point, and there's no turning back...`
        } else if (mood === "funny") {
          fallbackMessage = `Well folks, it's been real, it's been fun, but it hasn't been real fun!...`
        } else if (mood === "sad") {
          fallbackMessage = `With a heavy heart and tears I cannot hide, I find myself writing these words of goodbye...`
        } else if (mood === "calm") {
          fallbackMessage = `As I embark on a new path, I wanted to take a moment to express my gratitude...`
        } else if (mood === "robotic") {
          fallbackMessage = `NOTICE OF TERMINATION\n\nI, ${username}, hereby provide formal notification...`
        }

        setGeneratedTitle(finalTitle)
        setGeneratedMessage(fallbackMessage)
        setEditedTitle(finalTitle)
        setEditedMessage(fallbackMessage)
        onUpdate({ title: finalTitle, message: fallbackMessage })
      }
    } finally {
      setIsGenerating(false)
    }
  }, [mood, relationship, context, title, editedTitle, username, email, toast, onUpdate])

  useEffect(() => {
    if (mood && relationship && context && !message) {
      generateContent();
    }
  }, [mood, relationship, context, message, generateContent]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
    onUpdate({ title: e.target.value, message: editedMessage });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedMessage(e.target.value)
    onUpdate({ title: editedTitle, message: e.target.value })
  }

  const handleRegenerate = () => {
    generateContent()
  }

  return (
    <div>
      <div className="flex flex-col mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, -10, 0], opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              <Sparkles className="h-8 w-8 text-purple-400 drop-shadow-lg" />
            </motion.div>
            <h2 className="text-2xl font-bold">Craft Your Farewell Message</h2>
          </div>
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <ApiStatusBadge />
          </motion.span>
        </div>
        <p className="text-gray-300">Our AI will generate a personalized message based on your mood and context. Feel free to edit it.</p>
      </div>

      <Card className="bg-white/5 border-none mb-6">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <HeadingIcon className="h-5 w-5 text-purple-400" />
            <CardTitle>Your Exit Page Title</CardTitle>
          </div>
          <CardDescription>This will be the headline of your departure page</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter a title for your exit page"
            className="bg-white/5 border-white/20 text-white"
            value={editedTitle}
            onChange={handleTitleChange}
            disabled={isGenerating}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-none">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className="h-5 w-5 text-purple-400" />
            <CardTitle>Your Farewell Message</CardTitle>
          </div>
          <CardDescription>Express your final thoughts and feelings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <motion.div
              className="absolute inset-0 pointer-events-none z-0"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <Sparkles className="absolute left-4 top-4 h-8 w-8 text-purple-400/30 animate-pulse-slow" />
              <Sparkles className="absolute right-8 bottom-8 h-6 w-6 text-purple-400/20 animate-pulse-slow" />
            </motion.div>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 relative z-10">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-400 mb-4" />
                <p className="text-gray-400">Generating your message...</p>
              </div>
            ) : (
              <Textarea
                placeholder="Write your farewell message here..."
                className="min-h-[200px] bg-white/5 border-white/20 text-white relative z-10"
                value={editedMessage}
                onChange={handleMessageChange}
                disabled={isGenerating}
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <motion.div
            whileHover={{ scale: 1.07, rotate: -8 }}
            whileTap={{ scale: 0.97, rotate: 0 }}
          >
            <Button variant="outline" onClick={handleRegenerate} disabled={isGenerating} className="border-purple-500 text-purple-300 hover:bg-purple-500/10 flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} /> Regenerate Message
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  )
}