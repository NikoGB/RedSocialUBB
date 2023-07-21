const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  acronimo: {
    type: String,
    required: true
  },
  alumnos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  ]
})

schema.plugin(uniqueValidator)
module.exports = mongoose.model('Carrera', schema)
