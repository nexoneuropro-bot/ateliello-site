from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
pages=list(root.glob('*.html'))
missing=set()
for page in pages:
    text=page.read_text(encoding='utf-8')
    for target in re.findall(r'(?:src|href)=[\"\'](assets/[^\"\']+|style\.css|app\.js)[\"\']',text):
        if not (root/target).is_file():missing.add((page.name,target))
    for target in re.findall(r'url\([\"\']?(assets/[^)\"\']+)', (root/'style.css').read_text(encoding='utf-8')):
        if not (root/target).is_file():missing.add(('style.css',target))
if missing:
    print('Arquivos ausentes:')
    for page,target in sorted(missing):print(page,'->',target)
    raise SystemExit(1)
print('Páginas:',len(pages),'— todos os recursos locais referenciados existem.')
