import React from 'react';

interface Step {
  id: string;
  label: string;
  status: 'waiting' | 'active' | 'completed';
}

interface ProcessingStepsProps {
  steps: Step[];
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ steps }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-surface border border-zinc-800 rounded-2xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-center mb-8 animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Cloud Processing...
      </h2>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              {step.status === 'completed' ? (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black animate-in zoom-in duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : step.status === 'active' ? (
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-8 h-8 border-2 border-zinc-700 rounded-full" />
              )}
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-6 ${
                  step.status === 'completed' ? 'bg-green-500/50' : 'bg-zinc-800'
                }`} />
              )}
            </div>
            
            <div className="flex-1">
              <p className={`font-medium ${
                step.status === 'active' ? 'text-white' : 
                step.status === 'completed' ? 'text-green-400' : 'text-zinc-500'
              }`}>
                {step.label}
              </p>
              {step.status === 'active' && (
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary animate-[loading_1.5s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};