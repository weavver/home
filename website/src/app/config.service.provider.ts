import { ConfigService } from './config.service';

export const ConfigServiceFactory = () => {  
     const env = new ConfigService();

     const browserWindow = window || {};
     const browserWindowEnv = browserWindow['__env'] || {};

     for (const key in browserWindowEnv) {
          if (browserWindowEnv.hasOwnProperty(key)) {
               env[key] = window['__env'][key];
          }
     }

     // var api_url = "$api_url";
     // if (api_url == "$api_url") {
     //      alert("$api_url is not set");
     // }

     return env;
};

export const ConfigServiceProvider = {  
     provide: ConfigService,
     useFactory: ConfigServiceFactory,
     deps: [],
};