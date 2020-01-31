
var assert = require('chai').assert;

const bcrypt = require('bcryptjs');
const async = require('async');

var response = {
     statusCode: 404,
     headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Custom-Header'
     }
};

// this will be called after the file is read
function renderToString(source, data) {
     var handlebars = require('handlebars');
     var template = handlebars.compile(source);
     var outputString = template(data);
     return outputString;
   }

module.exports.handler = async function (event, context, callback) {
     
     const body = JSON.parse(event.body);
     var schema = require('../../schema.js');
     var Ajv = require('ajv');
     var ajv = new Ajv({schemas: schema.models});

     var code = Math.floor(100000 + Math.random() * 900000);
     console.log(code);

     var fs = require('fs');

     var fooJson = { code: code }; // require('path/to/foo.json');

     const file = await fs.readFileSync(__dirname + '/password_reset.hbs', 'utf8');

     var compiled_body = renderToString(file, fooJson);
     console.log(body);

     var validate = ajv.getSchema('http://accounts.weavver.com/schema/accountPasswordReset.json');
     try {
          
          var result = await validate(body);
          console.log(result);
          console.log(validate);
          console.log(body);
     }
     catch (err) {
          console.log("error validating email...");
          console.log(err);
          assert.fail(err);
     }
}