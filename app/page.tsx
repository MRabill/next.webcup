"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles, Flame, Heart, Frown, Cloud, Bot, Laugh, ArrowRight, PartyPopper, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { FeatureCard } from "@/components/feature-card"
import { BackgroundAnimation } from "@/components/background-animation"
import AudioPlayer from "@/components/ui/audio-player"

// Typing effect hook (returns [displayed, done])
function useTypingEffect(text: string, speed: number, resetKey: any) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;
    let i = 0;
    function typeNext() {
      setDisplayed(text.slice(0, i + 1));
      if (i < text.length - 1) {
        i++;
        setTimeout(typeNext, speed);
      } else {
        setDone(true);
      }
    }
    typeNext();
    // Clean up: if resetKey changes, stop typing
    return () => setDone(true);
  }, [text, speed, resetKey]);
  return [displayed, done] as const;
}

export default function LandingPage() {
  const router = useRouter()
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Easter Egg state
  const [easterEgg, setEasterEgg] = useState(false);
  const keyBuffer = useRef<string>("");

  // Listen for 'wow' key sequence
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      keyBuffer.current += e.key.toLowerCase();
      if (keyBuffer.current.length > 10) keyBuffer.current = keyBuffer.current.slice(-10);
      if (keyBuffer.current.includes("wow")) {
        setEasterEgg(true);
        keyBuffer.current = "";
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Hide easter egg after a while
  useEffect(() => {
    if (!easterEgg) return;
    const timeout = setTimeout(() => setEasterEgg(false), 3500);
    return () => clearTimeout(timeout);
  }, [easterEgg]);

  // Quote carousel state
  const quotes = [
    {
      title: "Your Grand Exit, Your Way",
      subtitle: "Create unforgettable goodbye messages with stunning animations and effects",
    },
    {
      title: "Leave a Lasting Impression",
      subtitle: "Say goodbye in style with personalized animations and heartfelt messages.",
    },
    {
      title: "Make Every Farewell Memorable",
      subtitle: "Transform your exit into a celebration with unique effects and visuals.",
    },
    {
      title: "Goodbyes, Reimagined",
      subtitle: "Express your emotions with creative, interactive exit pages.",
    },
    {
      title: "Parting is Such Sweet Sorrow",
      subtitle: "Turn every goodbye into a beautiful memory with our animated farewells.",
    },
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteDirection, setQuoteDirection] = useState(1);

  // Typing effect for title only
  const [typedTitle, titleDone] = useTypingEffect(quotes[quoteIndex].title, 120, quoteIndex);
  const typedSubtitle = quotes[quoteIndex].subtitle;
  const subtitleDone = true;

  // Control quote change only after typing is done
  useEffect(() => {
    if (!titleDone) return;
    const timeout = setTimeout(() => {
      setQuoteDirection(1);
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 1500); // Pause after typing before next quote
    return () => clearTimeout(timeout);
  }, [titleDone, quotes.length]);

  // Create four featured cards for the corners
  const features = [
    {
      icon: <Flame className="h-8 w-8 text-red-500" />,
      title: "Rage Mode",
      description: "Express your frustration with explosive animations and effects",
      color: "bg-red-500/10",
      borderColor: "border-red-500/20",
      position: "top-[15%] left-[10%]", // Top left
      rotation: -12,
      carouselItems: [
        {
          title: "Rage Mode",
          description: "Let your emotions out with our explosive Rage Mode exit pages. Perfect for saying goodbye to things that frustrate you. Features include flame effects, explosive animations, and screen shaking for maximum impact.",
          color: "bg-red-500/30",
        },
        {
          title: "Customize Your Rage",
          description: "Choose from multiple anger levels, from mild annoyance to full-blown fury. Each level comes with unique visual and audio effects that match the intensity of your feelings.",
          color: "bg-red-600/30",
        },
        {
          title: "Special Effects",
          description: "Add dramatic sound effects, screen cracks, particle explosions and more to create an exit page that truly expresses your frustration in style.",
          color: "bg-orange-500/30",
        }
      ]
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Heartfelt Goodbyes",
      description: "Create sincere, emotional farewells with floating hearts",
      color: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
      position: "top-[15%] right-[10%]", // Top right
      rotation: 12,
      carouselItems: [
        {
          title: "Heartfelt Goodbyes",
          description: "Create meaningful farewell messages with our emotional templates. Perfect for telling someone how much they mean to you or expressing gratitude for shared experiences.",
          color: "bg-pink-500/30",
        },
        {
          title: "Emotional Effects",
          description: "Choose from a variety of heartwarming animations, including floating hearts, gentle particle effects, and warm color transitions to complement your message.",
          color: "bg-pink-600/30",
        },
        {
          title: "Personal Touch",
          description: "Add photos, personal messages, and custom music to create a truly memorable goodbye experience for someone special.",
          color: "bg-rose-400/30",
        }
      ]
    },
    {
      icon: <Laugh className="h-8 w-8 text-yellow-500" />,
      title: "Funny Exits",
      description: "Leave them laughing with confetti and bouncing emojis",
      color: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      position: "bottom-[15%] left-[10%]", // Bottom left
      rotation: 12,
      carouselItems: [
        {
          title: "Funny Exits",
          description: "End on a high note with our humorous exit pages. Perfect for light-hearted goodbyes or when you want to leave people smiling as you go.",
          color: "bg-yellow-500/30",
        },
        {
          title: "Comedy Elements",
          description: "Add bouncing emojis, confetti explosions, silly sound effects, and animated jokes to keep the mood light and entertaining.",
          color: "bg-yellow-600/30",
        },
        {
          title: "Meme Generator",
          description: "Include popular memes and customize them with your own text to create a personalized funny exit that will be remembered.",
          color: "bg-amber-500/30",
        }
      ]
    },
    {
      icon: <Frown className="h-8 w-8 text-blue-500" />,
      title: "Sad Departures",
      description: "Set the mood with rain effects and melancholic visuals",
      color: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      position: "bottom-[15%] right-[10%]", // Bottom right
      rotation: -12,
      carouselItems: [
        {
          title: "Sad Departures",
          description: "For those difficult goodbyes, our melancholic templates help express the emotions of parting. Perfect for solemn or bittersweet farewells.",
          color: "bg-blue-500/30",
        },
        {
          title: "Melancholic Effects",
          description: "Set the mood with gentle rain animations, fading colors, and slow transitions that capture the feeling of a meaningful ending.",
          color: "bg-blue-600/30",
        },
        {
          title: "Emotional Music",
          description: "Choose from a selection of moving background music and sound effects to complement your farewell message.",
          color: "bg-indigo-500/30",
        }
      ]
    },
  ]

  const handleExitClick = () => {
    setIsExiting(true)
    setTimeout(() => {
      router.push("/onboarding")
    }, 1000)
  }

  const handleGalleryClick = () => {
    console.log("Gallery button clicked");

    setIsExiting(true)
    setTimeout(() => {
      router.push("/gallery")
    }, 1000)
  }
  // Keep track of expanded card to pause the rotation
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null)

  const handleFeatureClick = (index: number) => {
    // Toggle expanded state
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null)
    } else {
      setExpandedCardIndex(index)
    }
  }

  useEffect(() => {
    // Only cycle through features when no card is expanded
    if (expandedCardIndex !== null) return

    const interval = setInterval(() => {
      setActiveFeature((prev) => {
        if (prev === null || prev >= features.length - 1) {
          return 0
        }
        return prev + 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [features.length, expandedCardIndex])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackgroundAnimation />        {/* Mini Audio Player with Now Playing Text */}
        <div className="fixed bottom-4 right-4 z-20 flex items-center gap-3">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            size="icon"
            className="rounded-full bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-600 hover:to-pink-600 text-white shadow-lg h-10 w-10 flex items-center justify-center"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <motion.div 
            className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center"
            >
              <span className="text-xs text-white/90 mr-2">Now Playing:</span>
              <span className="text-sm font-medium text-white">Adele - Skyfall</span>
            </motion.div>
          </motion.div>
          <AudioPlayer 
            src="/sounds/thisIsTheEnd.mp3" 
            autoPlay={!isMuted}
            loop={true}
            volume={isMuted ? 0 : 0.3}
            className="w-auto"
          />
        </div>

        {/* Easter Egg Hidden Spot */}
        <button
          aria-label="Easter Egg"
          className="fixed bottom-2 left-2 w-4 h-4 opacity-0 z-50"
          tabIndex={-1}
          onClick={() => setEasterEgg(true)}
        />

        {/* Easter Egg Animation/Message */}
        <AnimatePresence>
          {easterEgg && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <motion.div
                className="bg-gradient-to-br from-pink-500 to-yellow-400 rounded-2xl shadow-2xl px-12 py-10 flex flex-col items-center"
                initial={{ rotate: -10 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: 2, duration: 1.2 }}
              >
                <PartyPopper className="w-16 h-16 mb-4 text-white drop-shadow-lg animate-bounce" />
                <h3 className="text-3xl font-extrabold mb-2 text-white drop-shadow">WOW! 🎉</h3>
                <p className="text-lg text-white/90">You found the secret! Enjoy this little celebration. 🥳</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-pink-500 mr-2" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500">
              theend.page
            </h1>
          </div>
          <Button
            onClick={handleGalleryClick}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            size="lg"
          >
            Gallery <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </header>

        {/* Center Quote - Animated Carousel */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="text-center max-w-3xl px-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <h2 className="text-5xl md:text-7xl font-extrabold mb-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 min-h-[2.7em]">
                  {typedTitle}
                </h2>
                <p className="text-xl md:text-2xl text-slate-300 mb-6 min-h-[2.2em] mt-1">
                  {typedSubtitle}
                </p>
              </motion.div>
            </AnimatePresence>
            <Button
              onClick={handleExitClick}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-lg"
            >
              Create Your Exit Page <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Feature Cards - placed in corners with 3D effect */}
        <div className="perspective-[1200px] absolute inset-0">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={cn("absolute z-10", feature.position)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: (activeFeature === index && expandedCardIndex === null) ? 1.05 : 1,
                boxShadow: (activeFeature === index && expandedCardIndex === null) ? "0 0 20px rgba(255, 255, 255, 0.2)" : "none",
              }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >             
             <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                borderColor={feature.borderColor}
                isActive={activeFeature === index && expandedCardIndex === null}
                onClick={() => handleFeatureClick(index)}
                initialRotation={feature.rotation}
                carouselItems={feature.carouselItems}
                emojiType={index === 0 ? "rage" : index === 1 ? "heart" : index === 2 ? "funny" : "sad"}
              />
            </motion.div>
          ))}
        </div>

        {/* Exit Animation Overlay */}
        {isExiting && (
          <motion.div
            className="absolute inset-0 bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
