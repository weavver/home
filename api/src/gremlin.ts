import { config } from 'dotenv';
import { resolve } from "path";
config({ path: resolve(__dirname, "../../.env") });

var now = require("performance-now");
import * as Gremlin from 'gremlin';

// gremlin code help reference:
// https://github.com/apache/tinkerpop/blob/master/gremlin-javascript/src/main/javascript/gremlin-javascript/test/helper.js
export class GremlinHelper {
     connectionOpenedOnce : boolean = false;

     constructor() {
     }

     async init() : Promise<void> {
          if (process.env.GREMLIN == "SASL") {
               var authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator("/dbs/" + process.env.GREMLIN_DATABASE + "/colls/" + process.env.GREMLIN_COLLECTION, process.env.GREMLIN_PRIMARYKEY || "");
               this.client = new Gremlin.driver.Client(
                    (process.env.GREMLIN_ENDPOINT || ""),
                    { 
                         authenticator,
                         traversalsource: "g",
                         rejectUnauthorized: true,
                         ssl: true,
                         // session: false,
                         mimeType : "application/vnd.gremlin-v2.0+json"
                    });
          } else {
               const serverUrl = process.env.GREMLIN_ENDPOINT || "ws://localhost:8182/gremlin";
               this.client = new Gremlin.driver.DriverRemoteConnection(serverUrl,
               { 
                    traversalsource: "g",
                    mimeType : "application/vnd.gremlin-v2.0+json"
               });
               try {
                    await this.client.open();
               }
               catch (err) {
                    console.log(err);
               }
          }
          const traversal = Gremlin.process.AnonymousTraversalSource.traversal;
          this.g = traversal().withRemote(this.client);
          this.connectionOpenedOnce = true;
     }
     client : any;
     g : Gremlin.process.GraphTraversalSource;

     public async command(command : Gremlin.process.GraphTraversal) : Promise<any> {
          var t0 = now();
          var result = await command.toList();
          var t1 = now();
          return {
               result: result,
               command_time: t1 - t0
          };
     }

     public getPropertyValue(doc: any, property_name: string, default_value: string) : string {
          if (doc && doc[property_name])
               return doc[property_name][0];
          else
               return default_value;
     }

     public async close() {
          await this.client.close();
     }
}