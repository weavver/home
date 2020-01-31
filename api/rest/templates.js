
module.exports.renderTemplate = async (path, data) => {
     var fs = require('fs');
     const file = await fs.readFileSync(__dirname + '/' + path + '.hbs', 'utf8');

     var handlebars = require('handlebars');
     var template = handlebars.compile(file);
     var outputString = template(data);
     return outputString;
}

