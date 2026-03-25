"use client";

import { ForwardRefEditor } from "@/components/editor/forward-ref-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { editQuestion, postQuestion } from "@/lib/actions/question.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  title: z.string().trim().min(1, { error: "Please enter a title" }),
  question: z
    .string()
    .trim()
    .min(20, { error: "Question details must be at least 20 characters long" }),
  tags: z
    .array(z.string().min(1, { error: "Tags must at least 1 character long" }))
    .min(1, { error: "Please enter at least 1 tag" })
    .max(3, { error: "You cannot add more than 3 tags" }),
});

type FormType = z.infer<typeof formSchema>;

export const AskEditQuestionForm = ({
  formData,
  questionId,
}: {
  formData?: FormType;
  questionId?: string;
}) => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formData?.title ?? "",
      question: formData?.question ?? "",
      tags: formData?.tags ?? [],
    },
  });
  const [tagInputValue, setTagInputValue] = useState("");
  const router = useRouter();

  const handleAskEditQuestion = async (data: FormType) => {
    const response = await (questionId
      ? editQuestion({ questionId, ...data })
      : postQuestion(data));
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleAskEditQuestion)}
        className="space-y-8"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Question title goes here..." />
              </FormControl>
              <FormDescription>
                Be specific and imagine you are asking a question to another
                person
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="question"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed explanation of your problem?</FormLabel>
              <FormControl>
                <ForwardRefEditor
                  markdown={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormDescription>
                Introduce the problem and expand on what you put in the title.
                Minimum of 20 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="tags"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={tagInputValue}
                  onChange={(e) => setTagInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      tagInputValue.trim() &&
                      field.value.length !== 3
                    ) {
                      field.onChange([
                        ...field.value,
                        tagInputValue.trim().toUpperCase(),
                      ]);
                      setTagInputValue("");
                    }
                  }}
                  placeholder="Tag goes here"
                />
              </FormControl>
              <div className="gap-2 flex items-center flex-wrap mt-2">
                {field.value.map((tag, index) => (
                  <Badge
                    onClick={() =>
                      field.onChange(field.value.filter((_, i) => i !== index))
                    }
                    key={tag + index}
                    className="rounded text-sm flex items-center"
                  >
                    {tag}
                    <Button variant="ghost" size="icon-sm">
                      <XIcon />
                    </Button>
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Add up to 3 tags to describe what your question is about. Press
                enter to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end w-full">
          <Button
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              {questionId ? "Save changes" : "Ask a question"}
            </LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
};
