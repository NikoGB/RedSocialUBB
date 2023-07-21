
const Chat = require('../models/chat.js');
const Mensaje = require('../models/mensaje.js');

const chatQueries = {
    all_chats: async () => {
        const chats = await Chat.find({});
        return chats;
    },
    buscarChat: async (root, args) => {
        const chat = await Chat.findById(args.id);
        return chat;
    },

    buscarFriendChat: async (root, args) => {
        const chat = await Chat.findOne({
            $and: [
                { name: '' },
                { users: { $eq: args.users } }
            ]
        });
        return chat;
    },
    getLastMsgChats: async (root, args) => {
        const chats = await Chat.find({ _id: { $in: args.chats } });

        const auxChats = await Promise.all(chats.map(async (chat) => {
            const lastMensaje = await Mensaje.findById(chat.mensajes[chat.mensajes.length - 1]);
            return { ...chat.toObject(), id: chat._id, mensajes: [lastMensaje] };
        }))
        console.log(auxChats);

        return auxChats.sort((a, b)=> b.mensajes[0].fecha - a.mensajes[0].fecha);
    }
}

module.exports = { chatQueries };