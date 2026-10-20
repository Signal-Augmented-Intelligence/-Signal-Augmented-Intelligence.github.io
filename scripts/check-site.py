"""Checks for the SAI Lab site (guideline.md section 8).

Run after `jekyll build`. Checks rendered routes, internal links and anchors, required
data fields, seminar access rules, and personal-information patterns.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import re
import yaml

ROOT = Path('_site')
ORIGIN = 'https://lab.invalid'
ROUTES = ('index.html', 'research/index.html', 'people/index.html', 'publications/index.html',
          'seminars/index.html', 'news/index.html', '404.html')
PEOPLE_GROUPS = {'faculty', 'phd', 'ms', 'undergrad', 'alumni'}
PUB_TYPES = {'journal', 'conference-paper', 'conference-poster', 'other'}
SEMINAR_TYPES = {'research', 'paper-review', 'tutorial', 'invited'}
ACCESS = {'public', 'members', 'hidden'}
# Personal-information patterns that must never appear on a rendered page.
PRIVATE = {
    'phone number': re.compile(r'\b01[016789][- .]?\d{3,4}[- .]?\d{4}\b'),
    'resident registration number': re.compile(r'\b\d{6}-[1-4]\d{6}\b'),
    'personal email': re.compile(r'[\w.+-]+@(gmail|naver|daum|hanmail|kakao|nate|hotmail|outlook|yahoo)\.(com|net)', re.I),
}
errors = []


def load(path):
    return yaml.safe_load(Path(path).read_text()) or []


def front_matter(path):
    text = path.read_text()
    return yaml.safe_load(text.split('---', 2)[1])


# ---- data files ----
people = load('_data/people.yml')
ids = set()
for p in people:
    for key in ('id', 'name', 'group', 'role'):
        if not p.get(key):
            errors.append(f'people.yml: {p.get("id") or p.get("name")}: missing {key}')
    if p.get('group') not in PEOPLE_GROUPS:
        errors.append(f'people.yml: {p.get("id")}: group must be one of {sorted(PEOPLE_GROUPS)}')
    if p.get('id') in ids:
        errors.append(f'people.yml: duplicate id {p.get("id")}')
    ids.add(p.get('id'))
    if p.get('id') and not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', p['id']):
        errors.append(f'people.yml: id {p["id"]} must be lowercase-hyphen')
    if p.get('photo'):
        photo = Path('images/people') / p['photo']
        if not photo.is_file():
            errors.append(f'people.yml: {p["id"]}: photo {photo} not found')
        elif photo.stat().st_size > 200_000:
            errors.append(f'people.yml: {p["id"]}: photo larger than 200 KB')

for path in sorted(Path('_publications').glob('*.md')):
    fm = front_matter(path)
    for key in ('title', 'type', 'authors', 'venue', 'pub_date', 'permalink'):
        if not fm.get(key):
            errors.append(f'{path}: missing {key}')
    if fm.get('type') not in PUB_TYPES:
        errors.append(f'{path}: type must be one of {sorted(PUB_TYPES)}')
    if fm.get('pub_date') and not re.fullmatch(r'\d{4}(-\d{2}(-\d{2})?)?', str(fm['pub_date'])):
        errors.append(f'{path}: pub_date must be YYYY, YYYY-MM or YYYY-MM-DD')

hidden_titles = []
for s in load('_data/seminars.yml'):
    label = f'seminars.yml: {s.get("date")} {s.get("title")}'
    for key in ('date', 'term', 'presenter', 'title', 'type', 'access', 'file'):
        if not s.get(key):
            errors.append(f'{label}: missing {key}')
    if s.get('presenter') not in ids:
        errors.append(f'{label}: presenter {s.get("presenter")} is not a people.yml id')
    if s.get('type') not in SEMINAR_TYPES:
        errors.append(f'{label}: type must be one of {sorted(SEMINAR_TYPES)}')
    if s.get('access') not in ACCESS:
        errors.append(f'{label}: access must be one of {sorted(ACCESS)}')
    if s.get('file') and not re.fullmatch(r'[a-z0-9-]+/[A-Za-z0-9._-]+\.pdf', s['file']):
        errors.append(f'{label}: file must look like 2026-fall/2026-10-21-name.pdf')
    if s.get('access') == 'hidden':
        hidden_titles.append(s.get('title', ''))

# ---- rendered site ----
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.links = set(), []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if attrs.get(key):
                self.links.append(attrs[key])


pages = {p: Page(p.read_text()) for p in ROOT.rglob('*.html')}
for path, page in pages.items():
    source_url = ORIGIN + '/' + str(path.relative_to(ROOT)).removesuffix('index.html')
    for link in page.links:
        parsed = urlsplit(urljoin(source_url, link))
        if f'{parsed.scheme}://{parsed.netloc}' != ORIGIN:
            continue
        target = ROOT / unquote(parsed.path).lstrip('/')
        if target.is_dir():
            target = target / 'index.html'
        if not target.is_file():
            errors.append(f'{path}: missing {link}')
        elif parsed.fragment and target in pages and unquote(parsed.fragment) not in pages[target].ids:
            errors.append(f'{path}: missing anchor {link}')
    text = path.read_text()
    for name, pattern in PRIVATE.items():
        if pattern.search(text):
            errors.append(f'{path}: looks like a {name}')
    for title in hidden_titles:
        if title and title in text:
            errors.append(f'{path}: hidden seminar title is visible: {title}')

errors += [f'Missing route: {r}' for r in ROUTES if not (ROOT / r).is_file()]
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Checked {len(pages)} pages, {len(people)} people, {len(list(Path("_publications").glob("*.md")))} publications.')
