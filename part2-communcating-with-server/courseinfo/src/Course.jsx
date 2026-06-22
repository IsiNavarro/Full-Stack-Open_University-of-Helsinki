const Course = ({course}) => {
  return<>
  <Header name={course.name}/>
  <Content parts={course.parts}/>
  </>
}

const Header = ({name}) => <h1>{name}</h1>

const Content = ({parts}) => {
  return(<>
    {parts.map(part => <Part key={part.id} part={part}/>)}
    <h4>
      Total of {parts.reduce(
      (sum, part) => sum + part.exercises,
      0
      )} exercises
      </h4>
    </>
  )
}

const Part = ({part}) => <div>{part.name} {part.exercises}</div>

export default Course