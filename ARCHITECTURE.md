# OG Image Generator Architecture

This document outlines the productionalized architecture for the OG Image Generator.

## Directory Structure

```
src/
├── routes/              # Route handlers
│   ├── airdrop.tsx      # Airdrop feature (route + renderer + types + constants)
│   ├── comment.tsx      # Comment feature (route + renderer + types + constants)
│   └── template.tsx     # Template for new features
├── shared/              # Shared resources
│   ├── components/      # Reusable React components
│   │   ├── BaseLayout.tsx
│   │   └── UserBadge.tsx
│   ├── services/        # Shared API utilities
│   │   └── api.ts
│   └── utils/           # Utility functions
│       ├── badge.ts
│       ├── getFonts.ts
│       └── loadImage.ts
└── index.ts            # Main application entry point
```

## Current Status

### ✅ Implemented
- **Airdrop OG Images**: `/airdrop/:handle?`
- **Comment OG Images**: `/comment/:id` and `/og/comment/:id`

### 🚧 Coming Soon
- **Track OG Images**: `/og/track/:id`
- **User OG Images**: `/og/user/:id`  
- **Collection OG Images**: `/og/collection/:id`

## Architecture Patterns

### 1. Renderer Pattern

Each OG image type follows a consistent pattern:

```typescript
export const render[Type]OGImage = async (c: Context, id: string) => {
  // 1. Fetch data using APIService
  const apiService = new APIService(c);
  const data = await apiService.get[Type]DataById(id);
  
  // 2. Load required images
  const [image1, image2] = await Promise.all([
    loadImage(c, path1),
    loadImage(c, path2),
  ]);
  
  // 3. Render content using components
  const renderContent = () => (
    <BaseLayout>
      {/* Content */}
    </BaseLayout>
  );
  
  // 4. Return ImageResponse with fonts
  const font = await getLocalFonts(c, [FONT_CONFIG.bold, FONT_CONFIG.regular]);
  return new ImageResponse(renderContent(), {
    width: OG_IMAGE_CONFIG.width,
    height: OG_IMAGE_CONFIG.height,
    fonts: Array.isArray(font) ? [...font] : [font],
  });
};
```

### 2. Component Pattern

Reusable components follow this pattern:

```typescript
interface ComponentProps {
  // Props with proper typing
}

export const Component = ({ prop1, prop2 }: ComponentProps) => {
  return (
    <div style={{ /* styles */ }}>
      {/* Content */}
    </div>
  );
};
```

### 3. Service Pattern

API services are centralized and follow this pattern:

```typescript
export class APIService {
  private baseUrl: string;

  constructor(c: Context) {
    this.baseUrl = c.env.API_URL;
  }

  async get[Type]DataById(id: string): Promise<TypeData> {
    const url = `${this.baseUrl}/v1/full/[type]s/${id}`;
    const res = await fetch(url);
    const response = await res.json() as { data: any; related: any };
    
    if (!response.data) throw new Error(`Failed to get ${type} ${id}`);
    
    return response;
  }
}
```

## Adding New OG Image Types

To add a new OG image type (e.g., `track`):

1. **Copy the template** and create `src/routes/track.tsx`:
   ```bash
   cp src/routes/template.tsx src/routes/track.tsx
   ```

3. **Update the feature** with your content type:
   ```typescript
   // Route definition
   export const trackRoute = new Hono()
     .get('/:id', async (c) => {
       try {
         const id = c.req.param('id');
         if (!id) {
           return c.json({ error: 'Missing track ID' }, 400);
         }
         return await renderTrackOGImage(c, id);
       } catch (error: any) {
         console.error('Track OG Image generation error:', error);
         return c.json({ error: 'Failed to generate track image', details: error.message }, 500);
       }
     });

   // Render function
   async function renderTrackOGImage(c: any, trackId: string) {
     // Replace example with track-specific logic
   }
   ```

4. **Add the route** in `src/index.ts`:
   ```typescript
   import { trackRoute } from './track';
   
   const app = new Hono()
     .use('*', logger())
     .route('/airdrop', airdropRoute)
     .route('/comment', commentRoute)
     .route('/track', trackRoute); // Add this line
   ```

5. **Types and constants** are defined directly in your feature file:
   ```typescript
   // Feature-specific types
   interface TrackData {
     // Type definition
   }
   
   // Feature-specific constants
   const ICON_PATHS = {
     // Your constants
   } as const;
   ```

See `src/routes/template.tsx` for a complete example of the feature structure.

## Code Style Guidelines

- **Indentation**: Use 2 spaces (not tabs)
- **Naming**: Use camelCase for variables, PascalCase for components
- **Imports**: Group imports by type (React, external, internal)
- **Error Handling**: Always wrap renderers in try-catch blocks
- **Type Safety**: Use proper TypeScript types, avoid `any` when possible
- **Constants**: Define feature-specific constants in each feature file

## Testing New Renderers

Test new renderers by making requests to:
- `/og/album/[album-id]` for album OG images
- `/og/user/[user-id]` for user OG images
- etc.

## Performance Considerations

- Use `Promise.all()` for concurrent image loading
- Cache frequently used images and fonts
- Optimize image sizes and formats
- Consider implementing request caching for API calls 