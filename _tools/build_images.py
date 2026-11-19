"""Export web images from the original Wix media.

Usage:  python _tools/build_images.py            (run from the portfolio folder)

- Originals live in _raw/media (downloaded from the old Wix site; not committed).
- If an AI-upscaled version exists at _raw/enhanced/<media id>.png it is used instead.
- Low-res images without an enhanced version get a 2x Lanczos resample + unsharp mask.
- All output is JPEG with EXIF (incl. phone GPS) stripped and orientation applied.
"""
import os, shutil
from PIL import Image, ImageOps, ImageFilter

RAW = '_raw/media'
ENH = '_raw/enhanced'
OUT = 'assets/img'
VID = 'assets/video'
MAX = 2000      # long edge of full-size image
THUMB = 900     # long edge of card thumbnails

P = '60e371_'
# media id (without prefix / ~mv2 suffix) -> output name
IMAGES = {
    # Self-balancing robot
    '53548f1b6b1a4a1b8804271829ec5195': 'sbr-cad-iso',
    'a0d8ed8e53a84db1affbf511ab3e3dc4': 'sbr-cad-front',
    'bba77cbbda8c42e0801a7283a3afe0fb': 'sbr-skeleton',
    '594649585db844a9a566f0d886715e14': 'sbr-schematic',
    '61d0427a19244168890ffd8cea84d8e2': 'sbr-pcb-top',
    '8848d685dde546a79949968a9646704b': 'sbr-pcb-bottom',
    'cc143991045842d9bcb270df582b4f88': 'sbr-pcb-render',
    'babc7db75edc46a3a61af35045483cb8': 'sbr-pcb-assembly',
    'b5e0541ddd874b19bc85014d3de60e1a': 'sbr-print-fit',
    '834067085ebb45c5b503055dcd0653b3': 'sbr-pcb-mounted',
    'd4826ca590ee4a9fb70297fd56a2b6ef': 'sbr-assembly',
    # Grove Design
    '7ef422fee5954976ad2bfea241ac5419': 'grove-parallel-arm',
    '2c733f25262646b99323b2c4ef7c7285': 'grove-metrology',
    '11c5e89a1269402595da3832818d0158': 'grove-printing',
    # RagBot
    'cb10ae1ce08e47a19b33d411165f2dda': 'ragbot-render',
    '599002102b704af6b81902ab4bf547cb': 'ragbot-prototype',
    'a64b954c788240cf8eb3d1a1e1e4b57f': 'ragbot-linkage-cad',
    'bd0e0cf01aaa46e08a55647da4eb1674': 'ragbot-torque',
    'd847558d3ae14a53a21552d15cd48ac6': 'ragbot-position',
    'ee517e105663485cbab65806360fdde2f000': 'ragbot-linkage-test-poster',
    '6549d0b71ec94a38918922f854f989c9f000': 'ragbot-final-test-poster',
    # Raspberry Pi logger (Geochemic)
    'b687bf0d21504e01b275abcdcbb0fe9b': 'pi-lcd-box',
    '0cf7672ae03e401cbe540209fed3d871': 'pi-enclosure-render',
    '4f7e71a78b044da9813ef210284934ce': 'pi-setup',
    '4a8320017ddd4266b1c989bc71ffec02': 'pi-case',
    'f40c650aa89449b59f661c82c046617b': 'pi-sensors',
    '84a0b118f1144e2a82831b8652a6d088': 'pi-rain-rig',
    # Speaker
    'a3b964217f3d4363ba918b4f170fc2d6': 'speaker-final',
    'ba08607a302d46309ce264374e72f5d7': 'speaker-garden',
    '1309e94dd0a84f13b75f4b83f5c6980f': 'speaker-render',
    '10b3f757b500465faa5d726a1fb4d663': 'speaker-sketches',
    '88d5b594b49946578d484e40bccd5709': 'speaker-casing',
    '9621a7b292694985be0cf7cb8516e79b': 'speaker-crossover',
    '7577fc807cd64cbfa8d82b5c0323aea4': 'speaker-internals',
    '61751b40743d4accaae01e8dc81b5516': 'speaker-back',
    '322bea5ea55541829cef4777d6a159b1f000': 'speaker-cad-poster',
    # Solar fan
    '8a2456f31f7d43dc9946209142e12b73': 'fan-cad',
    '2b33fa69b2a34fd59df48c2456f758c2': 'fan-sketches',
    '182b7f56d72744c5816972bfa9f26aeb': 'fan-blade-concepts',
    # Making / furniture
    'fee609d04189493691966566fdaef6f6': 'make-desk',
    '8c18d052ae5d4e8e935240f195fff36d': 'make-desk-top',
    '8cf3d41835f149c090e519e4b82679e8': 'make-pallet-bed',
    '3ddfed6557a7452dbe0c39011719eee3': 'make-sofa',
    '1062526f5d934fd2bc2b509cb13a8cef': 'make-sofa-bed',
    'c72b77cfeac74fc08be5b77758ace264': 'make-tv-stand',
    'fbcb2b75dd584155a5559cbd9cf30d9d': 'make-bedside',
    'a7676a15560f467f9f1139d05c8c4d4d': 'make-rail',
    '5aee47ca68e14b969a0e6ecc439a117b': 'make-bowl',
    '6cd822b4cb9f42a48cb0814a5794471e': 'make-lamp',
    # Header sketch
    '9d5f6a5a8c264d9e8df52525cd98101c': 'sketch-mouse',
}
VIDEOS = {
    'ee517e105663485cbab65806360fdde2': 'ragbot-linkage-test',
    '6549d0b71ec94a38918922f854f989c9': 'ragbot-final-test',
    '322bea5ea55541829cef4777d6a159b1': 'speaker-cad',
}


def find(mid):
    for f in os.listdir(RAW):
        if f.startswith(P + mid):
            return os.path.join(RAW, f)
    raise FileNotFoundError(mid)


def flatten(im):
    im = ImageOps.exif_transpose(im)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, 'white')
        bg.paste(im, mask=im.split()[-1])
        return bg
    return im.convert('RGB')


def save(im, path, edge):
    im = im.copy()
    im.thumbnail((edge, edge), Image.LANCZOS)
    im.save(path, 'JPEG', quality=84, optimize=True, progressive=True)  # no exif passed -> stripped


os.makedirs(OUT, exist_ok=True)
os.makedirs(VID, exist_ok=True)
report = []
for mid, name in IMAGES.items():
    enh = os.path.join(ENH, P + mid + '.png')
    if os.path.exists(enh):
        im, how = flatten(Image.open(enh)), 'AI-enhanced'
    else:
        im = flatten(Image.open(find(mid)))
        how = 'original'
        if max(im.size) < 1000:
            im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
            im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
            how = 'fallback-upscaled'
    save(im, os.path.join(OUT, name + '.jpg'), MAX)
    save(im, os.path.join(OUT, name + '-thumb.jpg'), THUMB)
    report.append(f'{name:28} {how}')

for mid, name in VIDEOS.items():
    shutil.copyfile(os.path.join(RAW, P + mid + '.mp4'), os.path.join(VID, name + '.mp4'))

print('\n'.join(report))
