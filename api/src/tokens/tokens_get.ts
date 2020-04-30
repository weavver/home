import { API } from "../api";
import { RouteEvent, BaseRoute } from "../baseroute";
import { HTTPResponseType } from '../common/http-response-type';

var ms = require('ms');
var cookie = require('cookie');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var moment = require("moment");

export class TokensGetRoute extends BaseRoute {
     constructor(api : API) {
          super(api, "GET", "/tokens");
     }

     public async handler(event : RouteEvent) : Promise<void> {
          var date = new Date();
          date.setTime(+date + (1 * 86400000));

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

          if (!event.request.query || !event.request.query.email)
               throw new Error("no query string parameters");

          var token = null;
          try {
               var qGetIdentity : any = this.api.gremlin.g.V()
                    .hasLabel('identity')
                    // .has('cid', '0')
                    .has('email', event.request.query.email.toLowerCase())
                    .valueMap(true);

               var cmdResponse = await this.api.gremlin.command(qGetIdentity);

               if (!(cmdResponse.result.length > 0)) {
                    throw new Error("Identity not found.");
               }

               var doc = cmdResponse.result[0];
               // var passwordhashed = bcrypt.hashSync(query.password); // doc.password_hash[0]);
               if (bcrypt.compareSync(event.request.query.password, doc.password_hash[0]))
               {
                    // console.log("it matches...");
                    response.statusCode = 200;
                    var token_data = {
                         sub: doc.id,
                         // name: "not implemented",
                         email: event.request.query.email // to remove later
                    };

                    response.cookieToken = jwt.sign(token_data,
                                                    process.env.COOKIE_JWT_SIGNING_SECRET,
                                                    { expiresIn: ms('30 days') });
                    response.body = cmdResponse.command_time;

                    var x = jwt.verify(response.cookieToken, process.env.COOKIE_JWT_SIGNING_SECRET);
               }
               else {
                    // passwords do not match
                    response.statusCode = 401;
                    response.cookieToken = null;
                    response.body = "";
               }
          }
          catch (err) {
               response.statusCode = 500;
               response.cookieToken = null;
               console.log(err);
          }

          if (response.cookieToken) {
               event.reply.code(response.statusCode)
                    .setCookie("SessionToken", response.cookieToken, response.cookieOptions)
                    .send(response.body);
          } else {
               event.reply.code(response.statusCode)
                    .clearCookie("SessionToken", response.cookieOptions)
                    .send(response.body);
          }
     }
}