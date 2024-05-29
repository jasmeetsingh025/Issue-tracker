import projectModel from "./project.schema";
import UserProjectModel from "../user/user.project.schema";

export const getProject = async (filter) => {
  return await projectModel.find(filter);
};

export const createProjectRepo = async (projectData) => {
  const project = new projectModel(projectData);
  await project.save();
  const userProject = new UserProjectModel({
    userId: projectData.createdBy,
    projectId: project._id,
  });
  await userProject.save();
  return project;
};

export const findUserProject = async (filter) => {
  return await UserProjectModel.findOne(filter);
};

export const getUserAllProjects = async (filter) => {
  return await UserProjectModel.find(filter).populate("projectId");
};
