export function linkedTaskOwnership(cached, sourcePath) {
  if (!cached) {
    return { process: false, reason: "missing-owner" };
  }
  if (cached.sourcePath !== sourcePath) {
    return { process: false, reason: "non-owner", owner: cached.sourcePath };
  }
  return { process: true, reason: "owner", owner: sourcePath };
}

export function shouldCreateIssue(taskSource) {
  return taskSource?.createIssues !== false;
}
