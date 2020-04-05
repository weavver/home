module.exports = {
    client: {
      service: {
        name: 'weavver-home-api',
        url: 'http://localhost:3000/graphql',
        // optional disable SSL validation check
        skipSSLValidation: true,
        include: './website/*/**.gql',
        localSchemaFile: 'schema.graphql'
      }
    }
  };