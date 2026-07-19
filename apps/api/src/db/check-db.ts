import 'dotenv/config';
import { db, pool } from './client.js';
import { users } from './schema/users.js';

async function check() {
  try {
    const list = await db.select().from(users);
    console.log('--- USERS IN DATABASE ---');
    console.log(JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    await pool.end();
  }
}

check();
