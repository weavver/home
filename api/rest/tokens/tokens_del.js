'use strict';

module.exports.handler = async (event, context) => {
     const response = {
          statusCode: 200,
          headers: {
               'Access-Control-Allow-Origin': '*'
          }
     };

     const MongoClient = require('mongodb').MongoClient;
     const connectedClient = await MongoClient.connect(process.env.MONGODB_URL);
     const mongodb = connectedClient.db(process.env.MONGODB_DATABASE);

     console.log(event.pathParameters.id);

     var data = { token: event.pathParameters.id };
     const docs = await mongodb.collection('tokens').insertOne(data);
     console.log(docs.insertedId);
     await connectedClient.close();

     return response;
};