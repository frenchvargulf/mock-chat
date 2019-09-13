require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')
const app = express()
const Pusher = require('pusher');

const port = process.env.PORT || 4000;
const pusher = new Pusher({
  appId: "842937",
  key: "4f21d161f02e7ab3f286",
  secret: "6b5b7d50766b4ee0a90c",
  cluster: "eu",
});

// Init chatkit instance
const chatkit = new Chatkit.default({
  instanceLocator: `v1:us1:3046b544-c410-45af-a75e-76de8c1c2865`,
  key: 'fbb8f373-e11f-4c9b-8f5f-0ad8cd672e3e:JlSRN0yOOpq4jG0MwHeh9nlAeH+IMTOT6cKaoFXC1cE=',
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});


// Post methord to create users
app.post('http://localhost:4000/users', (req, res) => {
  const { username } = req.body
  console.log(username);
  chatkit
    .createUser({ 
      id: username, 
      name: username,
      // avatarUrl: null,
      // customData: {
      //   password: null,
      // }
    })
    .then(() => {
      console.log(res)
      res.sendStatus(201)
    })
      .catch(error => {
      if (error.error_type === 'services/chatkit/user_already_exists') {
        res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
})

// app.post("/authenticate", (req, res) => {
//   const authData = chatkit.authenticate({ userId: req.query.user_id });
//   res.status(authData.status).send(authData.body);
// });

app.post('/paint', (req, res) => {
  pusher.trigger('painting', 'draw', req.body)
  res.json(req.body);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

