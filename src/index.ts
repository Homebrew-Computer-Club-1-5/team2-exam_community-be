import { AppDataSource } from "./data-source"; //cicd test
const apiRoutes = require("./apis");
const express = require("express");

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(
  cors({
    orgin: "*",
    credential: true,
  })
);
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));
const path = require("path");
app.use(express.static(path.join(__dirname, "../test1/build")));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

AppDataSource.initialize()
  .then()
  .catch((error) => console.log("[DEBUG] appdatasource initialize:" + error));

app.listen(8080, () => {
  console.log("listening on 8080 port open !!!!");
});
app.get("/", (req, res) => {
  res.json({ message: "main page / !!" });
  // res.sendFile(path.join(__dirname, '../'+path_static+'/index.html'));
});

//순서 중요! 무조건 session이 passport.initialize보다 먼저 나와야 함!
const session = require("express-session");
const passport = require("passport");
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/apis", apiRoutes);
