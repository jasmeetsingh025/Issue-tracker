import { body, validationResult } from "express-validator";

// User validation middleware
export const validateUser = async (req, res, next) => {
  const rules = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage(
        "password must be between 8 and 16 characters long and contain at least one uppercase letter and one lowercase letter"
      ),
    body("password")
      .isLength({ max: 16 })
      .withMessage(
        "password must be between 8 and 16 characters long and contain at least one uppercase letter and one lowercase letter"
      ),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    return res.render("user-register", {
      error: errors[0],
      user: null,
      projectId: null,
    });
  }
  next();
};

export const validateUserLogin = async (req, res, next) => {
  const rules = [
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    return res.render("user-login", {
      error: errors[0],
      user: null,
      projectId: null,
    });
  }
  next();
};

export const emailValidator = async (req, res, next) => {
  const rules = [
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Invalid email address"),
  ];

  await Promise.all(rules.map((rule) => rule.run(req)));

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    return res.render("user-password-reset", {
      error: errors[0],
      user: null,
      projectId: null,
    });
  }
  next();
};

export const otpValidator = async (req, res, next) => {
  const rules = [
    body("otp").notEmpty().withMessage("OTP is required"),
    body("otp").isLength({ min: 6 }).withMessage("Invalid OTP"),
    body("otp").isLength({ max: 6 }).withMessage("Invalid OTP"),
  ];
  await Promise.all(rules.map((rule) => rule.run(req)));
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    return res.render("user-otp-verify", {
      error: errors[0],
      user: null,
      projectId: null,
    });
  }
  next();
};

export const projectValidator = async (req, res, next) => {
  const rules = [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Type is required)"),
  ];
  await Promise.all(rules.map((rule) => rule.run(req)));
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    return res.render("create-project", {
      error: errors[0],
      user: null,
      projectId: null,
    });
  }
  next();
};

export const passwordValidator = async (req, res, next) => {
  const rules = [
    body("password").notEmpty().withMessage("Password is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage(
        "password must be between 8 and 16 characters long and contain at least one uppercase letter and one lowercase letter"
      ),
    body("password")
      .isLength({ max: 16 })
      .withMessage(
        "password must be between 8 and 16 characters long and contain at least one uppercase letter and one lowercase letter"
      ),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm Password is required"),
    body("confirmPassword")
      .equals(body("password"))
      .withMessage("Confirm Password does not match"),
    body("confirmPassword")
      .isLength({ max: 16 })
      .withMessage(
        "Confirm Password must be between 8 and 16 characters long and contain at least one upperc Case letter and one lowercase Case letter"
      ),
    body("confirmPassword")
      .isLength({ min: 8 })
      .withMessage(
        "Confirm Password must be between 8 and 16 characters long and contain at least one upperc Case letter and one lowercase Case letter"
      ),
  ];
  await Promise.all(rules.map((rule) => rule.run(req)));
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();
    return res.render("user-password-reset", {
      error: errors[0],
      user: null,
      projectId: null,
    });
  }
  next();
};
