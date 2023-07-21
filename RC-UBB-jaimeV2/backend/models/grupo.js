const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  privacidad: {
    type: String,
    required: true
  },
  vencimiento: Date,
  descripcion: String,
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  ],
  miembros: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  ]
})

module.exports = mongoose.model('Grupo', schema)
