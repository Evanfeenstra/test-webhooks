import "dotenv/config";
import { Octokit } from "octokit";

function octo(): Octokit {
  const pat = process.env.PAT as string;
  const octokit = new Octokit({ auth: pat });
  return octokit;
}

async function go() {
  console.log("yo");
  const octokit = octo();
  const list = await octokit.request("GET /repos/{owner}/{repo}/hooks", {
    owner: "evanfeenstra",
    repo: "test-webhooks",
  });
  console.log(list);
  if (list.data.length) {
    return console.log("already exists!");
  }
  await octokit.request("POST /repos/{owner}/{repo}/hooks", {
    owner: "evanfeenstra",
    repo: "test-webhooks",
    active: true,
    events: ["push"],
    config: {
      url: "https://www.toptal.com/developers/postbin/1646938030896-4505768732633",
    },
  });
}

go();
