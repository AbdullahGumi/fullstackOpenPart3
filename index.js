const express = require('express')
const app = express()

app.use(express.json())


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
	console.log(persons);
	if (persons) {
		res.json(persons);
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter( person => person.id !== id);
	console.log(persons);
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
		console.log('finder:', persons.find(ind => ind.name === body.name))
	if (persons.find(ind => ind.name === body.name)){
		return response.status(400).json({ error: 'This name already exists in the phonebook' });
	} 
	const newPerson = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * 10000000)
	}
	console.log('persons', persons)
	persons = persons.concat(newPerson)

  console.log(newPerson)
  response.json(newPerson);
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})