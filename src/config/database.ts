import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "simple_db",
};

let connection: mysql.Connection;

export async function getDb() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig);
  }
  return connection;
}

export default async function initDatabase(): Promise<void> {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Database connection established successfully.");

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    await connection.execute(createTableQuery);
    console.log("Users table is ready.");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}
