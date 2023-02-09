import { AppDataSource } from "../data-source";
import { Comments } from "../entity/Comments";
import { Posts } from "../entity/Posts";
import { can_login } from "../utils/can-login";
const router = require("express").Router();

const postsRepository = AppDataSource.getRepository(Posts);

//TODO: 기존 URL : /mypost
router.get("/my", can_login, async (req, res) => {
  const post = await postsRepository.find({
    where: {
      user_id: req.user.user_id,
    },
    order: {
      c_date: "DESC",
    },
  });
  if (post) {
    res.json(post);
  } else {
    res.json({ message: "mypost fail" });
  }
});

//TODO: 기존 API : /blogs
//게시판들 가져오기
router.get("/", async (req, res) => {
  var arr = [];
  //1 자유게시판
  var post_num = [1, 2, 3, 4]; // post_num[0]은 1부터 시작 한다
  for (let i = 0; i < post_num.length; i++) {
    arr[i] = await postsRepository.findAndCount({
      where: {
        num: post_num[i],
      },
      order: {
        c_date: "DESC", // 내림차순으로 나중에 만든거 부터
      },
      skip: 0,
      take: 4,
      // cache:true, // 캐시 할건지
    });
  }
  res.json(arr);
  //게시판 종류 페이지 게시판 목록 db
});

//특정 게시판 가져오기
//TODO: 기존 API : /blogs/:id
router.get("/:id", async (req, res) => {
  var num_id: number = parseInt(req.params.id);
  await postsRepository
    .findAndCount({
      where: { num: num_id },
      order: { c_date: "DESC" },
    })
    .then((result) => {
      console.log("[DEBUG] /apis/posts/:id" + result);
      res.json(result);
    })
    .catch((err) => {
      console.log("[DEBUG] error" + err);
      res.json({ message: "wow sad" });
    });
});

router.post("/detail", can_login, async (req, res) => {
  console.log("[DEBUG]:/detail im in");
  console.log("[DEBUG] user: " + req.user.user_id);
  const NewPost = new Posts();
  // NewPost.uuid=req.user.uuid;
  NewPost.user_id = req.user.user_id;
  NewPost.user_name = req.user.name;
  NewPost.title = req.body.title;
  NewPost.c_date = new Date();
  NewPost.num = parseInt(req.body.num);
  NewPost.content = req.body.content;
  NewPost.click_num = 0;
  NewPost.comment_num = 0;
  NewPost.user_key = req.user.id; // 이게 맞나? => 맞다 ^^^^^^^^^
  NewPost.is_user_hid = false;

  await NewPost.save()
    .then((data) => {
      console.log("[DEBUG] newPost:" + NewPost);
      res.status(201).json({ message: "post save" });
    })
    .catch((err) => {
      console.log("[ERROR]:" + err);
      res.status(201).json({ message: "post not save" }); //TODO: 이거 status code 통일하는 게 맞을 듯
    });
});

router.get("/detail/:id", async (req, res) => {
  console.log("[DEBUG] im in detail id");
  try {
    var post_id = parseInt(req.params.id);
    console.log("[DEBUG] postId" + post_id);
    const post_detail = await Posts.findOneBy({ id: post_id });
    console.log("[DEBUG] postDetail" + post_detail);
    //조회수 1증가

    post_detail.click_num = post_detail.click_num + 1;
    await Posts.save(post_detail); //저장
    // const post_comments=await Comment.findAndCount({post_key:post_detail.id})
    const post_comments = await Comments.find_post_key(post_id);
    console.log("[DEBUG] postComment:" + post_comments);
    var Ruser_id = "";
    if (post_detail.is_user_hid == true) {
      // 유저가 숨기기 원하면 넘기기전에 아이디를 수정 해서 리턴
      Ruser_id = post_detail.user_id;
      post_detail.user_id = "cloaking";
    }
    res.json({ post_detail, post_comments });
  } catch {
    res.json({ message: "찾기 실패" });
  }

  //요청자가 작성자이면
  // if(req.user.user_id==Ruser_id){
  //     var message={msg:'myPost'}
  //     res.json({post_detail,post_comments,message})
  // }else{
  //     res.json({post_detail,post_comments})
  // }
});

