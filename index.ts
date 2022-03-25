import "dotenv/config";
import { Octokit } from "octokit";
import * as crypto from "crypto";
import { SECRET, URL, REPO, OWNER } from "./consts";

function octo(): Octokit {
  const pat = process.env.PAT as string;
  const octokit = new Octokit({ auth: pat });
  return octokit;
}

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
    return console.log("already exists!");
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

type WebhookEvent =
  | "push"
  | "release"
  | "commit_comment"
  | "create"
  | "delete"
  | "discussion"
  | "discussion_comment"
  | "issue_comment"
  | "issues"
  | "label"
  | "milestone"
  | "project"
  | "project_card"
  | "project_column"
  | "public"
  | "pull_request"
  | "pull_request_review"
  | "pull_request_review_comment"
  | "repository"
  | "status";
const all_webhook_events: WebhookEvent[] = [
  "push",
  "release",
  "commit_comment",
  "create", // A Git branch or tag is created
  "delete", // A Git branch or tag is deleted
  "discussion",
  "discussion_comment",
  "issue_comment",
  "issues",
  "label",
  "milestone",
  "project",
  "project_card",
  "project_column",
  "public", // A git repo is made public
  "pull_request",
  "pull_request_review",
  "pull_request_review_comment",
  "repository",
  "status", // When the status of a Git commit changes
];
