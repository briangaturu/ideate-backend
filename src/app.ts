
import express from "express";
import cors from "cors";
import scenarioRoutes from "./AI/Ai.route";

const app: express.Application = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/scenarios", scenarioRoutes);

export default app;