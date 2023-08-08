const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
require("dotenv").config()
const app = express()
const PORT = process.env.PORT

app.use(express.static("build"))
app.use(cors())
app.use(express.json())
morgan.token("body", (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

const Person = require("./models/person")



app.get("/", (request, response, err) => {
    response.send("<h1>Hello world!</h1>")
})

app.get("/api/persons", (request, response, next) => {
    Person.find({})
        .then(persons => response.json(persons))
        .catch(err => next(err))
    //response.json(persons)
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => response.json(person))
        .catch(error => next(error))
})

app.get("/info", (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            const timeStamp = new Date()
            const timeAndDate = `${timeStamp.toDateString()} ${timeStamp.toTimeString()}`
            response.send(`Phonebook  has info for ${count} people <br/> ${timeAndDate}`)

        })
    .catch(error => next(error))


})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deleted => {
            if (deleted) {
                response.status(204).end()
            } else {
                response.status(404).send({ error: "No person found with that id" })
            }
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id
        , person
        , {
            new: true,
            runValidators: true,
            context: "query"
        })
        .then(updated => response.json(updated))
        .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.log(error)
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformed id" })
    } else if (error.name === "ValidationError") {
        return response.status(400).send({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
