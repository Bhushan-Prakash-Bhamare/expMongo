const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  ispremiumuser:{
    type:Boolean,
    default:false
  },
  totalexpense:{
    type:Number,
    default:0
  },
  order:[{
    paymentid:String,
    orderid:String,
    status:String
  }],
  forgotpwd:[{
    uniqueId:String,
    isActive:Boolean
  }],
  fileUrl:[{
    url:String,
  }]
});

module.exports = mongoose.model('User', userSchema);