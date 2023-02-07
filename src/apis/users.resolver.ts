import { AppDataSource } from "../data-source";
import { Newpw } from "../entity/Newpw";
import { Users } from "../entity/Users";
import { can_login } from "../utils/can-login";
import { NodeMailer } from "../utils/node-mailer";
import { Random } from "../utils/random";
import * as bcrypt from "bcrypt";
const router = require("express").Router();

const passport = require("../passport/index");
const usersRepository = AppDataSource.getRepository(Users);

router.post(
  "/login",
  async (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        console.log(info.message);
        return res.json({ message: info.message });
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        // return res.redirect("/");
        res.json(user);
      });
      // console.log(req.user);
      // var res_user = req.user;
      // res_user.user_pw = ""; // 중요한 pw값은 넘기지 않겠다는 마음으로
      // res.json(res_user);
    })(req, res, next);
  }
  // passport.authenticate("local", {
  //   failureRedirect: "/fail_login", // fail시 api 호출
  // }),
  // async (req, res) => {
  //   console.log(req.user);
  //   var res_user = req.user;
  //   res_user.user_pw = ""; // 중요한 pw값은 넘기지 않겠다는 마음으로
  //   res.json(res_user);
  // }
);
router.get("/login", can_login, async (req, res) => {
  const user = req.user.id;
  try {
    const find_user = await Users.findOne({ where: { id: user } });
    if (req.user.id == find_user.id) {
      res.json({ isAuthenticated: true, username: req.user.name });
    } else {
      res.json({ isAuthenticated: false });
    }
  } catch (err) {
    console.log("로그인 정보 없음");
  }
});

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// router.get("/fail_login", (req, res) => {
//   res.status(200).json({ message: "login fail" });
// });

//TODO: 기존 API : /user
router.get("/", can_login, (req, res) => {
  res.json(req.user.id);
});

//중복 아이디 입니다
//TODO: 기존 API : post : /id_compare
router.get("/compareId", async (req, res) => {
  const user_input = req.body.user_id;

  const us = await usersRepository.findOne({ where: { user_id: user_input } });
  if (us) {
    res.json({ boo: false });
  } else {
    res.json({ boo: true });
  }
});

//id find
//TODO: 기존 API : post : /find_id
router.get("/findId", async (req, res) => {
  const phone_num = req.body.phone;
  const user = await Users.findOneBy({ phone: phone_num });
  console.log("find user id");
  res.json(user.user_id);
});

//회원정보 요청
router.get("/register", can_login, async (req, res) => {
  const user = await Users.findOneBy({ id: req.user.id });
  user.user_pw = ""; // user pw 중요한건 넘기지 않겠다는 마음
  res.json(user);
});

router.post("/register", async (req, res) => {
  const user = new Users();
  user.name = req.body.name;
  user.age = req.body.age;
  user.email = req.body.email;
  user.phone = req.body.phone;
  user.gender = req.body.gender;
  user.c_date = new Date();
  user.user_id = req.body.user_id;
  user.user_pw = req.body.user_pw;
  await user
    .save()
    .then((data) => {
      console.log("[DEBUG]:signup success");
      res.json({ message: "register clear" });
    })
    .catch((err) => console.log("[DEBUG] err:" + err));
});

router.delete("/register", can_login, async (req, res) => {
  console.log("remove user");
  await Users.remove(req.user);
});

// mypage update 해야함
router.post("/mypage", can_login, async (req, res) => {
  await usersRepository
    .createQueryBuilder()
    .update(Users)
    .set({
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      m_date: new Date(),
    })
    // .set(req.body) 이렇게 해도 괜찮아
    .where({ id: req.user.id })
    .execute()
    .then((data) => {
      console.log("update user" + data);
      res.json(data);
    })
    .catch((err) => {
      console.log("update user error " + err);
      res.json(err);
    });
});

//새로운 이메일 받고 조회 -> 그유저 id email 를 newpw 에넣고 토큰값도 넣고 **** 여기 api에서 메일 날려야함 ****
//TODO: 기존 API : /api/newpw
router.post("/newpw", async (req, res) => {
  let i_id = req.body.id;
  let user = await Users.findOne({ where: { user_id: i_id } });
  let i_email = user.email;
  //TODO: newpw 부분 정리하기
  // user.email
  var newpw = await Newpw.findOne({ where: { user_id: i_id } });
  const nodeMailer = new NodeMailer();
  const random = new Random();
  // baseEntity .save는 기존것이 있으면 업데이트 없으면 생성
  let i_token = await random.createRandomValue();
  if (user) {
    if (newpw != null) {
      newpw.token = i_token;
      newpw.c_date = new Date();
      await newpw.save();
      nodeMailer
        .send_password_set_email(i_email, i_token)
        .then((data) => {
          console.log("[DEBUG] send_again:" + data);
          res.json({ success: true, email: i_email });
        })
        .catch((err) => {
          res.json({ success: false, message: err });
        });
    } else {
      let newpw = new Newpw();
      newpw.user_key = user.id;
      newpw.user_id = i_id;
      newpw.token = i_token;
      newpw.c_date = new Date();
      await newpw.save(); // 일정시간이 지나면 삭제 해야하는것이 좋을듯
      nodeMailer
        .send_password_set_email(i_email, i_token)
        .then((data) => {
          console.log("[DEBUG] node_mailer:" + data);
          res.json({ success: true, email: i_email });
        })
        .catch((err) => {
          res.json({ success: false, message: err });
        });
    }
  } else {
    res.json({ success: false, message: "user not found" });
  }
});

//  새로운 비번 email id 토큰  put 사용해서 토큰비교후 유저 비번 수정 하고 newpw 삭제
//TODO: 기존 API : api/newpw
router.put("/newpw", async (req, res) => {
  // 토큰으로 조회 ,newpw 에 없는경우
  var i_token = req.body.token;
  var i_pw = req.body.pw;
  var newpw = await Newpw.findOne({ where: { token: i_token } }); //토큰으로 조회 있으면 수정하려하는 사람이니깐
  if (newpw == null) {
    res.json({ success: false, message: "token wrong or missed" });
  } else {
    var user = await Users.findOne({ where: { id: newpw.user_key } }); // user id 조회

    user.user_pw = await bcrypt.hash(i_pw, 5);
    await user.save();
    await Newpw.remove(newpw); // 완료후 삭제
    res.json({ success: true, message: "new create pw " });
  }
});

// router.get("/finduser", async (req, res) => {
//   const user = await Users.findOne({ where: { id: 1 } });
//   const post = await Posts.findAndCount({ where: { id: 1 } });
//   res.json({ message: "end" });
// });

module.exports = router;
