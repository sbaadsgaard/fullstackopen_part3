const mongoose = require("mongoose")

mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGODB_URI)
    .then(res => console.log("Connected to database"))
    .catch(err => console.log("Error connecting to database:", err.message))

const numberValidator = (number) => {
    const regex = /\d{2,3}-\d+/gm
    return number.length === 9 && regex.test(number)
}


const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: numberValidator,
            message: props => `${props.value} is not a valid phone number`
        }
    }
})

personSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model("Person", personSchema)