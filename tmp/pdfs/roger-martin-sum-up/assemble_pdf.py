from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


BASE = Path(__file__).resolve().parent
OUTPUT = BASE.parents[2] / "output" / "pdf" / "Roger-Martin-Sum-Up.pdf"
PAGE_IMAGES = [BASE / f"page-{number:02d}.png" for number in range(1, 5)]


def figma_rect_to_pdf(x: float, y: float, width: float, height: float):
    page_width, page_height = A4
    scale_x = page_width / 1240
    scale_y = page_height / 1754
    left = x * scale_x
    right = (x + width) * scale_x
    bottom = page_height - (y + height) * scale_y
    top = page_height - y * scale_y
    return left, bottom, right, top


pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
pdf.setTitle("Roger Martin Sum Up")
pdf.setAuthor("Better@Work")
pdf.setSubject("A practical guide to Roger Martin's strategy conversations")

for page_number, image_path in enumerate(PAGE_IMAGES, start=1):
    pdf.drawImage(str(image_path), 0, 0, width=A4[0], height=A4[1], mask="auto")

    if page_number == 4:
        pdf.linkURL(
            "https://www.youtube.com/watch?v=8aRxvgykFtE",
            figma_rect_to_pdf(80, 1270, 520, 318),
            relative=0,
            thickness=0,
        )
        pdf.linkURL(
            "https://www.youtube.com/watch?v=EcSvHQh_zSk",
            figma_rect_to_pdf(640, 1270, 520, 318),
            relative=0,
            thickness=0,
        )

    pdf.showPage()

pdf.save()
print(OUTPUT)
