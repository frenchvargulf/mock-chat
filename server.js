const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')
const app = express()

// Init chatkit instance
const chatkit = new Chatkit.default({
  instanceLocator: `v1:us1:71daff79-bcec-48e1-90fc-3fb8d9816fd5`,
  key: '7e6fce75-7be9-44c8-8c1c-840b2ec73c6a:GBn+YUQIR2X0jYMx9MdAb2hS+5fvi+TKRVshxd/RRQ4=',
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Post methord to create users
app.post('/users', (req, res) => {
  const { username } = req.body
  console.log(username);
  chatkit
    .createUser({ 
      id: username, 
      name: username 
    })
    .then(() => res.sendStatus(201))
    .catch(error => {
      if (error.error_type === 'services/chatkit/user_already_exists') {
        res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
})

const PORT = 3000
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})