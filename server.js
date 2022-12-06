const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000
const {mogoUrl} = require('./keys')
require('./models/UserSchema');
const router = require('./routes/authRoutes')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.raw())
mongoose.connect(mogoUrl)

mongoose.connection.on(
  'connected', () => {
    console.log("connected to mongo yeah");
  }
)
mongoose.connection.on(
  'error', (error) => {
    console.log("error", error);
  }
)




app.use('/api', router)

app.listen(PORT, ()=> {
  console.log('server running' + PORT)
})
