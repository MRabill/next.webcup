/**
 * Check if the API is available
 * @returns boolean indicating if the API is available
 */
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
