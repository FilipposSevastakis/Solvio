import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Filter from "../images/filter.png";
import Sort from "../images/sort.png";

const ShowMySubmissions = ({ onNotify }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [problems, setProblems] = useState([]);
  const [toBeDeleted, setToBeDeleted] = useState("");
  const [problemRun, setProblemRun] = useState(false);

  const [problemDeleted, setProblemDeleted] = useState(false);

  const [isModalOpen2, setIsModal2Open] = useState(false);

  const [selectedOption, setSelectedOption] = useState("all");
  const [filter, setFilter] = useState("all");

  const [query, setQuery] = useState("");
  const [sampleItem, setSampleItem] = useState("");

  const [count_name, setCountName] = useState(0);
  const [count_update, setCountUpdate] = useState(0);

  /* Possible Statuses and buttons the user can press: */
  // Ready: The user hasn't pressed the run button yet but has uploaded the files and created the problem
  //        Buttons: The user can press the View/Edit button so as to both edit and view, the Run button and the delete button

  // Running: The user has pressed the Run button and the problem has been submitted to the queue and trying to reach the solver
  //        Buttons: The user can press only the View/Edit button and only to view

  // Finished: The problem has finished running and the answers have returned throught the second queue to the user
  //        Buttons: The user can press the View/Edit button so as to only view and the View Results button

  const [ReadyToRefresh, setReadyToRefresh] = useState(false);

  //Auto-refresh the page after a problem has been created so that it can be seen in the user home page
  useEffect(() => {
    if (!ReadyToRefresh) {
      const timer = setTimeout(() => {
        setReadyToRefresh(true); // Revert the boolean variable after 2 seconds
      }, 1000);

      return () => clearTimeout(timer); // Clean up the timer to avoid memory leaks
    }
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  //The following 2 functions have to do with the Filter Options modal. They make sure the option chosen is saved and the filter is
  //correctly set after the user confirms his selection.
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.id);
  };

  const handleConfirmSelection = () => {
    setFilter(selectedOption);
    closeModal2();
  };

  //a function that is triggered when the user wants to sort by name or last updated on. It handles both cases of sorting.
  const handleSort = (sort, count1, count2) => {
    let helperArray = [...problems];
    if (sort === "name") {
      if (count1 % 2 === 0) {  // %2 is being used because on second press to the sorting button we want a reverse sorting to occur
        helperArray.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        setCountName(count1 + 1);
        setProblems(helperArray);
      } else {
        helperArray.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return 1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return -1;
          }
          return 0;
        });
        setCountName(count1 + 1);
        setProblems(helperArray);
      }
    } else if (sort === "update") {
      if (count2 % 2 === 0) {
        helperArray.sort(
          (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
        );
        setCountUpdate(count2 + 1);
        setProblems(helperArray);
      } else {
        helperArray.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setCountUpdate(count2 + 1);
        setProblems(helperArray);
      }
    }
  };

  //The following 2 functions handle the opening and closing of the modal for the Deletion of a problem. They also save the id
  //of the problem about to be deleted.
  const openModal = (id, name) => {
    setSampleItem(name);
    setIsModalOpen(true);
    setToBeDeleted(id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //The following 2 functions handle the opening and closing of the modal for the Filter Options
  const openModal2 = () => {
    setIsModal2Open(true);
  };

  const closeModal2 = () => {
    setIsModal2Open(false);
  };

  //A function that handles the deletion of a problem. It makes the necessary API call and also closes the modal. Triggered when
  //the user confirms that he wants to delete a problem.
  const handleDeleteProblem = async () => {
    const res = await axios.post(`http://localhost:8080/api/deleteProblem`, {
      id: toBeDeleted,
    });
    closeModal();
    setProblemDeleted(!problemDeleted);
    onNotify("The problem was deleted!");
  };

  //Navigates the user to the results of problem. The user needs to press the Show Results button of a (finished) problem
  const navigateToAnswer = (id) => {
    navigate(`/showresults/${id}`);
  };

  //A function that takes the dates from the database and makes them readable to humans and also transforms them to Greek time. 
  const makeDatesReadable = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    const options = {
      timeZone: "Europe/Athens",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const timeString = date.toLocaleTimeString("el-GR", options);

    const formattedDate = `${year}-${month}-${day} ${timeString}`;
    return formattedDate;
  };

  //necessary for user authentication and access token management
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/auth/getToken`);
        setAccessToken(res.data.token);
        setRole(res.data.role);
        if (res.data.token) {
          setUserId(JSON.parse(localStorage.getItem("user")).id);
        } else {
          setAccessToken(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAccessToken();
  }, []);

  //called on every render of the page. Fetches all problems of the particular user so that they can be rendered on the page. 
  useEffect(() => {
    const fetchMySubmissions = async () => {
      if (userId) {
        try {
          const res = await axios.get(
            `http://localhost:8080/api/showSubmissions?userId=${userId}`
          );
          setProblems(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchMySubmissions();
  }, [problemDeleted, ReadyToRefresh, userId, problemRun]);


  //Called whenever the user presses the Run button to run a problem (send it to the queue so that the solver can take it)
  const handleRun = async (e) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/runproblem`, {
        problemID: e.target.id,
      });
      setTimeout(() => {
        setProblemRun(problemRun + 1);
      }, 100);
      onNotify("The problem was submitted for execution!");
    } catch (error) {
      console.log(error);
    }
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
  //when all actions have been completed, the page is rendered to the user
  if (accessToken && role != "admin") {
    return (
      <div class="bg-orange-50 bg-cover w-screen flex items-center justify-center overflow-auto">
        <div class="bg-orange-50 bg-cover w-1/12 h-screen flex-col items-center justify-center "></div>
        <div class=" bg-orange-50 bg-cover w-5/6 h-screen flex-col items-center justify-center mb-10">
          <div className="money w-full">
            <br></br>
            <div className="flex justify-between">
              <h2 className="mt-5 ml-20 text-2xl font-bold text-orange-800 flex-initial">
                {filter.charAt(0).toUpperCase() + filter.slice(1)} Submissions
              </h2>
              <button
                onClick={openModal2}
                className="flex justify-between items-center bg-orange-900 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition"
              >
                <img src={Filter} alt="" class="w-5 h-5" /> Filter Options
              </button>
              <button
                onClick={() => navigate("/submitproblem")}
                className="mt-5 mr-20 bg-orange-500 text-white rounded-md px-4 py-2 hover:bg-orange-400 transition flex-initial"
              >
                Submit new problem
              </button>
            </div>
            <br></br>
            <div className="flex items-center justify-center">
              <input
                placeholder="Search by problem name"
                class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <br></br>
            <br></br>

            {filter === "all" ? (
              <div class="h-150 overflow-y-auto mb-2">
                <table className="bg-orange-100 ring-1 ring-orange-200 shadow-lg  overflow-auto min-w-full">
                  <thead>
                    <tr>
                      <th className="relative flex items-center justify-center">
                        <div>Name</div>
                        <button
                          className="w-6 h-6 absolute right-0"
                          title="Sort"
                          onClick={() =>
                            handleSort("name", count_name, count_update)
                          }
                        >
                          <img src={Sort} alt="" />
                        </button>
                      </th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th>View/Edit</th>
                      <th className="relative flex items-center justify-center">
                        <div>Last Updated On</div>
                        <button
                          className="w-6 h-6 absolute right-0"
                          title="Sort"
                          onClick={() =>
                            handleSort("update", count_name, count_update)
                          }
                        >
                          <img src={Sort} alt="" />
                        </button>
                      </th>
                      <th>Run</th>
                      <th>View Results</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.length > 0 ? (
                      problems
                        .filter((item) => {
                          if (query === "") {
                            return item;
                          } else if (
                            item.name
                              .toLowerCase()
                              .includes(query.toLowerCase())
                          ) {
                            return item;
                          }
                        })
                        .map((problem, index) => (
                          <tr key={index}>
                            <td>{problem.name}</td>
                            <td>{makeDatesReadable(problem.createdAt)}</td>
                            <td>{problem.status}</td>
                            <td>
                              {problem.status !== "finished" ? (
                                <button
                                  onClick={() =>
                                    navigate(`/editproblem/${problem._id}`)
                                  }
                                  className="bg-orange-900 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition"
                                >
                                  View/Edit
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/editproblem/${problem._id}?viewOnly=true`
                                    )
                                  }
                                  className="bg-orange-900 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition"
                                >
                                  View
                                </button>
                              )}
                            </td>
                            <td>{makeDatesReadable(problem.updatedAt)}</td>
                            <td>
                              {problem.status === "ready" ? (
                                <button
                                  id={problem._id}
                                  onClick={handleRun}
                                  className="bg-orange-900 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition"
                                >
                                  Run
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="bg-gray-500 text-white rounded-md px-4 py-2 transition opacity-50 cursor-not-allowed"
                                >
                                  Run
                                </button>
                              )}
                            </td>
                            <td>
                              {problem.status === "finished" &&
                                problem.allowToShowResults === "true" && (
                                  <button
                                    className="bg-orange-900 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition"
                                    onClick={() =>
                                      navigateToAnswer(problem._id)
                                    }
                                  >
                                    View Results
                                  </button>
                                )}{" "}
                              {problem.status !== "finished" && (
                                <button
                                  disabled
                                  className="bg-gray-500 text-white rounded-md px-4 py-2 transition opacity-50 cursor-not-allowed"
                                >
                                  View Results
                                </button>
                              )}
                              {problem.status === "finished" &&
                                problem.allowToShowResults === "false" && (
                                  <button className="bg-red-600 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition">
                                    Not enough credits
                                  </button>
                                )}
                            </td>
                            <td>
                              {problem.status !== "running" ? (
                                <button
                                  className="bg-rose-500 text-white rounded-md px-4 py-2"
                                  onClick={() =>
                                    openModal(problem._id, problem.name)
                                  }
                                >
                                  Delete
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="bg-gray-500 text-white rounded-md px-4 py-2 transition opacity-50 cursor-not-allowed"
                                  onClick={() =>
                                    openModal(problem._id, problem.name)
                                  }
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="8">
                          No problems have been found. Refresh the page to try
                          again!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div class="h-96 overflow-y-auto mb-2">
                <table className="bg-orange-100 ring-1 ring-orange-200 shadow-lg  overflow-auto min-w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th>View/Edit</th>
                      <th>Last Updated On</th>
                      <th>Run</th>
                      <th>View Results</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.length > 0 ? (
                      problems
                        .filter((data) => data.status === filter)
                        .filter((item) => {
                          if (query === "") {
                            return item;
                          } else if (
                            item.name
                              .toLowerCase()
                              .includes(query.toLowerCase())
                          ) {
                            return item;
                          }
                        })
                        .map((problem, index) => (
                          <tr key={index}>
                            <td>{problem.name}</td>
                            <td>{makeDatesReadable(problem.createdAt)}</td>
                            <td>{problem.status}</td>
                            <td>
                              {problem.status !== "finished" ? (
                                <button
                                  onClick={() =>
                                    navigate(`/editproblem/${problem._id}`)
                                  }
                                  className="bg-orange-900 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition"
                                >
                                  View/Edit
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/editproblem/${problem._id}?viewOnly=true`
                                    )
                                  }
                                  className="bg-orange-900 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition"
                                >
                                  View
                                </button>
                              )}
                            </td>
                            <td>{makeDatesReadable(problem.updatedAt)}</td>
                            <td>
                              {problem.status === "ready" ? (
                                <button
                                  id={problem._id}
                                  onClick={handleRun}
                                  className="bg-orange-900 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition"
                                >
                                  Run
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="bg-gray-500 text-white rounded-md px-4 py-2 transition opacity-50 cursor-not-allowed"
                                >
                                  Run
                                </button>
                              )}
                            </td>
                            <td>
                              {problem.status === "finished" &&
                                problem.allowToShowResults === "true" && (
                                  <button
                                    className="bg-orange-900 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition"
                                    onClick={() =>
                                      navigateToAnswer(problem._id)
                                    }
                                  >
                                    View Results
                                  </button>
                                )}{" "}
                              {problem.status !== "finished" && (
                                <button
                                  disabled
                                  className="bg-gray-500 text-white rounded-md px-4 py-2 transition opacity-50 cursor-not-allowed"
                                >
                                  View Results
                                </button>
                              )}
                              {problem.status === "finished" &&
                                problem.allowToShowResults === "false" && (
                                  <button className="bg-red-600 text-white rounded-md px-4 py-2 hover:bg-orange-700 transition">
                                    Not enough credits
                                  </button>
                                )}
                            </td>
                            <td>
                              {problem.status !== "running" ? (
                                <button
                                  className="bg-rose-500 text-white rounded-md px-4 py-2"
                                  onClick={() =>
                                    openModal(problem._id, problem.name)
                                  }
                                >
                                  Delete
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="bg-gray-500 text-white rounded-md px-4 py-2 transition opacity-50 cursor-not-allowed"
                                  onClick={() =>
                                    openModal(problem._id, problem.name)
                                  }
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="8">
                          No problems have been found. Refresh the page to try
                          again!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal - Delete a Problem */}
            {isModalOpen && (
              <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
                <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-xl">
                  <div className="flex justify-end p-2">
                    <button
                      onClick={closeModal}
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
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      class="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      {" "}
                      Delete Item{" "}
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        {" "}
                        Are you sure you want to delete{" "}
                        <span class="font-bold">{sampleItem}</span>? This action
                        cannot be undone.{" "}
                      </p>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      onClick={handleDeleteProblem}
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {" "}
                      Delete{" "}
                    </button>
                    <button
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                    >
                      {" "}
                      Cancel{" "}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal 2 - Filter Options */}
            {isModalOpen2 && (
              <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4">
                <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-xl">
                  <div className="flex justify-end p-2">
                    <button
                      onClick={closeModal2}
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
                  <div className="text-center p-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Filter Options
                    </h3>
                    <div className="mt-5">
                      <div className="flex items-center mb-4">
                        <input
                          id="all"
                          type="radio"
                          name="options"
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300  "
                          onChange={handleOptionChange}
                        />
                        <label
                          htmlFor="radio3"
                          className="ml-2 text-sm font-medium text-gray-900"
                        >
                          Show All Submissions
                        </label>
                      </div>
                      <div className="flex items-center mb-4">
                        <input
                          id="ready"
                          type="radio"
                          name="options"
                          className="w-4 h-4 text-orange-800 bg-gray-100 border-gray-300  "
                          onChange={handleOptionChange}
                        />
                        <label
                          htmlFor="radio1"
                          className="ml-2 text-sm font-medium text-gray-900"
                        >
                          Show Ready Submissions
                        </label>
                      </div>
                      <div className="flex items-center mb-4">
                        <input
                          id="running"
                          type="radio"
                          name="options"
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 "
                          onChange={handleOptionChange}
                        />
                        <label
                          htmlFor="radio2"
                          className="ml-2 text-sm font-medium text-gray-900"
                        >
                          Show Running Submissions
                        </label>
                      </div>
                      <div className="flex items-center mb-4">
                        <input
                          id="finished"
                          type="radio"
                          name="options"
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300"
                          onChange={handleOptionChange}
                        />
                        <label
                          htmlFor="radio3"
                          className="ml-2 text-sm font-medium text-gray-900"
                        >
                          Show Finished Submissions
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-800 text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleConfirmSelection}
                    >
                      {" "}
                      Confirm Selection{" "}
                    </button>
                    <button
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal2}
                    >
                      {" "}
                      Cancel{" "}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div class="bg-orange-50 bg-cover w-1/12 h-screen flex-col items-center justify-center overflow-auto"></div>
      </div>
    );
  } else {
    //in case the user doesn't have permission to view the page (e.g. incorrect authentication)
    return (
      <div class="bg-orange-50 bg-cover w-screen h-screen flex justify-center">
        <h3 className="mt-40 text-4xl font-semibold">
          You have to login with a valid user account!
        </h3>
      </div>
    );
  }
};

export default ShowMySubmissions;
