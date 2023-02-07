const router = require("express").Router();

const posts = require("./posts.resolver.ts");
const users = require("./users.resolver.ts");
const comments = require("./comments.resolver.ts");

router.use("/posts", posts);
router.use("/users", users);
router.use("/comments", comments);

module.exports = router;
