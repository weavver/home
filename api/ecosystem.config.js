module.exports = {
/**
 * Application configuration section
 * http://pm2.keymetrics.io/docs/usage/application-declaration/
 */
apps: [{
     name: 'weavver-home-api',
     script: 'npm',
     watch: true,
     env: {
          COMMON_VARIABLE: 'true'
     },
     env_production: {
          NODE_ENV: 'dev'
     },
     args: 'run local',
}],
};