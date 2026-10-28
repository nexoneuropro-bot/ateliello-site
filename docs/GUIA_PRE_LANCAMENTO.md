# Ateliello — prévia, SEO e acompanhamento
Atualizado para a revisão de pré-lançamento.

## Situação da prévia
- Esta versão está configurada com `noindex`. **Não remover antes da aprovação do domínio, termos comerciais e fotografias**.
- Não há compras finalizadas dentro do site. O objetivo é o orçamento enviado pelo WhatsApp.
- Os preços são orientativos: a toalha de batismo parte da configuração de referência de R$ 25,90. Tecidos, bordados, quantidades e urgência alteram a cotação.

## Fotografia e confiança
- A página `portfolio-bordados-reais.html` usa exclusivamente fotos do bordado real existente no acervo da Ateliello.
- Trata-se de um conjunto fotografado em diferentes ângulos; não representar como obras de diferentes clientes.
- Uniformes em ambientações digitais apresentam possibilidades de personalização, mas não devem ser apresentados como casos entregues.
- Para anúncios de uniformes, priorizar novas fotografias de peças efetivamente executadas, com autorização para divulgar logos de clientes.

## Medição de conversões — preparada, não ativada
O JavaScript usa um `dataLayer` local com eventos **sem dados pessoais**:
- `ateliello_quote_navigation`: clique para página de orçamento
- `ateliello_quote_add_item`: seleção de uma peça
- `ateliello_whatsapp_quote_click`: tentativa de abrir WhatsApp com orçamento preenchido
- `ateliello_whatsapp_click`: clique em contato comercial geral

**Importante:** um clique no WhatsApp **não confirma mensagem recebida, lead qualificado ou venda**. Não informar "conversões reais" a partir desses eventos. Para usar GA4, Google Ads ou Meta Ads serão necessárias as credenciais/identificadores de propriedades e validação de consentimento, privacidade e disparo, sob autorização.

Os parâmetros `utm_source`, `utm_medium`, `utm_campaign` e `utm_content` podem ser guardados temporariamente em `sessionStorage` para preservar a origem quando o visitante navega. Não são enviados a servidores de analytics na prévia.

## SEO ao publicar em domínio próprio
1. Confirmar domínio e a URL definitiva; adicionar URLs canônicas absolutas consistentes.
2. Revisar títulos, H1, nomes de arquivos, alt texts e conteúdo diferenciado por serviço.
3. Criar sitemap.xml somente com URLs públicas canônicas; validar robots.txt e remover noindex quando autorizado.
4. Completar política de privacidade e condições comerciais com informações verificadas.
5. Configurar Search Console, GA4 e eventos com consentimento adequado, depois campanhas Google Ads/Meta Ads.
6. Testar Core Web Vitals e a jornada de orçamento em celulares reais.

## Testes mínimos por alteração
- Verificar todos os arquivos HTML, CSS, JS e imagens.
- Testar o menu de desktop e mobile e seus submenus.
- Testar orçamento com uma peça pessoal e um pedido empresarial multipeças.
- Testar edição, remoção, quantidade total e preservação dos parâmetros de campanha ao mudar de página.
- Verificar redirecionamento ao WhatsApp +55 11 5444-1399.
- Confirmar funcionamento sem movimentos para quem usa prefers-reduced-motion.
