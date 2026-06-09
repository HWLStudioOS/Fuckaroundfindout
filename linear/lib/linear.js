import { info, warn, err } from "./log.js";

const ENDPOINT = "https://api.linear.app/graphql";

function apiKey() {
  const k = process.env.LINEAR_API_KEY;
  if (!k) {
    throw new Error(
      "LINEAR_API_KEY is not set. Generate a Personal API Key at https://linear.app/settings/api and export it: `export LINEAR_API_KEY=lin_api_...`",
    );
  }
  return k;
}

export async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey(),
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Linear API HTTP ${res.status}: ${body}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error("Linear API errors: " + JSON.stringify(json.errors));
  }
  return json.data;
}

export async function viewer() {
  const data = await gql(`query { viewer { id name email } organization { id name urlKey } }`);
  return { viewer: data.viewer, org: data.organization };
}

export async function listTeams() {
  const data = await gql(
    `query { teams(first: 100) { nodes { id key name description } } }`,
  );
  return data.teams.nodes;
}

export async function createTeam({ name, key, description }) {
  const data = await gql(
    `mutation($input: TeamCreateInput!) {
      teamCreate(input: $input) { success team { id key name } }
    }`,
    { input: { name, key, description } },
  );
  if (!data.teamCreate.success) throw new Error("teamCreate failed");
  return data.teamCreate.team;
}

export async function listProjects(teamId) {
  const data = await gql(
    `query($teamId: String!) {
      team(id: $teamId) {
        projects(first: 250) { nodes { id name description state url } }
      }
    }`,
    { teamId },
  );
  return data.team.projects.nodes;
}

export async function createProject({ name, description, teamIds, state }) {
  const data = await gql(
    `mutation($input: ProjectCreateInput!) {
      projectCreate(input: $input) { success project { id name url } }
    }`,
    { input: { name, description, teamIds, state: state || "started" } },
  );
  if (!data.projectCreate.success) throw new Error("projectCreate failed: " + name);
  return data.projectCreate.project;
}

export async function updateProject(id, patch) {
  const data = await gql(
    `mutation($id: String!, $input: ProjectUpdateInput!) {
      projectUpdate(id: $id, input: $input) { success project { id name } }
    }`,
    { id, input: patch },
  );
  return data.projectUpdate.project;
}

export async function listIssues(teamId, since) {
  const data = await gql(
    `query($teamId: ID, $since: DateTimeOrDuration) {
      issues(filter: { team: { id: { eq: $teamId } }, updatedAt: { gt: $since } }, first: 250) {
        nodes {
          id identifier title description url updatedAt
          state { id name type }
          project { id name }
          labels { nodes { id name } }
          dueDate
        }
      }
    }`,
    { teamId, since: since || "P30D" },
  );
  return data.issues.nodes;
}

export async function createIssue({ teamId, projectId, title, description, labelIds, dueDate, stateId }) {
  const input = { teamId, title };
  if (projectId) input.projectId = projectId;
  if (description) input.description = description;
  if (labelIds && labelIds.length) input.labelIds = labelIds;
  if (dueDate) input.dueDate = dueDate;
  if (stateId) input.stateId = stateId;
  const data = await gql(
    `mutation($input: IssueCreateInput!) {
      issueCreate(input: $input) { success issue { id identifier title url state { name } } }
    }`,
    { input },
  );
  if (!data.issueCreate.success) throw new Error("issueCreate failed: " + title);
  return data.issueCreate.issue;
}

export async function updateIssue(id, patch) {
  const data = await gql(
    `mutation($id: String!, $input: IssueUpdateInput!) {
      issueUpdate(id: $id, input: $input) { success issue { id identifier title state { name } } }
    }`,
    { id, input: patch },
  );
  return data.issueUpdate.issue;
}

export async function listWorkflowStates(teamId) {
  const data = await gql(
    `query($teamId: String!) {
      team(id: $teamId) {
        states { nodes { id name type position } }
      }
    }`,
    { teamId },
  );
  return data.team.states.nodes;
}

export async function listLabels(teamId) {
  const data = await gql(
    `query($teamId: String!) {
      team(id: $teamId) {
        labels(first: 250) { nodes { id name } }
      }
    }`,
    { teamId },
  );
  return data.team.labels.nodes;
}

export async function createLabel({ teamId, name, color }) {
  const data = await gql(
    `mutation($input: IssueLabelCreateInput!) {
      issueLabelCreate(input: $input) { success issueLabel { id name } }
    }`,
    { input: { teamId, name, color: color || "#6E7E8C" } },
  );
  if (!data.issueLabelCreate.success) throw new Error("label create failed");
  return data.issueLabelCreate.issueLabel;
}
