import Person from "./Person"

const Persons = ({persons, onDelete}) => (
  <ul>
    {persons.map((person) => (
      <Person key={person.id} person={person} onDelete={onDelete} />
    ))}
  </ul>
)

export default Persons
