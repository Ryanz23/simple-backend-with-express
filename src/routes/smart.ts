import { Router, Request, Response } from 'express';
import { calculateSmart } from '../controllers/smart.controller';
import { getDb } from '../config/database';
import { ApiResponse, Criterion, AlternativeRow, ScoreRow } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
router.get('/', calculateSmart);

// GET routes for fetching criteria
router.get(
  '/criteria',
  async (req: Request, res: Response<ApiResponse<Criterion[]>>) => {
    try {
      const db = await getDb();
      const [rows] = await db.execute('SELECT * FROM criteria');
      const criteria = rows as Criterion[];
      res.json({
        success: true,
        data: criteria,
        count: criteria.length,
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch criteria.',
      });
    }
  },
);

// GET routes for fetching alternatives
router.get(
  '/alternatives',
  async (req: Request, res: Response<ApiResponse<AlternativeRow[]>>) => {
    try {
      const db = await getDb();
      const [rows] = await db.execute('SELECT * FROM alternatives');
      const alternatives = rows as AlternativeRow[];
      res.json({
        success: true,
        data: alternatives,
        count: alternatives.length,
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch alternatives.',
      });
    }
  },
);

// GET routes for fetching scores
router.get(
  '/scores',
  async (req: Request, res: Response<ApiResponse<ScoreRow[]>>) => {
    try {
      const db = await getDb();
      const [rows] = await db.execute(`
            SELECT 
                s.alternative_id,
                a.name AS alternative_name,
                c.name AS criterion_name,
                s.score
            FROM scores s
            JOIN alternatives a ON s.alternative_id = a.id
            JOIN criteria c ON s.criterion_id = c.id
        `);
      const scores = rows as ScoreRow[];
      res.json({
        success: true,
        data: scores,
        count: scores.length,
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch scores.',
      });
    }
  },
);

// POST routes for adding criteria
router.post('/criteria', async (req: Request, res: Response<ApiResponse>) => {
  const { name, weight } = req.body;

  if (!name || typeof weight !== 'number') {
    return res.status(400).json({
      success: false,
      error: 'Name and weight are required.',
    });
  }

  const id = uuidv4(); // Generate a unique ID for the criterion

  try {
    const db = await getDb();
    await db.execute(
      'INSERT INTO criteria (id, name, weight) VALUES (?, ?, ?)',
      [id, name, weight],
    );
    res.status(201).json({
      success: true,
      message: 'Criterion added successfully.',
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to add criterion.',
    });
  }
});

// POST routes for adding alternatives
router.post(
  '/alternatives',
  async (req: Request, res: Response<ApiResponse>) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required.',
      });
    }

    const id = uuidv4(); // Generate a unique ID for the alternative

    try {
      const db = await getDb();
      await db.execute('INSERT INTO alternatives (id, name) VALUES (?, ?)', [
        id,
        name,
      ]);
      res.status(201).json({
        success: true,
        message: 'Alternative added successfully.',
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Failed to add alternative.',
      });
    }
  },
);

// POST routes for adding scores
router.post('/scores', async (req: Request, res: Response<ApiResponse>) => {
  const { alternative_id, criterion_id, score } = req.body;

  if (
    typeof alternative_id !== 'string' ||
    typeof criterion_id !== 'string' ||
    typeof score !== 'number'
  ) {
    return res.status(400).json({
      success: false,
      error:
        'Alternative ID, Criterion ID must be string (UUID), and score must be number.',
    });
  }

  const id = uuidv4(); // Generate a unique ID for the score

  try {
    const db = await getDb();
    await db.execute(
      'INSERT INTO scores (id, alternative_id, criterion_id, score) VALUES (?, ?, ?, ?)',
      [id, alternative_id, criterion_id, score],
    );
    res.status(201).json({
      success: true,
      message: 'Score added successfully.',
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to add score.',
    });
  }
});
export default router;
