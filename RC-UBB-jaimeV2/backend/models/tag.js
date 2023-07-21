const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  nombre: String,
  publicaciones: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publicacion'
    }
  ],
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
  }
})

module.exports = mongoose.model('Tag', schema)