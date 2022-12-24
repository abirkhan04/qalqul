'use strict';
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());
const port = 3000;  


  app.get(['/facebook', '/instagram'], function(req, res) {
    if (
        req.param('hub.mode') == 'subscribe' &&
        req.param('hub.verify_token') == 'token'
    ) {
       res.send(req.param('hub.challenge'));
    } else {
       res.sendStatus(400);
    }
   });
   
   app.post('/facebook', function(req, res) {
      console.log('Facebook request body:');
      console.log(JSON.stringify(req.body))
      console.log('Facebook request body end:'); 
      res.sendStatus(200);
   });  



app.listen(process.env.PORT || port, () => console.log(`webhook is listening on port ${port}`));
