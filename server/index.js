const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/db");
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = process.env.PORT || 5000;
const { errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require("cors");

// Connect to MonogoDB.
connectDb();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  // console.log("A user connected!");
  socket.on("joinRoom", (contestId) => {
    // console.log(`Joined ${contestId}`);
    socket.join(contestId);

    socket.on("updateContest", (contestId) => {
      // Broadcast a message that a user has joined.
      // console.log("Emitting a contestUpdated event.");
      socket.broadcast.to(contestId).emit("contestUpdated", contestId);
    });
  });

  socket.on("leaveContest", (contestId) => {
    // console.log(`Left ${contestId}`);
    socket.leave(contestId);
    socket.to(contestId).emit("contestUpdated", contestId);
  });
});

// Add middlewares to parse json requests and url encoded bodies
// of requests.

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// All routes of the app.
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contests", require("./routes/contestRoutes"));

// This is a test route.
app.use("/api", require("./routes/testRoutes"));

// Error middleware
app.use(errorHandler);

httpServer.listen(port, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Socket IO listening on port ${port}`);
  }
});
