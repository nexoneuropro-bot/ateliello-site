"""Publicação protegida da Ateliello via SFTP/SSH com chave de servidor fixada."""
from pathlib import Path
import base64
import os
import posixpath
import stat
import sys

try:
    import paramiko
except ImportError as error:
    raise SystemExit("Biblioteca SFTP não instalada: pip install paramiko==3.5.1") from error

HOST = "ftp.ateliello1.hospedagemdesites.ws"
USER = "ateliello1"
ROOT = Path("dist-locaweb")
SSH_KEY_B64 = "AAAAC3NzaC1lZDI1NTE5AAAAIHWbQb1JkhHNo3Nf7Z31yXB179qoaLyDEXax336GTgkT"
MODE = os.environ.get("DEPLOY_MODE", "previa")
PASSWORD = os.environ.get("LOCAWEB_FTPS_PASSWORD", "")

if MODE not in {"previa", "producao"}:
    raise SystemExit("Modo inválido.")
if not PASSWORD:
    raise SystemExit("O segredo LOCAWEB_FTPS_PASSWORD não foi cadastrado no GitHub.")
if not ROOT.joinpath("index.html").is_file() or not ROOT.joinpath("robots.txt").is_file():
    raise SystemExit("Pacote incompleto.")
if MODE == "producao" and not ROOT.joinpath("sitemap.xml").is_file():
    raise SystemExit("Sitemap ausente na produção.")

client = paramiko.SSHClient()
serverkey = paramiko.Ed25519Key(data=base64.b64decode(SSH_KEY_B64))
client.get_host_keys().add(HOST, "ssh-ed25519", serverkey)
client.set_missing_host_key_policy(paramiko.RejectPolicy())

try:
    client.connect(
        hostname=HOST, port=22, username=USER, password=PASSWORD,
        look_for_keys=False, allow_agent=False, timeout=12,
        banner_timeout=15, auth_timeout=12,
    )
    sftp = client.open_sftp()
    try:
        sftp.chdir("public_html")
    except (IOError, OSError):
        try:
            sftp.chdir("/home/ateliello1/public_html")
        except (IOError, OSError) as exc:
            raise SystemExit("A pasta public_html não foi encontrada. Verifique o diretório no painel Locaweb.") from exc

    print("Conexão SFTP segura com chave de servidor verificada. Destino:", sftp.normalize("."))

    def ensure_directory(path):
        current = ""
        for part in path.split("/"):
            if not part:
                continue
            current = posixpath.join(current, part)
            try:
                info = sftp.stat(current)
                if not stat.S_ISDIR(info.st_mode):
                    raise RuntimeError("O destino não é pasta: " + current)
            except IOError:
                sftp.mkdir(current)

    files = sorted(p for p in ROOT.rglob("*") if p.is_file())
    if MODE == "producao":
        files.sort(key=lambda p: p.relative_to(ROOT).as_posix() in ("robots.txt", "sitemap.xml", ".htaccess"))
    else:
        files.sort(key=lambda p: 0 if p.name == "robots.txt" else 1)
    if MODE == "producao":
        important = {".htaccess": 2, "sitemap.xml": 3, "robots.txt": 4}
        files.sort(key=lambda p: important.get(p.relative_to(ROOT).as_posix(), 1))

    count = 0
    for local in files:
        remote = local.relative_to(ROOT).as_posix()
        parent = posixpath.dirname(remote)
        if parent:
            ensure_directory(parent)
        sftp.put(str(local), remote, confirm=True)
        info = sftp.stat(remote)
        if info.st_size != local.stat().st_size:
            raise RuntimeError("Falha de integridade no arquivo " + remote)
        count += 1
    print(f"Transferência SFTP concluída: {count} arquivos. Modo {MODE}.")
    sftp.close()
finally:
    client.close()
