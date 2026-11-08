import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {sitePath} from '../../lib/site-path';
import {githubProject, githubProjects} from '../../lib/github-projects';
import GitHubProjectIndex from '../../components/github-project-index';
import DomSelectionPreview from '../../components/dom-selection-preview';
import {ForecastPreview, LabPreview} from '../../components/project-previews';
import SameRowPreview from '../../components/samerow-preview';
import TransactionStudy from '../../components/transaction-study';

export const metadata: Metadata = {
  title: 'Projects & Certifications — Pratyush',
  description: 'Selected projects in real-time systems, data, and self-hosted infrastructure, plus certifications.',
};

type ProjectProps = {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  tags: string;
  code?: {repo: string; label?: string}[];
  notes?: string[];
  children?: ReactNode;
};

function Project({id, number, category, title, description, tags, code, notes, children}: ProjectProps) {
  const demoId = `${id}-demo`;
  const repositories = (code ?? []).flatMap(({repo, label}) => {
    const project = githubProject(repo);
    return project ? [{...project, label}] : [];
  });
  const live = repositories.length === 1 ? repositories[0].live : undefined;

  return (
    <article id={id} className={`project${children ? '' : ' project-compact'}`} aria-labelledby={`${id}-title`}>
      <div className="project-number" aria-hidden="true">{number}</div>
      <div className="project-info">
        <span className="eyebrow">{category}</span>
        <h3 id={`${id}-title`}>{title}</h3>
        <p>{description}</p>
        <div className="tags">{tags}</div>
        <div className="project-actions">
          {repositories.length ? repositories.map(({url, label = 'GitHub'}) => (
            <a key={url} className="project-action" href={url} target="_blank" rel="noreferrer">{label} ↗</a>
          )) : <span className="project-action project-action-unavailable">GitHub unavailable</span>}
          {live ? (
            <a className="project-action project-action-primary" href={live} target="_blank" rel="noreferrer">Live demo ↗</a>
          ) : children ? (
            <a className="project-action project-action-primary" href={`#${demoId}`}>Demo ↓</a>
          ) : <span className="project-action project-action-unavailable">Demo unavailable</span>}
        </div>
        {notes && (
          <details className="project-notes">
            <summary>Inside the build</summary>
            {notes.map(note => <p key={note}>{note}</p>)}
          </details>
        )}
      </div>
      {children && <div id={demoId} className="project-preview" tabIndex={-1} aria-label={`${title} preview`}>{children}</div>}
    </article>
  );
}

