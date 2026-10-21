# SAI Lab website

SAI Lab — Signal Augmented Intelligence, Hanshin University.
Site: https://signal-augmented-intelligence.github.io/ · Organization: https://github.com/Signal-Augmented-Intelligence

**Read `guideline.md` first.** It covers design rules, data formats, seminar uploads, review checklist and handover.

## Where content lives
| What | File |
| --- | --- |
| Lab name, contact, logo, upload endpoint | `_data/lab.yml` |
| Professor page | `_data/professor.yml` |
| Members | `_data/people.yml`, photos in `images/people/` |
| Research areas | `_research/*.md` (one file per area) |
| Publications | `_publications/*.md` (one file per paper) |
| Seminars | `_data/seminars.yml`, PDFs in `files/seminars/` |
| News | `_data/news.yml` |
| Menus and tabs | `_data/navigation.yml` |
| Upload relay (Google Apps Script) | `tools/upload-relay/Code.gs` |

## Build and checks
GitHub Actions builds every push and pull request (`.github/workflows/pages.yml`), then runs
`scripts/check-site.py` for local links and personal-information patterns. Pushes to `main` deploy to GitHub Pages.

To build locally (optional, Ruby 3.3 and Bundler):
```sh
bundle install
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter
python3 scripts/check-site.py
```

## Publishing
`draft: true` in `_config.yml` adds `noindex`, a `Disallow: /` robots.txt and a footer note while the site is
deployed for review. Set it to `false` once the lab approves publication.

Academic Pages / Minimal Mistakes: MIT license in `LICENSE`. Roboto: SIL Open Font License in
`assets/fonts/roboto/OFL.txt`. Pretendard: SIL Open Font License in `assets/fonts/pretendard/OFL.txt`.
