const express = require('express')
const morgan = require('morgan');
const app = express();
const cors = require('cors');

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

let persons = [
    {
      "name": "Johnny English",
      "number": "+991 855 648",
      "id": 1
    },
    {
      "name": "John Black",
      "number": "+223 915 486",
      "id": 2
    },
    {
      "name": "Mr Sausage",
      "number": "+234 8135524649",
      "id": 3
    },
    {
      "name": "Abdullah Gumi",
      "number": "+123 5849849644",
      "id": 4
    }
]



app.get('/api/persons', (request, response) => {
  response.json(persons);
})


app.get('/info', (request, response) => {
  let date = new Date();
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
})

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	persons = persons.find( person => person.id === id);
	if (persons) {
		res.json(persons);
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter( person => person.id !== id);
	if (persons) {
		res.status(204).end();
	} else {
		res.status(404).end()
	}
})

app.post('/api/persons', (request, response) => {
  const body = request.body;
	if (!body.name) return response.status(400).json({error: 'name is missing' });

	if (!body.number) return response.status(400).json({ error: 'number is missing' });

	if (persons.find(ind => ind.name === body.name)){
		return response.status(400).json({ error: 'This name already exists in the phonebook' });
	} 
	const newPerson = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * 10000000)
	}
	persons = persons.concat(newPerson)
	response.json(newPerson);
})

console.log(`PORT: ${process.env.PORT}`)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})