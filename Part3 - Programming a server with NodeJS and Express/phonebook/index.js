require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-lenght] :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const getDateNow = () => {
    const now = Date.now()
    const nowDate = new Date(now)
    return nowDate.toUTCString()
}

app.get('/info', (req, res) => {
    const receivedTime = getDateNow()

    Person.find({}).then(persons => {
        res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${receivedTime}</p>
        `) 
    })    
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id

    Person.findById(id).then(person => res.json(person)).catch(error => {
        res.status(404).json({error: 'Person not found'}).end()
    } )
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id

    persons = persons.filter(person => person.id != id)

    res.status(204).end()
})

app.post('/api/persons', async (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "content missing"
        })
    }
    if (await Person.exists({name: body.name})) return res.status(400).json({
        error: "person already exists"
    })
    else {
        const person = new Person({
            name: body.name,
            number: body.number,
        }
    )
        person.save().then(savedNote => {
            res.json(person)
        })   
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})