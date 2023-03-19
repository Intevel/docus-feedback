import { createError, defineEventHandler, readBody } from 'h3'
import Database from 'better-sqlite3';
import { FeedbackBody } from '~~/../src/module';

const db = new Database('feedbacks.db');
db.exec('CREATE TABLE IF NOT EXISTS feedbacks (id INTEGER PRIMARY KEY AUTOINCREMENT, feedback TEXT, timestamp INTEGER, user_id TEXT DEFAULT NULL, route TEXT)');

export default defineEventHandler(async (event) => {
  const body = await readBody<FeedbackBody>(event);

  if (!body.feedback || !body.route) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields',
    })
  }

  try {
    db.exec(`INSERT INTO feedbacks (feedback, timestamp, user_id, route)
    VALUES ('${body.feedback}', '${new Date().getTime()}', '${body.user_id}', '${body.route}');`)
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }

  return {
    statusCode: 200,
    body: 'OK',
  }
})
