/**
 * Promotes an existing account to admin.
 * Usage: npm run create-admin -- someone@example.com
 */
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/user.model.js';
import mongoose from 'mongoose';

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: npm run create-admin -- someone@example.com');
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { role: 'admin' },
    { new: true }
  );

  if (!user) {
    console.error(`No account found for ${email}. Ask them to sign up first.`);
  } else {
    console.log(`${user.email} is now an admin.`);
  }

  await mongoose.disconnect();
}

main();
