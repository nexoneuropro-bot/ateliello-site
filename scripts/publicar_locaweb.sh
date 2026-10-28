#!/usr/bin/env bash
# Publicação manual Locaweb por FTPS; credenciais apenas via secrets protegidos.
set -euo pipefail
test -n "$LOCAWEB_FTPS_HOST"
test -n "$LOCAWEB_FTPS_USER"
test -n "$LOCAWEB_FTPS_PASSWORD"
test -n "$LOCAWEB_FTPS_REMOTE_DIR"
test -f dist-locaweb/index.html
test -f dist-locaweb/robots.txt
test -f dist-locaweb/sitemap.xml
test -f dist-locaweb/.htaccess
if [[ ! "$LOCAWEB_FTPS_HOST" =~ ^[a-zA-Z0-9.-]+$ ]]; then echo "Servidor FTPS inválido"; exit 2; fi
if [[ "$LOCAWEB_FTPS_REMOTE_DIR" == *".."* || "$LOCAWEB_FTPS_REMOTE_DIR" != *"public_html"* ]]; then echo "Diretório de publicação inesperado"; exit 2; fi
command -v lftp >/dev/null
export TMP_FTPS_SCRIPT="$(mktemp)"
chmod 600 "$TMP_FTPS_SCRIPT"
trap 'rm -f "$TMP_FTPS_SCRIPT"' EXIT
printf 'set cmd:fail-exit yes\nset net:max-retries 2\nset net:timeout 25\nset ftp:ssl-force yes\nset ftp:ssl-protect-data yes\nset ssl:verify-certificate yes\n' > "$TMP_FTPS_SCRIPT"
# Escape caracteres que afetam a sintaxe do lftp, mantendo senhas fora dos logs.
lftp_quote() { local x="$1"; x="$(printf "%s" "$x" | sed 's/\\/\\\\/g; s/"/\\"/g')"; printf '"%s"' "$x"; }
{
  printf "open -u "; lftp_quote "$LOCAWEB_FTPS_USER,$LOCAWEB_FTPS_PASSWORD"; printf " "; lftp_quote "ftp://$LOCAWEB_FTPS_HOST"; printf "\n"
  printf "cd "; lftp_quote "$LOCAWEB_FTPS_REMOTE_DIR"; printf "\npwd\n"
  printf "mirror -R --parallel=3 --verbose=1 --exclude-glob=robots.txt --exclude-glob=sitemap.xml --exclude-glob=.htaccess ./dist-locaweb .\n"
  printf "put -O . ./dist-locaweb/.htaccess\n"
  printf "put -O . ./dist-locaweb/sitemap.xml\n"
  printf "put -O . ./dist-locaweb/robots.txt\nbye\n"
} >> "$TMP_FTPS_SCRIPT"
echo "Publicando os arquivos. O robô de indexação será liberado ao término da transferência."
lftp -f "$TMP_FTPS_SCRIPT"
echo "Upload concluído. Ainda é necessário conferir HTTPS, e-mail, sitemap, páginas e WhatsApp no domínio."
