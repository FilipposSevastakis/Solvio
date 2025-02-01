//Loading Spinner from : https://contactmentor.com/how-to-add-loading-spinner-react-js/
import LoginPhoto from "../images/loginPhoto.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
const RegisterPage = () => {
  const navigate = useNavigate();
  // state variables related to user's credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerific, setPasswordVerific] = useState("");
  const [passwordErrorVerif, setPasswordErrorVerif] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // handle username changes and make input validations
  const handleUsername = (e) => {
    setUsername(e.target.value);
    if (e.target.value.length > 24) {
      setUsernameError("Length must be <25");
    } else {
      setUsernameError("");
    }
  };
  // handle password changes and make input validations
  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setPasswordError("Too short password!");
    } else if (!/[a-zA-Z]/.test(e.target.value)) {
      setPasswordError("Must contain letters");
    } else if (!/\d/.test(e.target.value)) {
      setPasswordError("Must contain numbers");
    } else if ((e.target.value.match(/[!@#%$&]/g) || []).length < 2) {
      setPasswordError(
        "Must contain at least 2 special characters (!, @, #, %, $, %)"
      );
    } else {
      setPasswordError("");
    }
  };

  // handle password verification error
  const handlePasswordVerific = (e) => {
    setPasswordVerific(e.target.value);
    if (e.target.value != password) {
      setPasswordErrorVerif("Passwords do not match");
    } else {
      setPasswordErrorVerif("");
    }
  };

  // submit credentials and call the register endpoint to register the user
  // handle error cases (for example, if a user already exists or the password is false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length === 0 || password.length === 0) {
      setRegisterError("Missing values!");
    } else if (usernameError !== "") {
      setRegisterError("Check for errors!");
    } else {
      setRegisterError("");
      if (password === passwordVerific) {
        setPasswordErrorVerif("");
        try {
          const res = await axios.post(`http://localhost:8080/auth/register`, {
            username: username,
            password: password,
          });
          console.log(res.data);
          if (res.data == "User has been created!") {
            navigate("/login");
          }
        } catch (error) {
          console.log(error);
          setRegisterError(error.response.data);
        }
      } else {
        setRegisterError("Check for errors!");
        setPasswordErrorVerif("Passwords do not match");
      }
    }
  };

  // render the register page
  return (
    <div class="relative flex h-screen w-screen">
      <div class="h-screen w-2/5 bg-black-900">
        <img src={LoginPhoto} class="h-full w-full" />
      </div>
      <div class="h-screen w-3/5 bg-orange-900">
        <div class="mx-auto flex h-screen w-2/3 flex-col justify-center text-white xl:w-1/3">
          <div class="flex justify-center">
            <p class="text-3xl text-orange-100">Sign up</p>
          </div>
          <div class="mt-10">
            <form>
              <div class="flex-col">
                <label class="mb-3 block font-extrabold" for="username">
                  Username
                </label>
                <input
                  name="username"
                  onChange={handleUsername}
                  type="username"
                  id="username"
                  class="inline-block w-full rounded-full bg-orange-50 p-2.5 leading-none text-black placeholder-yellow-900 shadow placeholder:opacity-30"
                  placeholder="username"
                />
                <p class="mt-2 mb-10 flex flex-col text-center text-md text-red-500 ">
                  {usernameError}
                </p>
              </div>
              <div class="mt-10">
                <label class="mb-3 block font-extrabold" for="password">
                  Password
                </label>
                <input
                  name="password"
                  onChange={handlePassword}
                  type="password"
                  id="password"
                  class="inline-block w-full rounded-full bg-orange-50 p-2.5 leading-none text-black placeholder-yellow-900 shadow placeholder:opacity-30"
                  placeholder="password"
                />
                <p class="mt-2 mb-10 flex flex-col text-center text-md text-red-500 ">
                  {passwordError}
                </p>
              </div>
              <div class="mt-10">
                <label class="mb-3 block font-extrabold" for="password">
                  Verify your password
                </label>
                <input
                  name="passwordVerific"
                  onChange={handlePasswordVerific}
                  type="password"
                  id="password"
                  class="inline-block w-full rounded-full bg-orange-50 p-2.5 leading-none text-black placeholder-yellow-900 shadow placeholder:opacity-30"
                  placeholder="password"
                />
                <p class="mt-2 mb-10 flex flex-col text-center text-md text-red-500 ">
                  {passwordErrorVerif}
                </p>
              </div>
              <p class="text-sm mt-10">
                You already have an account ?{" "}
                <Link class="text-blue-400 underline" to="/login">
                  Login
                </Link>
              </p>
              <div class="my-10">
                <button
                  onClick={handleSubmit}
                  class="w-full rounded-full bg-orange-700 p-5 hover:bg-orange-600"
                >
                  Register
                </button>
                <p class="mt-2 mb-10 flex flex-col text-center text-md text-red-500 ">
                  {registerError}
                </p>
              </div>
            </form>
          </div>
          {/* <div>
        <fieldset class="border-t border-solid border-orange-100">
          <legend class="mx-auto px-2 text-center text-sm text-orange-100">Or sign up with Google</legend>
        </fieldset>
      </div>
      <div class="my-10">
        <button class="flex w-full justify-center rounded-3xl border-none bg-white p-1 text-black hover:bg-orange-100 sm:p-3"><img src={GoogleLogo} class="mr-4 w-6 object-fill" />Sign up with Google</button>
      </div> */}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
