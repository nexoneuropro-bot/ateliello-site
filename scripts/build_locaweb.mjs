import fs from "node:fs";
import path from "node:path";

const root=process.cwd(),out=path.join(root,"dist-locaweb");
const production=process.argv.includes("--production");
const site=(process.env.SITE_URL||"https://ateliello.com.br").replace(/\/+$/,"");
const emailConfirmed=process.env.EMAIL_VERIFIED==="yes";
if(!/^https:\/\/[a-z0-9.-]+$/i.test(site))throw Error("SITE_URL deve ser URL HTTPS do domínio, sem caminhos.");
if(production && process.env.RELEASE_APPROVED!=="yes")throw Error("Publicação indexável exige RELEASE_APPROVED=yes depois de validar DNS, SSL, domínio e conteúdo.");
const host=new URL(site).hostname;
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const copyTree=(src,dest)=>{fs.mkdirSync(dest,{recursive:true});for(const ent of fs.readdirSync(src,{withFileTypes:true})){const a=path.join(src,ent.name),b=path.join(dest,ent.name);if(ent.isDirectory())copyTree(a,b);else if(ent.isFile())fs.copyFileSync(a,b);}};
copyTree(path.join(root,"assets"),path.join(out,"assets"));
for(const name of ["style.css","app.js"])fs.copyFileSync(path.join(root,name),path.join(out,name));
const pages=fs.readdirSync(root).filter(x=>x.endsWith(".html")).sort();
const esc=(v)=>v.replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;");

for(const page of pages){
 let html=fs.readFileSync(path.join(root,page),"utf8");
 const canonical=site+(page==="index.html"?"/":"/"+page);
 const robots=production?"index,follow,max-image-preview:large":"noindex,nofollow";
 if(!/<meta name="robots" content="[^"]*">/.test(html))throw Error(page+": meta robots ausente.");
 html=html.replace(/<meta name="robots" content="[^"]*">/,'<meta name="robots" content="'+robots+'">');
 html=html.replace(/<link rel="canonical" href="[^"]*">/g,"");
 html=html.replace(/<meta property="og:url" content="[^"]*">/g,"");
 const seo='<link rel="canonical" href="'+esc(canonical)+'"><meta property="og:url" content="'+esc(canonical)+'"><meta name="twitter:card" content="summary_large_image">';
 html=html.replace("</head>",seo+"</head>");
 html=html.replace(/<meta property="og:image" content="([^"]*)">/,(_,img)=>'<meta property="og:image" content="'+esc(new URL(img,site+"/").href)+'">');
 html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(match,json)=>{let obj;try{obj=JSON.parse(json)}catch{return match;}
 const amend=(v)=>{if(!v||typeof v!=="object")return;if(Array.isArray(v)){v.forEach(amend);return;}if(v["@type"]==="Organization"){v.url=site+"/";v.logo=site+"/assets/logo-ateliello-com-assinatura.png";}if(v["@graph"])amend(v["@graph"]);};amend(obj);
 return '<script type="application/ld+json">'+JSON.stringify(obj).replaceAll("<","\\u003c")+"</script>";});
 html=html.replaceAll('assets/logo-ateliello-metalico.webp','assets/logo-ateliello-com-assinatura.png');
 html=html.replace(/>Bordados <span aria-hidden="true">⌄<\/span>/g,'>Bordados personalizados <span aria-hidden="true">⌄</span>');
 html=html.replace(/>Para você <span aria-hidden="true">⌄<\/span>/g,'>Toalhas e roupões <span aria-hidden="true">⌄</span>');
 if(!html.includes('>Kits especiais</a>'))html=html.replace('<a class="menu-link" href="tecidos-personalizacao.html">','<a class="menu-link" href="kits-casamento.html">Kits especiais</a><a class="menu-link" href="tecidos-personalizacao.html">');
 if(page==="index.html"){
 html=html.replace('<h1>Uniformes e bordados<br>com <em>propósito.</em></h1>','<h1>Sua identidade <em>em cada detalhe.</em></h1>');
 html=html.replace('Do uniforme que representa sua marca ao presente que guarda memórias. Peças personalizadas com escolha de tecidos, cuidado de ateliê e produção profissional.','Uniformes profissionais, bordados personalizados e peças especiais para empresas e para você. Do primeiro uniforme ao presente especial.');
 }
  if(page==="index.html")html=html.replaceAll('href="index.html"','href="/"');
 if(page==="politica-de-privacidade.html"&&production){
  html=html.replace("Esta política descreve a experiência atual de prévia. A assistente virtual desta prévia","Esta política descreve o atendimento por meio deste site. A assistente virtual");
 }
 if(emailConfirmed)html=html.replace(/(<a class="footer-whats"[^>]*>[\s\S]*?<\/a>)/g,'$1<a class="footer-email" href="mailto:contato@ateliello.com.br">contato@ateliello.com.br</a>');
 fs.writeFileSync(path.join(out,page),html);
}
const urls=pages.filter(x=>!["orcamento.html"].includes(x)).map(x=>site+(x==="index.html"?"/":"/"+x));
if(production){
 const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>"  <url><loc>"+esc(u)+"</loc></url>").join("\n")+"\n</urlset>\n";
 fs.writeFileSync(path.join(out,"sitemap.xml"),xml);
 fs.writeFileSync(path.join(out,"robots.txt"),"User-agent: *\nAllow: /\nSitemap: "+site+"/sitemap.xml\n");
 const ht=[
  "Options -Indexes",
  "ErrorDocument 404 /404.html",
  "RewriteEngine On",
  "RewriteCond %{HTTPS} !=on [OR]",
  "RewriteCond %{HTTP_HOST} ^www\\."+host.replaceAll(".","\\.")+"$ [NC]",
  "RewriteRule ^ https://"+host+"%{REQUEST_URI} [R=301,L,NE]",
  "RewriteCond %{THE_REQUEST} \\s/+index\\.html[\\s?] [NC]",
  "RewriteRule ^index\\.html$ / [R=301,L]",
  "Header always set X-Content-Type-Options \"nosniff\"",
  "Header always set Referrer-Policy \"strict-origin-when-cross-origin\"",
  ""
 ].join("\n");
 fs.writeFileSync(path.join(out,".htaccess"),ht);
} else {
 fs.writeFileSync(path.join(out,"robots.txt"),"User-agent: *\nDisallow: /\n");
}
fs.writeFileSync(path.join(out,"404.html"),'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página não encontrada | Ateliello</title><link rel="stylesheet" href="/style.css"></head><body><main class="shell" style="min-height:70vh;padding:8vh 0"><a href="/" aria-label="Início da Ateliello"><img src="/assets/logo-ateliello-com-assinatura.png" width="200" alt="Ateliello Uniformes e Bordados"></a><h1 style="font-size:clamp(36px,5vw,70px);margin:40px 0 15px">Esta página não foi encontrada.</h1><p>O cuidado continua aqui. Explore nossos serviços ou converse com o ateliê.</p><p><a class="btn primary" href="/">Voltar ao início</a> <a class="btn outline" href="/orcamento.html">Pedir orçamento</a></p></main></body></html>');
const listing=fs.readdirSync(out).filter(x=>x.endsWith(".html")).length;
console.log((production?"PRODUÇÃO INDEXÁVEL":"PRÉVIA BLOQUEADA")+" | "+listing+" HTML (incluindo 404), "+urls.length+" URLs do sitemap em produção.");