export default function ProjectsPage() {
  const describedProjects = githubProjects.filter(project => project.description?.trim());

  return (
    <main className="projects-page">
      <header>
        <a className="wordmark" href={sitePath('/')} aria-label="Pratyush, home">p<span>.</span></a>
        <a className="header-note" href={sitePath('/')}>PRATYUSH / PERSONAL EXPLORATIONS</a>
        <nav aria-label="Main navigation">
          <a href={sitePath('/projects/')} aria-current="page">Projects</a>
          <a href="#certifications">Certifications</a>
          <a href={sitePath('/#photos')}>Photographs</a>
        </nav>
      </header>

      <section className="projects-masthead" aria-labelledby="projects-title">
        <span className="eyebrow">PROJECT INDEX / 2020—NOW</span>
        <h1 id="projects-title">Selected <em>projects.</em></h1>
        <p>Real-time systems, data experiments, and the things I built to learn how they work.</p>
        <a className="text-link" href="#github-projects">Browse {describedProjects.length} GitHub projects ↓</a>
      </section>

      <section id="work" className="paper project-list" aria-label="Project directory">
        <div className="section-label"><span>THE THINGS BEHIND THE SCREEN</span><a href="#certifications">CERTIFICATIONS ↓</a></div>

        <Project id="samerow" number="01" category="REAL-TIME SYSTEMS" title="SameRow V2"
          description="A watch party for friends in different places. Share a room, see each other over a peer-to-peer call, and stay at the same point in the video."
          tags="React / WebRTC / Socket.io / MSE" code={[{repo: 'Samerow-V2'}]}
          notes={[
            'WebRTC carries calls between peers. Socket.io keeps room state, including play, pause, and seek, in sync.',
            'The two playback tracks illustrate drift. Bring them together to see both screens reach the same moment.',
          ]}>
          <SameRowPreview />
        </Project>

        <Project id="predictors" number="02" category="DATA & EXPERIMENTS" title="Finding the signal."
          description="JoSAA, CSAB, and WBJEE forecasting experiments. Historical cutoffs, changing rounds, and the uncertainty between a rank and a possibility."
          tags="Python / scikit-learn / Pandas / XGBoost"
          code={[{repo: 'JoSAA-CSAB-Closing-Rank-Predictor', label: 'JoSAA / CSAB GitHub'}, {repo: 'WBJEE-PREDICTOR', label: 'WBJEE GitHub'}]}
          notes={[
            'JoSAA & CSAB: compare Ridge, Random Forest, and Gradient Boosted regressors against historical closing-rank matrices, with RMSE and MAPE for evaluation.',
            'WBJEE: time-decay weighting and median-clip anomaly dampening account for changes in historical cutoffs. A Streamlit interface groups possibilities into Safe, Realistic, Ambitious, and Dream bands.',
          ]}>
          <ForecastPreview />
        </Project>

        <Project id="aml" number="03" category="IN DEVELOPMENT / GRAPH LEARNING" title="Following the connections."
          description="An anti-money-laundering app exploring transaction graphs with LINEMVNGNN. The interactive sketch uses synthetic data to show how connected accounts can be inspected."
          tags="Transaction graphs / LINEMVNGNN / AML">
          <TransactionStudy />
        </Project>

        <Project id="gharlabs" number="04" category="SELF-HOSTED INFRASTRUCTURE" title="A little lab at home."
          description="Ten-plus containerised services on an Ubuntu VM. A place to learn networking, observability, and what happens when you run it yourself."
          tags="Docker / Ubuntu / Cloudflare / Tailscale" code={[{repo: 'homelab-v1-archive'}]}
          notes={[
            'Jellyfin, Prometheus, and Grafana share an Ubuntu 24.04 LTS VM with explicit PUID/PGID boundaries and centralised volume mounting.',
            'Cloudflare Tunnels provide public HTTP access. Tailscale provides private administrative access behind CGNAT.',
          ]}>
          <LabPreview />
        </Project>

        <section id="early" className="early-projects" aria-labelledby="early-title">
          <div className="section-label"><span>THE EARLY EXPERIMENTS</span><span>2020—ONWARD</span></div>
          <h2 id="early-title">Start small. <em>Keep building.</em></h2>
          <Project id="circle" number="05" category="EARLY EXPERIMENTS" title="Circle"
            description="A multimedia social platform. Conversations and real-time interaction."
            tags="JavaScript / Firebase" code={[{repo: 'circle'}]} />
          <Project id="talkative" number="06" category="EARLY EXPERIMENTS" title="Talkative"
            description="Disposable chat rooms from my early JavaScript experiments."
            tags="JavaScript / DOM interactions" code={[{repo: 'Talkative'}]} />
          <Project id="dom-experiments" number="07" category="EARLY EXPERIMENTS" title="DOM experiments"
            description="Learning how clicks, events, and state change a page, including a browser extension that re-enables blocked page interactions."
            tags="JavaScript / Browser extensions" code={[{repo: 'Copy-Past-Pro'}]}>
            <DomSelectionPreview />
          </Project>
          <GitHubProjectIndex projects={describedProjects} />
        </section>

        <section id="certifications" className="certifications" aria-labelledby="certifications-title">
          <div className="section-label"><span>LEARNING RECORD</span><span>CREDENTIALS</span></div>
          <h2 id="certifications-title">Certifications.</h2>
          <div className="certificate-placeholder">
            <span className="certificate-icon" aria-hidden="true">✦</span>
            <div><h3>Coming soon</h3><p>Certification details and credential links will appear here.</p></div>
          </div>
        </section>
      </section>
      <footer className="projects-footer">
        <a href={sitePath('/')}>← Back to the portfolio</a>
        <a href={sitePath('/#photos')}>Photographs ↗</a>
      </footer>
    </main>
  );
}
