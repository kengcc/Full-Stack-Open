import {useState, useEffect} from "react"
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"
import personService from "./services/persons"
import Notification from "./components/Notification"
import Footer from "./components/Footer"

const App = () => {
  // const [persons, setPersons] = useState([{name: "Arto Hellas"}])
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("New person")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [notification, setNotification] = useState({message: null, type: null})

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, []) // run once on first render

  const addPerson = (event) => {
    event.preventDefault()

    const nameExists = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (nameExists) {
      const ok = window.confirm(
        `${nameExists.name} is already added to phonebook. Replace the old number with the new one?`
      )
      if (!ok) return

      const updatedPerson = {...nameExists, number: newNumber}

      personService
        .update(nameExists.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((p) => (p.id === nameExists.id ? returnedPerson : p))
          )
          setNewName("")
          setNewNumber("")
        })
        .catch(() => {
          setNotification({
            message: `Information of '${nameExists.name}' was already removed from server`,
            type: "error",
          })
          setTimeout(() => {
            setNotification({message: null, type: null})
          }, 5000)
          setPersons(persons.filter((p) => p.id !== nameExists.id))
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
      important: Math.random() < 0.5,
      id: String(persons.length + 1),
    }

    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName("")
        setNewNumber("")
        setNotification({
          message: `Added ${returnedPerson.name}`,
          type: "message",
        })
        setTimeout(() => {
          setNotification({message: null, type: null})
        }, 5000)
      })
      .catch((error) => {
        const message =
          error.response?.data?.error || "Failed to add person to phonebook"
        setNotification({message, type: "error"})
        setTimeout(() => {
          setNotification({message: null, type: null})
        }, 5000)
      })
  }

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id)
    if (!person) return

    const ok = window.confirm(`Delete ${person.name}?`)
    if (!ok) return

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== id))
      })
      .catch(() => {
        setNotification({
          message: `Information of '${person.name}' was already removed from server`,
          type: "error",
        })
        setTimeout(() => {
          setNotification({message: null, type: null})
        }, 5000)
        // if already deleted from server, still remove from UI
        setPersons(persons.filter((p) => p.id !== id))
      })
  }

  const handlePersonChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification.message} type={notification.type} />
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
      <Persons persons={personsToShow} onDelete={deletePerson} />
      <Footer />
    </div>
  )
}

export default App
