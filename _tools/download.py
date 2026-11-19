"""Download original-resolution media referenced in content.json."""
import json, os, re, sys, urllib.request

RAW = sys.argv[1]
d = json.load(open(os.path.join(RAW, 'content.json'), encoding='utf8'))
out = os.path.join(RAW, 'media')
os.makedirs(out, exist_ok=True)


def get(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return True
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=120) as r, open(dest, 'wb') as f:
            f.write(r.read())
        return True
    except Exception as e:
        print('FAIL', url, e)
        return False


ids = set()
for p in d['projects']:
    for g in p['galleries']:
        for it in g:
            if it['kind'] == 'image':
                ids.add(it['id'])
            elif it['kind'] == 'video':
                ids.add(it['poster'])
                vid = it['id']
                for q in ('1080p', '720p', '480p', '360p'):
                    if get(f'https://video.wixstatic.com/video/{vid}/{q}/mp4/file.mp4', os.path.join(out, f'{vid}.mp4')):
                        print('video', vid, q)
                        break
# any other media ids on the static pages
for f in os.listdir(RAW):
    if f.endswith('.json') and f.startswith('60e371_'):
        ids |= set(re.findall(r'[a-f0-9]{6}_[a-f0-9]{32}~mv2\.(?:jpg|jpeg|png|webp|gif)', open(os.path.join(RAW, f), encoding='utf8').read(), re.I))
for i in sorted(ids):
    get(f'https://static.wixstatic.com/media/{i}', os.path.join(out, i))
print('done', len(ids), 'images')
