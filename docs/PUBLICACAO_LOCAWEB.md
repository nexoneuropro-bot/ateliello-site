# Concluir a publicação da Ateliello na Locaweb

## O que está preparado
- 34 páginas HTML, identidade e assets locais, WhatsApp, assistente, orçamento, páginas de campanhas e conteúdos orgânicos.
- Geração verificada dos pacotes de prévia bloqueada e de produção com canonical, sitemap e robots indexável.
- Workflow manual para transferir produção via **FTPS com TLS obrigatório e verificação de certificado**.
- O workflow não é executado automaticamente; ele exige confirmação e acesso seguro.

## Dados que faltam (configurar **dentro do GitHub**, nunca compartilhar no chat)
1. Confirme na Locaweb: hospedagem Linux Go, host alternativo `ftp.ateliello1.hospedagemdesites.ws`, usuário `ateliello1`, pasta de publicação `public_html`, domínio `ateliello.com.br`. Esses dados não secretos já estão preenchidos no workflow conforme captura da conta.
2. Abra `https://github.com/nexoneuropro-bot/ateliello-site/settings/secrets/actions/new` e cadastre apenas **um segredo** com o nome `LOCAWEB_FTPS_PASSWORD` e a senha FTP do painel. A senha não deve ser escrita no chat, no repositório ou em comentários.
3. Opcionalmente, crie ambiente `locaweb-producao` em `Settings > Environments` para exigir aprovação de publicação por um responsável. O workflow já usa esse nome; a senha cadastrada como segredo do repositório fica disponível ao workflow.
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

## Atenção: verificação de segurança
O workflow recusa o envio da versão **indexável** quando o HTTPS de `https://ateliello.com.br/` não responde com certificado válido. A configuração do domínio e SSL precisa estar concluída antes da publicação. A conexão FTPS usa TLS explícito; caso o certificado fornecido pela hospedagem não seja reconhecido com o hostname alternativo, não se deve desligar sua validação sem um método de autenticação equivalente.
