#!/usr/bin/env python3
"""Reconstrói imagens de prévia da Ateliello a partir de atlas fotográfico.
As imagens de maior resolução já presentes no repositório não são substituídas.
"""
from pathlib import Path
from PIL import Image
names = [
"conceito-viagem.webp","conceito-beleza.webp","conceito-casa.webp",
"caixa-presente-ateliello.webp","conceito-gastronomia.webp","logo-ateliello-com-assinatura.png",
"conceito-infantil.webp","conceito-clinicas.webp","conceito-personal.webp",
"conceito-noivas.webp","compartilhamento-ateliello-v7.jpg","hero-roupao-conceitual.webp",
"conceito-equipes.webp","editorial-composicao-conceitual.webp","toalhas-monograma-dupla.webp",
"favicon-ateliello.png","conceito-dj.webp","conceito-casamento.webp",
"detalhe-bordado-claro.webp","bastidores-artesanais.webp","conceito-academias.webp",
"hero-toalhas-reais.webp","conjunto-mesa-madeira.webp","detalhe-bordado-cinza.webp",
]
atlas = Image.open("assets-source/atlas.webp").convert("RGB")
w,h = atlas.size
assert w % 6 == 0 and h % 4 == 0, "Atlas deve ter seis colunas e quatro linhas"
cw,ch = w//6,h//4
out=Path("assets");out.mkdir(exist_ok=True)
for i,name in enumerate(names):
    path=out/name
    if path.exists():
        continue
    image=atlas.crop(((i%6)*cw,(i//6)*ch,(i%6+1)*cw,(i//6+1)*ch))
    if name.endswith(".png"):
        image.save(path, "PNG", optimize=True)
    elif name.endswith(".jpg"):
        image.save(path, "JPEG", quality=85, optimize=True)
    else:
        image.save(path, "WEBP", quality=83, method=6)
    print("Criado:",path)
