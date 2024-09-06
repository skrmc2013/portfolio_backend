import mongoose from "mongoose";
const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "Data",
    })
        .then(() => {
            console.log("Connected to DataBase");
        })
        .catch((error) => {
            console.log(`"Connection established error", ${error}`);
        })
};
export default dbConnection;