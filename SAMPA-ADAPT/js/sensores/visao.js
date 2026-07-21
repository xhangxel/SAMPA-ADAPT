let timerVisao;

function inicializarSensorVisao(elementosAlvo) {
    console.log(`SAMPA-ADAPT: Sensor de Visão acoplado a ${elementosAlvo.length} blocos do formulário.`);

    // Varre todos os blocos (instruções e campos) adicionando o ouvinte
    elementosAlvo.forEach(bloco => {
        // Ignora controles de formulário e elementos interativos — apenas ativa em blocos de texto
        const tag = bloco.tagName ? bloco.tagName.toLowerCase() : '';
        if (["input", "textarea", "select", "button", "a"].includes(tag)) return;
        if (bloco.matches && bloco.matches('[contenteditable="true"]')) return;

        bloco.addEventListener("mouseenter", () => {
            console.log("SAMPA-ADAPT (Telemetria): Foco visual detectado em um bloco. Aguardando 10 segundos...");
            timerVisao = setTimeout(() => {
                dispararMelhoriaVisibilidadeGlobal();
            }, 10000); // 10 segundos parado aciona a acessibilidade global
        });

        bloco.addEventListener("mouseleave", () => {
            clearTimeout(timerVisao);
        });
    });
}

function dispararMelhoriaVisibilidadeGlobal() {
    if (!ConfiguracaoSensores.visao) return;
    
    // Se o formulário já estiver em alto contraste, ignora
    const formulario = document.querySelector("form");
    if (formulario && formulario.classList.contains("adapt-leitura-ampliada")) return;

    console.log("SAMPA-ADAPT (Adaptação): Fixação prolongada confirmada. Ativando Modo Alto Contraste Global.");
    
    // Aplica o Alto Contraste no formulário inteiro e no bloco de instruções
    if (formulario) formulario.classList.add("adapt-leitura-ampliada");
    
    const blocoInfo = document.querySelector(".instrucoes-servico");
    if (blocoInfo) blocoInfo.classList.add("adapt-leitura-ampliada");


}