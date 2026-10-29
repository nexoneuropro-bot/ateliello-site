import fs from "node:fs";import path from "node:path";import assert from "node:assert/strict";
const root="dist-locaweb",live=process.argv.includes("--production"),site=(process.env.SITE_URL||"https://ateliello.com.br").replace(/\/+$/,"");
assert.ok(fs.existsSync(path.join(root,"index.html")));
assert.ok(fs.existsSync(path.join(root,"assets/logo-ateliello-com-assinatura.png")));
assert.ok(fs.existsSync(path.join(root,"style.css")));
assert.ok(fs.existsSync(path.join(root,"app.js")));
const pages=fs.readdirSync(root).filter(x=>x.endsWith(".html")&&x!=="404.html");
for(const p of pages){
 const html=fs.readFileSync(path.join(root,p),"utf8"),url=site+(p==="index.html"?"/":"/"+p);
 assert.ok(html.includes('rel="canonical" href="'+url+'"'),p+": canonical");
 assert.ok(html.includes('property="og:url" content="'+url+'"'),p+": URL social");
 assert.ok(/property="og:image" content="https:\/\//.test(html),p+": imagem social absoluta");
 assert.ok(html.includes('name="robots" content="'+(live?"index,follow,max-image-preview:large":"noindex,nofollow")+'"'),p+": indexação incorreta");
 assert.equal((html.match(/<h1\b/g)||[]).length,1,p+": H1");
 assert.ok(!html.includes('raw.githubusercontent.com'),p+": imagem externa GitHub inesperada");
}
const robots=fs.readFileSync(path.join(root,"robots.txt"),"utf8");
if(live){
 assert.ok(robots.includes("Sitemap: "+site+"/sitemap.xml"));
 assert.ok(!robots.includes("Disallow: /"));
 assert.ok(fs.existsSync(path.join(root,".htaccess")));
 const sitemap=fs.readFileSync(path.join(root,"sitemap.xml"),"utf8");
 assert.ok(sitemap.includes("<loc>"+site+"/</loc>"));
 for(const p of pages.filter(p=>p!=="orcamento.html"))assert.ok(sitemap.includes("<loc>"+site+"/"+(p==="index.html"?"":p)+"</loc>"),p+": sitemap");
}else{
 assert.ok(robots.includes("Disallow: /"));
 assert.ok(!fs.existsSync(path.join(root,"sitemap.xml")));
}
console.log("SEO "+(live?"produção":"prévia")+" verificado em "+pages.length+" páginas. Arquivos estáticos locais presentes.");
