const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: [3, 'Name must be at least 3 characters long']
  },

  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props =>
        `${props.value} is not a valid phone number (format XX-XXXX or XXX-XXXX)`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    return {
      id: returnedObject._id.toString(),
      name: returnedObject.name,
      number: returnedObject.number
    }
  }
})

module.exports = mongoose.model('Person', personSchema)
