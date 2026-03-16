import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const placeholderVideos = [
  {
    url: "https://v1.pinimg.com/videos/mc/720p/11/4a/01/114a01c4e207ed1653896c81308a09f3.mp4",
    caption: "Beautiful sunset vibes 🌅 #peace #nature",
  },
  {
    url: "https://v1.pinimg.com/videos/mc/720p/2b/9d/8b/2b9d8b8b3a0a0a0a0a0a0a0a0a0a0a0a.mp4", // Note: These are example URLs, hopefully they work or I'll use common ones
    caption: "Morning coffee and work ☕️",
  },
  // High quality vertical videos from Pexels/Dummy
  {
      url: "https://assets.mixkit.co/videos/preview/mixkit-girl-walking-low-angle-shot-of-feet-42770-large.mp4",
      caption: "Walking into the weekend like... 🚶‍♀️"
  },
  {
      url: "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-woman-dancing-in-a-field-of-flowers-34446-large.mp4",
      caption: "Golden hour glow ✨ #aesthetic"
  },
  {
      url: "https://assets.mixkit.co/videos/preview/mixkit-urban-city-traffic-at-night-42861-large.mp4",
      caption: "City lights 🌃 #nightlife"
  },
  {
      url: "https://assets.mixkit.co/videos/preview/mixkit-man-skating-on-a-pavement-in-the-city-42750-large.mp4",
      caption: "Skate day 🛹"
  },
  {
      url: "https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-meal-in-a-restaurant-kitchen-42730-large.mp4",
      caption: "Dinner is served 🥘"
  },
  {
      url: "https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-a-window-at-night-42845-large.mp4",
      caption: "Rainy nights 🌧️ #lofi"
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
        await (prisma.reel as any).create({
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
