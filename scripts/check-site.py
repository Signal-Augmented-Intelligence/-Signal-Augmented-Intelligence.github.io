"""Check rendered routes, internal links and anchors, and keep personal-site assets out of the lab site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path('_site')
ORIGIN = 'https://lab.invalid'
ROUTES = ('index.html', 'research/index.html', 'people/index.html', 'publications/index.html', 'news/index.html', '404.html')
# Personal-site assets and contact details that must not appear on the lab site.
FORBIDDEN = ('so-yeong-park.jpg', 'Park_So_Yeong_CV', 'kong02931', 'favicon.svg?v=herb')


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
errors = []
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
    errors += [f'{path}: personal-site asset or contact {term}' for term in FORBIDDEN if term in text]

errors += [f'Missing route: {r}' for r in ROUTES if not (ROOT / r).is_file()]
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Checked {len(pages)} pages.')
