require("dotenv").config()

const Person = require("./models/person")
const mongoose = require("mongoose")

const express = require("express")
const morgan = require("morgan")
const app = express()
app.use(express.static("dist")) // show frontend build files

app.use(express.json())

morgan.token("body", (req) => {
  if (req.method !== "POST") {
    return ""
  }

  return JSON.stringify(req.body)
})

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

let persons = []

app.get("/", (request, response) => {
  response.send("<h1>Welcome to phonebook backend!!!</h1>")
})

app.get("/info", async (request, response) => {
  try {
    const count = await Person.countDocuments({})
    const info = `Phonebook has info for ${count} people`
    const timestamp = new Date()
    response.send(`<p>${info}</p><p>${timestamp}</p>`)
  } catch (error) {
    console.error("failed to fetch person count:", error.message)
    response.status(500).send("unable to retrieve phonebook info")
  }
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person)
  })
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  console.log(body)

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    })
  }

  const duplicate = persons.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  )

  if (duplicate) {
    return response.status(400).json({
      error: "name must be unique",
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
