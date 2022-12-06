const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  email:{
    type:String,
    unique: true,
    required: true
  },
  first_name:{
    type:String,
    required: true
  },
  last_name:{
      type:String,
      required: true
  },
  password:{
      type:String,
      required: true
  },
  token:{
      type:String,
  },
})

userSchema.pre('save', function(next) {
  const user = this
  if(!user.isModified('password')){
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    if(err){
      return next(err)
    }
    bcrypt.hash(user.password,salt,(err,hash) => {
      if(err)
        return next(err)
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this
  return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
          if(err || !isMatch){
            return reject(err)
          }

          resolve(isMatch)
      })
  })
}
mongoose.model('User', userSchema)
