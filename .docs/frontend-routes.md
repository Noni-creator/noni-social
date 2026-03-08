# Frontend Routes (Next.js App Router)

## Public Routes
- `/` - Landing page
- `/login` - Authentication / Sign in
- `/signup` - Registration

## Protected Routes
- `/feed/friendship` - Infinite scroll of Friendship Reels (6-15s sweet moments)
- `/feed/funny` - Infinite scroll of Funny Reels (6s joke loops)
- `/studio` - Music Video Studio (TikTok style editing and recording)
- `/messages` - DMs inbox showing all recent private conversations
- `/messages/[id]` - Private DM thread with a specific user
- `/groups` - User's group chats directory
- `/groups/[id]` - Group chat interface with real-time text and media sharing
- `/groups/[id]/game/[gameId]` - Real-time mini-games interface within a group hangout
- `/camera` - AR Lens camera capture interface for quick photo/video snaps
- `/profile` - Current user's profile showing details, content, and Social Score
- `/profile/[username]` - Public view of another user's profile and public reels
