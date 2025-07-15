import { Router, Request, Response } from "express";
import { getDb } from "../config/database";
import { User, ApiResponse, UserParams } from "../types";

const router = Router();

// Utility untuk safe casting error
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// GET /users
router.get("/", async (req: Request, res: Response<ApiResponse<User[]>>) => {
  const db = await getDb();
  const [rows] = await db.execute("SELECT * FROM users ORDER BY created_at DESC");
  res.json({
    success: true,
    data: rows as User[],
    count: (rows as User[]).length,
  });
});

// GET /users/:id
router.get(
  "/:id",
  async (req: Request<UserParams>, res: Response<ApiResponse<User>>) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId))
      return res.status(400).json({ success: false, error: "Invalid user ID format." });

    const db = await getDb();
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [userId]);
    const user = (rows as User[])[0];
    if (!user)
      return res.status(404).json({ success: false, error: "User not found." });

    res.json({ success: true, data: user });
  }
);

// POST /users
router.post("/", async (req: Request, res: Response<ApiResponse<User>>) => {
  const { name, email }: User = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: "Name and email are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: "Invalid email format." });
  }

  try {
    const db = await getDb();
    const [result] = await db.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    const insertId = (result as { insertId: number }).insertId;
    res.status(201).json({
      success: true,
      data: { id: insertId, name, email },
      message: "User created successfully.",
    });
  } catch (error: unknown) {
    if (isError(error)) {
      if (error.message.includes("ER_DUP_ENTRY")) {
        return res.status(409).json({ success: false, error: "Email already exists." });
      }
      console.error("Database error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    res.status(500).json({ success: false, error: "Internal server error." });
  }
});

// PUT /users/:id
router.put("/:id", async (req: Request<UserParams>, res: Response<ApiResponse>) => {
  const userId = parseInt(req.params.id);
  const { name, email }: User = req.body;
  if (isNaN(userId))
    return res.status(400).json({ success: false, error: "Invalid user ID" });
  if (!name || !email)
    return res.status(400).json({ success: false, error: "Name and email are required" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ success: false, error: "Invalid email format" });

  try {
    const db = await getDb();
    const [result] = await db.execute(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, userId]
    );
    const affected = (result as { affectedRows: number }).affectedRows;
    if (!affected)
      return res.status(404).json({ success: false, error: "User not found" });

    res.json({ success: true, message: "User updated successfully" });
  } catch (error: unknown) {
    if (isError(error)) {
      if (error.message.includes("ER_DUP_ENTRY")) {
        return res.status(409).json({ success: false, error: "Email already exists" });
      }
      console.error(error.message);
    } else {
      console.error(error);
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// DELETE /users/:id
router.delete("/:id", async (req: Request<UserParams>, res: Response<ApiResponse>) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId))
    return res.status(400).json({ success: false, error: "Invalid user ID" });

  try {
    const db = await getDb();
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [userId]);
    const affected = (result as { affectedRows: number }).affectedRows;
    if (!affected)
      return res.status(404).json({ success: false, error: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error: unknown) {
    if (isError(error)) {
      console.error("Database error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
