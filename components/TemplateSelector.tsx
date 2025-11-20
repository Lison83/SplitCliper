import React from 'react';
import { TEMPLATES } from '../constants';
import { TemplateVideo } from '../types';

interface TemplateSelectorProps {
  selectedId: string | null;
  onSelect: (template: TemplateVideo) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Choose Bottom Video</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => (
          <div 
            key={template.id}
            onClick={() => onSelect(template)}
            className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedId === template.id ? 'border-primary scale-[1.02] shadow-xl shadow-primary/20' : 'border-transparent hover:border-zinc-600'}`}
          >
            <div className="aspect-[9/16] w-full bg-zinc-800 relative">
              <img 
                src={template.thumbnail} 
                alt={template.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="font-bold text-white text-lg">{template.name}</h3>
                <p className="text-sm text-zinc-300 mt-1">{template.description}</p>
              </div>
              
              {selectedId === template.id && (
                <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};