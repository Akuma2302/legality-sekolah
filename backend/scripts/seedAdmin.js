/**
 * Creates (or updates the password for) the admin account.
 *
 * Usage:
 *   npm run seed-admin
 *     -> creates username "adminlegality" / password "leg@lity!admin"
 *   npm run seed-admin -- someUsername someP@ssword
 *     -> creates/updates that specific account instead
 *
 * Safe to re-run — it upserts, so running it again just resets the password
 * if the account already exists.
 */
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { usersRepository } from '../src/repositories/users.repository.js';

const DEFAULT_USERNAME = 'adminlegality';
const DEFAULT_PASSWORD = 'leg@lity!admin';

async function main() {
  const username = process.argv[2] || DEFAULT_USERNAME;
  const password = process.argv[3] || DEFAULT_PASSWORD;

  await connectDB();

  const password_hash = await bcrypt.hash(password, 10);
  const user = await usersRepository.upsertAdmin({ username, password_hash, full_name: 'Admin' });

  console.log(`Admin account ready: username="${user.username}"`);
  await mongoose.disconnect();
}

main();
