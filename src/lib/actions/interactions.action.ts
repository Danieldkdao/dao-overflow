"use server";

import { db } from "@/db/db";
import { InteractionTable, InteractionAction } from "@/db/schema";
import { checkUserAuthed } from "./user.action";

type CreateInteractionProps = {
  action: InteractionAction;
  tags: string[];
  questionId?: string;
};

export const createInteraction = async (props: CreateInteractionProps) => {
  const session = await checkUserAuthed();
  if (!session) return;

  await db.insert(InteractionTable).values({
    userId: session.user.id,
    ...props,
  });
};
