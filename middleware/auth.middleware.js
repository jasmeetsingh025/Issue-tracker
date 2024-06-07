import jwt from "jsonwebtoken";
// import ApplicationError from "../util/errorHandler.js";
import UserModel from "../src/model/user/user.schema.js";

export const auth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.redirect("/login");
  }
  const decodedData = jwt.verify(token, process.env.JWT_Secret);
  if (decodedData && req.session.userId) {
    req.user = await UserModel.findById(decodedData.id);
    return next();
  }
};
