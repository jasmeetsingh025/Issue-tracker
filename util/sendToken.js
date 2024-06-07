// create token and save into cookie

export const sendToken = async (user) => {
  return user.getJWTToken();
};
