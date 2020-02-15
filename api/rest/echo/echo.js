'use strict';

var cookiehandler = require('../helper_cookiehandler.js');

module.exports.handler = async (event, context) => {
     var date = new Date();
     date.setTime(+date + (1 * 86400000)); // Get Unix milliseconds at current time plus 1 days: 24 \* 60 \* 60 \* 100
     var cookieVal = Math.random().toString(36).substring(7); // Generate a random cookie string

     if (Math.round(Math.random()) == 1) {
          cookieVal = "true";
     }
     else {
          cookieVal = "false";
     }

     var cookieString = "ExampleCookie=" + cookieVal + ";domain=" + process.env.WEBSITE_DOMAIN + "; expires=" + date.toGMTString() + ";";
     const response = {
          statusCode: 200,
          headers: {
               'Access-Control-Allow-Origin': '*', // Required for CORS support to work,
               'Set-Cookie': cookieString
          },
          body: JSON.stringify({
               message: 'Hello World',
               input: event,
          })
     };

     return response;
};