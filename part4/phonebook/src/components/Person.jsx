const Person = ({person, onDelete}) => {
  return (
    <li className="person">
      {person.name} {person.number}{" "}
      <button onClick={() => onDelete(person.id)}>delete</button>
    </li>
  )
}

export default Person
