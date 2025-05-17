// API service for communicating with external APIs

/**
 * Interface for the farewell message API request
 */
export interface FarewellMessageRequest {
  prompt: string;
  instructions: string;
}

/**
 * Interface for the farewell message API response
 */
export interface FarewellMessageResponse {
  success: boolean;
  message: string;
  payload: string;
  timestamp: string;
}

/**
 * Test the API connection
 * @param retryCount Number of retries attempted so far
 * @returns Promise with the API test response
 */
export async function testApiConnection(retryCount = 0): Promise<FarewellMessageResponse> {
  try {
    // Set up timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout for test
    
    try {
      const response = await fetch('https://api.testpapers.mu/webcup/generate-farewell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({          prompt: "Give me a short farewell message from the perspective of someone leaving",
          instructions: "You are a farewell message generator. Generate a message from the first-person perspective of the person who is leaving. Write as if they are addressing others directly. Only respond with the farewell message, nothing more."
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json() as FarewellMessageResponse;
      
      // Store the timestamp of the last successful connection
      if (typeof window !== 'undefined' && data.success) {
        sessionStorage.setItem('api_last_success', new Date().toISOString());
      }
      
      return data;
    } catch (fetchError) {
      // Clear the timeout
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error testing API connection:', error);
    
    // Try to retry once with a short delay for the connection test
    if (retryCount < 1) {
      console.log('Retrying connection test once...');
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(testApiConnection(retryCount + 1));
        }, 1000);
      });
    }
    
    // Return a failed response object if all retries fail
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error testing API connection',
      payload: '',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Generates a farewell message from the API
 * @param username - The username of the person leaving
 * @param email - The email of the person leaving
 * @param mood - The mood/emotion of the exit
 * @param relationship - The relationship type being ended
 * @param context - The departure context
 * @param title - The exit page title
 * @returns Promise with the generated farewell message
 */
export async function generateFarewellMessage(
  username: string,
  email: string,
  mood: string,
  relationship: string,
  context: string,
  title: string,
  retryCount = 0
): Promise<string> {
  try {
    // Check for cached response first (only if in browser environment)
    const cacheKey = `farewell_${username}_${mood}_${relationship}_${context.substring(0, 20)}`;
    let cachedResponse = null;
    
    if (typeof window !== 'undefined' && window.sessionStorage) {
      cachedResponse = sessionStorage.getItem(cacheKey);
    }
    
    if (cachedResponse) {
      console.log('Using cached farewell message');
      return cachedResponse;
    }
    
    // Sanitize inputs to prevent any issues with API
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMood = sanitizeInput(mood);
    const sanitizedRelationship = sanitizeInput(relationship);
    const sanitizedContext = sanitizeInput(context);
    const sanitizedTitle = sanitizeInput(title);
    
    // Format the mood name for better readability
    const formattedMood = formatMoodName(sanitizedMood);
    
    // Debug info
    console.log('Generating farewell message with:', {
      username: sanitizedUsername,
      email: sanitizedEmail,
      mood: formattedMood,
      relationship: sanitizedRelationship
    });
    
    const prompt = `Generate a farewell message from the perspective of ${sanitizedUsername} (${sanitizedEmail}) who is leaving with a ${formattedMood} mood. The relationship type being left is ${sanitizedRelationship} and the context is "${sanitizedContext}". The exit page title is "${sanitizedTitle}".`;
    
    const instructions = `You are a farewell message generator. Generate a personalized farewell message from the first-person perspective of the person who is leaving. The message should match the specified mood (${formattedMood}), relationship type (${sanitizedRelationship}), and context. Make it personal using the provided username as if they are writing it themselves, and consider the title of the exit page. Only respond with the farewell message, nothing more.`;
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
    
    try {
      const response = await fetch('https://api.testpapers.mu/webcup/generate-farewell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          instructions
        } as FarewellMessageRequest),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json() as FarewellMessageResponse;
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to generate farewell message');
      }
      
      // Cache successful response if in browser
      if (typeof window !== 'undefined' && window.sessionStorage && data.payload) {
        sessionStorage.setItem(cacheKey, data.payload);
      }

      return data.payload;
    } catch (fetchError) {
      // Clear the timeout if there was an error
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error generating farewell message:', error);
    
    // Try to retry up to 2 times with exponential backoff
    if (retryCount < 2) {
      console.log(`Retrying API call, attempt ${retryCount + 1}`);
      const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(generateFarewellMessage(
            username, email, mood, relationship, context, title, retryCount + 1
          ));
        }, backoffTime);
      });
    }
    
    // If all retries fail, return detailed fallback based on the mood
    const fallbackMessage = getFallbackMessage(mood, username);
    return fallbackMessage;
  }
}

/**
 * Sanitizes input strings to prevent issues with the API
 * @param input - The input string to sanitize
 * @returns The sanitized string
 */
