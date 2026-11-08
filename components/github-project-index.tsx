'use client';

import {useState} from 'react';
import type {GitHubProject} from '../lib/github-projects';

export default function GitHubProjectIndex({projects}: {projects: readonly GitHubProject[]}) {
  const [query, setQuery] = useState('');
  const [demosOnly, setDemosOnly] = useState(false);
  const terms = query.toLowerCase().trim().split(/\s+/);
  const results = projects.filter(project => {
    const searchable = `${project.name} ${project.language ?? ''} ${project.summary ?? ''} ${project.description ?? ''}`.toLowerCase();
    return (!demosOnly || project.live) && terms.every(term => searchable.includes(term));
  });

  return (
    <section id="github-projects" className="github-index" aria-labelledby="github-projects-title">
      <div className="section-label"><span>FROM GITHUB</span><span>{projects.length} PUBLIC REPOSITORIES</span></div>
      <div className="github-index-heading">
        <h3 id="github-projects-title">GitHub <em>projects.</em></h3>
        <a className="text-link" href="https://github.com/devpratyushh?tab=repositories" target="_blank" rel="noreferrer">View GitHub profile ↗</a>
      </div>
      <div className="github-index-controls">
        <label htmlFor="github-project-search">Find a project</label>
        <input id="github-project-search" type="search" value={query} onChange={event => setQuery(event.currentTarget.value)} placeholder="Search by name, language, or topic" />
        <label className="github-demo-filter">
          <input type="checkbox" checked={demosOnly} onChange={event => setDemosOnly(event.currentTarget.checked)} />
          Has a demo
        </label>
      </div>
      <p className="github-result-count" role="status">{results.length} of {projects.length} repositories</p>
      {results.length ? (
        <ul className="github-project-grid">
          {results.map(project => (
            <li key={project.url} className="github-project-row" data-repository={project.name}>
              <div>
                <h4>{project.name}</h4>
                <p>{project.summary ?? project.description}</p>
                <div className="tags">{[project.language, project.fork && 'Fork', project.archived && 'Archived'].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="github-row-actions">
                <a className="project-action" href={project.url} target="_blank" rel="noreferrer" aria-label={`GitHub repository for ${project.name}`}>GitHub ↗</a>
                {project.live && <a className="project-action project-action-primary" href={project.live} target="_blank" rel="noreferrer" aria-label={`Live demo for ${project.name}`}>Demo ↗</a>}
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="github-index-empty">No repositories match your search.</p>}
    </section>
  );
}
