import React, { useState, useRef } from 'react';
import { Button } from './Button';

interface HeroInputProps {
  onSubmit: (source: string | File) => void;
}

export const HeroInput: React.FC<HeroInputProps> = ({ onSubmit }) => {
  const [activeTab, setActiveTab] = useState<'link' | 'upload'>('link');
  const [url, setUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSubmit(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onSubmit(file);
      } else {
        alert("Please upload a video file");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-block mb-4 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700 text-zinc-400 text-xs font-medium uppercase tracking-wider">
        Split Screen Generator
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 tracking-tight">
        Viral <span className="text-white">Split</span><span className="text-primary">Clip</span> Maker
      </h1>
      <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
        Select a Main Video (Top) and we will stitch it with a high-retention Template (Bottom).
      </p>

      <div className="max-w-2xl mx-auto bg-surface/50 backdrop-blur-xl rounded-3xl border border-zinc-800 p-2 shadow-2xl">
        <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-black/20 rounded-xl">
          <button 
            onClick={() => setActiveTab('link')}
            className={`py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'link' ? 'bg-zinc-800 text-white shadow-lg ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Paste YouTube Link
          </button>
          <button 
            onClick={() => setActiveTab('upload')}
            className={`py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'upload' ? 'bg-zinc-800 text-white shadow-lg ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Upload Video File
          </button>
        </div>

        {activeTab === 'link' ? (
          <form onSubmit={handleUrlSubmit} className="relative p-4">
             <div className="relative flex items-center bg-black/50 rounded-2xl border border-zinc-700 p-2 focus-within:border-primary transition-colors">
                <div className="pl-4 text-zinc-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                </div>
                <input 
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube Shorts or Video URL..."
                  className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-zinc-600 text-lg"
                />
                <Button type="submit" className="min-w-[100px] py-2 rounded-xl font-bold text-sm">
                  Import
                </Button>
              </div>
          </form>
        ) : (
          <div 
            className={`relative p-10 border-2 border-dashed rounded-2xl transition-all cursor-pointer group ${dragActive ? 'border-primary bg-primary/10' : 'border-zinc-700 hover:border-zinc-500 bg-black/20'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="video/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors flex items-center justify-center text-zinc-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">Upload Main Video</p>
                <p className="text-zinc-500 text-sm mt-1">Drag & Drop MP4 file here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};