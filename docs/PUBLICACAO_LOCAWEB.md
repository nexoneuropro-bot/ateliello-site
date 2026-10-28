# Concluir a publicação da Ateliello na Locaweb — SFTP protegido

## O que já sabemos
- Plano Go Linux, domínio `ateliello.com.br`, FTP host `ftp.ateliello.com.br`, alternativo `ftp.ateliello1.hospedagemdesites.ws`, usuário `ateliello1`, raiz `/home/ateliello1`, site na pasta `public_html`.
- DNS do domínio e alternativo resolve para `179.188.55.94`; HTTP ainda retorna 403 enquanto o diretório público não tem index.
- Servidor FTP da porta 21 respondeu `500 Command AUTH not understood`. Não usar FTP sem criptografia.
- Servidor SSH/SFTP responde na porta 22 com `OpenSSH_8.0`. A chave pública ED25519 foi fixada no script de deploy. A habilitação SSH do usuário pode ser necessária no painel.
- O HTTPS do domínio ainda apresenta certificado `*.websiteseguro.com`, que não corresponde ao nome do domínio; emitir Let’s Encrypt.

## Passos curtos sem compartilhar senha no chat
1. Locaweb: **Configurações > Segurança > Habilitar SSH**. A Locaweb informa que fica habilitado por 3 horas e pode ser reativado depois.
2. GitHub: abra `https://github.com/nexoneuropro-bot/ateliello-site/settings/secrets/actions/new`. Cadastre **somente** o segredo `LOCAWEB_FTPS_PASSWORD` com sua senha do FTP. A mesma senha costuma ser usada para autenticação SSH do plano Linux.
3. GitHub Actions: `https://github.com/nexoneuropro-bot/ateliello-site/actions/workflows/publicar-locaweb.yml`. Execute manualmente com texto `PUBLICAR ATELIELLO`, modo `previa`. Isso publica os arquivos **com Google bloqueado**, enquanto o SSL é regularizado.
4. Locaweb: na aba **Domínios**, em `ateliello.com.br`, escolha **Emitir Let’s Encrypt** (ou via Administrar Site > Informações de domínio) e confira certificado no domínio. A Locaweb pode levar algumas horas para finalizar a emissão.
5. Depois de testar home, fotos, páginas, orçamento, assistente e WhatsApp via HTTPS, execute a mesma publicação em modo `producao`. Somente esse modo cria `sitemap.xml`, `robots.txt` público e tags indexáveis.
6. O e-mail já foi criado pelo responsável; marque `email_verificado` somente quando envio e recebimento forem testados. Não alterar MX.
7. Configure Google Search Console, envie sitemap e revise política de consentimento antes de tags do Google Ads.

## Limitações e cautelas
- A senha não está disponível neste chat e não deve ser enviada nele. O arquivo de deploy lê o segredo protegido do GitHub sem imprimi-lo.
- O acesso SFTP seguro é validado por chave pública de servidor. Caso a chave mude, o script falha em vez de confiar cegamente no novo host; isso deve ser revisado com a Locaweb.
- O envio não elimina arquivos antigos; em uma hospedagem recém-configurada isso evita perdas. Se houver `index.php` ou regras preexistentes, conferir a prioridade da página inicial.
- O upload **não ocorre automaticamente** quando o código é alterado: requer execução manual e segredo protegido.
- Se o SSH da conta estiver desabilitado, o login SFTP falhará. Não usar a porta 21 sem criptografia como alternativa.

Documentação oficial: https://www.locaweb.com.br/ajuda/wiki/como-habilitar-o-ssh-pelo-painel-de-hospedagem-hospedagem-de-sites/ e https://www.locaweb.com.br/ajuda/wiki/como-emitir-o-certificado-lets-encrypt-hospedagem-de-sites/
