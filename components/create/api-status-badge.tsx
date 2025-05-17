"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ApiStatusRecord {
  status: "loading" | "connected" | "error";
  lastChecked: string;
  lastSuccess?: string;
  errorMessage?: string;
}

export default function ApiStatusBadge() {
  const [apiStatus, setApiStatus] = useState<"loading" | "connected" | "error">("loading")
  const [statusDetails, setStatusDetails] = useState<ApiStatusRecord | null>(null)

  useEffect(() => {
    // Check the current API status from sessionStorage
    const checkStatus = () => {
      if (typeof window !== 'undefined') {
        // Get basic status
        const status = sessionStorage.getItem('api_connection_status')
        if (status === 'connected') {
          setApiStatus('connected')
        } else if (status === 'error') {
          setApiStatus('error')
        } else {
          setApiStatus('loading')
        }
        
        // Get detailed status if available
        try {
          const detailsJson = sessionStorage.getItem('api_status_record')
          if (detailsJson) {
            const details = JSON.parse(detailsJson) as ApiStatusRecord
            setStatusDetails(details)
          }
        } catch (error) {
          console.error('Error parsing API status details:', error)
        }
      }
    }

    // Initial check
    checkStatus()

    // Set up a listener for changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'api_connection_status' || e.key === 'api_status_record') {
        checkStatus()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Check every 10 seconds
    const intervalId = setInterval(checkStatus, 10000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(intervalId)
    }
  }, [])

  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString()
    } catch (e) {
      return 'Unknown'
    }
  }

  // Don't show anything when loading
  if (apiStatus === 'loading') {
    return null
  }

  if (apiStatus === 'connected') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 cursor-help">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              AI Connected
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Connected to the AI message generation service.
              {statusDetails?.lastChecked && ` Last verified at ${formatTime(statusDetails.lastChecked)}.`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Show error badge
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="destructive" className="ml-2 cursor-help">
            <AlertCircle className="h-3 w-3 mr-1" />
            Offline Mode
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-semibold">
              AI message generation is currently offline. Using local templates instead.
            </p>
            {statusDetails?.errorMessage && (
              <p className="text-xs mt-1 text-gray-400">
                Error: {statusDetails.errorMessage}
              </p>
            )}
            {statusDetails?.lastChecked && (
              <p className="text-xs mt-1 text-gray-400">
                Last checked: {formatTime(statusDetails.lastChecked)}
              </p>
            )}
            <p className="text-xs mt-2">
              We'll automatically switch back to AI-generated content when the service is available.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
