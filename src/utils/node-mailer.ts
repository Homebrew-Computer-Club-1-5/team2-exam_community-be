import * as nodemailer from "nodemailer";
const email_config = require("../../config/email-config.json");

export class NodeMailer {
  async send_password_set_email(user_email: string, i_token: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail", //gmail service 사용
      port: 465, //465 port를 통해 요청 전송
      secure: true, //보안모드 사용
      auth: {
        //gmail ID 및 password
        user: email_config.GMAIL_ID,
        pass: email_config.GMAIL_PW,
      },
    });
    const url = "http://cocobol.site";
    //TODO: url path front 코드에 맞춰 바꾸기
    const emailOptions = {
      //비밀번호 초기화를 보내는 이메일의 Option
      from: process.env.GMAIL_ID, //관리자 Email
      to: user_email, //비밀번호 초기화 요청 유저 Email
      subject: "COCOBOL 비밀번호 초기화 메일", //보내는 메일의 제목
      //보내는 메일의 내용
      html:
        "<p>비밀번호 초기화를 위해 아래의 URL을 클릭하여 주세요.</p>" +
        `<a href="${url}/users/reset/${i_token}">비밀번호 재설정 링크</a>`,
    };
    await transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log("[ERROR]: " + error);
        return { success: false, mesage: "email send not success" };
      } else {
        // console.log(info);
        console.log(`send mail to ${user_email}, success!`);
        return { success: true, mesage: "email send success" };
      }
    });
  }
}
