import { Router, Request, Response } from 'express';
import { calculateSmart } from '../controllers/smart.controller';
import { getDb } from '../config/database';
import { ApiResponse, Criterion, AlternativeRow, ScoreRow } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { sendSuccess, sendError } from '../utils/responseHelper';

const router = Router();
router.get('/', calculateSmart);

// GET routes for fetching criteria
router.get(
  '/criteria',
  async (req: Request, res: Response<ApiResponse<Criterion[]>>) => {
    try {
      const db = await getDb();
      const [rows] = await db.execute('SELECT * FROM criteria');

      return sendSuccess(res, rows as Criterion[], 'Criteria fetched successfully', (rows as Criterion[]).length);

    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'Failed to fetch criteria.');
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

      return sendSuccess(res, rows as AlternativeRow[], 'Alternatives fetched successfully', (rows as AlternativeRow[]).length);

    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'Failed to fetch alternatives.');
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

      return sendSuccess(res, rows as ScoreRow[], 'Scores fetched successfully', (rows as ScoreRow[]).length);

    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'Failed to fetch scores.');
    }
  },
);

// POST routes for adding criteria
router.post('/criteria', async (req: Request, res: Response<ApiResponse>) => {
  const { name, weight } = req.body;

  if (!name || typeof weight !== 'number') {
    return sendError(res, 400, 'Name and weight are required.');
  }

  const id = uuidv4(); // Generate a unique ID for the criterion

  try {
    const db = await getDb();
    await db.execute(
      'INSERT INTO criteria (id, name, weight) VALUES (?, ?, ?)',
      [id, name, weight],
    );

    return sendSuccess(res, undefined, 'Criterion added successfully.');

  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'Failed to add criterion.');
  }
});

// POST routes for adding alternatives
router.post(
  '/alternatives',
  async (req: Request, res: Response<ApiResponse>) => {
    const { name } = req.body;

    if (!name) {
      return sendError(res, 400, 'Name is required.');
    }

    const id = uuidv4(); // Generate a unique ID for the alternative

    try {
      const db = await getDb();
      await db.execute('INSERT INTO alternatives (id, name) VALUES (?, ?)', [
        id,
        name,
      ]);

      return sendSuccess(res, undefined, 'Alternative added successfully.');

    } catch (err) {
      console.error(err);
      return sendError(res, 500, 'Failed to add alternative.');
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
    return sendError(res, 400, 'Alternative ID, Criterion ID, and Score are required.');
  }

  const id = uuidv4(); // Generate a unique ID for the score

  try {
    const db = await getDb();
    await db.execute(
      'INSERT INTO scores (id, alternative_id, criterion_id, score) VALUES (?, ?, ?, ?)',
      [id, alternative_id, criterion_id, score],
    );

    return sendSuccess(res, undefined, 'Score added successfully.');

  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'Failed to add score.');
  }
});

// DELETE routes for deleting criteria
router.delete(
  '/criteria/:id',
  async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    if (!id) {
        return sendError(res, 400, 'Criterion ID is required.');
    }

    try {
        const db = await getDb();
        const [result] = await db.execute('DELETE FROM criteria WHERE id = ?', [id]);

        // Check if any rows were affected
        const affectedRows = (result as { affectedRows: number }).affectedRows;
        if (affectedRows === 0) {
            return sendError(res, 404, 'Criterion not found.');
        }

        return sendSuccess(res, undefined, 'Criterion deleted successfully.');

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Failed to delete criterion.');
    }
  }
);

// DELETE routes for deleting alternatives
router.delete(
    '/alternatives/:id',
    async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;

    if (!id) {
        return sendError(res, 400, 'Alternative ID is required.');
    }

    try {
        const db = await getDb();
        const [result] = await db.execute('DELETE FROM alternatives WHERE id = ?', [id]);

        // Check if any rows were affected
        const affectedRows = (result as { affectedRows: number }).affectedRows;
        if (affectedRows === 0) {
            return sendError(res, 404, 'Alternative not found.');
        }

        return sendSuccess(res, undefined, 'Alternative deleted successfully.');

    } catch (err) {
        console.error(err);
        return sendError(res, 500, 'Failed to delete alternative.');
    }
    }
);

// DELETE routes for deleting scores
router.delete('/scores', async (req: Request, res: Response<ApiResponse>) => {
  const { alternative_id, criterion_id } = req.body;

  if (!alternative_id || !criterion_id) {
    return sendError(res, 400, 'Alternative ID and Criterion ID are required.');
  }

  try {
    const db = await getDb();
    const [result] = await db.execute(
      'DELETE FROM scores WHERE alternative_id = ? AND criterion_id = ?',
      [alternative_id, criterion_id]
    );

    const affectedRows = (result as { affectedRows: number }).affectedRows;

    if (affectedRows === 0) {
      return sendError(res, 404, 'Score not found for the given alternative and criterion.');
    }

    return sendSuccess(res, undefined, 'Score deleted successfully.');
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'Failed to delete score.');
  }
});

export default router;
