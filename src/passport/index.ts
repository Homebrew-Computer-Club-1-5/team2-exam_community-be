import { Users } from "../entity/Users";

const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "user_id",
      passwordField: "user_pw",
      session: true,
      passReqToCallback: false,
    },
    async (input_id, input_pw, done) => {
      // const login_user=await User.findOneBy({user_id:input_id})
      const login_user = await Users.findbyid(input_id);
      // no user
      if (login_user) {
        // 뭐가 있다면
        //check password  사용자 지정 repository 사용 맞으면 통과
        if (await login_user.comparePassword(input_pw)) {
          //같으면 통과
          return done(null, login_user);
        } else {
          // 틀리면 message 반환
          console.log("비번 다름");
          return done(null, false, { message: "password error" });
        }
      } else {
        console.log("id 없음");
        return done(null, false, { message: "id error" });
      }
    }
  )
);
passport.serializeUser((user, done) => {
  console.log("[DEBUG] inside serializer");
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findOne({ where: { id } });
    if (!user) {
      return done(null, { message: "no user" });
    } else {
      console.log("[DEBUG] inside deserializer login good ");
      return done(null, user);
    }
  } catch (err) {
    console.error(err);
    return done(err);
  }
});

module.exports = passport;
