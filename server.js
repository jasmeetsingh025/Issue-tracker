// Third party modules
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";

// Internal exports
import { appLevelErrorHandlerMiddleware } from "./util/errorHandler";
import { auth } from "./middleware/auth.middleware.js";
import userRouter from "./src/routes/user/user.route.js";
import projectRouter from "./src/routes/project/project.route.js";
import issueRouter from "./src/routes/issue/issue.route.js";

const server = express();
server.use(cors);
server.use(bodyParser.json());
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// ejs engine code
server.use(express.static("public"));
server.set("view engine", "ejs");
server.set("view", path.join(path.resolve(), "src", "view"));
server.use(expressEjsLayouts);
server.use(express.urlencoded({ extended: true }));

//User Router
server.get("/logout", (req, res, next) => {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
    } else {
      res.clearCookie("connect.sid");
      res.redirect("/login");
    }
  });
});

server.use("/issue-tracker/project/", auth, projectRouter);
server.use("/issue-tracker/issue/", auth, issueRouter);
server.use("/issue-tracker", auth, projectRouter);
server.use("/", userRouter);

server.use(appLevelErrorHandlerMiddleware());
