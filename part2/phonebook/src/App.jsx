import {useState} from "react"
import Person from "./components/Person"

const App = (props) => {
  // const [persons, setPersons] = useState([{name: "Arto Hellas"}])
  const [persons, setPersons] = useState(props.persons)
  const [newName, setNewName] = useState("")
  const [showAll, setShowAll] = useState(true)

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.some((person) => person.name === newName)

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      important: Math.random() < 0.5,
      id: String(persons.length + 1),
    }

    setPersons(persons.concat(personObject))
    setNewName("")
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const personsToShow = showAll
    ? persons
    : persons.filter((person) => person.important === true)

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handlePersonChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((person) => (
          <Person key={person.id} person={person} />
        ))}
      </ul>
    </div>
  )
}

export default App
