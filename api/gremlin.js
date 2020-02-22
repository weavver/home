
const Gremlin = require('gremlin');

const translator = new Gremlin.process.Translator('g');
const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator("/dbs/" + process.env.GREMLIN_DATABASE + "/colls/" + process.env.GREMLIN_COLLECTION, process.env.GREMLIN_PRIMARYKEY);

module.exports.client = new Gremlin.driver.Client(
     process.env.GREMLIN_ENDPOINT, 
     { 
          authenticator,
          traversalsource: "g",
          rejectUnauthorized: true,
          ssl: true,
          // session: false,
          mimeType : "application/vnd.gremlin-v2.0+json"
     }
);

module.exports.g = Gremlin.process.traversal().withRemote(module.exports.client);

module.exports.executeQuery = async function (query) {
     var result = await module.exports.client.submit(translator.translate(query.getBytecode()));
     return result;
}

module.exports.close = async function(query) {
     return await this.client.close();
}