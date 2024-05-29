import mongoose from "mongoose";
import UserProjectRelationModel from "../user/user.project.schema.js";
import UserProjectIssueRelationModel from "../user/user.project.issue.schema.js";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: [3, "name length should be greater than 3"],
    maxLength: [20, "name length should not be more than 20"],
    unique: [true, "name already present"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
    minLength: [3, "description length should be greater than 3"],
    maxLength: [200, "description length should not be more than 200"],
  },
  organisation: {
    type: String,
    required: [true, "organisation is required"],
  },
  type: {
    type: String,
    enum: ["Web Development", "Android Development"],
    required: [true, "type is required"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User Id is required"],
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  issues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
  createdOnDate: {
    type: Date,
    default: Date.now(),
  },
  duration: {
    type: Date,
    default: Date.now + 1 * 12 * 365 * 24 * 60 * 60 * 1000,
  },
});

projectSchema.pre("deleteOne", async function (next) {
  try {
    projectId = this.getQuery._id;
    await UserProjectRelationModel.deleteMany({ projectId });
    await UserProjectIssueRelationModel.deleteMany({ projectId });
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

const projectModel = mongoose.model("Project", projectSchema);
export default projectModel;
