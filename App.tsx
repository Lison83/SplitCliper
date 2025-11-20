import React, { useState, useCallback } from 'react';
import { AppState, TemplateVideo, VideoResult } from './types';
import { HeroInput } from './components/HeroInput';
import { TemplateSelector } from './components/TemplateSelector';
import { ResultPreview } from './components/ResultPreview';
import { Button } from './components/Button';
import { ProcessingSteps } from './components/ProcessingSteps';

const VIRAL_CAPTIONS = [
  "WAIT FOR IT... 😱",
  "SATISFYING 🤤",
  "YOU WON'T BELIEVE THIS 🔥",
  "WATCH UNTIL THE END ⚡",
  "LEVEL 999 BOSS 🤯",
  "ODDLY SATISFYING ✨"
];

// Simulation steps mirroring backend behavior
const INITIAL_STEPS = [
  { id: 'download_main', label: 'Fetching Source Video...', status: 'waiting' as const },
  { id: 'download_template', label: 'Downloading Template (1080p)...', status: 'waiting' as const },
  { id: 'stitching', label: 'Stitching Split Screen...', status: 'waiting' as const },
  { id: 'cleanup', label: 'Deleting Source from Cloud...', status: 'waiting' as const },
];

export default function App() {
  const [state, setState] = useState<AppState>(AppState.INPUT);
  const [userSource, setUserSource] = useState<string | File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateVideo | null>(null);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [processingSteps, setProcessingSteps] = useState(INITIAL_STEPS);

  const handleInputSubmit = (source: string | File) => {
    setUserSource(source);
    // Smooth scroll to templates
    setTimeout(() => {
        document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTemplateSelect = (template: TemplateVideo) => {
    setSelectedTemplate(template);
  };

  const runSimulation = async () => {
    setState(AppState.DOWNLOADING);
    
    const steps = [...INITIAL_STEPS];
    
    for (let i = 0; i < steps.length; i++) {
      setProcessingSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'active' } : 
        idx < i ? { ...s, status: 'completed' } : s
      ));
      
      // Variable delay for realism
      const delay = i === 2 ? 2000 : 1200;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    setProcessingSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
    await new Promise(resolve => setTimeout(resolve, 600));
  };

  const handleGenerate = useCallback(async () => {
    if (!userSource || !selectedTemplate) return;

    await runSimulation();

    const randomCaption = VIRAL_CAPTIONS[Math.floor(Math.random() * VIRAL_CAPTIONS.length)];
    const hashtags = ["#shorts", "#viral", "#fyp", "#satisfying", `#${selectedTemplate.category}`];

    setResult({
      userVideoSource: userSource,
      templateVideoUrl: selectedTemplate.videoUrl,
      caption: randomCaption,
      hashtags: hashtags
    });
    setState(AppState.RESULT);
  }, [userSource, selectedTemplate]);

  const resetApp = () => {
    setState(AppState.INPUT);
    setUserSource(null);
    setSelectedTemplate(null);
    setResult(null);
    setProcessingSteps(INITIAL_STEPS);
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-surface/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-white/10">SC</div>
            <span className="font-bold text-xl tracking-tight">SplitClip</span>
          </div>
          <div className="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-1 rounded bg-black/20">
             v2.4.0 (Cloud)
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {state === AppState.INPUT && (
          <>
            <div className="py-8">
                <HeroInput onSubmit={handleInputSubmit} />
            </div>

            <div id="templates" className={`transition-all duration-500 pb-32 px-4 ${userSource ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-4 grayscale blur-[2px] pointer-events-none'}`}>
              <TemplateSelector 
                selectedId={selectedTemplate?.id || null} 
                onSelect={handleTemplateSelect} 
              />
              
              <div className="fixed bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-auto px-4">
                <div className="shadow-2xl shadow-black w-full max-w-md">
                  {userSource && selectedTemplate && (
                    <Button 
                      onClick={handleGenerate} 
                      className="w-full text-lg py-4 rounded-full font-bold animate-bounce-slow shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                    >
                      Create Split Screen
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {state === AppState.DOWNLOADING && (
          <div className="min-h-[60vh] flex items-center justify-center p-4">
            <ProcessingSteps steps={processingSteps} />
          </div>
        )}

        {state === AppState.RESULT && result && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-500">
            <ResultPreview result={result} onReset={resetApp} />
          </div>
        )}
      </main>
    </div>
  );
}