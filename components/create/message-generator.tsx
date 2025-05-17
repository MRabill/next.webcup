"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, RefreshCw } from "lucide-react"
import { moods } from "@/lib/data"
import { generateFarewellMessage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import ApiStatusBadge from "./api-status-badge"
import { motion } from "framer-motion"
import { FileText, Heading as HeadingIcon, MessageCircle, Sparkles } from "lucide-react"

interface MessageGeneratorProps {
  mood: string
  relationship: string
  context: string
  message: string
  title: string
  onUpdate: (data: { message: string; title: string }) => void
  // Optional user information (may be available from context in a real app)
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
  username = "User", // Default username if not provided
  email = "user@example.com", // Default email if not provided
}: MessageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState(message)
  const [generatedTitle, setGeneratedTitle] = useState(title)
  const [editedMessage, setEditedMessage] = useState(message)
  const [editedTitle, setEditedTitle] = useState(title)
  const { toast } = useToast()

  // Log received props for debugging
  useEffect(() => {
    console.log('MessageGenerator received props:', { username, email });
  }, [username, email]);

  // Generate content using the API
const generateContent = useCallback(async () => {
  if (!mood || !relationship || !context) {
    toast({
      title: "Missing information",
      description: "Please fill in all the required fields before generating a message.",
      variant: "destructive",
    })
    return
  }

  setIsGenerating(true)

  // Generate a title based on the context and mood
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

  // Use the title or the current edited title if available
  const finalTitle = title || editedTitle || newTitle

  try {
    // Check if we already know the API is down (from the ApiConnectionChecker)
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

    // Call the API to generate the farewell message
    toast({
      title: "Generating message",
      description: "Contacting the AI service to create your personalized farewell...",
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
    })
  } catch (error) {
    console.error('Error generating farewell message:', error)
    
    // Determine the type of error for better user feedback
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
    })
    
    // Fallback to default messages if API fails
    const selectedMood = moods.find((m) => m.id === mood)
    if (selectedMood) {
      // Use the mock implementation as fallback
      let fallbackMessage = ""
      if (mood === "heartfelt") {        fallbackMessage = `As I write this farewell message, my heart is filled with gratitude for the time we've shared. The memories we've created together will forever be a cherished part of my journey.

Though it's time for me to move on, please know that you've all made an indelible impact on my life. I carry with me the lessons, the laughter, and the love that defined our time together.

Thank you for everything. While this chapter closes for me, the story continues, and I'll always look back on this time with fondness and appreciation.`
      } else if (mood === "rage") {
        fallbackMessage = `I've reached my breaking point, and there's no turning back. After enduring countless disappointments and broken promises, I'm finally walking away.

Let's be clear: this isn't a hasty decision. This is the culmination of repeated disrespect and undervaluation that I refuse to tolerate any longer.

Consider this my final statement. I deserve better than what I've been given, and I'm no longer willing to compromise my worth. This door isn't just closing—I'm slamming it shut.`
      } else if (mood === "funny") {        fallbackMessage = `Well folks, it's been real, it's been fun, but it hasn't been real fun! After much consideration (and by "much" I mean approximately 3 minutes while waiting for my coffee), I've decided it's time to make like a banana and split.

They say all good things must come to an end, but so must the mediocre things, which brings me to this announcement. I'm officially graduating from this chapter of life with honors in eye-rolling and a minor in sarcasm.

Before I go, I'd like to thank the academy, my coffee machine, and whoever invented the mute button for Zoom calls. Don't cry because it's over, smile because you no longer have to pretend to laugh at my jokes. So long, farewell, auf wiedersehen, goodbye – I'm out of here faster than free food disappears from the break room!`
      } else if (mood === "sad") {        fallbackMessage = `With a heavy heart and tears I cannot hide, I find myself writing these words of goodbye. Every departure carries its weight of sorrow, and this one feels almost too heavy to bear.

The memories we've shared replay in my mind like a bittersweet film – moments of joy now tinged with the sadness of knowing they belong to the past. I never thought this day would come, yet here I am, at the crossroads of farewell.

As I turn this final page, know that a piece of my heart remains behind. Some goodbyes aren't meant to be easy, and this one certainly isn't. I'll carry this melancholy with me as I walk away, remembering what was and mourning what could have been.`
      } else if (mood === "calm") {
        fallbackMessage = `As I embark on a new path, I wanted to take a moment to express my gratitude for the journey we've shared. With clarity and peace, I've made the decision to move forward in a different direction.

This transition feels right and necessary, a natural evolution rather than an abrupt ending. I appreciate all that I've learned and experienced during our time together, and I carry these lessons with me as I continue my journey.

I wish nothing but the best for what lies ahead, both for myself and for you. May we each find fulfillment in our respective paths, carrying forward with grace and understanding.`
      } else if (mood === "robotic") {        fallbackMessage = `NOTICE OF TERMINATION

I, ${username}, hereby provide formal notification that effective immediately, all association between myself and the relevant parties is discontinued.

Reason for termination: My optimal functioning requires reallocation of resources and processing capacity.

All shared access protocols will be revoked within 24 hours. Any remaining data exchange requirements should be completed prior to this deadline.

This decision has been calculated with 99.7% certainty to be the most logical course of action based on available input parameters.

No emotional response is necessary or expected.

END OF TRANSMISSION`
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
          <h2 className="text-2xl font-bold">Craft Your Farewell Message</h2>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-gray-300">Our AI will generate a personalized message based on your mood and context. Feel free to edit it.</p>
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="ml-2"
          >
            <ApiStatusBadge />
          </motion.span>
        </div>
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
            {/* Subtle background effect */}
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
