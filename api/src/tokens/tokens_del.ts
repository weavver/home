import { API } from "../api";
import { RouteEvent, BaseRoute } from "../baseroute";
import { HTTPResponseType } from '../common/http-response-type';

const uuidv4 = require('uuid/v4');

export class TokensDelRoute extends BaseRoute {
     constructor(api : API) {
          super(api, "DELETE", "/tokens");
     }

     public async handler(event : RouteEvent) : Promise<void> {
          // console.log("deleting token..");

          var response : HTTPResponseType = {
               statusCode: 500,
               body: "internal service error",
               cookieOptions: {
                         "domain": process.env.COOKIE_DOMAIN,
                         "path": process.env.COOKIE_PATH,
                         // "expires": date,
                         "HttpOnly": true,
                         "Secure": true,
                         "sameSite": "lax"
                    }
          };

          // console.log("storing deleted token to blacklist...");
          // var queryAddIdentity = gremlin.g.addV("tokens")
          //           .property('cid', "0")
          //           .property('id', "tokens_" + uuidv4())
          //           .property('token', event.pathParameters.id)
          //           .property('expired', true);
          // var result = await gremlin.executeQuery(queryAddIdentity);
          // console.log("completed..");
          // console.log(result);
          // await gremlin.close();
          response.statusCode = 200;
          response.body = "";

          event.reply.code(response.statusCode)
               .clearCookie("SessionToken", response.cookieOptions)
               .send(response.body);
     }
}