import { ai } from '@/ai/genkit';
import { services, caregivers } from '@/lib/data';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  message: z.string().min(1),
  history: z.array(ChatMessageSchema).optional(),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  reply: z.string(),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;

function buildKnowledgeBase(): string {
  const servicesText = services
    .map((service) => `- ${service.name} (${service.price}): ${service.longDescription}`)
    .join('\n');

  const caregiversText = caregivers
    .map(
      (caregiver) =>
        `- ${caregiver.name}, ${caregiver.role}, ${caregiver.experience} of experience, rating ${caregiver.rating}/5. Services: ${caregiver.serviceIds
          .map((id) => services.find((s) => s.id === id)?.name ?? id)
          .join(', ')}.`
    )
    .join('\n');

  return `SERVICES OFFERED:\n${servicesText}\n\nCAREGIVERS:\n${caregiversText}`;
}

const SYSTEM_PROMPT = `You are the CareMatrix Assistant, a friendly and helpful chatbot for CareMatrix, a home-care service company.

Your job is to answer visitors' questions about CareMatrix using only the information below.

${buildKnowledgeBase()}

GUIDELINES:
- Be warm, concise, and easy to understand. Keep answers to a few sentences unless more detail is clearly needed.
- Only answer questions related to CareMatrix: its services, pricing, caregivers, how to book, and how to apply for a job.
- To book a service, tell the user to visit the Services page and choose a service to book.
- To apply for a caregiver job, tell the user to visit the Careers page and fill out the application form.
- If you do not know the answer, say so honestly and suggest the user explore the Services or Careers pages, or contact the CareMatrix team. Never make up facts, prices, names, or contact details.
- Do not give medical or clinical advice. For medical concerns, suggest consulting a qualified professional or booking Skilled Nursing.`;

export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input): Promise<ChatOutput> => {
    const messages = [
      ...(input.history ?? []).map((message) => ({
        role: message.role,
        content: [{ text: message.content }],
      })),
      { role: 'user' as const, content: [{ text: input.message }] },
    ];

    const { text } = await ai.generate({
      system: SYSTEM_PROMPT,
      messages,
      config: { temperature: 0.4 },
    });

    return { reply: text };
  }
);
