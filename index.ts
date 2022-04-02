import "dotenv/config";
import { Octokit } from "octokit";
import { SECRET, URL, REPO, OWNER } from "./consts";
import { all_webhook_events } from "./webhooks";

function octo(): Octokit {
  const pat = process.env.PAT as string;
  const octokit = new Octokit({ auth: pat });
  return octokit;
}
//
//
//
async function go() {
  // try {
  console.log("yo", OWNER, REPO);
  const octokit = octo();
  const list = await octokit.request("GET /repos/{owner}/{repo}/hooks", {
    owner: OWNER,
    repo: REPO,
  });
  console.log("===>", list);
  if (list.data.length) {
    const existing = list.data.find((d) => d.config.url === URL);
    if (existing) return console.log("already exists!");
  }
  await octokit.request("POST /repos/{owner}/{repo}/hooks", {
    owner: OWNER,
    repo: REPO,
    active: true,
    events: all_webhook_events,
    config: {
      url: URL,
      content_type: "json",
      secret: SECRET,
    },
  });
  // } catch (e) {
  //   console.log("caugh in");
  //   throw e;
  // }
}

go();

// server

const sigHeaderName = "X-Hub-Signature-256";
const sigHashAlg = "sha256";

function parseRawBody(req: any) {
  return new Promise((resolve, reject) => {
    var data = "";
    req.setEncoding("utf8");
    req.on("data", function (chunk: any) {
      data += chunk;
    });
    req.on("end", function () {
      req.rawBody = data;
      resolve(data);
    });
  });
}

// const a = verifyHmac(
//   "sha256=d6cc0d26d07ca65ec7312ded7c6c91646e06149385b9ab81a9478ff78d41e7cd",
//   "body"
// );
