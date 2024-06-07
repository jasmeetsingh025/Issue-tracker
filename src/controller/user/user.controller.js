import {
  createUserRepo,
  findUserForPasswordResetRepo,
  findUserRepo,
} from "../../model/user/user.repository.js";
import { sendToken } from "../../../util/sendToken.js";

export const showRegister = async (req, res, next) => {
  return res.render("user-register.ejs", {
    error: null,
    user: null,
    projectId: null,
  });
};

export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    if (!email || !password) {
      return res.render("user-register.ejs", {
        error: {
          statusCode: 400,
          message: "Please fill all the fields",
        },
        user: null,
        projectId: null,
      });
    }
    const isUserFound = await findUserRepo(
      { username: username, email: email },
      true
    );
    if (isUserFound) {
      return res.render("user-register.ejs", {
        error: {
          statusCode: 400,
          message: "User already present",
        },
        user: null,
        projectId: null,
      });
    }
    const newUser = await createUserRepo(req.body);
    const token = await sendToken(newUser);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    return res.cookie("token", token, cookieOptions).render("user-login.ejs", {
      error: null,
      user: newUser,
      projectId: null,
      success: true,
    });
  } catch (error) {
    if (!res.headersSent) {
      return res.render("error-404", {
        error: {
          statusCode: 500,
          message: "Something went wrong",
        },
        user: null,
        projectId: null,
      });
    }
    console.error("Failed to handle error properly:", error);
  }
};

export const renderLayOut = async (req, res, next) => {
  return res.render("layout.ejs", {
    render: "layout",
    user: null || req.cookies.user,
  });
};

export const showLogin = async (req, res, next) => {
  return res.render("user-login.ejs", {
    error: null,
    user: null,
    projectId: null,
  });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.render("user-login.ejs", {
        error: {
          statusCode: 400,
          message: "Please fill all the fields",
        },
        user: null,
        projectId: null,
      });
    }
    const user = await findUserRepo({ email: email }, true);
    if (!user) {
      return res.render("user-login.ejs", {
        error: {
          statusCode: 400,
          message: "User not found",
        },
        user: null,
        projectId: null,
      });
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.render("user-login.ejs", {
        error: {
          statusCode: 400,
          message: "Invalid password",
        },
        user: null,
        projectId: null,
      });
    }
    const token = await sendToken(user);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      // httpOnly: true,
    };
    req.session.userId = user._id;
    req.session.userEmail = email;
    return res
      .cookie("token", token, cookieOptions)
      .cookie("user", user)
      .redirect("/issue-tracker");
  } catch (err) {
    console.log(err);
    return res
      .render("error-404", {
        error: {
          statusCode: 500,
          message: "Something went wrong",
        },
        user: null,
        projectId: null,
      })
      .json({ success: true, user, token });
  }
};

//! You can change the fender file name later...

export const showForgotPassword = async (req, res, next) => {
  return res.render("user-password-reset.ejs", {
    error: null,
    user: null,
    projectId: null,
  });
};

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserRepo({ email: email });
    if (!user) {
      return res.render("user-password-reset.ejs", {
        error: {
          statusCode: 400,
          message: "User not found",
        },
        user: null,
        projectId: null,
      });
    }
    const otp = await user.getResetPasswordOtp();
    await user.save();
    // await sendPasswordResetEmail(user,otp);
    const token = await sendToken(user);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    req.session.userEmail = email;
    return res
      .cookie("token", token, cookieOptions)
      .render("user-password-reset.ejs", {
        error: null,
        user: user,
        projectId: null,
        otp: otp,
        success: true,
      });
  } catch (error) {
    return res.render("error-404", {
      error: {
        statusCode: 500,
        message: "Something went wrong",
      },
      user: null,
      projectId: null,
    });
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const email = req.session.userEmail;
    if (!email) {
      return res.render("error-404", {
        error: {
          statusCode: 400,
          message: "Something went wrong",
        },
        user: null,
        projectId: null,
      });
    }
    const user = await findUserRepo({ email: email });
    if (!user) {
      return res.render("user-password-reset.ejs", {
        error: {
          statusCode: 400,
          message: "User not found",
        },
        user: null,
        projectId: null,
      });
    }
    const otp = await user.getResetPasswordOtp();
    await user.save();
    // await sendPasswordResetEmail(user,otp);
    const token = await sendToken(user);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    req.session.userEmail = email;
    return res
      .cookie("token", token, cookieOptions)
      .cookie("userEmail", email)
      .render("user-password-reset.ejs", {
        error: null,
        user: null,
        projectId: null,
        otp: otp,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.render("error-404", {
      error: {
        statusCode: 500,
        message: "Something went wrong",
      },
      user: null,
      projectId: null,
    });
  }
};

export const verifyOtpToReset = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const isUserFound = await findUserForPasswordResetRepo(otp);
    if (!isUserFound) {
      return res.render("user-password-reset.ejs", {
        error: {
          statusCode: 400,
          message: "Otp expired or mismatched",
        },
        user: null,
        projectId: null,
      });
    }
    isUserFound.resetPasswordToken = "";
    isUserFound.resetPasswordTokenExpiry = "";
    const token = await sendToken(isUserFound);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    isUserFound.save();
    return res
      .cookie("token", token, cookieOptions)
      .render("user-new-password.ejs", {
        error: null,
        user: null,
        projectId: null,
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.render("error-404", {
      error: {
        statusCode: 500,
        message: "Something went wrong",
      },
      user: null,
      projectId: null,
    });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const userEmail = req.session.userEmail;
    if (!userEmail) {
      return res.render("error-404", {
        error: {
          statusCode: 400,
          message: "failed in validations",
        },
        user: null,
        projectId: null,
      });
    }
    const { newPassword, confirmPassword } = req.body;
    console.log(
      `new password: ${newPassword} and confirm password: ${confirmPassword}`
    );
    if (newPassword !== confirmPassword) {
      return res.render("user-new-password", {
        error: {
          statusCode: 400,
          message: "Password mismatch",
        },
        user: null,
        projectId: null,
      });
    }
    const user = await findUserRepo({ email: userEmail }, true);
    if (!user) {
      return res.render("error-404", {
        error: {
          statusCode: 400,
          message: "User not found",
        },
        user: null,
        projectId: null,
      });
    }
    const isPasswordMatched = await user.comparePassword(confirmPassword);
    if (isPasswordMatched) {
      return res.render("user-new-password", {
        error: {
          statusCode: 400,
          message: "Password already present",
        },
        user: null,
        projectId: null,
      });
    }
    user.password = newPassword;
    await user.save();
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Error destroying session");
      }
      return res.render("user-new-password", {
        success: {
          statusCode: 200,
          message: "Password successfully updated. Redirecting to login...",
        },
        user: null,
        projectId: null,
        error: null,
      });
    });
  } catch (error) {
    console.log(error);
    return res.render("error-404", {
      error: {
        statusCode: 500,
        message: "Something went wrong",
      },
      user: null,
      projectId: null,
    });
  }
};
