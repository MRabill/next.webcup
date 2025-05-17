// This is a mock implementation of text-to-speech functionality
// In a real app, you would use a service like ElevenLabs or OpenAI's TTS

export async function generateSpeech(text: string, voice = "default") {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // In a real app, this would return an audio URL
  return {
    audioUrl: "/sounds/mock-tts.mp3",
    duration: 30, // seconds
  }
}
