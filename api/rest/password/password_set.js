var bcrypt = require('bcryptjs');

var templates = require('../templates.js');

var response = {
     statusCode: 200,
     headers: {
          'Access-Control-Allow-Origin': '*'
     }
};

exports.handler =  async function (event, context) {
     console.log(event);

     const body = JSON.parse(event.body);
     console.log(body);

     try {
          const MongoClient = require('mongodb').MongoClient;
          const connectedClient = await MongoClient.connect(process.env.MONGODB_URL);
          const mongodb = connectedClient.db(process.env.MONGODB_DATABASE);

          // body.verification = { email : { code: Math.floor((Math.random() * 100000) + 100000) } };

          const doc = await mongodb.collection('identities').findOne({ "email": body.email });
          if (process.env.DEBUG) console.log(doc);
          var setdata = {
               $set: {
                    password: bcrypt.hashSync(body.password_new, 10)
               }
          };
          console.log(setdata);
          var update_result = await mongodb.collection("identities").updateOne({ "_id" : doc._id }, setdata);
          await connectedClient.close();

          if (process.env.DEBUG) console.log(update_result);
          if (update_result.modifiedCount == 1) {
               response.statusCode = 200;
               response.body = { message: "Updated" };
          }
          else {
               response.statusCode = 404;
               response.body = { message: "Not found" };
               return response;
          }
     }
     catch (err) {
          console.log(err);

          response.statusCode = 500;
          return response;
     }
     
     // email notify that password changed

     const sgMail = require('@sendgrid/mail');
     sgMail.setApiKey(process.env.SENDGRID_KEY);

     const msg = {
          to: body.email,
          from: 'noreply@weavver.com',
          subject: 'Password Reset',
          text: 'An email client compatible with HTML emails is required.',
          html: await templates.renderTemplate("/password/password_changed")
     };
     try {
          var sendGridResult = await sgMail.send(msg);
          response.statusCode = 200;
          return response;
     }
     catch (err) {
          console.log(err);
          response.statusCode = 422;
          response.body = JSON.stringify({message: "FAIL", err: err });
          return response;
     }

     return response;
}

//      if (!req.body.password_current || !req.body.password_new) {
//          res.status(404).send({message: "Data required"});
//          return;
//      }
//      if (req.body.password_new.length < 6) {
//          res.status(404).send({message: "New password too short"});
//          return;
//      }
//      // console.log(bcrypt.hashSync(req.body.password_new));
//      mongodb.collection("identities").findOne({ '_id': req.session.account.id },
//          function (err, doc) {
//              // console.log(doc);
//              if (doc && bcrypt.compareSync(req.body.password_current, doc.account_password)) {
//                  var setdata = {
//                      $set: {
//                          account_password: bcrypt.hashSync(req.body.password_new, 10)
//                      }
//                  };
//                  mongodb.collection('identities')
//                      .updateOne({ _id : req.session.account.id }, setdata, function(err, r) {
//                          console.log(r.modifiedCount);
//                          if (err) {
//                               console.log(err);
//                               res.status(404).send({message: "Not found"});
//                          }
//                          else {
//                               if (r.modifiedCount == 1) {
//                                  res.status(200).send({message: "Saved!"});
//                               }
//                               else {
//                                  res.status(404).send({message: "Not found"});
//                               }
//                          }
//                     });
//              } else {
//                  res.status(404).send({message: "Not found"});
//              }
//          });
// }

