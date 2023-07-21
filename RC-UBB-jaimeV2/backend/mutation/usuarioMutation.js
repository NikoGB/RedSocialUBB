const { UserInputError } = require('apollo-server-express');
const Usuario = require('../models/usuario.js');

const mutations = {
  crearUsuario: async (root, args) => {
    const usuario = new Usuario({ ...args });
    try {
      await usuario.save();
      return usuario;
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: args,
      });
    }
  },
  editarUsuario: async (root, args) => {
    let usuario = await Usuario.findById(args.id);
    if (!usuario) {
      return null;
    }
    usuario = new Usuario({ ...args });
    try {
      await usuario.save();
      return usuario;
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: args,
      });
    }
  },
  eliminarUsuario: async (root, args) => {
    const usuario = await Usuario.findById(args.id);
    try {
      await Usuario.findByIdAndDelete(args.id);
      return usuario;
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: args,
      });
    }
  },
};

module.exports = mutations;
