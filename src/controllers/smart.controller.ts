import { Request, Response } from "express";
import { getDb } from "../config/database";
import { calculateSMART, Criterion, Alternative } from "../utils/smart";
import { AlternativeRow, ScoreRow } from "../types";

export const calculateSmart = async (_req: Request, res: Response) => {
  try {
    const db = await getDb();

    const [criteriaRaw] = await db.execute("SELECT name, weight FROM criteria");
    const criteria = criteriaRaw as Criterion[];

    const alternativesRaw = (
      await db.execute("SELECT * FROM alternatives")
    )[0] as AlternativeRow[];
    const [scoresRaw] = await db.execute(`
      SELECT a.id AS alternative_id, a.name AS alternative_name, c.name AS criterion_name, s.score
      FROM scores s
      JOIN alternatives a ON a.id = s.alternative_id
      JOIN criteria c ON c.id = s.criterion_id
    `);

    const scores = scoresRaw as ScoreRow[];

    const alternatives: Alternative[] = alternativesRaw.map((alt) => {
      const scoresObj: Record<string, number> = {};
      scores
        .filter((s) => s.alternative_id === alt.id)
        .forEach((s) => {
          scoresObj[s.criterion_name] = s.score;
        });

      return {
        name: alt.name,
        scores: scoresObj,
      };
    });

    const result = calculateSMART(alternatives, criteria);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[SMART ERROR]", err);
    res.status(500).json({ success: false, error: "Gagal menghitung SMART" });
  }
};
