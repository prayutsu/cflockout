import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/Home";
import JoinContest from "./pages/JoinContest";
import CreateContest from "./pages/CreateContest";
import { socket, SocketContext } from "./context/socket";
import Navbar from "./components/Navbar";
import LiveContest from "./pages/LiveContest";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import ScrollToTop from "./components/ScrollToTop";
import EditProfile from "./pages/profile/EditProfile";
import RecoverAccount from "./pages/auth/RecoverAccount";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyResetPasswordToken from "./pages/auth/VerifyResetPasswordToken";

function App() {
  return (
    <>
      <SocketContext.Provider value={socket}>
        <Router>
          <ScrollToTop>
            <div className="overflow-x-hidden h-full min-h-screen relative flex flex-col">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route
                  path="/auth/verify/reset-password-token"
                  element={<VerifyResetPasswordToken />}
                />
                <Route
                  path="/auth/recoverAccount"
                  element={<RecoverAccount />}
                />
                <Route
                  path="/auth/reset-password"
                  element={<ResetPassword />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contests/create" element={<CreateContest />} />
                <Route exact path="/contests/join" element={<JoinContest />} />
                <Route path="/contests/live" element={<LiveContest />} />
                <Route path="/verify" element={<VerifyEmail />} />
                <Route path="/profile/edit" element={<EditProfile />} />
              </Routes>
              <Footer />
            </div>
          </ScrollToTop>
        </Router>
      </SocketContext.Provider>
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        autoClose={3000}
      />
    </>
  );
}

export default App;
