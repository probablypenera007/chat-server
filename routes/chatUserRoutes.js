const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {getCurrentChatUsers} = require("../controllers/chatUserController")

router.get("/me",auth, getCurrentChatUsers);


module.exports = router;