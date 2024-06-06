const router = require("express").Router();
const {getCurrentChatUser} = require("../controllers/chatUserController")

router.get("/me", getCurrentChatUser);


module.exports = router;