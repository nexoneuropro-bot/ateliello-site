# Ateliello — Arquitetura de conteúdo, SEO e campanhas (V12)

## Posicionamento e operação
Nome oficial: **Ateliello Uniformes e Bordados**.
A marca atende online a partir de São Paulo. Os endereços em São Paulo e Osasco não representam lojas abertas para visita espontânea. Uma eventual retirada é **programada e agendada** depois da confirmação. Atendimento e orçamentos: **WhatsApp +55 11 5444-1399**.

**Para você:** atendimento artesanal de ateliê, com avaliação de referência, ideia, tecido, nome e ocasião. Projetos individuais ou kits.
**Para empresas:** processo de produção por lotes com grade, conferência de arte, padronização, quantidade, tecido, produção e aprovação de prazo.
Preço por material, complexidade do bordado, quantidade, preparo e urgência. Somente a toalha de batismo tem um valor informado: **R$ 25,90/un. na configuração de referência**. Não presumir preço tabelado nem estoque de tecidos.

## Campanhas — URLs próprias
Estas páginas foram criadas como páginas de destino com conteúdo próprio e CTA de orçamento:
- `/campanha-uniformes-empresas.html`: polos, aventais, camisetas e equipes; intenção de compra empresarial.
- `/campanha-jalecos-clinicas.html`: jalecos e scrubs, nome/área de atuação e equipes de saúde.
- `/campanha-toalhas-presentes.html`: roupões, toalhas, casamento, batismo e presentes.

Direcionar cada campanha à página compatível. Preferir termos de intenção como “uniforme bordado para empresa”, “jaleco bordado personalizado” e “toalha bordada com nome”; evitar promessas sobre preço mínimo, entrega imediata ou tamanho de lote sem verificar.

Exemplo de UTMs: `?utm_source=google&utm_medium=cpc&utm_campaign=uniformes_empresas&utm_content=grupo_polos`. O site armazena temporariamente os parâmetros na sessão para incluí-los na mensagem de orçamento, sem enviá-los automaticamente para um serviço externo.

## Conteúdo orgânico e educação
Hub `/guias-bordado-personalizacao.html` com quatro guias:
- `/guia-como-escolher-uniforme-para-equipe.html`
- `/guia-tecidos-para-bordar-uniformes.html`
- `/guia-toalhas-personalizadas-presentear.html`
- `/guia-bordado-em-pecas-prontas.html`

Os textos foram escritos para responder dúvidas reais e direcionar a páginas comerciais relevantes. Revisar os artigos com experiência prática da produção quando novas informações forem verificadas.

## Assistente virtual e WhatsApp
Há uma **assistente virtual de orientação com regras locais**, não um modelo generativo conectado. Está disponível em todas as páginas via `app.js`; respostas cobrem tecidos, quantidades, uniformes, clínicas, presentes, batismo, prazos, peça do cliente e contato. A equipe humana assume pelo WhatsApp. Perguntas **não são enviadas a APIs de IA**, e o contato só ocorre após ação do visitante.

Eventos de interface preparados em `dataLayer`:
- `ateliello_quote_navigation`
- `ateliello_quote_add_item`
- `ateliello_whatsapp_quote_click`
- `ateliello_whatsapp_click`
- `ateliello_assistant_open`
- `ateliello_assistant_topic` (apenas destino da orientação, sem texto da pergunta)
- `ateliello_assistant_whatsapp_click`

**Cláusula de integridade:** clique no WhatsApp representa uma tentativa de contato, não mensagem enviada, lead qualificado nem venda. Não apresentar dados de resultados sem integração e verificação.

## Pré-lançamento e indexação
A prévia usa bloqueio de indexação `noindex` e `robots.txt` com `Disallow: /` intencionalmente. **Não usar a prévia para campanhas pagas até liberar o acesso a crawlers e concluir a revisão**.
Antes de ativar:
1. Confirmar domínio definitivo e dados cadastrais.
2. Ajustar HTTPS, canonicals absolutos, URLs finais e sitemap.xml.
3. Remover bloqueio global de robots e o noindex das páginas orgânicas aprovadas. Decidir política de indexação das páginas só de Ads.
4. Revisar disponibilidade, políticas de compra, pagamento, cancelamento, devolução e privacidade (LGPD) conforme operação real.
5. Configurar GA4, Google Ads/Meta e consentimento (identificadores não incluídos nesta prévia).
6. Testar navegação desktop/mobile, contraste, teclado, reduced motion, formulário com múltiplos itens e abertura do WhatsApp.
7. Usar fotografias reais de uniformes produzidos com permissão de clientes para casos concretos; não inventar depoimentos, avaliações ou entregas.

## CI
A cada push o GitHub Actions valida presença de recursos, único H1, título, JSON-LD e sintaxe JavaScript. Esta validação **não substitui** testes visuais de navegador ou auditoria de performance.
