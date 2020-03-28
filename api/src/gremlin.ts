import { config } from 'dotenv';
import { resolve } from "path";
config({ path: resolve(__dirname, "../../.env") });

var now = require("performance-now");
import * as Gremlin from 'gremlin';

export class GremlinHelper {
     constructor() {
          if (process.env.GREMLIN == "SASL") {
               var authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator("/dbs/" + process.env.GREMLIN_DATABASE + "/colls/" + process.env.GREMLIN_COLLECTION, process.env.GREMLIN_PRIMARYKEY || "");
               this._client = new Gremlin.driver.Client(
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
               const DriverRemoteConnection = Gremlin.driver.DriverRemoteConnection;
               const url = process.env.GREMLIN_ENDPOINT || "ws://localhost:8182/gremlin";
               console.log(url);
               this._client = new DriverRemoteConnection(url,
               { 
                    traversalsource: "g",
                    mimeType : "application/vnd.gremlin-v2.0+json"
               });
          }
          const traversal = Gremlin.process.AnonymousTraversalSource.traversal;
          this._g = traversal().withRemote(this.client);
     }

     private _client : any = null;

     get client() : any {
          return this._client;
     }

     private _g : Gremlin.process.GraphTraversalSource;
     get g() : Gremlin.process.GraphTraversalSource {
          return this._g;
     }

     public async command(command : Gremlin.process.GraphTraversal) : Promise<any> {
          console.log(this.client.url);

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
          return await this.client.close();
     }
}