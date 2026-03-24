import { envServer } from "@/data/env/server";
import { createCohere } from "@ai-sdk/cohere";

export const cohere = createCohere({
  apiKey: envServer.COHERE_API_KEY,
});
