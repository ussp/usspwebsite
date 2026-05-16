"""Convert a markdown training doc to a standalone HTML file with inline CSS for emailing as attachment."""
import sys
from pathlib import Path
import markdown


CSS = """
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.55;
    color: #1c1c1c;
    max-width: 920px;
    margin: 32px auto;
    padding: 0 24px;
    background: #ffffff;
}
h1 { font-size: 28px; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-top: 0; }
h2 { font-size: 22px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-top: 32px; }
h3 { font-size: 18px; margin-top: 24px; }
h4 { font-size: 16px; margin-top: 20px; }
a { color: #2563eb; text-decoration: none; }
a:hover { text-decoration: underline; }
blockquote {
    border-left: 4px solid #2563eb;
    background: #f3f4f6;
    margin: 16px 0;
    padding: 12px 16px;
    color: #374151;
}
code {
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.9em;
}
pre {
    background: #1c1c1c;
    color: #f9fafb;
    padding: 16px;
    border-radius: 6px;
    overflow-x: auto;
}
pre code { background: transparent; padding: 0; color: inherit; }
table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
    font-size: 14px;
}
th, td {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    text-align: left;
    vertical-align: top;
}
th { background: #f3f4f6; font-weight: 600; }
tr:nth-child(even) td { background: #fafafa; }
ul, ol { padding-left: 24px; }
li { margin: 4px 0; }
hr { border: none; border-top: 1px solid #e5e7eb; margin: 32px 0; }
.footer { color: #6b7280; font-size: 12px; margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
"""


def convert(md_path: Path, html_path: Path):
    md_text = md_path.read_text(encoding="utf-8")
    html_body = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "toc", "sane_lists", "attr_list"],
        output_format="html5",
    )
    title = md_path.stem.replace("-", " ").title()
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>{CSS}</style>
</head>
<body>
{html_body}
<div class="footer">DCFS AI Pilot &mdash; Krasan Consulting Services</div>
</body>
</html>
"""
    html_path.write_text(html, encoding="utf-8")
    print(f"Wrote {html_path}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        src = Path(sys.argv[1])
    else:
        src = Path(__file__).parent / "training-playlist-by-role-v20260514.md"
    if len(sys.argv) > 2:
        # second arg = output directory; preserve source stem with .html suffix
        out_dir = Path(sys.argv[2])
        out_dir.mkdir(parents=True, exist_ok=True)
        dst = out_dir / (src.stem + ".html")
    else:
        dst = src.with_suffix(".html")
    convert(src, dst)
