/* ============================================================
   Buscador Xianyu Helper — content.js
   Versão : v1.0.0
   ============================================================ */

console.log("%c Buscador Xianyu Helper v1.0.0 — Ativo ", "color:#3ae0c8;background:#0f172a;font-weight:bold;font-size:13px;");

const GITHUB_URL   = "https://github.com/Gabriel-zet";
const PROMO_CODE   = "f708360bc5a933b3";
const STORAGE_KEY  = "buscador_taxa_yuan_real";
const DEFAULT_TAXA = 1.22;

let taxa        = parseFloat(localStorage.getItem(STORAGE_KEY)) || DEFAULT_TAXA;
let initialized = { goofish: false, cssbuy: false };
let observer    = null;

let LOGO_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%230f172a'/%3E%3Ctext x='50' y='68' font-size='56' font-weight='bold' fill='%233ae0c8' text-anchor='middle'%3EB%3C/text%3E%3C/svg%3E";
try { const r = chrome.runtime.getURL('logo.png'); if (r) LOGO_URL = r; } catch (_) {}


// ==============================================================
//  1. ESTILOS
// ==============================================================
function injectStyles() {
    if (!onGoofish()) return;
    if (document.getElementById('buscador-styles')) return;

    const s = document.createElement('style');
    s.id = 'buscador-styles';
    s.textContent = `
        .ant-modal-root:has([class*="login" i]),
        .ant-modal-root:has(iframe[src*="login"]),
        [role="dialog"]:has([class*="login" i]),
        .loginCon--d9IpwYeU, .login-modal-wrapper,
        .login-iframe-wrap--gc03OP5a, .closeIconBg--cubvOqVh {
            display: none !important; pointer-events: none !important; opacity: 0 !important;
        }
        html, body { overflow: auto !important; height: auto !important; position: relative !important; }

        @keyframes bld  { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes slid { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

        #seller-status-badge {
            position: fixed; top: 18px; left: 18px; z-index: 2147483647;
            width: 300px; font-family: 'Segoe UI', system-ui, sans-serif;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.07);
            animation: slid .35s ease both; cursor: default; user-select: none;
        }

        #buscador-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 11px 13px 10px; background: #0f172a;
            border-bottom: 1px solid rgba(255,255,255,.07);
            border-radius: 16px 16px 0 0; cursor: grab;
        }
        #buscador-header:active { cursor: grabbing; }
        #buscador-logo-wrap { display: flex; align-items: center; gap: 9px; }
        #buscador-logo-wrap img {
            width: 32px; height: 32px; border-radius: 8px;
            object-fit: cover; border: 1px solid rgba(255,255,255,.12);
        }
        #buscador-title   { font-size: 14px; font-weight: 700; color: #f1f5f9; letter-spacing: .3px; }
        #buscador-subtitle { font-size: 9px; color: #64748b; letter-spacing: .5px; text-transform: uppercase; }

        #btn-minimize {
            width: 22px; height: 22px; border-radius: 50%;
            background: rgba(255,255,255,.07); border: none; color: #94a3b8;
            font-size: 13px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: background .2s; flex-shrink: 0;
        }
        #btn-minimize:hover { background: rgba(255,255,255,.14); color: #fff; }

        #buscador-body {
            background: #131c2e; padding: 12px 13px;
            box-sizing: border-box; width: 100%; border-radius: 0 0 16px 16px;
        }

        /* Score bar */
        .buscador-score-header {
            display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;
        }
        .buscador-score-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: .4px; }
        .buscador-score-num   { font-size: 20px; font-weight: 900; }
        .buscador-score-track {
            height: 4px; background: rgba(255,255,255,.08);
            border-radius: 99px; overflow: hidden; margin-bottom: 7px;
        }
        .buscador-score-fill  { height: 100%; border-radius: 99px; transition: width .5s ease; }

        /* Chips */
        .buscador-status-chip {
            display: inline-flex; align-items: center; gap: 5px;
            padding: 3px 9px; border-radius: 99px;
            font-size: 11px; font-weight: 700; letter-spacing: .2px;
        }
        .chip-green  { background: rgba(34,197,94,.18);  color: #4ade80; border: 1px solid rgba(74,222,128,.25); }
        .chip-yellow { background: rgba(234,179,8,.15);  color: #fbbf24; border: 1px solid rgba(251,191,36,.25); }
        .chip-red    { background: rgba(239,68,68,.18);  color: #f87171; border: 1px solid rgba(248,113,113,.25); }
        .chip-gray   { background: rgba(148,163,184,.10);color: #94a3b8; border: 1px solid rgba(148,163,184,.2); }

        /* Métricas */
        .buscador-metrics {
            display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 8px;
        }
        .buscador-metric {
            background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.06);
            border-radius: 7px; padding: 5px 8px; display: flex; flex-direction: column; gap: 1px;
        }
        .buscador-metric span:first-child { font-size: 8.5px; color: #64748b; text-transform: uppercase; letter-spacing: .4px; }
        .buscador-metric span:last-child  { font-size: 12px; font-weight: 700; color: #e2e8f0; }

        /* Divisor */
        .buscador-divider { border: none; border-top: 1px solid rgba(255,255,255,.07); margin: 9px 0; }

        /* Alertas */
        .buscador-alert {
            display: flex; align-items: flex-start; gap: 6px;
            border-radius: 7px; padding: 6px 9px; margin-bottom: 5px;
            font-size: 11px; font-weight: 700; line-height: 1.3;
        }
        .alert-crit {
            background: rgba(239,68,68,.12); border: 1px solid rgba(248,113,113,.25);
            color: #f87171; animation: bld 1.1s ease infinite;
        }
        .alert-warn {
            background: rgba(234,179,8,.1); border: 1px solid rgba(251,191,36,.25);
            color: #fbbf24;
        }

        /* Specs */
        .buscador-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 7px; }
        .buscador-spec  {
            background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.06);
            border-radius: 7px; padding: 5px 8px;
        }
        .buscador-spec-full { grid-column: 1 / -1; }
        .buscador-spec-label { font-size: 8.5px; color: #64748b; text-transform: uppercase; letter-spacing: .4px; }
        .buscador-spec-val   { font-size: 12px; font-weight: 700; color: #e2e8f0; margin-top: 1px; }

        /* Preço */
        .buscador-price-label { font-size: 9px; color: #3ae0c8; text-transform: uppercase; letter-spacing: .5px; font-weight: 600; }
        .buscador-price-row   { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
        .buscador-price-val   { font-size: 24px; font-weight: 900; color: #f1f5f9; letter-spacing: -.5px; }
        .buscador-price-val.small { font-size: 15px; }
        .buscador-taxa-input {
            width: 46px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.15);
            color: #e2e8f0; font-size: 10px; border-radius: 5px; padding: 3px 5px;
            text-align: center; outline: none;
        }
        .buscador-taxa-input:focus { border-color: #3ae0c8; }

        /* Botões */
        .buscador-btn {
            display: flex; align-items: center; justify-content: center; gap: 7px;
            padding: 9px 12px; border-radius: 9px; font-size: 12px; font-weight: 700;
            text-decoration: none; transition: transform .2s, filter .2s, box-shadow .2s;
            cursor: pointer; border: none; width: 100%; box-sizing: border-box;
        }
        .buscador-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .buscador-btn img   { width: 16px; height: 16px; border-radius: 4px; object-fit: cover; }

        .btn-cssbuy {
            background: linear-gradient(135deg, #10b981, #059669); color: #fff;
            box-shadow: 0 4px 14px rgba(16,185,129,.3); margin-top: 10px;
        }
        .btn-cssbuy:hover { box-shadow: 0 6px 18px rgba(16,185,129,.5); }
        .btn-github {
            background: rgba(255,255,255,.06); color: #94a3b8;
            border: 1px solid rgba(255,255,255,.09); margin-top: 6px;
        }
        .btn-github:hover { color: #e2e8f0; background: rgba(255,255,255,.1); }

        /* Rodapé */
        .buscador-footer {
            font-size: 8px; color: #334155; text-align: center;
            line-height: 1.4; margin-top: 10px;
            padding-top: 8px; border-top: 1px solid rgba(255,255,255,.05);
        }

        /* Minimizado */
        #seller-status-badge.minimized { width: 46px !important; overflow: visible; }
        #seller-status-badge.minimized #buscador-body { display: none; }
        #seller-status-badge.minimized #buscador-header {
            padding: 6px; border-radius: 12px; border-bottom: none; cursor: pointer;
        }
        #seller-status-badge.minimized #buscador-title,
        #seller-status-badge.minimized #buscador-subtitle,
        #seller-status-badge.minimized #btn-minimize { display: none; }
        #seller-status-badge.minimized #buscador-logo-wrap img {
            width: 34px; height: 34px; border-radius: 10px;
        }

        /* Descrição traduzida */
        #buscador-desc-section { margin-top: 0; }
        #buscador-desc-section hr { border: none; border-top: 1px solid rgba(255,255,255,.07); margin: 9px 0; }
        .buscador-desc-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 5px; }
        #buscador-desc-text {
            font-size: 11px; color: #cbd5e1; line-height: 1.55;
            max-height: 110px; overflow-y: auto; padding-right: 2px;
            scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.1) transparent;
        }
        #buscador-desc-text::-webkit-scrollbar { width: 3px; }
        #buscador-desc-text::-webkit-scrollbar-thumb { background: rgba(255,255,255,.12); border-radius: 99px; }

        @keyframes skel { 0%,100%{opacity:.35} 50%{opacity:.7} }
        .buscador-skeleton {
            height: 10px; border-radius: 4px; background: rgba(255,255,255,.1);
            animation: skel 1.2s ease infinite; margin-bottom: 5px;
        }
        .buscador-skeleton:last-child { width: 65%; margin-bottom: 0; }


        #btn-view-xianyu {
            position: fixed; top: 18px; left: 18px; z-index: 2147483647;
            display: flex; align-items: center; gap: 8px; background: #0f172a;
            color: #3ae0c8; padding: 10px 18px; border-radius: 10px;
            font-weight: 700; font-size: 13px; text-decoration: none;
            box-shadow: 0 8px 24px rgba(0,0,0,.45), 0 0 0 1px rgba(58,224,200,.2);
            font-family: 'Segoe UI', system-ui, sans-serif;
            transition: transform .2s, box-shadow .2s; animation: slid .3s ease both;
        }
        #btn-view-xianyu:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 28px rgba(0,0,0,.5), 0 0 0 1px rgba(58,224,200,.4);
        }
        #btn-view-xianyu img { width: 18px; height: 18px; border-radius: 5px; object-fit: cover; }
    `;
    document.head.appendChild(s);
}


