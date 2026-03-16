import { PrismaClient } from "@prisma/client";

if (process.argv[2]) {
  process.env.DATABASE_URL = process.argv[2];
}

const prisma = new PrismaClient();

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

async function main() {
  console.log("Seeding database...");

  // Find or create a seed user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: "seed_user_1",
        username: "noni_creator",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noni",
      },
    });
  }

  for (const video of placeholderVideos) {
    try {
        await prisma.reel.create({
          data: {
            user_id: user.id,
            video_url: video.url,
            caption: video.caption,
            type: "FUNNY",
            visibility: "PUBLIC",
            duration_seconds: 15,
          },
        });
        console.log(`Uploaded: ${video.caption}`);
    } catch (err) {
        console.error("Failed to insert reel:", err);
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
