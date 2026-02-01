"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { onboardUser } from "@/lib/actions/user.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().trim().min(1, { error: "Please enter a username" }),
});

type FormType = z.infer<typeof formSchema>;

export const OnboardingClient = () => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  const router = useRouter();

  const handleOnboarding = async (data: FormType) => {
    const response = await onboardUser(data.username.toLowerCase().trim());
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.push("/");
    }
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
          <h1 className="text-2xl font-semibold">You&apos;re almost there</h1>
          <p className="text-muted-foreground">just provide a username</p>
        </div>
        <div className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnboarding)}
              className="space-y-4"
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="jdoecodes" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={form.formState.isSubmitting} className="w-full">
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Finish
                </LoadingSwap>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
