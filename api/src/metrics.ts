import { GremlinHelper } from './gremlin';
import * as fastify from 'fastify';

const metricsPlugin : any = require('fastify-metrics');

export class TokensGetRoute {

     constructor(app : fastify.FastifyInstance | null, opts : any | null, public gremlin : GremlinHelper) {

          var Register = require('prom-client').register;  
          var Counter = require('prom-client').Counter;  
          var Histogram = require('prom-client').Histogram;  
          var Summary = require('prom-client').Summary;  
     }
     // app.register(metricsPlugin, {endpoint: '/metrics'});

     
     // const summary = new Summary({
     //      name: 'request_duration_echo',
     //      help: 'metric_help',
     //      maxAgeSeconds: 5
     // });

     // app.addHook('onRequest', (request, reply, done) => {
     //      // console.log('a');
     //      if (request.req.url == "/")
     //           request.raw.end = now();
     //           // request.raw.end = summary.startTimer();
     //      // c.inc({ url: request.req.url, code: 200 });
     //      done()
     // })

     // app.addHook('onResponse', (request, reply, done) => {
     //      // console.log(request.raw.ctx);
     //      done();
     //      // if (request.raw.end)
     //      //      summary.observe(now() - request.raw.end);
     //           // request.raw.end();
     //      // console.log('c');
     // });

     // app.get('/metrics', (req, res) => {
     //      res.header('Content-Type', Register.contentType);
     //      res.send(Register.metrics());
     // });


}