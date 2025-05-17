// Background music tracks for different moods

export const backgroundMusic = {
  heartfelt: {
    src: "/music/heartfelt-piano.mp3",
    title: "Emotional Piano",
    artist: "Ambient Music",
  },
  rage: {
    src: "/music/rage-rock.mp3",
    title: "Intense Rock",
    artist: "Heavy Beats",
  },
  funny: {
    src: "/music/funny-upbeat.mp3",
    title: "Upbeat Comedy",
    artist: "Happy Tunes",
  },
  sad: {
    src: "/music/sad-violin.mp3",
    title: "Melancholy Strings",
    artist: "Emotional Orchestra",
  },
  calm: {
    src: "/music/calm-ambient.mp3",
    title: "Peaceful Ambient",
    artist: "Zen Sounds",
  },
  robotic: {
    src: "/music/robotic-electronic.mp3",
    title: "Digital Sequence",
    artist: "Electronic Waves",
  },
  default: {
    src: "/music/default-theme.mp3",
    title: "TheEnd Theme",
    artist: "Exit Music",
  },
}

// Mock function to get music for a mood
export function getMusicForMood(mood: string) {
  return backgroundMusic[mood as keyof typeof backgroundMusic] || backgroundMusic.default
}
