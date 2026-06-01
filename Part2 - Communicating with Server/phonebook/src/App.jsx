import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleChange = (e) => {
    setNewName(e.target.value)
  }

  const handleClick = (e) => {
    e.preventDefault()
    const personObject = {
      name: newName.trim()
    }
    if (persons.some(person => person.name.trim() === newName.trim())){
      alert(`${newName.trim()} already exists!`) 
    }
    else {
      setPersons(persons.concat(personObject))
      setNewName('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleChange}/>
        </div>
        <div>
          <button type="submit" onClick={handleClick}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <li key={person.name}>{person.name}</li>)}
      </div>
  )
}

export default App