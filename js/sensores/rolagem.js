let timerScroll;

function monitorarRolagemErratica() {
    const atualScrollY = window.scrollY;
    const info = PerfilCognitivoTemporario.rolagem;
    const agora = Date.now();

    clearTimeout(timerScroll);

    // Identifica se mudou bruscamente de direção (subiu e desceu muito rápido)
    if ((atualScrollY > info.ultimoScrollY && info.direcao === "subindo") || 
        (atualScrollY < info.ultimoScrollY && info.direcao === "descendo")) {
        
        // Verifica se a mudança aconteceu em menos de 2 segundos desde a última
        if (agora - info.ultimaBateu < 2000) {
            info.mudancasDirecao++;
            console.log(`SAMPA-ADAPT (Telemetria): Scroll instável detectado. Mudanças: ${info.mudancasDirecao}`);
        }
        info.ultimaBateu = agora;
    }

    // Atualiza o estado atual no perfil
    info.direcao = atualScrollY > info.ultimoScrollY ? "descendo" : "subindo";
    info.ultimoScrollY = atualScrollY;

    // Se houver mais de 4 mudanças bruscas de rolagem, ativa o Guia de Posicionamento
    if (info.mudancasDirecao >= 4) {
        dispararGuiaNavegacao();
    }

    // Reseta o contador se o usuário parar de rolar por 4 segundos
    timerScroll = setTimeout(() => {
        info.mudancasDirecao = 0;
    }, 4000);
}

function dispararGuiaNavegacao() {
    if (document.querySelector(".adapt-barra-progresso")) return;

    console.log("SAMPA-ADAPT (Adaptação): Usuário perdido na rolagem. Oferecendo âncoras espaciais.");

    // Encontra o primeiro input vazio de verdade
    const todosInputs = document.querySelectorAll("input");
    let inputAlvoVazio = null;
    let nomeExibicao = "";
    
    for (let input of todosInputs) {
        if (!input.value.trim() && input.type !== "submit" && input.type !== "hidden") {
            inputAlvoVazio = input;
            nomeExibicao = input.parentNode.querySelector("label")?.innerText || "Próximo campo";
            break;
        }
    }

    // Cria a barra guia adaptada
    const barra = document.createElement("div");
    barra.className = "adapt-barra-progresso";
    
    if (inputAlvoVazio) {
        // Garantimos que o input alvo tenha um ID para podermos achá-lo no clique global
        if (!inputAlvoVazio.id) {
            inputAlvoVazio.id = "adapt-id-temporario-" + Math.random().toString(36).substr(2, 9);
        }

        barra.innerHTML = `🔍 <strong>Precisa de ajuda?</strong> Clique aqui para ir direto para o campo: <strong style="text-decoration: underline; cursor: pointer;" onclick="const el = document.getElementById('${inputAlvoVazio.id}'); if(el){ el.scrollIntoView({behavior: 'smooth', block: 'center'}); setTimeout(() => el.focus(), 400); }">${nomeExibicao}</strong>`;
    } else {
        barra.innerHTML = `✨ <strong>Tudo preenchido!</strong> Clique em <strong style="text-decoration: underline; cursor: pointer;" onclick="document.querySelector('button[type=\'submit\']').scrollIntoView({behavior: 'smooth', block: 'center'});">Confirmar e Cadastrar</strong>`;
    }

    document.body.appendChild(barra);
}