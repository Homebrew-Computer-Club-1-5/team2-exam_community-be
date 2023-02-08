const express = require("express");
const router = express.Router();

const postsRoutes = require("./posts.resolver");
const usersRoutes = require("./users.resolver");
const commentsRoutes = require("./comments.resolver");

router.use("/users", usersRoutes);
router.use("/posts", postsRoutes);
router.use("/comments", commentsRoutes);
module.exports = router;
