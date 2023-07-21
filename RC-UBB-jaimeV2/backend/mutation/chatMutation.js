const { UserInputError } = require("apollo-server")
const Chat = require("../models/chat.js")
const Mensaje = require("../models/mensaje.js")
const Usuario = require("../models/usuario.js")


const mutations = {
    crearChat: async (_, { usuarios, nombre, mensaje }) => {
        try {
            const chat = new Chat({
                usuarios: usuarios,
                nombre: nombre
            });
            if (mensaje) {
                const sMensaje = new Mensaje(mensaje);
                chat.mensajes.push(sMensaje);
                await sMensaje.save()
            }
            await chat.save();

            await Usuario.updateMany(
                { _id: { $in: usuarios } },
                { $push: { chats: chat._id } }
            );


            return chat;
        } catch (error) {
            console.log('Error creating chat with mensaje:', error);
            throw error;
        }
    },
    openChat: async (root, args) => {
        const chat = await Chat.findById(args.id).populate('mensajes');
        
        for (const msg of chat.mensajes.reverse()) {
            if (msg.usuario.toString() !== args.usuario && !msg.visto.some((usID) => usID.toString() === args.usuario)) {
                msg.visto.push(args.usuario);
                await msg.save();
                
            } else {
                break; // Exit the inner loop once a matching mensaje is found
            }
        }
        return chat;
    },
    eliminarChat: async (root, args) => {
        const chat = await Chat.findById(args.id)
        try {
            await Chat.findByIdAndDelete(args.id)
            return chat
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            })
        }
    },
    addUsuariosToChat: async (_, { id, usuarios }) => {
        try {
            // Find the chat by chatId
            const chat = await Chat.findById(id);
            if (!chat) {
                throw new Error('Chat not found');
            }

            // Add the usuarioIds to the chat's usuarios field
            chat.usuarios = [...chat.usuarios, ...usuarios];

            // Save the updated chat document
            await chat.save();

            return chat;
        } catch (error) {
            console.log('Error adding usuarios to chat:', error);
            throw error;
        }
    }

};

module.exports = mutations