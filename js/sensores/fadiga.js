function verificarCliqueFadiga(evento) {
    // Se o usuário acertou o input, o botão ou a label do campo, reseta e ignora
    if (
        evento.target.tagName === "INPUT" || 
        evento.target.tagName === "BUTTON" || 
        evento.target.tagName === "LABEL"
    ) {
        PerfilCognitivoTemporario.fadiga.cliquesFora = 0;
        return;
    }

    const xClique = evento.clientX;
    const yClique = evento.clientY;
    const RAIO_ERRO = 45; // Define a tolerância de clique "fora do alvo" em pixels

    // Captura os alvos do formulário
    const elementosAlvo = document.querySelectorAll("input, button[type='submit']");
    let tentouAcertarAlgum = false;

    // Varre as coordenadas geográficas de cada elemento na tela
    elementosAlvo.forEach(alvo => {
        const rect = alvo.getBoundingClientRect();

        const pertoX = xClique >= rect.left - RAIO_ERRO && xClique <= rect.right + RAIO_ERRO;
        const pertoY = yClique >= rect.top - RAIO_ERRO && yClique <= rect.bottom + RAIO_ERRO;

        if (pertoX && pertoY) {
            tentouAcertarAlgum = true;
        }
    });

    // Incrementa se o clique foi errático mas perto do alvo
    if (tentouAcertarAlgum) {
        PerfilCognitivoTemporario.fadiga.cliquesFora++;
        console.log(`SAMPA-ADAPT (Telemetria): Clique próximo ao alvo detectado. Erros: ${PerfilCognitivoTemporario.fadiga.cliquesFora}`);

        // Se o usuário acumular 3 cliques erráticos, ativa a adaptação de acessibilidade motora
        if (PerfilCognitivoTemporario.fadiga.cliquesFora >= 3) {
            dispararAcessibilidadeMotoraGlobal();
        }
    }
}

function dispararAcessibilidadeMotoraGlobal() {
    const botao = document.querySelector("button[type='submit']");
    if (botao && botao.classList.contains("adapt-botao-acessivel")) return;
    console.error("SAMPA-ADAPT: Fadiga detectada. Ampliando formulário.");

    // Ativa a área de clique invisível ampliada no botão e muda a cor
    if (botao) {
        botao.classList.add("adapt-botao-acessivel");
    }

    // Captura o formulário e todos os inputs da página
    const formulario = document.querySelector("form");
    if (formulario) {
        formulario.classList.add("adapt-layout-ampliado");
    }

    // Aplica o aumento visual em todos os campos de digitação de uma vez
    const todosInputs = document.querySelectorAll("input");
    todosInputs.forEach(input => {
        input.classList.add("adapt-modo-assistido");
        input.classList.add("adapt-input-acessivel"); 
    });
}