const express = require("express");
import * as hmac from "./hmac";
import { SECRET } from "./consts";
import { process } from "./webhooks";

const app = express();
const port = 8000;

app.use(
  express.json({
    limit: "5MB",
    verify: (req, res, buf) => {
      (req as any).rawBody = buf.toString();
    },
  })
);
app.get("/", (req, res) => {
  console.log("yo");
  res.send("Hello World!");
});
app.post("/", (req, res) => {
  console.log("yo POST");
  res.send("Hello World!");
});

app.post("/webhook", (req, res) => {
  console.log("=> webhook");
  const sig = req.headers["x-hub-signature-256"];
  if (!sig) return unauthorized(res);
  const valid = hmac.verifyHmac(sig, req.rawBody, SECRET);
  console.log("VALID!!!!", valid);
  console.log(req.body);
  const msg = process(req.body);
  if (msg) console.log("=====>", msg);
});

function unauthorized(res) {
  res.writeHead(401, "Access invalid for user", {
    "Content-Type": "text/plain",
  });
  res.end("invalid credentials");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
