# Database Schema (Relational)

## Tables

### Users
- `id` (UUID, PK)
- `username` (String, Unique)
- `avatar_url` (String)
- `social_score` (Int, default: 0)
- `created_at` (Timestamp)

### Reels
- `id` (UUID, PK)
- `user_id` (UUID, FK -> Users)
- `video_url` (String)
- `type` (Enum: 'FRIENDSHIP', 'FUNNY', 'MUSIC')
- `duration_seconds` (Int)
- `created_at` (Timestamp)

### DirectMessages (DMs)
- `id` (UUID, PK)
- `sender_id` (UUID, FK -> Users)
- `receiver_id` (UUID, FK -> Users)
- `content` (String, encrypted text or media link)
- `created_at` (Timestamp)

### Groups
- `id` (UUID, PK)
- `name` (String)
- `created_by` (UUID, FK -> Users)

### GroupMembers
- `group_id` (UUID, FK -> Groups)
- `user_id` (UUID, FK -> Users)
- `role` (Enum: 'ADMIN', 'MEMBER')
- PK: (group_id, user_id)

### SocialScoreLogs
- `id` (UUID, PK)
- `user_id` (UUID, FK -> Users)
- `action` (String) (e.g., 'POST_REEL', 'WIN_MINI_GAME', 'USE_AR_LENS')
- `points` (Int)
- `created_at` (Timestamp)
