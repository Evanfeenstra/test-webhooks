import "dotenv/config";
import { Octokit } from "octokit";
import { REPO, OWNER } from "./consts";

function octo(pat): Octokit {
  const octokit = new Octokit({ auth: pat });
  return octokit;
}

// const PAT = "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";
const PAT = "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";

async function go() {
  let octokit = octo(PAT);
  const list = await octokit.request("GET /repos/{owner}/{repo}/hooks", {
    owner: "stakwork",
    repo: "sphinx-relay",
  });
  console.log("===>", list);
}

go();
