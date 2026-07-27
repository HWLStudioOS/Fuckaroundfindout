from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdfs" / "long-strong-wall-plan-2026-07-27.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#17211C")
MOSS = colors.HexColor("#274F3C")
TERRA = colors.HexColor("#B65E3C")
CREAM = colors.HexColor("#F6F1E7")
SAGE = colors.HexColor("#DDE7DE")
MUTED = colors.HexColor("#66736B")
WHITE = colors.white

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="Kicker", fontName="Helvetica-Bold", fontSize=8.5, leading=10,
    textColor=TERRA, spaceAfter=3, tracking=1.1,
))
styles.add(ParagraphStyle(
    name="Hero", fontName="Helvetica-Bold", fontSize=27, leading=29,
    textColor=INK, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="Deck", fontName="Helvetica", fontSize=10.5, leading=14,
    textColor=MUTED, spaceAfter=12,
))
styles.add(ParagraphStyle(
    name="Section", fontName="Helvetica-Bold", fontSize=14, leading=17,
    textColor=MOSS, spaceBefore=7, spaceAfter=6,
))
styles.add(ParagraphStyle(
    name="BodySmall", fontName="Helvetica", fontSize=8.5, leading=11,
    textColor=INK,
))
styles.add(ParagraphStyle(
    name="Body", fontName="Helvetica", fontSize=9.5, leading=13,
    textColor=INK,
))
styles.add(ParagraphStyle(
    name="Tiny", fontName="Helvetica", fontSize=7.2, leading=9,
    textColor=INK,
))
styles.add(ParagraphStyle(
    name="CellHead", fontName="Helvetica-Bold", fontSize=7.5, leading=9,
    textColor=WHITE, alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name="Cell", fontName="Helvetica", fontSize=6.9, leading=8.5,
    textColor=INK, alignment=TA_LEFT,
))
styles.add(ParagraphStyle(
    name="Callout", fontName="Helvetica-Bold", fontSize=9.2, leading=12,
    textColor=INK,
))


def P(text, style="Body"):
    return Paragraph(text, styles[style])


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D8D4CA"))
    canvas.line(16 * mm, 13 * mm, 194 * mm, 13 * mm)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(16 * mm, 8.5 * mm, "LONG + STRONG  |  27 JULY TO 20 SEPTEMBER 2026")
    canvas.drawRightString(194 * mm, 8.5 * mm, f"{doc.page}")
    canvas.restoreState()


def weekly_rhythm():
    data = [
        [P("MON", "CellHead"), P("TUE", "CellHead"), P("WED", "CellHead"), P("THU", "CellHead"), P("FRI", "CellHead"), P("SAT", "CellHead"), P("SUN", "CellHead")],
        [P("Easy run<br/>+ strides", "Cell"), P("VO2<br/>quality", "Cell"), P("Strength A<br/>squat + bench", "Cell"), P("Easy run", "Cell"), P("Strength B<br/>deadlift + full body", "Cell"), P("Rest<br/>walk or mobility", "Cell"), P("Long easy run", "Cell")],
    ]
    table = Table(data, colWidths=[25.3 * mm] * 7, rowHeights=[8 * mm, 18 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), MOSS),
        ("BACKGROUND", (0, 1), (-1, 1), SAGE),
        ("GRID", (0, 0), (-1, -1), 0.45, WHITE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3),
    ]))
    return table


