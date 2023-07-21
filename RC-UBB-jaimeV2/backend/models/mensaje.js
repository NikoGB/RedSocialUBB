const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  texto: String,
  imagenes: [String],
  recibido: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  ],
  visto: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  ]
})

module.exports = mongoose.model('Mensaje', schema)
