const { UserInputError } = require('apollo-server-express');
const Votacion = require('../models/votacion.js');

const mutations = {
    crearVotacion: async (root, args) => {
        const votacion = new Votacion({ ...args });
        try {
            await votacion.save();
            return votacion;
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }
    },
    editarVotacion: async (root, args) => {
        let votacion = await Votacion.findById(args.id);
        if (!votacion) {
            return null;
        }
        votacion = new Votacion({ ...args });
        try {
            await votacion.save();
            return votacion;
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }
    },
    eliminarVotacion: async (root, args) => {
        const votacion = await Votacion.findById(args.id);
        try {
            await Votacion.findByIdAndDelete(args.id);
            return votacion;
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }
    }
};

module.exports = mutations;