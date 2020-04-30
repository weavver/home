const argv = require('yargs').usage(
          'Usage: --drop'
     )
     .describe('all', "list all graph nodes")
     .describe('center-add', "add a default center")
     .describe('identity-add', "add a default identity")
     .describe('drop', "drop all data in graph [ DANGEROUS!!! ]")
     .argv;

const bcrypt = require('bcryptjs');
const readline = require('readline');

import { GremlinHelper } from './src/gremlin';

function prettyJSON(obj : any) {
     console.log(JSON.stringify(obj, null, 2));
 }

(async function () {
     let gremlin = new GremlinHelper();
     await gremlin.init();
     let counter = 0;

     if (argv.drop) {
          console.log("dropping all data..");
          await gremlin.g.V().drop().toList();
          await gremlin.close();
          process.exit();
     }

     if (argv["center-add"]) {
          var addCenterVertex = await gremlin.g.addV("center")
               .property("cid", 0)
               .property("name", "Home")
               .toList();
          prettyJSON(addCenterVertex);
     };

     if (argv["identity-add"]) {
          var addCenterVertex = await gremlin.g.addV("identity")
               .property("cid", 0)
               .property("email", "is_in_use@example.com")
               .property("password_hash", bcrypt.hashSync("asdfasdf1234"))
               .toList();
          prettyJSON(addCenterVertex);
     };

     if (argv["count"]) {
          var centerVertexCount = gremlin.g.V().hasLabel('center').count();
          var result = await gremlin.command(centerVertexCount);
          prettyJSON(result);
     }

     if (argv["vertex"]) {
          var vertex = await gremlin.g.V(argv["vertex"])
                         .valueMap(true).toList() as any;

          prettyJSON(vertex[0]);
     }

     if (argv["all"]) {
          var all = await gremlin.g.V()
                    .hasLabel("identity")
                    .valueMap(true).toList() as any;

          prettyJSON(all);
     }
     process.exit();
})();

const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
     });

function askQuestion(q:any){
     var response:any;
     rl.setPrompt(q);
     rl.prompt();

     return new Promise(( resolve , reject) => {
          rl.on('line', (userInput:any) => {
               response = userInput;
               rl.close();
          });

          rl.on('close', () => {
               resolve(response);
          });
     });
};
