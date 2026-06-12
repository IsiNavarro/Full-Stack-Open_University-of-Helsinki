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


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

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

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id

    Person.findById(id).then(person => {
        if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
    .then(result => {
        res.status(204).end()
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body
    console.log(name, number)
    console.log('Put method')

    Person.findById(req.params.id)
    .then(person => {
        if (!person) {
            return res.status(404).end()
        }

        person.name = name
        person.number = number

        return person.save().then(updatedPerson => {
            res.json(updatedPerson)
        })
    }).catch(error => next(error))
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

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})