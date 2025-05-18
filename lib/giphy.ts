// This is a mock implementation of Giphy API integration
// In a real app, you would use the Giphy API

export async function searchGifs(query: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock GIFs for the demo
  const mockGifs = [
    // Dramatic exits
    "https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif",
    "https://media.giphy.com/media/3o7btQsLqXMJAPu6Na/giphy.gif",
    "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif",
    "https://media.giphy.com/media/l378rrt5tAawaCQ9i/giphy.gif",
    "https://media.giphy.com/media/l0HlDJhyI8qoh7Wfu/giphy.gif",
    "https://media.giphy.com/media/3o7btQMdq4a44tXod2/giphy.gif",
    "https://media.giphy.com/media/3o7btPCwlw9CaFH9Cg/giphy.gif",
    "https://media.giphy.com/media/3o7btSHUTdraHEsx0Y/giphy.gif",
    // Funny exits
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    // Sad exits
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    // Heartfelt exits
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    // Calm exits
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
    "https://media.giphy.com/media/3o7btT1T9qpTZqCwni/giphy.gif",
  ]

  // Filter GIFs based on query (in a real app, this would be done by the API)
  if (!query) {
    return mockGifs
  }

  // Just return a random subset of the mock GIFs to simulate search
  return mockGifs.sort(() => 0.5 - Math.random()).slice(0, 4)
}
