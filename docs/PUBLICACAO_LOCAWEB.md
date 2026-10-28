# Concluir a publicação da Ateliello na Locaweb

## O que está preparado
- 34 páginas HTML, identidade e assets locais, WhatsApp, assistente, orçamento, páginas de campanhas e conteúdos orgânicos.
- Geração verificada dos pacotes de prévia bloqueada e de produção com canonical, sitemap e robots indexável.
- Workflow manual para transferir produção via **FTPS com TLS obrigatório e verificação de certificado**.
- O workflow não é executado automaticamente; ele exige confirmação e acesso seguro.

## Dados que faltam (configurar **dentro do GitHub**, nunca compartilhar no chat)
1. Abra `https://github.com/nexoneuropro-bot/ateliello-site/settings/environments` e crie ambiente `locaweb-producao`; configure revisores aprovadores e restrição à branch `main`.
2. Nesse ambiente crie os três **secrets** `LOCAWEB_FTPS_HOST`, `LOCAWEB_FTPS_USER`, `LOCAWEB_FTPS_PASSWORD` com os dados de **Arquivos e FTP** do painel Locaweb.
3. Ainda no ambiente, crie as **variables** `ATELIELLO_DOMAIN` = `ateliello.com.br` e `LOCAWEB_FTPS_REMOTE_DIR` com o caminho exato até o `public_html` do domínio. Verifique antes se o produto é Hospedagem Linux e se suporta FTPS explícito TLS.
4. Faça backup do conteúdo atualmente hospedado. Confirme domínio cadastrado, DNS e certificado HTTPS. Não substitua registros MX existentes sem conferir o e-mail.
5. No **Painel de E-mail Locaweb**, crie `contato@ateliello.com.br` e configure registros MX, SPF, DKIM e DMARC fornecidos pela Locaweb; teste **envio e recebimento**. Não há API autorizada para criar essa conta neste chat.
6. Acesse `https://github.com/nexoneuropro-bot/ateliello-site/actions/workflows/publicar-locaweb.yml`, clique **Run workflow**, insira `PUBLICAR ATELIELLO` e marque o e-mail como verificado somente após o teste.
7. Com a publicação concluída, verifique home, menus, todas as imagens, páginas de campanhas, orçamento, WA, HTML 404, HTTPS, `robots.txt`, `sitemap.xml` e Search Console. Configure análise de anúncios e consentimento antes de ativar Google Ads.

## Cuidados
- FTPS precisa estar disponível e com certificado válido; **não desative** validação TLS nem use FTP sem criptografia. Se não houver FTPS, escolha o WebFTP autenticado ou SFTP do painel em vez de reduzir segurança.
- A sincronização não remove arquivos remotos, mas substitui arquivos que possuem o mesmo nome. Tenha backup.
- O sitemap e robots indexável são enviados **após** os demais arquivos; a indexação não é instantânea nem garantida.
- O e-mail precisa ser criado dentro da Locaweb: transferir o site não cria uma caixa postal.
- Se o produto Locaweb usar Windows/IIS, não use as regras `.htaccess` geradas para Linux/Apache.

Documentação Locaweb: https://www.locaweb.com.br/ajuda/wiki/como-criar-site-na-locaweb/ e https://www.locaweb.com.br/ajuda/wiki/como-configurar-dominio-painel-email-locaweb/
