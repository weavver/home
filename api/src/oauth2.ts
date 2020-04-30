import { HTTPResponseType } from './common/http-response-type';
// import * as fastifyCookie from "fastify-cookie";
// import * as fastify from 'fastify'
// import { Http2SecureServer } from 'http2';
import { API } from './api';
import { BaseRoute, RouteEvent } from './baseroute';

var now = require("performance-now");

export class EchoRoute extends BaseRoute {
     counter : any = 0;

     constructor(api : API) {
          super(api, "POST", "/flow/oauth2/token");
     }

     // TODO: add brute force protection
     async handler(event : RouteEvent) {
          // console.log(request.body);

          // var jwt = require('jsonwebtoken');
          // export interface jwt_access_token {
          //      iss: string,
          //      azp: string, // client_id
          //      aud: string, // client_id
          //      sub: string,
          //      hd: string,
          //      email: string,
          //      email_verified: boolean,
          //      at_hash: string,
          //      name: string,
          //      picture: string,
          //      given_name: string,
          //      family_name: string,
          //      locale: string,
          //      iat?: number,
          //      exp?: number
          // }
          

          // // var data : {} = {
          // //           grant_type: request.body.grant_type,
          // //           redirect_uri: request.body.redirect_uri,
          // //           client_id: request.body.client_id,
          // //           client_secret: request.body.client_secret,
          // //           code: request.body.code
          // //      };
          
          // console.log("getting access token");

          // var data : jwt_access_token = {
          //      iss: process.env.WEBSITE_DOMAIN as string,
          //      sub: "0",
          //      azp: "temp_client_id",
          //      aud: "temp_client_id",
          //      hd: "",
          //      email: "test@example.com",
          //      email_verified: true,
          //      at_hash: "not implemented",
          //      name: "First Last",
          //      picture : "",
          //      given_name: "Last",
          //      family_name: "First",
          //      locale: "en",
          // };
          // var token = jwt.sign(data, process.env.COOKIE_JWT_SIGNING_SECRET);
          // var response = { access_token: 'temporary_access_token', refresh_token: 'temporary_refresh_token', id_token: token };
          // reply.code(200).type('application/json').send(response);
          // // reply.code(404);
     }
}