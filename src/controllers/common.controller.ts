import { SocketIO } from "../utility";

SocketIO.getInstance().on("connection", (socket) => {
  socket.on("active", (data) => {
    console.log(data);
  });
});
