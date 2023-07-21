const { UserInputError, ValidationError } = require('apollo-server-express');
const Publicacion = require('../models/publicacion.js');
const Usuario = require('../models/usuario.js');
const Category = require('../models/category.js');
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

const { TextAnalysisClient, AzureKeyCredential } = require("@azure/ai-language-text");

//"https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-semeval2017"
async function huggingQuery(data, url) {
    const response = await fetch(
        url,
        {   
            headers: { Authorization: `Bearer ${process.env.HUGGING_KEY}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();
    if (result.error) {
        console.log('Error:', result.error);

        return { error: result.error };
    }

    return result;
}

async function translationQuery(text) {
    const body = [{ 'text': text }];

    try {
        const response = await fetch(process.env.TRANSLATION_ENDPOINT, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': process.env.TRANSLATION_KEY,
                'Ocp-Apim-Subscription-Region': 'brazilsouth',
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            body: JSON.stringify(body),
        });

        const translationResult = await response.json();
        return translationResult[0].translations[0].text;
    } catch (error) {
        console.log('Error translating text:', error);
        throw error;
    }
}

async function summarizationQuery(text) {

    const client = new TextAnalysisClient(process.env.SUMARIZATION_ENDPOINT, new AzureKeyCredential(process.env.SUMARIZATION_KEY));
    const actions = [
        {
            kind: "AbstractiveSummarization",
            maxSentenceCount: 1,
        },
    ];
    const poller = await client.beginAnalyzeBatch(actions, text, "en");

    poller.onProgress(() => {
        console.log(
            `Last time the operation was updated was on: ${poller.getOperationState().modifiedOn}`
        );
    });
    console.log(`The operation was created on ${poller.getOperationState().createdOn}`);
    console.log(`The operation results will expire on ${poller.getOperationState().expiresOn}`);

    const results = await poller.pollUntilDone();

    for await (const actionResult of results) {
        if (actionResult.kind !== "AbstractiveSummarization") {
            throw new Error(`Expected extractive summarization results but got: ${actionResult.kind}`);
        }
        if (actionResult.error) {
            const { code, message } = actionResult.error;
            throw new Error(`Unexpected error (${code}): ${message}`);
        }
        
        for (const result of actionResult.results) {
            console.log(`- Document ${result.id}`);
            if (result.error) {
                const { code, message } = result.error;
                throw new Error(`Unexpected error (${code}): ${message}`);
            }
            return result.summaries[0].text;
        }
    }
}



const mutations = {
    crearPublicacion: async (root, args) => {
        const publicacion = new Publicacion({ ...args });
        console.log(publicacion)
        try {

            const allTags = await translationQuery(publicacion.texto.replace(/\s+/g, ' ').trim()).then(async (text) => {
                console.log("Traduccion", text)
                if (!text) {
                    throw new ValidationError("Translation API failed", {
                        invalidArgs: args,
                    });
                }

                /* const possibleTags = await classificationQuery({ */

                const possibleTags = await huggingQuery({
                    "inputs": text.length > 310 ? await summarizationQuery([text]) : text,
                    "parameters": {
                        "candidate_labels": ["Art & Creativity", "Music", "Technology", "Travel & Exploration", "University & Education",
                            "Books & Literature", "Announcements & Events", "Entertainment", "Sports & Athletics", "Humor & Memes"]
                    }
                },
                    'https://api-inference.huggingface.co/models/facebook/bart-large-mnli'
                ).then(async (categorys) => {
                    console.log("CATEGORRR", categorys)

                    if (categorys.scores[0] < 0.3) {
                        /* allTags = allTags.filter((atags) => (!rTagIds.includes(atags.tag))) */
                    } else {
                        const auxTags = await Category.aggregate([
                            {
                                $lookup: {
                                    from: 'tags',
                                    localField: 'tags',
                                    foreignField: '_id',
                                    as: 'tagData'
                                }
                            },
                            {
                                $project: {
                                    categoryName: '$nombre',
                                    tags: {
                                        $map: {
                                            input: '$tagData',
                                            as: 'tag',
                                            in: {
                                                id: '$$tag._id',
                                                nombre: '$$tag.nombre'
                                            }
                                        }
                                    }
                                }
                            }
                        ])
                        let tags = [auxTags.find((t) => t.categoryName === categorys.labels[0])];

                        if (categorys.scores[0] < 0.45 && categorys.scores[1] > 0.25 || categorys.scores[1] > 0.4) {
                            tags = [...tags, auxTags.find((t) => t.categoryName === categorys.labels[1])];
                        }

                        return tags;
                    }
                });


                const arraysTags = await Promise.all(possibleTags.map(async (cats) => {

                    /* return await classificationQuery({ */
                    return await huggingQuery({
                        "inputs": text,
                        "parameters": {
                            "candidate_labels": cats.tags.map((tag) => { return tag.nombre })
                        }
                    },
                        'https://api-inference.huggingface.co/models/facebook/bart-large-mnli'
                    ).then(async (tags) => {
                        console.log("Tags", tags)
                        let posTags = []
                        let max = 0;
                        posTags.push({ tag: cats.tags.find((t) => t.nombre === tags.labels[0]).id, valor: tags.scores[0], nombre: tags.labels[0] });
                        max = tags.scores[0]

                        if ((tags.scores[0] < 0.45 && tags.scores[1] > 0.25) || tags.scores[0] < 0.25 || tags.scores[1] > 0.4) {
                            posTags.push({ tag: cats.tags.find((t) => t.nombre === tags.labels[1]).id, valor: tags.scores[1], nombre: tags.labels[1] });
                            max += tags.scores[1]

                            if (tags.scores[1] < 0.3 && tags.scores[2] > 0.2) {
                                posTags.push({ tag: cats.tags.find((t) => t.nombre === tags.labels[2]).id, valor: tags.scores[2], nombre: tags.labels[2] });
                                max += tags.scores[2]

                            }
                        }

                        return posTags.map((t) => {
                            return { ...t, valor: t.valor / max }
                        });
                    });
                }))


                return arraysTags.flat(1);



            }).catch(error => {
                console.log(error);
                throw error;
            });

            console.log("ALL TAGS", allTags);

            /* const keys = await translationQuery(publicacion.texto.replace(/\s+/g, ' ').trim()).then(async (text) => {
                console.log("Traduccion", text)
                if (!text) {
                    throw new ValidationError("Translation API failed", {
                        invalidArgs: args,
                    });
                }


                return await extractKeyPhrase(text.length > 310 ? await summarizationQuery([text]) : text).then(
                    async (response) => {
                        console.log("extract Keys Api response", response);
                        return response;

                    }).catch(error => {
                        console.log(error);
                        throw error;
                    });
            }
            ).catch(error => {
                console.log(error);
                throw error;
            });


            console.log("Keys", keys);

            if (!keys || keys.error || keys.length === 0) {
                throw new ValidationError("Keyword extractor API failed", {
                    invalidArgs: args,
                });
            }

            let newTags = [];
            let allTags = [];

            await Promise.all(keys.map(async (info) => {
                let tag = await Tag.findOne({ nombre: info.word.toLowerCase() });

                if (!tag && !newTags.includes((ntag) => ntag.nombre == tag.nombre)) {
                    tag = new Tag({ nombre: info.word, publicaciones: [publicacion.id], categoria: null });
                    newTags.push(tag);
                }
                console.log("Adding", tag);
                allTags.push({ tag: tag.id, valor: info.score });
            }));

            let auxNewTags = newTags;
            let fRepeat = auxNewTags[auxNewTags.length - 1];
            console.log("To process", auxNewTags)

            let similArray = []

            while (auxNewTags.length > 0) {
                console.log("waiting");
                await new Promise((resolve) => setTimeout(resolve, 2000));
                let sentence = ""

                let rTagIds = await huggingQuery({
                    "inputs": {
                        "source_sentence": auxNewTags[0].nombre,
                        "sentences": auxNewTags.map((auxNTag) => { return auxNTag.nombre; })
                    }
                }, "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2")
                    .then(async (similar) => {

                        console.log("SIMILLLLLL", similar)
                        sentence = auxNewTags[0].nombre

                        let tagIds = (similar.length > 1 ? similar.map((value, index) => (value > 0.4 ? index : -1))
                            .filter(index => index !== -1)
                            .map((val) => { if (val > 0) { sentence += ", " + auxNewTags[val].nombre; } return auxNewTags[val].id; }) :

                            [auxNewTags[0].id]
                        )


                        console.log(fRepeat, auxNewTags[0].id)

                        if (tagIds.length == 1 && auxNewTags.length > 2) {
                            if (fRepeat.id != auxNewTags[0].id) {
                                similArray.push(similar.map((sim, index) => ({ valor: sim, id: auxNewTags[index].id })));

                                const firstElement = auxNewTags.shift();
                                if (!auxNewTags.some((tag) => tag.id === fRepeat.id)) {
                                    fRepeat = firstElement;
                                }
                                auxNewTags.push(firstElement);
                                console.log("Moving", firstElement.nombre)

                                return undefined;
                            } else {
                                similArray.push(similar.map((sim, index) => ({ valor: sim, id: auxNewTags[index].id })));

                                const firstElement = auxNewTags.shift();
                                auxNewTags.push(firstElement);
                                console.log("ended");
                                return 1;
                            }
                        }

                        console.log("TAGS ID", tagIds)
                        return tagIds;

                    })




                if (!rTagIds) {
                    continue
                } else if (rTagIds === 1) {
                    sentence = auxNewTags[0].nombre;

                    rTagIds = similArray.map((sim) => (sim.valor > 0.2 ? sim.id : -1))
                        .filter(id => id !== -1)
                        .map((val, index) => {
                            let idx = 0;
                            if (idx = auxNewTags.findIndex((ntag) => ntag.id === val)) {
                                if (index > 0) { sentence += ", " + auxNewTags[idx].nombre; } 
                                
                                return auxNewTags[idx].id;
                            } else { return -1 }
                        }).filter((val)=> val !== -1);
                    if (rTagIds.length < 2) {
                        
                        auxNewTags.map((nTag, index)=> { if(index > 0) { sentence += ", " + nTag.nombre} }) 
                        rTagIds = auxNewTags.map((ntag) => ntag.id)
                    }
                    console.log("rTried", rTagIds)
                }


                await classificationQuery({
                    "inputs": sentence,
                    "parameters": {
                        "candidate_labels": ["Art & Creativity", "Music", "Technology", "Travel & Exploration", "University & Education",
                            "Books & Literature", "Announcements & Events", "Entertainment", "Sports & Athletics", "Humor & Memes"]
                    }
                }).then(async (categorys) => {
                    console.log("CATEGORRR", categorys)
                    if (categorys.scores[0] < 0.3) {
                        newTags = newTags.filter((ntags) => (!rTagIds.includes(ntags.id)))
                        allTags = allTags.filter((atags) => (!rTagIds.includes(atags.tag)))

                    } else {
                        const category = await Category.findOne({ nombre: categorys.labels[0] })

                        newTags.map((ntag, index) => {
                            newTags[index].categoria = category.id;
                            return ntag;
                        })

                        console.log("Saving", category.nombre, sentence)

                        /* if (categorys.scores[0] < 0.45 || categorys.scores[1] > 0.4) {
                            const category2 = await Category.findOne({ nombre: categorys.labels[1] })
                        } 
                    }


                });

                auxNewTags = auxNewTags.filter((auxNTag) => (!rTagIds.includes(auxNTag.id)))
                console.log("New process", auxNewTags)
            } */


            const user = await Usuario.findById(publicacion.usuario);
            if (allTags.length !== 0) {
                allTags.map((allTagInfo) => {

                    let idx;
                    if ((idx = publicacion.tagInfo.findIndex((tInfos) => tInfos.tag.toString() === allTagInfo.tag.toString())) > -1) {
                        publicacion.tagInfo[idx].valor += allTagInfo.valor;
                        console.log(publicacion.tagInfo[idx]);
                    } else {
                        publicacion.tagInfo = [...publicacion.tagInfo, { tag: allTagInfo.tag, valor: allTagInfo.valor }];
                    }

                    
                    if ((idx = user.intereses.findIndex((tagInfo) => tagInfo.tag.toString() === allTagInfo.tag.toString())) > -1) {
                        user.intereses = user.intereses.map((inters, index)=>{
                            if(index == idx){
                                return {...inters, valor : inters.valor + allTagInfo.valor};
                            }else{ 
                                return inters;
                            }
                        })

                    } else {
                        user.intereses.push(allTagInfo);
                    }
                })
            }

            await user.save();
            await user.updateOne({ $push: { publicaciones: publicacion.id } });

            console.log("Saving", publicacion, user.publicaciones);
            await publicacion.save();

            return publicacion;

        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }


    },
    crearComentario: async (root, args) => {
        const comentario = new Publicacion({ ...args });
        const publicacion = await Publicacion.findById(args.esComentario).populate({ path: 'comentarios' });
        const user = await Usuario.findById(args.usuario);

        if (!publicacion.comentarios.some((com) => com.usuario == args.usuario)) {

            let tagInfos = [...publicacion.tagInfo];

            user.intereses = user.intereses.map((tagInfo) => {
                let idx = 0;
                if ((idx = tagInfos.findIndex((inter) => inter.tag.toString() === tagInfo.tag.toString())) > -1) {
                    const val = tagInfos[idx].valor * 0.5;
                    tagInfos.splice(idx, 1);

                    return { ...tagInfo, valor: tagInfo.valor + val }
                } else {
                    return tagInfo
                }
            })
            
            if (tagInfos.length > 0) {
                user.intereses.push(...tagInfos)
            }
        }

        user.comentarios.push(comentario.id);
        publicacion.comentarios.push(comentario.id);

        try {
            await user.save();
            await publicacion.save();
            await comentario.save();
            return comentario;
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }

    },
    likePublicacion: async (root, args) => {
        const publicacion = await Publicacion.findById(args.id);
        const user = await Usuario.findById(args.usuario);
        
        if (publicacion.likes.some((us)=> us.toString() === args.usuario)){
            publicacion.likes = publicacion.likes.filter((us)=> us.toString() !== args.usuario)
            user.likes = user.likes.filter((pub)=> pub.toString() !== args.id)

            if (!publicacion.esComentario || publicacion.esComentario != null) {
                let tagInfos = [...publicacion.tagInfo];
    
                user.intereses = user.intereses.map((tagInfo) => {
                    let idx = 0;
                    if ((idx = tagInfos.findIndex((inter) => inter.tag.toString() === tagInfo.tag.toString())) > -1) {
                        const val = tagInfos[idx].valor * 0.5;
                        tagInfos.splice(idx, 1);

                        if( tagInfo.valor - val <= 0){
                            return null
                        }else{
                            return { ...tagInfo, valor: tagInfo.valor - val }
                        }
    
                    } else {
                        return tagInfo
                    }
                })

                user.intereses = user.intereses.filter((int)=> int !== null)
            }

        }else{
            publicacion.likes.push(args.usuario);
            user.likes.push(publicacion.id);

            if (!publicacion.esComentario || publicacion.esComentario != null) {
                let tagInfos = [...publicacion.tagInfo];
    
                user.intereses = user.intereses.map((tagInfo) => {
                    let idx = 0;
                    if ((idx = tagInfos.findIndex((inter) => inter.tag.toString() === tagInfo.tag.toString())) > -1) {
                        const val = tagInfos[idx].valor * 0.5;
                        tagInfos.splice(idx, 1);
    
                        return { ...tagInfo, valor: tagInfo.valor + val }
                    } else {
                        return tagInfo
                    }
                })
    
                if (tagInfos.length > 0) {
                    user.intereses.push(...tagInfos)
                }
            }
        }


        try {
            await user.save();
            await publicacion.save();
            return publicacion;
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }
    },
    editarPublicacion: async (root, args) => {
        let publicacion = await Publicacion.findById(args.id);
        if (!publicacion) {
            return null;
        }
        publicacion = new Publicacion({ ...args });
        try {
            await publicacion.save();
            return publicacion;
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }
    },
    eliminarPublicacion: async (root, args) => {
        const publicacion = await Publicacion.findById(args.id);

        if(publicacion.esComentario && publicacion.esComentario != null){
            console.log(await Publicacion.findByIdAndUpdate(publicacion.esComentario, {  $pull: { comentarios: publicacion.id }}))
            await Usuario.findByIdAndUpdate(publicacion.usuario, {$pull: { comentarios: publicacion.id }});
            
        }else if (publicacion.comentarios.length > 0) {
            publicacion.comentarios.forEach(async (com) => {
                await Usuario.findByIdAndUpdate(com.usuario, { $pull: { comentarios: com.toString() } });
                await Publicacion.findByIdAndDelete(com.toString());
            });

            await Usuario.findByIdAndUpdate(publicacion.usuario, { $pull: { publicaciones: publicacion.id } });
        }

       

        try {
            await Publicacion.findByIdAndDelete(args.id);
            return publicacion;
        } catch (error) {
            throw new UserInputError(error.message, {
                invalidArgs: args,
            });
        }
    }


};

module.exports = mutations;
