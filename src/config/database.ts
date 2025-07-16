import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'simple_db',
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
    console.log('Database connection established successfully.');

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
    await connection.execute(createTableQuery);

    const createCriteriaTable = `
      CREATE TABLE IF NOT EXISTS criteria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        weight FLOAT NOT NULL
      )`;
    await connection.execute(createCriteriaTable);

    const createAlternativesTable = `
      CREATE TABLE IF NOT EXISTS alternatives (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )`;
    await connection.execute(createAlternativesTable);

    const createScoresTable = `
      CREATE TABLE IF NOT EXISTS scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        alternative_id INT NOT NULL,
        criterion_id INT NOT NULL,
        score FLOAT NOT NULL,
        FOREIGN KEY (alternative_id) REFERENCES alternatives(id) ON DELETE CASCADE,
        FOREIGN KEY (criterion_id) REFERENCES criteria(id) ON DELETE CASCADE
      )`;
    await connection.execute(createScoresTable);

    console.log('Users table is ready.');
    console.log('SPK tables (criteria, alternatives, scores) are ready.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}
