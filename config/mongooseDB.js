import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    console.log("connecting to database...");
    const res = await mongoose.connect(
      `${process.env.mongoURL}/${process.env.DB_NAME}`,
      {
        dbName: process.env.DB_NAME,
      }
    );
    console.log(`mongodb connected with server ${res.connection.host}`);
  } catch (err) {
    console.log(`mongodb connection failed: ${err.message}`);
    process.exit(1);
  }
};