// ==============================================================
//  2. UTILITÁRIOS
// ==============================================================
const debounce = (fn, ms = 350) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

const onGoofish = () => window.location.href.includes('goofish.com');
const onCSSBuy  = () => window.location.href.includes('cssbuy.com');

const qs = (...sels) => {
    for (const s of sels) {
        try { const e = document.querySelector(s); if (e) return e; } catch (_) {}
    }
    return null;
};

function toBRL(yuan) {
    return (yuan / taxa).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Converte string de tempo de membro chinesa em meses. Ex: "3年6个月前" -> 42 */
function parseMemberMonths(str) {
    if (!str) return 0;
    const anos  = str.match(/(\d+)\s*年/);
    const meses = str.match(/(\d+)\s*个?月/);
    return (anos ? parseInt(anos[1]) * 12 : 0) + (meses ? parseInt(meses[1]) : 0);
}

/**
 * Verifica se o preço está abaixo do piso esperado para o modelo.
 * Cobre iPhones, AirPods, Apple Watch, Samsung Galaxy, Xiaomi.
 */
function checkPriceFloor(yuanPrice, text) {
    if (!yuanPrice || isNaN(yuanPrice)) return null;

    const FLOOR = [
        // iPhones
        [/(?:iphone\s*|苹果\s*)?17\s*(?:pro\s*max|pm|pro\+)/i,                 5500],
        [/(?:iphone\s*|苹果\s*)?17\s*(?:pro|p)(?!\s*(?:max|m|\+))/i,           4500],
        [/(?:iphone\s*|苹果\s*)?17(?!\s*(?:pro|p|max|pm|\+|plus|air|mini))/i,  3800],
        [/(?:iphone\s*|苹果\s*)?16\s*(?:pro\s*max|pm|pro\+)/i,                 4500],
        [/(?:iphone\s*|苹果\s*)?16\s*(?:pro|p)(?!\s*(?:max|m|\+))/i,           3800],
        [/(?:iphone\s*|苹果\s*)?16(?!\s*(?:pro|p|max|pm|\+|plus|mini))/i,      3200],
        [/(?:iphone\s*|苹果\s*)?15\s*(?:pro\s*max|pm|pro\+)/i,                 3500],
        [/(?:iphone\s*|苹果\s*)?15\s*(?:pro|p)(?!\s*(?:max|m|\+))/i,           3000],
        [/(?:iphone\s*|苹果\s*)?15(?!\s*(?:pro|p|max|pm|\+|plus|mini))/i,      2400],
        [/(?:iphone\s*|苹果\s*)?14\s*(?:pro\s*max|pm|pro\+)/i,                 2800],
        [/(?:iphone\s*|苹果\s*)?14\s*(?:pro|p)(?!\s*(?:max|m|\+))/i,           2400],
        [/(?:iphone\s*|苹果\s*)?14(?!\s*(?:pro|p|max|pm|\+|plus|mini))/i,      1800],
        [/(?:iphone\s*|苹果\s*)?13\s*(?:pro\s*max|pm|pro\+)/i,                 2000],
        [/(?:iphone\s*|苹果\s*)?13\s*(?:pro|p)(?!\s*(?:max|m|\+))/i,           1700],
        [/(?:iphone\s*|苹果\s*)?13(?!\s*(?:pro|p|max|pm|\+|plus|mini))/i,      1200],
        [/(?:iphone\s*|苹果\s*)?12\s*(?:pro\s*max|pm|pro\+)/i,                 1400],
        [/(?:iphone\s*|苹果\s*)?12\s*(?:pro|p)(?!\s*(?:max|m|\+))/i,           1100],
        [/(?:iphone\s*|苹果\s*)?12(?!\s*(?:pro|p|max|pm|\+|plus|mini))/i,       900],

        // AirPods
        [/airpods\s*pro\s*2/i,   600],
        [/airpods\s*pro/i,        400],
        [/airpods\s*4/i,          350],
        [/airpods\s*3/i,          250],
        [/airpods\s*max/i,        900],

        // Apple Watch
        [/apple\s*watch\s*ultra\s*2/i,  2800],
        [/apple\s*watch\s*ultra/i,       2200],
        [/apple\s*watch\s*s9/i,           900],
        [/apple\s*watch\s*s10/i,         1100],
        [/apple\s*watch\s*se/i,           500],

        // Samsung Galaxy
        [/galaxy\s*s25\s*ultra/i,        6000],
        [/galaxy\s*s25\s*\+/i,           5000],
        [/galaxy\s*s25(?!\s*(?:\+|ultra))/i, 4200],
        [/galaxy\s*s24\s*ultra/i,        4500],
        [/galaxy\s*s24\s*\+/i,           3500],
        [/galaxy\s*s24(?!\s*(?:\+|ultra))/i, 3000],
        [/galaxy\s*z\s*fold\s*6/i,       6500],
        [/galaxy\s*z\s*flip\s*6/i,       4000],

        // Xiaomi / Redmi
        [/xiaomi\s*15\s*ultra|小米\s*15\s*ultra/i,    5500],
        [/xiaomi\s*15\s*pro|小米\s*15\s*pro/i,        4500],
        [/xiaomi\s*15(?!\s*(?:ultra|pro))|小米\s*15(?!\s*(?:ultra|pro))/i, 3500],
        [/xiaomi\s*14\s*ultra|小米\s*14\s*ultra/i,    4500],
        [/xiaomi\s*14\s*pro|小米\s*14\s*pro/i,        3500],
        [/redmi\s*note\s*14\s*pro/i,     1400],
        [/redmi\s*note\s*14(?!\s*pro)/i,  900],

        // MacBook / iPad
        [/macbook\s*pro\s*16/i,          9000],
        [/macbook\s*pro\s*14/i,          7000],
        [/macbook\s*air\s*m3/i,          5500],
        [/macbook\s*air\s*m2/i,          4500],
        [/ipad\s*pro\s*13/i,             6000],
        [/ipad\s*pro\s*11/i,             4500],
        [/ipad\s*air\s*m2/i,             3000],
        [/ipad\s*mini\s*7/i,             2500],
    ];

    for (const [pat, floor] of FLOOR) {
        if (pat.test(text) && yuanPrice < floor) {
            return `Preço suspeito para este modelo (mín. esperado ¥${floor}) MOCK de dados`;
        }
    }
    return null;
}


/**
 * Converte tempo relativo em chinês para português sem gastar quota de API.
 * Ex: "6小时前" → "6 horas atrás", "3天前" → "3 dias atrás"
 */
function traduzirTempoLocal(str) {
    if (!str) return str;
    return str
        .replace(/(\d+)\s*分钟前/, '$1 min atrás')
        .replace(/(\d+)\s*小时前/, '$1h atrás')
        .replace(/(\d+)\s*天前/,   '$1 dias atrás')
        .replace(/(\d+)\s*个月前/, '$1 meses atrás')
        .replace(/(\d+)\s*年前/,   '$1 anos atrás')
        .replace(/刚刚/,            'agora mesmo');
}

/**
 * Traduz um texto zh → pt-BR via MyMemory.
 * Limita a 450 chars para respeitar o limite da API por requisição.
 * Retorna null em caso de erro para não quebrar o badge.
 */
async function traduzir(texto) {
    if (!texto || !texto.trim()) return null;
    const truncado = texto.trim().slice(0, 450);
    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(truncado)}&langpair=zh|pt-BR`;
        const res  = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.responseStatus !== 200) return null;
        const traduzido = data.responseData?.translatedText ?? null;
        // MyMemory às vezes retorna a frase "PLEASE SELECT TWO DISTINCT LANGUAGES" quando falha silenciosamente
        if (traduzido?.includes('PLEASE SELECT')) return null;
        return traduzido;
    } catch (_) {
        return null;
    }
}

/**
 * Coleta título + descrição da página e envia em batch.
 * Retorna { titulo, descricao } ambos em pt-BR (ou null se falhar).
 * Junta os dois em uma chamada só para economizar quota.
 */
async function traduzirCampos() {
    let tituloRaw = '', descRaw = '';

    // Textos genéricos da plataforma Xianyu que não valem traduzir
    const TEXTOS_IGNORAR = [
        '促进绿色发展', '推动闲置流通', '绿色发展', '闲置流通',
        '平台公告', '用户协议', '隐私政策', '关于我们',
    ];
    const ehGenerico = (s) => TEXTOS_IGNORAR.some(t => s.includes(t));

    if (onGoofish()) {
        // Título: tenta seletores específicos, ignora textos genéricos da plataforma
        const tituloCandidatos = [
            '[class*="fishTitle"]', '[class*="itemTitle"]',
            '[class*="title--"]', 'h1',
        ];
        for (const sel of tituloCandidatos) {
            try {
                const el = document.querySelector(sel);
                const txt = el?.innerText?.trim() ?? '';
                if (txt && txt.length > 3 && !ehGenerico(txt)) {
                    tituloRaw = txt;
                    break;
                }
            } catch (_) {}
        }

        // Descrição: tenta seletores específicos do anúncio em ordem de prioridade.
        // Exclui elementos que contenham texto genérico da plataforma.
        const descCandidatos = [
            '.desc--GaIUKUQY',
            '[class*="desc--"]',
            '[class*="itemDesc"]',
            '[class*="detail--"]',
            '[class*="content--"]',
        ];
        for (const sel of descCandidatos) {
            try {
                const el = document.querySelector(sel);
                const txt = el?.innerText?.trim() ?? '';
                if (txt && txt.length > 5 && !ehGenerico(txt)) {
                    descRaw = txt;
                    break;
                }
            } catch (_) {}
        }

        // Fallback: procura o elemento mais longo com hanzi que pareça descrição de produto
        if (!descRaw) {
            const temChinese = (s) => /[\u4e00-\u9fff]/.test(s);
            // Palavras que indicam que é descrição de produto, não UI da plataforma
            const pareceDesc = (s) => /[成新|新旧|全新|二手|出售|转让|闲置|无拆|无修|电池|屏幕|配件|包邮|验货]/.test(s);
            const candidatos = [...document.querySelectorAll('p, span, div')]
                .filter(el => {
                    const t = el.innerText?.trim() ?? '';
                    return t.length > 15
                        && t.length < 600
                        && temChinese(t)
                        && !ehGenerico(t)
                        && pareceDesc(t)
                        && el.children.length < 4;
                })
                .sort((a, b) => b.innerText.length - a.innerText.length);
            descRaw = candidatos[0]?.innerText?.trim() ?? '';
        }
    }

    // Se tudo for ASCII/números (sem hanzi), não precisa traduzir
    const temChinese = (s) => /[\u4e00-\u9fff]/.test(s);
    if (!temChinese(tituloRaw) && !temChinese(descRaw)) return null;

    // Junta num único request separado por |||  para economizar quota diária
    const separador = ' ||| ';
    const batch = [
        temChinese(tituloRaw) ? tituloRaw.slice(0, 150) : '',
        temChinese(descRaw)   ? descRaw.slice(0, 280)   : '',
    ].join(separador);

    const resultado = await traduzir(batch);
    if (!resultado) return null;

    const partes = resultado.split('|||');
    return {
        titulo:   partes[0]?.trim() || null,
        descricao: partes[1]?.trim() || null,
    };
}

function makeDraggable(el, handle) {
    let ox = 0, oy = 0, dragging = false;
    handle.addEventListener('mousedown', (e) => {
        if (e.target.id === 'btn-minimize') return;
        dragging = true;
        ox = e.clientX - el.offsetLeft;
        oy = e.clientY - el.offsetTop;
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        el.style.left = Math.max(0, Math.min(window.innerWidth  - el.offsetWidth,  e.clientX - ox)) + 'px';
        el.style.top  = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, e.clientY - oy)) + 'px';
    });
    document.addEventListener('mouseup', () => { dragging = false; });
}


// ==============================================================
//  3. SCRAPING DE VENDEDOR
// ==============================================================

/** Scraping para Goofish */
function scrapeSellerGoofish() {
    const container = qs('.item-user-info-intro--ZN1A0_8Y', '[class*="userInfo"]');
    const result = {
        vendas: 0, nota: 0, respostaRate: null, tempoMembro: null,
        seloCertificado: false, interesse: null, views: null,
        numFotos: null, publicado: null,
    };

    if (container) {
        container.querySelectorAll('.item-user-info-label--NLTMHARN, [class*="userInfoLabel"]').forEach(el => {
            const txt = el.innerText.trim();
            if (txt.includes('卖出'))   result.vendas       = parseInt(txt.replace(/\D/g, '')) || 0;
            if (txt.includes('好评率')) result.nota         = parseInt(txt.replace(/\D/g, '')) || 0;
            if (txt.includes('回复率')) result.respostaRate = parseInt(txt.replace(/\D/g, '')) || null;
            if (txt.includes('加入'))   result.tempoMembro  = txt.replace('加入', '').trim();
        });
        result.seloCertificado = !![
            container.querySelector('[class*="vip"]'),
            container.querySelector('[class*="official"]'),
            container.querySelector('[class*="auth"]'),
            container.querySelector('[class*="certified"]'),
        ].find(Boolean);
    }

    const bodyText = document.body?.innerText ?? '';
    const interestM = bodyText.match(/(\d+)\s*人想要/);
    if (interestM) result.interesse = parseInt(interestM[1]);

    const viewM = bodyText.match(/(\d+)\s*(?:次浏览|浏览次数)/);
    if (viewM) result.views = parseInt(viewM[1]);

    const timeM = bodyText.match(/(\d+\s*(?:年|个月|天|小时|分钟)前|刚刚)/);
    if (timeM) result.publicado = traduzirTempoLocal(timeM[1]);

    const imgs = document.querySelectorAll(
        '[class*="imgList"] img, [class*="picSwipe"] img, [class*="itemImg"] img, [class*="carousel"] img'
    );
    if (imgs.length > 0) result.numFotos = imgs.length;

    return result;
}

function scrapeSeller() {
    return scrapeSellerGoofish();
}

/** Retorna score 0–100 + label + classe de cor. */
function calcSellerScore({ vendas, nota, respostaRate, tempoMembro, seloCertificado }) {
    if (seloCertificado && vendas > 500) {
        return { score: 100, label: '✦ Loja Oficial', cls: 'chip-green' };
    }

    let score = 0;

    // Nota (0–40 pts)
    if      (nota >= 100) score += 40;
    else if (nota >= 99)  score += 35;
    else if (nota >= 98)  score += 28;
    else if (nota >= 95)  score += 18;
    else if (nota >= 90)  score += 8;

    // Vendas (0–30 pts)
    if      (vendas >= 10000) score += 30;
    else if (vendas >= 1000)  score += 25;
    else if (vendas >= 500)   score += 20;
    else if (vendas >= 100)   score += 15;
    else if (vendas >= 30)    score += 10;
    else if (vendas >= 5)     score += 4;

    // Taxa de resposta (0–15 pts) — mais comum no Goofish
    if (respostaRate !== null) {
        if      (respostaRate >= 95) score += 15;
        else if (respostaRate >= 80) score += 10;
        else if (respostaRate >= 60) score += 5;
    } else {
        score += 7; // neutro
    }

    // Tempo de membro (0–15 pts)
    const meses = parseMemberMonths(tempoMembro);
    if      (meses >= 48) score += 15;
    else if (meses >= 24) score += 12;
    else if (meses >= 12) score += 8;
    else if (meses >= 6)  score += 4;
    else if (meses === 0) score += 5; // neutro

    if (nota > 0 && nota <= 90) score = Math.min(score, 20);
    if (vendas === 0 && nota === 0) score = Math.min(score, 30);

    score = Math.min(100, Math.max(0, score));

    let label, cls;
    if      (score >= 80) { label = '✅ Confiável'; cls = 'chip-green';  }
    else if (score >= 60) { label = '🟡 Mediano';   cls = 'chip-yellow'; }
    else if (score >= 35) { label = '⚠️ Cautela';   cls = 'chip-yellow'; }
    else                  { label = '🔴 Perigoso';  cls = 'chip-red';    }

    return { score, label, cls };
}


// ==============================================================
//  4. ANÁLISE DE PRODUTO (genérica + Apple + Android)
// ==============================================================
function getFullText() {
    const desc   = qs('.desc--GaIUKUQY', '[class*="desc--"]');
    const labels = document.querySelector('.labels--ndhPFgp8');
    const title  = qs('[class*="title--"]', 'h1');
    return `${title?.innerText ?? ''} ${desc?.innerText ?? ''} ${labels?.innerText ?? ''}`;
}

function scrapeProduct() {
    const fullText = getFullText().toLowerCase();

    const isIphone  = /iphone|promax|pro\s*max/i.test(fullText);
    const isAndroid = /galaxy|xiaomi|小米|redmi|oppo|vivo|oneplus|huawei|华为/i.test(fullText);
    const isWatch   = /apple\s*watch|galaxy\s*watch|watch\s*ultra/i.test(fullText);
    const isAirpods = /airpods|耳机/i.test(fullText);
    const isMac     = /macbook|imac|mac\s*mini|mac\s*pro/i.test(fullText);
    const isIpad    = /\bipad\b/i.test(fullText);

    // Riscos críticos 
    const noMDMText   = fullText.replace(/无\s*mdm|没有\s*mdm|非\s*监管|无\s*监管|无\s*配置锁|不带\s*监管/gi, '');
    const noLockText  = fullText.replace(/无锁|没有锁|非卡贴/gi, '');
    const noIcloudText= fullText.replace(/无激活锁|无icloud锁|无\s*id\s*锁/gi, '');
    const noWaterText = fullText.replace(/无进水|没进水|未进水/gi, '');

    const hasMDM    = /mdm|监管|绕过|bypass|enterprise|配置锁|管理锁/i.test(noMDMText);
    const hasLock   = /(?:有锁|卡贴|网络锁|外版有锁)/i.test(noLockText);
    const hasParts  = (isIphone || isMac || isIpad) &&
        /(?:换|更换)[过了]?(?:国产)?(?:屏幕?|电池|后壳|外屏|内屏|后盖)|国产屏|有维修|维修过|非原装/i.test(fullText);
    const hasDefect = (isIphone || isIpad) &&
        /(?:无|坏|失效)(?:面容|指纹|摄像头)|不能插卡|无卡槽/i.test(fullText);
    const hasIcloud = /激活锁|icloud锁/i.test(noIcloudText);
    const hasWater  = /进水/.test(noWaterText);
    const telaCracked = /碎屏|屏裂|碎了/.test(fullText);

    // RAM / ROM (smartphones + notebooks) ─
    let ram = 'N/A', rom = 'N/A';

    const IPHONE_RAM = [
        [/iphone\s*17\s*pro\s*(max|\+)/i,                          '12GB'],
        [/iphone\s*17\s*(pro|plus|air)/i,                           '8GB'],
        [/iphone\s*17(?!\s*(pro|plus|air))/i,                       '8GB'],
        [/iphone\s*16\s*pro/i,                                       '8GB'],
        [/iphone\s*16/i,                                             '8GB'],
        [/iphone\s*15\s*pro/i,                                       '8GB'],
        [/iphone\s*15/i,                                             '6GB'],
        [/iphone\s*14\s*pro/i,                                       '6GB'],
        [/iphone\s*14/i,                                             '6GB'],
        [/iphone\s*13\s*pro/i,                                       '6GB'],
        [/iphone\s*13\s*mini/i,                                      '4GB'],
        [/iphone\s*13(?!\s*(pro|mini))/i,                            '4GB'],
        [/iphone\s*12\s*pro/i,                                       '6GB'],
        [/iphone\s*12\s*mini/i,                                      '4GB'],
        [/iphone\s*12(?!\s*(pro|mini))/i,                            '4GB'],
        [/iphone\s*11\s*pro/i,                                       '6GB'],
        [/iphone\s*11(?!\s*pro)/i,                                   '4GB'],
    ];

    const ANDROID_RAM = [
        [/galaxy\s*s25\s*ultra/i,       '12GB'],
        [/galaxy\s*s25\s*\+/i,          '12GB'],
        [/galaxy\s*s25(?!\s*(?:\+|ultra))/i, '12GB'],
        [/galaxy\s*s24\s*ultra/i,       '12GB'],
        [/galaxy\s*s24\s*\+/i,           '8GB'],
        [/galaxy\s*s24(?!\s*(?:\+|ultra))/i, '8GB'],
        [/galaxy\s*z\s*fold\s*6/i,      '12GB'],
        [/galaxy\s*z\s*flip\s*6/i,       '8GB'],
        [/xiaomi\s*15\s*ultra|小米\s*15\s*ultra/i, '16GB'],
        [/xiaomi\s*15\s*pro|小米\s*15\s*pro/i,     '16GB'],
        [/xiaomi\s*15|小米\s*15/i,                  '12GB'],
        [/xiaomi\s*14\s*ultra|小米\s*14\s*ultra/i, '16GB'],
        [/xiaomi\s*14\s*pro|小米\s*14\s*pro/i,     '12GB'],
        [/xiaomi\s*14|小米\s*14/i,                  '12GB'],
        [/redmi\s*note\s*14\s*pro/i,     '12GB'],
        [/redmi\s*note\s*14(?!\s*pro)/i,  '8GB'],
        [/oneplus\s*13/i,               '12GB'],
        [/oneplus\s*12/i,               '12GB'],
        [/huawei\s*mate\s*70\s*pro/i,   '16GB'],
        [/huawei\s*mate\s*70/i,         '12GB'],
        [/oppo\s*find\s*x8\s*pro/i,     '16GB'],
        [/oppo\s*find\s*x8/i,           '12GB'],
        [/vivo\s*x200\s*pro/i,          '16GB'],
        [/vivo\s*x200/i,                '12GB'],
    ];

    // Tenta detectar "RAM + ROM" explícito no texto (ex: "8+256GB", "16+512G")
    const plusMatch = fullText.match(/(\d{1,2})\s*\+\s*(\d{1,4})(gb|tb|g|t)?/i);
    if (plusMatch && parseInt(plusMatch[1]) <= 64) {
        ram = `${plusMatch[1]}GB`;
        const v = parseInt(plusMatch[2]);
        rom = `${v}${(/t/i.test(plusMatch[3] ?? '') || v <= 4) ? 'TB' : 'GB'}`;
    } else {
        const caps = [...(fullText.matchAll(/(\d+)\s*(gb|tb|g|t)(?![a-z])/gi))]
            .map(m => {
                const n = parseInt(m[1]);
                const tb = /t/i.test(m[2]);
                return { text: `${n}${tb ? 'TB' : 'GB'}`, v: n * (tb ? 1024 : 1) };
            })
            .filter(x => x.v !== 5); // filtra "5G" de conectividade

        const unique = [...new Map(caps.map(x => [x.v, x])).values()].sort((a, b) => a.v - b.v);
        if (unique.length >= 2) {
            ram = unique[0].text;
            rom = unique.at(-1).text;
        } else if (unique.length === 1) {
            unique[0].v <= 32 ? (ram = unique[0].text) : (rom = unique[0].text);
        }
    }

    // Fallback por modelo conhecido
    if (ram === 'N/A') {
        const lookup = isIphone ? IPHONE_RAM : (isAndroid ? ANDROID_RAM : []);
        for (const [pat, knownRam] of lookup) {
            if (pat.test(fullText)) { ram = `~${knownRam} ★`; break; }
        }
    }

    // Bateria ─
    let bateria = 'N/A';

    // Capacidade em mAh (Android, notebooks)
    const mAhM = fullText.match(/(\d{4,5})\s*mah/i);
    if (mAhM) {
        bateria = `${mAhM[1]} mAh`;
    } else {
        // Saúde em % (iPhone, Apple Watch)
        const batPatterns = [
            /(?:健康|容量|寿命|效率)[^\d]{0,10}?(\d{2,3})/g,
            /电池[^\d]{0,20}?(\d{2,3})\s?%/g,
            /(\d{2,3})\s?%/g,
        ];
        outer: for (const pat of batPatterns) {
            for (const m of fullText.matchAll(pat)) {
                if (m[0].includes('循环')) continue;
                const v = parseInt(m[1]);
                if (v > 0 && v <= 100) { bateria = `${v}%`; break outer; }
            }
        }
    }

    // Estado físico 
    const isLacrado = /未拆封|未开封|原封未拆|全新未拆|原封|盒封/.test(fullText);
    const isIntegro = fullText.includes('无拆');
    const estado    = isLacrado ? '✅ Lacrado' : isIntegro ? '🔧 Íntegro' : '— N/D';

    // Chip / SoC ─
    let chip = 'N/A';
    const CHIPS = [
        // Apple
        [/a19\s*pro/i,  'A19 Pro'], [/\ba19\b/i, 'A19'],
        [/a18\s*pro/i,  'A18 Pro'], [/\ba18\b/i, 'A18'],
        [/a17\s*pro/i,  'A17 Pro'], [/\ba17\b/i, 'A17'],
        [/\ba16\b/i,    'A16'],     [/\ba15\b/i, 'A15'],
        [/\ba14\b/i,    'A14'],     [/\ba13\b/i, 'A13'],
        [/m4\s*pro/i,   'M4 Pro'],  [/m4\s*max/i, 'M4 Max'], [/\bm4\b/i, 'M4'],
        [/m3\s*pro/i,   'M3 Pro'],  [/m3\s*max/i, 'M3 Max'], [/\bm3\b/i, 'M3'],
        [/m2\s*pro/i,   'M2 Pro'],  [/m2\s*max/i, 'M2 Max'], [/\bm2\b/i, 'M2'],
        [/\bm1\b/i,     'M1'],
        // Qualcomm
        [/snapdragon\s*8\s*elite|骁龙\s*8\s*elite/i,  'Snap 8 Elite'],
        [/snapdragon\s*8\s*gen\s*4|骁龙\s*8\s*gen\s*4/i, 'Snap 8 Gen4'],
        [/snapdragon\s*8\s*gen\s*3|骁龙\s*8\s*gen\s*3/i, 'Snap 8 Gen3'],
        [/snapdragon\s*8\s*gen\s*2|骁龙\s*8\s*gen\s*2/i, 'Snap 8 Gen2'],
        // MediaTek
        [/天玑\s*9[3-9]\d{2}|dimensity\s*9[3-9]\d{2}/i, 'Dimensity 9k+'],
        [/天玑\s*9\d{3}|dimensity\s*9\d{3}/i,            'Dimensity 9k'],
        [/天玑\s*8\d{3}|dimensity\s*8\d{3}/i,            'Dimensity 8k'],
        // Huawei
        [/麒麟\s*9\d{3}|kirin\s*9\d{3}/i, 'Kirin 9k'],
        [/麒麟|kirin/i,                    'Kirin'],
        // Samsung
        [/exynos\s*24\d{2}/i, 'Exynos 2400'],
        [/exynos/i,           'Exynos'],
        // Intel
        [/intel\s*core\s*ultra/i, 'Core Ultra'],
        [/intel\s*i9/i, 'Intel i9'],
        [/intel\s*i7/i, 'Intel i7'],
        [/intel\s*i5/i, 'Intel i5'],
        // AMD
        [/ryzen\s*9/i, 'Ryzen 9'],
        [/ryzen\s*7/i, 'Ryzen 7'],
        [/ryzen\s*5/i, 'Ryzen 5'],
    ];
    for (const [pat, val] of CHIPS) {
        if (pat.test(fullText)) { chip = val; break; }
    }

    // Garantia ─
    let garantia = 'N/D';
    const mesesGarantia = fullText.match(/保修[^\d]{0,5}(\d+)\s*个月/);
    if (/无保修|过保|已过保/i.test(fullText))
        garantia = '❌ Sem garantia';
    else if (mesesGarantia)
        garantia = `✅ ${mesesGarantia[1]}m restantes`;
    else if (/官方保修|苹果保修|保修中|applecare|在保/i.test(fullText))
        garantia = '✅ Em garantia';

    // Versão regional 
    let versaoRegional = 'N/D';
    const REGIOES = [
        [/国行|大陆行货/,  '🇨🇳 国行 (CN)'],
        [/港版|港行/,      '🇭🇰 港版 (HK)'],
        [/日版|日行/,      '🇯🇵 日版 ⚠️'],
        [/美版|美行/,      '🇺🇸 美版 (US)'],
        [/韩版|韩行/,      '🇰🇷 韩版 (KR)'],
        [/国际版/,         '🌐 Internacional'],
        [/欧版|欧行/,      '🇪🇺 Euro (EU)'],
        [/台版|台湾/,      '🇹🇼 Taiwan'],
    ];
    for (const [pat, label] of REGIOES) {
        if (pat.test(fullText)) { versaoRegional = label; break; }
    }

    // Condição da tela ─
    let tela = 'N/D';
    if      (telaCracked)                                   tela = '💔 Trincada';
    else if (/有划痕|多划痕/i.test(fullText))                tela = '⚠️ Arranhões';
    else if (/无划痕|屏幕完好|屏幕正常/i.test(fullText))    tela = '✅ Sem marcas';

    // Cor 
    let cor = 'N/D';
    const CORES = [
        [/黑色|午夜色|曜石黑|幻夜黑/,   '⬛ Preto'],
        [/白色|星光色|陶瓷白|月光银/,   '⬜ Branco'],
        [/钛金属|钛色|自然色/,           '🩶 Titânio'],
        [/深蓝|午夜蓝|星空蓝|幻影蓝/,   '🔵 Azul Escuro'],
        [/蓝色|蓝/,                      '🔵 Azul'],
        [/紫色|薰衣草紫|星紫/,           '🟣 Roxo'],
        [/粉色|玫瑰/,                    '🩷 Rosa'],
        [/红色|产品红/,                  '🔴 Vermelho'],
        [/绿色|翠绿|军绿/,               '🟢 Verde'],
        [/金色|香槟金|土豪金/,           '🟡 Dourado'],
        [/银色|银/,                      '🩶 Prata'],
        [/橙色|暗橙/,                    '🟠 Laranja'],
        [/黄色|奶油色/,                  '🟡 Amarelo'],
    ];
    for (const [pat, val] of CORES) {
        if (pat.test(fullText)) { cor = val; break; }
    }

    // Conectividade 
    let conectividade = 'N/D';
    const has5G = /\b5g\b/i.test(fullText);
    const hasWifi6e = /wi.fi\s*6e|wifi\s*6e/i.test(fullText);
    const hasWifi7  = /wi.fi\s*7|wifi\s*7/i.test(fullText);
    if      (hasWifi7)  conectividade = '📶 5G + Wi-Fi 7';
    else if (hasWifi6e) conectividade = '📶 5G + Wi-Fi 6E';
    else if (has5G)     conectividade = '📶 5G';

    // Ciclos de bateria (notebooks/watches) ─
    let ciclos = 'N/D';
    const cicloM = fullText.match(/(?:循环|充放电|cycle)[^\d]{0,5}(\d+)/i);
    if (cicloM) ciclos = `${cicloM[1]} ciclos`;

    return {
        hasMDM, hasLock, hasParts, hasDefect, hasIcloud, hasWater, telaCracked,
        ram, rom, bateria, estado, chip, garantia, versaoRegional, tela,
        cor, conectividade, ciclos,
        // flags de categoria (usadas para filtrar specs irrelevantes)
        isIphone, isAndroid, isWatch, isAirpods, isMac, isIpad,
    };
}


// ==============================================================
//  5. BADGE GENÉRICO (Goofish + Taobao)
// ==============================================================
function getPriceEl() {
    return qs('[class*="priceText--"]', '[class*="price--"]', '.price--OEWLbcxC');
}

function buildBadge() {
    if (document.getElementById('seller-status-badge')) return;

    const seller  = scrapeSeller();
    const product = scrapeProduct();
    const score   = calcSellerScore(seller);

    const scoreColor = score.score >= 75 ? '#4ade80' : score.score >= 45 ? '#fbbf24' : '#f87171';

    const itemID    = new URLSearchParams(window.location.search).get('id');
    const cssbuyURL = itemID
        ? `https://www.cssbuy.com/item-xianyu-${itemID}.html?promotionCode=${PROMO_CODE}`
        : null;

    // Preço
    const rawPrice   = getPriceEl();
    const priceRaw   = rawPrice?.innerText.replace(/¥|￥|元/g, '').trim() ?? '';
    let priceDisplay = '', yuanVal = NaN;

    if (priceRaw.includes('-')) {
        const [a, b] = priceRaw.split('-').map(p => parseFloat(p.replace(/[^\d.]/g, '')));
        priceDisplay = `${toBRL(a)} – ${toBRL(b)}`;
        yuanVal = a;
    } else {
        yuanVal = parseFloat(priceRaw.replace(/[^\d.]/g, ''));
        if (!isNaN(yuanVal)) priceDisplay = toBRL(yuanVal);
    }

    const fullText    = getFullText().toLowerCase();
    const precoAlerta = checkPriceFloor(yuanVal, fullText);

    // Alertas críticos 
    const alerts = [
        product.hasIcloud   && { cls: 'alert-crit', icon: '🔐', msg: 'iCloud Lock — aparelho não ativa sem conta do dono anterior' },
        product.hasMDM      && { cls: 'alert-crit', icon: '🔒', msg: 'MDM Detectado — gerenciamento remoto ativo'                  },
        product.hasLock     && { cls: 'alert-crit', icon: '🚫', msg: 'Bloqueio de rede — não funciona no Brasil'                   },
        product.hasParts    && { cls: 'alert-crit', icon: '🔧', msg: 'Peças trocadas — pode afetar garantia e funções'             },
        product.hasDefect   && { cls: 'alert-crit', icon: '⚡', msg: 'Defeito detectado (Face ID / câmera / chip)'                 },
        product.hasWater    && { cls: 'alert-crit', icon: '💧', msg: 'Histórico de contato com água'                               },
        product.telaCracked && { cls: 'alert-crit', icon: '💔', msg: 'Tela trincada ou quebrada'                                   },
        precoAlerta         && { cls: 'alert-warn',  icon: '⚠️', msg: precoAlerta                                                  },
    ].filter(Boolean);

    // Métricas extras do vendedor ─
    const extraMetrics = [
        seller.respostaRate  != null && `<div class="buscador-metric"><span>Resposta</span><span>${seller.respostaRate}%</span></div>`,
        seller.tempoMembro           && `<div class="buscador-metric"><span>Membro há</span><span>${seller.tempoMembro}</span></div>`,
        seller.loja                  && `<div class="buscador-metric" style="grid-column:1/-1"><span>Loja</span><span>${seller.loja}</span></div>`,
        seller.numAvaliacoes         && `<div class="buscador-metric"><span>Avaliações</span><span>${seller.numAvaliacoes}</span></div>`,
        seller.interesse    != null  && `<div class="buscador-metric"><span>Favoritos</span><span>${seller.interesse}</span></div>`,
        seller.views        != null  && `<div class="buscador-metric"><span>Views</span><span>${seller.views}</span></div>`,
        seller.numFotos     != null  && `<div class="buscador-metric"><span>Fotos</span><span>${seller.numFotos}</span></div>`,
        seller.publicado             && `<div class="buscador-metric"><span>Publicado</span><span>${seller.publicado}</span></div>`,
        seller.seloCertificado       && `<div class="buscador-metric" style="grid-column:1/-1"><span>Selo</span><span>✦ Certificado</span></div>`,
    ].filter(Boolean).join('');

    // Specs — filtra por categoria 
    const { isIphone, isAndroid, isMac, isIpad, isWatch, isAirpods } = product;
    const isPhone = isIphone || isAndroid;

    const specData = [
        isPhone                           && { label: 'RAM',          val: product.ram            },
        isPhone || isMac || isIpad        && { label: 'Armazenamento', val: product.rom            },
        !isAirpods                        && { label: 'Chip',          val: product.chip           },
        !isAirpods                        && { label: 'Bateria',       val: product.bateria        },
        product.ciclos !== 'N/D'          && { label: 'Ciclos bat.',   val: product.ciclos         },
                                             { label: 'Estado',        val: product.estado         },
                                             { label: 'Garantia',      val: product.garantia       },
                                             { label: 'Versão',        val: product.versaoRegional },
        !isAirpods                        && { label: 'Tela',          val: product.tela           },
                                             { label: 'Cor',           val: product.cor            },
        (isPhone || isMac)                && { label: 'Conectividade', val: product.conectividade  },
    ]
    .filter(s => s && s.val && s.val !== 'N/A' && s.val !== 'N/D' && s.val !== '— N/D')
    .map(s => s); // remove booleanos falsy

    const specsHTML = specData.length ? `
        <hr class="buscador-divider">
        <div class="buscador-specs">
            ${specData.map(s => `
                <div class="buscador-spec">
                    <div class="buscador-spec-label">${s.label}</div>
                    <div class="buscador-spec-val">${s.val}</div>
                </div>`).join('')}
        </div>` : '';

    const badge = document.createElement('div');
    badge.id = 'seller-status-badge';

    badge.innerHTML = `
        <div id="buscador-header">
            <div id="buscador-logo-wrap">
                <img src="${LOGO_URL}" alt="Logo">
                <div>
                    <div id="buscador-title">Buscador</div>
                    <div id="buscador-subtitle">Xianyu Helper</div>
                </div>
            </div>
            <button id="btn-minimize" title="Minimizar">─</button>
        </div>

        <div id="buscador-body">

            <!-- Score -->
            <div class="buscador-score-header">
                <span class="buscador-score-label">Confiança do vendedor</span>
                <span class="buscador-score-num" style="color:${scoreColor}">${score.score}</span>
            </div>
            <div class="buscador-score-track">
                <div class="buscador-score-fill" style="width:${score.score}%;background:${scoreColor}"></div>
            </div>
            <span class="buscador-status-chip ${score.cls}">${score.label}</span>

            <!-- Métricas do vendedor -->
            <div class="buscador-metrics">
                <div class="buscador-metric">
                    <span>Vendas</span>
                    <span>${seller.vendas ? seller.vendas.toLocaleString('pt-BR') : 'N/D'}</span>
                </div>
                <div class="buscador-metric">
                    <span>Avaliação</span>
                    <span>${seller.nota ? seller.nota + '%' : 'N/D'}</span>
                </div>
                ${extraMetrics}
            </div>

            <!-- Alertas -->
            ${alerts.length ? `
            <hr class="buscador-divider">
            ${alerts.map(a => `<div class="buscador-alert ${a.cls}">${a.icon} ${a.msg}</div>`).join('')}
            ` : ''}

            <!-- Specs do produto -->
            ${specsHTML}

            <!-- Preço -->
            ${priceDisplay ? `
            <hr class="buscador-divider">
            <div class="buscador-price-label">Valor em R$</div>
            <div class="buscador-price-row">
                <div class="buscador-price-val ${priceDisplay.length > 16 ? 'small' : ''}">${priceDisplay}</div>
                <input id="taxa-input" class="buscador-taxa-input" type="number"
                    step="0.01" min="0.1" value="${taxa}" title="Yuan por Real">
            </div>
            <div style="font-size:8.5px;color:#475569;margin-top:2px;">Taxa: 1 R$ = ${taxa} ¥ &nbsp;(editável)</div>
            ` : ''}

            <!-- Descrição traduzida -->
            <div id="buscador-desc-section">
                <hr class="buscador-divider">
                <div class="buscador-desc-label">Descrição (traduzindo...)</div>
                <div id="buscador-desc-text">
                    <div class="buscador-skeleton" style="width:90%"></div>
                    <div class="buscador-skeleton" style="width:80%"></div>
                    <div class="buscador-skeleton"></div>
                </div>
            </div>

            <!-- Botões -->
            ${cssbuyURL ? `
            <a href="${cssbuyURL}" target="_blank" class="buscador-btn btn-cssbuy">
                <img src="https://play-lh.googleusercontent.com/uAl9_SpJwURdKGEoRgHSEQ-CAbegLmPx6dNzWBbqZJMkoGsa9Ta4i5M495NycimTKsw" alt="">
                Comprar via CSSBuy
            </a>` : ''}

            <a href="${GITHUB_URL}" target="_blank" class="buscador-btn btn-github">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Zet no GitHub
            </a>

            <div class="buscador-footer">
                Análise técnica — não constitui recomendação de compra<br>
                Buscador © 2026 Gabriel-zet
            </div>
        </div>
    `;

    document.body.appendChild(badge);

    // Tradução assíncrona — atualiza após renderizar 
    traduzirCampos().then((tr) => {
        const secao  = badge.querySelector('#buscador-desc-section');
        const label  = secao?.querySelector('.buscador-desc-label');
        const textEl = badge.querySelector('#buscador-desc-text');
        if (!textEl) return;

        if (!tr || (!tr.titulo && !tr.descricao)) {
            // Sem conteúdo chinês ou falha na API — esconde a seção
            if (secao) secao.style.display = 'none';
            return;
        }

        if (label) label.textContent = 'Descrição';

        const partes = [];
        if (tr.titulo)    partes.push(`<strong style="color:#e2e8f0;display:block;margin-bottom:3px">${tr.titulo}</strong>`);
        if (tr.descricao) partes.push(`<span>${tr.descricao}</span>`);
        textEl.innerHTML = partes.join('');
    });

    const toggle = () => badge.classList.toggle('minimized');
    badge.querySelector('#btn-minimize').addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    badge.querySelector('#buscador-logo-wrap').addEventListener('click', () => {
        if (badge.classList.contains('minimized')) toggle();
    });
    makeDraggable(badge, badge.querySelector('#buscador-header'));

    const taxaInput = badge.querySelector('#taxa-input');
    if (taxaInput) {
        taxaInput.addEventListener('change', () => {
            const v = parseFloat(taxaInput.value);
            if (!isNaN(v) && v > 0) {
                taxa = v;
                localStorage.setItem(STORAGE_KEY, taxa);
                refreshPrice(badge);
            }
        });
    }
}

