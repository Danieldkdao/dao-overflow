"use client";

import { ForwardRefEditor } from "@/components/editor/forward-ref-editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { generateAIAnswer, postAnswer } from "@/lib/actions/answers.action";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  answerText: z
    .string()
    .trim()
    .min(1, { error: "Please enter a response before posting your answer." }),
});

type FormType = z.infer<typeof formSchema>;

export const AnswerSubmission = ({ questionId }: { questionId: string }) => {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answerText: "",
    },
  });
  const editorRef = useRef<MDXEditorMethods>(null);

  const handleSetEditorValue = (text: string) => {
    form.setValue("answerText", text, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    editorRef.current?.setMarkdown(text);
  };

  const handlePostAnswer = async ({ answerText }: FormType) => {
    const response = await postAnswer({ answerText, questionId });
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
      handleSetEditorValue("");
    }
  };

  const handleGenerateAIAnswer = async () => {
    if (isPending) return;
    setIsGenerating(true);
    const response = await generateAIAnswer(questionId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success("AI answer generated successfully!");
      handleSetEditorValue(response.message);
    }
    setIsGenerating(false);
  };

  const isPending = form.formState.isSubmitting || isGenerating;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-2xl font-semibold">Write your answer here</h3>
        <Button
          disabled={isPending}
          variant="outline"
          onClick={handleGenerateAIAnswer}
        >
          <LoadingSwap isLoading={isPending}>
            <div className="flex items-center gap-2 text-primary">
              <SparklesIcon className="text-primary" />
              Generate AI answer
            </div>
          </LoadingSwap>
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePostAnswer)}
          className="flex flex-col gap-4"
        >
          <FormField
            name="answerText"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ForwardRefEditor
                    ref={editorRef}
                    markdown={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="self-end"
            disabled={isPending || !form.formState.isDirty}
          >
            <LoadingSwap isLoading={isPending}>Post Answer</LoadingSwap>
          </Button>
        </form>
      </Form>
    </div>
  );
};
