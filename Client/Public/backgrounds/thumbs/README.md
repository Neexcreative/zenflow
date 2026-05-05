Zenflow Background Thumbnail Assets

Recommended formats:
- `.webp` for all thumbnails
- `.jpg` only if source material compresses better that way

Recommended max file sizes:
- 120 KB preferred
- 200 KB hard cap

Recommended dimensions:
- `640x360` for landscape previews
- Keep all thumbnails consistent for cleaner gallery cards

Naming convention:
- Use lowercase kebab-case only
- Match the main asset name with `-thumb`
- Examples:
  - `lofi-night-room-thumb.webp`
  - `rainy-window-desk-thumb.webp`

How to replace placeholders later:
1. Export a thumbnail from the final background asset.
2. Save it here using the same base name plus `-thumb`.
3. Update `Client/src/data/backgrounds.js` if the filename changes.

Future migration note:
- The background gallery can later swap these local thumbnail paths for Supabase Storage or CDN thumbnail URLs.
