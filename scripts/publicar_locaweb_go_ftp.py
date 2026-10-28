"""Publicar apenas arquivos estáticos da Ateliello na Locaweb Go via FTP."""
from ftplib import FTP, all_errors
from pathlib import Path
import os
import posixpath
import time

HOST="ftp.ateliello1.hospedagemdesites.ws"
USER="ateliello1"
PASSWORD=os.environ.get("LOCAWEB_FTPS_PASSWORD","")
MODE=os.environ.get("DEPLOY_MODE","previa")
ROOT=Path("dist-locaweb")

if not PASSWORD:
    raise SystemExit("Segredo LOCAWEB_FTPS_PASSWORD não disponível.")
if MODE not in {"previa","producao"}:
    raise SystemExit("DEPLOY_MODE inválido")
for needed in ("index.html","app.js","style.css","robots.txt"):
    if not (ROOT/needed).is_file():
        raise SystemExit("Arquivo ausente: "+needed)
if MODE=="producao" and not (ROOT/"sitemap.xml").exists():
    raise SystemExit("Sitemap ausente em produção.")

files=[p for p in ROOT.rglob("*") if p.is_file()]
order={"robots.txt":0} if MODE=="previa" else {".htaccess":8,"sitemap.xml":9,"robots.txt":10}
files.sort(key=lambda p:(order.get(p.relative_to(ROOT).as_posix(),1),p.as_posix()))
print("Transferência por FTP convencional (não criptografado), modo",MODE,flush=True)
print("A senha permanece no GitHub Secret, mas a hospedagem FTP transmite credenciais em texto claro.")
ftp=FTP(timeout=25)
try:
    ftp.connect(HOST,21)
    ftp.login(USER,PASSWORD)
    ftp.set_pasv(True)
    print("Autenticação FTP aceita.",flush=True)
    try:
        ftp.cwd("public_html")
    except all_errors:
        ftp.cwd("/home/ateliello1/public_html")
    print("Diretório remoto:",ftp.pwd(),flush=True)
    folders=set()
    total=0
    for f in files:
        remote=f.relative_to(ROOT).as_posix()
        parent=posixpath.dirname(remote)
        if parent and parent not in folders:
            parts=parent.split("/")
            for i in range(1,len(parts)+1):
                folder="/".join(parts[:i])
                if folder in folders:
                    continue
                try: ftp.mkd(folder)
                except all_errors: pass
                folders.add(folder)
        with f.open("rb") as handle:
            ftp.storbinary("STOR "+remote,handle,blocksize=65536)
        try:
            remote_size=ftp.size(remote)
            if remote_size is not None and remote_size!=f.stat().st_size:
                raise RuntimeError("Tamanho não confere: "+remote)
        except all_errors:
            # FTP SIZE não é suportado em alguns servidores.
            pass
        total+=1
        if total%15==0:
            print("Arquivos enviados:",total,flush=True)
    print(f"TRANSFERENCIA_CONCLUIDA={total}, MODE={MODE}",flush=True)
finally:
    try: ftp.quit()
    except all_errors: ftp.close()
