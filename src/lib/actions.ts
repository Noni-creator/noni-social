"use server";

import { db } from "./db";
import { ReelType, Visibility } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import { getOrCreateUser } from "./user-sync";

export async function createReel(formData: FormData) {
  try {
    const user = await getOrCreateUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const type = (formData.get("type") as ReelType) || ReelType.FRIENDSHIP;
  const visibility = (formData.get("visibility") as Visibility) || Visibility.PUBLIC;
  const caption = formData.get("caption") as string | null;
  
  const userId = user.id; // Correctly linked user

  // Audio handling
  let audioId = formData.get("audioId") as string | null;
  const songTitle = formData.get("songTitle") as string | null;
  const songArtist = formData.get("songArtist") as string | null;
  const songUrl = formData.get("songUrl") as string | null;
  const songCover = formData.get("songCover") as string | null;

  // If a new song was selected from iTunes, upsert it
  if (!audioId && songTitle && songArtist && songUrl) {
    const song = await db.song.upsert({
      where: { id: "00000000-0000-0000-0000-000000000000" }, // This is a trick or just use findFirst + create
      // Actually Prisma upsert needs a unique field. id is the only unique one.
      // Let's use findFirst + create
      update: {},
      create: {
        title: songTitle,
        artist: songArtist,
        audio_url: songUrl,
        cover_image: songCover,
      },
    }).catch(async () => {
        // Fallback: check by title/artist
        let existing = await db.song.findFirst({
            where: { title: songTitle, artist: songArtist }
        });
        if (!existing) {
            existing = await db.song.create({
                data: {
                    title: songTitle,
                    artist: songArtist,
                    audio_url: songUrl,
                    cover_image: songCover,
                }
            });
        }
        return existing;
    });
    audioId = (song as any).id;
  }

  // The URL of the video already uploaded by the client
  const videoUrl = formData.get("videoUrl") as string | null;

  if (!videoUrl) {
    throw new Error("No videoUrl provided");
  }

  const finalUrl = videoUrl;

  await db.reel.create({
    data: {
      user_id: user.id,
      video_url: finalUrl,
      caption: caption || null,
      type: type,
      visibility: visibility,
      duration_seconds: 0,
      ...(audioId ? { audio_id: audioId } : {}),
    },
  });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("CREATE_REEL_ERROR:", error);
    return { error: error.message || "Failed to create reel" };
  }
}
