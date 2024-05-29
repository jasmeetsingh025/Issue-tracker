import mongoose from "mongoose";

const userIssueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "UserId is required"],
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: [true, "IssueId is required"],
  },
  projectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "ProjectId is required"],
  },
});

const UserIssueModel = mongoose.model("UserIssue", userIssueSchema);
export default UserIssueModel;
