const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { sendMessage, getMessages } = require("../controllers/messageController");

router.post("/", auth, sendMessage);
router.get("/:from/:to", auth, getMessages);

module.exports = router;