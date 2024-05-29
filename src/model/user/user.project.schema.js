import mongoose from "mongoose";

const userProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "UserId is required"],
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "ProjectId is required"],
  },
});

const UserProjectModel = mongoose.model("UserProject", userProjectSchema);
export default UserProjectModel;
