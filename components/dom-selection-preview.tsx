'use client';

import {useState} from 'react';

export default function DomSelectionPreview() {
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  return (
    <div className="dom-selection-preview">
      <span className="eyebrow">TEXT SELECTION / LOCAL DEMO</span>
      <p className={selectionEnabled ? '' : 'selection-blocked'}>
        Try selecting this sentence, then toggle text selection and try again.
      </p>
      <button type="button" className="project-action" aria-pressed={selectionEnabled} onClick={() => setSelectionEnabled(enabled => !enabled)}>
        Allow text selection
      </button>
      <span role="status">{selectionEnabled ? 'Selection enabled' : 'Selection blocked'}</span>
    </div>
  );
}
