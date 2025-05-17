// This is a mock implementation of OpenAI integration
// In a real app, you would use the OpenAI API

import { moods } from "./data"

export async function generateExitMessage(mood: string, relationship: string, context: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const selectedMood = moods.find((m) => m.id === mood)
  const moodName = selectedMood?.name || "neutral"

  // Generate a title based on the context and mood
  let title = ""
  if (mood === "heartfelt") {
    title = `A Heartfelt Farewell: My Journey Ends Here`
  } else if (mood === "rage") {
    title = `Burning Bridges: Why I'm Done With This`
  } else if (mood === "funny") {
    title = `So Long, and Thanks for All the Fish!`
  } else if (mood === "sad") {
    title = `The Hardest Goodbye: Parting Ways`
  } else if (mood === "calm") {
    title = `Moving Forward: A Peaceful Departure`
  } else if (mood === "robotic") {
    title = `Termination Notice: End of Engagement`
  }
  // Generate a message based on the context and mood
  let message = ""
  if (mood === "heartfelt") {
    message = `As I write this farewell message, my heart is filled with gratitude for the time we've shared. The memories we've created together will forever be a cherished part of my journey.

Though it's time for me to move on, please know that you've all made an indelible impact on my life. I carry with me the lessons, the laughter, and the love that defined our time together.

Thank you for everything. While this chapter closes for me, the story continues, and I'll always look back on this time with fondness and appreciation.`
  } else if (mood === "rage") {
    message = `I've reached my breaking point, and there's no turning back. After enduring countless disappointments and broken promises, I'm finally walking away.

Let's be clear: this isn't a hasty decision. This is the culmination of repeated disrespect and undervaluation that I refuse to tolerate any longer.

Consider this my final statement. I deserve better than what I've been given, and I'm no longer willing to compromise my worth. This door isn't just closing—I'm slamming it shut.`
  } else if (mood === "funny") {    message = `Well folks, it's been real, it's been fun, but it hasn't been real fun! After much consideration (and by "much" I mean approximately 3 minutes while waiting for my coffee), I've decided it's time to make like a banana and split.

They say all good things must come to an end, but so must the mediocre things, which brings me to this announcement. I'm officially graduating from this chapter of life with honors in eye-rolling and a minor in sarcasm.

Before I go, I'd like to thank the academy, my coffee machine, and whoever invented the mute button for Zoom calls. Don't cry because it's over, smile because you no longer have to pretend to laugh at my jokes. So long, farewell, auf wiedersehen, goodbye – I'm out of here faster than free food disappears from the break room!`
  } else if (mood === "sad") {    message = `With a heavy heart and tears I cannot hide, I find myself writing these words of goodbye. Every departure carries its weight of sorrow, and this one feels almost too heavy to bear.

The memories we've shared replay in my mind like a bittersweet film – moments of joy now tinged with the sadness of knowing they belong to the past. I never thought this day would come, yet here I am, at the crossroads of farewell.

As I turn this final page, know that a piece of my heart remains behind. Some goodbyes aren't meant to be easy, and this one certainly isn't. I'll carry this melancholy with me as I walk away, remembering what was and mourning what could have been.`
  } else if (mood === "calm") {
    message = `As I embark on a new path, I wanted to take a moment to express my gratitude for the journey we've shared. With clarity and peace, I've made the decision to move forward in a different direction.

This transition feels right and necessary, a natural evolution rather than an abrupt ending. I appreciate all that I've learned and experienced during our time together, and I carry these lessons with me as I continue my journey.

I wish nothing but the best for what lies ahead, both for myself and for you. May we each find fulfillment in our respective paths, carrying forward with grace and understanding.`
  } else if (mood === "robotic") {    message = `NOTICE OF TERMINATION

I hereby provide formal notification that effective immediately, all association between myself and the relevant parties is discontinued.

Reason for termination: My optimal functioning requires reallocation of resources and processing capacity.

All shared access protocols will be revoked within 24 hours. Any remaining data exchange requirements should be completed prior to this deadline.

This decision has been calculated with 99.7% certainty to be the most logical course of action based on available input parameters.

No emotional response is necessary or expected.

END OF TRANSMISSION`
  }

  return {
    title,
    message,
  }
}
