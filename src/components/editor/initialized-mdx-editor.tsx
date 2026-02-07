"use client";

import type { ForwardedRef } from "react";
import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CodeToggle,
  InsertCodeBlock,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  tablePlugin,
  ListsToggle,
  codeBlockPlugin,
  codeMirrorPlugin,
  InsertTable,
} from "@mdxeditor/editor";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function InitializedMDXEditor({
  editorRef,
  className,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  className?: string;
} & MDXEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const markdownClassNames =
    "max-w-none prose prose-neutral dark:prose-invert font-sans";

  return (
    <MDXEditor
      className={cn(markdownClassNames, isDark && "dark-theme", className)}
      suppressHtmlProcessing
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        tablePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: "JavaScript",
            ts: "TypeScript",
            tsx: "TSX",
            jsx: "JSX",
            css: "CSS",
            html: "HTML",
            json: "JSON",
            md: "Markdown",
            txt: "Text",
            py: "Python",
          },
        }),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <ListsToggle />
              <InsertCodeBlock />
              <InsertTable />
              <CodeToggle />
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
