const Carrera = require('../models/carrera.js'); // importar el modelo de Carrera
const { UserInputError } = require('apollo-server-errors'); // importar la excepción de error de entrada de usuario

const carreraMutation = {
    crearCarrera: async (root, args) => {
        try {
            const carrera = new Carrera({ ...args });
            console.log("TRYING", carrera);
            await carrera.save();
            return carrera;
        } catch (error) {
            console.log("ERROR", error);
            throw new UserInputError(error.message, {
                invalidArgs: args
            })
        }
    },
    editarCarrera: async (root, args) => {
        const carrera = await Carrera.findById(args.id)
        if( !carrera ) {
            return null
        }
        carrera.acronimo = args.acronimo;
        carrera.nombre = args.nombre;
        try {
            await carrera.save()
            return carrera
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args
            })
        }
    },
    eliminarCarrera: async (root, args) => {
        const carrera = await Carrera.findById(args.id)
        try {
            await Carrera.findByIdAndDelete(args.id)
            return carrera
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args
            })
        }
    },
};

module.exports = carreraMutation;
