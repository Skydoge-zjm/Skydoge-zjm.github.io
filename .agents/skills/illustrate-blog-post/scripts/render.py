"""Render a local draw(pen) recipe in the blog's spot illustration style."""

import argparse
import base64
from io import BytesIO
from pathlib import Path
import runpy

from PIL import Image, ImageChops, ImageDraw


WIDTH, HEIGHT = 280, 108
SCALE = 5


def scaled(points):
    return [(round(x * SCALE), round(y * SCALE)) for x, y in points]


class Pen:
    ink = (76, 78, 68, 220)
    fine = (90, 93, 82, 167)
    faint = (100, 102, 88, 93)
    umber = (145, 87, 59, 210)
    tint = (164, 111, 75, 100)
    shade = (114, 116, 99, 62)
    paper = (126, 129, 109, 22)

    def __init__(self):
        self.image = Image.new("RGBA", (WIDTH * SCALE, HEIGHT * SCALE))
        self._draw = ImageDraw.Draw(self.image)

    def line(self, points, color=ink, width=0.9):
        self._draw.line(scaled(points), fill=color, width=max(1, round(width * SCALE)), joint="curve")

    def face(self, points, fill=paper, outline=ink, width=0.8):
        self._draw.polygon(scaled(points), fill=fill)
        if outline is not None:
            self.line([*points, points[0]], outline, width)

    def hatch(self, points, spacing=3.0, color=faint, tilt=0.7):
        """Clip parallel strokes to one face. Tilt is horizontal travel per unit of height."""
        if spacing <= 0:
            raise ValueError("Hatch spacing must be positive")
        mask = Image.new("L", self.image.size)
        ImageDraw.Draw(mask).polygon(scaled(points), fill=255)
        strokes = Image.new("RGBA", self.image.size)
        draw = ImageDraw.Draw(strokes)
        xs, ys = zip(*points)
        top, bottom = min(ys), max(ys)
        run = tilt * (bottom - top)
        # Preserve the original series' hatch origin and cover steeper inclinations.
        margin = max(100, abs(run))
        x = min(xs) - margin
        while x < max(xs) + margin:
            draw.line(scaled([(x, bottom), (x + run, top)]), fill=color, width=round(0.45 * SCALE))
            x += spacing
        strokes.putalpha(ImageChops.multiply(strokes.getchannel("A"), mask))
        self.image.alpha_composite(strokes)

    def webp(self):
        raster = self.image.resize((WIDTH * 3, HEIGHT * 3), Image.Resampling.LANCZOS)
        buffer = BytesIO()
        raster.save(buffer, format="WEBP", lossless=True, method=6)
        return buffer.getvalue()


def write_proof(path, webp):
    uri = "data:image/webp;base64," + base64.b64encode(webp).decode("ascii")
    views = []
    for theme, label in (("light", "浅色"), ("dark", "深色")):
        views.append(f'<section class="{theme}"><h2>{label}</h2>')
        for size, caption in (("desktop", "桌面"), ("phone", "窄屏手机")):
            views.append(f'<figure><img class="{size}" src="{uri}" alt=""><figcaption>{caption}</figcaption></figure>')
        views.append("</section>")
    page = """<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>文章插画校样</title><style>
* { box-sizing: border-box } body { margin: 0; font: 14px system-ui, sans-serif }
main { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr)) }
section { padding: 24px } .light { background: #f8f7f3; color: #535952 }
.dark { background: #191c1b; color: #b8bcb2 } .dark img { filter: invert(1) hue-rotate(180deg) }
h2 { margin: 0; font-size: 18px } figure { margin: 24px 0 } img { display: block }
.desktop { width: min(340px, 100%); height: auto } .phone { width: 70px; height: 57px; object-fit: cover }
figcaption { margin-top: 8px }
</style><main>""" + "\n".join(views) + "</main></html>\n"
    path.write_text(page, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("recipe", type=Path, help="Python file defining draw(pen)")
    parser.add_argument("output", type=Path, help="Destination .webp file")
    parser.add_argument("--proof", type=Path, help="Optional standalone .html proof")
    args = parser.parse_args()
    if args.output.suffix.lower() != ".webp" or (args.proof and args.proof.suffix.lower() != ".html"):
        parser.error("Use .webp for the illustration and .html for the proof")
    draw = runpy.run_path(str(args.recipe)).get("draw")
    if not callable(draw):
        parser.error("The recipe must define draw(pen)")
    pen = Pen()
    draw(pen)
    webp = pen.webp()
    args.output.write_bytes(webp)
    if args.proof:
        write_proof(args.proof, webp)


if __name__ == "__main__":
    main()
