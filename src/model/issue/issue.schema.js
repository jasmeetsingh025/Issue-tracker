import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "Project is mandatory"],
  },
  issueType: {
    type: String,
    required: [true, "Issue type is required"],
  },
  status: {
    type: String,
    required: [true, "Status is required"],
  },
  summary: {
    type: String,
    required: [true, "Summary is required"],
  },
  assignBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Assignee is mandatory"],
  },
  assignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: function () {
      return this.assignBy;
    },
  },
  description: {
    type: String,
  },
  severity: {
    type: String,
  },
  priority: {
    type: String,
  },
  attachments: [
    {
      type: String,
    },
  ],
  environment: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

const IssueModel = mongoose.model("Issue", issueSchema);
export default IssueModel;
