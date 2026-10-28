import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('function answer(q){');
const end=app.indexOf('\nfunction ask(q)',start);
assert.ok(start>=0 && end>start,'Função de orientação não encontrada.');
const fn=app.slice(start,end);
const ctx={};
vm.runInNewContext("const clean=t=>String(t||'').trim().slice(0,420);const norm=t=>clean(t).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();"+fn+";this.answer=answer",ctx);
const examples=[
 ['Quero bordar minha peça que comprei','bordado-em-pecas-do-cliente.html'],
 ['Vocês bordam toalha de batismo?','toalhas-batismo-personalizadas.html'],
 ['Preciso de 20 polos para minha empresa','uniformes-personalizados.html'],
 ['Uniforme para clínica de nutrição','uniformes-clinicas.html'],
 ['Toalha para academia e personal trainer','bordados-academias-personal.html'],
 ['Quero 10 aventais para meu food truck','uniformes-gastronomia.html'],
 ['Preciso de bordados para DJ e evento','bordados-djs-eventos.html'],
 ['Qual tecido escolher para minha polo?','tecidos-personalizacao.html'],
 ['Quanto custa um bordado?','orcamento.html'],
 ['Como funciona a retirada em Osasco?','contato.html'],
 ['Kit para casamento','toalhas-roupoes-personalizados.html']
];
for(const [question,path] of examples){const result=ctx.answer(question);assert.equal(result[1],path,'Resposta inadequada: '+question);assert.ok(result[0].length>60);}
assert.ok(!/const group=\$\('\.menu-drop'\)\.find/.test(app),'Menu de produtos não pode usar querySelector().find');
console.log('Assistente Ateliello:',examples.length,'perguntas testadas com sucesso.');
