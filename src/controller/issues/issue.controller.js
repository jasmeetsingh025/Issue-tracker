import {
  getIssue,
  getIssueStatus,
  getIssueTypes,
} from "../../model/issue/issue.repository";
import { getProject } from "../../model/project/project.repository.js";
import { getUserSpecificProjectRepo } from "../../model/user/user.repository.js";

export const showIssue = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const project = getProject(projectId);
    const users = getUserSpecificProjectRepo(projectId);
    const types = getIssueTypes(projectId);
    const status = getIssueStatus(projectId);
    const priority = getIssuePriority(projectId);
    res.render("create-issue", {
      error: null,
      user: req.cookies.user,
      projectId: projectId,
      project: project,
      users: users,
      types: types,
      status: status,
      priority: priority,
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

export const createIssue = async (req, res, next) => {
  try {
    const issueData = req.body;
    const attachments = req.files;
    const projectId = req.params.projectId;
    const userId = req.cookies.user._id;
    const issueCreated = createIssue(issueData, attachments, userId, projectId);
    if (!issueCreated) {
      return res.render("error-404", {
        error: {
          statusCode: 500,
          message: "Error creating issue",
        },
        user: null,
        projectId: null,
      });
    }
    return res.redirect(`/issue-tracker/${projectId}`);
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

export const shpowUpdatedIssue = async (req, res, next) => {
  try {
    const issueId = req.params.issueId;
    const projectId = req.params.projectId;
    const issue = getIssue({ _id: issueId });
    const project = getProject({ _id: projectId });
    const users = getUserSpecificProjectRepo(projectId);
    const types = getIssueTypes(projectId);
    const status = getIssueStatus(projectId);
    const priority = getIssuePriority(projectId);
    return res.render("updtate-issue", {
      error: null,
      user: req.cookies.user,
      status: status,
      project: project,
      users: users,
      types: types,
      priority: priority,
      issue: issue,
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

export const updateIssue = async (req, res, next) => {
  try {
    const data = req.body;
    const issueId = req.params.issueId;
    const projectId = req.params.projectId;
    const attachments = req.files;
    const updatedIssue = await this.issueRepository.updateSpecificIssue(
      issueId,
      data,
      attachments
    );
    if (!updatedIssue) {
      return res.render("error-404", {
        error: {
          statusCode: 500,
          message: "Error updating issue",
        },
        user: null,
        projectId: null,
      });
    }
    return res.redirect(`/issue-tracker/${projectId}`);
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
