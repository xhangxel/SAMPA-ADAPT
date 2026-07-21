let timerHesitacao;

function iniciarMonitoramentoHesitacao(elemento) {
    clearTimeout(timerHesitacao);

    if (!elemento || typeof elemento.value === "undefined") return;

    // Se o campo já estiver preenchido, não precisa monitorar hesitação inicial
    if (elemento.value.length > 0) return;

    // Define o tempo limite de hesitação
    timerHesitacao = setTimeout(() => {
        // Verifica se o usuário continua no mesmo campo e ele continua vazio
        if (document.activeElement === elemento && elemento.value.length === 0) {
            dispararAjudaHesitacao(elemento);
        }
    }, 10000);
}

function dispararAjudaHesitacao(elemento) {
    console.warn(`SAMPA-ADAPT: Hesitação detectada no campo: ${elemento.name || elemento.id}`);
    
    // Adaptação autônoma: Adiciona uma classe CSS de destaque ou exibe uma dica interna
    elemento.classList.add("adapt-campo-hesitado");
    
    // Cria um balão de ajuda dinâmico temporário próximo ao elemento
    exibirTooltipAdaptativo(elemento);
}
