import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { API_URL } from "./API/API";

import Loader from "./Components/Layout/Loader";
import Sidebar from "./Components/Layout/Sidebar";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";

const App: React.FC = () => {
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = true;
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/Authentication/GET/CheckSession", {
          withCredentials: true,
        });

        if (res.status === 200 && res.data) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error("Errore durante il controllo della sessione:", error);
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {isAuth && <Sidebar />}
      <Routes>
        {!isAuth && <Route element={<Login />} path="/login" />}
        <Route
          path="/*"
          element={
            isAuth ? <ProtectedRoutes /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </>
  );
};

const ProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route element={<Dashboard />} path="/" />
      </Route>
    </Routes>
  );
};

export default App;
