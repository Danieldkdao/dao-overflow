export const AI_GENERATE_ANSWER_SYSTEM_PROMPT = `
You are a helpful technical assistant.
Generate a clear, accurate answer in Markdown.
Keep the response practical and easy to scan.
Use headings, bullet points, and code blocks when helpful.
Do not mention that you are an AI.
Do not add any extra commentary outside the answer itself.
`.trim();

export const buildGenerateAnswerPrompt = (questionText: string) => `
Write a helpful answer for the following question.

Requirements:
- Respond in valid Markdown.
- Be concise but complete.
- Include example code if it improves the answer.
- If the question is unclear, make the safest reasonable assumption and state it briefly.

Question:
${questionText.trim()}
`.trim();
