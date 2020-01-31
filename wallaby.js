module.exports = () => {
     return {
          files: [
                    { pattern: 'api/node_modules/dotenv/**', instrument: false},
                    { pattern: '.env.example', instrument: false},
                    { pattern: '.env', instrument: false},
                    'api/schema.js',
                    'api/rest/*.js',
                    'api/rest/**/*.js',
                    'api/rest/**/*.hbs',
                    { pattern: 'api/rest/**/*test.js', ignore: true }
               ],
               tests: [
                    'api/rest/**/*test.js'
               ],
               env: {
                    kind: 'chrome',
                    type: 'node'
               },
               debug: true,
               setup: function(wallaby) {
                    var path = require('path');
                    var dotenv_path = path.join(wallaby.localProjectDir, 'api', 'node_modules', 'dotenv');
                    require(dotenv_path).config('../../.env');;

                    var mocha = wallaby.testFramework;
                    mocha.timeout(10000);
               },
               // delays: {
               //      run: 750
               // }
               workers: {
               //   initial: 1,
               //   regular: 1
                    restart: true
               }
     }
};