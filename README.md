# SAI Lab website (draft)

SAI Lab — Signal Augmented Intelligence, Hanshin University.
GitHub organization: https://github.com/Signal-Augmented-Intelligence

Jekyll site for SAI Lab, Hanshin University, built from the Academic Pages layout used on
the personal site at https://green4849.github.io/. This directory is separate from the
personal site; nothing here is published yet. Open items are listed in `REVIEW.md`.

## Pages
- Home: `_pages/home.md` — introduction, research themes, latest news and publications
- Research: `_pages/research.html`, data in `_data/research.yml`
- People: `_pages/people.html`, data in `_data/people.yml`
- Publications: `_pages/publications.html`, records in `_publications/`
- News: `_pages/news.html`, data in `_data/news.yml`

Lab name, institution and advisor (sidebar, footer, intro) come from `lab:` in `_config.yml`.

## Updating content
- Publication: copy a file in `_publications/`. Keep the author order and status as published.
  `citation_note` holds awards or acceptance status; `resources` lists public links only.
- Research theme: add an entry to `_data/research.yml` and list related publication URLs.
- Person: add to `_data/people.yml` only after the person confirms name, role, period and link.
- News: add to `_data/news.yml`, newest first, with a link to a record on this site or a public source.

## Preview
Requires Ruby 3.3 and Bundler.
```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

## Build and check
```sh
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter
python3 scripts/check-site.py
```

## Publishing
`draft: true` in `_config.yml` adds `noindex`, a `Disallow: /` robots.txt and a footer note, and
the GitHub Actions workflow refuses to deploy while it is set. Before publishing: create
`Signal-Augmented-Intelligence/Signal-Augmented-Intelligence.github.io` (already set as `url` and
`repository` in `_config.yml`), then set `draft: false`.

## Design
Typography follows the personal site (`assets/css/profile.css`): local Roboto variable font,
16px / weight 320 / line-height 1.5, 1000px container, light headings, small metadata, divided
sections. No logo, favicon, photos or colour branding until official files are supplied.

Academic Pages / Minimal Mistakes: MIT license in `LICENSE`.
Roboto: SIL Open Font License in `assets/fonts/roboto/OFL.txt`.
