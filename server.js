// Third party modules
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";
import { config } from "dotenv";
const configEnvPath = path.resolve("config", ".env");
config({ path: configEnvPath });

// Internal exports
import { auth } from "./middleware/auth.middleware.js";
import userRouter from "./src/routes/user/user.route.js";
import projectRouter from "./src/routes/project/project.route.js";
import issueRouter from "./src/routes/issue/issue.route.js";

export const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(cookieParser());
console.log("Secret Sessions: " + process.env.SESSION_SECRET);
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
// ejs engine code'
server.use(express.json());
server.set("view engine", "ejs");
server.set("views", path.resolve("src", "view"));
server.use(expressEjsLayouts);
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));

//User Router
server.route("/logout").get((req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
    } else {
      res.clearCookie("connect.sid");
      res.clearCookie("user");
      res.clearCookie("token");
      res.redirect("/login");
    }
  });
});

server.use("/", userRouter);
server.use("/issue-tracker", auth, projectRouter);
server.use("/issue-tracker/project/", auth, projectRouter);
server.use("/issue-tracker/issue/", auth, issueRouter);

server.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .render("error-404", { error: err.message, user: null, projectId: null });
});
