const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()


app.use(cors());

app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const timestamp = new Date();
  const numberOfPeople = persons.length || 0;

  response.send(`
    <p>Phonebook has info for ${numberOfPeople} people</p>
    <p>${timestamp}</p>
    `);
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const personToShow = persons.find(person => person.id === id);
  if (personToShow) {
    response.json(personToShow)
  } else {
    console.log(`Person with ID:{${id}} does not exist`);
    response.status(404).end();
  }
})

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;
  if (!name || !number || !name.trim() || !number.trim()) {
    return response.status(400).json({
      error: 'name or number missing'
    });
  }

  const personAlreadyExists = persons.some(
    p => p.name.toLowerCase() === name.toLowerCase()
  );
  if (personAlreadyExists) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: name.trim(),
    number: number.trim()
  };

  persons.push(person);
  response.status(201).json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(person => person.id !== id);
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})