import { AppDataSource } from "../data-source";
import { Comments } from "../entity/Comments";
import { Posts } from "../entity/Posts";
import { can_login } from "../utils/can-login";

const router = require("express").Router();
const commentsRepository = AppDataSource.getRepository(Comments);

//TODO: 기존 API : /mycomment
router.get("/my", can_login, async (req, res) => {
  const comment = await commentsRepository.find({
    where: {
      user_id: req.user.user_id,
    },
    order: {
      c_date: "DESC",
    },
  });
  if (comment) {
    console.log("my post 성공 ");
    res.json(comment);
  } else {
    res.json({ message: "mypost fail" });
  }
});

//TODO: 기존 API : /comment
router.post("/", can_login, async (req, res) => {
  const NewComment = new Comments();
  // NewComment.uuid=req.user.uuid;
  //반드시 답글 달때는 게시물 유일키도 같이 보내야함
  console.log(typeof ("post_key type" + req.body.post_key));
  NewComment.post_id = req.body.post_key;
  NewComment.post_key = req.body.post_key;
  NewComment.user_id = req.user.user_id;
  NewComment.user_name = req.user.name;
  NewComment.content = req.body.content;
  NewComment.c_date = new Date();
  await NewComment.save();
  //update post coment_num++
  // const like=await Posts.findOneBy({id:req.body.post_key})
  // like.like_up();// 하나증가
  // 하나 증가
  var post = new Posts();
  post = await Posts.findOneBy({ id: req.body.post_key });
  post.comment_num = post.comment_num + 1;
  await Posts.save(post);
  res.json({ message: "comment save" });
});

//보내줘 coment id 값
//TODO: 기존 API : /comment/:id
router.delete("/:id", can_login, async (req, res) => {
  var comment = parseInt(req.params.id);
  const comment_d = await Comments.findOneBy({ id: comment });
  if (comment_d.user_id == req.user.user_id) {
    //update post coment_num
    var post = new Posts();
    post = await Posts.findOneBy({ id: req.body.post_key });
    post.comment_num = post.comment_num - 1;
    await Posts.save(post);
    await comment_d.remove();
    res.json({ message: " delete comment" });
  } else {
    res.json({ message: "don`t delete" });
  }
});

module.exports = router;
