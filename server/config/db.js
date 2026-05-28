import mongoose from "mongoose";

const connectDB = async () => {

  try {

    // ==================================
    // MONGODB CONNECTION
    // ==================================
    const connection =
    await mongoose.connect(

      process.env.MONGO_URI,

      {
        serverSelectionTimeoutMS: 5000,
      }
    );

    console.log(

      `MongoDB Connected: ${connection.connection.host}`
    );

    // ==================================
    // CONNECTION EVENTS
    // ==================================
    mongoose.connection.on(
      "disconnected",
      () => {

        console.log(
          "MongoDB Disconnected"
        );
      }
    );

    mongoose.connection.on(
      "reconnected",
      () => {

        console.log(
          "MongoDB Reconnected"
        );
      }
    );

  } catch (error) {

    console.log(

      `MongoDB Error: ${error.message}`
    );

    process.exit(1);
  }
};

export default connectDB;