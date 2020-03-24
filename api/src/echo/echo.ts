import { GremlinHelper } from '../../gremlin';
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { HTTPResponseType } from '../common/http-response-type';
import * as fastifyCookie from "fastify-cookie";
import * as fastify from 'fastify'
import { Http2SecureServer } from 'http2';

var now = require("performance-now");

let gremlin = new GremlinHelper();

export class EchoRoute {
     counter : any = 0;

     constructor(app : fastify.FastifyInstance | null, opts : any | null) {
          if (app) {
               app.get('/echo', opts, async (request, reply) => {
                    var cookieVal = Math.random().toString(36).substring(7); // Generate a random cookie string
                    cookieVal = (Math.round(Math.random()) == 1) ? "true" : cookieVal = "false";
          
                    let result = await this.handler(null);
                    reply.code(result.statusCode)
                         .header("Content-Type", "application/json; charset=utf-8")
                         .setCookie("ExampleCookie", cookieVal, result.cookieOptions)
                         .send(result.body);
               });
          }
     }

     public async handler(event : any) {
          var date = new Date();
          date.setTime(+date + (1 * 86400000)); // Get Unix milliseconds at current time plus 1 days: 24 \* 60 \* 60 \* 100

          var response : HTTPResponseType = {
               statusCode: 500,
               body: "internal service error",
               cookieOptions: {
                         "domain": process.env.COOKIE_DOMAIN,
                         "path": process.env.COOKIE_PATH,
                         "expires": date,
                         "HttpOnly": true,
                         "Secure": true,
                         "sameSite": "lax"
                    }
          };

          // var qCreate = gremlin.g.addV("identity")
          //                .property("cid", 0)
          //                .property("email", "is_in_use@example.com")
          //                .property("password_hash", "asdf");

          // var result2 = await gremlin.command(qCreate); 

          var query = gremlin.g.V().limit(5).valueMap(true);
          var result = await gremlin.command(query); 
          response.statusCode = 200;
          response.body = {
                    message: 'Hello World ' + this.counter,
                    result: result,
                    command_time: result.command_time,
                    input: event
               };
          this.counter = this.counter + 1;
          return response;
     };
}