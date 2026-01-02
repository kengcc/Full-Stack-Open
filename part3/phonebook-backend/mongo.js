const mongoose = require("mongoose")

const argumentCount = process.argv.length

if (argumentCount < 3) {
  console.log("give password as argument")
  process.exit(1)
}

if (argumentCount === 4) {
  console.log("please provide name and phone arguments")
  process.exit(1)
}

if (argumentCount > 5) {
  console.log("too many arguments provided")
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://kengcc_db_user:${password}@cluster0.bqvvjb5.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

const listPersons = async () => {
  const persons = await Person.find({})
  console.log("phonebook:")
  persons.forEach((person) => {
    console.log(`${person.name} ${person.number}`)
  })
}

const addPerson = async () => {
  const person = new Person({
    name,
    number,
  })

  await person.save()
  console.log(`added ${person.name} number ${person.number} to phonebook`)
}

const run = async () => {
  try {
    await mongoose.connect(url, {family: 4})

    if (argumentCount === 3) {
      await listPersons()
    } else if (argumentCount === 5) {
      await addPerson()
    }
  } catch (error) {
    console.error("error connecting to MongoDB:", error.message)
  } finally {
    mongoose.connection.close()
  }
}

run()
