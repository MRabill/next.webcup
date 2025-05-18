"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Copy, 
  Share2, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  Download, 
  Calendar, 
  Clock, 
  ChevronRight,
  Twitter,
  Linkedin,
  Facebook,
  Send,
  Smile,
  Image,
  MapPin,
  Award,
  Briefcase,
  Star,
  ArrowRight,
  Users,
  Pencil,
  Trash2,
  Plus,
  MessageCircle,
  Check
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import EnhancedParticles from "@/components/effects/enhanced-particles"
import AudioPlayer from "@/components/ui/audio-player"
import { getMusicForMood } from "@/lib/music"
import { ThemeToggle } from "@/components/theme-toggle"
import MoodTransition from "@/components/effects/mood-transition"
import EffectPreview from "@/components/create/effect-preview"
import { getExitPageData, type ExitPageData } from "@/lib/exit-page-store"
import html2canvas from "html2canvas"
import { Separator } from "@/components/ui/separator"
import FormModal from "@/components/ui/form-modal"

const REACTION_EMOJIS = ["👍", "❤️", "😢", "😮", "👏", "🔥"] //test

export default function PreviewPage() {
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)
  const navbarRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  
  const [isMuted, setIsMuted] = useState(false)
  const [comment, setComment] = useState("")
  const [mood, setMood] = useState("dramatic")
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [likedComments, setLikedComments] = useState<number[]>([])
  const [previousMood, setPreviousMood] = useState<string | undefined>(undefined)
  const [showMoodTransition, setShowMoodTransition] = useState(false)
  const [exitPageData, setExitPageData] = useState<ExitPageData | null>(null)
  const [publicLink, setPublicLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [commentReactions, setCommentReactions] = useState<Record<number, string[]>>({})
  const [activeTab, setActiveTab] = useState("message")
  const [localStorageAvailable, setLocalStorageAvailable] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<any>(null)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [editingAchievement, setEditingAchievement] = useState<any>(null)
  const [showShareSection, setShowShareSection] = useState(false)

  // Add achievements state
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Increased team productivity by 35%",
      description: "Through process improvements and automation",
      color: "green"
    }
  ])

  // Check if localStorage is available
  const checkLocalStorageAvailability = () => {
    try {
      const testKey = '__test_key__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Timeline data with default values
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      date: "2025-19-05",
      title: "Joined Endpage",
      description: "Started an Endpage to document his journey",
      icon: <Briefcase className="h-5 w-5 text-indigo-400" />
    },
   
  ])

  // Future plans with default values
  const [futurePlans, setFuturePlans] = useState([
    {
      id: 1,
      title: "Taking a break",
      description: "Going on a 2-month trip around Europe to recharge"
    },
    {
      id: 2,
      title: "Launching a startup",
      description: "Working on my SaaS idea that I've been planning for years"
    },
    {
      id: 3,
      title: "Open to opportunities",
      description: "Feel free to reach out if you have an exciting opportunity!"
    }
  ])
  // Comments stored in local storage
  const [comments, setComments] = useState<Array<{
    id: number;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
    likes: number;
  }>>([])
    useEffect(() => {
    setIsLoaded(true)

    // Load saved exit page data
    const savedData = getExitPageData();
    if (savedData) {
      setExitPageData(savedData);
      // Update mood from saved data
      if (savedData.mood) {
        setMood(savedData.mood);
      }
    }

    // Add scroll event listener
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Generate a public link
    setPublicLink(generateUniqueLink())

    // Trigger mood transition effect
    setShowMoodTransition(true)
    const moodTransitionTimer = setTimeout(() => setShowMoodTransition(false), 2000)

    // Simulate the "slam the door" effect
    const doorSlamTimer = setTimeout(() => {
      const doorSlam = new Audio("/sounds/door-slam.mp3")
      if (!isMuted) {
        doorSlam.volume = 0.3
        doorSlam.play().catch((err) => console.error("Failed to play sound:", err))
      }
    }, 1000)    
    
    // Check localStorage availability
    const storageAvailable = checkLocalStorageAvailability()
    setLocalStorageAvailable(storageAvailable)    
    
    // Load comments from localStorage if available
    if (storageAvailable) {
      loadCommentsFromLocalStorage();
      loadTimelineFromLocalStorage();
    }

    // Load achievements from localStorage if available
    if (localStorageAvailable) {
      const savedAchievements = localStorage.getItem('exit_page_achievements')
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements))
      }
    }

    // Cleanup function to remove event listeners and clear timers
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(moodTransitionTimer);
      clearTimeout(doorSlamTimer);
    };
  }, [isMuted, localStorageAvailable]); // Add isMuted and localStorageAvailable to dependency array for the door slam effect

  // Define localStorage functions outside of useEffect
  const saveCommentsToLocalStorage = (comments: any[], reactions: Record<number, string[]>, liked: number[] = likedComments) => {
    if (!localStorageAvailable) return;
    
    try {
      localStorage.setItem('exit_page_comments', JSON.stringify(comments));
      localStorage.setItem('exit_page_reactions', JSON.stringify(reactions));
      localStorage.setItem('exit_page_liked_comments', JSON.stringify(liked));
    } catch (e) {
      console.error('Failed to save comments to localStorage:', e);
    }
  };

  // Function to save timeline data to localStorage
  const saveTimelineToLocalStorage = (milestoneData: any[] = milestones, futurePlansData: any[] = futurePlans) => {
    if (!localStorageAvailable) return;
    
    try {
      // Convert React elements to serializable strings before saving
      const serializableMilestones = milestoneData.map(milestone => {
        // Create a copy to avoid modifying the original
        const serializedMilestone = { ...milestone };
        
        // Convert icon React element to a string identifier
        if (serializedMilestone.icon) {
          // Identify the icon type by its class name or other properties
          const iconElement = serializedMilestone.icon as React.ReactElement;
          if (iconElement.type === Briefcase) {
            serializedMilestone.iconType = 'briefcase';
          } else if (iconElement.type === Star) {
            serializedMilestone.iconType = 'star';
          } else if (iconElement.type === Award) {
            serializedMilestone.iconType = 'award';
          } else if (iconElement.type === Users) {
            serializedMilestone.iconType = 'users';
          } else {
            serializedMilestone.iconType = 'briefcase'; // Default fallback
          }
          
          // Remove the non-serializable icon property
          delete serializedMilestone.icon;
        }
        
        return serializedMilestone;
      });
      
      localStorage.setItem('exit_page_milestones', JSON.stringify(serializableMilestones));
      localStorage.setItem('exit_page_future_plans', JSON.stringify(futurePlansData));
    } catch (e) {
      console.error('Failed to save timeline data to localStorage:', e);
    }
  };
  
  const loadCommentsFromLocalStorage = () => {
    if (!localStorageAvailable) return;
    
    try {
      const savedComments = localStorage.getItem('exit_page_comments');
      const savedReactions = localStorage.getItem('exit_page_reactions');
      const savedLikedComments = localStorage.getItem('exit_page_liked_comments');
      
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
      
      if (savedReactions) {
        setCommentReactions(JSON.parse(savedReactions));
      }
      
      if (savedLikedComments) {
        setLikedComments(JSON.parse(savedLikedComments));
      }
    } catch (e) {
      console.error('Failed to load comments from localStorage:', e);
    }
  };

  // Function to load timeline data from localStorage
  const loadTimelineFromLocalStorage = () => {
    if (!localStorageAvailable) return;
    
    try {
      const savedMilestones = localStorage.getItem('exit_page_milestones');
      const savedFuturePlans = localStorage.getItem('exit_page_future_plans');
      
      if (savedMilestones) {
        // Parse the JSON string and transform it back to include React elements
        const parsedMilestones = JSON.parse(savedMilestones);
        
        // Convert serialized milestones back to objects with React elements
        const milestonesWithIcons = parsedMilestones.map((milestone: any) => {
          // If we have an iconType property, convert it back to a React element
          if (milestone.iconType) {
            let icon;
            switch(milestone.iconType) {
              case 'star': 
                icon = <Star className="h-5 w-5 text-yellow-400" />;
                break;
              case 'award': 
                icon = <Award className="h-5 w-5 text-emerald-400" />;
                break;
              case 'users': 
                icon = <Users className="h-5 w-5 text-blue-400" />;
                break;
              case 'briefcase':
              default:
                icon = <Briefcase className="h-5 w-5 text-indigo-400" />;
                break;
            }
            // Replace the iconType with the actual icon
            return {
              ...milestone,
              icon
            };
          }
          return milestone;
        });
        
        setMilestones(milestonesWithIcons);
      }
      
      if (savedFuturePlans) {
        setFuturePlans(JSON.parse(savedFuturePlans));
      }
    } catch (e) {
      console.error('Failed to load timeline data from localStorage:', e);
    }
  };
  const handleLikeComment = (id: number) => {
    let updatedComments = [...comments];
    if (likedComments.includes(id)) {
      // Unlike
      updatedComments = comments.map((comment) => 
        comment.id === id ? { ...comment, likes: comment.likes - 1 } : comment
      );
      const updatedLikedComments = likedComments.filter((commentId) => commentId !== id);
      setComments(updatedComments);
      setLikedComments(updatedLikedComments);
    } else {
      // Like
      updatedComments = comments.map((comment) => 
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
      );
      const updatedLikedComments = [...likedComments, id];
      setComments(updatedComments);
      setLikedComments(updatedLikedComments);
    }
    
    // Save to localStorage
    if (localStorageAvailable) {
      saveCommentsToLocalStorage(updatedComments, commentReactions);
    }
  }
  const handleAddReaction = (commentId: number, emoji: string) => {
    const currentReactions = commentReactions[commentId] || [];
    let updatedReactions = { ...commentReactions };
    
    if (currentReactions.includes(emoji)) {
      updatedReactions = {
        ...commentReactions,
        [commentId]: currentReactions.filter(e => e !== emoji)
      };
    } else {
      updatedReactions = {
        ...commentReactions,
        [commentId]: [...currentReactions, emoji]
      };
    }
    
    setCommentReactions(updatedReactions);
    
    // Save to localStorage
    if (localStorageAvailable) {
      saveCommentsToLocalStorage(comments, updatedReactions);
    }
  }
  const handleSendComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: comments.length + 1,
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: comment,
      timestamp: "Just now",
      likes: 0,
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setComment("");
    
    // Save to localStorage
    if (localStorageAvailable) {
      saveCommentsToLocalStorage(updatedComments, commentReactions);
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleMoodChange = (newMood: string) => {
    setPreviousMood(mood)
    setMood(newMood)
    setShowMoodTransition(true)
    setTimeout(() => setShowMoodTransition(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink)
      .then(() => {
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 3000)
      })
      .catch(err => console.error('Failed to copy: ', err))
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: exitPageData?.title || 'My Exit Page',
        text: 'Check out my dramatic exit page!',
        url: publicLink
      })
      .catch(err => console.error('Error sharing: ', err))
    } else {
      setShowShareDialog(true)
    }
  }

  const handleDownloadAsImage = async () => {
    if (contentRef.current) {
      try {
        const canvas = await html2canvas(contentRef.current, {
          scale: 2,
          backgroundColor: null,
          logging: false,
        })
        
        const dataUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `${exitPageData?.title || 'my-exit-page'}.png`
        link.href = dataUrl
        link.click()
      } catch (error) {
        console.error('Error generating image:', error)
      }
    }
  }

  const handleShareToSocial = (platform: string) => {
    const text = encodeURIComponent(`Check out my dramatic exit page: ${exitPageData?.title || 'My Exit Page'}`)
    const url = encodeURIComponent(publicLink)
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
    }
    
    window.open(shareUrl, '_blank')
  }

  const generateUniqueLink = () => {
    return "https://codewaresreload.maurice.webcup.hodi.host/preview/"
  }

  const currentMusic = getMusicForMood(mood)

  // CSS style for the animation 
  const fadeInOutStyle = `
    @keyframes fadeInOut {
      0%, 100% { opacity: 0; }
      20%, 80% { opacity: 1; }
    }
    .animate-fade-in-out {
      animation: fadeInOut 2s ease-in-out;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .float {
      animation: float 6s ease-in-out infinite;
    }

    .parallax-bg {
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .glass-morphism {
      backdrop-filter: blur(8px);
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .timeline-item:not(:last-child)::before {
      content: '';
      position: absolute;
      top: 24px;
      left: 15px;
      bottom: -24px;
      width: 1px;
      background: rgba(255, 255, 255, 0.2);
    }
  `

  const getMoodColor = () => {
    switch(mood) {
      case "heartfelt": return "from-pink-500 to-purple-600"
      case "rage": return "from-red-600 to-orange-500"
      case "funny": return "from-yellow-400 to-amber-600"
      case "sad": return "from-blue-500 to-indigo-600"
      case "calm": return "from-green-500 to-emerald-600"
      default: return "from-indigo-600 to-purple-700"
    }
  }

  const getMoodTextColor = () => {
    switch(mood) {
      case "heartfelt": return "text-pink-400"
      case "rage": return "text-red-500"
      case "funny": return "text-yellow-400"
      case "sad": return "text-blue-400"
      case "calm": return "text-green-400"
      default: return "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
    }
  }

  const handleAddMilestone = (newMilestone: any) => {
    const icon = newMilestone.iconType === "star" ? <Star className="h-5 w-5 text-yellow-400" /> :
                newMilestone.iconType === "award" ? <Award className="h-5 w-5 text-emerald-400" /> :
                newMilestone.iconType === "users" ? <Users className="h-5 w-5 text-blue-400" /> :
                <Briefcase className="h-5 w-5 text-indigo-400" />

    const updatedMilestones = [...milestones, {
      ...newMilestone,
      id: milestones.length + 1,
      icon
    }]
    setMilestones(updatedMilestones)
    
    if (localStorageAvailable) {
      saveTimelineToLocalStorage(updatedMilestones, futurePlans)
    }
  }

  const handleEditMilestone = (id: number, updatedData: any) => {
    const icon = updatedData.iconType === "star" ? <Star className="h-5 w-5 text-yellow-400" /> :
                updatedData.iconType === "award" ? <Award className="h-5 w-5 text-emerald-400" /> :
                updatedData.iconType === "users" ? <Users className="h-5 w-5 text-blue-400" /> :
                <Briefcase className="h-5 w-5 text-indigo-400" />

    const updatedMilestones = milestones.map(milestone => 
      milestone.id === id ? { ...milestone, ...updatedData, icon } : milestone
    )
    setMilestones(updatedMilestones)
    
    if (localStorageAvailable) {
      saveTimelineToLocalStorage(updatedMilestones, futurePlans)
    }
  }

  const handleDeleteMilestone = (id: number) => {
    const updatedMilestones = milestones.filter(milestone => milestone.id !== id);
    setMilestones(updatedMilestones);
    
    // Save to localStorage
    if (localStorageAvailable) {
      saveTimelineToLocalStorage(updatedMilestones, futurePlans);
    }
  }

  const handleAddFuturePlan = (newPlan: any) => {
    const updatedPlans = [...futurePlans, {
      ...newPlan,
      id: futurePlans.length + 1
    }];
    setFuturePlans(updatedPlans);
    
    // Save to localStorage
    if (localStorageAvailable) {
      saveTimelineToLocalStorage(milestones, updatedPlans);
    }
  }

  const handleEditFuturePlan = (id: number, updatedData: any) => {
    const updatedPlans = futurePlans.map(plan => 
      plan.id === id ? { ...plan, ...updatedData } : plan
    );
    setFuturePlans(updatedPlans);
    
    // Save to localStorage
    if (localStorageAvailable) {
      saveTimelineToLocalStorage(milestones, updatedPlans);
    }
  }

  const handleDeleteFuturePlan = (id: number) => {
    const updatedPlans = futurePlans.filter(plan => plan.id !== id);
    setFuturePlans(updatedPlans);
    
    // Save to localStorage
    if (localStorageAvailable) {
      saveTimelineToLocalStorage(milestones, updatedPlans);
    }
  }

  // Add achievement handlers
  const handleAddAchievement = (newAchievement: any) => {
    const updatedAchievements = [...achievements, {
      ...newAchievement,
      id: achievements.length + 1
    }]
    setAchievements(updatedAchievements)
    
    if (localStorageAvailable) {
      localStorage.setItem('exit_page_achievements', JSON.stringify(updatedAchievements))
    }
  }

  const handleEditAchievement = (id: number, updatedData: any) => {
    const updatedAchievements = achievements.map(achievement => 
      achievement.id === id ? { ...achievement, ...updatedData } : achievement
    )
    setAchievements(updatedAchievements)
    
    if (localStorageAvailable) {
      localStorage.setItem('exit_page_achievements', JSON.stringify(updatedAchievements))
    }
  }

  const handleDeleteAchievement = (id: number) => {
    const updatedAchievements = achievements.filter(achievement => achievement.id !== id)
    setAchievements(updatedAchievements)
    
    if (localStorageAvailable) {
      localStorage.setItem('exit_page_achievements', JSON.stringify(updatedAchievements))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Style tag for custom animation */}
      <style jsx>{fadeInOutStyle}</style>

      {/* Navigation controls at the very top */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-slate-900/30 border-b border-white/5 shadow-sm">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Button variant="ghost" onClick={() => router.push("/create")} className="text-white hover:bg-white/10 rounded-full transition-all duration-200 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Editor</span>
          </Button>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-9 w-9 text-white hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              {isMuted ? 
                <VolumeX className="h-4 w-4 transition-transform hover:scale-110" /> : 
                <Volume2 className="h-4 w-4 transition-transform hover:scale-110" />
              }
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 rounded-full px-4 transition-all duration-200 flex items-center gap-1"
                >
                  <div className={`w-2 h-2 rounded-full mr-1 bg-${
                    mood === "heartfelt" ? "pink" : 
                    mood === "rage" ? "red" : 
                    mood === "funny" ? "yellow" : 
                    mood === "sad" ? "blue" : 
                    mood === "calm" ? "green" : 
                    "purple"}-500`}
                  />
                  <span>Change Mood</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2 grid grid-cols-2 gap-2 bg-slate-800/90 backdrop-blur-md border-slate-700">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleMoodChange("heartfelt")}
                  className={`justify-start px-3 py-5 transition-all duration-200 ${mood === "heartfelt" ? "bg-pink-950/50 border-pink-500/50" : ""}`}
                >
                  <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div> 
                  Heartfelt
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleMoodChange("rage")}
                  className={`justify-start px-3 py-5 transition-all duration-200 ${mood === "rage" ? "bg-red-950/50 border-red-500/50" : ""}`}
                >
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div> 
                  Rage
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleMoodChange("funny")}
                  className={`justify-start px-3 py-5 transition-all duration-200 ${mood === "funny" ? "bg-yellow-950/50 border-yellow-500/50" : ""}`}
                >
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div> 
                  Funny
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleMoodChange("sad")}
                  className={`justify-start px-3 py-5 transition-all duration-200 ${mood === "sad" ? "bg-blue-950/50 border-blue-500/50" : ""}`}
                >
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div> 
                  Sad
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleMoodChange("calm")}
                  className={`justify-start px-3 py-5 transition-all duration-200 ${mood === "calm" ? "bg-green-950/50 border-green-500/50" : ""}`}
                >
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div> 
                  Calm
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleMoodChange("dramatic")}
                  className={`justify-start px-3 py-5 transition-all duration-200 ${mood === "dramatic" ? "bg-purple-950/50 border-purple-500/50" : ""}`}
                >
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div> 
                  Dramatic
                </Button>
              </PopoverContent>
            </Popover>            
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Hero section with enhanced parallax effect */}
      <motion.div 
        className="h-[100vh] relative overflow-hidden"
        style={{ opacity, scale }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${getMoodColor()} opacity-50`}></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-25 parallax-bg"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%)]"></div>
        <EnhancedParticles mood={mood} intensity="high" />
        
        <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-4"
          >
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-5 py-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white/80" />
              <span className="text-sm font-medium text-white/80">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-6xl md:text-8xl font-black mb-6 ${getMoodTextColor()} drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]`}
            style={{
              animation: "float 6s ease-in-out infinite"
            }}
          >
            {exitPageData?.title || "My Dramatic Exit"}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <p className="text-xl md:text-2xl font-light text-white/90">
              A grand farewell from the stage of corporate life.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12"
          >
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' })
                setActiveTab('message')
              }}
              className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-full px-6 font-medium"
            >
              Read My Story
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{ 
            y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
            opacity: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
          }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-white" 
              animate={{ y: [0, 12, 0] }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </motion.div>

      {/* Add this after the hero section and before the content section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto px-4 -mt-20 relative z-20"
      >
        <Card className="glass-morphism border-none overflow-hidden rounded-xl shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2 border border-white/10">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-gray-300 truncate">{publicLink}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className={`h-8 px-3 rounded-md transition-all duration-200 ${
                  linkCopied 
                    ? "bg-green-500/20 text-green-400" 
                    : "hover:bg-white/10"
                }`}
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Background particles for the entire page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <EnhancedParticles mood={mood} intensity="low" />
      </div>

      {/* Mood transition effect */}
      <MoodTransition mood={mood} previousMood={previousMood ?? undefined} isActive={showMoodTransition} />
      
      {/* Audio player */}
      <AudioPlayer
        src={currentMusic.src}
        autoPlay={true}
        loop={true}
        volume={0.2}
        className="fixed bottom-4 right-4 z-50"
        showTitle={true}
        title={currentMusic.title}
        artist={currentMusic.artist}
      />

      {/* Content wrapper with gradient transition */}
      <div className="relative">
        {/* Content section marker for scrolling */}
        <div id="blog-section" className="absolute top-0 h-4 w-full"></div>
        
        <div className="bg-gradient-to-b from-slate-900/20 to-transparent h-8 w-full"></div>
        
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex items-center justify-between mb-8 w-full max-w-md mx-auto bg-slate-800/40 backdrop-blur-md rounded-full border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-visible h-14 px-2">
              <TabsTrigger 
                value="message" 
                className={`flex items-center justify-center gap-2 rounded-full h-10 px-5 transition-all duration-300 text-base font-semibold ${
                  activeTab === "message" 
                    ? "bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white shadow-lg" 
                    : "text-white/60 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <MessageCircle className="h-5 w-5" />
                Message
              </TabsTrigger>
              <TabsTrigger 
                value="timeline" 
                className={`flex items-center justify-center gap-2 rounded-full h-10 px-5 transition-all duration-300 text-base font-semibold ${
                  activeTab === "timeline" 
                    ? "bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white shadow-lg" 
                    : "text-white/60 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <Clock className="h-5 w-5" />
                Timeline
              </TabsTrigger>
              <TabsTrigger 
                value="next" 
                className={`flex items-center justify-center gap-2 rounded-full h-10 px-5 transition-all duration-300 text-base font-semibold ${
                  activeTab === "next" 
                    ? "bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white shadow-lg" 
                    : "text-white/60 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <ArrowRight className="h-5 w-5" />
                What's Next
              </TabsTrigger>
              {/* Pink dot indicator, absolutely positioned */}
              <span className="absolute top-1/2 right-3 -translate-y-1/2 w-3 h-3 rounded-full bg-pink-400 shadow-lg"></span>
            </TabsList>
            
            <TabsContent value="message" className="focus-visible:outline-none focus-visible:ring-0">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="glass-morphism border-none overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300" ref={contentRef}>
                    <CardContent className="p-0">
                      {/* Message Header */}
                      <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-white/10">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500">ME</AvatarFallback>
                            </Avatar>
                            <div>
                              <h2 className="text-xl font-bold">My Farewell Message</h2>
                              <p className="text-sm text-gray-400">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleMute}
                                    className="h-8 w-8 rounded-full text-white hover:bg-white/10 transition-colors duration-200"
                                  >
                                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-800 border-slate-700">
                                  <p>{isMuted ? "Unmute" : "Mute"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-full text-white hover:bg-white/10 transition-colors duration-200" 
                                    onClick={handleCopyLink}
                                  >
                                    <Copy className={`h-4 w-4 ${linkCopied ? "text-green-400" : ""}`} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-slate-800 border-slate-700">
                                  <p>{linkCopied ? "Copied!" : "Copy link"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="p-6">
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          transition={{ duration: 0.6 }}
                        >
                          <h1 className={`text-4xl md:text-5xl font-extrabold mb-8 ${
                            exitPageData?.mood === "heartfelt"
                              ? "text-pink-400"
                              : exitPageData?.mood === "rage"
                                ? "text-red-500"
                                : exitPageData?.mood === "funny"
                                  ? "text-yellow-400"
                                  : exitPageData?.mood === "sad"
                                    ? "text-blue-400"
                                    : exitPageData?.mood === "calm"
                                      ? "text-green-400"
                                      : "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                          }`}>
                            {exitPageData?.title || "My Dramatic Exit: The Final Curtain Call"}
                          </h1>

                          <div className="prose prose-invert max-w-none mb-10">
                            {exitPageData?.message ? (
                              exitPageData.message.split("\n\n").map((paragraph, index) => (
                                <motion.p
                                  key={index}
                                  className="text-lg md:text-xl leading-relaxed mb-6 font-light"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                                >
                                  {paragraph}
                                </motion.p>
                              ))
                            ) : (
                              // Fallback content if no message
                              <>
                                <motion.p
                                  className="text-lg md:text-xl leading-relaxed mb-6 font-light"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                  After 5 years of pouring my heart and soul into this company, it's time for the grand finale.
                                  This isn't just a resignation; it's the closing act of a chapter that deserved a standing
                                  ovation but got lukewarm applause instead.
                                </motion.p>

                                <motion.p
                                  className="text-lg md:text-xl leading-relaxed mb-6 font-light"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                  As I take my final bow, I'm not just walking away – I'm making an exit so spectacular, it'll be
                                  remembered long after the lights dim on my empty desk.
                                </motion.p>

                                <motion.p
                                  className="text-lg md:text-xl leading-relaxed mb-6 font-light"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.4 }}
                                >
                                  To those who supported me: thank you for being the audience that kept me going. To those who
                                  didn't: watch as I steal the show one last time.
                                </motion.p>

                                <motion.p
                                  className="text-lg md:text-xl leading-relaxed font-medium italic"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: 0.5 }}
                                >
                                  The curtain falls, but my story continues on a grander stage.
                                </motion.p>
                              </>
                            )}
                          </div>

                          {/* GIF section with improved design */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="mb-10"
                          >
                            {exitPageData?.gifs && exitPageData.gifs.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {exitPageData.gifs.map((gif, index) => (
                                  <div key={index} className="overflow-hidden rounded-xl shadow-lg border border-white/10 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <img
                                      src={gif}
                                      alt={`Selected GIF ${index + 1}`}
                                      className="w-full h-80 object-cover"
                                    />
                                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      Selected GIF {index + 1}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="overflow-hidden rounded-xl shadow-lg border border-white/10 relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <img
                                  src="https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif"
                                  alt="Dramatic exit GIF"
                                  className="w-full h-80 object-cover"
                                />
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  Dramatic exit moment
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Comments Section */}
                      <div className="border-t border-white/10">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <MessageSquare className="mr-2 h-5 w-5 text-indigo-400" />
                            Comments ({comments.length})
                          </h3>

                          {/* Comment Input */}
                          <div className="mb-6">
                            <div className="flex gap-3 items-start">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500">Y</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Input
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  placeholder="Write a comment..."
                                  className="bg-white/5 border-white/10 focus:border-white/20 rounded-xl"
                                />
                                <div className="flex justify-end mt-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-3 rounded-full bg-indigo-500/80 hover:bg-indigo-500 text-white"
                                    onClick={handleSendComment}
                                    disabled={!comment.trim()}
                                  >
                                    <Send className="h-4 w-4 mr-1" />
                                    Post
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-4">
                            <AnimatePresence>
                              {comments.map((comment, index) => (
                                <motion.div
                                  key={comment.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                  className="bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl p-4 border border-white/5 hover:border-white/10"
                                >
                                  <div className="flex items-start gap-3">
                                    <Avatar className="h-9 w-9 border-2 border-white/10 shadow-md">
                                      <AvatarImage src={"/placeholder.svg"} />
                                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500">{comment.author.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-center">
                                        <p className="text-sm font-semibold">{comment.author.name}</p>
                                        <p className="text-xs text-gray-400">{comment.timestamp}</p>
                                      </div>
                                      <p className="text-sm text-gray-300 mt-1 break-words leading-relaxed">{comment.content}</p>

                                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                                        {/* Reaction emojis */}
                                        <div className="flex -space-x-1 mr-2">
                                          {(commentReactions[comment.id] || []).slice(0, 3).map((emoji, i) => (
                                            <div 
                                              key={i} 
                                              className="w-5 h-5 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-xs shadow-md border border-white/10"
                                            >
                                              {emoji}
                                            </div>
                                          ))}
                                          {(commentReactions[comment.id] || []).length > 3 && (
                                            <div className="w-5 h-5 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-xs shadow-md border border-white/10">
                                              +{(commentReactions[comment.id] || []).length - 3}
                                            </div>
                                          )}
                                        </div>
                                        
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-7 px-2 text-xs hover:bg-white/10 rounded-full transition-colors duration-200"
                                            >
                                              <Smile className="h-3 w-3 mr-1" />
                                              React
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-2 flex gap-1 bg-slate-800/90 backdrop-blur-md border-slate-700">
                                            {REACTION_EMOJIS.map((emoji) => (
                                              <Button
                                                key={emoji}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAddReaction(comment.id, emoji)}
                                                className={`px-1.5 py-1 hover:bg-white/10 transition-colors duration-200 ${
                                                  (commentReactions[comment.id] || []).includes(emoji) 
                                                    ? "bg-white/10" 
                                                    : ""
                                                }`}
                                              >
                                                {emoji}
                                              </Button>
                                            ))}
                                          </PopoverContent>
                                        </Popover>

                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className={`h-7 px-2 text-xs ${likedComments.includes(comment.id) ? "text-pink-500" : "text-gray-400"} hover:bg-white/10 rounded-full transition-colors duration-200`}
                                          onClick={() => handleLikeComment(comment.id)}
                                        >
                                          <Heart className={`h-3 w-3 mr-1 ${likedComments.includes(comment.id) ? "fill-pink-500" : ""}`} />
                                          {comment.likes}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="timeline" className="focus-visible:outline-none focus-visible:ring-0">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-indigo-400" />
                    My Journey
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/5 backdrop-blur-md rounded-full px-4 py-1.5 text-sm font-medium border border-white/10">
                      2020 - 2024
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-indigo-400/30 hover:bg-indigo-500/20 text-indigo-300"
                      onClick={() => {
                        setEditingMilestone(null)
                        setShowMilestoneModal(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Milestone
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                  >
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-indigo-500/80 via-purple-500/50 to-transparent"></div>
                    
                    <div className="space-y-12">
                      {milestones.map((milestone, index) => (
                        <motion.div 
                          key={milestone.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
                          className="relative"
                        >
                          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className="w-10 h-10 rounded-full border-4 border-slate-900 bg-indigo-500 flex items-center justify-center shadow-lg">
                              {milestone.icon}
                            </div>
                          </div>
                            <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}>
                            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl transition-all duration-300 hover:shadow-indigo-500/10 hover:scale-[1.02] group h-full relative">
                              <div className="flex md:hidden items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-md">
                                  {milestone.icon}
                                </div>
                                <p className="text-xs font-semibold text-indigo-300">{milestone.date}</p>
                              </div>
                              
                              {/* Edit/Delete controls */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-full hover:bg-white/20"
                                  onClick={() => {
                                    setEditingMilestone(milestone)
                                    setShowMilestoneModal(true)
                                  }}
                                >
                                  <Pencil className="h-3.5 w-3.5 text-gray-400" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-full hover:bg-white/20"
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this milestone?")) {
                                      handleDeleteMilestone(milestone.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                                </Button>
                              </div>
                              
                              <p className="hidden md:block text-sm font-semibold text-indigo-300 mb-2">{milestone.date}</p>
                              <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors duration-300">{milestone.title}</h3>
                              <p className="text-gray-300">{milestone.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl border border-indigo-500/20 shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mr-4">
                          <Award className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Key Achievements</h3>
                          <p className="text-gray-400 text-sm">What I'm proud of</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-indigo-400/30 hover:bg-indigo-500/20 text-indigo-300"
                        onClick={() => {
                          setEditingAchievement(null)
                          setShowAchievementModal(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Achievement
                      </Button>
                    </div>
                    
                    <ul className="space-y-4">
                      {achievements.map((achievement) => (
                        <motion.li 
                          key={achievement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group relative"
                        >
                          <div className="flex items-start">
                            <div className={`w-6 h-6 rounded-full bg-${achievement.color}-500/20 flex items-center justify-center mr-3 mt-0.5`}>
                              <div className={`w-2 h-2 rounded-full bg-${achievement.color}-500`}></div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{achievement.title}</p>
                              <p className="text-sm text-gray-400">{achievement.description}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 ml-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 rounded-full hover:bg-white/10"
                                onClick={() => {
                                  setEditingAchievement(achievement)
                                  setShowAchievementModal(true)
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5 text-gray-400" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 rounded-full hover:bg-white/10"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this achievement?")) {
                                    handleDeleteAchievement(achievement.id)
                                  }
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                              </Button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="next" className="focus-visible:outline-none focus-visible:ring-0">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-indigo-400" />
                    What's Next For Me
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/5 backdrop-blur-md rounded-full px-4 py-1.5 text-sm font-medium border border-white/10">
                      Future Plans
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-indigo-400/30 hover:bg-indigo-500/20 text-indigo-300"
                      onClick={() => {
                        setEditingPlan(null)
                        setShowPlanModal(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Plan
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {futurePlans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
                    >
                      <div className="h-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
                          <div className="absolute inset-0 opacity-30">
                            <EnhancedParticles mood="default" intensity="low" />
                          </div>
                          <div className="absolute top-4 left-4">
                            {index === 0 ? (
                              <MapPin className="h-6 w-6 text-white" />
                            ) : index === 1 ? (
                              <Briefcase className="h-6 w-6 text-white" />
                            ) : (
                              <Users className="h-6 w-6 text-white" />
                            )}
                          </div>
                          {/* Edit/Delete controls for future plans */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 z-10">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-full bg-black/30 hover:bg-black/50"
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingPlan(plan)
                                setShowPlanModal(true)
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5 text-white" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-full bg-black/30 hover:bg-black/50"
                              onClick={(e) => {
                                e.stopPropagation()
                                if (confirm("Are you sure you want to delete this plan?")) {
                                  handleDeleteFuturePlan(plan.id)
                                }
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-white" />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>
                        </div>
                        
                        <div className="p-6 relative -mt-6">
                          <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-300 transition-colors duration-300">{plan.title}</h3>
                          <p className="text-gray-300">{plan.description}</p>
                          
                          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-xs text-gray-400">
                              {index === 0 ? "Starting June 2025" : index === 1 ? "Late 2025" : "Ongoing"}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 rounded-full px-3 hover:bg-white/10 text-indigo-300"
                            >
                              Learn more
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-12 p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-center"
                >
                  <h3 className="text-2xl font-bold mb-3">Want to stay connected?</h3>
                  <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                    This isn't goodbye, it's just a new chapter. Let's keep in touch as I embark on this new journey.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button variant="outline" className="rounded-full px-6 border-indigo-500/50 hover:bg-indigo-500/20">
                      <Linkedin className="mr-2 h-4 w-4" />
                      Connect on LinkedIn
                    </Button>
                    <Button variant="outline" className="rounded-full px-6 border-blue-500/50 hover:bg-blue-500/20">
                      <Twitter className="mr-2 h-4 w-4" />
                      Follow on Twitter
                    </Button>
                    <Button variant="outline" className="rounded-full px-6 border-pink-500/50 hover:bg-pink-500/20">
                      <Send className="mr-2 h-4 w-4" />
                      Send me an email
                    </Button>
                  </div>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <FormModal
        isOpen={showMilestoneModal}
        onClose={() => {
          setShowMilestoneModal(false)
          setEditingMilestone(null)
        }}
        onSubmit={(data) => {
          if (editingMilestone) {
            handleEditMilestone(editingMilestone.id, data)
          } else {
            handleAddMilestone(data)
          }
        }}
        title={editingMilestone ? "Edit Milestone" : "Add Milestone"}
        type="milestone"
        initialData={editingMilestone}
      />

      <FormModal
        isOpen={showPlanModal}
        onClose={() => {
          setShowPlanModal(false)
          setEditingPlan(null)
        }}
        onSubmit={(data) => {
          if (editingPlan) {
            handleEditFuturePlan(editingPlan.id, data)
          } else {
            handleAddFuturePlan(data)
          }
        }}
        title={editingPlan ? "Edit Plan" : "Add Plan"}
        type="plan"
        initialData={editingPlan}
      />

      <FormModal
        isOpen={showAchievementModal}
        onClose={() => {
          setShowAchievementModal(false)
          setEditingAchievement(null)
        }}
        onSubmit={(data) => {
          if (editingAchievement) {
            handleEditAchievement(editingAchievement.id, data)
          } else {
            handleAddAchievement(data)
          }
        }}
        title={editingAchievement ? "Edit Achievement" : "Add Achievement"}
        type="milestone"
        initialData={editingAchievement}
      />
    </div>
  )
}
