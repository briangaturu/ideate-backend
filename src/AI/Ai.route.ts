import { Router } from "express";
import { generateScenario } from "./Ai.controller";

const router: Router = Router();

router.post("/generate", generateScenario);

export default router;