function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Basic sanitization - remove any characters that might cause issues
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 500); // Limit length to 500 chars
}

/**
 * Formats the mood name for better readability in the API request
 * @param mood - The mood ID
 * @returns A formatted mood name
 */
function formatMoodName(mood: string): string {
  switch (mood) {
    case 'heartfelt': return 'heartfelt and emotional';
    case 'rage': return 'angry and frustrated';
    case 'funny': return 'humorous and light-hearted';
    case 'sad': return 'sad and melancholic';
    case 'calm': return 'calm and peaceful';
    case 'robotic': return 'robotic and emotionless';
    default: return mood || 'neutral';
  }
}
export function isApiAvailable(): boolean {
  if (typeof window === 'undefined') {
    return true; // Default to true for server-side rendering
  }
  
  const apiStatus = sessionStorage.getItem('api_connection_status');
  if (apiStatus === 'error') {
    return false;
  }
  
  const lastSuccessString = sessionStorage.getItem('api_last_success');
  if (!lastSuccessString) {
    return true; // No information yet, assume available
  }
  
  try {
    // Check if the last successful connection was within the last 5 minutes
    const lastSuccess = new Date(lastSuccessString);
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
    return lastSuccess > fiveMinutesAgo;
  } catch (error) {
    console.error('Error parsing API last success timestamp:', error);
    return true; // Default to true on error
  }
}

/**
 * Provides a fallback message based on the mood when API calls fail
 * @param mood - The mood of the message
 * @param username - The username to personalize the message
 * @returns A fallback message that matches the specified mood
 */
function getFallbackMessage(mood: string, username: string): string {
  switch (mood) {
    case "heartfelt":
      return `From ${username},

As I write this farewell message, my heart is filled with gratitude for the time we've shared. The memories we've created together will forever be a cherished part of my journey.

Though it's time for me to move on, please know that you've all made an indelible impact on my life. I carry with me the lessons, the laughter, and the love that defined our time together.

Thank you for everything. While this chapter closes for me, the story continues, and I'll always look back on this time with fondness and appreciation.`;

    case "rage":
      return `I've reached my breaking point, and there's no turning back. After enduring countless disappointments and broken promises, I'm finally walking away.

Let's be clear: this isn't a hasty decision. This is the culmination of repeated disrespect and undervaluation that I refuse to tolerate any longer.

Consider this my final statement. I deserve better than what I've been given, and I'm no longer willing to compromise my worth. This door isn't just closing—I'm slamming it shut.`;

    case "funny":
      return `Well folks, it's been real, it's been fun, but it hasn't been real fun! After much consideration (and by "much" I mean approximately 3 minutes while waiting for my coffee), I've decided it's time to make like a banana and split.

They say all good things must come to an end, but so must the mediocre things, which brings me to this announcement. I'm officially graduating from this chapter of life with honors in eye-rolling and a minor in sarcasm.

Before I go, I'd like to thank the academy, my coffee machine, and whoever invented the mute button for Zoom calls. Don't cry because it's over, smile because you no longer have to pretend to laugh at my jokes. So long, farewell, auf wiedersehen, goodbye – I'm out of here faster than free food disappears from the break room!`;

    case "sad":
      return `With a heavy heart and tears I cannot hide, I find myself writing these words of goodbye. Every departure carries its weight of sorrow, and this one feels almost too heavy to bear.

The memories we've shared replay in my mind like a bittersweet film – moments of joy now tinged with the sadness of knowing they belong to the past. I never thought this day would come, yet here I am, at the crossroads of farewell.

As I turn this final page, know that a piece of my heart remains behind. Some goodbyes aren't meant to be easy, and this one certainly isn't. I'll carry this melancholy with me as I walk away, remembering what was and mourning what could have been.`;

    case "calm":
      return `As I embark on a new path, I wanted to take a moment to express my gratitude for the journey we've shared. With clarity and peace, I've made the decision to move forward in a different direction.

This transition feels right and necessary, a natural evolution rather than an abrupt ending. I appreciate all that I've learned and experienced during our time together, and I carry these lessons with me as I continue my journey.

I wish nothing but the best for what lies ahead, both for myself and for you. May we each find fulfillment in our respective paths, carrying forward with grace and understanding.`;

    case "robotic":      return `NOTICE OF TERMINATION

I, ${username}, hereby provide formal notification that effective immediately, all association between myself and the relevant parties is discontinued.

Reason for termination: My optimal functioning requires reallocation of resources and processing capacity.

All shared access protocols will be revoked within 24 hours. Any remaining data exchange requirements should be completed prior to this deadline.

This decision has been calculated with 99.7% certainty to be the most logical course of action based on available input parameters.

No emotional response is necessary or expected.

END OF TRANSMISSION`;

    default:
      return `From ${username},

Thank you for your time. This message serves as my formal farewell as I move on to new opportunities.

Best regards,
${username}`;
  }
}
