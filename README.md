# Dynamic OG Image Generator with Cloudflare Workers

A high-performance Open Graph image generator built with Cloudflare Workers, Hono, and Vercel OG. Generate beautiful social media cards dynamically for Audius content including tracks, collections, users, comments, and airdrops.

## Features

- 🚀 Built on Cloudflare Workers for edge computing
- ⚡ Multiple content types (tracks, collections, users, comments, airdrops)
- 🎨 Consistent design system with reusable components
- 🔄 Centralized API service with error handling
- 📱 Responsive OG images (1200x630)
- 🎯 TypeScript with full type safety
- 🏗️ Clean, modular architecture

## Quick Start

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Deploy to Cloudflare Workers
bun run deploy
```

## Usage

Generate OG images by making GET requests to specific endpoints:

### Currently Available

#### Airdrop Images
```
/airdrop/[handle]?  # Optional handle parameter
```

#### Comment Images
```
/comment/[comment-id]     # Direct comment route
/og/comment/[comment-id]  # Generic route
```

#### Entity Images
```
/track/[track-id]
/collection/[collection-id]
/user/[user-id]
/coin/[ticker]
```

#### Weekly Rotation Images
```
/weekly-rotation/[handle]   # 2x2 collage of the first four tracks in the user's current mix
```
The web app appends `?week=YYYY-WW` so URL-keyed scraper caches roll over with the mix.

## Architecture

The project follows a clean, feature-based architecture:

- **Features**: Each content type has its own directory with route + renderer
- **Shared**: Common components, services, utilities, and types
- **Components**: Reusable React components
- **Services**: Centralized API service
- **Types**: Full TypeScript type definitions
- **Utils**: Shared utility functions
- **Config**: Centralized constants and configuration

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## Adding New Content Types

To add a new OG image type:

1. Create `src/routes/[feature-name].tsx` with route + renderer
3. Add types and constants directly in your feature file
5. Add route in `src/index.ts` using `.route('/[feature-name]', [featureName]Route)`

See `src/routes/template.tsx` for a complete example.

## Tech Stack

- Cloudflare Workers
- Hono Framework
- Vercel OG
- TypeScript
- React (for OG image components)

## License

MIT
