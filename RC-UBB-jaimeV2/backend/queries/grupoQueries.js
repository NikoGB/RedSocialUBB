const Grupo = require('../models/grupo.js');

const grupoQueries = {
    all_grupos: async () => {
        const grupos = await Grupo.find({});
        return grupos;
    },
    buscarGrupo: async (root, args) => {
        const grupo = await Grupo.find({ nombre: { $regex: buscar, $options: 'i' } });
        return grupo;
    },
    buscarGrupoId: async (root, args) => {
        const grupo = await Grupo.findById(args.id);
        return grupo;
    },
    buscarGrupoUsuario: async (root, args) => {
        const grupo = await Grupo.find({ usuario: args.usuario });
        return grupo;
    },
    buscarGrupoAdmin: async (root, args) => {
        const grupo = await Grupo.find({ admin: args.admin });
        return grupo;
    }
}

module.exports = { grupoQueries };