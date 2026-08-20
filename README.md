# ABNBHost Website

A standalone responsive seven-page marketing website for ABNBHost. No build step or dependency installation is required.

## Included pages

- `index.html` — Home
- `about.html` — About ABNBHost
- `services.html` — Services
- `portfolio.html` — Portfolio
- `why-abnbhost.html` — Why ABNBHost
- `insights.html` — Insights
- `partner.html` — Partner with us / property lead form

## Run locally

From this folder, start a static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

The property photography is sourced from Unsplash at runtime and can be swapped for final brand photography in the HTML files and `styles.css`.

## Lead form

Owner inquiries are directed to `hello@abnbhost.com` through FormSubmit. On the first real form submission, FormSubmit will send an activation email to that address; confirm it once to activate delivery. For a more custom production setup, this can later be connected to a CRM or dedicated form backend.
