'use strict';
const uuidv4 = require('uuid/v4');
var gremlin = require('../../gremlin.js');

module.exports.handler = async (event, context) => {
     const response = {
          statusCode: 500,
          headers: {
               "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
               'Access-Control-Allow-Origin': event.headers.origin,
               'Access-Control-Allow-Credentials': "true",
               'Set-Cookie': 'SessionToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          },
          body: ""
     };

     try {
          console.log("storing deleted token to database...");
          var queryAddIdentity = gremlin.g.addV("tokens")
                    .property('cid', "0")
                    .property('id', "tokens_" + uuidv4())
                    .property('token', event.pathParameters.id)
                    .property('expired', true);
          var result = await gremlin.executeQuery(queryAddIdentity);
          console.log("completed..");
          console.log(result);
          response.statusCode = 200;
          await gremlin.close();
     }
     catch (err) {
          console.log("error...");
          console.log(err);
     }
     return response;
};