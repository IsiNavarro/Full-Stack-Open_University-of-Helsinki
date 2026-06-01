import { useState } from 'react'

const App = () => {
  
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filterString, setNewFilterString] = useState('')
  
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phoneNumber: '040-123456', id: 1 },
    { name: 'Ada Lovelace', phoneNumber: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', phoneNumber: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', phoneNumber: '39-23-6423122', id: 4 }
  ])

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }
  const handlePhoneChange = (e) => {
    setNewPhoneNumber(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const personObject = {
      name: newName.trim(),
      phoneNumber: newPhoneNumber
    }
    if (persons.some(person => person.name.trim() === newName.trim())){
      alert(`${newName.trim()} already exists!`) 
    }
    else {
      setPersons(persons.concat(personObject))
      setNewName('')
    }
  }

  const handleFilterChange = (e) => {
    setNewFilterString(e.target.value)
  }

  const personsToShow = persons.filter((person) => person.name.toLowerCase().includes(filterString))


  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter by name<input type="text" value={filterString} onChange={handleFilterChange}/>
      </div>
      <h2>add a new</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newPhoneNumber} onChange={handlePhoneChange}/>
        </div>
        <div>
          <button type="submit" onClick={handleSubmit}>
            add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map(person => <li key={person.name}>{person.name} {person.phoneNumber}</li>)}
      </div>
  )
}

export default App