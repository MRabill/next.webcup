"use client";

import { useState, useEffect, useCallback } from "react";
import { testApiConnection } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ApiStatusRecord {
  status: "loading" | "connected" | "error";
  lastChecked: string;
  lastSuccess?: string;
  errorMessage?: string;
}

export default function ApiConnectionChecker() {
  const [apiStatus, setApiStatus] = useState<"loading" | "connected" | "error">("loading");
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  
  // Create a memoized function for checking the API connection
  const checkApiConnection = useCallback(async () => {
    try {
      // Update status in sessionStorage
      const updateStatus = (status: "loading" | "connected" | "error", errorMessage?: string) => {
        if (typeof window !== 'undefined') {
          const statusRecord: ApiStatusRecord = {
            status,
            lastChecked: new Date().toISOString(),
            errorMessage
          };
          
          if (status === 'connected') {
            statusRecord.lastSuccess = new Date().toISOString();
          }
          
          // Store simplified status for other components
          sessionStorage.setItem('api_connection_status', status);
          // Store detailed status record
          sessionStorage.setItem('api_status_record', JSON.stringify(statusRecord));
        }
      };
      
      updateStatus('loading');
      const result = await testApiConnection();
      
      if (result.success) {
        // If we previously had an error and now it's resolved, show a success message
        if (apiStatus === "error") {
          toast({
            title: "API Connection Restored",
            description: "The farewell message service is now available and working properly.",
          });
        }
        setApiStatus("connected");
        updateStatus('connected');
      } else {
        const errorMsg = result.message || "The API response indicated failure";
        handleApiError(errorMsg);
        updateStatus('error', errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      handleApiError(errorMsg);
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('api_connection_status', 'error');
        const statusRecord: ApiStatusRecord = {
          status: 'error',
          lastChecked: new Date().toISOString(),
          errorMessage: errorMsg
        };
        sessionStorage.setItem('api_status_record', JSON.stringify(statusRecord));
      }
    }
  }, [apiStatus, toast]);
  
  // Handle API errors with appropriate user feedback
  const handleApiError = useCallback((errorMessage: string) => {
    console.error("API connection test failed:", errorMessage);
    setApiStatus("error");
    
    // Only show toast for the first error or after 3 retries
    if (retryCount === 0 || retryCount % 3 === 0) {
      toast({
        title: "API Connection Issue",
        description: "Unable to connect to the farewell message service. Some features may be limited.",
        variant: "destructive",
      });
    }
    
    // Increment the retry counter and schedule another attempt
    setRetryCount(prevCount => prevCount + 1);
  }, [retryCount, toast]);
  
  useEffect(() => {
    // Check for existing API status first
    if (typeof window !== 'undefined') {
      const savedStatus = sessionStorage.getItem('api_connection_status');
      if (savedStatus) {
        setApiStatus(savedStatus as "loading" | "connected" | "error");
      }
    }
    
    // Perform initial check with a slight delay to prevent checking immediately on page load
    const initialTimer = setTimeout(() => {
      checkApiConnection();
    }, 3000);
    
    // Set up periodic check every 30 seconds, but only if we're in error state
    const periodicTimer = setInterval(() => {
      if (apiStatus === "error") {
        checkApiConnection();
      }
    }, 30000);
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(periodicTimer);
    };
  }, [apiStatus, checkApiConnection]);
  
  // This component doesn't render anything visible
  return null;
}
