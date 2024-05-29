import {
  createUserRepo,
  findUserForPasswordResetRepo,
  findUserRepo,
} from "../../model/user/user.repository";
import { sendToken } from "../../../util/sendToken";

export const showRegister = async (req, res, next) => {
  return res.render("user-register", {
    error: null,
    user: null,
    projectId: null,
  });
};

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password) {
      return res.render("user-register", {
        error: {
          statusCode: 400,
          message: "Please fill all the fields",
        },
        user: null,
        projectId: null,
      });
    }
    const isUserFound = await findUserRepo(
      { username: name, email: email },
      true
    );
    if (isUserFound) {
      return res.render("user-register", {
        error: {
          statusCode: 400,
          message: "User already present",
        },
        user: null,
        projectId: null,
      });
    } else {
      const newUser = await createUserRepo({
        username: name,
        password: password,
        email: email,
      });
      sendToken(newUser, res, 200);
      return res.render("user-login", {
        error: null,
        user: null,
        projectId: null,
      });
    }
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

export const showLogin = async (req, res, next) => {
  return res.render("user-login", {
    error: null,
    user: null,
    projectId: null,
  });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.render("user-login", {
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
      return res.render("user-login", {
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
      return res.render("user-login", {
        error: {
          statusCode: 400,
          message: "Invalid password",
        },
        user: null,
        projectId: null,
      });
    }
    sendToken(user, res, 200);
    res.cookie("user", user);
    req.session.userId = user._id;
    req.session.userEmail = email;
    return res.redirect("/issue-tracker");
  } catch (err) {
    console.log(err);
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

//! You can change the fender file name later...

export const showForgotPassword = async (req, res, next) => {
  return res.render("user-password-reset", {
    error: null,
    user: null,
    projectId: null,
  });
};

export const sendOtp = async (req, res, next) => {
  try {
    const email = req.body;
    const user = await findUserRepo({ email: email });
    if (!user) {
      return res.render("user-password-reset", {
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
    sendToken(user, res, 200);
    req.session.userEmail = email;
    return res.render("user-password-otp-verify", {
      error: null,
      user: null,
      projectId: null,
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
      return res.render("user-password-reset", {
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
    sendToken(user, res, 200);
    req.session.userEmail = email;
    return res.render("user-password-otp-verify", {
      error: null,
      user: null,
      projectId: null,
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

export const verifyOtpToReset = async (req, res, next) => {
  try {
    const otp = req.body;
    const isUserFound = await findUserForPasswordResetRepo(otp);
    if (!isUserFound) {
      return res.render("user-password-otp-verify", {
        error: {
          statusCode: 400,
          message: "Otp expired or mismatched",
        },
        user: null,
        projectId: null,
      });
    }
    isUserFound.restPasswordToken = "";
    isUserFound.resetPasswordTokenExpiry = "";
    sendToken(user, res, 200);
    isUserFound.save();
    return res.render("user-new-password", {
      error: null,
      user: null,
      projectId: null,
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

export const resetPassword = async (req, res, next) => {
  try {
    const userEmail = req.session.userEmail;
    if (!userEmail) {
      return res.render("error-404", {
        error: {
          statusCode: 400,
          message: "Something went wrong",
        },
        user: null,
        projectId: null,
      });
    }
    const { newPassword, confirmPassword } = req.body;
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
    const isPasswordMatched = await user.comparePassword(newPassword);
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
      return res.redirect("/login");
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
