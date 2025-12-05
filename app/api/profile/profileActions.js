"use server";

import db from "@/lib/db";

export async function updateProfilePhoto(userId, url) {
  try {
    const [result] = await db.query(
      "UPDATE users SET avatar = ? WHERE user_id = ?",
      [url, userId]
    );

    return { success: true };
  } catch (err) {
    console.error("Update profile photo error:", err);
    return { error: "Failed update profile photo" };
  }
}
