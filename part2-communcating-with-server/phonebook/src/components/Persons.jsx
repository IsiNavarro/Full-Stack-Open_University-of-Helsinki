const Persons = ({persons, handleDelete}) => {
    return (
    <div>
        {persons.map(person => <li key={person.name}>{person.name} {person.number} <button onClick={() => {handleDelete(person)}}>delete</button></li>)}
    </div>
        
    )
}
export default Persons