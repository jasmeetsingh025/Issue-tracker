import UserModel from "./user.schema";
import UserProjectModel from "./user.project.schema";
import UserIssueModel from "./user.project.issue.schema";
import ApplicationError from "../../../util/errorHandler";

export const createUserRepo = async (userData) => {
  const user = new UserModel(userData);
  return await user.save();
};

export const findUserRepo = async (factor, withPassword = false) => {
  if (withPassword) return await UserModel.find(factor).select("+password");
  return await UserModel.findOne(factor);
};

export const findUserForPasswordResetRepo = async (hashtoken) => {
  return await UserModel.findOne({
    resetPasswordToken: hashtoken,
    resetPasswordExpire: { $gt: Date.now() },
  });
};

export const findAllUsersRepo = async () => {
  return await UserModel.find();
};

export const getUserSpecificProjectRepo = async (projectId) => {
  return await UserProjectModel.find({ projectId: projectId })
    .populate("userId")
    .populate("projectId");
};

export const getIssueSpecificToProjectRepo = async (projectId) => {
  return await UserIssueModel.find({ projectID: projectId })
    .populate("userId")
    .populate("projectId")
    .populate("issueId");
};
