import app from "./src/app";
import { ConnectDb } from "./src/config/connectDb";
import { createServer } from "http";

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);

ConnectDb().then(() => {
  console.log("db connected");
  httpServer.listen(PORT, () => {
    console.log("app running on port http://localhost:" + PORT);
  });
});
