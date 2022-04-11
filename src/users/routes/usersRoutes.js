const router = require("express").Router();
const {
  getUser,
  addUser,
  logIn,
  updateUser,
  deleteUser,
  getUsersCairo,
  verifiyAddUser,
} = require("../controller/usersController");

const isAuthorized = require("../../../common/Authorized/isAuthorized");
const validateReq = require("../../../common/Validate/validateRequest");
const {
  validateUserSchema,
  validatelogin,
} = require("../Validation/userValidation");
const { GET_ALL_USERS } = require("../endpoints");
const { upload } = require("../../../common/services/uplodeFile");


// router.get('/users', isAuthorized(GET_ALL_USERS), getUser)
router.get("/users", getUser);
router.get("/verifiy/:token", verifiyAddUser);
router.post("/login", validateReq(validatelogin), logIn);
router.post(
  "/users",
  upload.single("userImage"),
  validateReq(validateUserSchema),
  addUser
);
router.put("/users/:id", validateReq(validateUserSchema), updateUser);
router.delete("/users/:id", deleteUser);
router.get("/users/:id", getUser);
router.get("/getUsersCairo", getUsersCairo);

module.exports = router;
