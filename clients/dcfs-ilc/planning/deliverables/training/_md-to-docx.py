"""Convert a markdown doc to a Word (.docx) file via pandoc."""
import sys
from pathlib import Path
import pypandoc


def convert(md_path: Path, docx_path: Path):
    pypandoc.convert_file(
        str(md_path),
        "docx",
        format="gfm+pipe_tables",
        outputfile=str(docx_path),
        extra_args=["--standalone"],
    )
    print(f"Wrote {docx_path}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Usage: _md-to-docx.py <source.md> [<output-dir>]")
    src = Path(sys.argv[1])
    if len(sys.argv) > 2:
        out_dir = Path(sys.argv[2])
        out_dir.mkdir(parents=True, exist_ok=True)
        dst = out_dir / (src.stem + ".docx")
    else:
        dst = src.with_suffix(".docx")
    convert(src, dst)
