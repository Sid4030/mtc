import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log("Attempting to connect to:", uri);

mongoose.connect(uri)
  .then(() => {
    console.log("Successfully connected!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });
