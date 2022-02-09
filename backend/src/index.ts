import express, { Request, Response } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import path from "path";
import { AddressInfo } from "net";

import { mustGetConfig } from "./config";

const config = mustGetConfig(process.env);

mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

const app = express();

// Serves the built frontend files statically in production.
// Development uses react-scripts dev server and not these static files.
app.use(express.static(path.resolve(__dirname, "../build/client")));

app.get("/api/v1/hello", (req: Request, res: Response) => {
  res.json({ name: req.query["name"] || "World" });
});

app.get("/*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../build/client/index.html"));
});

const listener = app.listen(process.env["PORT"] || "8080", () => {
  const port = (listener.address() as AddressInfo).port;
  console.log(`Listening on ${port}`);
});
