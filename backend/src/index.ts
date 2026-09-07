import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { marketsRouter } from "./routes/markets.routes";
import { betsRouter } from "./routes/bets.routes";
import { aiRouter } from "./routes/ai.routes";
import { swaggerDocument } from "./swagger";

const app = express();
const PORT = Number(process.env.PORT ?? 4200);

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/markets", marketsRouter);
app.use("/api/bets", betsRouter);
app.use("/api/ai", aiRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Polymarket widget API: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
