"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { ReelType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReel(formData: FormData) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const videoUrl = formData.get("videoUrl") as string;
  const caption = formData.get("caption") as string;
  const type = formData.get("type") as ReelType;

  if (!videoUrl || !type) {
    throw new Error("Missing required fields");
  }

  // Find user in our DB
  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  await db.reel.create({
    data: {
      user_id: user.id,
      video_url: videoUrl,
      caption: caption,
      type: type,
      duration_seconds: 0, // Placeholder
    },
  });

  revalidatePath("/");
  redirect("/");
}
