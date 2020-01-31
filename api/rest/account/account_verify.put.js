
var templates = require('../templates.js');
var jp = require('jsonpath');

var schema = require('../../schema.js');
var Ajv = require('ajv');

exports.handler =  async function (event, context) {

     const body = JSON.parse(event.body);
     console.log(body);
     

     var ajv = new Ajv({schemas: schema.models});

     var validate = ajv.getSchema('http://accounts.weavver.com/schema/account_verify.json');
     try {
          var result = await validate(body);
          console.log(result);

          var searchData = { 'email': body.email, 'verification_code': parseInt(body.code) };
          console.log(searchData);

          const MongoClient = require('mongodb').MongoClient;
          console.log(process.env.MONGODB_URL);
          const connectedClient = await MongoClient.connect(process.env.MONGODB_URL);
          const mongodb = connectedClient.db(process.env.MONGODB_DATABASE);

          var result = await mongodb.collection("accounts").findOne(searchData);
          console.log(result);
          
          if (result == null) {
               connectedClient.close();
               return { status_code: 422 };
          }


          return { status_code: 422 };
     }
     catch (err) {
          console.log(err);
     }
};