import { HTTPResponseType } from '../common/http-response-type';

import { API } from '../api';
import { BaseRoute, RouteEvent } from '../baseroute';

var now = require("performance-now");

export class EchoRoute extends BaseRoute {
     counter : number = 0;

     constructor(api : API) {
          super(api, "GET", "/echo");
     }

     public async handler(event : RouteEvent) {
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

          // return response;
          var query = this.api.gremlin.g.V().limit(5).valueMap(true);
          var result = await this.api.gremlin.command(query);
          response.statusCode = 200;
          response.body = {
                    message: 'Hello World: We are online!',
                    counter: this.counter,
                    result: result,
                    command_time: result.command_time,
                    input: {
                         query: event.request.query,
                         body: event.request.body
                    }
               };
          this.counter = this.counter + 1;

          var cookieVal = Math.random().toString(36).substring(7); // Generate a random cookie string
          cookieVal = (Math.round(Math.random()) == 1) ? "true" : cookieVal = "false";

          event.reply.code(response.statusCode)
               .header("Content-Type", "application/json; charset=utf-8")
               .setCookie("ExampleCookie", cookieVal, response.cookieOptions)
               .send(response.body);
     }
}