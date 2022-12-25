const https=require("https");
const constants = require('./constants');
const { default: axios } = require('axios');
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());
const port = 3000;
const user_access_token="EABWp9sQ7yjgBANpVpf2PngDYIZBGGr6kkoBmubGN1STZCDImnbtjtul9HiQmd0TcRuY6tsAaD3OTtuheZAQ6UnYZBD1crOJekPjrwz2866BlgFjt4JBlf7Q7spU7iHZACf6wZA9ZCZBiQTkZAeUrs6Nlhi5uVxJ9Gb1oB0tirDvJ6v7JTa7jKB9SyLOVFWh8Px86xH5PrqE81jEaVZAZCMZAOINq2B4oZAR8OfnHzxOzi6HHT3GsOhTdVkWsk";   
const oauthUrl="https://graph.facebook.com/oauth/access_token?client_id=6097851830225464&client_secret=0c57fb1bf447e5c3f928237e72522469&grant_type=client_credentials";
const dataUrlRoot = "https://graph.facebook.com/me?fields=posts&access_token=";
const postUrl = `https://graph.facebook.com/me?fields=posts&access_token=${user_access_token}`;
const urlRoot = "https://graph.facebook.com/";

var posts=[];

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
      console.log('Facebook request body start:');
      console.log(JSON.stringify(req.body));
      let changedFields = req.body.entry[0].changed_fields;
      console.log('Facebook request body end:'); 
      if(changedFields[0]===constants.STATUS||changedFields[0]===constants.FEED) axios.get(oauthUrl).then((response)=> {
        // let access_token = response.data.access_token;
        https.get(postUrl, (resp) => {
         let data = '';
         resp.on('data', (chunk) => {
           data += chunk;
         });
         resp.on('end', () => {
            console.log("posts", JSON.parse(data));
           posts=JSON.parse(data).posts.data;
           posts.forEach((post)=> {
               let data ='';
               https.get(`${urlRoot}${post.id}/comments?access_token=${user_access_token}`, (resp)=> {
                  resp.on('data', (chunk) => {
                     data += chunk;
                  });
                  resp.on("end", ()=> {
                        post.comments = JSON.parse(data).data;
                  }); 
                 }).on("error", (err)=> {
                  console.log("Error: "+ err.message);
               });
           });
         });
       }).on("error", (err) => {
         console.log("Error: " + err.message);
       });
      });
      res.sendStatus(200);
   });

   app.get('/posts', function(req, res){
      res.send(posts);
   });

   app.post('/access-token', function(req, res){
      user_access_token=req.accessToken;
      res.send({message: "access token updated"});
   });

app.listen(process.env.PORT || port, () => console.log(`webhook is listening on port ${port}`));
