import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose?: { conn: typeof mongoose };
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: mongoose };
  mongoose.connect(process.env.MONGODB_URI);
}

export default mongoose;
