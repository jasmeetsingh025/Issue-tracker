import projectModel from "./project.schema.js";
import UserProjectModel from "../user/user.project.schema.js";
import UserModel from "../user/user.schema.js";

export const getProject = async (filter) => {
  return projectModel.findOne(filter);
};

export const createProjectRepo = async (projectData) => {
  const project = new projectModel(projectData);
  await project.save();
  const userProject = new UserProjectModel({
    userId: projectData.createdBy,
    projectId: project._id,
  });
  await userProject.save();
  await UserModel.findByIdAndUpdate(projectData.createdBy, {
    $push: { projects: project._id },
  });
  return project;
};

export const findUserProject = async (filter) => {
  return await UserProjectModel.findOne(filter);
};

export const getUserAllProjects = async (filter, page, perPage) => {
  return UserProjectModel.find(filter)
    .populate("projectId")
    .skip(perPage * page - perPage)
    .limit(perPage);
};
