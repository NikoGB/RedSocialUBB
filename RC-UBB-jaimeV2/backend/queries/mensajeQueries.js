const Mensaje = require('../models/mensaje.js');

const mensajeQueries = {
    all_mensajes : async () => {
        const mensajes = await Mensaje.find({});
        return mensajes;
    },
    buscarMensaje : async (root, args) => {
        const mensaje = await Mensaje.find({texto: {$regex: buscar, $options: 'i'}});
        return mensaje;
    },
    buscarMensajeId : async (root, args) => {
        const mensaje = await Mensaje.findById(args.id);
        return mensaje;
    },
    buscarMensajeUsuario : async (root, args) => {
        const mensaje = await Mensaje.find({usuario: args.usuario});
        return mensaje;
    },
    buscarMensajeHora : async (root, args) => {
        const mensaje = await Mensaje.find({hora: args.hora});
        return mensaje;
    }
}

module.exports = { mensajeQueries };