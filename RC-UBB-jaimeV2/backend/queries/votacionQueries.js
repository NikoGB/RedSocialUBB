const Votacion = require('../models/votacion.js');

const votacionQueries = {
    all_votaciones: async () => {
        const votaciones = await Votacion.find({});
        return votaciones;
    },
    buscarVotacion: async (root, args) => {
        const votacion = await Votacion.find({ pregunta: { $regex: buscar, $options: 'i' } });
        return votacion;
    },
    buscarVotacionId: async (root, args) => {
        const votacion = await Votacion.findById(args.id);
        return votacion;
    },
    buscarVotacionUsuario: async (root, args) => {
        const votacion = await Votacion.find({ usuario: args.usuario });
        return votacion;
    },
    buscarVotacionPublicacion: async (root, args) => {
        const votacion = await Votacion.find({ publicacion: args.publicacion });
        return votacion;
    }
}

/*
    * #buscarVotacionResultados(id: ID!): [Votacion]
    * FALTA AGREGAR EL CONTADOR DE VOTOS.
*/

module.exports = { votacionQueries };
