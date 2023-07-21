const { UserInputError } = require("apollo-server")
const Mensaje = require("../models/mensaje.js")
const Chat = require("../models/chat.js")

const mutations = {
    addMensaje: async (_, { id, mensaje }) => {
        try {
            // Create a new mensaje document

            const newMensaje = new Mensaje({
                fecha: mensaje.fecha,
                usuario: mensaje.usuario,
                texto: mensaje.texto,
                imagenes: mensaje.imagenes,
                visto: mensaje.visto
            });

            // Save the new mensaje document
            await newMensaje.save();

            // Find the chat by chatId and update the mensajes array
            const chat = await Chat.findById(id);
            if (!chat) {
                throw new Error('Chat not found');
            }

            chat.mensajes.push(newMensaje);

            // Save the updated chat document
            await chat.save();

            return newMensaje;
        } catch (error) {
            console.log('Error adding message:', error);
            throw error;
        }
    },
    markRead: async (root, args) => {
        try {
            const mensaje = await Mensaje.findById(args.id)
            if (!mensaje) {
                return null
            }
            mensaje.visto.push(args.usuario);

            await mensaje.save()
            return mensaje
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            })
        }
    },
    markRecived: async (root, args) => {
        try {
            const mensaje = await Mensaje.findById(args.id)
            if (!mensaje) {
                return null
            }
            mensaje.recibido.push(args.usuario);

            await mensaje.save()
            return mensaje
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            })
        }
    },
    markReciveds: async (root, args) => {
        try {
            const mensaje = await Mensaje.findById(args.id)
            if (!mensaje) {
                return null
            }

            mensaje.recibido.push(...args.usuarios);

            await mensaje.save()
            return mensaje
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            })
        }
    },
    editarMensaje: async (root, args) => {
        const mensaje = await Mensaje.findById(args.id)
        if (!mensaje) {
            return null
        }
        const auxMensaje = new Mensaje({ ...mensaje, ...args })
        try {
            await auxMensaje.save()
            return auxMensaje
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            })
        }
    },
    eliminarMensaje: async (root, args) => {
        const mensaje = await Mensaje.findById(args.id)
        try {
            await Mensaje.findByIdAndDelete(args.id)
            return mensaje
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            })
        }
    }
};

module.exports = mutations;