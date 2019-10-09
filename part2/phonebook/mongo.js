const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin-user:${password}@mycluster-eibbp.mongodb.net/test?retryWrites=true&w=majority`

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect(url, config)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(res => {
    console.log(`added ${res.name} ${res.number} to phonebook`)
    mongoose.connection.close()
  })
}
