#!/usr/bin/env python3
"""Superseded local proof generator, retained only as an audit trail."""

from __future__ import annotations

raise SystemExit(
    "Superseded: use the editable Figma frames and export PDF only after route approval. "
    "This script used an incorrect 3mm TrimBox and must not create delivery artwork."
)

from pathlib import Path
import subprocess

from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[3]
PACKAGE = Path(__file__).resolve().parent
PROOFS = PACKAGE / "proofs"
OUTPUT = ROOT / "output" / "pdf"
TMP = ROOT / "tmp" / "pdfs" / "creepers-nonflower" / "build"

WIDTH = 4400
HEIGHT = 5900
PAGE_MM = (220, 295)
TRIM_INSET_MM = 3

BRAND = Path("/Users/harrison/Downloads/Client Editing Packs/Creepers/01 Brand Kit")
LOGO = BRAND / "Creepers_Stacked_White_S_C.png"
PLAYFAIR = BRAND / "Fonts (Playfair Display)" / "PlayfairDisplay-VariableFont_wght.ttf"
PLAYFAIR_ITALIC = BRAND / "Fonts (Playfair Display)" / "PlayfairDisplay-Italic-VariableFont_wght.ttf"
SANS = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
SANS_BOLD = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")
PLANT_HEALTHY = Path(
    "/Users/harrison/Library/Mobile Documents/com~apple~CloudDocs/Documents/Images/"
    "Plant-Healthy-Logos-RGB-Horizontal.png"
)

OPTIONS = [
    {
        "letter": "A",
        "slug": "specimen-rootball",
        "label": "SPECIMEN ROOTBALL - RECOMMENDED",
        "source": Path("/Volumes/UGREEN/DSC_1674.jpg"),
        "crop_y": 0.43,
        "brightness": 0.91,
        "contrast": 1.06,
        "colour": 0.91,
    },
    {
        "letter": "B",
        "slug": "standard-tree-lines",
        "label": "STANDARD TREE LINES",
        "source": TMP / "source-DSC_1601.jpg",
        "raw_source": Path("/Volumes/UGREEN/Creepers Surry Photos Jun/DSC_1601.NEF"),
        "crop_y": 0.48,
        "brightness": 0.88,
        "contrast": 1.05,
        "colour": 0.88,
    },
    {
        "letter": "C",
        "slug": "nursery-dispatch",
        "label": "NURSERY DISPATCH",
        "source": TMP / "source-DSC_1573.jpg",
        "raw_source": Path("/Volumes/UGREEN/Creepers Surry Photos Jun/DSC_1573.NEF"),
        "crop_y": 0.47,
        "brightness": 0.86,
        "contrast": 1.07,
        "colour": 0.90,
    },
]


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def tracked_width(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, tracking: int) -> float:
    widths = [draw.textlength(char, font=fnt) for char in text]
    return sum(widths) + max(0, len(text) - 1) * tracking


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    xy: tuple[float, float],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    tracking: int,
    fill: tuple[int, int, int, int],
) -> None:
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=fnt, fill=fill)
        x += draw.textlength(char, font=fnt) + tracking


def draw_tracked_centred(
    draw: ImageDraw.ImageDraw,
    y: float,
    text: str,
    fnt: ImageFont.FreeTypeFont,
    tracking: int,
    fill: tuple[int, int, int, int],
) -> None:
    x = (WIDTH - tracked_width(draw, text, fnt, tracking)) / 2
    draw_tracked(draw, (x, y), text, fnt, tracking, fill)


def cover_crop(source: Image.Image, crop_y: float) -> Image.Image:
    source = ImageOps.exif_transpose(source).convert("RGB")
    scale = max(WIDTH / source.width, HEIGHT / source.height)
    resized = source.resize(
        (round(source.width * scale), round(source.height * scale)),
        Image.Resampling.LANCZOS,
    )
    max_x = max(0, resized.width - WIDTH)
    max_y = max(0, resized.height - HEIGHT)
    left = max_x / 2
    top = max_y * crop_y
    return resized.crop((round(left), round(top), round(left + WIDTH), round(top + HEIGHT)))


