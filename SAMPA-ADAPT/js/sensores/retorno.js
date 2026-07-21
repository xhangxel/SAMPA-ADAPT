function monitorarMudancaVisibilidade() {
    const info = PerfilCognitivoTemporario.retorno;
    const agora = Date.now();

    if (document.hidden) {
        // Usuário acabou de sair da aba
        info.ultimaSaida = agora;
    } else {
        // Usuário acabou de retornar para a aba
        if (info.ultimaSaida > 0) {
            const tempoAusenteSegundos = Math.floor((agora - info.ultimaSaida) / 1000);
            console.log(`SAMPA-ADAPT (Telemetria): Munícipe retornou após ${tempoAusenteSegundos}s fora.`);

            // Se ficou fora por mais de 15 segundos, oferece acolhimento contextual
            if (tempoAusenteSegundos >= 15) {
                dispararMensagemRetorno();
            }
            info.ultimaSaida = 0; // Reseta o cronômetro
        }
    }
}

function dispararMensagemRetorno() {
    if (document.querySelector(".adapt-alerta-retorno")) return;

    const nomeCampo = PerfilCognitivoTemporario.retorno.ultimoCampoFocado || "Nome Completo";
    const container = document.querySelector(".container");

    const alerta = document.createElement("div");
    alerta.className = "adapt-alerta-retorno";
    alerta.innerHTML = `
         <strong>Bem-vindo de volta!</strong> Caso tenha ido buscar documentos, faça o preenchimento sem pressa. Paramos perto do campo: <strong>${nomeCampo}</strong>.
    `;

    // Insere no topo do formulário interno
    container.insertBefore(alerta, container.firstChild);

    // Desaparece suavemente após 8 segundos para não poluir a tela
    setTimeout(() => {
        alerta.style.opacity = "0";
        setTimeout(() => alerta.remove(), 400);
    }, 8000);
}