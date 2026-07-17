let timerScroll;
// Monitora a rolagem errática do usuário para detectar desorientação ou submissão
window.addEventListener("scroll", monitorarRolagemErratica);

function monitorarRolagemErratica() {
    if (!window.PerfilCognitivoTemporario?.sensoresAtivos?.rolagem) return;
    if (window.sampaNavegandoAutomaticamente) return;

    // Inicializa o objeto de rastreamento de rolagem se ainda não existir
    const atualScrollY = window.scrollY;
    const info = window.PerfilCognitivoTemporario?.rolagem;
    const agora = Date.now();

    if (!info) return;

    // Limpa o timer anterior para reiniciar a contagem de mudanças de direção
    clearTimeout(timerScroll);

    // Detecta mudanças de direção na rolagem
    if ((atualScrollY > info.ultimoScrollY && info.direcao === "subindo") ||
        (atualScrollY < info.ultimoScrollY && info.direcao === "descendo")) {

        if (agora - info.ultimaBateu < 2000) {
            info.mudancasDirecao++;
            console.log(`SAMPA-ADAPT (Telemetria): Scroll instável detectado. Mudanças: ${info.mudancasDirecao}`);
        }
        info.ultimaBateu = agora;
    }

    // Atualiza a direção atual da rolagem
    info.direcao = atualScrollY > info.ultimoScrollY ? "descendo" : "subindo";
    info.ultimoScrollY = atualScrollY;

    // Se houver 3 ou mais mudanças de direção em um curto período, dispara a guia de navegação
    if (info.mudancasDirecao >= 3) {
        dispararGuiaNavegacao(false);
    }

    // Reinicia o contador de mudanças de direção após 4 segundos sem novas mudanças
    timerScroll = setTimeout(() => {
        info.mudancasDirecao = 0;
    }, 4000);
}


function dispararGuiaNavegacao(forcarListaCompleta = false) {
    if (document.querySelector(".adapt-barra-progresso")) return;
    if (!forcarListaCompleta && !window.PerfilCognitivoTemporario?.sensoresAtivos?.rolagem) return;

    console.log("SAMPA-ADAPT (Adaptação): Analisando contexto de desorientação ou submissão do usuário.");

    const todosInputs = Array.from(document.querySelectorAll("input")).filter((i) => i.type !== "submit" && i.type !== "hidden" && i.type !== "button");
    const totalCampos = todosInputs.length;
    if (totalCampos === 0) return;

    // Calcula a quantidade de campos preenchidos e o percentual de conclusão do formulário
    const camposPreenchidos = todosInputs.filter((i) => i.value.trim()).length;
    const percentualConclusao = (camposPreenchidos / totalCampos) * 100;
    let camposParaExibir = [];

    // Se for forçar a lista completa, ou se o usuário estiver com mais de 70% do formulário preenchido, mas ainda houver campos em branco, exibe todos os campos restantes
    if (forcarListaCompleta) {
        todosInputs.forEach((input) => {
            if (!input.value.trim()) {
                const label = input.parentNode?.querySelector("label");
                const nomeCampo = label?.innerText.replace(/[*:]/g, "").trim() || input.name || "Campo";
                camposParaExibir.push({ elemento: input, nome: nomeCampo });
            }
        });
        console.log("SAMPA-ADAPT: Validação forçada via clique de submissão.");
    } else if (percentualConclusao >= 70 && camposPreenchidos < totalCampos) { // Se o usuário estiver com mais de 70% do formulário preenchido e ainda houver campos em branco, exibe todos os campos restantes
        todosInputs.forEach((input) => {
            if (!input.value.trim()) {
                const label = input.parentNode?.querySelector("label");
                const nomeCampo = label?.innerText.replace(/[*:]/g, "").trim() || input.name || "Campo";
                camposParaExibir.push({ elemento: input, nome: nomeCampo });
            }
        });
        console.log("SAMPA-ADAPT: Rolagem pegou campos restantes no final do form.");
    } else {
        const listaRastro = window.PerfilCognitivoTemporario?.rolagem?.camposTocadosEBrancos || [];
        camposParaExibir = listaRastro.filter((c) => c.elemento && !c.elemento.value.trim());
        console.log("SAMPA-ADAPT: Rolagem recuperou campos do rastro. Quantidade:", camposParaExibir.length);
    }

    if (camposParaExibir.length === 0) {
        console.log("SAMPA-ADAPT: Nenhuma notificação criada porque não há rastro ou pendência válida.");
        return;
    }

    const barra = document.createElement("div");
    barra.className = "adapt-barra-progresso";
    barra.style.cursor = "pointer";

    const primeiroInputVazio = camposParaExibir[0].elemento;
    if (!primeiroInputVazio.id) {
        primeiroInputVazio.id = "adapt-id-temporario-" + Math.random().toString(36).substr(2, 9);
    }

    const nomesLista = camposParaExibir.map((c) => `"${c.nome}"`).join(", ");

    // Monta o conteúdo da barra de progresso com a lista de campos pendentes e instrução para clicar
    barra.innerHTML = `🔍 <strong>Campos pendentes!</strong> Falta preencher: (${nomesLista}). Clique aqui para ir direto para: <strong style="text-decoration: underline;">${camposParaExibir[0].nome}</strong>`;

    barra.addEventListener("click", () => {
        window.sampaNavegandoAutomaticamente = true;
        const el = document.getElementById(primeiroInputVazio.id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => el.focus(), 400);
        }

        barra.remove();
        setTimeout(() => {
            window.sampaNavegandoAutomaticamente = false;
        }, 1000);
    });

    document.body.appendChild(barra);
}