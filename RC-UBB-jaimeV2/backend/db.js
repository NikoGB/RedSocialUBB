const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB")
}).catch((error) => {
    console.log("Error al conectarse a MongoDB:", error.message)
})