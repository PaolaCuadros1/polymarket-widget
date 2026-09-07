export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Polymarket Widget API",
    version: "1.0.0",
    description: "Backend API for browsing Polymarket markets",
  },
  servers: [{ url: "/api" }],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { ok: { type: "boolean" } },
                },
              },
            },
          },
        },
      },
    },
    "/markets": {
      get: {
        summary: "List or search markets",
        parameters: [
          {
            name: "q",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Free-text search query. Omit to list top markets by volume.",
          },
        ],
        responses: {
          "200": {
            description: "Markets found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    markets: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Market" },
                    },
                  },
                },
              },
            },
          },
          "502": { description: "Upstream Polymarket API error" },
        },
      },
    },
    "/markets/{slug}": {
      get: {
        summary: "Get a single market by slug",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Market found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { market: { $ref: "#/components/schemas/Market" } },
                },
              },
            },
          },
          "404": { description: "Market not found" },
          "502": { description: "Upstream Polymarket API error" },
        },
      },
    },
    "/ai/recommend": {
      post: {
        summary: "Get an AI-assisted outcome recommendation for a market",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["marketSlug"],
                properties: { marketSlug: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Recommendation",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    recommendation: {
                      type: "object",
                      properties: {
                        tokenId: { type: "string" },
                        outcomeName: { type: "string" },
                        side: { type: "string", enum: ["BUY", "SELL"] },
                        confidence: { type: "number" },
                        reasoning: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": { description: "Invalid input" },
          "404": { description: "Market not found" },
          "502": { description: "Upstream error (Gamma API or Claude)" },
        },
      },
    },
    "/bets": {
      get: {
        summary: "List placed bets",
        responses: {
          "200": {
            description: "Bets found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    bets: { type: "array", items: { $ref: "#/components/schemas/Bet" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Place a simulated bet",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["marketSlug", "tokenId", "side", "size"],
                properties: {
                  marketSlug: { type: "string" },
                  tokenId: { type: "string" },
                  side: { type: "string", enum: ["BUY", "SELL"] },
                  size: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Bet placed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { bet: { $ref: "#/components/schemas/Bet" } },
                },
              },
            },
          },
          "400": { description: "Invalid input" },
          "404": { description: "Market not found" },
          "502": { description: "Upstream Polymarket API error" },
        },
      },
    },
  },
  components: {
    schemas: {
      Bet: {
        type: "object",
        properties: {
          id: { type: "string" },
          marketId: { type: "string" },
          marketSlug: { type: "string" },
          question: { type: "string" },
          outcomeName: { type: "string" },
          tokenId: { type: "string" },
          side: { type: "string", enum: ["BUY", "SELL"] },
          price: { type: "number" },
          size: { type: "number" },
          cost: { type: "number" },
          status: { type: "string" },
          createdAt: { type: "string" },
        },
      },
      MarketOutcome: {
        type: "object",
        properties: {
          name: { type: "string" },
          price: { type: "number" },
          tokenId: { type: "string" },
        },
      },
      Market: {
        type: "object",
        properties: {
          id: { type: "string" },
          conditionId: { type: "string" },
          slug: { type: "string" },
          question: { type: "string" },
          description: { type: "string" },
          image: { type: "string", nullable: true },
          active: { type: "boolean" },
          closed: { type: "boolean" },
          liquidity: { type: "number" },
          volume: { type: "number" },
          minTickSize: { type: "number" },
          minOrderSize: { type: "number" },
          outcomes: {
            type: "array",
            items: { $ref: "#/components/schemas/MarketOutcome" },
          },
        },
      },
    },
  },
};
