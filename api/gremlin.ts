var now = require("performance-now");
import Gremlin = require('gremlin');

export class GremlinHelper {
     constructor() {

     }
     
     private _client : any = null;
     
     get client() : any {
          return this._client;
     }

     private _g : any = Gremlin.process.traversal().withRemote(module.exports.client);
     get g() : any {
          return this._g;
     }

     public async executeQuery(query : any) : Promise<any> {    
          if (this._client == null)
          {
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
                         }
                         );
               } else {
                    const translator = new Gremlin.process.Translator('g' as any);
                    const gremlin = require('gremlin');
                    const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
                    this._client = new DriverRemoteConnection((process.env.GREMLIN_ENDPOINT || "ws://localhost:8182/gremlin"), { traversalsource: "g" });
               }
          }

          const traversal = Gremlin.process.AnonymousTraversalSource.traversal;
          const g = traversal().withRemote(this.client);
          const translator = new Gremlin.process.Translator(g);
          let gremlinCommand = "g" + translator.translate(query.getBytecode()).substr(29);
          // console.log(gremlinCommand);

          var t0 = now();
          var result = await this.client.submit(gremlinCommand);
          var t1 = now();
          result.command_time = t1 - t0;
          return result;
     }

     public getPropertyValue(doc : any, property_name : string) : undefined {
          if (doc && doc[property_name])
               return doc[property_name][0].value;
          else
               return undefined;
     }

     public async close() {
          return await this.client.close();
     }

}