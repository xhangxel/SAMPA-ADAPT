const scripts = [
    "./SAMPA-ADAPT/js/sensores/hesitacao.js",
    "./SAMPA-ADAPT/js/sensores/frustracao.js",
    "./SAMPA-ADAPT/js/sensores/fadiga.js",
    "./SAMPA-ADAPT/js/sensores/rolagem.js",
    "./SAMPA-ADAPT/js/sensores/retorno.js",
    "./SAMPA-ADAPT/js/sensores/visao.js",
    "./SAMPA-ADAPT/js/main.js"
];

scripts.forEach(src => {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
});