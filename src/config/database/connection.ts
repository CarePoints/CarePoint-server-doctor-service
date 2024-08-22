import mongoose from "mongoose";
// mongodb+srv://doctor-service:doctor-service@cluster0.4exzr7l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb+srv://user-service:user-service@cluster0.loo8dpj.mongodb.net/", {
      dbName: "doctor-service",
    });
    console.log("databse connected sucessfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDatabase;