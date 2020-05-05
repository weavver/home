require('dotenv-safe').config({ example: '.env.default', path: './.env' })
import 'reflect-metadata';
import { API } from "./api/src/api";

import fs from 'fs';
import path from 'path';

(async function () {
     console.log("######################");
     console.log("weavver home server starting...");

     let api = new API(true);
     try {
          console.log("initializing api...");
          await api.init();
     }
     catch (err) {
          console.log(err);
     }
     
     // use a more local path with dockerfile and distributions
     let public_root = path.join(__dirname, "/website");
     if (fs.existsSync(path.join(__dirname, "/website/dist"))) {
          // use this while running a folder with our git repository
          public_root = path.join(__dirname, "/website/dist");
     }
     console.log("sharing public folder...", public_root);
     api.app.register(require('fastify-static'), {
          root: public_root,
          prefix: '/',
          wildcard: false
     });

     function serveIndex(req : any, reply : any) {
          var API_URL : string = "https://" + req.hostname;
          if (process.env.API_DOMAIN) {
               API_URL = "https://" + process.env.API_DOMAIN as string;
          }
          fs.readFile(path.join(public_root, "index.html"), "utf8", function(err, data) {
               var html = data.replace("$api_url", API_URL);
               reply.status(200).type("text/html").send(html);
          });;
     }

     api.app.get("/*", serveIndex);

     api.app.addHook('onSend', function (req, reply, payload, next) {
          if (payload.filename && payload.filename.indexOf("index.html") > -1) {
               var API_URL : string = "https://" + req.hostname;
               if (process.env.API_DOMAIN) {
                    API_URL = "https://" + process.env.API_DOMAIN as string;
               }
               fs.readFile(path.join(public_root, "index.html"), "utf8", function(err, data) {
                    var err2 = undefined;
                    var html = data.replace("$api_url", API_URL);
                    next(err2, html);
               });
          } else {
               next();
          }
     });

     var port = process.env.PORT || 4444;
     var server = api.app.listen(port as number, "0.0.0.0", (err : any, address : any) => {
          if (err) {
               console.log(err);
               api.app.log.error(err)
               process.exit(1)
          }
          console.log("starting... " + address);
          api.app.log.info("weavver-home server listening on ${address}");
     });

     process.once('SIGUSR2', async () => {
          if (!api.gremlin.connectionOpenedOnce) {
               console.log("graph database did not connect, application exiting unexpectedly..");
          }
          let x = await api.gremlin.close();
          console.log("weavver-home exiting gracefully...");
          process.exit();
     });
})();