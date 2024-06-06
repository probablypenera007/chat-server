const router = require("express").Router();
const NotFoundError = require("../errors/not-found-err");
const chatUserRoutes = require("./chatUserRoutes.js");

router.use("/users", chatUserRoutes)

router.use((req,res,next) => {
    next(new NotFoundError("request is nowhere to be found in index routes"))
})

module.exports = router;