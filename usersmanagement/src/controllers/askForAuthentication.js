import axios from "axios";
// The functions below make calls to usersmanagement microservice so as to
// ensure that a user has enough permissions to make a request
// If not enough permissions available, an appropriate status code is returned

// check if a user is logged in
export const isLoggedIn = async (req, res, next) => {
  try {
    console.log("COOKIES", req.cookies);
    // checks if a request is made by an authenticated (logged in) user
    const resp = await axios.post(
      "http://usersmanagement:5000/auth/authenticate",
      {
        request: req.cookies,
      }
    );
    if (!resp.data) {
      return res.status(401).json("Unauthorized : You need to log in!");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.response.data);
  }
};

// check for user's permissions
export const hasUsersPermissions = async (req, res, next) => {
  try {
    console.log("COOKIES", req.cookies);
    // checks if a request is made by an authenticated (logged in) user
    const resp = await axios.post(
      "http://usersmanagement:5000/auth/usersPermissions",
      {
        request: req.cookies,
      }
    );
    if (!resp.data) {
      return res
        .status(403)
        .json("Forbidden : You have no permissions to do this");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.response.data);
  }
};
// check for admin's permissions
export const hasAdminsPermissions = async (req, res, next) => {
  try {
    console.log("COOKIES", req.cookies);
    // checks if a request is made by an authenticated (logged in) user
    const resp = await axios.post(
      "http://usersmanagement:5000/auth/adminsPermissions",
      {
        request: req.cookies,
      }
    );
    if (!resp.data) {
      return res
        .status(403)
        .json("Forbidden : You have no permissions to do this");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.response.data);
  }
};
