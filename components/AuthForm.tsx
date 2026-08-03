"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/actions/auth.action";

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isSignIn = type === "sign-in";

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();

      if (!result.success || !result.url) {
        toast.error(result.message ?? "Failed to sign in with Google.");
        setIsLoading(false);
        return;
      }

      window.location.href = result.url;
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="card-border lg:min-w-[450px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-light-100">
            Place<span className="text-success-100">Prep</span>
          </h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Button
          className="btn w-full flex items-center justify-center gap-2"
          type="button"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          {isLoading
            ? "Redirecting to Google..."
            : isSignIn
              ? "Sign in with Google"
              : "Sign up with Google"}
        </Button>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
