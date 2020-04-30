import { HTTPInjectResponse, HTTPInjectOptions } from 'fastify';

import { API } from "../api";

// TODO: Add testing over HTTP/HTTPS
export class TestHelper {
     api : API;

     constructor() {
          this.api = new API();
     }

     public async init() : Promise<void> {
          await this.api.init();
     }

     public async getData(request : HTTPInjectOptions) : Promise<HTTPInjectResponse> {
          const response : HTTPInjectResponse = await this.api.app.inject(request);
          // console.log(response.rawPayload);

          return response;

          // return {
          //      statusCode: response.statusCode,
          //      headers: response.headers,
          //      body: JSON.parse(response.payload)
          // };

          // const nock = require('nock');
          // const scope = nock("https://localhost")
          //      .get(path)
          //      .reply(200, {
          //                test: "abc1234" 
          //      });

          // const bent = require('bent');
          // const getStream = bent('https://localhost');

          // let obj = await getStream(path);

          // console.log(obj.status);

          // const data = await stream.json();
          // nock.enableNetConnect();
          // return obj;
     }

     public async dispose() {
          await this.api.dispose();
     }
}