module.exports = {
     /**
      * Application configuration section
      * http://pm2.keymetrics.io/docs/usage/application-declaration/
      */
     apps: [
          {
               name: 'website',
               script: 'npm',
               cwd: './website',
               watch: false,
               args: 'run start'
          },
          {
               name: 'api',
               script: 'npm',
               cwd: './api',
               instances: 1,
               watch: true,
               // env: {
               //      COMMON_VARIABLE: 'true'
               // },
               // env_production: {
               //      NODE_ENV: 'dev'
               // },
               args: 'run watch'
          }
     ]
};