import React, { useEffect, useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// onNotify (function to create react-toastify notifications)
const EditProblem = ({ onNotify }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [showModalInput, setShowModalInput] = React.useState(false);
  const [showModalScript, setShowModalScript] = React.useState(false);
  const [file1Error, setFile1Error] = useState("");
  const [file2Error, setFile2Error] = useState("");
  // state variables related to the problem's params
  const [inputDataFile, setInputDataFile] = useState("");
  const [inputScriptFile, setInputScriptFile] = useState("");
  const [inputDataFileName, setInputDataFileName] = useState("");
  const [inputScriptFileName, setInputScriptFileName] = useState("");
  const [textContent1, setTextContent1] = useState("");
  const [textContent2, setTextContent2] = useState("");
  const [model, setModel] = useState("No model selected");
  const [isOpen, setIsOpen] = useState(true); // Set to true to open the dropdown by default
  const viewOnly = useLocation().search === "?viewOnly=true";
  console.log("VIEW ONLY", viewOnly);
  // const models = [
  //   "No model selected",
  //   "Model 1 : Vehicle Routing Problem (VRP)",
  //   "Model 2 : Solve problem 2",
  //   "Model 3 : Solve problem 3",
  //   "Model 4 : Solve problem 4",
  // ];
  // const [dropDownClass, setDropdownClass] = useState(
  //   "hidden rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1"
  // );
  const [numVehicles, setNumVehicles] = useState("");
  const [vehiclesError, setVehiclesError] = useState("");
  const [depot, setDepot] = useState("");
  const [depotError, setDepotError] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [distanceError, setDistanceError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [problemId, setProblemId] = useState(
    useLocation().pathname.split("/")[2]
  );
  const [name, setName] = useState("");
  // regular expression to recognize numbers
  const numberRegex = /^[0-9]+$/;

  // check if the user is logged in and get info about the user
  // also fetch information about a specific problem
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/auth/getToken`);
        setAccessToken(res.data.token);
        setRole(res.data.role);
        console.log("TOKEN", res.data);
        if (res.data.token) {
          setUserId(JSON.parse(localStorage.getItem("user")).id);
        } else {
          setAccessToken(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/submitProblem/getProblemInfo/${problemId}`
        );

        console.log("INFO", res.data.problem);
        setModel(res.data.problem[0].model);
        setInputDataFile(
          JSON.stringify(res.data.problem[0].inputDataFile.content, null, 2)
        );
        setInputScriptFile(res.data.problem[0].pythonScript.script);
        setNumVehicles(res.data.problem[0].extraParams.numVehicles);
        setDepot(res.data.problem[0].extraParams.depot);
        setMaxDistance(res.data.problem[0].extraParams.maxDistance);
        setTextContent1(res.data.problem[0].inputDataFile.info);
        setTextContent2(res.data.problem[0].pythonScript.info);
        setName(res.data.problem[0].name);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAccessToken();
    fetchData();
  }, []);

  // define a block of code (so as to show the .json and .py input files)
  function MyCoolCodeBlock({ code, language, showLineNumbers }) {
    return (
      <div class="ml-10 mr-10">
        <CopyBlock
          text={code}
          language={language}
          showLineNumbers={showLineNumbers}
          theme={dracula}
          codeBlock
        />
      </div>
    );
  }

  // // just defining the styling of the dropdown
  // function toggleDropdown() {
  //   setIsOpen(!isOpen);
  //   if (isOpen) {
  //     setDropdownClass(
  //       "rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1"
  //     );
  //   } else {
  //     setDropdownClass(
  //       "hidden rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1"
  //     );
  //   }
  // }

  // const handleDropdownClick = () => {
  //   toggleDropdown();
  // };

  // const handleSearch = (e) => {
  //   const searchTerm = e.target.value.toLowerCase();
  //   const items = document
  //     .getElementById("dropdown-menu")
  //     .querySelectorAll("a");
  //   items.forEach((item) => {
  //     const text = item.textContent.toLowerCase();
  //     if (text.includes(searchTerm)) {
  //       item.style.display = "block";
  //     } else {
  //       item.style.display = "none";
  //     }
  //   });
  // };

  // handle drag and drop functionalities of file inputs
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!viewOnly) {
      e.target.classList.add("border-orange-500", "border-2");
    }
  };

  const handleDragLeave = (e) => {
    if (!viewOnly) {
      e.target.classList.remove("border-orange-500", "border-2");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!viewOnly) {
      e.target.classList.remove("border-orange-500", "border-2");
      const files = e.dataTransfer.files;
      console.log(e.target);
      if (e.target.id == "dropzone1") {
        handleFiles(files, 1);
      } else {
        handleFiles(files, 2);
      }
    }
  };

  const handleInputChange = (e) => {
    if (!viewOnly) {
      const files = e.target.files;
      if (e.target.id == "fileInput") {
        handleFiles(files, 1);
      } else {
        handleFiles(files, 2);
      }
    }
  };

  // read the input files and check if their format is valid
  // change the corresponding state variables including those containing info about the submitted
  // input files (name, size)
  function handleFiles(files, id) {
    for (const file of files) {
      if (
        (file.name.split(".")[1] != "json" && id == 1) ||
        (file.name.split(".")[1] != "py" && id == 2)
      ) {
        if (file.name.split(".")[1] != "json" && id == 1) {
          setInputDataFile("");
          setInputDataFileName("");
          setFile1Error("Not valid file format!");
        }
        if (file.name.split(".")[1] != "py" && id == 2) {
          setInputScriptFile("");
          setInputScriptFileName("");
          setFile2Error("Not valid file format!");
        }
        return;
      }
      setFile1Error("");
      setFile2Error("");
      const reader = new FileReader();
      if (file.type === "text/x-python" || file.name.endsWith(".py")) {
        reader.onload = function (event) {
          const contents = event.target.result;
          if (id == 2) {
            setInputScriptFile(contents);
            setInputScriptFileName(file.name);
            setTextContent2(`${file.name} (${formatBytes(file.size)})`);
          }
        };
        reader.readAsText(file);
      }
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        reader.onload = function (event) {
          const contents = event.target.result;
          if (id == 1) {
            setInputDataFile(contents);
            setInputDataFileName(file.name);
            setTextContent1(`${file.name} (${formatBytes(file.size)})`);
          }
        };
        reader.readAsText(file);
      }
    }
  }

  // calculate input files' size
  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  const handleName = (e) => {
    setName(e.target.value);
  };

  // handle update submissions
  // check for missing or invalid inputs
  // and call the corresponding endpoint to update the problem
  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = false;
    setSubmitError("");
    if (
      inputDataFile === "" ||
      inputScriptFile === "" ||
      numVehicles === "" ||
      depot === "" ||
      maxDistance === "" ||
      name === ""
    ) {
      setSubmitError("Missing values!");
      error = true;
    }
    if (
      vehiclesError !== "" ||
      depotError !== "" ||
      distanceError !== "" ||
      file1Error != "" ||
      file2Error != ""
    ) {
      setSubmitError("Some fields are not correct. Try again!");
      error = true;
    }

    if (!error) {
      let extraParams = {
        numVehicles: numVehicles,
        depot: depot,
        maxDistance: maxDistance,
      };

      try {
        console.log(typeof inputScriptFile);
        let inputDataFileJSON = {};
        inputDataFileJSON.content = JSON.parse(inputDataFile);
        inputDataFileJSON.info = textContent1;

        const res = await axios.put(
          `http://localhost:8080/api/submitProblem/updateSubmission`,
          {
            userID: userId,
            pythonScript: {
              script: `${inputScriptFile}`,
              info: `${textContent2}`,
            },
            inputDataFile: inputDataFileJSON,
            status: "ready",
            extraParams: extraParams,
            problemId: problemId,
            name: name,
          }
        );

        console.log("DATA", res.data.problem);
        navigate("/submissions");
        onNotify("The problem was updated!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  // handle changes in the number of vehicles
  // (also check for valid values)
  const handleVehicles = (e) => {
    setNumVehicles(e.target.value);
    if (!e.target.value.match(numberRegex) && e.target.value !== "") {
      setVehiclesError("Must be a number!");
    } else {
      setVehiclesError("");
    }
  };

  // handle changes in the depot param
  // (also check for valid values)
  const handleDepot = (e) => {
    setDepot(e.target.value);
    if (!e.target.value.match(numberRegex) && e.target.value !== "") {
      setDepotError("Must be a number!");
    } else {
      setDepotError("");
    }
  };

  // handle changes in distance param
  // (also check for valid values)
  const handleDistance = (e) => {
    setMaxDistance(e.target.value);
    if (!e.target.value.match(numberRegex) && e.target.value !== "") {
      setDistanceError("Must be a number!");
    } else {
      setDistanceError("");
    }
  };

  // if the access token is not fetched, just show a loading spinner
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
  // when user information is fetched, load the main page
  // be sure that the user is either an admin with readonly permissions or a regular user
  if (
    (accessToken && role != "admin") ||
    (accessToken && role === "admin" && viewOnly)
  ) {
    return (
      <React.Fragment>
        <div class=" bg-orange-50 bg-cover w-screen h-screen flex-col items-center justify-center overflow-auto">
          <div class="w-full p-9 mt-10 bg-red-100 rounded-lg shadow-lg mb-10">
            <h1 class="text-center text-xl sm:text-xl font-semibold mb-4 text-gray-800">
              Selected model
            </h1>
            <h1 class="text-center text-xl sm:text-xl font-semibold mb-4 text-gray-800">
              {model}
            </h1>
          </div>

          {model === "Model 1 : Vehicle Routing Problem (VRP)" && isOpen && (
            <div class="flex justify-center items-start gap-5 mt-20">
              <div class="w-fit max-w-md p-9 bg-orange-100 rounded-lg shadow-lg mb-10">
                <h1 class="text-center text-2xl sm:text-2xl font-semibold mb-4 text-gray-800">
                  Upload the file containing the input data (.json)
                </h1>
                <div
                  class="bg-gray-100 p-8 text-center rounded-lg border-dashed border-2 border-gray-300 hover:border-orange-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                  id="dropzone1"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label
                    id="dropzone1"
                    for="fileInput"
                    class="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <svg
                      id="dropzone1"
                      class="w-16 h-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    <span id="dropzone1" class="text-gray-600">
                      Drag and drop your files here
                    </span>
                    <span id="dropzone1" class="text-gray-500 text-sm">
                      (or click to select)
                    </span>
                  </label>
                  {!viewOnly ? (
                    <input
                      type="file"
                      id="fileInput"
                      class="hidden"
                      onChange={handleInputChange}
                    />
                  ) : (
                    <input
                      readOnly
                      type="file"
                      id="fileInput"
                      class="hidden"
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                {inputDataFile && (
                  <div class="mt-6 text-center" id="fileList1">
                    <p class="flex flex-col mb-2">{textContent1}</p>{" "}
                    <button
                      className="bg-orange-900 text-white hover:bg-orange-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModalInput(true)}
                    >
                      Open input data file
                    </button>
                  </div>
                )}
                <p class="flex flex-col mb-2 text-center text-red-500 mt-5">
                  {file1Error}
                </p>
              </div>

              <div class="w-fit max-w-md p-9 bg-orange-100 rounded-lg shadow-lg mb-10">
                <h1 class="text-center text-2xl sm:text-2xl font-semibold mb-4 text-gray-800">
                  Upload the script (.py) to be executed
                </h1>
                <div
                  class="bg-gray-100 p-8 text-center rounded-lg border-dashed border-2 border-gray-300 hover:border-orange-700 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                  id="dropzone2"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <label
                    id="dropzone2"
                    for="fileInput2"
                    class="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <svg
                      id="dropzone2"
                      class="w-16 h-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    <span id="dropzone2" class="text-gray-600">
                      Drag and drop your files here
                    </span>
                    <span id="dropzone2" class="text-gray-500 text-sm">
                      (or click to select)
                    </span>
                  </label>
                  {!viewOnly ? (
                    <input
                      type="file"
                      id="fileInput2"
                      class="hidden"
                      onChange={handleInputChange}
                    />
                  ) : (
                    <input
                      readOnly
                      type="file"
                      id="fileInput2"
                      class="hidden"
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                {inputScriptFile && (
                  <div class="mt-6 text-center" id="fileList2">
                    <React.Fragment>
                      <p class="flex flex-col mb-2">{textContent2}</p>
                      <button
                        className="bg-orange-900 text-white hover:bg-orange-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModalScript(true)}
                      >
                        Open script
                      </button>
                    </React.Fragment>
                  </div>
                )}
                <p class="flex flex-col mb-2 text-center text-red-500 mt-5">
                  {file2Error}
                </p>
              </div>
            </div>
          )}
          {/* <div class="flex flex-col justify-center items-center relative p-10 mt-10 bg-white rounded-lg shadow-lg gap-3"> 
                    <p class="text-center text-2xl sm:text-2xl font-semibold mb-4 text-gray-800">Chosen Solver's Model</p>
                    <p class="text-center text-xl sm:text-xl font-semibold mb-4 text-gray-800">{model}</p>
            </div> */}
          {model === "Model 1 : Vehicle Routing Problem (VRP)" && isOpen && (
            <div class="gap-10 mt-10 flex justify-center items-center relative">
              <div class="flex flex-col justify-center items-center relative">
                <label class="mb-3 block font-extrabold" for="num_vehicles">
                  Number of vehicles
                </label>
                {!viewOnly ? (
                  <input
                    value={numVehicles}
                    onChange={handleVehicles}
                    id="num_vehicles"
                    class="inline-block w-full rounded-full bg-orange-100 p-2.5 leading-none text-center text-orange-900 placeholder-yellow-900 shadow placeholder:opacity-40"
                    placeholder="number of vehicles"
                  />
                ) : (
                  <input
                    readOnly
                    value={numVehicles}
                    onChange={handleVehicles}
                    id="num_vehicles"
                    class="inline-block w-full rounded-full bg-orange-100 p-2.5 leading-none text-center text-orange-900 placeholder-yellow-900 shadow placeholder:opacity-40"
                    placeholder="number of vehicles"
                  />
                )}
                <p class="absolute flex flex-col mb-2 text-center text-red-500 mt-40">
                  {vehiclesError}
                </p>
              </div>

              <div class="flex flex-col justify-center items-center relative">
                <label class="mb-3 block font-extrabold" for="depot">
                  Depot
                </label>
                {!viewOnly ? (
                  <input
                    value={depot}
                    onChange={handleDepot}
                    id="depot"
                    class="inline-block w-full rounded-full bg-orange-100 p-2.5 leading-none text-center text-orange-900 placeholder-yellow-900 shadow placeholder:opacity-40"
                    placeholder="depot"
                  />
                ) : (
                  <input
                    readOnly
                    value={depot}
                    onChange={handleDepot}
                    id="depot"
                    class="inline-block w-full rounded-full bg-orange-100 p-2.5 leading-none text-center text-orange-900 placeholder-yellow-900 shadow placeholder:opacity-40"
                    placeholder="depot"
                  />
                )}
                <p class="absolute flex flex-col mb-2 text-center text-red-500 mt-40">
                  {depotError}
                </p>
              </div>

              <div class="flex flex-col justify-center items-center relative">
                <label class="mb-3 block font-extrabold" for="max_distance">
                  Maximum Distance
                </label>

                {!viewOnly ? (
                  <input
                    value={maxDistance}
                    onChange={handleDistance}
                    id="max_distance"
                    class="inline-block w-full rounded-full bg-orange-100 p-2.5 leading-none text-center text-orange-900 placeholder-yellow-900 shadow placeholder:opacity-40"
                    placeholder="maximum distance"
                  />
                ) : (
                  <input
                    readOnly
                    value={maxDistance}
                    onChange={handleDistance}
                    id="max_distance"
                    class="inline-block w-full rounded-full bg-orange-100 p-2.5 leading-none text-center text-orange-900 placeholder-yellow-900 shadow placeholder:opacity-40"
                    placeholder="maximum distance"
                  />
                )}
                <p class="absolute flex flex-col mb-2 text-center text-red-500 mt-40">
                  {distanceError}
                </p>
              </div>
            </div>
          )}
          {model === "Model 1 : Vehicle Routing Problem (VRP)" && isOpen && (
            <div class="gap-10 mt-20 flex justify-center items-center relative">
              <div class="flex flex-col justify-center items-center relative">
                <label class="mb-3 block font-extrabold" for="name">
                  Name of the problem
                </label>

                {!viewOnly ? (
                  <input
                    value={name}
                    onChange={handleName}
                    id="name"
                    class="inline-block w-full rounded-full bg-orange-100 py-2.5 px-6 leading-none text-center text-orange-900 placeholder-yellow-900 shadow placeholder:opacity-40"
                    placeholder="name"
                  />
                ) : (
                  <input
                    readOnly
                    value={name}
                    onChange={handleName}
                    id="name"
                    class="mb-10 inline-block w-full rounded-full bg-orange-100 py-2.5 px-6 leading-none text-center text-orange-900 placeholder-yellow-900 shadow placeholder:opacity-40"
                    placeholder="name"
                  />
                )}
              </div>
            </div>
          )}
          {model === "Model 1 : Vehicle Routing Problem (VRP)" &&
            isOpen &&
            !viewOnly && (
              <div class="flex flex-col justify-center items-center">
                <button
                  className="mt-20 text-orange-900 rounded-full bg-red-300 hover:bg-orange-400 font-bold uppercase px-8 py-4 text-sm outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleSubmit}
                >
                  Update
                </button>
                <p class="mt-2 mb-10 flex flex-col text-center text-red-500 ">
                  {submitError}
                </p>
              </div>
            )}
        </div>

        <>
          {showModalInput ? (
            <>
              <div className="mt-10 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                  {/*content*/}
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="mt-60 flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                        Input data file
                      </h3>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => setShowModalInput(false)}
                      >
                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                          ×
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative flex-auto ">
                      <p className="my-4 text-blueGray-500 text-sm leading-relaxed overflow-y-auto h-screen">
                        {MyCoolCodeBlock({
                          code: inputDataFile,
                          language: "python",
                          showLineNumbers: true,
                        })}
                      </p>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-orange-900 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModalInput(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
          ) : null}
        </>

        <>
          {showModalScript ? (
            <>
              <div className="mb-10 h-screen fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative w-full max-w-3xl mx-auto">
                  <div className="bg-white rounded-lg shadow-lg relative mt-10">
                    {/*header*/}
                    <div className="mt-60 flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-3xl font-semibold">Python Script</h3>
                      <button
                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => setShowModalScript(false)}
                      >
                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                          ×
                        </span>
                      </button>
                    </div>
                    {/*body*/}
                    <div className="overflow-y-auto mt-10">
                      <p className="text-blueGray-500 text-sm leading-relaxed overflow-y-auto h-screen">
                        {MyCoolCodeBlock({
                          code: inputScriptFile,
                          language: "python",
                          showLineNumbers: true,
                        })}
                      </p>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                      <button
                        className="text-orange-900 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModalScript(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
      </React.Fragment>
    );
    // if no access token is available or the user has no permissions to read the page
  } else {
    return (
      <div class="bg-orange-50 bg-cover w-screen h-screen flex justify-center">
        <h3 className="mt-40 text-4xl font-semibold">
          You have to login with a valid user account!
        </h3>
      </div>
    );
  }
};

export default EditProblem;
