import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "name is required"],
    minLength: [3, "name length should be greater than 3"],
    maxLength: [20, "name length should not be more than 20"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select: false,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    validate: {
      validator: function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: "invalid email",
    },
    unique: [true, "email already present"],
  },
  phone: {
    type: Number,
    minLength: [10, "invalid phone number"],
    maxLength: [16, "invalid phone number"],
  },
  profileImage: {
    type: String,
  },
  role: {
    type: String,
    default: "User",
    enum: ["superadmin", "admin", "user"],
  },
  tokens: [
    {
      type: String,
    },
  ],
  jobTitle: {
    type: String,
  },
  department: {
    type: String,
  },
  location: {
    type: String,
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  resetPasswordToken: String,
  resetPasswordTokenExpiry: Date,
});

userSchema.pre("save", function (next) {
  if (this.isModified("username")) {
    this.username = this.username.toLowerCase();
  }
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (e) {
      next(e);
    }
  }
  next();
});
// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_Secret, {
    expiresIn: process.env.JWT_Expire,
  });
};
// user password compare
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// generatePasswordResetOtp
userSchema.methods.getResetPasswordOtp = async function () {
  const otp = (
    Math.floor(Math.random() * (100000 - 999999 + 1)) + 999999
  ).toString();
  this.resetPasswordToken = otp;
  this.resetPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
  return otp;
};

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
