import mongoose from "mongoose"
import uniqueValidator from "mongoose-unique-validator"

const schema = new mongoose.Schema({
    cod_asignatura: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
    },
    semestre: {
        type: String,
        required: true
    },
    prof_encargado: {
        type: String,
        required: true
    },
    cupos: {
        type: Number,
        required: true
    },
    alumnos: [
        {
            ref: "Usuario",
            type: mongoose.Schema.Types.ObjectId
        }
    ]
})

schema.plugin(uniqueValidator)
export default mongoose.model("Asignatura", schema)