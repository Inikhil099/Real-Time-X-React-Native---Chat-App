import app from "./src/app";
import { ConnectDb } from "./src/config/connectDb";
import { createServer } from "http";
import { initializeSocket } from "./src/socket/socket";

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);
initializeSocket(httpServer)

ConnectDb().then(() => {
  console.log(process.env.MONGODB_URI)
  console.log("db connected");
  httpServer.listen(PORT, () => {
    console.log("app running on port http://localhost:" + PORT);
  });
});
