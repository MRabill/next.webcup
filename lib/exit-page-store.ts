
// Define the exit page data type
export interface ExitPageData {
  mood: string
  relationship: string
  context: string
  message: string
  gifs: string[]
  audio: string | null
  soundEffect: string | null
  visualEffects: string[]
  title: string
  username?: string
  email?: string
  createdAt?: string
}

// Local storage key
const EXIT_PAGE_DATA_KEY = 'exitPageData';

// Function to save the exit page data
export function saveExitPageData(data: ExitPageData): void {
  // Add creation timestamp if not present
  if (!data.createdAt) {
    data.createdAt = new Date().toISOString();
  }
  
  try {
    // For client-side storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(EXIT_PAGE_DATA_KEY, JSON.stringify(data));
    }
  } catch (error) {
    console.error('Failed to save exit page data:', error);
  }
}

// Function to retrieve the exit page data
export function getExitPageData(): ExitPageData | null {
  try {
    // For client-side retrieval
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(EXIT_PAGE_DATA_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve exit page data:', error);
    return null;
  }
}

// Function to clear the exit page data
export function clearExitPageData(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(EXIT_PAGE_DATA_KEY);
    }
  } catch (error) {
    console.error('Failed to clear exit page data:', error);
  }
}
