const mongoose = require("mongoose")
require("dotenv").config()
if (process.argv.length !== 3 && process.argv.length !== 5) {
    console.log("Usage: node mongo.js  <passworld> [<name> <number>](optional)")
    process.exit(1)
}

mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGODB_URI)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
    Person.find({})
        .then(people => {
            console.log("Phonebook:")
            people.forEach(p =>
                console.log(`${p.name} ${p.number}`))
            mongoose.connection.close()
        })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name,
        number
    })
    person.save()
        .then(res => {
            console.log(`Added ${res.name} number ${res.number} to phonebook`)
            mongoose.connection.close()
        })
}