def run_table():
    rows = [
        ["WEEK", "MONDAY", "TUESDAY QUALITY", "THURSDAY", "SUNDAY LONG", "TOTAL"],
        ["1", "5 km easy + 4 strides", "6 x 2 min / 2 min jog\n7 km", "4 km easy", "8 km easy", "24 km"],
        ["2", "6 km easy + 6 strides", "5 x 3 min / 2 min jog\n7 km", "5 km easy", "10 km easy", "28 km"],
        ["3", "6 km easy + 6 strides", "4 x 4 min / 3 min jog\n8 km", "5 km easy", "12 km easy", "31 km"],
        ["4", "5 km easy + 4 strides", "8 x 1 min / 1 min jog\n6 km", "4 km easy", "9 km easy", "24 km"],
        ["5", "6 km easy + 6 strides", "5 x 4 min / 2:30 jog\n8 km", "5 km easy", "13 km easy", "32 km"],
        ["6", "7 km easy + 6 strides", "6 x 3 min uphill\n9 km", "5 km easy", "14 km easy", "35 km"],
        ["7", "7 km easy + 8 strides", "3 x 8 x 30 sec hard / 30 float\n9 km", "6 km easy", "16 km easy", "38 km"],
        ["8", "5 km easy + 4 strides", "5 km controlled time trial\n8 km", "4 km easy", "11 km easy", "28 km"],
    ]
    formatted = []
    for ri, row in enumerate(rows):
        formatted.append([P(cell.replace("\n", "<br/>"), "CellHead" if ri == 0 else "Cell") for cell in row])
    table = Table(formatted, colWidths=[10 * mm, 33 * mm, 53 * mm, 27 * mm, 31 * mm, 20 * mm], repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), INK),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D4D7D2")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, CREAM]),
        ("ALIGN", (0, 1), (0, -1), "CENTER"),
        ("ALIGN", (-1, 1), (-1, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    for row in (4, 8):
        style.append(("BACKGROUND", (0, row), (-1, row), SAGE))
    table.setStyle(TableStyle(style))
    return table


def strength_table(title, rows):
    data = [[P(title.upper(), "CellHead"), P("WORK", "CellHead")]]
    data += [[P(a, "BodySmall"), P(b, "BodySmall")] for a, b in rows]
    table = Table(data, colWidths=[60 * mm, 27 * mm], repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), MOSS),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, CREAM]),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D4D7D2")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
    ]))
    return table


doc = SimpleDocTemplate(
    str(OUT), pagesize=A4, rightMargin=16 * mm, leftMargin=16 * mm,
    topMargin=15 * mm, bottomMargin=18 * mm,
    title="Long + Strong Wall Plan", author="Harrison Living",
)

story = [
    P("EIGHT-WEEK HYBRID BLOCK", "Kicker"),
    P("Long + Strong", "Hero"),
    P("Improve VO2 max. Rebuild the long run. Drop weight gradually. Restore dependable strength.", "Deck"),
    weekly_rhythm(),
    Spacer(1, 7 * mm),
    P("The run build", "Section"),
    run_table(),
    Spacer(1, 5 * mm),
    Table([
        [P("EASY", "Kicker"), P("QUALITY", "Kicker"), P("NON-NEGOTIABLE", "Kicker")],
        [P("Conversational, RPE 2 to 3. Strides are quick and relaxed.", "BodySmall"),
         P("RPE 8, hard and repeatable. Warm up 12 to 15 minutes. Never sprint.", "BodySmall"),
         P("No doubles. Saturday stays easy. Do not cram missed work into the next three days.", "BodySmall")],
    ], colWidths=[59 * mm] * 3, style=TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CREAM),
        ("BOX", (0, 0), (-1, -1), 0.7, TERRA),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D8D4CA")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ])),
    PageBreak(),
    P("STRENGTH, FUEL AND RAILS", "Kicker"),
    P("Keep the engine honest", "Hero"),
    P("Two full-body sessions. Low enough volume to recover, heavy enough to retain muscle and rebuild the lifts.", "Deck"),
]

