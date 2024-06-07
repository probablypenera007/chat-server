const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { sendMessage, getMessages } = require("../controllers/messageController");
const { validateMessageBody } = require("../middlewares/validation")

router.post("/", auth, validateMessageBody, sendMessage);
router.get("/:from/:to", auth, getMessages);

module.exports = router;