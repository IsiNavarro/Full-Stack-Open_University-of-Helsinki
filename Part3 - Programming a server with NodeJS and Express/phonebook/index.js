const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

const generateId = () => {
    return String(Date.now() + Math.random())
}

app.get('/info', (req, res) => {
    const receivedTime = getDateNow()

    
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${receivedTime}</p>
        `)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id

    const person = persons.find(person => person.id === id)

    if (!person) {
        return res.status(404).json({
            error: 'person not found'
        })
    } 
    else {
        res.json(person)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id

    persons = persons.filter(person => person.id != id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "content missing"
        })
    }
    if (persons.find(person => person.name === body.name)) return res.status(400).json({
        error: "person already exists"
    })
    else {

    
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number,
        }

        persons = persons.concat(person)

        res.json(person)
    }
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})