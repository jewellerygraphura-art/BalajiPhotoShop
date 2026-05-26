import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        let db = await mongoose.connect(process.env.MongoDB_URl);
        console.log("MongoDB Connected  Successfully");
        return db;
    }
    catch (err) {
        console.log(`Database Connection Faild: ${err.message}`);
    }
};

export default dbConnection;