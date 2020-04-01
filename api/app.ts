require('dotenv').config({ path: '../.env' })
import 'reflect-metadata';
import { app } from "./src/home-api";

console.log("weavver home server starting..");

(async function () {
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

process.once('SIGUSR2', () => {
     app.close(() => {
          console.log("weavver-home-api exiting gracefully...");
          process.exit();
     });
});