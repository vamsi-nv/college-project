import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("DataBase Connected");
  } catch (error) {
    console.error("Error connecting db : ", error.message);
  }
};

export default connectDB;
