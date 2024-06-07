import express from "express";
import {
  showIssue,
  shpowUpdatedIssue,
  updateIssue,
  createIssue,
} from "../../controller/issues/issue.controller.js";
import { upload } from "../../../middleware/upload.middleware.js";

const issueRouter = express.Router();

//Get
issueRouter.route("/:projectId").get(showIssue);
issueRouter
  .route("/view/:projectId/:issueId")
  .get(upload.array("attachments"), shpowUpdatedIssue);

//Post
issueRouter.route("/:projectId").post(createIssue);
issueRouter
  .route("/view/:projectId/:issueId")
  .post(upload.array("attachments"), updateIssue);

export default issueRouter;
