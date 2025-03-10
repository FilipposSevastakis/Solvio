import LoginPhoto from "../images/loginPhoto.png";
import GoogleLogo from "../images/googleLogo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
const LoginPage = () => {
  const searchParams = new URLSearchParams(useLocation().search);
  let isGoogleLogin = searchParams.get("google") === "true";
  const googleToken = searchParams.get("token");
  console.log("Is Google login:", isGoogleLogin);
  const { login, googleLogin } = useContext(AuthContext);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(null);
  // state variables related to the user's credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [problemID, setProblemID] = useState(searchParams.get("showresults"));

  // used for redirection in the results page for a specific problem
  if (problemID) {
    localStorage.setItem(
      "problemToShowResults",
      JSON.stringify({ problemID: problemID })
    );
  }

  const navigate = useNavigate();

  const navig = (url) => {
    window.location.href = url;
  };

  // navigate to google login page
  async function auth() {
    const response = await fetch(
      "http://127.0.0.1:5001/googleAuth/googleRequest",
      {
        method: "post",
      }
    );
    const data = await response.json();
    navig(data.url);
  }

  // handle username updates making the necessary validations
  const handleUsername = (e) => {
    setUsername(e.target.value);
    if (e.target.value.length > 24) {
      setUsernameError("Length is <25");
    } else {
      setUsernameError("");
    }
  };
  // handle password updates
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // handle submission of credentials
  // make some simple frontend validations and call the
  // login function (that calls the login endpoint)
  // after logging in, call fetch access token to verify the successful login
  // and redirect to the correct page
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length === 0 || password.length === 0) {
      setLoginError("Missing values!");
    } else if (usernameError !== "") {
      setLoginError("Check for errors!");
    } else {
      setLoginError("");
      try {
        const result = await login({
          username: username,
          password: password,
        });
        fetchAccessToken();
      } catch (error) {
        console.log(error.response.data);
        setLoginError(error.response.data);
      }
    }
  };

  // check if an access token is available (i.e. the user is logged in) and retrieve user's information
  // navigate to the correct page corresponding to the user's role
  const fetchAccessToken = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/auth/getToken`);
      if (res.data.token) {
        setAccessToken(res.data.token);
        setRole(res.data.role);
        console.log("TOKEN", res.data);
        setUserId(JSON.parse(localStorage.getItem("user")).id);
        let probID = JSON.parse(localStorage.getItem("problemToShowResults"));
        console.log("probID", probID, typeof probID);
        if (probID?.problemID !== null && probID?.problemID !== undefined) {
          console.log("probID2", probID, typeof probID);
          navigate(`/showresults/${probID?.problemID}?forwardeddone=true`);
        } else {
          if (res.data.role === "user") {
            console.log("USER - NAV TO SUBMISSIONS");
            navigate("/submissions");
          }
          if (res.data.role === "admin") {
            navigate("/allsubmissions");
          }
        }
      } else {
        console.log("NO ACCESS TOKEN FOUND");
        setAccessToken(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // if the user is going to login via google, call googleLogin function
  // which is going to register the user as a google user and create the necessary JWT
  // After that, call fetchAccessToken to verify the successful login and redirect to the correct page
  useEffect(() => {
    const executeGoogleLoginOrFetchToken = async () => {
      try {
        setLoading(true);
        if (isGoogleLogin) {
          isGoogleLogin = false;
          console.log("GOOGLE TOKEN", googleToken);
          const googleUser = await googleLogin(googleToken); // Wait for googleLogin to complete
          console.log("GU", googleUser);
        }
        setTimeout(() => {
          fetchAccessToken();
        }, 300);
      } catch (error) {
        console.log(error);
      }
    };
    executeGoogleLoginOrFetchToken();
  }, [problemID]);

  // if the access token is not fetched or google login is under processing, just show a loading spinner
  if (accessToken === null) {
    return (
      <div class="bg-orange-50 bg-cover w-screen h-screen flex items-center justify-center overflow-auto">
        <div role="status">
          <svg
            aria-hidden="true"
            class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-300 fill-orange-800"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (loading === true) {
    return (
      <div class="bg-orange-50 bg-cover w-screen h-screen flex items-center justify-center overflow-auto">
        <div role="status">
          <svg
            aria-hidden="true"
            class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-300 fill-orange-800"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // else render the main login page
  return (
    <div class="relative flex h-screen w-screen">
      <div class="h-screen w-2/5 bg-black-900">
        <img src={LoginPhoto} class="h-full w-full" />
      </div>
      <div class="h-screen w-3/5 bg-orange-900">
        <div class="mx-auto flex h-screen w-2/3 flex-col justify-center text-white xl:w-1/3">
          <div class="flex justify-center">
            {problemID ? (
              <p class="mb-4 text-3xl text-yellow-400 text-center">
                Login so as to see your results
              </p>
            ) : (
              <p class="text-3xl text-orange-100">Login</p>
            )}
          </div>
          <div class="mt-10">
            <form>
              <div class="flex-col">
                <label class="mb-3 block font-extrabold" for="username">
                  Username
                </label>
                <input
                  onChange={handleUsername}
                  type="username"
                  id="username"
                  class="inline-block w-full rounded-full bg-orange-50 p-2.5 leading-none text-black placeholder-yellow-900 shadow placeholder:opacity-30"
                  placeholder="username"
                />
                <p class="mt-1 mb-3 flex flex-col text-center text-md text-red-500 ">
                  {usernameError}
                </p>
              </div>
              <div class="mt-5">
                <label class="mb-3 block font-extrabold" for="password">
                  Password
                </label>
                <input
                  onChange={handlePassword}
                  type="password"
                  id="password"
                  class="inline-block w-full rounded-full bg-orange-50 p-2.5 leading-none text-black placeholder-yellow-900 shadow placeholder:opacity-30"
                  placeholder="password"
                />
              </div>
              <p class="text-sm mt-3">
                You don't have an account yet ?{" "}
                <Link class="text-blue-400 underline" to="/register">
                  Register
                </Link>
              </p>
              <div class="my-10">
                <button
                  onClick={handleSubmit}
                  class="w-full rounded-full bg-orange-700 p-5 hover:bg-orange-600"
                >
                  Login
                </button>
                <p class="mt-2 mb-10 flex flex-col text-center text-md text-red-500 ">
                  {loginError}
                </p>
              </div>
            </form>
          </div>
          <div>
            <fieldset class="border-t border-solid border-orange-100">
              <legend class="mx-auto px-2 text-center text-sm text-orange-100">
                Or sign in with Google
              </legend>
            </fieldset>
          </div>
          <div class="my-10">
            <button
              onClick={() => auth()}
              class="flex w-full justify-center rounded-3xl border-none bg-white p-1 text-black hover:bg-orange-100 sm:p-3"
            >
              <img src={GoogleLogo} class="mr-4 w-6 object-fill" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
