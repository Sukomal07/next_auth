import mongoose from "mongoose";

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "next-auth",
    });
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Mongodb Connection successfully");
    });
    connection.on("error", (err) => {
      console.log("Mongodb connection error", err);
      process.exit(1);
    });
  } catch (error: any) {
    console.log("Something went wrong  in connecting  to DB");
    console.log(error.message);
  }
}
