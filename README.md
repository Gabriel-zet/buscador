# Buscador - Xianyu Helper

Extensão para Chrome que injeta um painel de análise em anúncios da **Xianyu (Goofish)** e adiciona um botão de atalho na **CSSBuy**.

---

## Funcionalidades

**Goofish**
- Score de confiança do vendedor (0–100) com base em vendas, avaliação, taxa de resposta e tempo de conta
- Alertas críticos: iCloud Lock, MDM, bloqueio de rede, peças trocadas, dano por água, tela trincada
- Alerta de preço suspeito com piso mínimo por modelo(MOCK)
- Specs extraídas do anúncio: RAM, armazenamento, chip, bateria, garantia, versão regional, cor, conectividade
- Conversão automática de yuan para real (taxa editável)
- Tradução automática do título e descrição do anúncio (chines → pt-BR) via MyMemory API
- Botão de compra direto via CSSBuy
- Badge arrastável e minimizável

**CSSBuy**
- Botão fixo para abrir o anúncio original na Xianyu

---

## Instalação

1. Clone ou baixe o repositório
2. Abra `chrome://extensions`
3. Ative o **Modo do desenvolvedor**
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto

---

## Arquivos

```
/
├── manifest.json
├── content.js
├── logo.png
└── README.md
```

---

## Tradução

Usa a [MyMemory API](https://mymemory.translated.net/) - gratuita, sem chave necessária.

Limite: **5.000 caracteres/dia por IP**. Para aumentar para 50k/dia, adicione `&de=seuemail@gmail.com` na const url` 

---

## Modelos com piso de preço(mockados)

iPhones (12 ao 17), AirPods, Apple Watch, Samsung Galaxy S/Z, Xiaomi 14/15, Redmi Note 14, MacBook e iPad.

---

