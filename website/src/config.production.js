(function (window) {
     window.__env = window.__env || {};

     // set this through a deployment process or use app.ts to host this file
     window.__env.api_url = 'https://localhost/api';

     // Whether or not to enable debug mode
     // Setting this to false will disable console output
     window.__env.enableDebug = true;
}(this));