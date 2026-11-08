'use client';

import {useState} from 'react';

const photos = [
  {
    title: 'Sadhu with a bird',
    alt: 'A man in a turban with a bird perched on his shoulder',
    source: 'https://unsplash.com/photos/a-man-in-a-turban-with-a-bird-on-his-shoulder-mQBKw9zlH5Y',
    image: 'https://images.unsplash.com/photo-1726303448966-0b692ebd8334',
    width: 480,
    height: 320,
  },
  {
    title: 'Ganga Aarti',
    alt: 'Two men performing a fire ritual with lamps at night',
    source: 'https://unsplash.com/photos/two-men-perform-a-fire-ritual-with-lamps-b51Q1N0xwSc',
    image: 'https://images.unsplash.com/photo-1764173517657-0e7d94d94a4b',
    width: 480,
    height: 720,
  },
  {
    title: 'At the market',
    alt: 'A man looking at a market stall filled with earrings',
    source: 'https://unsplash.com/photos/man-looking-at-display-of-earrings-at-market-3QjFs9vTw6U',
    image: 'https://images.unsplash.com/photo-1768655012957-579afbbf6c9a',
    width: 480,
    height: 270,
  },
];

const photoUrl = (image: string, width: number) => `${image}?auto=format&fit=max&q=80&w=${width}`;

export default function Photography() {
  const [playing, setPlaying] = useState(false);

  return (
    <section id="photos" className="photos paper">
      <div className="section-label">
        <span>06 / FIELD OBSERVATIONS</span>
        <span>STREET · DOCUMENTARY · FILM</span>
      </div>
      <div className="section-heading">
        <h2>Outside<br /><em>the machine.</em></h2>
        <p>Sometimes the best thing to do<br />is close the laptop and look around.</p>
      </div>
      <div className="contact-sheet">
        {photos.map((photo, index) => (
          <figure className="photo-slot" key={photo.source}>
            <span className="frame-no">FRAME 0{index + 1}</span>
            <a className="photo-frame" href={photo.source} target="_blank" rel="noreferrer">
              <img
                src={photoUrl(photo.image, 800)}
                srcSet={[480, 800, 1200].map(width => `${photoUrl(photo.image, width)} ${width}w`).join(', ')}
                sizes="(max-width: 600px) 86vw, 29vw"
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
              />
            </a>
            <figcaption className="photo-caption"><span>{photo.title}</span><span>0{index + 1} — P.</span></figcaption>
          </figure>
        ))}
      </div>
      <figure className="photo-film">
        <figcaption className="film-caption">
          <div>
            <span className="frame-no">04 / MOVING IMAGE</span>
            <h3>Dev Diwali 2025</h3>
            <p>A cinematic travel film from Varanasi.</p>
          </div>
          <a className="text-link" href="https://youtu.be/fa2lg3EZj80" target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
        </figcaption>
        <div className="film-frame">
          {playing ? (
            <iframe
              src="https://www.youtube.com/embed/fa2lg3EZj80?autoplay=1&playsinline=1"
              title="Dev Diwali 2025 — A cinematic travel film from Varanasi"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button className="film-play" type="button" onClick={() => setPlaying(true)} aria-label="Play Dev Diwali 2025">
              <img src="https://i.ytimg.com/vi/fa2lg3EZj80/maxresdefault.jpg" alt="" loading="lazy" decoding="async" />
              <span className="film-play-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 4v16l13-8z" /></svg>
              </span>
            </button>
          )}
        </div>
      </figure>
    </section>
  );
}
