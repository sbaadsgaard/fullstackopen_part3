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
const person = require("./models/person")

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const newID = () => Math.floor(Math.random() * 1000000) + 1

app.get("/", (request, response) => {
    response.send("<h1>Hello world!</h1>")
})

app.get("/api/persons", (request, response) => {
    Person.find({})
    .then(persons => response.json(persons))
    //response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (!person) {
        return response.status(404).json({error: `No person with id ${id} found`})
    }

    response.json(person)
})

app.get("/info", (request, response) => {
    const timeStamp = new Date()
    const timeAndDate = `${timeStamp.toDateString()} ${timeStamp.toTimeString()}`
    response.send(`Phonebook  has info for ${persons.length} people <br/> ${timeAndDate}`)
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    if (!persons.some(p => p.id === id)) {
        return response.status(404).end()
    }
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        })
    } else if (persons.some(p => p.name === body.name)) {
        //Handle later
        //return response.status(404).json({
        //    error: "name must be unique"
        //})
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
    .then(savedPerson => response.json(savedPerson))
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
