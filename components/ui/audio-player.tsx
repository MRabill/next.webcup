"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface AudioPlayerProps {
  src: string
  autoPlay?: boolean
  loop?: boolean
  volume?: number
  className?: string
  onEnded?: () => void
  hidden?: boolean
  showTitle?: boolean
  title?: string
  artist?: string
}

// Helper function to get error messages
const getAudioErrorMessage = (code?: number): string => {
  if (code === undefined) return "Unknown audio error"
  
  switch(code) {
    case MediaError.MEDIA_ERR_ABORTED:
      return "Playback was aborted"
    case MediaError.MEDIA_ERR_NETWORK:
      return "Network error occurred"
    case MediaError.MEDIA_ERR_DECODE:
      return "Audio decoding failed"
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return "Audio format not supported"
    default:
      return `Unknown error (code: ${code})`
  }
}

export default function AudioPlayer({
  src,
  autoPlay = false,
  loop = true,
  volume: initialVolume = 0.5,
  className,
  onEnded,
  hidden = false,
  showTitle = false,
  title = "",
  artist = "",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(initialVolume)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)

  // Initialize audio element and event listeners
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoaded(true)
      setIsError(false)
      setErrorMessage("")
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false)
        onEnded?.()
      }
    }

    const handleError = () => {
      const error = audio.error
      const message = error 
        ? `Audio error: ${getAudioErrorMessage(error.code)}`
        : "Unknown audio playback error"
      
      console.error(message)
      setErrorMessage(message)
      setIsError(true)
      setIsLoaded(false)
      setIsPlaying(false)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      // Clean up any pending play promises
      playPromiseRef.current?.catch(() => {})
      playPromiseRef.current = null
      
      // Clean up audio element
      audio.pause()
      audio.src = ""
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)

      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [loop, onEnded])

  // Handle source changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.src = src
    audio.volume = isMuted ? 0 : volume
    audio.loop = loop
    setIsLoaded(false)
    setIsError(false)
    setErrorMessage("")

    const playAfterLoad = async () => {
      try {
        if (isPlaying) {
          playPromiseRef.current = audio.play()
          await playPromiseRef.current
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to play audio"
        console.error("Playback error:", message)
        setErrorMessage(message)
        setIsError(true)
        setIsPlaying(false)
      } finally {
        playPromiseRef.current = null
      }
    }

    // Some browsers require the audio to be loaded before playing
    audio.load()
    playAfterLoad()
  }, [src, isPlaying, volume, isMuted, loop])

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isLoaded) return

    const handlePlayback = async () => {
      try {
        if (isPlaying) {
          playPromiseRef.current = audio.play()
          await playPromiseRef.current
        } else {
          audio.pause()
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Playback failed"
        console.error("Playback error:", message)
        setErrorMessage(message)
        setIsError(true)
        setIsPlaying(false)
      } finally {
        playPromiseRef.current = null
      }
    }

    handlePlayback()
  }, [isPlaying, isLoaded])

  // Handle initial autoplay
  useEffect(() => {
    if (autoPlay && isLoaded && !isError) {
      setIsPlaying(true)
    }
  }, [autoPlay, isLoaded, isError])

  // Auto-hide player after 5 seconds of inactivity
  useEffect(() => {
    if (hidden) return

    setIsVisible(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 5000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [hidden, isPlaying, volume, isMuted, currentTime])

  const togglePlay = () => {
    if (!isLoaded || isError) return
    setIsPlaying(prev => !prev)
  }

  const toggleMute = () => setIsMuted(!isMuted)

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  if (hidden) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg",
            className,
            isError && "bg-red-900/20" // Visual feedback for errors
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            setIsVisible(true)
          }}
          onMouseLeave={() => {
            timeoutRef.current = setTimeout(() => setIsVisible(false), 5000)
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 text-white hover:bg-white/20",
              isError && "text-red-400" // Visual feedback for errors
            )}
            onClick={togglePlay}
            disabled={!isLoaded || isError}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>

          {showTitle && title && (
            <div className="hidden sm:block max-w-[120px] overflow-hidden">
              <p className="text-xs font-medium truncate text-white">{title}</p>
              {artist && <p className="text-xs text-white/70 truncate">{artist}</p>}
            </div>
          )}

          <div className="hidden sm:flex items-center space-x-2 min-w-[100px]">
            <Slider 
              value={[volume]} 
              max={1} 
              step={0.01} 
              onValueChange={handleVolumeChange} 
              className="w-20"
              disabled={isError}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8 text-white hover:bg-white/20",
                isError && "text-red-400" // Visual feedback for errors
              )}
              onClick={toggleMute}
              disabled={isError}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
          </div>

          <div className={cn(
            "text-xs",
            isError ? "text-red-300" : "text-white/70"
          )}>
            {isError ? (
              <span title={errorMessage}>Error</span>
            ) : isLoaded ? (
              formatTime(currentTime)
            ) : (
              "Loading..."
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}