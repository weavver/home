'use strict';

module.exports.handler = async (event, context) => {
     var redirect_url = "https://" + process.env.WEBSITE_DOMAIN;
     if (event.queryStringParameters.redirect_url) {
          redirect_url = event.queryStringParameters.redirect_url;
     }
     const response = {
          statusCode: 307,
          headers: {
               "Set-Cookie": "SessionToken=deleted;domain=" + process.env.COOKIE_DOMAIN + ";path=/" + process.env.API_VERSION + ";expires=Thu, 01 Jan 1970 00:00:00 GMT",
               Location: redirect_url
          },
          body: "Redirecting.. to https://" + redirect_url
     };

     // invalidate that token
     // const MongoClient = require('mongodb').MongoClient;
     // const connectedClient = await MongoClient.connect(process.env.MONGODB_URL);
     // const mongodb = connectedClient.db(process.env.MONGODB_DATABASE);

     // console.log(event.pathParameters.id);

     // var data = { token: event.pathParameters.id };
     // const docs = await mongodb.collection('tokens').insertOne(data);
     // console.log(docs.insertedId);
     // await connectedClient.close();

     return response;
}