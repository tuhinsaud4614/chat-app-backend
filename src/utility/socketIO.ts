import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { HttpError } from "../models";

class SocketIO {
  private static instance: Server;
  private constructor() {}

  public static getInstance(server?: HTTPServer): Server {
    if (!SocketIO.instance) {
      if (!server) {
        throw new HttpError("Socket not connected with server", 500);
      }
      SocketIO.instance = new Server(server, { cors: { origin: "*" } });
    }
    return SocketIO.instance;
  }
}

export default SocketIO;
