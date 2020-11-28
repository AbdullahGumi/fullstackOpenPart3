const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
console.log(password);
console.log('process.argv: ', process.argv);
console.log('started mongo.js Successfully');
const url =
  `mongodb+srv://AbdullahGumi:${password}@cluster0.a5rwt.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})


if (process.argv[3] && process.argv[4]){
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

Person.find({}).then(result => {
  console.log('phonebook:')
  result.map(person => {
    console.log(person.name, person.number)
  })
  mongoose.connection.close()
})