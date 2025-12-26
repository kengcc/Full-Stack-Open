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

  const Part = ({part}) => (
    <p>
      {part.name} {part.exercises}
    </p>
  )

  const Total = ({total}) => <p>Number of {total} exercises</p>

  const totalExercises = course.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
  )

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total total={totalExercises} />
    </div>
  )
}

export default Course
