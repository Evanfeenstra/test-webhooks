import {
  WebhookEvent,
  IssuesOpenedEvent,
  IssuesClosedEvent,
  IssuesReopenedEvent,
  PushEvent,
} from "@octokit/webhooks-types";

// https://localtunnel.github.io/www/

// lt --port 8000

export type WebhookEventName =
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
export const all_webhook_events: WebhookEventName[] = [
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

type ActionMap = { [k: string]: (body: any) => string };
const issueActionMap: ActionMap = {
  closed: (e: IssuesClosedEvent) => {
    return `Issue #${e.issue.number} closed in ${e.repository.full_name}`;
  },
  opened: (e: IssuesOpenedEvent) => {
    return `New issue in ${e.repository.full_name}: ${e.issue.title}`;
  },
  reopened: (e: IssuesReopenedEvent) => {
    return `Issue #${e.issue.number} reopened in ${e.repository.full_name}`;
  },
};
function pushAction(e: PushEvent): string {
  if (e.head_commit) {
    return `New commit in ${e.repository.full_name} by ${e.pusher.name}: ${e.head_commit.message}`;
  } else {
    return "";
  }
}
const actionsMap: { [k: string]: ActionMap } = {
  issue: issueActionMap,
};

const props: string[] = ["issue", "head_commit"];
export function process(event: WebhookEvent) {
  let msg = "";
  for (const prop of props) {
    if (prop in event) {
      if ("action" in event) {
        if (actionsMap[prop]) {
          if (actionsMap[prop][event.action]) {
            msg = actionsMap[prop][event.action](event);
            break;
          }
        }
      } else {
        // "push" has no "action"
        msg = pushAction(event as PushEvent);
      }
    }
  }
  if (msg) console.log(msg);
}
