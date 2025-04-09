const mongoose = require('mongoose');

const connectToDB = async () => {
    console.log(process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI)

        console.log("Database connected successfully!");

    } catch (error) {
        console.log("Connection Failed: ", error.message);
    }
}

module.exports = connectToDB