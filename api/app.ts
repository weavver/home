require('dotenv').config({ path: '../.env' })
import 'reflect-metadata';
import { API } from "./src/api";

(async function () {
     const process = require('process');

     console.log("weavver home server starting..");
     let api = new API();
     
     try {
          await api.init();
     }
     catch (err) {
          console.log(err);
     }
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

     process.once('SIGUSR2', async () => {
          if (!api.gremlin.connectionOpenedOnce) {
               console.log("gremlin did not connect, application exiting unexpectedly..");
          }
          let x = await api.gremlin.close();
          console.log("weavver-home-api exiting gracefully...");
          process.exit();
     });
})();