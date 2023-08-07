const mongoose = require("mongoose")

mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGODB_URI)
    .then(res => console.log("Connected to database"))
    .catch(err => console.log("Error connecting to database:", err.message))

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports= mongoose.model("Person", personSchema)