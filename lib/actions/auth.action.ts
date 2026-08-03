"use server";

import { createClient } from "@/lib/supabase/server";

// Create a new account with email/password. The name is stored in
// user_metadata (Supabase Auth has no separate users table by default).
export async function signUp(params: SignUpParams) {
  const { name, email, password } = params;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    console.error("Error creating user:", error);

    if (error.message.toLowerCase().includes("already registered")) {
      return {
        success: false,
        message: "This email is already in use.",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }

  return {
    success: true,
    message: "Account created successfully. Please sign in.",
  };
}

// Sign in with email/password. Sets the Supabase session cookie.
export async function signIn(params: SignInParams) {
  const { email, password } = params;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error);

    return {
      success: false,
      message: "Invalid email or password. Please try again.",
    };
  }

  return { success: true };
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
