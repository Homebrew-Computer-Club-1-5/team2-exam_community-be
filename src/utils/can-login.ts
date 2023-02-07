export async function can_login(req, res, next) {
  const user = await req.user;
  if (user) {
    // 유저 정보가 없으면
    console.log(
      "[DEBUG] can login: " +
        (await req.user.user_name) +
        (await req.user.user_id) +
        (await req.user.user_pw)
    );

    next(); // 통과 ㄱㄱ 구문
  } else {
    //정보가 없으면 실행
    console.log("[DEBUG] can login 실패");
    res.status(200).json({ message: "login fail" }); // 바꾸기 로그인 페이지 리다이렉션
  }
}