a_rows = [
    ("Back squat", "3 x 4 to 6, 2 RIR"),
    ("Bench press", "3 x 4 to 6, 2 RIR"),
    ("Romanian deadlift", "2 x 6 to 8, 2 RIR"),
    ("Chest-supported row", "3 x 8 to 10"),
    ("Standing calf raise", "3 x 8 to 12"),
    ("Ab wheel or cable crunch", "2 x 8 to 12"),
]
b_rows = [
    ("Conventional or trap-bar deadlift", "2 x 3 to 5, 2 RIR"),
    ("Front-foot-elevated split squat", "2 x 6 to 8 each"),
    ("Incline press", "3 x 6 to 10"),
    ("Pulldown or weighted chin-up", "3 x 6 to 10"),
    ("Seated soleus raise", "3 x 10 to 15"),
    ("Lateral raise", "3 x 12 to 20"),
    ("Heavy farmer carry", "3 x 30 to 40 m"),
]

story += [
    Table([[strength_table("Wednesday, Strength A", a_rows), strength_table("Friday, Strength B", b_rows)]],
          colWidths=[87 * mm, 87 * mm], style=TableStyle([
              ("VALIGN", (0, 0), (-1, -1), "TOP"),
              ("LEFTPADDING", (0, 0), (-1, -1), 0),
              ("RIGHTPADDING", (0, 0), (-1, -1), 0),
          ])),
    Spacer(1, 5 * mm),
    P("Progression", "Section"),
    P("Week 1 sets honest working loads. Add 2.5 kg upper or 5 kg lower only when every rep is clean with two left. Week 4 removes one set everywhere. Week 8 removes one squat and deadlift set. No 1RM test.", "Body"),
    Spacer(1, 3 * mm),
    P("Weight loss without flattening training", "Section"),
]

nutrition = [
    [P("1", "Callout"), P("Seven morning weigh-ins. Judge the weekly average only.", "BodySmall")],
    [P("2", "Callout"), P("Lose 0.25 to 0.5% of body weight each week. Start with a 300 to 400 kcal daily average deficit.", "BodySmall")],
    [P("3", "Callout"), P("Protein: 1.8 to 2.0 g per kg per day, spread across three to five meals.", "BodySmall")],
    [P("4", "Callout"), P("Take 30 to 60 g carbohydrate before Tuesday and Sunday. Use 30 to 60 g per hour beyond 75 minutes.", "BodySmall")],
]
nutrition_table = Table(nutrition, colWidths=[10 * mm, 164 * mm])
nutrition_table.setStyle(TableStyle([
    ("ROWBACKGROUNDS", (0, 0), (-1, -1), [CREAM, WHITE]),
    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D8D4CA")),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ALIGN", (0, 0), (0, -1), "CENTER"),
    ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))

story += [
    nutrition_table,
    Spacer(1, 4 * mm),
    P("Knee and readiness rails", "Section"),
    Table([
        [P("GREEN", "CellHead"), P("AMBER", "CellHead"), P("RED", "CellHead")],
        [P("Normal gait. Knee 0 to 1/10. No swelling. Run the plan.", "BodySmall"),
         P("Pain builds, changes mechanics or stays up next morning. Remove the next quality session.", "BodySmall"),
         P("Swelling, locking, giving way, sharp focal pain or altered gait. Stop and get assessed.", "BodySmall")],
    ], colWidths=[58 * mm] * 3, style=TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), MOSS),
        ("BACKGROUND", (1, 0), (1, 0), colors.HexColor("#9B6A24")),
        ("BACKGROUND", (2, 0), (2, 0), TERRA),
        ("GRID", (0, 0), (-1, -1), 0.35, WHITE),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [SAGE]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ])),
    Spacer(1, 4 * mm),
    Table([[Paragraph(
        "<b><font size='13' color='#274F3C'>Eight-week win</font></b><br/>"
        "Six solid weeks out of eight. Long run at 16 km with a quiet knee. "
        "Body-weight average down 2 to 4% if recovery supports it. Working weights "
        "trending up with two reps still in reserve.",
        styles["Body"],
    )]], colWidths=[174 * mm], style=TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CREAM),
        ("BOX", (0, 0), (-1, -1), 0.7, TERRA),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ])),
]

doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)
