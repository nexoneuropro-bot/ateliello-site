"""Checks essenciais para publicar a prévia da Ateliello com segurança."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json
import re

ROOT = Path(__file__).resolve().parent.parent
PAGES = sorted(ROOT.glob("*.html"))
ASSETS = ROOT / "assets"
ERRORS = []

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.h1_count = 0
        self.files = []
        self.scripts = []
        self.titles = 0
        self._jsonld = False
        self._buffer = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "h1":
            self.h1_count += 1
        if tag == "title":
            self.titles += 1
        if "id" in a:
            if a["id"] in self.ids:
                ERRORS.append("ID repetido: " + a["id"])
            self.ids.add(a["id"])
        for field in ("src", "href"):
            if field in a:
                raw = a[field]
                if raw.startswith(("https://", "http://", "//", "mailto:", "tel:", "data:", "javascript:", "#")):
                    continue
                path = urlsplit(raw).path
                if path and not path.startswith("/"):
                    self.files.append(path)
        if tag == "script" and a.get("type") == "application/ld+json":
            self._jsonld = True
            self._buffer = ""

    def handle_data(self, data):
        if self._jsonld:
            self._buffer += data

    def handle_endtag(self, tag):
        if tag == "script" and self._jsonld:
            try:
                json.loads(self._buffer)
            except json.JSONDecodeError as exc:
                ERRORS.append("JSON-LD inválido: " + str(exc))
            self._jsonld = False

for page in PAGES:
    parser = PageParser()
    html = page.read_text(encoding="utf-8")
    parser.feed(html)
    if parser.h1_count != 1:
        ERRORS.append(f"{page.name}: {parser.h1_count} títulos H1 (esperado 1)")
    if parser.titles != 1:
        ERRORS.append(f"{page.name}: {parser.titles} elementos title (esperado 1)")
    for link in parser.files:
        if not (ROOT / link).is_file():
            ERRORS.append(f"{page.name}: recurso ausente {link}")
    if len(html) < 1200:
        ERRORS.append(f"{page.name}: conteúdo muito curto")

if not (ASSETS / "logo-ateliello-com-assinatura.png").exists():
    ERRORS.append("Logo institucional ausente")

if "Disallow: /" not in (ROOT / "robots.txt").read_text():
    ERRORS.append("Prévia deve continuar com indexação bloqueada")

if ERRORS:
    print("Falhas de validação:")
    for error in ERRORS:
        print("  -", error)
    raise SystemExit(1)

print(f"Ateliello: {len(PAGES)} páginas, referências e metadados básicos verificados.")
