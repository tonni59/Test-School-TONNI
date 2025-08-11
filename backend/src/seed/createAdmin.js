// backend/seed/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User').default || require('../models/User');

async function create() {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: 'admin@example.com' });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Admin@123', salt);
  const user = new User({ name: 'Admin', email: 'admin@example.com', password: hash, role: 'admin', verified: true });
  await user.save();
  console.log('Admin created: admin@example.com / Admin@123');
  process.exit(0);
}
create().catch(e=>{console.error(e); process.exit(1)});
