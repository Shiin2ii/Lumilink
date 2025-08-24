import React, { useRef, useEffect, useState, useCallback } from 'react';

const VideoBackground = ({
  src,
  className = '',
  fallbackImage = null,
  quality = 'medium', // 'low', 'medium', 'high'
  enableCanvas = true,
  enableAudio = false, // Enable audio support
  muted = true,
  onLoad = () => {},
  onError = () => {}
}) => {
  const videoRef = useRef(null);
  const audioVideoRef = useRef(null); // Separate video for audio
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Quality settings
  const qualitySettings = {
    low: { scale: 0.5, fps: 15 },
    medium: { scale: 0.75, fps: 24 },
    high: { scale: 1, fps: 30 }
  };

  const currentQuality = qualitySettings[quality] || qualitySettings.medium;

  // Canvas rendering function
  const renderFrame = useCallback(() => {
    if (!enableCanvas || !videoRef.current || !canvasRef.current || !isPlaying) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState >= 2) {
      // Set canvas size based on quality
      const displayWidth = canvas.offsetWidth;
      const displayHeight = canvas.offsetHeight;
      const renderWidth = displayWidth * currentQuality.scale;
      const renderHeight = displayHeight * currentQuality.scale;

      if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
        canvas.width = renderWidth;
        canvas.height = renderHeight;
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
      }

      // Clear and draw frame
      ctx.clearRect(0, 0, renderWidth, renderHeight);
      ctx.drawImage(video, 0, 0, renderWidth, renderHeight);
    }

    // Schedule next frame based on quality FPS
    const frameDelay = 1000 / currentQuality.fps;
    animationFrameRef.current = setTimeout(() => {
      requestAnimationFrame(renderFrame);
    }, frameDelay);
  }, [enableCanvas, isPlaying, currentQuality]);

  // Handle video load
  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad();
  }, [onLoad]);

  // Handle video error
  const handleVideoError = useCallback((error) => {
    console.error('Video load error:', error);
    setHasError(true);
    setIsLoaded(false);
    onError(error);
  }, [onError]);

  // Handle video play/pause
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    // Sync audio video
    if (enableAudio && audioVideoRef.current) {
      audioVideoRef.current.play().catch(console.error);
    }
  }, [enableAudio]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    // Sync audio video
    if (enableAudio && audioVideoRef.current) {
      audioVideoRef.current.pause();
    }
  }, [enableAudio]);

  // Update audio video mute state when prop changes
  useEffect(() => {
    if (enableAudio && audioVideoRef.current) {
      audioVideoRef.current.muted = muted;
    }
  }, [muted, enableAudio]);

  // Setup video element
  useEffect(() => {
    const video = videoRef.current;
    const audioVideo = audioVideoRef.current;
    if (!video || !src) return;

    // Reset states
    setIsLoaded(false);
    setHasError(false);
    setIsPlaying(false);

    // Video attributes for optimization (canvas video - always muted)
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';

    // Setup audio video if enabled
    if (enableAudio && audioVideo) {
      audioVideo.muted = muted;
      audioVideo.loop = true;
      audioVideo.playsInline = true;
      audioVideo.preload = 'metadata';
      audioVideo.src = src;
      audioVideo.load();
    }

    // Event listeners
    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Load video
    video.src = src;
    video.load();

    // Auto play when loaded
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(handleVideoError);
    }

    // Auto play audio video if enabled
    if (enableAudio && audioVideo) {
      const audioPlayPromise = audioVideo.play();
      if (audioPlayPromise !== undefined) {
        audioPlayPromise.catch(console.error);
      }
    }

    return () => {
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [src, enableAudio, handleVideoLoad, handleVideoError, handlePlay, handlePause]);

  // Start canvas rendering when video plays
  useEffect(() => {
    if (isPlaying && enableCanvas) {
      renderFrame();
    }

    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isPlaying, enableCanvas, renderFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current);
      }
    };
  }, []);

  // Handle visibility change to pause/resume
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (videoRef.current) {
        if (document.hidden) {
          videoRef.current.pause();
        } else if (isLoaded && !hasError) {
          videoRef.current.play().catch(console.error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isLoaded, hasError]);

  if (hasError && fallbackImage) {
    return (
      <div 
        className={`bg-cover bg-center bg-no-repeat ${className}`}
        style={{ backgroundImage: `url(${fallbackImage})` }}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Hidden video element for canvas rendering */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
        muted
        loop
        playsInline
      />

      {/* Separate video element for audio (if enabled) */}
      {enableAudio && (
        <video
          ref={audioVideoRef}
          className="absolute opacity-0 pointer-events-none"
          style={{ width: '1px', height: '1px' }}
          muted={muted}
          loop
          playsInline
          src={src}
        />
      )}

      {/* Canvas for optimized rendering */}
      {enableCanvas ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            display: isLoaded && !hasError ? 'block' : 'none'
          }}
        />
      ) : (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          muted
          loop
          playsInline
          autoPlay
          style={{ 
            display: isLoaded && !hasError ? 'block' : 'none'
          }}
        />
      )}

      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && !fallbackImage && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-red-400 text-center">
            <p className="text-sm">Failed to load video</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBackground;
