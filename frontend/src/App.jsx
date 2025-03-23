import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/LoadingSpinner";

import { useQuery } from "@tanstack/react-query";

function App() {
  const { data: authUser, isLoading } = useQuery({
    // query key is used to identify the query so you can use it to refetch the query on demand and other files
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        // We return null so it will be easier to check if the user is authenticated or not, if it is undefined it would check as true therefore routing would not work
        if (data.error) return null;
        if (!res.ok) throw new Error(data.error || "Failed to fetch user");
        console.log("authUser is:", data);
       
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false, // Disable retries
  },);

  if (isLoading) {

    return (<div className="h-screen flex justify-center items-center">
      <LoadingSpinner size='lg' />
      </div>);
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {/* Common component, bc it is not wrapped with Routes */}
      {authUser && <Sidebar />}
      <Routes>
        {/* If user is not authenticated, send it to LoginPage */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />  } />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"/> } />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/> } />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login"/> } />
        <Route path="/profile/:username" element={!authUser ? <ProfilePage /> : <Navigate to="login"/> } />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
