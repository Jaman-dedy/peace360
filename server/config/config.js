import dotenv from 'dotenv';

dotenv.config();

const email = {
  user: process.env.SENDER_EMAIL,
  pass: process.env.SENDER_PASS
};

export { email };
