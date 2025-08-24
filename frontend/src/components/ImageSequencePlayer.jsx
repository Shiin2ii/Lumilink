import React, { useEffect, useRef, useState, useCallback } from 'react';

const ImageSequencePlayer = ({ 
  cloudName = "dodfmlnny",
  publicId = "kimetsu_no_yaiba_-_Demon_Slayer_best_30_second_2021_slxgxb",
  totalFrames = 720, // 24fps * 30s = 720 frames
  fps = 24,
  autoPlay = true,
  loop = true,
  quality = "q_auto:best,f_auto,w_1920,h_1080",
  className = "w-full h-full object-cover"
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedImagesRef = useRef(0);
  
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Preload images với progressive loading
  useEffect(() => {
    const loadImages = async () => {
      setError(null);
      
      // Reset
      imagesRef.current = new Array(totalFrames);
      loadedImagesRef.current = 0;
      
      // Load images in batches để tránh overwhelm browser
      const batchSize = 10;
      const batches = Math.ceil(totalFrames / batchSize);
      
      for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
        const startFrame = batchIndex * batchSize;
        const endFrame = Math.min(startFrame + batchSize, totalFrames);
        
        const batchPromises = [];
        
        for (let i = startFrame; i < endFrame; i++) {
          const frameNumber = i + 1; // Cloudinary pages start from 1
          
          const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            img.onload = () => {
              imagesRef.current[i] = img;
              loadedImagesRef.current++;
              
              const progress = (loadedImagesRef.current / totalFrames) * 100;
              setLoadingProgress(progress);
              
              // Start playing when we have enough frames
              if (loadedImagesRef.current >= Math.min(60, totalFrames) && !isReady) {
                setIsReady(true);
              }
              
              resolve(img);
            };
            
            img.onerror = (e) => {
              console.error(`❌ Failed to load frame ${frameNumber}:`, e);
              // Create placeholder image
              const canvas = document.createElement('canvas');
              canvas.width = 1920;
              canvas.height = 1080;
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = '#1a1a1a';
              ctx.fillRect(0, 0, 1920, 1080);
              ctx.fillStyle = '#666';
              ctx.font = '48px monospace';
              ctx.textAlign = 'center';
              ctx.fillText(`Frame ${frameNumber}`, 960, 540);
              
              imagesRef.current[i] = canvas;
              loadedImagesRef.current++;
              resolve(canvas);
            };
            
            // Cloudinary URL với page parameter
            img.src = `https://res.cloudinary.com/${cloudName}/image/upload/${quality},pg_${frameNumber}/${publicId}.jpg`;
          });
          
          batchPromises.push(promise);
        }
        
        // Wait for batch to complete
        await Promise.allSettled(batchPromises);
        
        // Small delay between batches
        if (batchIndex < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
    };

    loadImages().catch(err => {
      console.error('💥 Error loading sequence:', err);
      setError('Failed to load video sequence');
    });

    return () => {
      // Cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cloudName, publicId, totalFrames, quality]);

  // Animation loop with requestAnimationFrame for smooth playback
  const animate = useCallback(() => {
    if (!isPlaying || !isReady) return;
    
    const frameInterval = 1000 / fps;
    let lastTime = 0;
    
    const frame = (currentTime) => {
      if (currentTime - lastTime >= frameInterval) {
        setCurrentFrame(prev => {
          const nextFrame = prev + 1;
          if (nextFrame >= totalFrames) {
            return loop ? 0 : totalFrames - 1;
          }
          return nextFrame;
        });
        lastTime = currentTime;
      }
      
      if (isPlaying && isReady) {
        animationRef.current = requestAnimationFrame(frame);
      }
    };
    
    animationRef.current = requestAnimationFrame(frame);
  }, [isPlaying, isReady, fps, totalFrames, loop]);

  useEffect(() => {
    if (isPlaying && isReady) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isPlaying, isReady]);

  // Draw current frame to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesRef.current[currentFrame]) return;

    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[currentFrame];
    
    // Set canvas size to match container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    // Clear and draw
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.drawImage(img, 0, 0, rect.width, rect.height);
  }, [currentFrame]);

  // Control functions
  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const restart = () => {
    setCurrentFrame(0);
    setIsPlaying(true);
  };

  if (error) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center text-red-400">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="font-mono">{error}</p>
          <p className="text-sm mt-2 text-gray-500">Check console for details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Canvas for rendering frames */}
      <canvas
        ref={canvasRef}
        className={className}
        style={{ 
          display: isReady ? 'block' : 'none',
          imageRendering: 'crisp-edges'
        }}
      />
      
      {/* Loading screen */}
      {!isReady && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            {/* Animated loader */}
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-white/20 rounded-full"></div>
              <div 
                className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-white rounded-full animate-spin"
                style={{
                  animationDuration: '1s'
                }}
              ></div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 font-mono">Loading 4K Sequence</h3>
            <p className="text-gray-400 mb-4 font-mono">Demon Slayer • {totalFrames} frames</p>
            
            {/* Progress bar */}
            <div className="w-80 bg-white/10 rounded-full h-3 mb-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm font-mono text-gray-400 w-80">
              <span>{Math.round(loadingProgress)}%</span>
              <span>{loadedImagesRef.current}/{totalFrames} frames</span>
            </div>
            
            {loadingProgress > 10 && (
              <p className="text-xs mt-3 text-gray-500 font-mono">
                Playback will start automatically...
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && isReady && (
        <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded font-mono text-xs">
          Frame: {currentFrame + 1}/{totalFrames} | 
          FPS: {fps} | 
          Playing: {isPlaying ? '▶️' : '⏸️'}
        </div>
      )}
    </div>
  );
};

// Export control functions for external use
export const useImageSequenceControls = (playerRef) => {
  return {
    play: () => playerRef.current?.play(),
    pause: () => playerRef.current?.pause(),
    restart: () => playerRef.current?.restart(),
  };
};

export default ImageSequencePlayer;
