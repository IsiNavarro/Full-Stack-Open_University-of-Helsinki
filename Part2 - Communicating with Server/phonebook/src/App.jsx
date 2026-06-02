import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import axios from 'axios'

const App = () => {
  
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filterString, setNewFilterString] = useState('')
  
  const [persons, setPersons] = useState([])

  useEffect(() => {
    axios
    .get('http://localhost:3001/persons')
    .then((response => {
      setPersons(response.data)
    }))
  }, [])

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
      <Filter value={filterString} onChange={handleFilterChange}/>
      <h3>add a new</h3>
      <PersonForm 
      nameValue={newName} nameOnChange={handleNameChange} 
      numberValue={newPhoneNumber} numberOnChange={handlePhoneChange}
      buttonOnClick={handleSubmit}/>
      
      <h2>Numbers</h2>
      <Persons persons={personsToShow}/>
      </div>
  )
}

export default App