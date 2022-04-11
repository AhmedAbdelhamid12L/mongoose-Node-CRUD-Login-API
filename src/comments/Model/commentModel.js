const mongoose = require('mongoose');
const commentSchema = require('../Schema/commentSchema');



const Comment = mongoose.model('comment' , commentSchema );

module.exports = Comment;