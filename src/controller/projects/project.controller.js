import {
  getAllIssues,
  getIssueTypes,
  getIssueStatus,
  getIssuePriorities,
} from "../../model/issue/issue.repository.js";
import {
  createProjectRepo,
  findUserProject,
  getProject,
  getUserAllProjects,
} from "../../model/project/project.repository.js";
import UserProjectModel from "../../model/user/user.project.schema.js";
import { findAllUsersRepo } from "../../model/user/user.repository.js";

export const showNewProject = async (req, res, next) => {
  try {
    if (!req.cookies.user) {
      return res.render("error-404", {
        error: {
          statusCode: 400,
          message: "Please first login to the website.",
        },
        user: null,
        projectId: null,
      });
    }
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
    const { name, description, type, duration, organisation } = req.body;
    const isProjectAlreadyExists = await getProject({ name: name });
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
    const project = await createProjectRepo({
      name: name,
      description: description,
      type: type,
      duration: duration,
      createdBy: user,
      organisation: organisation,
    });
    if (project) {
      res.redirect("/issue-tracker");
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

export const postAssignMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const isAlreadyAssigned = await findUserProject({
      userId: userId,
      projectId: projectId,
    });
    if (isAlreadyAssigned) {
      return res.render("members", {
        error: {
          errorMessage: "user already assigned",
        },
        userId: userId,
        projectId: projectId,
      });
    }
    const assignProject = new UserProjectModel({
      userId: userId,
      projectId: projectId,
    });
    await assignProject.save();
    return res.render("members", {
      error: null,
      userId: userId,
      projectId: projectId,
      msg: "user already assigned",
    });
  } catch (error) {
    console.log(error.message);
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

export const showAssignMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const users = await findAllUsersRepo();
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

export const showMainPage = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const users = await findAllUsersRepo();
    const types = await getIssueTypes({ projectId: projectId });
    const status = await getIssueStatus({ projectId: projectId });
    const priority = await getIssuePriorities({ projectId: projectId });
    const project = await getProject({ _id: projectId });
    const issues = await getAllIssues({ projectId: projectId });

    return res.render("main-page.ejs", {
      user: req.cookies.user,
      issues: issues,
      status: status,
      priority: priority,
      projectId: projectId,
      types: types,
      project: project,
      users: users,
    });
  } catch (error) {
    console.log(error.message);
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

export const showLoginPage = async (req, res, next) => {};

// IssueTracker page
export const showLandingPage = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const projects = await getUserAllProjects(
      { userId: userId },
      page,
      perPage
    );
    if (userId == null) {
      return res.render("user-login", {
        error: {
          statusCode: 400,
          message: "Please first login to the website.",
        },
        user: null,
        projectId: null,
      });
    }
    res.render("landing-page", {
      user: req.cookies.user,
      projects: projects,
      projectId: null,
      currentPage: page,
      perPage: perPage,
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
