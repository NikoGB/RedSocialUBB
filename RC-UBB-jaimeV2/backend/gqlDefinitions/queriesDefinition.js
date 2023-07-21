const { gql } = require('apollo-server');

const typeDefs = gql`

type Query {
    #Carrera
    all_carreras: [Carrera]!
    buscarCarrera(id: ID!): Carrera

    #Chat
    all_chats: [Chat]!
    buscarChat(id: ID!): Chat
    buscarFriendChat(users: [ID!]!): Chat
    getLastMsgChats(chats:[ID!]!): [Chat]

    #Grupo
    all_grupos: [Grupo]!
    buscarGrupo(buscar: String!): [Grupo]
    buscarGrupoId(id: ID!): Grupo
    buscarGrupoUsuario(usuario: ID!): [Grupo]
    buscarGrupoAdmin(admin: ID!): [Grupo]

    #Mensaje
    all_mensajes: [Mensaje]!
    buscarMensaje(buscar: String!): [Mensaje]
    buscarMensajeId(id: ID!): Mensaje
    buscarMensajeUsuario(usuario: ID!): [Mensaje]
    buscarMensajeHora(hora: Date!): [Mensaje]
    
    #Opcion
    all_opciones: [Opcion]!
    buscarOpcion(buscar: String!): [Opcion]
    buscarOpcionId(id: ID!): Opcion
    buscarOpcionUsuario(usuario: ID!): [Opcion]

    #Publicacion
    all_publicaciones: [Publicacion]!
    buscarPublicacion(buscar: String!): [Publicacion]
    buscarPublicacionId(id: ID!): Publicacion
    buscarPublicacionUsuario(usuario: ID!): [Publicacion]
    buscarPublicacionHora(hora: Date!): [Publicacion]
    buscarPublicacionGrupo(grupo: ID!): [Publicacion]
    feedRecomendations(usuario: ID!): [Publicacion]
    feedFriends(usuario: ID!): [Publicacion]

    #Tags
    all_tags: [Tag]
    buscarTag(id: ID!): Tag
    buscarTagNombre(nombre: String!): Tag
    
    #Usuario
    all_usuarios: [Usuario]!
    buscarUsuario(buscar: String!): [Usuario]
    buscarUsuarioId(id: ID!): Usuario
    logOut(id: ID!): Usuario
    buscarUsuarioCorreo(correo: String!): [Usuario]
    buscarUsuarioCarrera(carrera: ID!): [Usuario]

    #Votacion
    all_votaciones: [Votacion]!
    buscarVotacion(buscar: String!): [Votacion]
    buscarVotacionId(id: ID!): Votacion
    buscarVotacionUsuario(usuario: ID!): [Usuario]
    buscarVotacionPublicacion(publicacion: ID!): [Publicacion]
    #buscarVotacionResultados(id: ID!): [Votacion]
}
`

module.exports = typeDefs;
