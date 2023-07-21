const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    foto_perfil: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    fecha_nacimiento: {
        type: Date
    },
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],
    carrera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrera',
        required: true
    },
    grupos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Grupo'
        }
    ],
    amigos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    ],
    publicaciones: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Publicacion'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Publicacion'
        }
    ],
    comentarios: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Publicacion'
        }
    ],
    intereses: [
        {
            tag: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag'
            },
            valor: {
                type: Number,
                default: 0.0
            }

        }
    ]
})

schema.plugin(uniqueValidator)
module.exports = mongoose.model('Usuario', schema)
