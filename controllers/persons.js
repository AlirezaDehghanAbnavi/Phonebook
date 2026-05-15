const personsRouter = require('express').Router()
const Person = require('../models/person')


personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

personsRouter.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
    `)
  })
    .catch(err => {
      console.log(err)
      response.status(500).send('Error Fetching Data')
    })
})

personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

personsRouter.post('/', async (request, response, next) => {
  const { name, number } = request.body

  if (!number) {
    return response.status(400).json({ error: 'number is missing' })
  }

  try {
    const person = new Person({ name, number })
    const savedPerson = await person.save()

    response.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

personsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

personsRouter.delete('/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


module.exports = personsRouter