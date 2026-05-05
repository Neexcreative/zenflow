Zenflow Audio Assets

Recommended formats:
- `.mp3` for broad browser support
- `.ogg` can be added later if you want alternate encoded versions

Recommended max file sizes:
- Ambient loop: 1.5 MB preferred, 4 MB hard cap
- Keep loops short and seamless for better loading and memory use

Naming convention:
- Use lowercase kebab-case only
- Examples:
  - `rain.mp3`
  - `ocean.mp3`
  - `bustling-cafe.mp3`
  - `white-noise.mp3`

How to replace placeholders later:
1. Drop the audio file into this folder.
2. Update or add the metadata entry in `Client/src/data/sounds.js`.
3. Keep the `id` and `assetUrl` aligned with the filename.
4. Set `premium` and `loop` based on product rules.

Future migration note:
- The sound gallery data is already prepared so `assetUrl` can later point to Supabase Storage or a CDN URL instead of this local folder.
