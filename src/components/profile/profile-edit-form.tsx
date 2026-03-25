"use client";

import { User } from "@/lib/auth/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSwap } from "../ui/loading-swap";

const formSchema = z.object({
  name: z.string().trim().min(1),
  username: z.string().trim().min(1),
  portfolioLink: z.url({ error: "Invalid url." }).optional(),
  location: z.string().optional(),
  bio: z
    .string()
    .max(200, { error: "Bio cannot be longer than 200 characters." })
    .optional(),
});

type FormType = z.infer<typeof formSchema>;

export const ProfileEditForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      username: user.username ?? "",
      portfolioLink: user.portfolioLink ?? undefined,
      location: user.location ?? undefined,
      bio: user.bio ?? undefined,
    },
  });

  const handleUpdateProfile = async (data: FormType) => {
    await authClient.updateUser(data, {
      onSuccess: () => {
        toast.success("Profile details updated successfully!");
        router.push("/profile");
      },
      onError: () => {
        toast.error("Failed to update profile details.");
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateProfile)}
        className="flex flex-col gap-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name<span className="text-primary font-medium">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="dark:bg-input/40"
                  placeholder="Enter your name..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Username<span className="text-primary font-medium">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="dark:bg-input/40"
                  placeholder="Enter your username..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="portfolioLink"
          control={form.control}
          render={({ field: { value, ...props } }) => (
            <FormItem>
              <FormLabel>Portfolio Link</FormLabel>
              <FormControl>
                <Input
                  value={value ?? ""}
                  {...props}
                  className="dark:bg-input/40"
                  placeholder="Enter your portfolio link..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="location"
          control={form.control}
          render={({ field: { value, ...props } }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  value={value ?? ""}
                  {...props}
                  className="dark:bg-input/40"
                  placeholder="Enter your location..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="bio"
          control={form.control}
          render={({ field: { value, ...props } }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  value={value ?? ""}
                  {...props}
                  placeholder="Enter your bio, no longer than 200 characters..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="self-end"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Save Changes
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};
