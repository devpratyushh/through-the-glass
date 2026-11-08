export function ForecastPreview() {
  return (
    <div className="wave">
      <span>ILLUSTRATIVE / PATTERNS IN THE NOISE</span>
      <svg viewBox="0 0 400 160" role="img" aria-label="Illustrative waveform becoming a trend">
        <path d="M0 130 H400 M30 10 V150" className="axis" />
        <path d="M30 120 Q60 30 90 95 T150 70 T210 55 T270 35 T330 25 L390 15" />
        <path d="M30 128 L390 18" className="trend" />
        {[60, 100, 140, 180, 220, 260, 300, 340].map((x, i) => <circle key={x} cx={x} cy={115 - i * 12 + (i % 2) * 15} r="3" />)}
      </svg>
      <div>OBSERVATION → MODEL → VALIDATION</div>
    </div>
  );
}

export function LabPreview() {
  return (
    <div className="topology">
      <span>GHAR LABS / SYSTEM SKETCH</span>
      <div className="node">Cloudflare Tunnel <b>↓</b></div>
      <div className="node main-node">Ubuntu VM</div>
      <div className="branches"><span>Jellyfin</span><span>Grafana</span><span>Prometheus</span></div>
      <small>PUBLIC ACCESS / PRIVATE ADMIN VIA TAILSCALE</small>
    </div>
  );
}
