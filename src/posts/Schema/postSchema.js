const { Schema } = require('mongoose');


const postSchema = new Schema(
  {
    post_content:
    {
      type:String,
      required: true
    },
    createdBy:
    {
      type:Schema.Types.ObjectId , ref:'user',
    },
    //commentsIds:[{type:Schema.Types.ObjectId , ref:'comment',required: true}]
  },
  {
    timestamps: true
  }
);

module.exports = postSchema;