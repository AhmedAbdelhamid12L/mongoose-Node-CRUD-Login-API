const { Schema } = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new Schema(
  {
    username:
    {
      type:String,
      required: true
    },
    email:
    {
      type:String,
      required: true
    },
    password:
    {
      type:String,
      required: true
    },
    age:
    {
      type:Number,
      required: true
    },
    address:
    {
      type:String,
      required: true
    },
    userImage: 
    {
      type: String
    },
    role:
    {
      type: String,
      enum:['admin','user']
    },
    verified:
    {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// use hooks to hash password

userSchema.pre('save', async function (next){
  this.password = await bcrypt.hash(this.password, 7);
  next();
})

module.exports = userSchema;