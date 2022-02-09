import express, { Request, Response } from "express";
import session from "express-session";
import mongoose, { ConnectOptions } from "mongoose";
import path from "path";
import MongoStore from "connect-mongo";
import { AddressInfo } from "net";
import { json, urlencoded } from "body-parser";

import auth from "./routes/auth";
import { mustGetConfig } from "./config";
import passport from "./auth/passport";

const config = mustGetConfig(process.env);

mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

const app = express();

// Serves the built frontend files statically in production.
// Development uses react-scripts dev server and not these static files.
app.use(express.static(path.resolve(__dirname, "../build/client")));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(
  session({
    secret: config.sessionSecret,
    store: MongoStore.create({
      clientPromise: mongoose.connection.asPromise().then((c) => c.getClient()),
    }),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", auth);

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
