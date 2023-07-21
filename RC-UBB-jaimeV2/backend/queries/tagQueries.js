const Tag = require('../models/tag.js');

const tagQueries = {
    all_tags: async () => {
        const tag = await Tag.find({});
        return tag || [];
    },
    buscarTag: async (root, args) => {
        const tag = await Tag.findById(args.id);
        return tag;
    },
    buscarTagNombre: async (root, args) => {
        const tag = await Tag.findOne({ nombre: args.nombre });
        return tag;
    },
}

module.exports = { tagQueries };