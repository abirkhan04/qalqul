'use strict';

const { default: axios } = require('axios');

const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());
const port = 3000;  
const oauthUrl="https://graph.facebook.com/oauth/access_token?client_id=6097851830225464&client_secret=0c57fb1bf447e5c3f928237e72522469&grant_type=client_credentials";
const dataUrlRoot = "https://graph.facebook.com/me?fields=posts&access_token=";
 
  app.get('/test', function(req, res) {
     res.send({message: "This is test"});
  });

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
      axios.get(oauthUrl).then((response)=> {
         let access_token = response.data.access_token;
         let url = `${dataUrlRoot}${access_token}`;
         axios.get(url).then(response=> {
            console.log(response.data);       
         });
      });
      res.sendStatus(200);
   });  

app.listen(process.env.PORT || port, () => console.log(`webhook is listening on port ${port}`));