def vertical_gradient(height: int, top_alpha: int, bottom_alpha: int) -> Image.Image:
    line = Image.new("L", (1, height))
    line.putdata(
        [round(top_alpha + (bottom_alpha - top_alpha) * i / max(1, height - 1)) for i in range(height)]
    )
    alpha = line.resize((WIDTH, height))
    overlay = Image.new("RGBA", (WIDTH, height), (0, 0, 0, 0))
    overlay.putalpha(alpha)
    return overlay


def paste_contain(base: Image.Image, asset_path: Path, box: tuple[int, int, int, int]) -> None:
    asset = Image.open(asset_path).convert("RGBA")
    max_width = box[2] - box[0]
    max_height = box[3] - box[1]
    asset.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    x = box[0] + (max_width - asset.width) // 2
    y = box[1] + (max_height - asset.height) // 2
    base.alpha_composite(asset, (x, y))


def paste_primary_logo(base: Image.Image) -> None:
    asset = Image.open(LOGO).convert("RGBA")
    asset = asset.crop((0, 0, asset.width, 650))
    max_width = 2600
    max_height = 1120
    asset.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    x = (WIDTH - asset.width) // 2
    y = 135 + (max_height - asset.height) // 2
    base.alpha_composite(asset, (x, y))


def paste_plant_healthy(base: Image.Image) -> None:
    asset = Image.open(PLANT_HEALTHY).convert("RGBA")
    pixels = asset.load()
    for y in range(asset.height):
        for x in range(asset.width):
            red, green, blue, alpha = pixels[x, y]
            if not alpha:
                continue
            if x < 360:
                pixels[x, y] = (0, 184, 148, alpha)
            else:
                pixels[x, y] = (255, 255, 255, alpha)
    asset.thumbnail((695, 265), Image.Resampling.LANCZOS)
    base.alpha_composite(asset, (3480, 5500))


def resolve_source(option: dict) -> Path:
    source = option["source"]
    if source.exists():
        return source
    raw_source = option.get("raw_source")
    if not raw_source or not raw_source.exists():
        raise FileNotFoundError(f"Missing source for option {option['letter']}: {raw_source or source}")
    source.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["sips", "-s", "format", "jpeg", str(raw_source), "--out", str(source)],
        check=True,
        capture_output=True,
        text=True,
    )
    return source


def build_composite(option: dict) -> Path:
    source = Image.open(resolve_source(option))
    icc_profile = source.info.get("icc_profile")
    image = cover_crop(source, option["crop_y"])
    image = ImageEnhance.Brightness(image).enhance(option["brightness"])
    image = ImageEnhance.Contrast(image).enhance(option["contrast"])
    image = ImageEnhance.Color(image).enhance(option["colour"])
    base = image.convert("RGBA")

    base.alpha_composite(vertical_gradient(1680, 180, 0), (0, 0))
    base.alpha_composite(vertical_gradient(2180, 0, 226), (0, HEIGHT - 2180))

    paste_primary_logo(base)
    paste_plant_healthy(base)

    draw = ImageDraw.Draw(base)
    white = (255, 255, 255, 255)
    soft_white = (246, 246, 239, 255)

    draw_tracked_centred(
        draw,
        1290,
        "FAMILY OWNED  |  EXPERTLY SOURCED PLANTS",
        font(SANS, 50),
        5,
        white,
    )

    headline = "38 Years in the Ground."
    headline_font = font(PLAYFAIR, 238)
    headline_width = draw.textlength(headline, font=headline_font)
    draw.text(((WIDTH - headline_width) / 2, 4380), headline, font=headline_font, fill=soft_white)

    subhead = "And we're just getting started."
    subhead_font = font(PLAYFAIR_ITALIC, 100)
    subhead_width = draw.textlength(subhead, font=subhead_font)
    draw.text(((WIDTH - subhead_width) / 2, 4680), subhead, font=subhead_font, fill=soft_white)

    draw_tracked(
        draw,
        (245, 5268),
        "TRADE SUPPLY  |  CONTRACT GROWING  |  UK & EUROPEAN SOURCING",
        font(SANS_BOLD, 34),
        2,
        white,
    )
    draw.line((245, 5415, 4155, 5415), fill=(255, 255, 255, 95), width=3)

    draw_tracked(
        draw,
        (245, 5520),
        "SURREY  |  LONDON  |  NEW FOREST  |  01932 821 626",
        font(SANS_BOLD, 40),
        2,
        white,
    )
    draw_tracked(
        draw,
        (245, 5650),
        "CREEPERSNURSERY.CO.UK",
        font(SANS_BOLD, 34),
        2,
        white,
    )

    composite = base.convert("RGB")
    path = TMP / f"{option['letter']}-{option['slug']}-4400x5900.jpg"
    save_args = {"quality": 96, "subsampling": 0, "dpi": (508, 508), "optimize": True}
    if icc_profile:
        save_args["icc_profile"] = icc_profile
    composite.save(path, **save_args)
    return path


