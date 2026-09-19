import dns from "node:dns";
import mongoose from "mongoose";

// Node was using the local DNS server (127.0.0.1),
// which could not resolve MongoDB Atlas SRV records.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from the .env file");
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI);

  console.log(`MongoDB connected: ${connection.connection.name}`);
};

export default connectDatabase;