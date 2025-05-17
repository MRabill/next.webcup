import { MessageSquare, ImageIcon, Music, Sparkles, Share2, Video } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "AI-powered Farewell Generator",
      description:
        "Generate the perfect goodbye message with our AI assistant. Choose your tone, provide context, and let AI craft your words.",
    },
    {
      icon: ImageIcon,
      title: "GIF & Meme Picker",
      description:
        "Search and embed the perfect GIFs and memes to express your emotions. A picture is worth a thousand words.",
    },
    {
      icon: Music,
      title: "Audio Upload & Soundboard",
      description: "Add your voice note or choose from dramatic audio clips to enhance your departure message.",
    },
    {
      icon: Sparkles,
      title: "Mood-Based Effects",
      description: "Enjoy dynamic visual effects that match your chosen mood - from raging fire to gentle tears.",
    },
    {
      icon: Video,
      title: "Final Words Video Generator",
      description: "Transform your message into a dynamic video with text animations and AI-generated speech.",
    },
    {
      icon: Share2,
      title: "Sharable Custom URL",
      description: "Get a unique link to share your departure page with anyone you want to say goodbye to.",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20 bg-slate-900/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Craft Your Perfect Goodbye</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Our platform gives you all the tools you need to create a memorable departure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white/5 p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
