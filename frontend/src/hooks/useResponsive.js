import { useState, useEffect } from 'react';

// Tailwind CSS breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Custom hook to handle responsive design
 * @returns {Object} Object containing current breakpoint info and utility functions
 */
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if current screen size matches breakpoint
  const isBreakpoint = (breakpoint) => {
    return windowSize.width >= breakpoints[breakpoint];
  };

  // Get current breakpoint
  const getCurrentBreakpoint = () => {
    const { width } = windowSize;
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  // Utility functions
  const isMobile = windowSize.width < breakpoints.md;
  const isTablet = windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg;
  const isDesktop = windowSize.width >= breakpoints.lg;
  const isSmallScreen = windowSize.width < breakpoints.sm;
  const isLargeScreen = windowSize.width >= breakpoints.xl;

  return {
    windowSize,
    breakpoints,
    isBreakpoint,
    getCurrentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isLargeScreen,
    // Specific breakpoint checks
    isSm: isBreakpoint('sm'),
    isMd: isBreakpoint('md'),
    isLg: isBreakpoint('lg'),
    isXl: isBreakpoint('xl'),
    is2Xl: isBreakpoint('2xl'),
  };
};

/**
 * Hook to get responsive values based on current breakpoint
 * @param {Object} values - Object with breakpoint keys and corresponding values
 * @returns {*} Value for current breakpoint
 */
export const useResponsiveValue = (values) => {
  const { getCurrentBreakpoint } = useResponsive();
  const currentBreakpoint = getCurrentBreakpoint();

  // Find the appropriate value for current breakpoint
  const breakpointOrder = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  // Look for value starting from current breakpoint and going down
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  // Fallback to default or first available value
  return values.default || values[Object.keys(values)[0]];
};

/**
 * Hook for responsive grid columns
 * @param {Object} columns - Object with breakpoint keys and column counts
 * @returns {string} CSS grid template columns
 */
export const useResponsiveGrid = (columns = { xs: 1, sm: 2, md: 3, lg: 4 }) => {
  const currentColumns = useResponsiveValue(columns);
  return `repeat(${currentColumns}, minmax(0, 1fr))`;
};

/**
 * Hook for responsive spacing
 * @param {Object} spacing - Object with breakpoint keys and spacing values
 * @returns {string} CSS spacing value
 */
export const useResponsiveSpacing = (spacing = { xs: '1rem', sm: '1.5rem', md: '2rem', lg: '3rem' }) => {
  return useResponsiveValue(spacing);
};

/**
 * Hook to detect if user is on a touch device
 * @returns {boolean} True if touch device
 */
export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouchDevice();
  }, []);

  return isTouchDevice;
};

/**
 * Hook to get safe area insets for mobile devices
 * @returns {Object} Safe area insets
 */
export const useSafeAreaInsets = () => {
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSafeAreaInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      
      setSafeAreaInsets({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0,
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)')) || 0,
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)')) || 0,
      });
    };

    updateSafeAreaInsets();
    window.addEventListener('resize', updateSafeAreaInsets);
    window.addEventListener('orientationchange', updateSafeAreaInsets);

    return () => {
      window.removeEventListener('resize', updateSafeAreaInsets);
      window.removeEventListener('orientationchange', updateSafeAreaInsets);
    };
  }, []);

  return safeAreaInsets;
};

export default useResponsive;
