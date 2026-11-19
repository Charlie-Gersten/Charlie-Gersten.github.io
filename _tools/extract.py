"""Extract text + media from the downloaded Wix portfolio pages into content.json."""
import json, re, glob, os, html, sys

RAW = sys.argv[1]  # path to _raw
OUT = sys.argv[2]  # path to write content.json


def strip(h):
    h = re.sub(r'<br\s*/?>', '\n', h)
    h = re.sub(r'</p>\s*<p[^>]*>', '\n\n', h)
    return html.unescape(re.sub(r'<[^>]+>', '', h)).strip()


def parse_src(src):
    m = re.match(r'wix:image://v1/([^/]+)/[^#]*#originWidth=(\d+)&originHeight=(\d+)', src)
    if m:
        return {'kind': 'image', 'id': m.group(1), 'w': int(m.group(2)), 'h': int(m.group(3))}
    m = re.match(r'wix:video://v1/([^/]+)/[^#]*#posterUri=([^&]+)&posterWidth=(\d+)&posterHeight=(\d+)', src)
    if m:
        return {'kind': 'video', 'id': m.group(1), 'poster': m.group(2), 'w': int(m.group(3)), 'h': int(m.group(4))}
    return {'kind': 'unknown', 'raw': src}


projects = []
for f in sorted(glob.glob(os.path.join(RAW, 'proj', '*.html'))):
    s = open(f, encoding='utf8', errors='replace').read()
    m = re.search(r'<script type="application/json" id="wix-warmup-data">(.*?)</script>', s, re.S)
    data = json.loads(m.group(1))
    texts, galleries = [], []
    for upd in data['platform']['ssrPropsUpdates']:
        for comp, props in upd.items():
            if 'html' in props:
                texts.append(strip(props['html']))
            if 'wixSDKItems' in props:
                items = []
                for it in props['wixSDKItems']:
                    d = parse_src(it.get('src', ''))
                    d.update(title=it.get('title', ''), description=it.get('description', ''))
                    items.append(d)
                galleries.append(items)
    slug = os.path.basename(f)[:-5]
    projects.append({'slug': slug, 'texts': texts, 'galleries': galleries})

# Static pages (Home / About) from page JSON
pages = {}
for f in glob.glob(os.path.join(RAW, '60e371_*.json')):
    d = json.load(open(f, encoding='utf8'))
    dd = d.get('data', {}).get('document_data', {})
    title = [v.get('title') for v in dd.values() if isinstance(v, dict) and v.get('type') == 'Page']
    if d['structure'].get('type') != 'Page':
        continue
    texts = [strip(v['text']) for v in dd.values() if isinstance(v, dict) and v.get('type') == 'StyledText']
    imgs = [{'id': v['uri'], 'w': v.get('width'), 'h': v.get('height'), 'title': v.get('title', '')}
            for v in dd.values() if isinstance(v, dict) and v.get('type') == 'Image']
    pages[title[0]] = {'texts': texts, 'images': imgs}

json.dump({'pages': pages, 'projects': projects}, open(OUT, 'w', encoding='utf8'), indent=1, ensure_ascii=False)
print('projects', len(projects), 'pages', list(pages))
