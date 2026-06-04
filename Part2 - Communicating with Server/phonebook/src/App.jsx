import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import ServerCommunication from './services/ServerCommunication'


const App = () => {
  
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [filterString, setNewFilterString] = useState('')
  
  const [persons, setPersons] = useState([])

  const resetFormInput = () => {
    setNewName('')
    setNewPhoneNumber('')
  }

  useEffect(() => {
    ServerCommunication.getAll().then(persons => setPersons(persons))
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
      number: newPhoneNumber
    }
    if (persons.some(person => person.name.trim() === newName.trim())){
      if (confirm(`${newName.trim()} already exists. Do you want to update their number?`)) {

        const [existingPerson] = persons.filter(person => person.name.trim() === newName.trim())
        personObject.id = existingPerson.id

        ServerCommunication.update(personObject).then(returnedPerson => {
          setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person))
        })
      }
    }
    else {
      ServerCommunication.create(personObject).then(person => {
        setPersons(persons.concat(person))
      })
      resetFormInput()
    }
  }

  const handleFilterChange = (e) => {
    setNewFilterString(e.target.value)
  }

  const handleDelete = (person) => {
    if (confirm(`Do you want to delete ${person.name}?`)) {}
    ServerCommunication.remove(person.id).then(removedPerson => {
      setPersons(persons.filter((person) => person.id != removedPerson.id))
    })
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
      <Persons persons={personsToShow}
      handleDelete={handleDelete}/>
      </div>
  )
}

export default App