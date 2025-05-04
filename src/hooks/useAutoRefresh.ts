import { useState, useEffect, useRef, useCallback } from 'react';

interface AutoRefreshOptions {
  enabled?: boolean;
  initialInterval?: number; // in milliseconds
  onRefresh: () => Promise<void> | void;
  minInterval?: number; // minimum allowed interval in milliseconds
  maxInterval?: number; // maximum allowed interval in milliseconds
}

/**
 * Custom hook for auto-refreshing data at specified intervals
 */
export const useAutoRefresh = ({
  enabled = true,
  initialInterval = 30000, // 30 seconds default
  onRefresh,
  minInterval = 5000, // 5 seconds minimum
  maxInterval = 300000, // 5 minutes maximum
}: AutoRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [interval, setInterval] = useState(initialInterval);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(enabled);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const timeoutRef = useRef<number | null>(null);
  
  // Format time ago string (e.g., "2 minutes ago")
  const getTimeAgoString = useCallback(() => {
    if (!lastRefreshed) return 'Never';
    
    const seconds = Math.floor((new Date().getTime() - lastRefreshed.getTime()) / 1000);
    
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 120) return '1 minute ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 7200) return '1 hour ago';
    return `${Math.floor(seconds / 3600)} hours ago`;
  }, [lastRefreshed]);

  // Function to perform the refresh
  const refresh = useCallback(async () => {
    if (isRefreshing || !isAutoRefreshEnabled) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Auto-refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, isAutoRefreshEnabled, onRefresh]);

  // Function to change the refresh interval
  const changeInterval = useCallback((newInterval: number) => {
    // Ensure interval is within min and max bounds
    const boundedInterval = Math.max(
      minInterval,
      Math.min(maxInterval, newInterval)
    );
    
    setInterval(boundedInterval);
    
    // Reset the timer with the new interval
    if (isAutoRefreshEnabled) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(refresh, boundedInterval);
    }
  }, [isAutoRefreshEnabled, minInterval, maxInterval, refresh]);

  // Toggle auto-refresh on/off
  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled((prev) => !prev);
  }, []);

  // Set up and clean up the interval
  useEffect(() => {
    if (isAutoRefreshEnabled && !isRefreshing) {
      timeoutRef.current = window.setTimeout(refresh, interval);
    }
    
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isAutoRefreshEnabled, interval, isRefreshing, refresh]);

  // Initial refresh when enabled
  useEffect(() => {
    if (isAutoRefreshEnabled && !lastRefreshed) {
      refresh();
    }
  }, [isAutoRefreshEnabled, lastRefreshed, refresh]);

  return {
    isRefreshing,
    isAutoRefreshEnabled,
    toggleAutoRefresh,
    interval,
    changeInterval,
    lastRefreshed,
    getTimeAgoString,
    refresh
  };
}; 