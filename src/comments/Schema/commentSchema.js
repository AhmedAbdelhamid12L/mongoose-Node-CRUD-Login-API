const { Schema } = require('mongoose');


const commentSchema = new Schema(
  {
    comment_content:
    {
      type:String,
      required: true
    },
    createdBy:
    {
      type:Schema.Types.ObjectId , ref:'user',
      required: true
    },
    postId: 
    { 
      type: Schema.Types.ObjectId, ref:'post'
    },
  },
  {
    timestamps: true
  }
);

module.exports = commentSchema;