import React, { useEffect, useMemo, useState } from "react";
import { TaskTable } from "./TaskTable";
import useAuthStore from "../store/authStore";
import axios from "axios";
import profileStore from "../store/profileStore";
import taskStore from "../store/taskStore";
import Logout from "./logout";
import Header from "./header";

const Dashboard = () => {
  const { profileData, setProfileData } = profileStore();
  const { accessToken } = useAuthStore((state) => state.accessToken);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { taskData, setTaskData } = taskStore();
  const logout = useAuthStore((state) => state.logout);

//   const [taskData, setTaskData] = useState([]);

  const getAllTodo = async() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/user/getTask?limit=5`,
      headers: {
        Authorization: accessToken,
      },
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.success) {
          setTaskData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProfile = async() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/user/getProfile`,
      headers: {
        Authorization: accessToken,
      },
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(response.data.data);
        if (response.data.success) {
          setProfileData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
        logout();
      });
  };

  
  const filterTask = async(queryKey, queryValue, page) => {
    let query = `${queryKey}=${queryValue}`

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/user/getTask?limit=5&${query}&page=${page ? page : 1}`,
      headers: {
        Authorization: accessToken
      },
    };

    await axios.request(config).then((response) => {
      console.log(response.data.data);
      if (response.data.success) {
        setTaskData(response.data.data)
      }
    });
  };

  useEffect(() => {
    getAllTodo();
    getProfile();
  }, [isLoggedIn]);

  return (
    <div className="w-full h-full flex flex-col text-center">
      <Header />
      <h1 className="text-3xl font-bold py-3">Hey, {profileData?.fullName}</h1>
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <div className="flex h-full items-center justify-center flex-col">
        <div className="w-3/4">
          <TaskTable
            data={taskData}
            setTaskData={()=> {setTaskData}}
            filterTask={filterTask}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
