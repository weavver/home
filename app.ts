require('dotenv-safe').config({ example: '.env.example', path: './.env' })
import 'reflect-metadata';
import { API } from "./api/src/api";

import fs from 'fs';
import path from 'path';

(async function () {
     console.log("weavver home server starting...");
     console.log(__dirname);

     let api = new API();
     api.app.register(require('fastify-static'), {
          root: path.join(__dirname + "/website/dist"),
          prefix: '/',
          wildcard: false
     });

     api.app.get("/*", function (req, reply) {
          const stream = fs.createReadStream('./website/dist/index.html');
          reply.status(200).type("text/html").send(stream);
     });

     var port = process.env.PORT || 3000;
     var server = api.app.listen(port as number, "0.0.0.0", (err : any, address : any) => {
          if (err) {
               console.log(err);
               api.app.log.error(err)
               process.exit(1)
          }
          console.log("starting... " + address);
          api.app.log.info("weavver-home server listening on ${address}");
     });
})();