require('dotenv').config({ path: '../.env' })
import 'reflect-metadata';
import { app } from "./api/src/home-api";

import fs from 'fs';
import path from 'path';

console.log("weavver home server starting...");

// extend fastify typings
// export interface FastifyReply extends FastifyReply {
//      sendFile(filename: string): FastifyReply<HttpResponse>;
// }

(async function () {
     app.register(require('fastify-static'), {
          root: path.join(__dirname + "/website/dist"),
          prefix: '/'
     });
     console.log(__dirname);

     app.get("/", function (req, reply) {
          const stream = fs.createReadStream('./website/dist/index.html');
          reply.status(200).type("text/html").send(stream);
     });

     var port = process.env.PORT || 3000;

     var server = app.listen(port as number, "0.0.0.0", (err : any, address : any) => {
          if (err) {
               console.log(err);
               app.log.error(err)
               process.exit(1)
          }
          console.log("starting... " + address);
          app.log.info("weavver-home server listening on ${address}");
     });
})();