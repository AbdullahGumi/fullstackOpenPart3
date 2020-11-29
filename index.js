require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person')


app.use(cors());

app.use(express.json());

app.use(express.static('build'))

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.method(req, res) === 'POST' ? (JSON.stringify(req.body)) : ('')
  ].join(' ')
}));


app.get('/api/persons', (request, response) => {
  Person.find({})
      .then(persons => {
    console.log(persons)
    response.json(persons);
  })
      .catch(err => next(err))
})


app.get('/info', (request, response) => {
  Person.countDocuments().then(length => {
  response.send(`<p>Phonebook has info for ${length} people</p><p>${new Date()}</p>`);
  });
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(result => res.json(result))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end()
    })
      .catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

	const person = new Person({
		name: body.name,
		number: body.number,
	})
	person.save()
      .then(result => {
  	response.json(result);
  })
      .catch(err => next(err))

})

app.put('/api/persons/:id', (req, res, next) => {
  let personId = req.params.id;
  let newNumber = {
    number: req.body.number
  };
  Person.findByIdAndUpdate(personId, newNumber, { new: true })
    .then(person => res.json(person))
    .catch(err => next(err))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
