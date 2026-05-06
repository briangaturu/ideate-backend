import { Request, Response, NextFunction } from "express";
import { getAiScenario } from "./Ai.service";

export const generateScenario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({
        success: false,
        message: "Idea is required",
      });
    }

    const result = await getAiScenario(idea);

    return res.status(200).json({
      success: true,
      data: result, // ✅ ALWAYS clean array now
    });
  } catch (error: any) {
    console.error("Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};