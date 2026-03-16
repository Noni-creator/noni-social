import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export async function getOrCreateUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  // Check if user exists in our DB
  let user = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  // If not, create them
  if (!user) {
    // Generate a username if none exists (fallback)
    const username = clerkUser.username || 
                     (clerkUser.firstName ? clerkUser.firstName.toLowerCase() + Math.floor(Math.random() * 1000) : null) || 
                     `user_${Math.floor(Math.random() * 1000000)}`;

    user = await db.user.create({
      data: {
        clerkId: clerkUser.id,
        username: username,
        avatar_url: clerkUser.imageUrl,
      },
    });
  }

  return user;
}
