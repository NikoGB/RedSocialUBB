const Carrera = require('../models/carrera.js');
const Chat = require('../models/chat.js');
const Grupo = require('../models/grupo.js')
const Publicacion = require('../models/publicacion.js')
const Usuario = require('../models/usuario.js');
const Mensaje = require('../models/mensaje.js');
const Tag = require('../models/tag.js');
const votacion = require('../models/votacion.js');

const UsuarioNesting = {
    carrera: async (parent) => {
        const carrera = await Carrera.findOne(parent.carrera);
        return carrera;
    },
    amigos: async (parent) => {
        const amigos = await Usuario.find({ _id: { $in: parent.amigos } });
        return amigos;
    },
    chats: async (parent) => {
        const chats = await Chat.find({ _id: { $in: parent.chats } }).populate('mensajes');

        for (const chat of chats) {
            for (const msg of chat.mensajes.reverse()) {
                console.log(msg.recibido, msg.usuario.toString(), parent.id)
                if (msg.usuario.toString() !== parent.id && !msg.recibido.some((usID) => usID.toString() === parent.id)) {
                    
                    msg.recibido.push(parent.id);
                    await msg.save();
                    
                }else{
                    break; // Exit the inner loop once a matching mensaje is found
                }
            }
        }
        return chats;
    },
    grupos: async (parent) => {
        const grupos = await Grupo.find({ _id: { $in: parent.grupos } });
        return grupos;
    },
    publicaciones: async (parent) => {
        const publicaciones = await Publicacion.find({ _id: { $in: parent.publicaciones } });
        return publicaciones;
    },
    likes: async (parent) => {
        const likes = await Publicacion.find({ _id: { $in: parent.likes } });
        return likes;
    },
    comentarios: async (parent) => {
        const comentarios = await Publicacion.find({ _id: { $in: parent.comentarios } });
        return comentarios;
    },
    intereses: async (parent) => {
        return parent.intereses;
    }
}

const CarreraNesting = {
    alumnos: async (parent) => {
        const alumnos = await Usuario.find({ _id: { $in: parent.alumnos } });
        return alumnos;
    },
}

const ChatNesting = {
    usuarios: async (parent) => {
        const usuarios = await Usuario.find({ _id: { $in: parent.usuarios } });
        return usuarios;
    },
    mensajes: async (parent) => {
        const mensajes = await Mensaje.find({ _id: { $in: parent.mensajes } });
        return mensajes;
    }
}

const MensajeNesting = {
    usuario: async (parent) => {
        const usuario = await Usuario.findById(parent.usuario);
        return usuario;
    },
    visto: async (parent) => {
        const visto = await Usuario.find({ _id: { $in: parent.visto } });
        return visto;
    },
    recibido: async (parent) => {
        const recibido = await Usuario.find({ _id: { $in: parent.recibido } });
        return recibido;
    },
}

const PublicacionNesting = {
    usuario: async (parent) => {
        const usuario = await Usuario.findById(parent.usuario);
        return usuario;
    },
    votacion: async (parent) => {
        const votacion = await votacion.find({ _id: { $in: parent.votacion } });
        return votacion;
    },
    comentarios: async (parent) => {
        const comentarios = await Publicacion.find({ _id: { $in: parent.comentarios } });
        return comentarios;
    },
    likes: async (parent) => {
        const likes = await Usuario.find({ _id: { $in: parent.likes } });
        return likes;
    },
    tagInfo: async (parent) => {
        return parent.tagInfo;
    },
    esComentario: async (parent) => {
        const esComentario = await Publicacion.findById(parent.esComentario);
        return esComentario;
    },
    enGrupo: async (parent) => {
        const enGrupo = await Grupo.findById(parent.enGrupo);
        return enGrupo;
    }
}

const TagNesting = {

    publicaciones: async (parent) => {
        const publicaciones = await Publicacion.find({ _id: { $in: parent.publicaciones } });
        return publicaciones;
    }
}
const TagInfoNesting = {
    tag: async (parent) => {
        const tag = await Tag.findById(parent.tag);
        return tag;
    }
}


module.exports = { UsuarioNesting, CarreraNesting, ChatNesting, MensajeNesting, PublicacionNesting, TagNesting, TagInfoNesting };
