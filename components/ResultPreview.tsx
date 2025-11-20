import React, { useState, useEffect, useRef } from 'react';
import { VideoResult } from '../types';
import { Button } from './Button';
import { SIMULATED_CLOUD_DOWNLOAD_URL } from '../constants';

interface ResultPreviewProps {
  result: VideoResult;
  onReset: () => void;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({ result, onReset }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [topVideoSrc, setTopVideoSrc] = useState<string>('');
  const [bottomVideoSrc, setBottomVideoSrc] = useState<string>('');
  const topVideoRef = useRef<HTMLVideoElement>(null);
  const bottomVideoRef = useRef<HTMLVideoElement>(null);
  
  // Feature to let user override the placeholder template with a real file
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Handle Top Video (User Source)
    if (result.userVideoSource instanceof File) {
      const url = URL.createObjectURL(result.userVideoSource);
      setTopVideoSrc(url);
      return () => URL.revokeObjectURL(url);
    } else {
      // Simulating the file downloaded from Cloud
      setTopVideoSrc(SIMULATED_CLOUD_DOWNLOAD_URL);
    }
  }, [result.userVideoSource]);

  useEffect(() => {
    // 2. Handle Bottom Video (Template)
    // Default to the template URL (Placeholder or real if backend existed)
    setBottomVideoSrc(result.templateVideoUrl);
  }, [result.templateVideoUrl]);

  // Sync Playback Logic
  const handlePlayPause = () => {
    const top = topVideoRef.current;
    const bottom = bottomVideoRef.current;
    
    if (top && bottom) {
      if (top.paused) {
        top.play().catch(e => console.log("Playback prevented", e));
        bottom.play().catch(e => console.log("Playback prevented", e));
      } else {
        top.pause();
        bottom.pause();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTemplateOverride = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setBottomVideoSrc(url);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto px-4 py-8 items-start justify-center">
      {/* Phone Preview Container */}
      <div className="relative flex-shrink-0 mx-auto">
        <div className="relative w-[340px] h-[680px] bg-black rounded-[3rem] border-[8px] border-zinc-800 overflow-hidden shadow-2xl ring-1 ring-white/20 flex flex-col">
           
           {/* TOP HALF: Main Video */}
           <div className="relative w-full h-1/2 bg-zinc-900 overflow-hidden border-b border-white/10">
               {topVideoSrc ? (
                 <video 
                   ref={topVideoRef}
                   src={topVideoSrc}
                   className="w-full h-full object-cover"
                   autoPlay
                   loop
                   muted={isMuted}
                   playsInline
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center">
                   <span className="loading loading-spinner text-white">Loading Source...</span>
                 </div>
               )}
               
               {/* Badge */}
               <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded font-mono border border-white/10">
                 {result.userVideoSource instanceof File ? 'LOCAL UPLOAD' : 'CLOUD DOWNLOAD'}
               </div>
           </div>

           {/* BOTTOM HALF: Template Video */}
           <div className="relative w-full h-1/2 bg-zinc-900 overflow-hidden group">
              {bottomVideoSrc ? (
                <video 
                  ref={bottomVideoRef}
                  src={bottomVideoSrc}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted={true} // Always mute template
                  playsInline
                />
              ) : null}
              
              {/* Helper to upload real file if placeholder is annoying */}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <p className="text-white text-xs font-bold mb-2">Is this placeholder wrong?</p>
                <span className="bg-primary text-white text-xs px-3 py-2 rounded-full">
                  Upload Real {result.caption.includes('Minecraft') ? 'Minecraft' : 'Template'} File
                </span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="video/*" 
                  onChange={handleTemplateOverride}
                />
              </div>
           </div>

           {/* OVERLAY CONTROLS */}
           <div 
             className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none"
           >
               {/* Top Controls */}
               <div className="flex justify-end p-4 pointer-events-auto">
                  <button 
                    onClick={toggleMute} 
                    className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/10 hover:bg-black/60"
                  >
                      {isMuted ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeDasharray="2 2" /><line x1="17" y1="7" x2="7" y2="17" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                      )}
                  </button>
               </div>

               {/* Play/Pause Click Area */}
               <div className="absolute inset-0 z-10 pointer-events-auto" onClick={handlePlayPause}></div>

               {/* Caption Overlay */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-30 pointer-events-none">
                    <div className="inline-block bg-white text-black px-4 py-2 font-black text-xl uppercase transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                        {result.caption}
                    </div>
               </div>

               {/* Footer Metadata */}
               <div className="mt-auto p-4 z-30 pointer-events-none">
                   <div className="bg-black/20 backdrop-blur-sm p-3 rounded-xl border border-white/5 inline-block max-w-[90%]">
                       <p className="text-white font-bold text-sm drop-shadow-md mb-1">
                           {result.caption}
                       </p>
                       <div className="flex flex-wrap gap-1">
                            {result.hashtags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] font-bold text-white/90">
                                    {tag}
                                </span>
                            ))}
                       </div>
                   </div>
               </div>
           </div>
        </div>
      </div>

      {/* Right Side Panel */}
      <div className="flex-1 max-w-md w-full pt-4">
          <div className="bg-surface border border-zinc-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                 <h3 className="text-xl font-bold text-white">Generation Complete</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                  <div className="bg-black/40 p-4 rounded-xl border border-zinc-700/50">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Cloud Status</span>
                        <span className="text-green-400 font-bold">Source Deleted</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Resolution</span>
                        <span className="text-white font-mono">1080x1920 (9:16)</span>
                      </div>
                  </div>
                  
                  <div className="bg-yellow-900/20 border border-yellow-700/30 p-4 rounded-xl">
                    <p className="text-yellow-500 text-xs leading-relaxed">
                      <strong>Demo Note:</strong> The bottom video is a placeholder. In the real app, your backend would download the specific YouTube ID ({result.templateVideoUrl.split('/').pop()}) to an MP4 file. 
                      <br/><br/>
                      Hover over the bottom video to upload a custom file if you have the real clip.
                    </p>
                  </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full py-4 font-bold text-lg group relative overflow-hidden">
                    <span className="relative z-10">Download Final MP4</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
                <Button variant="secondary" onClick={onReset} className="w-full">
                    Start New Project
                </Button>
              </div>
          </div>
      </div>
    </div>
  );
};