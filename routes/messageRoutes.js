const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { sendMessage, getMessages, deleteMessage } = require("../controllers/messageController");
const { validateMessageBody } = require("../middlewares/validation")

// router.post("/", auth, validateMessageBody, sendMessage);
// router.get("/:from/:to", auth, getMessages);

// module.exports = router;

module.exports = (io) => {
    router.post("/", auth, validateMessageBody, sendMessage(io));
    router.get("/:from/:to", auth, getMessages);
    router.delete("/:messageId", auth, deleteMessage)
    return router;
  };