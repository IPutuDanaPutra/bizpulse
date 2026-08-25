import { z } from "zod";

// Shared between the server (streamObject) and client (useObject) so both sides agree on the shape.
export const RecommendationSchema = z.object({
  headline: z.string().describe("A short, specific statement or question — the core of the recommendation, one sentence."),
  reasoning: z.string().describe("Why — grounded in at least one specific number from the data. One or two sentences."),
  confidenceTier: z.enum(["actionable", "indicative", "outlook"]).describe(
    "How strong the underlying signal is: actionable = strong/clear signal, indicative = moderate, outlook = weak or no notable signal."
  ),
  confidenceScore: z.number().min(0).max(100).describe("Numeric confidence, consistent with confidenceTier."),
  primaryAction: z.string().describe("ONE concrete action, imperative, short."),
  alternatives: z
    .array(
      z.object({
        label: z.string().describe("A short alternative action."),
        confidence: z.number().min(0).max(100),
      })
    )
    .max(3)
    .describe("0-3 alternative actions, each with its own (lower) confidence than the primary action."),
});
