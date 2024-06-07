import UserModel from "./user.schema.js";
import UserProjectModel from "./user.project.schema.js";
import UserIssueModel from "./user.project.issue.schema.js";

export const createUserRepo = async (userData) => {
  const user = new UserModel(userData);
  return user.save();
};

export const findUserRepo = async (factor, withPassword = false) => {
  if (withPassword) return UserModel.findOne(factor).select("+password");
  return UserModel.findOne(factor);
};

export const findUserForPasswordResetRepo = async (hashtoken) => {
  const user = await UserModel.findOne({ resetPasswordToken: hashtoken });
  if (!user) {
    return null;
  }
  const currentTime = new Date();
  if (user.resetPasswordTokenExpiry < currentTime) {
    return null;
  }
  return user;
};

export const findAllUsersRepo = async () => {
  return UserModel.find();
};

export const getUserSpecificProjectRepo = async (projectId) => {
  return UserProjectModel.find({ projectId: projectId })
    .populate("userId")
    .populate("projectId");
};

export const getIssueSpecificToProjectRepo = async (projectId) => {
  return UserIssueModel.find({ projectID: projectId })
    .populate("userId")
    .populate("projectId")
    .populate("issueId");
};
