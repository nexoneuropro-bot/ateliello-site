# Ateliello — Migração Locaweb com SEO controlado

## Situação técnica
A fonte em `main` continua sendo a **prévia, com indexação bloqueada**. Não enviar a raiz do GitHub ao FTP: há documentos de trabalho, testes e arquivos específicos de outros provedores.

**Domínio-alvo:** `https://ateliello.com.br/`, sujeito à confirmação de que o domínio está de fato ativo na conta e apontado para a hospedagem certa.

## 1. Validar os serviços antes de publicar
- Hospedagem de Sites **Linux** em funcionamento (pasta publicada `public_html`). Confirmar no painel, sem presumir o tipo de produto contratado.
- Domínio `ateliello.com.br` vinculado à hospedagem correta. Verificar os apontamentos DNS atuais **antes** de alterar qualquer registro.
- Certificado HTTPS válido para domínio principal e WWW; preservar qualquer serviço de e-mail em uso ao editar DNS.
- Caixa `contato@ateliello.com.br` criada no Painel de E-mail da Locaweb, com teste de envio **e** recebimento; configurar MX, SPF, DKIM e DMARC conforme valores efetivos fornecidos pela Locaweb. Não inventar esses valores.

## 2. Montar pacote
```sh
node scripts/build_locaweb.mjs
node scripts/check_release.mjs
```
O padrão é uma **prévia não indexável**, para validar arquivos e layout sem abrir o domínio ao Google.

Para preparar a versão de produção *após confirmar domínio, DNS, HTTPS, conteúdo e e-mail*:
```sh
RELEASE_APPROVED=yes SITE_URL=https://ateliello.com.br EMAIL_VERIFIED=yes node scripts/build_locaweb.mjs --production
SITE_URL=https://ateliello.com.br node scripts/check_release.mjs --production
```
Publicar **somente** o conteúdo de `dist-locaweb/` em `public_html/` (Linux). Não publicar `docs/`, `scripts/`, `.github/`, `_headers` ou `robots.txt` de prévia. O pacote de produção contém favicon, imagens locais, 404, canonical, Open Graph, sitemap e robots público, além de regras Apache para HTTPS + domínio canônico (testar regras na hospedagem; se o ambiente não usar Apache, configurar redirecionamentos no painel).

**Importante:** a versão indexável não deve ser colocada em domínio de testes ou endereço alternativo do provedor. Em testes usar a variante de prévia.

## 3. E-mail
- A caixa postal **não** é criada ao editar HTML. Somente o administrador autenticado do produto de e-mail pode criá-la.
- No Painel de Email Locaweb: selecionar domínio, administrar e-mails, criar caixa postal `contato`, escolher senha forte **no painel**, configurar DNS e testar envio/recebimento.
- Somente com `EMAIL_VERIFIED=yes` a versão produzida exibe o endereço de e-mail no rodapé. Não anunciar uma caixa inexistente.

## 4. Publicação e futuras atualizações
A Locaweb documenta FTP e WebFTP, além da possibilidade de automatização a partir do GitHub. Para upload seguro, preferir FTPS com validação de certificado (ou SFTP, se disponível no plano) e credenciais guardadas em secrets, nunca no código ou na conversa.

Antes de qualquer automação, verificar se o serviço fornece FTP/FTPS seguro, caminho real do `public_html` e uma conta com permissões limitadas. Não configurar deploy por push sem teste e sem mecanismo de rollback. Backup completo antes do primeiro envio.

## 5. SEO e Ads
- Após publicação no domínio: conferir redirecionamento HTTPS e WWW, respostas 200/301/404, responsividade, favicon, logotipo, todas as imagens, envio ao WhatsApp e fluxo de orçamento.
- Verificar `https://ateliello.com.br/robots.txt` e `/sitemap.xml` e as tags canonical de cada página.
- Conectar Search Console para verificar domínio e enviar o sitemap; indexação e posicionamento **não são garantidos**.
- Configurar propriedade GA4 e Google Ads com identificadores da empresa, consentimento e política de privacidade revisada **antes** de ativar pixels.
- Eventos `dataLayer` são tentativas de contato, não pedidos recebidos nem vendas.
- Para Ads, vincular os anúncios às páginas de destino específicas no **mesmo domínio** e revisar as políticas vigentes.

Documentos Locaweb:
- https://www.locaweb.com.br/ajuda/wiki/como-migrar-o-conteudo-de-uma-hospedagem-hospedagem-de-sites/
- https://www.locaweb.com.br/ajuda/wiki/github-actions-ftp-hospedagem-compartilhada-locaweb/
- https://www.locaweb.com.br/ajuda/wiki/como-criar-uma-conta-de-e-mail-email-locaweb/
