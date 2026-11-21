"""《把 Astro 博客部署到 GitHub Pages》的原稿，坐标基于 280 × 108 画布。"""


def draw(pen):
    nose = (197, 22)
    fold = (127, 63)
    tail = (117, 85)
    underside = [fold, nose, tail]

    pen.face([(77, 51), nose, fold], (145, 139, 105, 51), width=0.95)
    pen.face(underside, (108, 113, 97, 84), width=0.9)
    pen.hatch(underside, spacing=2.35, color=(93, 99, 84, 110))
    pen.face([fold, nose, (154, 85)], (163, 119, 82, 82), width=0.95)
    pen.face([tail, (135, 69), fold], (128, 124, 99, 115), pen.fine, 0.7)

    pen.line([(80, 51), (154, 36)], pen.faint, 0.55)
    pen.line([(90, 79), (110, 71)], pen.faint, 0.7)
    pen.line([(83, 86), (102, 78)], pen.faint, 0.55)
