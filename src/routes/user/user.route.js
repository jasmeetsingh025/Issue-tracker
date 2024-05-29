import express from "express";
import {
  showRegister,
  registerUser,
  loginUser,
  showLogin,
  showForgotPassword,
  resendOtp,
  resetPassword,
  sendOtp,
  verifyOtpToReset,
} from "../../controller/user/user.controller";

const routes = express.Router();

routes.route("/").get(showLogin);

routes.route("/register").get(showRegister);

routes.route("/register").post(registerUser);

routes.route("/login").get(showLogin);

routes.route("/login").post(loginUser);

routes.route("/forgotpassword/otp").post(verifyOtpToReset);

routes.route("/forgotpassword/reset").post(resetPassword);

routes.route("/forgotpassword/resendotp").post(resendOtp);

routes.route("/forgotpassword").post(sendOtp);

routes.route("/forgotpassword").get(showForgotPassword);

export default routes;
