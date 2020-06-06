import { Injectable } from '@angular/core';

@Injectable({
     providedIn: 'root'
})
export class ConfigService {
     // The values that are defined here are the default values that can
     // be overridden by env.js

     // API url
     public api_url = 'not_set';

     // Whether or not to enable debug mode
     public enableDebug = true;

     constructor() {
     }
}