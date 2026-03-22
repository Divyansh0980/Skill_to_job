"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Github, Loader2 } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const errorUrl = searchParams ? searchParams.get("error") : null;
  
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
  const [isLoadingGithub, setIsLoadingGithub] = React.useState(false);
  const [isLoadingCredentials, setIsLoadingCredentials] = React.useState(false);
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(errorUrl ? "Authentication failed. Please check your credentials." : null);

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      if (provider === "google") setIsLoadingGoogle(true);
      if (provider === "github") setIsLoadingGithub(true);
      setError(null);
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoadingGoogle(false);
      setIsLoadingGithub(false);
    }
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoadingCredentials(true);
      setError(null);
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else if (result?.ok) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoadingCredentials(false);
    }
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Decorative Section for Desktop */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-zinc-900 dark:text-zinc-100 lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-3xl" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6 text-primary"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          SkillToJob
        </div>

        {/* Central Marketing Text injected with Arial and Italics */}
        <div className="relative z-20 flex flex-1 flex-col justify-center max-w-lg space-y-8">
          <h2 
            className="text-4xl md:text-6xl font-bold leading-tight" 
            style={{ fontFamily: "'Arial', sans-serif" }}
          >
            Prove Your <br />
            <i className="italic font-normal text-primary font-serif">Expertise</i>,<br />
            Land The Job.
          </h2>
          <p 
            className="text-xl leading-relaxed text-zinc-700 dark:text-zinc-300" 
            style={{ fontFamily: "'Arial', sans-serif" }}
          >
            Stop relying on broken technical interviews. SkillToJob bridges the gap between <i className="italic text-primary">what you know</i> and <i className="italic text-primary">what employers need</i> through verified, portfolio-driven evidence.
          </p>
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg" style={{ fontFamily: "'Arial', sans-serif" }}>
              &ldquo;This platform fundamentally changed how I hire. The <i className="italic text-primary">verified candidate evidence logs</i> saved my team countless hours of technical screening.&rdquo;
            </p>
            <footer className="text-sm text-zinc-600 dark:text-zinc-400">Sofia Davis, Technical Recruiter</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Verify your skills or find the perfect candidate.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full bg-card hover:bg-muted"
                onClick={() => handleOAuthSignIn("github")}
                disabled={isLoadingGithub || isLoadingGoogle || isLoadingCredentials}
              >
                {isLoadingGithub ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                Candidate
              </Button>
              <Button
                variant="outline"
                className="w-full bg-card hover:bg-muted"
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoadingGithub || isLoadingGoogle || isLoadingCredentials}
              >
                {isLoadingGoogle ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4 fill-current"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                )}
                Recruiter
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with credentials
                </span>
              </div>
            </div>

            <form onSubmit={handleCredentialsSignIn}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoadingGithub || isLoadingGoogle || isLoadingCredentials}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <label htmlFor="password" className="text-sm font-medium leading-none">
                      Password
                    </label>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoadingGithub || isLoadingGoogle || isLoadingCredentials}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                {error && (
                  <div className="text-sm text-destructive mt-2 text-center font-medium">
                    {error}
                  </div>
                )}
                <Button disabled={isLoadingGithub || isLoadingGoogle || isLoadingCredentials} type="submit" className="w-full mt-2">
                  {isLoadingCredentials ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Sign In as Recruiter
                </Button>
              </div>
            </form>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
