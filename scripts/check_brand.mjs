import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync('style.css','utf8');
const tail=css.slice(css.indexOf('/* Ateliello — logotipo integrado'));
assert.ok(tail.length>1500,'Bloco de marca integrada ausente');
for(const str of ['.site-head .brand img','mix-blend-mode:multiply','.footer .footer-brand img','filter:saturate(.95) contrast(1.045)','mask-composite:intersect']){
  assert.ok(tail.includes(str),'Falta: '+str);
}
for(const f of fs.readdirSync('.').filter(s=>s.endsWith('.html'))){
  const html=fs.readFileSync(f,'utf8');
  assert.ok(html.includes('assets/logo-ateliello-metalico.webp')||f==='index.html'&&html.includes('assets/logo-ateliello-metalico.webp'),f+' sem logotipo oficial');
}
console.log('Marca integrada: cabeçalho, rodapé e páginas com logotipo oficial.');
