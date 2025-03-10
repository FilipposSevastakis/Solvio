import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import NewSubmission from "./pages/newSubmission.jsx";
import EditProblem from "./pages/editProblem.jsx";
import ShowResults from "./pages/showResults.jsx";
import ShowMySubmissions from "./pages/showMySubmissions.jsx";
import RegisterPage from "./pages/registerPage.jsx";
import LoginPage from "./pages/loginPage";
import ShowAllSubmissions from "./pages/showAllSubmissions.jsx";
import ViewStatistics from "./pages/viewStatistics.jsx";
import Landing from "./pages/landing.jsx";

import "./index.css";
import { AuthContextProvider } from "./context/authContext.js";

const handleNotification = (message) => {
  console.log("TOAST");
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const router = createBrowserRouter([
  {
    path: "/landing",
    element: (
      <React.Fragment>
        <Navbar />
        <Landing />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/login",
    element: (
      <React.Fragment>
        <Navbar onNotify={(message) => handleNotification(message)} />
        <ToastContainer />
        <LoginPage />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/register",
    element: (
      <React.Fragment>
        <Navbar onNotify={(message) => handleNotification(message)} />
        <ToastContainer />
        <RegisterPage />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/submitproblem",
    element: (
      <React.Fragment>
        <Navbar onNotify={(message) => handleNotification(message)} />
        <ToastContainer />
        <NewSubmission onNotify={(message) => handleNotification(message)} />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/editproblem/:id",
    element: (
      <React.Fragment>
        <Navbar onNotify={(message) => handleNotification(message)} />
        <ToastContainer />
        <EditProblem onNotify={(message) => handleNotification(message)} />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/showresults/:id",
    element: (
      <React.Fragment>
        <Navbar onNotify={(message) => handleNotification(message)} />
        <ToastContainer />
        <ShowResults />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/submissions", //it is the home page for users
    element: (
      <React.Fragment>
        <Navbar onNotify={(message) => handleNotification(message)} />
        <ToastContainer />
        {/* Your other component code */}
        <ShowMySubmissions
          onNotify={(message) => handleNotification(message)}
        />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/allsubmissions", //it is the home page for admins
    element: (
      <React.Fragment>
        <Navbar onNotify={(message) => handleNotification(message)} />
        <ToastContainer />
        <ShowAllSubmissions />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/statistics",
    element: (
      <React.Fragment>
        <Navbar />
        <ViewStatistics />
        <Footer />
      </React.Fragment>
    ),
  },
]);

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="container">
          <RouterProvider router={router} />
        </div>
      </div>
    );
  }
}

export default App;
