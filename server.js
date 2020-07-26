const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidV4 } = require("uuid");
const io = require("socket.io")(server);

//view engine ejs
app.set("view engine", "ejs");

//setting up the publicfolder
app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  return res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
    console.log(roomId + " " + userId);
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log("server is running on post 3000");
});
