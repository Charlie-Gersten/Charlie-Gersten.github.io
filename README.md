# Charlie Gersten — Portfolio

Static site served by GitHub Pages. No build step.

| File | What it holds |
|---|---|
| `index.html` | Header, bio, at-a-glance facts, section headings, contact footer |
| `assets/content.js` | **All project and "Making" text, image choices and order** |
| `assets/style.css` | Colours, fonts, layout |
| `assets/app.js` | Renders cards, project pop-ups and the image lightbox |
| `assets/img/`, `assets/video/` | Web-ready media (`name.jpg` full size, `name-thumb.jpg` for cards) |
| `_tools/` | Scripts used to pull content from the old Wix site and export images (not served) |

Each project can be linked directly: `https://charlie-gersten.github.io/#robot`, `#grove`, `#ragbot`, `#logger`, `#textiles`, `#speaker`, `#solar-fan`.

## Images
`_tools/build_images.py` exports everything in `assets/img` from the original downloads in `_raw/media`
(kept locally, not committed). To add a new image, drop a JPEG straight into `assets/img/` as both
`name.jpg` (≤2000 px) and `name-thumb.jpg` (≤900 px), then reference `name` in `content.js`.

## Preview locally
```
python -m http.server 8000
```
then open http://localhost:8000
