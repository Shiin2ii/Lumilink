import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

/**
 * ResponsiveContainer component that provides responsive utilities to children
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.padding - Responsive padding values
 * @param {Object} props.margin - Responsive margin values
 * @param {boolean} props.safeArea - Whether to apply safe area padding
 * @param {string} props.as - HTML element to render as
 * @returns {React.ReactElement} ResponsiveContainer component
 */
const ResponsiveContainer = ({
  children,
  className = '',
  padding = { xs: 'px-4', sm: 'px-6', lg: 'px-8' },
  margin = {},
  safeArea = false,
  as: Component = 'div',
  ...props
}) => {
  const responsive = useResponsive();

  // Get responsive padding class
  const getPaddingClass = () => {
    const { getCurrentBreakpoint } = responsive;
    const currentBp = getCurrentBreakpoint();
    
    // Find appropriate padding for current breakpoint
    const bpOrder = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = bpOrder.indexOf(currentBp);
    
    for (let i = currentIndex; i < bpOrder.length; i++) {
      const bp = bpOrder[i];
      if (padding[bp]) return padding[bp];
    }
    
    return padding.default || 'px-4';
  };

  // Get responsive margin class
  const getMarginClass = () => {
    if (!margin || Object.keys(margin).length === 0) return '';
    
    const { getCurrentBreakpoint } = responsive;
    const currentBp = getCurrentBreakpoint();
    
    const bpOrder = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = bpOrder.indexOf(currentBp);
    
    for (let i = currentIndex; i < bpOrder.length; i++) {
      const bp = bpOrder[i];
      if (margin[bp]) return margin[bp];
    }
    
    return margin.default || '';
  };

  const paddingClass = getPaddingClass();
  const marginClass = getMarginClass();
  const safeAreaClass = safeArea ? 'safe-area-padding' : '';

  const combinedClassName = [
    'responsive-container',
    paddingClass,
    marginClass,
    safeAreaClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={combinedClassName} {...props}>
      {typeof children === 'function' ? children(responsive) : children}
    </Component>
  );
};

/**
 * ResponsiveGrid component for responsive grid layouts
 */
export const ResponsiveGrid = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = { xs: 'gap-4', sm: 'gap-6', lg: 'gap-8' },
  className = '',
  ...props
}) => {
  const responsive = useResponsive();
  
  const getResponsiveClass = (values) => {
    const { getCurrentBreakpoint } = responsive;
    const currentBp = getCurrentBreakpoint();
    
    const bpOrder = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = bpOrder.indexOf(currentBp);
    
    for (let i = currentIndex; i < bpOrder.length; i++) {
      const bp = bpOrder[i];
      if (values[bp]) return values[bp];
    }
    
    return values.default || Object.values(values)[0];
  };

  const gapClass = getResponsiveClass(gap);
  
  // Generate grid columns class based on current breakpoint
  const getGridClass = () => {
    const { getCurrentBreakpoint } = responsive;
    const currentBp = getCurrentBreakpoint();
    const currentColumns = columns[currentBp] || columns.xs || 1;
    
    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    };
    
    return gridClasses[currentColumns] || 'grid-cols-1';
  };

  const gridClass = getGridClass();
  const combinedClassName = ['grid', gridClass, gapClass, className].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

/**
 * ResponsiveText component for responsive typography
 */
export const ResponsiveText = ({
  children,
  sizes = { xs: 'text-base', sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' },
  weights = {},
  className = '',
  as: Component = 'p',
  ...props
}) => {
  const responsive = useResponsive();
  
  const getResponsiveClass = (values) => {
    if (!values || Object.keys(values).length === 0) return '';
    
    const { getCurrentBreakpoint } = responsive;
    const currentBp = getCurrentBreakpoint();
    
    const bpOrder = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = bpOrder.indexOf(currentBp);
    
    for (let i = currentIndex; i < bpOrder.length; i++) {
      const bp = bpOrder[i];
      if (values[bp]) return values[bp];
    }
    
    return values.default || Object.values(values)[0];
  };

  const sizeClass = getResponsiveClass(sizes);
  const weightClass = getResponsiveClass(weights);
  
  const combinedClassName = [sizeClass, weightClass, className].filter(Boolean).join(' ');

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};

/**
 * ResponsiveSpacing component for responsive spacing
 */
export const ResponsiveSpacing = ({
  children,
  padding = {},
  margin = {},
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const responsive = useResponsive();
  
  const getResponsiveClass = (values) => {
    if (!values || Object.keys(values).length === 0) return '';
    
    const { getCurrentBreakpoint } = responsive;
    const currentBp = getCurrentBreakpoint();
    
    const bpOrder = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = bpOrder.indexOf(currentBp);
    
    for (let i = currentIndex; i < bpOrder.length; i++) {
      const bp = bpOrder[i];
      if (values[bp]) return values[bp];
    }
    
    return values.default || '';
  };

  const paddingClass = getResponsiveClass(padding);
  const marginClass = getResponsiveClass(margin);
  
  const combinedClassName = [paddingClass, marginClass, className].filter(Boolean).join(' ');

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};

/**
 * MobileOnly component - only renders on mobile devices
 */
export const MobileOnly = ({ children }) => {
  const { isMobile } = useResponsive();
  return isMobile ? children : null;
};

/**
 * DesktopOnly component - only renders on desktop devices
 */
export const DesktopOnly = ({ children }) => {
  const { isDesktop } = useResponsive();
  return isDesktop ? children : null;
};

/**
 * TabletOnly component - only renders on tablet devices
 */
export const TabletOnly = ({ children }) => {
  const { isTablet } = useResponsive();
  return isTablet ? children : null;
};

/**
 * BreakpointOnly component - only renders at specific breakpoints
 */
export const BreakpointOnly = ({ children, breakpoints = [] }) => {
  const { getCurrentBreakpoint } = useResponsive();
  const currentBp = getCurrentBreakpoint();
  
  return breakpoints.includes(currentBp) ? children : null;
};

export default ResponsiveContainer;
