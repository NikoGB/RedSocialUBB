const mongoose = require('mongoose')

const Usuario = require('./models/usuario')
const Carrera = require('./models/carrera')
const Publicacion = require('./models/publicacion')
const Votacion = require('./models/votacion')
const Grupo = require('./models/grupo')
const Chat = require('./models/chat')
const Category = require('./models/category')
const Tag = require('./models/tag')
const dotenv = require('dotenv')
dotenv.config()

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Función para crear elementos de prueba
async function crearElementosDePrueba() {
    try {
        // Crear una carrera
        /* const carrera = new Carrera({
          nombre: 'Informática',
          acronimo: 'INFO'
        })
    
        const carrera1 = new Carrera({
          nombre: 'Administración de Empresas',
          acronimo: 'ADM'
        })
    
        // Crear un usuario
        const usuario = new Usuario({
          nombre: 'John',
          apellido: 'Doe',
          foto_perfil: 'profile.jpg',
          username: 'johndoe',
          correo: 'john@example.com',
          fecha_nacimiento: new Date()
        })
    
        // Crear un usuario
        const usuario1 = new Usuario({
          nombre: 'Jane',
          apellido: 'Smith',
          foto_perfil: 'profile.jpg',
          username: 'janesmith',
          correo: 'jane@example.com',
          fecha_nacimiento: new Date()
        })
    
        const grupo = new Grupo({
          nombre: 'Grupo de Estudio',
          privacidad: 'Público'
        })
    
        const grupo1 = new Grupo({
          nombre: 'Lenguaje',
          privacidad: 'Privado'
        })
    
        const publicacion = new Publicacion({
          usuario: usuario1.id,
          fecha: new Date(),
          texto: '¡Hola mundo!'
        })
    
        const publicacion1 = new Publicacion({
          usuario: usuario.id,
          fecha: new Date(),
          texto: '¡Saludos!'
        })
    
        // Generar elementos de prueba para Chat
        const chat1 = new Chat({
          usuarios: [usuario1, usuario]
        })
    
        const chat2 = new Chat({
          usuarios: [usuario, usuario1]
        })
    
        usuario.carrera = carrera
        usuario1.carrera = carrera1
    
        usuario.grupos.push(grupo)
        grupo.admins.push(usuario)
        grupo.chat = chat1;
    
        usuario1.grupos.push(grupo1)
        grupo1.admins.push(usuario1)
        grupo1.chat = chat2;
        
        await carrera.save()
        await carrera1.save()
    
        await usuario.save()
        await usuario1.save()
        await chat1.save();
        await chat2.save();
    
        await grupo.save()
        await grupo1.save()
    
        await publicacion.save()
        await publicacion1.save() */

        /*    const category = new Category({
               nombre: "Art & Creativity",
               tags : []
           })
           const category1 = new Category({
               nombre: "Music",
               tags : []
           })
           const category2 = new Category({
               nombre: "Technology",
               tags : []
           })
           const category3 = new Category({
               nombre: "Travel & Adventure",
               tags : []
           })
           const category4 = new Category({
               nombre: "Food & Culinary",
               tags : []
   
           })
           const category5 = new Category({
               nombre: "Books & Literature",
               tags : []
           })
           const category6 = new Category({
               nombre: "Events",
               tags : []
           })
           const category7 = new Category({
               nombre: "Entertainment",
               tags : []
           })
           const category8 = new Category({
               nombre: "Sports & Athletics",
               tags : []
           })
           const category9 = new Category({
               nombre: "Humor & Memes",
               tags : []
           })
   
           await category.save();
           await category1.save();
           await category2.save();
           await category3.save();
           await category4.save();
           await category5.save();
           await category6.save();
           await category7.save();
           await category8.save();
           await category9.save(); */

        /* await Category.updateMany({}, { $set : { 'tags' : [] }});
        await Usuario.updateMany({}, [{ $set : { 'publicaciones' : [] }}, {$set : { 'intereses' : [] }}]); */


        /* 
                
                const tag = new Tag({
                    nombre: "Painting",
                    categoria : '646ffe337e7164f9b64e6534',
                    publicaciones : []
                })
         */
       /*  const categories = [
            {
                categoriaId: '646ffe337e7164f9b64e6534',
                subcategories: [
                    'Painting',
                    'Drawing',
                    'Sculpture',
                    'Photography',
                    'Design',
                    'Crafts',
                    'Creative Writing',
                    'Digital Art',
                    'Mixed Media Art',
                    'Street Art'
                ]
            },
            {
                categoriaId: '646ffe337e7164f9b64e6535',
                subcategories: [
                    'Concerts',
                    'Music Festivals',
                    'Album Releases',
                    'Music Recommendations',
                    'Musical Instruments',
                    'Music Production',
                    'Songwriting',
                    'Music Theory',
                    'Music History',
                    'Music Collaboration'
                ]
            },
            {
                categoriaId: '646ffe337e7164f9b64e6536',
                subcategories: [
                    'Gadgets',
                    'Innovation',
                    'Artificial Intelligence',
                    'Virtual Reality',
                    'Cybersecurity',
                    'Coding',
                    'Internet of Things (IoT)',
                    'Data Science',
                    'Augmented Reality',
                    'Robotics'
                ]
            },
            {
                categoriaId: '646ffe337e7164f9b64e6537',
                subcategories: [
                    'Backpacking',
                    'Adventure Sports',
                    'Nature Exploration',
                    'Cultural Immersion',
                    'Travel Photography',
                    'Road Trips',
                    'Wildlife Encounters',
                    'Sustainable Travel',
                    'Food and Travel',
                    'Historic Sites and Monuments'
                ]
            },
            {
                categoriaId: '646ffe337e7164f9b64e6538',
                subcategories: [
                    'Academic Research',
                    'Study Abroad Programs',
                    'Campus Life',
                    'Student Organizations',
                    'Career Guidance',
                    'Student Resources',
                    'Academic Success Tips',
                    'Alumni Network',
                    'Online Learning',
                    'Study Techniques'
                ]
            },
            {
                categoriaId: '646ffe337e7164f9b64e6539',
                subcategories: [
                    'Book Reviews',
                    'Author Interviews',
                    'Reading Recommendations',
                    'Literary Events',
                    'Book Clubs',
                    'Poetry',
                    'Fiction',
                    'Non-Fiction',
                    'Literary Criticism',
                    'Classic Literature'
                ]
            },
            {
                categoriaId: '646ffe337e7164f9b64e653a',
                subcategories: [
                    'Conferences',
                    'Workshops',
                    'Seminars',
                    'Networking Events',
                    'Charity Drives',
                    'Exhibitions',
                    'Parties',
                    'Product Launches',
                    'Campaigns and Initiatives',
                    'Fundraising Events'
                ]
            },
            {
                categoriaId: '646ffe337e7164f9b64e653b',
                subcategories: [
                    'Movie Reviews',
                    'TV Show Discussions',
                    'Theater Performances',
                    'Comedy Shows',
                    'Videogames',
                    'Celebrity News',
                    'Film Festivals',
                    'Web Series',
                    'Animation',
                    'Documentaries'
                ]
            },
            {
                categoriaId: '646ffe337e7164f9b64e653c',
                subcategories: [
                    'Sports Team Updates',
                    'Sports Events',
                    'Football',
                    'Basketball',
                    'Soccer',
                    'Tennis',
                    'Athletics',
                    'Fitness Tips',
                    'Sports Training',
                    'Sports Nutrition'
                ]
            },
            {
                categoriaId: '646ffe337e7164f9b64e653d',
                subcategories: [
                    'Memes',
                    'Jokes',
                    'Funny Videos',
                    'Viral Trends',
                    'Satire',
                    'Internet Culture',
                    'Parodies',
                    'Comedy Sketches',
                    'Stand-Up Comedy',
                    'Funny Quotes'
                ]
            }
        ];

        async function createTags() {
            try {
                for (const category of categories) {
                    const { categoriaId, subcategories } = category;
                    
                    const tabCategory = await Category.findById(categoriaId);

                    for (const subcategory of subcategories) {
                        const tagData = {
                            nombre: subcategory,
                            categoria: categoriaId,
                            publicaciones: []
                        };
                        const tag = new Tag(tagData);
                        await tag.save();
                    
                        tabCategory.tags.push(tag._id);
                        await tabCategory.save();
                    }
                }
                console.log('Tags created successfully!');
            } catch (error) {
                console.error('Error creating tags:', error);
            }
        }

        await createTags(); */

        /* await Usuario.updateMany({}, [{ $set : { 'publicaciones' : [] }}, {$set : { 'intereses' : [] }}]); */
        await Tag.updateMany({}, { $set : { 'publicaciones' : [] }});

        console.log('Elementos de prueba creados correctamente.')
    } catch (error) {
        console.error('Error al crear elementos de prueba:', error)
    } finally {
        mongoose.disconnect()
    }
}

// Llamar a la función para crear los elementos de prueba
crearElementosDePrueba()
