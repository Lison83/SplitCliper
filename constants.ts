import { TemplateVideo } from './types';

// NOTE: In a fully functioning production app, your backend (Python/Node.js) would 
// download the specific YouTube ID (e.g., QPW3XwBoQlw) and convert it to an MP4.
// Since this is a frontend-only demo, we cannot bypass YouTube's CORS/Download restrictions directly.
// 
// WE USE HIGH-QUALITY PLACEHOLDERS HERE. 
// The user can also "Upload" the specific template file in the UI to test the exact result.

export const TEMPLATES: TemplateVideo[] = [
  {
    id: 'minecraft-parkour',
    name: 'Minecraft Parkour',
    // Placeholder: Action/Jumping style video
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
    thumbnail: 'https://img.youtube.com/vi/QPW3XwBoQlw/maxresdefault.jpg',
    category: 'gameplay',
    description: 'High-speed parkour gameplay.'
  },
  {
    id: 'subway-surfers',
    name: 'Subway Surfers',
    // Placeholder: Fast motion/Runner style
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
    thumbnail: 'https://img.youtube.com/vi/yuFwErfsnTM/maxresdefault.jpg',
    category: 'gameplay',
    description: 'Classic runner attention holder.'
  },
  {
    id: 'gta-ramps',
    name: 'GTA V Ramps',
    // Placeholder: Car/Action style
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
    thumbnail: 'https://img.youtube.com/vi/u7kdVe8q5zs/maxresdefault.jpg',
    category: 'gameplay',
    description: 'Satisfying car physics.'
  }
];

// If the user provides a link, we simulate "downloading" a main video.
// This is a placeholder for the file your cloud backend would produce.
export const SIMULATED_CLOUD_DOWNLOAD_URL = 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';