const express = require("express")
const morgan = require("morgan")
const app = express()
const PORT = 3001

app.use(express.json())
app.use(morgan("tiny"))
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
    response.json(persons)
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
    console.log(request)
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number is missing"
        })
    } else if (persons.some(p => p.name === body.name)) {
        return response.status(404).json({
            error: "name must be unique"
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id:  newID()
    }

    persons = persons.concat(person)
    response.json(person)
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
