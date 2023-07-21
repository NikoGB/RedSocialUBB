const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  nombre: String,
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ],
})

module.exports = mongoose.model('Category', schema)