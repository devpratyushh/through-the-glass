# Through the Glass

Pratyush’s portfolio, built with React and Three.js. The opening CRT introduces the featured work, with a project directory and a photography section.

## Run locally

Use Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

Open the URL printed by the development server. Edit `components/selected-work.tsx` for the homepage project lineup, `app/projects/page.tsx` for the directory and certifications, and `components/photography.tsx` for the gallery.

## GitHub Pages

Push changes to `main` to deploy through the **Deploy portfolio to GitHub Pages** workflow. It uses the repository path reported by Pages and uploads the static export from `out/`.

To build that export locally:

```sh
NEXT_PUBLIC_PORTFOLIO_BASE_PATH=/through-the-glass npm run build:pages
```
