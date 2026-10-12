"""Build the public small-place-name list data from the maintained workbook."""

import json
from pathlib import Path

import openpyxl


SOURCE = Path(r"C:\地名すべて\仙台市小字地図_小字一覧.xlsx")
OUTPUT = Path(__file__).resolve().parents[1] / "koaza-list" / "data.js"

MAP_ALIASES = {
    "河原町東裏町": "河原町東裏丁",
    "米ヶ袋鹿子清水通": "鹿子清水",
    "米ヶ袋中ノ坂通": "中坂通",
    "米ヶ袋鍛冶屋前丁": "鍛冶屋前丁",
    "大町五丁目新丁": "大町五丁目横丁",
    "常盤町": "常盤丁",
    "川内中ノ瀬町": "中ノ瀬町",
    "川内大工町": "大工町",
    "小田原北一番丁通": "小田原北一番丁",
    "小田原北二番丁通": "小田原北二番丁",
    "小田原北三番丁通": "小田原北三番丁",
    "小田原宮町東裏丁": "宮町東裏丁",
}


def value(cell):
    return "" if cell.value is None else str(cell.value).strip()


def table_rows(sheet, header_row, start_column, headers):
    rows = []
    for row_number in range(header_row + 1, sheet.max_row + 1):
        values = [value(sheet.cell(row_number, start_column + index)) for index in range(len(headers))]
        if any(values):
            rows.append(dict(zip(headers, values)))
    return rows


def find_header(sheet, headers):
    for row in sheet.iter_rows():
        for cell in row:
            if value(cell) != headers[0]:
                continue
            if all(value(sheet.cell(cell.row, cell.column + index)) == name for index, name in enumerate(headers)):
                return cell.row, cell.column
    raise ValueError("Header not found: " + ", ".join(headers))


def main():
    workbook = openpyxl.load_workbook(SOURCE, data_only=True)
    sheet = workbook["Sheet1"]
    references_sheet = workbook.worksheets[1]

    main_headers = ["地名", "読み", "由来", "備考"]
    extra_headers = ["地名", "読み", "場所", "由来", "備考"]
    reference_headers = ["番号", "資料名", "リンク"]
    main_header_row, main_start_column = find_header(sheet, main_headers)
    extra_header_row, extra_start_column = find_header(sheet, extra_headers)
    reference_header_row, reference_start_column = find_header(references_sheet, reference_headers)

    navigation = []
    for row_number in range(3, 9):
        ward = value(sheet.cell(row_number, 1))
        places = [place.strip() for place in value(sheet.cell(row_number, 2)).split("、") if place.strip()]
        if places:
            navigation.append({"ward": ward, "places": places})

    data = {
        "title": value(sheet.cell(main_header_row - 3, main_start_column)),
        "navigation": navigation,
        "notes": [value(sheet.cell(row_number, 2)) for row_number in range(10, 15) if value(sheet.cell(row_number, 2))],
        "main": table_rows(sheet, main_header_row, main_start_column, main_headers),
        "extra": table_rows(sheet, extra_header_row, extra_start_column, extra_headers),
        "references": table_rows(references_sheet, reference_header_row, reference_start_column, reference_headers),
        "mapAliases": MAP_ALIASES,
    }
    OUTPUT.write_text("window.KOAZA_LIST_DATA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    print(f"Updated {OUTPUT}: {len(data['main'])} main rows, {len(data['extra'])} extra rows.")


if __name__ == "__main__":
    main()
