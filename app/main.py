import json
from pathlib import Path
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# Static files (CSS, JS, images)
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

# Jinja2 template directory
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

manifest_path = Path("app/static_manifest.json")
STATIC_MANIFEST = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}

def static_url(path: str) -> str:
    # path like "css/site.css"
    hashed = STATIC_MANIFEST.get(path, path)
    return f"/static/{hashed}"

templates.env.globals["static_url"] = static_url

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/about", response_class=HTMLResponse)
def about(request: Request):
    return templates.TemplateResponse("about.html", {"request": request})