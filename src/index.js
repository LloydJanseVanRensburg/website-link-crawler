import express from "express";
import morgan from "morgan";
import router from "./routes/index.js";
import fileDirName from "./utils/dirname.js";
import path from "path";

const { __dirname } = fileDirName(import.meta);
const publicDir = path.join(__dirname, "public");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(publicDir));
app.use("/", router);

app.listen("3000", () => {
  console.log("Server running on port 3000");
});
