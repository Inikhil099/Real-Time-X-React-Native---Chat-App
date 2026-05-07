import app from "./src/app";
import { ConnectDb } from "./src/config/connectDb";
import { createServer } from "http";
import { initializeSocket } from "./src/socket/socket";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
initializeSocket(httpServer);

ConnectDb().then(() => {
  console.log("db connected");
  httpServer.listen(PORT, () => {
    console.log("app running on port http://localhost:" + PORT);
    setInterval(async () => {
      const f = await fetch(`${process.env.ORIGIN}/health`);
      const d = await f.text();
      console.log(d);
    }, 1000);
  });
});
