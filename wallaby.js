module.exports = function (wallaby) {
     return {
          files: [
                    { pattern: 'api/node_modules/dotenv/**', instrument: false},
                    { pattern: '.env.example', instrument: false},
                    { pattern: '.env', instrument: false},
                    'api/schema.ts',
                    'api/certificates/server.cert',
                    'api/certificates/server.key',
                    'api/*.ts',
                    'api/src/*.ts',
                    'api/src/**/*.ts',
                    'api/src/**/*.hbs',
                    { pattern: 'api/src/**/*test.ts', ignore: true }
               ],
               tests: [
                    'api/src/**/*test.ts'
               ],
               env: {
                    kind: 'chrome',
                    type: 'node'
               },
               compilers: {
                    '**/*.ts': wallaby.compilers.typeScript({
                      /* TypeScript compiler specific options
                       * https://github.com/Microsoft/TypeScript/wiki/Compiler-Options
                       * (no need to duplicate tsconfig.json, if you have it, it will be automatically used) */
                    })
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