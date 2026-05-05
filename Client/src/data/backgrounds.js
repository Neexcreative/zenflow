// Later, `assetUrl` and `thumbnail` can point to Supabase Storage or CDN URLs
// instead of local files in `/public/backgrounds`.
export const BACKGROUND_FILTERS = ['All', 'Lofi', 'Rainy', 'Café', 'Nature', 'Night', 'Study']

export const DEFAULT_BACKGROUND_ID = 'default-gradient'

export const BACKGROUND_GALLERY = [
  {
    id: 'default-gradient',
    title: 'Default Gradient',
    category: 'study',
    mood: 'calm',
    type: 'image',
    thumbnail: '',
    assetUrl: '',
    premium: false,
    tags: ['default', 'calm', 'study'],
    fallbackTheme: 'default',
  },
  {
    id: 'lofi-night-room',
    title: 'Lofi Night Room',
    category: 'lofi',
    mood: 'calm',
    type: 'image',
    thumbnail: '/backgrounds/thumbs/lofi-night-room-thumb.webp',
    assetUrl: '/backgrounds/lofi-night-room.webp',
    premium: false,
    tags: ['lofi', 'night', 'study'],
    fallbackTheme: 'deep-focus',
  },
  {
    id: 'rainy-window-desk',
    title: 'Rainy Window Desk',
    category: 'rainy',
    mood: 'calm',
    type: 'image',
    thumbnail: '/backgrounds/thumbs/rainy-window-desk-thumb.webp',
    assetUrl: '/backgrounds/rainy-window-desk.webp',
    premium: false,
    tags: ['rainy', 'window', 'focus'],
    fallbackTheme: 'rainy-night',
  },
  {
    id: 'cafe-corner',
    title: 'Cafe Corner',
    category: 'café',
    mood: 'warm',
    type: 'image',
    thumbnail: '/backgrounds/thumbs/cafe-corner-thumb.webp',
    assetUrl: '/backgrounds/cafe-corner.webp',
    premium: true,
    tags: ['cafe', 'warm', 'study'],
    fallbackTheme: 'sunset-flow',
  },
  {
    id: 'forest-breath',
    title: 'Forest Breath',
    category: 'nature',
    mood: 'fresh',
    type: 'image',
    thumbnail: '/backgrounds/thumbs/forest-breath-thumb.webp',
    assetUrl: '/backgrounds/forest-breath.webp',
    premium: false,
    tags: ['nature', 'forest', 'calm'],
    fallbackTheme: 'deep-focus',
  },
  {
    id: 'midnight-library',
    title: 'Midnight Library',
    category: 'night',
    mood: 'quiet',
    type: 'image',
    thumbnail: '/backgrounds/thumbs/midnight-library-thumb.webp',
    assetUrl: '/backgrounds/midnight-library.webp',
    premium: true,
    tags: ['night', 'library', 'study'],
    fallbackTheme: 'minimal-dark',
  },
  {
    id: 'study-blueprint',
    title: 'Study Blueprint',
    category: 'study',
    mood: 'focused',
    type: 'image',
    thumbnail: '/backgrounds/thumbs/study-blueprint-thumb.webp',
    assetUrl: '/backgrounds/study-blueprint.webp',
    premium: false,
    tags: ['study', 'blueprint', 'focus'],
    fallbackTheme: 'default',
  },
]

export function getBackgroundById(id) {
  return BACKGROUND_GALLERY.find((item) => item.id === id) || BACKGROUND_GALLERY[0]
}
