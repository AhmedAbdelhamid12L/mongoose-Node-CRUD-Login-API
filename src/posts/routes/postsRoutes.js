const router = require('express').Router();
const {
  getPosts,
  addPost,
  deletePost
} = require('../controller/postsController');

const validateReq = require('../../../common/Validate/validateRequest');
const { validatePostSchema } = require('../Validation/postValidation');


router.get('/posts', getPosts)
router.post('/posts', validateReq(validatePostSchema), addPost)
// router.put('/posts/:id', validateReq(validatePostSchema), )
router.delete('/posts/:id', deletePost)




module.exports = router;