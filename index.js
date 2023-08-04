const express = require("express")
const app = express()
const PORT = 3001
app.use(express.json())

const persons = [
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
