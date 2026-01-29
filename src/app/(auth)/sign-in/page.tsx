"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaGithub } from "react-icons/fa6";
import { useState } from "react";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});

type FormType = z.infer<typeof formSchema>;

const SignInPage = () => {
  const [socialSignInLoading, setSocialSignInLoading] = useState(false);
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const pending = form.formState.isSubmitting || socialSignInLoading;

  const handleSignIn = async (data: FormType) => {
    await authClient.signIn.email({
      ...data,
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          toast.success("Sign in successful");
        },
        onError: (err) => {
          toast.error(err.error.message ?? "Something went wrong");
        },
      },
    });
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialSignInLoading(true);
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          setSocialSignInLoading(false);
        },
        onError: (err) => {
          setSocialSignInLoading(false);
          toast.error(err.error.message ?? "Something went wrong");
        },
      },
    });
  };

  return (
    <div className="min-h-svh w-full py-10 px-6 flex items-center justify-center">
      <div className="py-6 px-8 rounded-xl space-y-4 border bg-card w-full max-w-[375px]">
        <div className="flex flex-col items-start gap-2">
          <Image
            src="/images/site-logo.svg"
            alt="Logo image"
            width={50}
            height={50}
          />
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-muted-foreground">to continue to DaoOverflow</p>
        </div>
        <div className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignIn)}
              className="space-y-4"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="email@example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="•••••••••••••"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={pending} className="w-full">
                <LoadingSwap isLoading={pending}>Sign in</LoadingSwap>
              </Button>
            </form>
          </Form>
          <div className="flex items-center gap-2">
            <hr className="flex-1" />
            <span className="text-muted-foreground">or continue with</span>
            <hr className="flex-1" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Button
              onClick={() => handleSocialSignIn("google")}
              variant="outline"
              className="flex-1 w-full"
              disabled={pending}
            >
              <LoadingSwap isLoading={pending}>
                <div className="flex items-center gap-2">
                  <FaGoogle />
                  <span>Google</span>
                </div>
              </LoadingSwap>
            </Button>
            <Button
              onClick={() => handleSocialSignIn("github")}
              variant="outline"
              className="flex-1 w-full"
              disabled={pending}
            >
              <LoadingSwap isLoading={pending}>
                <div className="flex items-center gap-2">
                  <FaGithub />
                  <span>Github</span>
                </div>
              </LoadingSwap>
            </Button>
          </div>
          <p className="text-sm">
            Don&apos;t have an account? Create one{" "}
            <Link href="/sign-up" className="text-primary font-medium">
              here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
