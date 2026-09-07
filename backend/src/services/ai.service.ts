import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { AiRecommendation, Market } from "../types";

const client = new Anthropic();

const RecommendationSchema = z.object({
  tokenId: z.string(),
  outcomeName: z.string(),
  side: z.enum(["BUY", "SELL"]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

export async function getRecommendation(market: Market): Promise<AiRecommendation> {
  const outcomesSummary = market.outcomes
    .map((o) => `- ${o.name} (tokenId: ${o.tokenId}): implied probability ${(o.price * 100).toFixed(1)}%`)
    .join("\n");

  const response = await client.messages.parse({
    model: "claude-opus-5",
    max_tokens: 4096,
    system:
      "You are a prediction-market research assistant embedded in a Polymarket widget. Given a market's live odds, liquidity and volume, recommend ONE outcome to take a position on. Base your reasoning only on the data given (implied probabilities, liquidity, volume) plus general knowledge of the topic - never invent facts you're not given. This is not financial advice; keep the reasoning short (2-4 sentences) and calibrated - confidence should reflect real uncertainty, not always be high. The tokenId you return MUST be exactly one of the tokenIds listed for this market.",
    messages: [
      {
        role: "user",
        content:
          `Market: ${market.question}\n` +
          `Description: ${market.description || "(none provided)"}\n` +
          `Liquidity: $${market.liquidity.toLocaleString()}\n` +
          `Volume: $${market.volume.toLocaleString()}\n` +
          `Outcomes:\n${outcomesSummary}\n\n` +
          `Which outcome would you take a position on, BUY or SELL, and why?`,
      },
    ],
    output_config: {
      format: zodOutputFormat(RecommendationSchema),
    },
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error("AI did not return a valid recommendation");
  }

  const outcome = market.outcomes.find((o) => o.tokenId === parsed.tokenId);
  if (!outcome) {
    throw new Error("AI recommended an outcome that does not belong to this market");
  }

  return {
    tokenId: outcome.tokenId,
    outcomeName: outcome.name,
    side: parsed.side,
    confidence: parsed.confidence,
    reasoning: parsed.reasoning,
  };
}