router.put("/detail/:id", can_login, async (req, res) => {
  //TODO: params id로 가져오는 게 아니라 그냥 req에 떄리게 만들어야 함
  const post = await Posts.findOneBy({ id: parseInt(req.params.id) });
  if (req.user.user_id == post.user_id) {
    await postsRepository
      .createQueryBuilder()
      .update(Posts)
      .set(req.body) // 만약 안되면 값을 겍체로 하나하나 씩 설정 하기
      .where({ id: parseInt(req.params.id) })
      .execute()
      .then((data) => {
        res.json(data);
        console.log("[DEBUG] update post" + data);
      })
      .catch((err) => {
        console.log("[DEBUG] update error " + err);
        res.json(err);
      });
  }
});

router.delete("/detail/:id", can_login, async (req, res) => {
  var post_id = parseInt(req.params.id);
  var result = new Posts();
  result = await Posts.findOneBy({ id: post_id });
  if (result.user_id == req.user.user_id) {
    // 게시물의 주인 아이디 값과 유저 아이디 값이 같으면 삭제
    var com = await Comments.find({ where: { user_id: result.user_id } }); //댓글 삭제
    if (com) {
      // 나중에 조건을 안에 comment_num 을 넣어서 댓글 확인하고 조회하면 더좋은 성늘 을 가질것
      Comments.remove(com); //  댓글 있으면 삭제
    }
    await result.remove();
    res.json({ message: "delete clear" });
  } else {
    res.json({ message: "delete fail no " });
  }
});

//TODO: 기존 API : /findpost/:id
router.post("/find/:id", async (req, res) => {
  const find_id = parseInt(req.params.id);
  const arr = ["no", "제목", "작성자"];
  if (arr[find_id] == "제목") {
    const post = await postsRepository.find({
      where: {
        title: req.body.title,
      },
      order: {
        c_date: "DESC",
      },
    }); // 제목
    res.json(post);
  }
  if (arr[find_id] == "작성자") {
    const post = await postsRepository.find({
      where: {
        user_id: req.body.user_id,
      },
    }); //작성자
    res.json(post);
  }
});

// router.get("/modify/:id", can_login, async (req, res) => {
//   const post = await postsRepository.find({
//     where: { id: parseInt(req.params.id) },
//   });
//   if (post) {
//     res.json(post);
//   } else {
//     res.json({ massage: "fail post" });
//   }
// });

//TODO: 1. 좋아요 Posts로 받으면 UsersDB likeposts에 넣기
//TODO: 2. likes DB에도 정보 넣기
//TODO: 3. 만약 기존에 좋아요에 본인이 있다면 양쪽에서 빼기
//TODO: 4. (later) transaction 처리하기
router.post("/like", async (req, res) => {
  //request에는 postId 와 like를 누른 현 사람의 userId 담아오기
  //TODO: 유저가 없을 때(회원이 아니거나, 로그인을 안했을 때) response로 로그인이 필요하다고 알려주기
  const postId = req.body.postId; //TODO: id 부분 용어 통일해야겠는걸?(prime key id도 있고 user id도 있어서 헷갈림 특히 user db는)
  const userId = req.body.userId;
});

router.get("/like", async (req, res) => {
  const postId = req.body.postId;
  Posts.findOne({
    where: { id: postId },
  }).then((data) => {
    if (data) {
      console.log("[DEBUG] foundPosts:" + data);
      let postLikes = data.likeUsers;
      console.log("[DEBUG] postLikes:" + postLikes);
      res.json({ postLikes: postLikes });
    } else {
      res.json({ message: "wrong post id" });
    }
  });
});
module.exports = router;
