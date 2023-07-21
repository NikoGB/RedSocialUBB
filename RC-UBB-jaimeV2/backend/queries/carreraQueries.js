const Carrera = require('../models/carrera.js');

const carreraQueries = {
    all_carreras: async () => {
        const carrera = await Carrera.find({});
        return carrera || [];
    },
    buscarCarrera: async (root, args) => {
        const carrera = await Carrera.findById(args.id);
        return carrera;
    },
}

module.exports = { carreraQueries };