const Course = ({course}) => {
  const Header = ({name}) => (
    <div>
      <h1>{name}</h1>
    </div>
  )

  const Content = ({parts}) => (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )

  const Part = (props) => (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )

  const Total = (props) => <p>Number of exercises {props.total}</p>

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total
        total={
          course.parts[0].exercises +
          course.parts[1].exercises +
          course.parts[2].exercises
        }
      />
    </div>
  )
}

export default Course
