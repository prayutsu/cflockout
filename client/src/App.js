import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import JoinContest from "./pages/JoinContest";
import CreateContest from "./pages/CreateContest";
import { socket, SocketContext } from "./context/socket";
import Navbar from "./components/Navbar";
import LiveContest2 from "./pages/LiveContest2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <SocketContext.Provider value={socket}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contests/create" element={<CreateContest />} />
            <Route exact path="/contests/join" element={<JoinContest />} />
            <Route path="/contests/live" element={<LiveContest2 />} />
          </Routes>
          <Footer />
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
