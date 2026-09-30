# Immigration Office Medan — GitHub Pages

This repository is prepared from the Hostinger Horizons export and configured for the GitHub user-site repository:

`ImmigrationOfficeMedan/IzinTinggalKNOSIGAP.github.io`

Expected public URL:

`https://immigrationofficemedan.github.io/IzinTinggalKNOSIGAP.github.io/`

## Important architecture note

The original application uses PocketBase at `/hcgi/platform` for dynamic service data and authentication. GitHub Pages can host the frontend build, but it does not provide a PocketBase backend.

Therefore:
- the frontend source and UI are preserved;
- the GitHub Pages workflow builds and publishes the React/Vite frontend;
- dynamic services, search data, guarantor login, and admin features still require a reachable PocketBase backend;
- no backend data has been invented or copied because the exported PocketBase database contains no application records.

## Publish settings

In GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.

Pushing to `main` automatically rebuilds and republishes the site.
