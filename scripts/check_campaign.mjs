import assert from 'node:assert/strict';import fs from 'node:fs';
const pages=['campanha-uniformes-empresas.html','campanha-jalecos-clinicas.html','campanha-toalhas-presentes.html'];
for(const page of pages){const html=fs.readFileSync(page,'utf8');
 assert.equal((html.match(/<main\\b/g)||[]).length,1,page+': deve ter um main');
 assert.equal((html.match(/<\\/main>/g)||[]).length,1,page+': main deve fechar');
 assert.equal((html.match(/data-fastquote/g)||[]).length,1,page+': formulario único');
 for(const attr of ['name="piece"','name="qty"','name="supply"','name="deadline"','aria-live="polite"'])assert.ok(html.includes(attr),page+': falta '+attr);
 assert.ok(html.includes('href="orcamento.html?contexto='),page+': ausência do orçamento completo');
}
const js=fs.readFileSync('app.js','utf8');
for(const text of ['form[data-fastquote]','ateliello_fastquote_whatsapp_click','wa.me/551154441399'])assert.ok(js.includes(text),'Ausente: '+text);
console.log('Consultas de campanha: 3 páginas e os 4 campos validados.');