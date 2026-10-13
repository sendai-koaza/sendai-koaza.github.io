"""Build the public place-name list pages from the maintained workbook."""

import json
from pathlib import Path

import openpyxl


SOURCE = Path(r"C:\地名すべて\仙台市小字地図_小字一覧.xlsx")
ROOT = Path(__file__).resolve().parents[1]

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

PAGES = [
    {"sheet": "仙台城下", "directory": ROOT / "koaza-list", "map_base": "../", "oaza": "仙台", "page_links": {"仙台城下": "#list-title", "南小泉村": "./minamikoizumi/"}},
    {"sheet": "南小泉", "directory": ROOT / "koaza-list" / "minamikoizumi", "map_base": "../../", "oaza": "南小泉", "page_links": {"仙台城下": "../", "南小泉村": "#list-title"}},
]


def value(cell):
    return "" if cell.value is None else str(cell.value).strip()


def find_header(sheet, headers):
    for row in sheet.iter_rows():
        for cell in row:
            if value(cell) != headers[0]:
                continue
            if all(value(sheet.cell(cell.row, cell.column + index)) == name for index, name in enumerate(headers)):
                return cell.row, cell.column
    return None


def find_sparse_header(sheet, headers):
    for row_number in range(1, sheet.max_row + 1):
        columns = {}
        for column_number in range(1, sheet.max_column + 1):
            cell_value = value(sheet.cell(row_number, column_number))
            if cell_value in headers:
                columns[cell_value] = column_number
        if len(columns) == len(headers):
            return row_number, columns
    return None


def table_rows(sheet, header_row, start_column, headers, end_row=None):
    rows = []
    for row_number in range(header_row + 1, (end_row or sheet.max_row) + 1):
        values = [value(sheet.cell(row_number, start_column + index)) for index in range(len(headers))]
        if any(values):
            rows.append(dict(zip(headers, values)))
    return rows


def sparse_table_rows(sheet, header_row, columns, headers, required_header=None):
    rows = []
    for row_number in range(header_row + 1, sheet.max_row + 1):
        row = {header: value(sheet.cell(row_number, columns[header])) for header in headers}
        if any(row.values()) and (not required_header or row[required_header]):
            rows.append(row)
    return rows


def navigation(sheet):
    groups = []
    for row_number in range(3, 9):
        ward = value(sheet.cell(row_number, 1))
        places = [item.strip() for item in value(sheet.cell(row_number, 2)).split("、") if item.strip()]
        if places:
            groups.append({"ward": ward, "places": places})
    return groups


def build_page(sheet, config):
    main_headers = ["地名", "読み", "由来", "備考"]
    reference_headers = ["番号", "資料名", "リンク"]
    main_header = find_header(sheet, main_headers)
    if not main_header:
        raise ValueError(f"Main list header not found in {sheet.title}")
    main_header_row, main_start_column = main_header

    extra_headers = ["地名", "読み", "場所", "由来", "備考"]
    extra_header = find_header(sheet, extra_headers)
    reference_header = find_sparse_header(sheet, reference_headers)
    main_end_row = reference_header[0] - 1 if reference_header and reference_header[0] > main_header_row else None
    title = value(sheet.cell(main_header_row - 3, main_start_column)) or sheet.title

    data = {
        "title": title,
        "navigation": navigation(sheet),
        "notes": [value(sheet.cell(row_number, 2)) for row_number in range(10, 15) if value(sheet.cell(row_number, 2))],
        "main": table_rows(sheet, main_header_row, main_start_column, main_headers, main_end_row),
        "extra": table_rows(sheet, *extra_header, extra_headers) if extra_header else [],
        "references": sparse_table_rows(sheet, reference_header[0], reference_header[1], reference_headers, "資料名") if reference_header else [],
        "mapAliases": MAP_ALIASES if config["oaza"] == "仙台" else {},
        "mapBase": config["map_base"],
        "oaza": config["oaza"],
        "pageLinks": config["page_links"],
        "currentPlace": config["oaza"] + ("城下" if config["oaza"] == "仙台" else "村"),
    }
    config["directory"].mkdir(parents=True, exist_ok=True)
    output = config["directory"] / "data.js"
    output.write_text("window.KOAZA_LIST_DATA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    return data


def main():
    workbook = openpyxl.load_workbook(SOURCE, data_only=True)
    built = {}
    for config in PAGES:
        data = build_page(workbook[config["sheet"]], config)
        built[config["oaza"]] = {
            "path": "./koaza-list/" + ("" if config["oaza"] == "仙台" else "minamikoizumi/"),
            "items": {item["地名"]: index for index, item in enumerate(data["main"])},
            "mapAliases": data["mapAliases"],
        }
        print(f"Updated {config['directory'] / 'data.js'}: {len(data['main'])} main rows.")
    (ROOT / "koaza-list" / "pages.js").write_text(
        "window.KOAZA_LIST_PAGE_INDEX = " + json.dumps(built, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
