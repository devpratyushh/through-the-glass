'use client';

import {useEffect, useRef, useState} from 'react';
import {sitePath} from '../lib/site-path';
import {ForecastPreview, LabPreview} from './project-previews';
import SameRowPreview from './samerow-preview';
import TransactionStudy from './transaction-study';

const details = {
  samerow: {
    title: 'SameRow V2',
    body: [
      'The question: how can two people watch together without routing all media through a server?',
      'WebRTC Data Channels carry raw MPEG-TS chunks between peers. Browser-native MSE playback uses a processQueue jitter buffer, while server-authoritative drift correction keeps late joiners in step.',
      'The two playback tracks illustrate synchronisation. Bring them together to see both screens reach the same moment.',
    ],
    repo: 'Samerow-V2',
  },
  predictors: {
    title: 'Finding the signal',
    body: [
      'JoSAA & CSAB: compare Ridge, Random Forest, and Gradient Boosted regressors against historical closing-rank matrices, with RMSE and MAPE for evaluation.',
      'WBJEE: time-decay weighting and median-clip anomaly dampening account for changes in historical cutoffs. A Streamlit interface groups possibilities into Safe, Realistic, Ambitious, and Dream bands.',
      'These are modelling projects, with uncertainty at their core. The graphic here is illustrative, not a live admissions prediction.',
    ],
    repo: 'WBJEE-PREDICTOR',
  },
  gharlabs: {
    title: 'Ghar Labs v1',
    body: [
      'A monolithic Ubuntu Server 24.04 LTS virtual machine orchestrating 10+ services with Docker Compose.',
      'Jellyfin, Prometheus, and Grafana share a system with explicit PUID/PGID boundaries and centralised volume mounting.',
      'Cloudflare Tunnels provide public HTTP access. Tailscale provides private administrative access behind CGNAT.',
    ],
    repo: 'homelab-v1-archive',
  },
};

type ProjectId = keyof typeof details;

function ProjectDialog({project, close}: {project: ProjectId; close: () => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const {title, body, repo} = details[project];
  useEffect(() => { dialog.current?.showModal(); }, []);

  return (
    <dialog ref={dialog} aria-labelledby="project-dialog-title" onClose={close} onClick={event => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    }}>
      <button className="close" onClick={() => dialog.current?.close()} autoFocus aria-label="Close project">×</button>
      <span className="eyebrow">NOTES FROM THE BUILD</span>
      <h2 id="project-dialog-title">{title}</h2>
      {body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      <a className="text-link" href={`https://github.com/devpratyushh/${repo}`} target="_blank" rel="noreferrer">Explore the repository ↗</a>
    </dialog>
  );
}

export default function SelectedWork() {
  const [selected, setSelected] = useState<ProjectId | null>(null);

  return (
    <section id="work" className="work paper">
      <div className="section-label"><span>THE THINGS BEHIND THE SCREEN</span><span>SELECTED WORK / 2020—NOW</span></div>
      <div className="section-heading">
        <h2>Curiosity,<br/><em>put to work.</em></h2>
        <p>A few experiments that made it out of my head<br/>and into a browser. Open one to see how it works.</p>
      </div>
      <article id="samerow" className="project">
        <div className="project-number">01</div>
        <div className="project-info">
          <span className="eyebrow">REAL-TIME SYSTEMS</span>
          <h3>SameRow V2</h3>
          <p>A shared moment, across different screens. Peer-to-peer media delivery, browser-native playback, and keeping everyone in step.</p>
          <div className="tags">React / WebRTC / Socket.io / MSE</div>
          <div className="samerow-links">
            <a className="samerow-live" href="https://samerow-v2.vercel.app/" target="_blank" rel="noreferrer">Live demo ↗</a>
            <a className="text-link" href="https://github.com/devpratyushh/Samerow-V2" target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
          <button className="text-link" onClick={() => setSelected('samerow')}>Inside the build ↗</button>
        </div>
        <SameRowPreview />
      </article>
      <article id="predictors" className="project">
        <div className="project-number">02</div>
        <div className="project-info">
          <span className="eyebrow">DATA & EXPERIMENTS</span>
          <h3>Finding the signal.</h3>
          <p>JoSAA, CSAB, and WBJEE forecasting experiments. Historical cutoffs, changing rounds, and the uncertainty between a rank and a possibility.</p>
          <div className="tags">Python / scikit-learn / Pandas / XGBoost</div>
          <button className="text-link" onClick={() => setSelected('predictors')}>Follow the thinking ↗</button>
        </div>
        <ForecastPreview />
      </article>
      <article id="aml" className="project">
        <div className="project-number">03</div>
        <div className="project-info">
          <span className="eyebrow">IN DEVELOPMENT / GRAPH LEARNING</span>
          <h3>Following the connections.</h3>
          <p>An anti-money-laundering app exploring transaction graphs with LINEMVNGNN. This interactive sketch shows how connected accounts can be inspected.</p>
          <p>The network uses synthetic data. Architecture, evaluation results, and a working app demo will be added as the project develops.</p>
          <div className="tags">Transaction graphs / LINEMVNGNN / AML</div>
        </div>
        <TransactionStudy />
      </article>
      <article id="gharlabs" className="project">
        <div className="project-number">04</div>
        <div className="project-info">
          <span className="eyebrow">SELF-HOSTED INFRASTRUCTURE</span>
          <h3>A little lab at home.</h3>
          <p>Ten-plus containerised services on an Ubuntu VM. A place to learn networking, observability, and what happens when you run it yourself.</p>
          <div className="tags">Docker / Ubuntu / Cloudflare / Tailscale</div>
          <button className="text-link" onClick={() => setSelected('gharlabs')}>Open the cabinet ↗</button>
        </div>
        <LabPreview />
      </article>
      <article id="early" className="project early-projects">
        <div className="project-number">05</div>
        <div className="project-info">
          <span className="eyebrow">THE EARLY EXPERIMENTS</span>
          <h3>Start small. Keep building.</h3>
          <p>Chat apps, live updates, and experiments with the DOM. The early work behind my interest in connecting people through software.</p>
          <div className="tags">JavaScript / Firebase / DOM interactions</div>
        </div>
        <div className="archive-list">
          <a href="https://github.com/devpratyushh/circle" target="_blank" rel="noreferrer"><b>Circle ↗</b><span>A multimedia social platform. Conversations and real-time interaction.</span></a>
          <a href="https://github.com/devpratyushh/Talkative" target="_blank" rel="noreferrer"><b>Talkative ↗</b><span>Disposable chat rooms from my early JavaScript experiments.</span></a>
          <div><b>DOM experiments</b><span>Learning how clicks, events, and state change a page.</span></div>
        </div>
      </article>
      <div className="work-explore"><a className="project-action project-action-primary" href={sitePath('/projects/')}>Explore more ↗</a></div>
      {selected && <ProjectDialog project={selected} close={() => setSelected(null)} />}
    </section>
  );
}
