const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.argv[2] || "postgresql://postgres.ehrvqjbpobzhrdqattyn:Nosonoso_2011@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
});

const placeholderVideos = [
  {
    url: "https://assets.mixkit.co/videos/preview/mixkit-girl-walking-low-angle-shot-of-feet-42770-large.mp4",
    caption: "Walking into the weekend like... 🚶‍♀️",
  },
  {
    url: "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-woman-dancing-in-a-field-of-flowers-34446-large.mp4",
    caption: "Golden hour glow ✨ #aesthetic",
  },
  {
    url: "https://assets.mixkit.co/videos/preview/mixkit-urban-city-traffic-at-night-42861-large.mp4",
    caption: "City lights 🌃 #nightlife",
  },
  {
    url: "https://assets.mixkit.co/videos/preview/mixkit-man-skating-on-a-pavement-in-the-city-42750-large.mp4",
    caption: "Skate day 🛹",
  },
  {
    url: "https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-meal-in-a-restaurant-kitchen-42730-large.mp4",
    caption: "Dinner is served 🥘",
  },
  {
    url: "https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-a-window-at-night-42845-large.mp4",
    caption: "Rainy nights 🌧️ #lofi",
  },
  {
    url: "https://player.vimeo.com/external/403423714.sd.mp4?s=d0f0c0b3bfa0c6c6f39e3f16c7a40b8f6a9c1e65&profile_id=165&oauth2_token_id=57447761",
    caption: "Ocean waves 🌊 #nature #calm",
  },
  {
    url: "https://player.vimeo.com/external/451805904.sd.mp4?s=f52230282b0906a3501655069562777174465b53&profile_id=165&oauth2_token_id=57447761",
    caption: "Coffee moments ☕️",
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Seeding database via pg...");
    
    // Get a user
    const userRes = await client.query('SELECT id FROM "User" LIMIT 1');
    if (userRes.rows.length === 0) {
      console.error("No user found. Please sign up in the app first.");
      return;
    }
    const userId = userRes.rows[0].id;

    for (const video of placeholderVideos) {
      const query = `
        INSERT INTO "Reel" (id, user_id, video_url, caption, type, visibility, duration_seconds, created_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())
      `;
      await client.query(query, [userId, video.url, video.caption, 'FUNNY', 'PUBLIC', 15]);
      console.log(`Inserted: ${video.caption}`);
    }
    
    console.log("Seed complete!");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
