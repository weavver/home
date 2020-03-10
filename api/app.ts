import { app } from "./src/home-api";
import { HomeApolloServer } from "./src/graphql/home-apollo-server";
import 'reflect-metadata'

require('dotenv').config({ path: '../.env' })

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
          app.log.info("server listening on ${address}");
     });
})();