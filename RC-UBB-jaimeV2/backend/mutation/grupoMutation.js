const { UserInputError } = require('apollo-server-express');
const Grupo = require('../models/grupo.js');

const mutations = {
    crearGrupo: async (root, args) => {
        const grupo = new Grupo({ ...args });
        try {
            await grupo.save();
            return grupo;
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }
    },
    editarGrupo: async (root, args) => {
        let grupo = await Grupo.findById(args.id)
        if (!grupo) {
            return null;
        }
        grupo = new Grupo({ ...args });
        try {
            await grupo.save();
            return grupo;
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }
    },
    eliminarGrupo: async (root, args) => {
        const grupo = await Grupo.findById(args.id);
        try {
            await Grupo.findByIdAndDelete(args.id);
            return grupo;
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }
    }
};

module.exports = mutations;