const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    usuarios: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    ],
    nombre: {
        type: String,
        required: true
    },
    mensajes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mensaje'
        }
    ]
})

module.exports = mongoose.model('Chat', schema)
