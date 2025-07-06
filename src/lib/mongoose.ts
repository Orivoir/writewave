import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
   
  var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ??= { conn: null, promise: null };

async function dbConnect(): Promise<typeof mongoose> {

  const MONGODB_URI = process.env.MONGODB_URI;

  if (typeof MONGODB_URI !== "string") {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', false); // option utile avec Mongoose 7+
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
