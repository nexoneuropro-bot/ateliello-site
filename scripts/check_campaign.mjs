import assert from 'node:assert/strict';
import fs from 'node:fs';
const pages=['campanha-uniformes-empresas.html','campanha-jalecos-clinicas.html','campanha-toalhas-presentes.html'];
for(const page of pages){
 const html=fs.readFileSync(page,'utf8');
 assert.equal(html.split('<main id="conteudo">').length-1,1,page+': main único');
 assert.equal(html.split('</main>').length-1,1,page+': main deve fechar');
 assert.equal(html.split('data-fastquote').length-1,1,page+': formulário único');
 for(const attr of ['name="piece"','name="qty"','name="supply"','name="deadline"','aria-live="polite"'])assert.ok(html.includes(attr),page+': falta '+attr);
 assert.ok(html.includes('href="orcamento.html?contexto='),page+': ausência de orçamento completo');
}
const js=fs.readFileSync('app.js','utf8');
for(const marker of ['form[data-fastquote]','ateliello_fastquote_whatsapp_click','wa.me/551154441399'])assert.ok(js.includes(marker),'Ausente: '+marker);
console.log('Consultas de campanha: 3 páginas, 4 campos e links para orçamento validados.');
