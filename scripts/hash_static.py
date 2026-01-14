import hashlib, json
from pathlib import Path
import shutil

STATIC_DIR = Path("app/static")
OUT_DIR = Path("app/static_hashed")
MANIFEST = {}

def hash_file(p: Path) -> str:
    h = hashlib.sha256(p.read_bytes()).hexdigest()[:8]
    return h

if OUT_DIR.exists():
    shutil.rmtree(OUT_DIR)
OUT_DIR.mkdir(parents=True)

for p in STATIC_DIR.rglob("*"):
    if p.is_dir():
        continue
    rel = p.relative_to(STATIC_DIR)
    digest = hash_file(p)

    # insert hash before suffix: site.css -> site.<hash>.css
    hashed_name = f"{p.stem}.{digest}{p.suffix}"
    out_path = OUT_DIR / rel.parent / hashed_name
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(p.read_bytes())

    MANIFEST[str(rel).replace("\\", "/")] = str((rel.parent / hashed_name)).replace("\\", "/")

(Path("app") / "static_manifest.json").write_text(json.dumps(MANIFEST, indent=2))
print("Wrote manifest with", len(MANIFEST), "files")
