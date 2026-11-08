import inventory from '../data/github-projects.json';

export type GitHubProject = {
  name: string;
  url: string;
  language?: string;
  summary?: string;
  live?: string;
  fork?: boolean;
  archived?: boolean;
};

export const githubProjects: readonly GitHubProject[] = inventory;

const projectsByName = new Map(githubProjects.map(project => [project.name, project]));

export function githubProject(name: string) {
  return projectsByName.get(name);
}
