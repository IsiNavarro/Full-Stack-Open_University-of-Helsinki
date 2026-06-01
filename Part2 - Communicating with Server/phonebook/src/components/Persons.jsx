const Persons = ({persons}) => {
    return (
    <div>
        {persons.map(person => <li key={person.name}>{person.name} {person.phoneNumber}</li>)}
    </div>
        
    )
}
export default Persons