def build_pdf(option: dict, composite: Path) -> Path:
    final = OUTPUT / (
        f"creepers-prolandscaper-2026-08-11-{option['letter']}-{option['slug']}-RGB-REVIEW.pdf"
    )
    temp = TMP / f"{option['letter']}-{option['slug']}-temp.pdf"
    width_pt = PAGE_MM[0] * mm
    height_pt = PAGE_MM[1] * mm

    pdf = canvas.Canvas(str(temp), pagesize=(width_pt, height_pt), pageCompression=1)
    pdf.setTitle(f"Creepers Pro Landscaper advert, option {option['letter']}, RGB review proof")
    pdf.setSubject("220 x 295mm full bleed; TrimBox inset 3mm; RGB review proof")
    pdf.setAuthor("HWL Studio")
    pdf.setCreator("HWL Studio")
    pdf.drawImage(str(composite), 0, 0, width=width_pt, height=height_pt, mask="auto")
    pdf.showPage()
    pdf.save()

    reader = PdfReader(str(temp))
    page = reader.pages[0]
    page.mediabox = RectangleObject([0, 0, width_pt, height_pt])
    page.cropbox = RectangleObject([0, 0, width_pt, height_pt])
    page.bleedbox = RectangleObject([0, 0, width_pt, height_pt])
    inset = TRIM_INSET_MM * mm
    page.trimbox = RectangleObject([inset, inset, width_pt - inset, height_pt - inset])
    page.artbox = RectangleObject([0, 0, width_pt, height_pt])

    writer = PdfWriter()
    writer.add_page(page)
    writer.add_metadata(reader.metadata or {})
    with final.open("wb") as handle:
        writer.write(handle)
    return final


def build_contact_sheet(composites: list[tuple[dict, Path]]) -> Path:
    card_width = 880
    preview_height = 1180
    gap = 34
    label_height = 120
    sheet = Image.new(
        "RGB",
        (gap + len(composites) * (card_width + gap), preview_height + label_height + gap * 2),
        "#101510",
    )
    draw = ImageDraw.Draw(sheet)
    label_font = font(SANS_BOLD, 30)

    for index, (option, composite_path) in enumerate(composites):
        image = Image.open(composite_path).convert("RGB")
        image.thumbnail((card_width, preview_height), Image.Resampling.LANCZOS)
        x = gap + index * (card_width + gap)
        sheet.paste(image, (x, gap))
        label = f"{option['letter']}  |  {option['label']}"
        draw.text((x, gap + preview_height + 30), label, font=label_font, fill="white")

    path = PROOFS / "contact-sheet-non-flower.png"
    sheet.save(path, optimize=True)
    return path


def main() -> None:
    raise SystemExit(
        "Superseded: use the editable Figma frames and export PDF only after route approval. "
        "This script used an incorrect 3mm TrimBox and must not create delivery artwork."
    )


if __name__ == "__main__":
    main()
