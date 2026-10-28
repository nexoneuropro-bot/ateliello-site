# Hospedagem GO — FTP em vez de SSH

O suporte confirmou que o plano Go Linux da Ateliello não tem acesso SSH. A documentação oficial da Locaweb recomenda FTP e a publicação pelo GitHub Actions:
https://www.locaweb.com.br/ajuda/wiki/github-actions-ftp-hospedagem-compartilhada-locaweb/

O teste público retornou resposta `500 Command AUTH not understood` a `AUTH TLS`, portanto **não há FTPS explícito** nesse endpoint. A implementação usa FTP comum, sem criptografia, que pode expor a senha durante o trânsito na rede. O segredo continua protegido nos logs do GitHub, mas esse fato não torna o canal FTP seguro. Considere trocar a senha FTP após a transferência inicial e atualizar o segredo do GitHub.

O upload usa a biblioteca padrão Python, com o host e usuário confirmados no painel da Locaweb, e o `LOCAWEB_FTPS_PASSWORD` já criado no GitHub. Usa somente `dist-locaweb/`, sem apagar arquivos desconhecidos. Em modo prévia, envia robots bloqueado primeiro. SEO de produção só após domínio HTTPS válido e testes.

O WebFTP acessado no navegador por HTTPS é a alternativa sem senha viajando pelo canal FTP do GitHub, mas exige interação autenticada no painel.