function refreshPrice(badge) {
    const rawEl = getPriceEl();
    if (!rawEl) return;
    const priceRaw = rawEl.innerText.replace(/¥|￥|元/g, '').trim();
    let display = '';
    if (priceRaw.includes('-')) {
        const [a, b] = priceRaw.split('-').map(p => parseFloat(p.replace(/[^\d.]/g, '')));
        display = `${toBRL(a)} – ${toBRL(b)}`;
    } else {
        const v = parseFloat(priceRaw.replace(/[^\d.]/g, ''));
        if (!isNaN(v)) display = toBRL(v);
    }
    const el = badge.querySelector('.buscador-price-val');
    if (el && display) el.textContent = display;
    const taxaLbl = badge.querySelector('div[style*="Taxa:"]');
    if (taxaLbl) taxaLbl.textContent = `Taxa: 1 R$ = ${taxa} ¥  (editável)`;
}


// ==============================================================
//  6. MÓDULO CSSBUY
// ==============================================================
function handleCSSBuy() {
    if (!onCSSBuy() || initialized.cssbuy) return;
    const itemID = new URLSearchParams(window.location.search).get('item-xianyu')
                ?? window.location.href.match(/item-xianyu-(\d+)/)?.[1];
    if (!itemID || document.getElementById('btn-view-xianyu')) return;

    // Injeta estilo próprio — injectStyles() não roda na CSSBuy
    if (!document.getElementById('buscador-cssbuy-style')) {
        const s = document.createElement('style');
        s.id = 'buscador-cssbuy-style';
        s.textContent = `
            @keyframes slid { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
            #btn-view-xianyu {
                position: fixed; top: 18px; left: 18px; z-index: 2147483647;
                display: flex; align-items: center; gap: 8px; background: #0f172a;
                color: #3ae0c8; padding: 10px 18px; border-radius: 10px;
                font-weight: 700; font-size: 13px; text-decoration: none;
                box-shadow: 0 8px 24px rgba(0,0,0,.45), 0 0 0 1px rgba(58,224,200,.2);
                font-family: 'Segoe UI', system-ui, sans-serif;
                transition: transform .2s, box-shadow .2s; animation: slid .3s ease both;
            }
            #btn-view-xianyu:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 28px rgba(0,0,0,.5), 0 0 0 1px rgba(58,224,200,.4);
            }
            #btn-view-xianyu img { width: 18px; height: 18px; border-radius: 5px; object-fit: cover; }
        `;
        document.head.appendChild(s);
    }

    const btn = document.createElement('a');
    btn.id        = 'btn-view-xianyu';
    btn.href      = `https://www.goofish.com/item?id=${itemID}`;
    btn.target    = '_blank';
    btn.innerHTML = `<img src="${LOGO_URL}" alt=""> Ver original na Xianyu`;
    document.body.appendChild(btn);
    initialized.cssbuy = true;
}


// ==============================================================
//  7. INICIALIZAÇÃO
// ==============================================================
function main() {
    if (onCSSBuy() && !initialized.cssbuy) {
        handleCSSBuy();
    }

    if (onGoofish() && !initialized.goofish) {
        injectStyles();
        if (!document.querySelector('.item-user-info-intro--ZN1A0_8Y')) return;
        buildBadge();
        initialized.goofish = true;
    }

    const done = (onGoofish() && initialized.goofish)
              || (onCSSBuy()  && initialized.cssbuy);

    if (done) observer?.disconnect();
}

const debouncedMain = debounce(main, 300);
observer = new MutationObserver(debouncedMain);
observer.observe(document.documentElement, { childList: true, subtree: true });
setTimeout(main, 900);