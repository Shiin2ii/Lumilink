import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '../../hooks/useResponsive';

/**
 * Mobile-optimized wrapper for Dashboard components
 * Provides responsive behavior and mobile-specific optimizations
 */
const MobileOptimizedDashboard = ({ children, className = '' }) => {
  const { isMobile, isTablet, windowSize } = useResponsive();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Detect virtual keyboard on mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const screenHeight = window.screen.height;
      
      // If height is significantly reduced, keyboard is likely open
      const keyboardThreshold = screenHeight * 0.75;
      setIsKeyboardOpen(currentHeight < keyboardThreshold);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Mobile-specific styles
  const getMobileStyles = () => {
    if (!isMobile) return '';
    
    return `
      ${isKeyboardOpen ? 'pb-0' : 'pb-safe-area-padding-bottom'}
      safe-area-padding
    `;
  };

  return (
    <div className={`
      min-h-screen 
      ${getMobileStyles()}
      ${className}
    `}>
      {/* Mobile viewport meta optimization */}
      {isMobile && (
        <style jsx>{`
          @media (max-width: 768px) {
            .dashboard-content {
              /* Optimize for mobile scrolling */
              -webkit-overflow-scrolling: touch;
              overscroll-behavior: contain;
            }
            
            /* Prevent zoom on input focus */
            input, select, textarea {
              font-size: 16px !important;
            }
            
            /* Optimize touch targets */
            button, a, [role="button"] {
              min-height: 44px;
              min-width: 44px;
            }
          }
        `}</style>
      )}
      
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

/**
 * Mobile-optimized section wrapper
 */
export const MobileSection = ({ 
  children, 
  title, 
  description,
  className = '',
  collapsible = false,
  defaultCollapsed = false 
}) => {
  const { isMobile } = useResponsive();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        ${isMobile ? 'mb-4' : 'mb-6'}
        ${className}
      `}
    >
      {title && (
        <div className={`
          flex items-center justify-between 
          ${isMobile ? 'mb-3' : 'mb-4'}
        `}>
          <div>
            <h2 className={`
              font-semibold text-white
              ${isMobile ? 'text-lg' : 'text-xl'}
            `}>
              {title}
            </h2>
            {description && (
              <p className={`
                text-gray-400 mt-1
                ${isMobile ? 'text-sm' : 'text-base'}
              `}>
                {description}
              </p>
            )}
          </div>
          
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg 
                className={`w-5 h-5 transform transition-transform ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </button>
          )}
        </div>
      )}
      
      {(!collapsible || !isCollapsed) && (
        <motion.div
          initial={collapsible ? { height: 0, opacity: 0 } : false}
          animate={collapsible ? { height: 'auto', opacity: 1 } : false}
          exit={collapsible ? { height: 0, opacity: 0 } : false}
        >
          {children}
        </motion.div>
      )}
    </motion.section>
  );
};

/**
 * Mobile-optimized grid component
 */
export const MobileGrid = ({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: 3, tablet: 4, desktop: 6 },
  className = '' 
}) => {
  const { isMobile, isTablet } = useResponsive();
  
  const getGridCols = () => {
    if (isMobile) return `grid-cols-${columns.mobile}`;
    if (isTablet) return `grid-cols-${columns.tablet}`;
    return `grid-cols-${columns.desktop}`;
  };
  
  const getGap = () => {
    if (isMobile) return `gap-${gap.mobile}`;
    if (isTablet) return `gap-${gap.tablet}`;
    return `gap-${gap.desktop}`;
  };

  return (
    <div className={`
      grid 
      ${getGridCols()} 
      ${getGap()}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Mobile-optimized button group
 */
export const MobileButtonGroup = ({ 
  children, 
  orientation = 'horizontal',
  className = '' 
}) => {
  const { isMobile } = useResponsive();
  
  // Force vertical orientation on mobile for better UX
  const actualOrientation = isMobile ? 'vertical' : orientation;
  
  return (
    <div className={`
      flex 
      ${actualOrientation === 'vertical' ? 'flex-col space-y-2' : 'flex-row space-x-2'}
      ${isMobile ? 'w-full' : ''}
      ${className}
    `}>
      {React.Children.map(children, (child, index) => (
        <div className={isMobile ? 'w-full' : ''}>
          {child}
        </div>
      ))}
    </div>
  );
};

/**
 * Mobile-optimized form wrapper
 */
export const MobileForm = ({ children, className = '' }) => {
  const { isMobile } = useResponsive();
  
  return (
    <form className={`
      space-y-${isMobile ? '4' : '6'}
      ${className}
    `}>
      {children}
    </form>
  );
};

/**
 * Mobile-optimized modal/drawer
 */
export const MobileModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className = '' 
}) => {
  const { isMobile } = useResponsive();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal/Drawer */}
      <motion.div
        initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
        animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
        exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
        className={`
          relative z-10
          ${isMobile 
            ? 'fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-xl max-h-[90vh] overflow-y-auto' 
            : 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-xl max-w-md w-full mx-4'
          }
          ${className}
        `}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="p-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default MobileOptimizedDashboard;
