import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Kết nối đến CSDL thành công.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
