const Category = require('../models/category.js');
const Publicacion = require('../models/publicacion.js');
const Tag = require('../models/tag.js');
const Usuario = require('../models/usuario.js');


const publicacionQueries = {
    all_publicaciones: async () => {
        const publicaciones = await Publicacion.find({ esComentario: { $exists: false } });
        return publicaciones;
    },

    buscarPublicacion: async (root, args) => {
        const publicacion = await Publicacion.find({ texto: { $regex: buscar, $options: 'i' } });
        return publicacion;
    },
    buscarPublicacionId: async (root, args) => {
        const publicacion = await Publicacion.findById(args.id);
        return publicacion;
    },

    buscarPublicacionUsuario: async (root, args) => {
        const publicacion = await Publicacion.find({ usuario: args.usuario });
        return publicacion;
    },
    buscarPublicacionHora: async (root, args) => {
        const publicacion = await Publicacion.find({ hora: args.hora });
        return publicacion;
    },
    buscarPublicacionGrupo: async (root, args) => {
        const publicacion = await Publicacion.find({ enGrupo: args.grupo });
        return publicacion;
    },

    feedFriends: async (root, args) => {

        const user = await Usuario.findOne({ _id: args.usuario });

        const groupIds = user.grupos; // Assuming the user has an array of grupo IDs
        const friendIds = user.amigos; // Assuming the user has an array of friend IDs

        const publicaciones = await Publicacion.aggregate([
            { $limit: 20 },
            {
                $match: {
                    $and: [
                        {
                            esComentario: { $exists: false }
                        },
                        {
                            $or: [
                                { usuario: { $eq: user._id } },
                                { enGrupo: { $in: groupIds } }, // Match publications from the specified grupos
                                {
                                    $and: [
                                        { usuario: { $in: friendIds } },
                                        { enGrupo: { $exists: false } } // Match publications from the specified grupos
                                    ]
                                },
                            ]
                        }
                    ]
                }
            }
        ]);

        console.log("FRIENDS FEED", publicaciones);
        return [...publicaciones.map((post) => { return { ...post, id: post._id } })].reverse();
    },

    feedRecomendations: async (root, args) => {

        const user = await Usuario.findById(args.usuario);
        console.log("Buscando intereses", user.intereses);
        user.intereses.sort((a, b) => b.valor - a.valor);

        const userInterests = user.intereses.map(info => info.tag)
        const filteredPosts = await Publicacion.aggregate([
            { $limit: 10000 },
            { $match: { "tagInfo.tag": { $in: userInterests }, "esComentario": { $exists: false } } },
            {
                $lookup: {
                    from: "grupos",
                    localField: "enGrupo",
                    foreignField: "_id",
                    as: "groupInfo"
                }
            },
            {
                $match: {
                    $or: [
                        { "enGrupo": null }, // Match posts without a grupo
                        { "groupInfo.privacidad": "publico" },
                        { "groupInfo.miembros": { $in: [args.usuario] } }
                    ]
                }
            },
            {

                $addFields: {
                    matchingInterests: {
                        $filter: {
                            input: user.intereses,
                            as: 'intereses',
                            cond: {
                                $anyElementTrue: {
                                    $map: {
                                        input: '$tagInfo',
                                        as: 'tagInfo',
                                        in: { $eq: ['$$tagInfo.tag', '$$intereses.tag'] }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    maxInterestValue: {
                        $reduce: {
                            input: '$matchingInterests',
                            initialValue: 0,
                            in: {
                                $cond: {
                                    if: { $gt: ['$$this.valor', '$$value'] },
                                    then: '$$this.valor',
                                    else: '$$value'
                                }
                            }
                        }
                    }
                }
            }, {
                $addFields: {
                    popularityIndex: {
                        $multiply: [
                            {
                                $add: [
                                    { $size: "$likes" },
                                    { $multiply: [1.5, { $size: "$comentarios" }] },
                                ]
                            },
                            "$maxInterestValue"
                        ]

                    },
                    createdAt: "$fecha", // Create a new field to store the complete createdAt datetime

                    createdAtDay: {
                        $dateFromParts: {
                            year: { $year: "$fecha" },
                            month: { $month: "$fecha" },
                            day: { $dayOfMonth: "$fecha" }
                        }
                    }
                }
            },
            { $sort: { createdAtDay: -1, maxInterestValue: -1, popularityIndex: -1, createdAt: -1 } }, {
                $project: { popularityIndex: 0, createdAtDay: 0/*,  matchingInterests: 0, maxInterestValue: 0 */ }
            },
            { $limit: 20 }
        ]).catch(error => {
            console.log(error);
            throw error;
        });

        if (filteredPosts.length < 10) {
            let toSearch = []

            if (toSearch.length === 0) {
                const categorys = (await Promise.all([...new Set(await Promise.all(user.intereses.slice(0, 20).map(async (info) => (await Tag.findById(info.tag)).categoria)))]
                    .map(async (cat) => await Category.findById(cat)))).map((cat) => { toSearch.push(...cat.tags) });
            }


            const extraFilter = await Publicacion.aggregate([
                { $limit: 1000 },
                {
                    $match: { "tagInfo.tag": { $in: toSearch }, "esComentario": { $exists: false } }
                },
                {
                    $match: { _id: { $nin: filteredPosts.map((post) => post._id) } }
                },
                {
                    $lookup: {
                        from: "grupos",
                        localField: "enGrupo",
                        foreignField: "_id",
                        as: "groupInfo"
                    }
                },
                {
                    $match: {
                        $or: [
                            { "enGrupo": null }, // Match posts without a grupo
                            { "groupInfo.privacidad": "publico" },
                            { "groupInfo.miembros": { $in: [args.usuario] } }
                        ]
                    }
                },
                {
                    $addFields: {
                        popularityIndex: {

                            $add: [
                                { $size: "$likes" },
                                { $multiply: [1.5, { $size: "$comentarios" }] },
                            ]

                        },
                        createdAt: "$fecha", // Create a new field to store the complete createdAt datetime

                        createdAtDay: {
                            $dateFromParts: {
                                year: { $year: "$fecha" },
                                month: { $month: "$fecha" },
                                day: { $dayOfMonth: "$fecha" }
                            }
                        }
                    }
                },
                { $sort: { popularityIndex: -1, createdAtDay: -1, createdAt: -1 } }, {
                    $project: { popularityIndex: 0, createdAtDay: 0 }
                },
                { $limit: (20 - filteredPosts.length) }
            ]);
            const nFiltered = [...filteredPosts, ...extraFilter];
            console.log(nFiltered);

            if (nFiltered.length < 10) {
                const finalFilter = await Publicacion.aggregate([

                    { $limit: 100 },
                    {
                        $match: { _id: { $nin: nFiltered.map((post) => post._id) }, "esComentario": { $exists: false } }
                    },
                    {
                        $lookup: {
                            from: "grupos",
                            localField: "enGrupo",
                            foreignField: "_id",
                            as: "groupInfo"
                        }
                    },
                    {
                        $match: {
                            $or: [
                                { "enGrupo": null }, // Match posts without a grupo
                                { "groupInfo.privacidad": "publico" },
                                { "groupInfo.miembros": { $in: [args.usuario] } }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            popularityIndex: {

                                $add: [
                                    { $size: "$likes" },
                                    { $multiply: [1.5, { $size: "$comentarios" }] },
                                ]

                            },
                            createdAt: "$fecha", // Create a new field to store the complete createdAt datetime

                            createdAtDay: {
                                $dateFromParts: {
                                    year: { $year: "$fecha" },
                                    month: { $month: "$fecha" },
                                    day: { $dayOfMonth: "$fecha" }
                                }
                            }
                        }
                    },
                    { $sort: { popularityIndex: -1, createdAtDay: -1, createdAt: -1 } }, {
                        $project: { popularityIndex: 0, createdAtDay: 0 }
                    },
                    { $limit: (20 - nFiltered.length) }
                ]);


                const finalNFilter = [...nFiltered, ...finalFilter]
                console.log("finalFiltered", nFiltered, finalFilter)
                return finalNFilter.map((post) => {
                    return { ...post, id: post._id }
                });

            } else {
                console.log("extraFiltered", filteredPosts, extraFilter)
                return nFiltered.map((post) => {
                    return { ...post, id: post._id }
                });
            }

        } else {
            console.log("Filetered", filteredPosts)
            return filteredPosts.map((post) => {
                return { ...post, id: post._id }
            });
        }



    }
}



module.exports = { publicacionQueries };
