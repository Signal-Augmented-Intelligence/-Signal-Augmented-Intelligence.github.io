# SAI Lab website

SAI Lab — Signal Augmented Intelligence, Hanshin University.
Site: https://signal-augmented-intelligence.github.io/ · Organization: https://github.com/Signal-Augmented-Intelligence

**Read `guideline.md` first.** It covers design rules, data formats, seminar uploads, review checklist and handover.

## Where content lives
| What | File |
| --- | --- |
| Lab name, contact, logo | `_data/lab.yml` |
| People | `_data/people.yml`, photos in `images/people/` |
| Publications | `_publications/*.md` (one file per paper) |
| Research themes | `_data/research.yml` |
| Seminars | `_data/seminars.yml`, PDFs in the `seminars-public` / `seminars-internal` releases |
| News | `_data/news.yml` |

## Preview and checks
Requires Ruby 3.3 and Bundler.
```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter
python3 scripts/check-site.py   # needs PyYAML: python3 -m pip install pyyaml
```

## Publishing
`draft: true` in `_config.yml` adds `noindex`, a `Disallow: /` robots.txt and a footer note, and the
GitHub Actions workflow stops before deploying. Set it to `false` once the lab approves publication.

Academic Pages / Minimal Mistakes: MIT license in `LICENSE`. Roboto: SIL Open Font License in `assets/fonts/roboto/OFL.txt`.
