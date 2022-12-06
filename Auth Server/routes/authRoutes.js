const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()
const jwt = require('jsonwebtoken');
const User = mongoose.model('User')
const {jwtkey} = require('../keys');
const requireToken = require('../middleware/requireToken')

// sign up
router
  .route('/signup')
  .post(
    async (req, res) => {
      const {email, first_name, last_name, password} = req.body
      try {
        var user = new User({email, first_name, last_name, password})
        await  user.save()
        res.status(200).send({message: "user created successfully"})
      } catch (e) {
        res.status(422)
        .send(e.message)
      } finally {
          res.status(422)
          .send("finally")
      }
    })

// login
router
    .route('/login')
    .post(async (req, res) => {
      const user_agent = req.get('User-Agent')
      if(!req.body.email || !req.body.password){
        return res.status(422).send({error: "must provide email or password"})
      }
      console.log('email', req.body.email, "password", req.body.password);
      const query = {email: req.body.email}
      await User.findOne(query, (err, result) => {
        if(!err)
          res.status(422).send({error: "User not found"})


        try {
          await result.comparePassword(req.body.password)
          var jsonwebtoken = jwt.sign({userId:result._id + user_agent}, jwtkey)
          result.token = jsonwebtoken
          result.save()
          res.status(200).send(user)
        }
        catch (e){
          res.status(422).send({error: e})
        }
        finally{
          res.status(422).send({error: "in final block"})
        }
      })
      .clone()
    })
module.exports = router
