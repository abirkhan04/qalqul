const https=require("https");
const constants = require('./constants');
const { default: axios } = require('axios');
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());
const port = 3000;
const user_access_token="EABWp9sQ7yjgBAKZBOUbRdZAKeMLX7xj0GpYcoMA87KZCwFQahEzkJSD4uYIVCXAempoo0ZCSuIGgOiwN1Y98JoZB2zPlPcbkBahAwHBszdijZB171ZBeSgcfnq1QZB7GfOZBi7E8JBGZADF2V2Yb5xydyL9OXHSrw8etyOLrNcyiH8ealT4Gi2rDQNnQ9Lfh06xmDHuAFTkhfSzc8VAQSUrvUVqSZAyqiZBohOZCTjoJwzVY30ufadkXrRv2h";   
const oauthUrl="https://graph.facebook.com/oauth/access_token?client_id=6097851830225464&client_secret=0c57fb1bf447e5c3f928237e72522469&grant_type=client_credentials";
const dataUrlRoot = "https://graph.facebook.com/me?fields=posts&access_token=";
const postUrl = `https://graph.facebook.com/me?fields=posts&access_token=${user_access_token}`;
const urlRoot = "https://graph.facebook.com/";

var posts=[];
var comments=[];

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
           posts=JSON.parse(data).posts.data;
           let commentPromises= posts.map((post)=> {
              return https.get(`${urlRoot}${post.id}/comments?access_token=${user_access_token}`);
           });
           Promsie.all(commentPromises).then((response)=> {
               comments = response.data;
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

   app.get('/comments', function(req, res){
      res.send(comments);
   });

app.listen(process.env.PORT || port, () => console.log(`webhook is listening on port ${port}`));
