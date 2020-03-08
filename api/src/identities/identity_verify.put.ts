import { APIGatewayProxyEvent, Context } from "aws-lambda";
var templates = require('../templates.js');
var jp = require('jsonpath');

var schema = require('../../schema.js');
var Ajv = require('ajv');

import { GremlinHelper } from '../../gremlin';

export const handler = async function (event : APIGatewayProxyEvent, context : Context) {
     const body = JSON.parse(event.body || '{}');
     console.log(body);

     var ajv = new Ajv({schemas: schema.models});

     var validate = ajv.getSchema('http://home.weavver.com/schema/identityVerify.json');

     let gremlin = new GremlinHelper();
     try {
          var result = await validate(body);
          console.log(result);

          var searchData = { 'email': body.email, 'verification_code': parseInt(body.code) };
          console.log(searchData);

          var qIdentityVerify = gremlin.g.V()
               .has('label','identity')
               .has('cid', '0')
               .has('email', body.email)
               .has('verification_code', body.code);

          var result = await gremlin.executeQuery(qIdentityVerify);
          console.log(result);
          await gremlin.close();
          
          
          if (result.length > 0) {
               await gremlin.close();
               return { status_code: 422 };
          }

          return { status_code: 422 };
     }
     catch (err) {
          console.log(err);
          throw Error(err);
     }
};