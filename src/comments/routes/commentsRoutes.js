const router = require('express').Router();
const { 
  addComment, 
  getComments, 
  deleteComment 
} = require('../controller/commentsController');


const validateReq = require('../../../common/Validate/validateRequest');
const { validateCommentSchema } = require('../Validation/commentValidation');


router.get('/comments', getComments)
router.post('/comments', validateReq(validateCommentSchema), addComment)
// router.put('/comments/:id', validateReq(validateCommentSchema), )
router.delete('/comments/:id', deleteComment)




module.exports = router;