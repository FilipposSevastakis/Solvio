//Loading Spinner from : https://contactmentor.com/how-to-add-loading-spinner-react-js/
import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// PAYPAL PAYMENTS WERE FINALLY USED - NOT STRIPE
// import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PaypalPayment from "./PaypalPayment";
import Anonymous from "../images/anonymous-avatar-icon-25.png";
import healthCheck from "../images/healthCheck3.png";

// onNotify (function to create react-toastify notifications)
const Navbar = ({ onNotify }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(!open);
  };
  const myNotify = (message) => {
    onNotify(message);
    setCreditsChanged(!creditsChanged);
  };

  var { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [role, setRole] = useState(null);
  const [credits, setCredits] = useState("");
  const [creditsToBuy, setCreditsToBuy] = useState(0);
  const [username, setUsername] = useState(null);
  const [nameChanged, setNameChanged] = useState(false);
  const [creditsChanged, setCreditsChanged] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [googleuser, setGoogleUser] = useState(null);
  const [profileInfoClass, setProfileInfoClass] = useState(
    "fixed hidden mt-14 ml-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-fit dark:bg-gray-700 dark:divide-gray-600"
  );

  const pathname = window.location.pathname;
  // Extract the last part of the URI
  const pathSegment = pathname.split("/").pop();
  const [usernameInButton, setUsernameInButton] = useState(
    currentUser?.username
  );
  // initial options useful for the PayPal payments
  const initialOptions = {
    clientId:
      "Abm-etelbBB8P8lIP1heUZvy_V4gg1Qzi6emTTY2Nv5_hWy168dVbmDxQd6ge76YcmNobwgL58xvKWlH",
    currency: "USD",
    intent: "capture",
  };
  console.log(username, currentUser);

  // fetch the user's credits
  useEffect(() => {
    const fetchCredits = async (userid) => {
      try {
        const res = await axios.get(
          `http://localhost:8080/auth/getCredits/${userid}`
        );
        console.log(res.data);
        setCredits(res.data.credits);
      } catch (error) {
        console.log(error);
      }
    };
    setUsernameInButton(username);
    if (currentUser && role === "user") {
      fetchCredits(userID);
    }
  }, [nameChanged, currentUser, userID, creditsChanged]);
  // fetch credits whenever these state variables change

  // fetch access token : check if the user is logged in and if so, get info about the user
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/auth/getToken`);
        setAccessToken(res.data.token);
        setRole(res.data.role);
        setUsername(res.data.username);
        setUsernameInButton(res.data.username);
        console.log("TOKEN", res.data);
        if (res.data.token) {
          setUserID(res.data.userid);
          if (res.data.google_access_token) {
            setIsGoogleUser(true);
            setGoogleUser(res.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAccessToken();
  }, [currentUser]);

  // handle username changes
  const handleUsername = (e) => {
    setUsername(e.target.value);
    if (e.target.value.length > 24) {
      setUsernameError("Length is <25");
    } else {
      setUsernameError("");
    }
  };

  // handle username updates calling the corresponding endpoint
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (usernameError === "") {
      try {
        const res = await axios.put(
          "http://localhost:8080/auth/updateUsername",
          {
            oldName: usernameInButton,
            username: username,
            userID: userID,
          }
        );
        setUsernameError("");
        console.log(res.data);
        let user = JSON.parse(localStorage.getItem("user"));
        user.username = username;
        localStorage.setItem("user", JSON.stringify(user));
        document.getElementById("my_modal_1").close();
        setNameChanged(!nameChanged);
        onNotify("Username was updated!");
      } catch (error) {
        console.log("ERROR", error);
        console.log("ERROR", error.response.data);
        setUsernameError(error.response.data);
      }
    }
  };

  // handle credits changes
  const handleCredits = (e) => {
    setCreditsToBuy(e.target.value);
  };

  // ABOUT PAYMENTS WITH STRIPE : IT WAS REMOVED - REPLACED BY PAYPAL PAYMENTS

  // const handleCreditsBuy = async (e) => {
  //   try {
  //     const stripe = await loadStripe(
  //       "pk_test_51PHvOEL9KWQMTSTatKw8UWuoa1oLsN4pyyktesIdVeQHh6nZDhLQLeouBKVFaWMwpNMH6O5Vin5E1xkytZLZDpwm00pRUvSyhF"
  //     );
  //     const res = await axios.put(
  //       `http://localhost:8080/auth/buyCredits/${userID}`,
  //       {
  //         creditsToBuy: creditsToBuy,
  //       }
  //     );
  //     console.log(res.data);
  //     setCreditsChanged(!creditsChanged);

  //     const result = stripe.redirectToCheckout({
  //       sessionId: res.data.id,
  //     });
  //     if (result.error) {
  //       console.log(result.error);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // define the styling of the user's profile dropdown
  const toggleDropdown = () => {
    if (
      profileInfoClass ===
      "fixed hidden mt-14 ml-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-fit dark:bg-gray-700 dark:divide-gray-600"
    ) {
      console.log("TO BE NOT HIDDEN", profileInfoClass);
      setProfileInfoClass(
        "fixed mt-14 ml-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-fit dark:bg-gray-700 dark:divide-gray-600"
      );
    } else {
      console.log("TO BE HIDDEN", profileInfoClass);
      setProfileInfoClass(
        "fixed hidden mt-14 ml-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-fit dark:bg-gray-700 dark:divide-gray-600"
      );
    }
  };

  return (
    <nav className="w-screen bg-orange-200 text-orange-900">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center justify-start">
          <Link
            className="text-xl font-bold uppercase tracking-widest"
            to="/login"
          >
            SOLVIO
          </Link>
        </div>

        <div className="flex justify-end items-center relative">
          <div className="block">
            <div className="inline-flex relative">
              {/* {currentUser &&
                role === "admin" &&
                pathSegment !== "landing" &&
                pathSegment !== "login" &&
                pathSegment !== "statistics" && (
                  <button
                    onClick={() => {
                      navigate("/statistics");
                    }}
                    type="button"
                    className="mr-40 px-4 py-2 inline-flex items-center relative px-2 border rounded-md border-orange-900 hover:shadow-lg bg-yellow-400"
                  >
                    View Statistics
                  </button>
                )} */}
              {currentUser && pathSegment !== "landing" && (
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
                  className="px-4 py-2 inline-flex items-center relative px-2 border bg-red-200 border-orange-900 rounded-full hover:shadow-lg"
                >
                  {usernameInButton}
                </button>
              )}
              <dialog
                id="my_modal_1"
                className="modal p-8 rounded-lg bg-orange-100"
              >
                <div className="modal-box px-4 ">
                  <h3 className="font-bold text-lg">
                    Hello {usernameInButton}!
                  </h3>
                  {!isGoogleUser && role === "user" ? (
                    <p className="py-4">
                      You can update your username and buy credits!
                    </p>
                  ) : (
                    <p className="py-4"></p>
                  )}
                  {!isGoogleUser ? (
                    <div className="mb-2 w-full shadow-lg p-4 rounded-xl bg-orange-200 flex-col items-center justify-center text-center">
                      <input
                        onChange={handleUsername}
                        type="text"
                        placeholder="Username"
                        value={username}
                        className="input text-center py-2 px-4 mb-2 input-bordered w-full max-w-xs rounded-full bg-orange-50"
                      />
                      <form method="dialog">
                        <p class="mt-2 mb-2 flex flex-col text-center text-red-500 ">
                          {usernameError}
                        </p>
                        <button
                          onClick={handleUpdate}
                          className="px-4 py-2 inline-flex items-center relative px-2 border bg-green-200 border-green-900 rounded-xl hover:bg-green-400"
                        >
                          Update
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="mb-2 w-full shadow-lg p-4 rounded-xl bg-orange-200 flex-col items-center justify-center text-center">
                      <input
                        readOnly
                        type="text"
                        placeholder="Username"
                        value={username}
                        className="input text-center py-2 px-4 mb-2 input-bordered w-full max-w-xs rounded-full bg-orange-50"
                      />

                      <p class="mt-2 mb-2 flex flex-col text-center text-red-500 ">
                        Username updates not available for google users!
                      </p>
                    </div>
                  )}
                  {role === "user" && (
                    <div className="mb-10 w-full shadow-lg p-4 rounded-xl bg-orange-200 flex-col items-center justify-center text-center">
                      <div className="flex mt-2 justify-center shadow-xl rounded-lg bg-orange-300">
                        <p className="mb-2 mt-2 py-4 text-xl ">
                          Your credits : {credits}
                        </p>
                      </div>
                      <p className="py-4 mt-4 text-lg ">Buy credits</p>

                      {/* <input
                        type="number"
                        placeholder="credits to buy"
                        onChange={handleCredits}
                        className="input text-center py-2 px-2 mb-2 input-bordered w-fit max-w-xs rounded-full bg-orange-50"
                      /> */}
                      <input
                        type="range"
                        min="1"
                        max="100"
                        className="range w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        onChange={handleCredits}
                      />

                      <form method="dialog">
                        {/* <button
                          onClick={handleCreditsBuy}
                          className="px-4 py-2 inline-flex items-center relative px-2 border bg-green-200 border-green-900 rounded-xl hover:bg-green-400"
                        >
                          Buy
                        </button> */}
                        {creditsToBuy ? (
                          <PayPalScriptProvider options={initialOptions}>
                            <p className="mb-2 mt-2 py-4 text-xl ">
                              Buy {creditsToBuy} credits with Paypal :
                            </p>
                            <PaypalPayment
                              credits={creditsToBuy}
                              onNotifyPaypal={(message) => myNotify(message)}
                              navigate={navigate}
                            />
                          </PayPalScriptProvider>
                        ) : (
                          ""
                        )}
                      </form>
                    </div>
                  )}
                  <div className=" modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button
                        className="px-4 py-2 inline-flex items-center relative px-2 border bg-red-200 border-orange-900 rounded-full hover:shadow-lg btn"
                        onClick={() => setCreditsToBuy("")}
                      >
                        Close
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>
              {!currentUser &&
                pathSegment !== "landing" &&
                pathSegment !== "login" && (
                  <button
                    onClick={() => {
                      navigate("/login");
                    }}
                    type="button"
                    className="ml-10 px-4 py-2 inline-flex items-center relative px-2 border border-orange-900 rounded-full hover:shadow-lg"
                  >
                    Login
                  </button>
                )}{" "}
              {currentUser && !isGoogleUser && pathSegment !== "landing" && (
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  type="button"
                  className="ml-10 px-4 py-2 inline-flex items-center relative px-2 border border-orange-900 rounded-full hover:shadow-lg"
                >
                  Logout
                </button>
              )}
              {isGoogleUser && pathSegment !== "landing" && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-fit">
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center">
                        {/* Your logo or brand */}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {/* Dropdown menu */}
                      <div x-data="{ open: false }" className="relative">
                        <button
                          onClick={toggleOpen}
                          className="bg-white dark:bg-gray-200 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
                          id="user-menu"
                          aria-haspopup="true"
                        >
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-10 w-10 rounded-full"
                            src={googleuser.picture}
                            alt=""
                            crossorigin="anonymous"
                            onError={(e) => {
                              e.target.src =
                                "https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg";
                            }}
                          />
                        </button>
                        {open && (
                          <div
                            className="origin-top-right absolute right-0 mt-2 w-fit px-5 py-3 dark:bg-gray-800 bg-white rounded-lg shadow border dark:border-transparent"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="user-menu"
                            x-show="open"
                          >
                            <ul className="space-y-3 dark:text-white">
                              <li className="font-medium">
                                <div class="px-4 py-3 text-md text-gray-900 dark:text-white">
                                  <div>{googleuser?.username}</div>
                                  <div class="font-medium truncate">
                                    {googleuser?.email}
                                  </div>
                                </div>
                              </li>
                              <li className="font-medium"></li>
                              <hr className="dark:border-gray-700" />
                              <li className="font-medium">
                                <a
                                  href="#"
                                  onClick={() => {
                                    logout();
                                    toggleDropdown();
                                    setIsGoogleUser(false);
                                    navigate("/login");
                                  }}
                                  className="py-2 flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-orange-600"
                                >
                                  <div className="mr-3 text-red-600">
                                    <svg
                                      className="w-6 h-6"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                      ></path>
                                    </svg>
                                  </div>
                                  Logout
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
