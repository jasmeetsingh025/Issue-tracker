import { server } from "./server.js";
import { connectDb } from "./config/mongooseDB.js";
import path from "path";
import dotenv from "dotenv";
const configEnvPath = path.resolve("config", ".env");
dotenv.config({ path: configEnvPath });

server.listen(process.env.PORT, async (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is listening on port no. ${process.env.PORT}`);
    await connectDb();
  }
});
