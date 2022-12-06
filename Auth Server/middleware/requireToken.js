const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User')
const {jwtkey} = require('../keys');
module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if(!authorization){
    return res.status(401).send({error: "you must be logged in"})
  }

  const token = authorization.replace("Bearer ", "")
  jsonwebtoken.verify(token, jwtkey, async(error, payload) => {
    if(error){
      res.status(401).send({error: "you must be logged in"})
    }
    var query = {token: token}
    await User.findOne(query, (err, result) => {
        if(err)
          res.status(401).send({error: err.message})
        req.user = result
        next()
    }).clone()
  })
}
