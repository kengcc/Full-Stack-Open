import {useState} from "react"
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"

const App = (props) => {
  // const [persons, setPersons] = useState([{name: "Arto Hellas"}])
  const [persons, setPersons] = useState(props.persons)
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.some(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
      important: Math.random() < 0.5,
      id: String(persons.length + 1),
    }

    setPersons(persons.concat(personObject))
    setNewName("")
    setNewNumber("")
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>Add a new contact</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        newNumber={newNumber}
        onNameChange={handlePersonChange}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
