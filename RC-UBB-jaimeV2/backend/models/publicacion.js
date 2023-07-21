const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    imagenes: [String],
    texto: String,
    votacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Votacion'
    },
    comentarios: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Publicacion'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        }
    ],
    tagInfo: [
        {
            tag: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tag'
            },
            valor: Number
        }
    ],
    enGrupo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grupo'
    },
    esComentario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publicacion'
    }
})

module.exports = mongoose.model('Publicacion', schema)
