const { StatusCodes } = require("http-status-codes");
const Comment = require('../Model/commentModel')



const getComments = async (req, res) => {
  try {
      const data = await Comment.find({}).populate("createdBy" , "username email")
      res
        .status(StatusCodes.OK)
        .json({ message: 'success', data })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'error', error })
  }
}

const addComment = async (req, res) => {
  const { comment_content, createdBy, postId } = req.body;
  try {
    // const post = await Post.findOne({ _id: postId });
    // if (post) {

    //   const updatedPost = await Post.updateOne(
    //     { _id: postId },
    //     { commentIds: [...post.commentIds, data._id] }
    //   );
    // } else {
    //   res.json({ message: "invalid post id" });
    // }

    const commentData = new Comment({ comment_content, createdBy, postId });
    const data = await commentData.save();
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'added success', data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'error', error })
  }
}

// const updateComments = async (req, res) => {
//   const { id } = req.params;
//   const { comment_content, createdBy } = req.body;
//   try {
//     const data = await Comment.updateMany({ comment_content, createdBy }).where({ _id: id });
//     if (data) {
//       res
//         .status(StatusCodes.CREATED)
//         .json({ message: 'updated success', data });
//     }
//     else {
//       res.json({ message: 'error data' });
//     }

//   } catch (error) {
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: 'error', error })
//   }
// }

const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Comment.deleteMany({ _id: id });
    res
      .status(StatusCodes.OK)
      .json({ message: 'deleted success', data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'error', error })
  }
}







module.exports = {
  getComments,
  addComment,
  deleteComment
}