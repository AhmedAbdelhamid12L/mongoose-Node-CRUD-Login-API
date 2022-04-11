const { StatusCodes } = require("http-status-codes");
const Post = require("../Model/postModel");
const Comment = require("../../comments/Model/commentModel")


const getPosts = async (req, res) => {
  try {
    // get All Posts
    let postArr = [];
    const cursor = Post.find({}).populate("createdBy", "username email").cursor();
    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      // console.log(doc);
      const commensts = await Comment.find({ postId: doc._id }).populate(
        "createdBy",
        "username email"
      );
      const obj = { ...doc._doc, commensts };
      postArr.push(obj);
    }

    // .populate({
    //   path: "commentIds",
    //   populate: {
    //     path: "createdBy",
    //     model: "user",
    //   },
    // });

      res
        .status(StatusCodes.OK)
        .json({ message: 'success', data: postArr })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'error', error })
  }
}

const addPost = async (req, res) => {
  const { post_content, createdBy } = req.body;
  try {
    const postData = new Post({ post_content, createdBy });
    const data = await postData.save();
    res
      .status(StatusCodes.CREATED)
      .json({ message: 'added success', data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'error', error })
  }
}

// const updatePosts = async (req, res) => {
//   const { id } = req.params;
//   const { post_content, createdBy } = req.body;
//   try {
//     const data = await Post.updateMany({ post_content, createdBy }).where({ _id: id });
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

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Post.deleteMany({ _id: id });
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
  getPosts,
  addPost,
  deletePost
}