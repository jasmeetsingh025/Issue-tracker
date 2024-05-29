import express from "express";
import {
  createProject,
  filter,
  filterBySearch,
  postAssignMember,
  showAssignMember,
  showLandingPage,
  showMainPage,
  showNewProject,
} from "../../controller/projects/project.controller.js";
import { projectValidator } from "../../../middleware/userValidator.middleware.js";

const projectRoutes = express.Router();

// Get Routes
projectRoutes.route("/create").get(showNewProject);
projectRoutes.route("/:projectId/assignMember").get(showAssignMember);
projectRoutes.route("/:projectId").get(showMainPage);
projectRoutes.route("/").get(showLandingPage);
// Issie tracking page
projectRoutes.route("/").get(showLandingPage);
// Post Routes
projectRoutes.route("/create").post(projectValidator, createProject);
projectRoutes.route("/:projectid/search").post(filterBySearch);
projectRoutes.route("/:projectid/filter").post(filter);
projectRoutes.route("/:projectId/assignMember/:userId").post(postAssignMember);

export default projectRoutes;
