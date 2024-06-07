import UserIssueModel from "../user/user.project.issue.schema.js";
import IssueModel from "../issue/issue.schema.js";
import projectModel from "../project/project.schema.js";

export const createIssueRepo = async (
  issueData,
  attachments,
  userId,
  projectId
) => {
  issueData.assignBy = userId;
  if (issueData.assignedTo == "automatic") {
    issueData.assignTo = userId;
  }
  issueData.projectId = projectId;
  const issue = new IssueModel(issueData);
  if (attachments != null && attachments.length > 0) {
    attachments.forEach((file) => {
      issue.attachments.push(file.filename);
    });
  }
  const issueCreated = await issue.save();
  const userIssue = new UserIssueModel({
    userId: userId,
    issueId: issue._id,
    projectID: projectId,
  });
  await userIssue.save();
  await projectModel.findByIdAndUpdate(projectId, { issues: issue._id });
  if (!userIssue || !issueCreated) {
    return {
      message: "Issue not created",
    };
  }
  return issueCreated;
};

export const getIssue = async (factor) => {
  return IssueModel.findOne(factor)
    .populate("assignBy")
    .populate("assignTo")
    .populate("projectId");
};

export const getAllIssues = async (factor) => {
  return await IssueModel.find(factor)
    .populate("assignBy")
    .populate("assignTo")
    .populate("projectId");
};

export const getIssueTypes = async (factor) => {
  const issueType = await IssueModel.findOne(factor);
  return issueType != null ? issueType.issueType : null;
};

export const getIssueStatus = async (factor) => {
  const issueStatus = await IssueModel.findOne(factor);
  return issueStatus != null ? issueStatus.status : null;
};

export const getIssuePriorities = async (factor) => {
  const issuePriority = await IssueModel.findOne(factor);
  return issuePriority ? issuePriority.priority : null;
};

export const searchIssues = async (query) => {
  return await IssueModel.find({
    $or: [{ summary: { $regex: query, $options: "i" } }, { _id: query }],
  });
};

export const filterIssues = async (filters, projectId) => {
  const filter = {};
  if (filters.assignee != "") {
    filter.assignBy = filters.assignee;
  }
  if (filters.type != "") {
    filter.issueType = filters.type;
  }
  if (filters.status != "") {
    filter.status = filters.status;
  }
  if (filters.priority != "") {
    filter.priority = filters.priority;
  }
  filter.projectId = projectId;
  return await IssueModel.find(filter)
    .populate("assignBy")
    .populate("assignTo")
    .populate("projectId");
};

export const updateSpecificIssues = async (issueId, issueData, attachments) => {
  const issue = await IssueModel.findOne({ _id: issueId });
  if (!issue) {
    return {
      message: "Issue not found",
    };
  }
  if (issueData.assignedTo == "automatic") {
    issueData.assignTo = issueData.assignBy;
  }
  const updatedIssue = await IssueModel.findOneAndUpdate(
    { _id: issueId },
    issueData,
    { new: true }
  );
  if (!updatedIssue) {
    return {
      message: "Issue not updated",
    };
  }
  if (attachments.length > 0) {
    attachments.forEach((file) => {
      updatedIssue.attachments.push(file.filename);
    });
  }
  return updatedIssue;
};

export const search = async (query, projectId) => {
  return await IssueModel.find({
    $or: [
      { summary: { $regex: query, $options: "i" } },
      {
        description: { $regex: query, $options: "i" },
      },
      { projectId: projectId },
    ],
  })
    .populate("assignBy")
    .populate("assignTo")
    .populate("projectId");
};
