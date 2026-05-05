Zenflow Background Assets

Recommended formats:
- `.webp` for most static backgrounds
- `.jpg` only if photo compression looks better
- `.gif` only for very small animated loops
- `.mp4` or `.webm` for future lightweight video backgrounds

Recommended max file sizes:
- Static image: 600 KB preferred, 1.2 MB hard cap
- Thumbnail: 120 KB preferred, 200 KB hard cap
- Animated GIF: 1.5 MB preferred, 3 MB hard cap
- Video loop: 4 MB preferred, 8 MB hard cap

Naming convention:
- Use lowercase kebab-case only
- Examples:
  - `lofi-night-room.webp`
  - `rainy-window-desk.webp`
  - `cafe-corner.mp4`

How to replace placeholders later:
1. Add the full-size asset here.
2. Add the thumbnail file to `/backgrounds/thumbs/`.
3. Update or add the metadata entry in `Client/src/data/backgrounds.js`.
4. Keep the same `id`, `assetUrl`, and `thumbnail` paths in sync.

Future migration note:
- The gallery data is already prepared so `assetUrl` can later point to Supabase Storage or a CDN URL instead of this local folder.
