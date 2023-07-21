const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  pregunta: {
    type: String,
    required: true
  },
  opciones: [
    {
      texto: {
        type: String,
        required: true
      },
      votos: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Usuario'
        }
      ]
    }
  ]
})

schema.plugin(uniqueValidator)
module.exports = mongoose.model('Votacion', schema)
