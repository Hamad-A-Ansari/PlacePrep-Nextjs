"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// Kick off the Google OAuth flow. Called from a Server Action triggered by
// the client (AuthForm), which then redirects the browser to the returned URL.
export async function signInWithGoogle() {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error starting Google sign-in:", error);
    return { success: false, message: "Failed to start Google sign-in." };
  }

  return { success: true, url: data.url };
}

// Sign out the current user by clearing their Supabase session.
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

// Get the current user from the Supabase session cookie.
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    name:
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email?.split("@")[0] ??
      "User",
    email: user.email ?? "",
  };
}

// Check if the user is authenticated.
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
