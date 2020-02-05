'use strict';

var bcrypt = require('bcryptjs');
const async = require('async');
const mongoclient = require('mongodb');
// var config = require('./config.js');

var response = {
     statusCode: 404,
     headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Custom-Header'
     }
};

module.exports.handler = async (event, context) => {
     var jwt = require('jsonwebtoken');
     var token = jwt.sign({ username: 'test@example.com' }, "shasdfasdfasdf", { expiresIn: 60 * 60 });

     const response = {
          statusCode: 200,
          headers: {
               'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
               message: 'Hello World token_get',
               input: event,
               token: token
          }),
     };

     return response;
};

// exports.checkAccount = function (data, callback) {
//      if (!data || !data.event || !data.event.queryStringParameters || !data.event.queryStringParameters.password) {
//           console.log('authorization data missing');
//           data.response.statusCode = 401;
//           data.result.error = "Account not found.";
//           callback(null, data);
//      }
//      else if (data.event.queryStringParameters.email && data.event.queryStringParameters.password) {
//           console.log(bcrypt.hashSync(data.event.queryStringParameters.password, 10));
//           data.mongodb.collection('accounts').find({ account_email_lowercase: data.event.queryStringParameters.email.toLowerCase() }).toArray(function(err, docs) {
//                if (err || docs.length != 1) {
//                     console.log(err);
//                     console.log("Account not found");
//                     data.response.statusCode = 401;
//                     data.result.error = "Account not found.";
//                }
//                else {
//                     if (docs.length == 1 && bcrypt.compareSync(data.event.queryStringParameters.password, docs[0].account_password)) {
//                          console.log('request authorized for ' + docs[0].account_email);

//                          data.response.statusCode = 200;
//                          data.result = { 'user_id': 44, nickname: 'test', email: 'asdf@asdf.com', hello: 'test' };
//                          data.result.user_id = docs[0]._id;
//                          data.result.email = docs[0].account_email;
//                          data.result.nickname = docs[0].account_email;
//                     }
//                     else {
//                          data.response.statusCode = 401;
//                          data.result.error = "Not found";
//                     }
//                }
//                callback(null, data);
//           });
//      }
//      else {
//           console.log('not authorized');
//           data.response.statusCode = 401;
//           data.result.error = "Not authorized";
//           callback(null, data);
//      }
// }