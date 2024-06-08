const router = require("express").Router();
const NotFoundError = require("../errors/not-found-err");
const chatUserRoutes = require("./chatUserRoutes");
const messageRoutes = require("./messageRoutes")
// router.use("/users", chatUserRoutes)
// router.use("/messages", messageRoutes)

// router.use((req,res,next) => {
//     next(new NotFoundError("request is nowhere to be found in index routes"))
// })

// module.exports = router;
module.exports = (io) => {
    router.use("/users", chatUserRoutes);
    router.use("/messages", messageRoutes(io));
    router.use((req, res, next) => {
      next(new NotFoundError("request is nowhere to be found in index routes"));
    });
  
    return router;
  };