import {
  createProjectRepo,
  getProject,
  getUserAllProjects,
} from "../../model/project/project.repository";
import projectModel from "../../model/project/project.schema";
import { findAllUsersRepo } from "../../model/user/user.repository";

export const showNewProject = async (req, res, next) => {
  try {
    return res.render("create-project", {
      error: null,
      user: req.cookies.user,
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

export const createProject = async (req, res, next) => {
  try {
    const user = req.session.userId;
    const { name, description, type, duration } = req.body;
    const isProjectAlreadyExists = getProject({ name: name });
    if (isProjectAlreadyExists) {
      return res.render("create-project", {
        error: {
          statusCode: 400,
          message: "Project already exists",
        },
        user: req.cookies.user,
        projectId: null,
      });
    }
    const project = createProjectRepo({
      name: name,
      description: description,
      type: type,
      duration: duration,
      userId: user,
    });
    if (project) {
      res.render("/issue-tracker");
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

export const filterBySearch = async (req, res, next) => {};

export const filter = async (req, res, next) => {};

export const postAssignMember = async (req, res, next) => {};

export const showAssignMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const users = findAllUsersRepo();
    return res.render("members", {
      user: req.cookies.user,
      members: users,
      projectId: projectId,
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

export const showMainPage = async (req, res, next) => {};

export const showLoginPage = async (req, res, next) => {};

// IssueTracker page
export const showLandingPage = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const projects = getUserAllProjects(userId);
    res.render("landing-page", {
      user: req.cookies.user,
      projects: projects,
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
