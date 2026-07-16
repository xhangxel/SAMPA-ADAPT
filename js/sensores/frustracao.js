function monitorarFrustracaoDigitacao(elemento, evento) {
    // Somente considera a tecla Backspace como indicador de frustração
    if (evento.key !== "Backspace") return;

    const campoNome = elemento.name;

    // Inicializa a contagem para este campo se não existir
    if (!PerfilCognitivoTemporario.frustracao[campoNome]) {
        PerfilCognitivoTemporario.frustracao[campoNome] = 0;
    }

    // Incrementa o contador de erros para este campo específico
    PerfilCognitivoTemporario.frustracao[campoNome]++;

    console.log(`SAMPA-ADAPT: Frustração detectada no campo [${campoNome}]. Total: ${PerfilCognitivoTemporario.frustracao[campoNome]}`);

    // Limite de frustração: 3 apagadas ativa o Modo Assistido
    if (PerfilCognitivoTemporario.frustracao[campoNome] >= 3) {
        dispararModoAssistido(elemento);
    }
}

function dispararModoAssistido(elemento) {
    if (elemento.classList.contains("adapt-modo-assistido")) return;

    console.warn(`SAMPA-ADAPT: Alto índice de frustração detectado no campo: ${elemento.name}`);

    // Aplica a classe visual que expande e destaca o campo
    elemento.classList.add("adapt-modo-assistido");

    // Procura se já existe um balão de ajuda amarelo na tela
    const tooltipExistente = elemento.parentNode.querySelector('.adapt-tooltip');
    if (tooltipExistente) {
        tooltipExistente.style.borderLeftColor = '#007bff';
        tooltipExistente.style.background = '#e3f2fd';
        tooltipExistente.style.color = '#004085';
    }
}