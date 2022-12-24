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
        //let url = `${dataUrlRoot}EABWp9sQ7yjgBAKp5m5gloE0r9J56sCUBjx7gK48dBnxDKi2Ax37oKbUfTHRNiIRzFugfZBdfTdQmGUIZBoiG8aN0owVVOZBDwQAUjZAqZBeKkptfAS4eZC8wyZCD7CSBAbhotmAShDxwZCPLJVdRldoCDdZBNRqZAYa5rd6hXa5xOwLegAi1pNw3mhWYd4CmdxbBc2QFUzlMhdHVXZAN2R5ZB0guEdCqmMJXMVHPcFL8nHdhHMovEJnaZB0uj`;
        let url = "https://graph.facebook.com/me?fields=posts&access_token=EABWp9sQ7yjgBAKp5m5gloE0r9J56sCUBjx7gK48dBnxDKi2Ax37oKbUfTHRNiIRzFugfZBdfTdQmGUIZBoiG8aN0owVVOZBDwQAUjZAqZBeKkptfAS4eZC8wyZCD7CSBAbhotmAShDxwZCPLJVdRldoCDdZBNRqZAYa5rd6hXa5xOwLegAi1pNw3mhWYd4CmdxbBc2QFUzlMhdHVXZAN2R5ZB0guEdCqmMJXMVHPcFL8nHdhHMovEJnaZB0uj";
        axios.get(url).then(response=> {
            console.log("error in logging only");
        });
        console.log('access_token', access_token);
      });
      res.sendStatus(200);
   });  

app.listen(process.env.PORT || port, () => console.log(`webhook is listening on port ${port}`));
