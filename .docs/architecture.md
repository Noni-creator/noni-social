# Noni Social Architecture

## Tech Stack
- **Frontend**: Next.js App Router, React (TypeScript), TailwindCSS
- **Backend**: Next.js API Routes / Server Actions
- **Database**: PostgreSQL (via Prisma or Drizzle ORM)
- **Real-time**: WebSockets (Socket.io or Supabase Realtime) for DMs and Group chats
- **Storage**: AWS S3 or Cloudinary for Video/Image assets

## Core Components
1. **Video Processing Pipeline**: Handles Friendship Reels (6-15s) and Funny Reels (6s joke loops).
2. **Music Video Studio**: Client-side video trimming and audio merging (using Canvas/WebAudio API or ffmpeg.wasm) to provide TikTok-style editing.
3. **AR Lenses Engine**: Integration with tools like DeepAR or Mediapipe for facial tracking, masks, and real-time filters.
4. **Social Score Engine**: Event-driven architecture that calculates interactions, engagement, and rewards points automatically.
5. **Real-time Chat & Games**: WebSockets server handling state synchronization for private DMs and multiplayer mini-games inside group chats.
