export interface TemplateVideo {
  id: string;
  name: string;
  videoUrl: string; // Direct MP4 URL
  thumbnail: string;
  category: 'gameplay' | 'satisfying' | 'ai-generated';
  description: string;
}

export interface VideoResult {
  userVideoSource: string | File; // Can be a URL (cloud path) or a File object (local)
  templateVideoUrl: string;
  caption: string;
  hashtags: string[];
}

export enum AppState {
  INPUT = 'INPUT',
  DOWNLOADING = 'DOWNLOADING', // Simulates cloud download
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
}

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'waiting' | 'active' | 'completed';
}