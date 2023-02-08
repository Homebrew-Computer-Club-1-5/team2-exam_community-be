const express = require("express");
const router = express.Router();

const postsRoutes = require("./posts.resolver");
const usersRoutes = require("./users.resolver");
const commentsRoutes = require("./comments.resolver");

router.use("/apis/users", usersRoutes);
router.use("/apis/posts", postsRoutes);
router.use("/apis/comments", commentsRoutes);
module.exports = router;
