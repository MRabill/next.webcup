import { Heart, Flame, Laugh, Frown, Cloud, Cpu } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface MoodType {
  id: string
  name: string
  description: string
  color: string
  features: string[]
  prompt: string
  icon: LucideIcon
}

export const moods: MoodType[] = [
  {
    id: "heartfelt",
    name: "Heartfelt",
    description: "Express genuine emotions and appreciation in your farewell.",
    color: "pink",
    features: [
      "Warm, emotional tone",
      "Gentle animations with hearts",
      "Emotional background music",
    ],
    prompt: "Generate a heartfelt, emotional goodbye message expressing gratitude and fond memories.",
    icon: Heart,
  },
  {
    id: "rage",
    name: "Rage",
    description: "Let out all your frustration and anger in a fiery exit.",
    color: "red",
    features: [
      "Bold, aggressive tone",
      "Fire and explosion animations",
      "Intense background sounds",
    ],
    prompt: "Generate an angry, frustrated goodbye message that expresses disappointment and frustration.",
    icon: Flame,
  },
  {
    id: "funny",
    name: "Funny",
    description: "Make them laugh one last time with a humorous departure.",
    color: "yellow",
    features: ["Witty, sarcastic tone", "Bouncy, playful animations", "Upbeat, comedic sounds"],
    prompt: "Generate a funny, witty goodbye message with humor and light-hearted jokes.",
    icon: Laugh,
  },
  {
    id: "sad",
    name: "Sad",
    description: "Express your sorrow and nostalgia as you say goodbye.",
    color: "blue",
    features: [
      "Melancholic, reflective tone",
      "Rain and tear animations",
      "Sad violin or piano music",
    ],
    prompt: "Generate a sad, emotional goodbye message expressing loss and nostalgia.",
    icon: Frown,
  },
  {
    id: "calm",
    name: "Calm",
    description: "A peaceful, zen-like departure with no hard feelings.",
    color: "green",
    features: [
      "Serene, peaceful tone",
      "Gentle floating animations",
      "Ambient, calming sounds",
    ],
    prompt: "Generate a calm, peaceful goodbye message that's accepting and forward-looking.",
    icon: Cloud,
  },
  {
    id: "robotic",
    name: "Robotic",
    description: "A cold, calculated, emotionless exit.",
    color: "gray",
    features: [
      "Logical, unemotional tone",
      "Digital, glitch animations",
      "Electronic, mechanical sounds",
    ],
    prompt: "Generate a robotic, emotionless goodbye message that's factual and direct.",
    icon: Cpu,
  },
]

export const relationshipTypes = [
  {
    id: "job",
    name: "Job/Workplace",
    examples: ["Quitting a job", "Leaving a company", "Career change"],
  },
  {
    id: "relationship",
    name: "Relationship",
    examples: ["Breaking up", "Divorce", "Ending a friendship"],
  },
  {
    id: "team",
    name: "Team/Group",
    examples: ["Leaving a team", "Exiting a club", "Departing a community"],
  },
  {
    id: "location",
    name: "Location",
    examples: ["Moving cities", "Leaving a country", "Changing neighborhoods"],
  },
  {
    id: "project",
    name: "Project/Venture",
    examples: ["Ending a collaboration", "Shutting down a startup", "Finishing a project"],
  },
  {
    id: "custom",
    name: "Custom",
    examples: ["Create your own context"],
  },
]

export const soundEffects = [
  {
    id: "door-slam",
    name: "Door Slam",
    url: "/sounds/door-slam.mp3",
    mood: "rage",
  },
  {
    id: "sad-violin",
    name: "Sad Violin",
    url: "/sounds/sad-violin.mp3",
    mood: "sad",
  },
  {
    id: "mic-drop",
    name: "Mic Drop",
    url: "/sounds/mic-drop.mp3",
    mood: "funny",
  },
  {
    id: "heart-beat",
    name: "Heart Beat",
    url: "/sounds/heart-beat.mp3",
    mood: "heartfelt",
  },
  {
    id: "zen-chime",
    name: "Zen Chime",
    url: "/sounds/zen-chime.mp3",
    mood: "calm",
  },
  {
    id: "computer-shutdown",
    name: "Computer Shutdown",
    url: "/sounds/computer-shutdown.mp3",
    mood: "robotic",
  },
  {
    id: "explosion",
    name: "Explosion",
    url: "/sounds/explosion.mp3",
    mood: "rage",
  },
  {
    id: "laugh-track",
    name: "Laugh Track",
    url: "/sounds/laugh-track.mp3",
    mood: "funny",
  },
]

export const visualEffects = [
  {
    id: "fire",
    name: "Fire Particles",
    mood: "rage",
    description: "Fiery particles that explode across the screen",
  },
  {
    id: "rain",
    name: "Rain Drops",
    mood: "sad",
    description: "Gentle rain falling down the screen",
  },
  {
    id: "confetti",
    name: "Confetti Explosion",
    mood: "funny",
    description: "Colorful confetti bursting across the screen",
  },
  {
    id: "hearts",
    name: "Floating Hearts",
    mood: "heartfelt",
    description: "Hearts that float gently across the screen",
  },
  {
    id: "bubbles",
    name: "Zen Bubbles",
    mood: "calm",
    description: "Peaceful bubbles that float upward",
  },
  {
    id: "glitch",
    name: "Digital Glitch",
    mood: "robotic",
    description: "Digital glitch effects across the screen",
  },
  {
    id: "shatter",
    name: "Glass Shatter",
    mood: "rage",
    description: "Screen shatters like broken glass",
  },
  {
    id: "stars",
    name: "Twinkling Stars",
    mood: "calm",
    description: "Gentle twinkling stars in the background",
  },
]
