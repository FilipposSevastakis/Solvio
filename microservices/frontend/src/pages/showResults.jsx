import React, { useEffect, useState } from "react";
import axios from "axios";
import { GraphCanvas } from "reagraph";
import File from "../images/file.png";
import { useLocation, useNavigate } from "react-router-dom";

const ShowResults = () => {
  const searchParams = new URLSearchParams(useLocation().search);
  const forwardedFromEmail = searchParams.get("forwarded") === "true";
  const forwardedDone = searchParams.get("forwardeddone") === "true";
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routesData, setRoutesData] = useState([]);
  const [Objective, setAnswerObjective] = useState("");
  const [MaxDistance, setAnswerMaxDistance] = useState("");
  const [nodes_graph, setNodes_Graph] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notAllowedToSeeResults, setNotAllowedToSeeResults] = useState(false);
  const [enoughCredits, setEnoughCredits] = useState(true);

  const path = useLocation().pathname.split("/");
  const problemID = path[path.length - 1];

  if (forwardedDone) {
    setTimeout(() => {
      localStorage.setItem(
        "problemToShowResults",
        JSON.stringify({ problemID: null })
      );
    }, 3500);
  }

  const navigate = useNavigate();

  const [ques_id, setQuestionId] = useState(
    useLocation().pathname.split("/")[2]
  );

  //format all details into the .txt file that can be downloaded
  function formatRoutes() {
    let result = `Objective: ${Objective}\n`;
    let maxDistance = `\nMaximum of the route distances: ${MaxDistance}\n`;

    routesData.forEach((route, index) => {
      const Route = route.Route;
      result += `\nRoute for vehicle ${index}:\n ${Route}\n`;
      const Distance = route.Route_distance;
      result += `\nDistance of the route: ${Distance}\n`;
    });

    result += maxDistance;

    return result;
  }

  //format all results info and render the results in the downloadable .txt file
  const results_file = formatRoutes();
  const render_results_file = results_file.split("\n");

  //on loading of the page, fetch the appropriate results of the question that was used in the route to get here
  //handle appropriate errors : not enough credits to view the results
  useEffect(() => {
    const fetchMyAnswer = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/getResults?id=${ques_id}`
        );
        if (res.status === 200) {
          setNotAllowedToSeeResults(false);
          setRoutesData(res.data[0].answer.Routes);
          setAnswerObjective(res.data[0].answer.Objective);
          setAnswerMaxDistance(res.data[0].answer.Maximum_distance);
        }
        if (res.status === 204) {
          setEnoughCredits(false);
        }
      } catch (error) {
        console.log(error.response.status);
        if (error.response.status === 403) {
          setNotAllowedToSeeResults(true);
        }
      }
    };

    fetchMyAnswer();
  }, [ques_id]);

  //necessary for user authentication and access token management
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/auth/getToken`);
        setAccessToken(res.data.token);
        if (res.data.token) {
          setUserId(JSON.parse(localStorage.getItem("user")).id);
        } else setAccessToken(false);
      } catch (error) {
        console.log(error);
      }
    };

    //construct the graph that depicts the route of a vehicle
    if (selectedRoute !== null && routesData.length > 0) {
      const selectedRouteData = routesData[selectedRoute]; //the selected vehicle
      const routeDescription = selectedRouteData.Route;

      //find the nodes and save them to a state variable
      const nodes = routeDescription.split(" -> ").map((node) => node.trim());
      let help1 = [];
      let help2 = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        if (nodes[i] == 0) {
          help1.push({
            id: nodes[i],
            label: nodes[i],
            fill: "rgb(80, 255, 55)",
          });
        } else {
          help1.push({
            id: nodes[i],
            label: nodes[i],
          });
        }
      }
      setNodes_Graph(help1);

      //find the edges and save them to a state variable
      for (let i = 0; i < nodes.length - 1; i++) {
        help2.push({
          id: i,
          source: nodes[i],
          target: nodes[i + 1],
          label: "Edge" + i,
        });
      }
      setEdges(help2);
    }
    fetchAccessToken();
  }, [selectedRoute, routesData, notAllowedToSeeResults]);

  //update necessary state variables regarding the chosen vehicle of the user
  const handleRouteSelection = (routeIndex) => {
    setSelectedRoute(routeIndex);
    setShowModal(true);
  };

  //function to close the modal with the graph of a route
  const closeModal = () => {
    setShowModal(false);
    setSelectedRoute(null);
  };

  //functions to handle the opening and closing of the modal showing the .txt file
  const handleFileClick = () => {
    setIsFileOpen(true);
  };

  const FileClose = () => {
    setIsFileOpen(false);
  };

  //handling the downloading of the file in a .txt format
  const DownloadFile = () => {
    const link = document.createElement("a");
    const content = results_file;
    const file = new Blob([content], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = "sample.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  //until all operations (e.g. user authentication) are completed, a Loading Spinner is being displayed
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
  if (accessToken) {
    //handle the not enough credits error by showing a suitable message to the user
    if (!enoughCredits) {
      return (
        <div class="bg-orange-50 bg-cover w-screen h-screen flex items-center justify-center overflow-auto">
          <span class="flex text-3xl">
            NOT ENOUGH CREDITS TO SEE THE RESULTS
          </span>
        </div>
      );
    }
    //handling the case when a user is not authenticated to see the results of a problem
    if (notAllowedToSeeResults) {
      return (
        <div class="bg-orange-50 bg-cover w-screen h-screen flex justify-center">
          <h3 className="mt-40 text-4xl font-semibold text-center">
            You do not have the permissions to see the results for this problem!
          </h3>
        </div>
      );
    } else {
      //rendering the problem's results to the user
      return (
        <div className="bg-orange-50 bg-cover w-screen flex items-center justify-center overflow-auto">
          <div class="bg-orange-50 bg-cover w-1/6 h-screen flex-col items-center justify-center overflow-auto"></div>
          <div class="bg-orange-50 bg-cover w-4/6 h-screen flex-col items-center justify-center overflow-auto">
            <div className="flex flex-col items-center justify-center parthome w-full shadow-lg ring-orange-200">
              <div class="gap-5 mt-10 flex items-center">
                <h3 class="text-xl font-bold text-orange-800">
                  The entire answer to the problem is in this file
                </h3>
                <button onClick={handleFileClick}>
                  <img src={File} alt="" class="w-9 h-9" />
                </button>
              </div>
              <br></br>
              <br></br>
              <h2 class="mt-10 mb-6 text-2xl font-bold text-orange-800">
                Information per vehicle{" "}
              </h2>
              <br></br>
              <div className="money bg-orange-100 w-full">
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle Number</th>
                      <th>Distance of the route</th>
                      <th>See route</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routesData.map((route, index) => (
                      <tr key={index}>
                        <td>{index}</td>
                        <td>{route.Route_distance}</td>
                        <td>
                          <button
                            className="bg-orange-900 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition"
                            onClick={() => handleRouteSelection(index)}
                          >
                            Click to see route
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal - Graph of the route of the chosen vehicle : use of reagraph's Graph Canvas component */}
              {showModal && selectedRoute !== null && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                  <div className="relative bg-white shadow-xl rounded-md max-w-screen-lg mx-auto flex flex-col justify-center items-center">
                    <div className="flex justify-between w-full mt-2">
                      <div className="mt-4 text-2xl font-bold text-orange-800 mr-4 ml-4"></div>
                      <button
                        onClick={closeModal}
                        className="text-gray-800 bg-gray-200 hover:bg-gray-100 rounded-lg text-sm items-center px-2 py-2 mt-4 mr-4"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <div className="text-2xl font-bold text-orange-800">
                      Route for Vehicle {selectedRoute}
                    </div>
                    <div className="relative shadow-xl rounded-md bg-white w-screen max-w-xl min-h-96 flex flex-col justify-center items-center">
                      <GraphCanvas nodes={nodes_graph} edges={edges} />
                    </div>
                  </div>
                </div>
              )}

              {/* File Modal */}
              {isFileOpen && (
                <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
                  <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-3xl">
                    {" "}
                    <div className="flex justify-end p-2">
                      <button
                        class="middle none center rounded-lg bg-orange-700 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:bg-orange-500 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        data-ripple-light="true"
                        onClick={DownloadFile}
                      >
                        Download
                      </button>
                      <button
                        onClick={FileClose}
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <div className="py-3 px-4 flex items-center justify-center bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
                      <div className="w-full lg:w-9/12 bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
                        {" "}
                        <div id="header-buttons" className="py-3 px-4 flex">
                          <div className="rounded-full w-3 h-3 bg-red-500 mr-2"></div>
                          <div className="rounded-full w-3 h-3 bg-yellow-500 mr-2"></div>
                          <div className="rounded-full w-3 h-3 bg-green-500"></div>
                        </div>
                        <div
                          id="code-area"
                          className="py-4 px-4 mt-1 text-white text-xl"
                        >
                          {render_results_file.map((line, index) => (
                            <>
                              <div key={index}>{line}</div>
                              {line.startsWith("Distance") && <br></br>}
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div class="bg-orange-50 bg-cover w-1/6 h-screen flex-col items-center justify-center overflow-auto"></div>
        </div>
      );
    }
  } else {
    //case when one tries to view a problem that's not his (he hasn't logged in)
    if (!forwardedFromEmail) {
      return (
        <div class="bg-orange-50 bg-cover w-screen h-screen flex justify-center">
          <h3 className="mt-40 text-4xl font-semibold">
            You have to login with a valid account!
          </h3>
        </div>
      );
    } else {
      if (accessToken === false) {
        navigate(`/login?showresults=${problemID}`);
      }
    }
  }
};

export default ShowResults;
