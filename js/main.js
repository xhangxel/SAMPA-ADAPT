// Objeto global na memória para o Perfil Cognitivo Temporário do usuário (Ele zera ao fechar a aba)
const PerfilCognitivoTemporario = {
    hesitacao: {},
    frustracao: {},
    fadiga: { cliquesFora: 0 },
    rolagem: {
        mudancasDirecao: 0,
        ultimoScrollY: window.scrollY || 0,
        ultimaBateu: 0,
        direcao: "estacionario",
        camposTocadosEBrancos: []
    },
    retorno: { tempoFora: 0, ultimaSaida: 0, ultimoCampoFocado: "" },
    visao: { tempoFixado: 0 }
};
window.PerfilCognitivoTemporario = PerfilCognitivoTemporario;

// Estado dos Sensores (Lê do localStorage ou inicia tudo como ativo 'true' por padrão)
const ConfiguracaoSensores = {
    hesitacao: localStorage.getItem("sampa_sensor_hesitacao") !== "false",
    frustracao: localStorage.getItem("sampa_sensor_frustracao") !== "false",
    fadiga: localStorage.getItem("sampa_sensor_fadiga") !== "false",
    rolagem: localStorage.getItem("sampa_sensor_rolagem") !== "false",
    retorno: localStorage.getItem("sampa_sensor_retorno") !== "false",
    visao: localStorage.getItem("sampa_sensor_visao") !== "false"
};
window.PerfilCognitivoTemporario.sensoresAtivos = { ...ConfiguracaoSensores };

// Trava global para evitar que os sensores ignorem a navegação automática
window.sampaNavegandoAutomaticamente = false;

// Função para injetar os estilos CSS do Painel de Controle do Modo Assistido
function injetarEstilosPainelAssistido() {
    if (document.getElementById("sampa-style")) return;

    const style = document.createElement("style");
    style.id = "sampa-style";
    style.textContent = `
        .sampa-painel-container {
            position: fixed;
            right: 16px;
            bottom: 16px;
            z-index: 99999;
            font-family: Arial, sans-serif;
        }

        .sampa-painel-toggle {
            border: 0;
            border-radius: 999px;
            width: 48px;
            height: 48px;
            background: #0d6efd;
            color: white;
            font-size: 22px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,.2);
        }

        .sampa-painel-conteudo {
            display: none;
            width: 280px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 12px;
            padding: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,.18);
            margin-bottom: 8px;
        }

        .sampa-painel-container.aberto .sampa-painel-conteudo {
            display: block;
        }

        .sampa-opcao {
            margin: 8px 0;
            font-size: 13px;
            color: #333;
        }

        .sampa-opcao label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }

        .sampa-opcao input {
            width: 16px;
            height: 16px;
        }
    `;

    document.head.appendChild(style);
}
//Modo Assistido: Painel de Controle e Inicialização dos Sensores
function injetarPainelAssistido() {
    if (document.getElementById("sampaPainel")) return;

    const painelHTML = `
        <div class="sampa-painel-conteudo" id="sampaConteudo" aria-hidden="true">
            <h3 style="text-align:center; margin:0 0 8px; font-size:16px;">MODO ASSISTIDO</h3>
            <p style="font-size:12px; color:#666; margin:0 0 12px; line-height:1.4;">Modo assistido ativado por padrão. Desative apenas se estiver atrapalhando.</p>

            <div class="sampa-opcao"><label><input type="checkbox" id="chk-hesitacao" checked> Dicas de Preenchimento</label></div>
            <div class="sampa-opcao"><label><input type="checkbox" id="chk-frustracao" checked> Ampliação da Área de Digitação</label></div>
            <div class="sampa-opcao"><label><input type="checkbox" id="chk-fadiga" checked> Ampliação de Botões por Fadiga</label></div>
            <div class="sampa-opcao"><label><input type="checkbox" id="chk-rolagem" checked> Guia Espacial de Rolagem</label></div>
            <div class="sampa-opcao"><label><input type="checkbox" id="chk-retorno" checked> Mensagem de Boas-vindas</label></div>
            <div class="sampa-opcao"><label><input type="checkbox" id="chk-visao" checked> Alto Contraste Automático</label></div>
        </div>

        <button type="button" class="sampa-painel-toggle" id="sampaToggleBtn" aria-label="Abrir painel de acessibilidade">👁️</button>
    `;

    const containerPainel = document.createElement("div");
    containerPainel.id = "sampaPainel";
    containerPainel.className = "sampa-painel-container";
    containerPainel.innerHTML = painelHTML;
    document.body.appendChild(containerPainel);

    document.getElementById("sampaToggleBtn").addEventListener("click", togglePainel);

    ["hesitacao", "frustracao", "fadiga", "rolagem", "retorno", "visao"].forEach((sensor) => {
        const chk = document.getElementById(`chk-${sensor}`);
        if (chk) {
            chk.addEventListener("change", (event) => {
                alternarSensor(sensor, event.target.checked);
            });
        }
    });
}

function togglePainel() {
    const painel = document.getElementById("sampaPainel");
    const conteudo = document.getElementById("sampaConteudo");
    if (painel && conteudo) {
        painel.classList.toggle("aberto");
        const aberto = painel.classList.contains("aberto");
        conteudo.setAttribute("aria-hidden", aberto ? "false" : "true");
    }
}

// Função para inicializar todos os sensores e rastrear eventos do usuário
function inicializarSensores() {
    document.body.addEventListener("focusin", (event) => {
        if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
            const input = event.target;
            PerfilCognitivoTemporario.retorno.ultimoCampoFocado = input.name || "Campo";
        }
    });

    document.body.addEventListener("focusout", (event) => {
        if (event.target.tagName !== "INPUT") return;

        const input = event.target;
        if (input.type === "submit" || input.type === "hidden" || input.type === "button") return;

        if (!window.PerfilCognitivoTemporario?.sensoresAtivos?.rolagem) return;

        const infoRolagem = PerfilCognitivoTemporario.rolagem;
        const container = input.parentElement || input.parentNode;

        let nomeCampo = container?.querySelector("label")?.innerText ||
            input.closest(".campo")?.querySelector("label")?.innerText ||
            input.placeholder ||
            input.name ||
            "Campo";

        nomeCampo = nomeCampo.replace(/[*:]/g, "").trim();

        // Atualiza o rastro de campos tocados e abandonados
        if (!input.value.trim()) {
            const jaExiste = infoRolagem.camposTocadosEBrancos.some((c) => c.elemento === input);
            if (!jaExiste) {
                infoRolagem.camposTocadosEBrancos.push({ elemento: input, nome: nomeCampo });
                console.log(`📌 SAMPA-ADAPT (Rastro): Campo "${nomeCampo}" abandonado.`);
            }
        } else {
            infoRolagem.camposTocadosEBrancos = infoRolagem.camposTocadosEBrancos.filter((c) => c.elemento !== input);
        }
    });

    // Monitora digitação para detectar frustração
    document.body.addEventListener("keydown", (event) => {
        if (!ConfiguracaoSensores.frustracao) return;
        if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
            if (typeof monitorarFrustracaoDigitacao === "function") {
                monitorarFrustracaoDigitacao(event.target, event);
            }
        }
    });

    // Monitora digitação para detectar hesitação
    document.body.addEventListener("click", (event) => {
        if (!ConfiguracaoSensores.fadiga) return;
        if (typeof verificarCliqueFadiga === "function") {
            verificarCliqueFadiga(event);
        }
    });

    // Detecta hesitação inicial em campos de formulário
    window.addEventListener("scroll", () => {
        if (!ConfiguracaoSensores.rolagem) return;
        if (typeof monitorarRolagemErratica === "function") {
            monitorarRolagemErratica();
        }
    });

    // Detecta quando o usuário retorna à aba do formulário
    document.addEventListener("visibilitychange", () => {
        if (!ConfiguracaoSensores.retorno) return;
        if (typeof monitorarMudancaVisibilidade === "function") {
            monitorarMudancaVisibilidade();
        }
    });

    const blocosDeVisao = document.querySelectorAll(".instrucoes-servico, .campo label");
    if (blocosDeVisao.length > 0 && typeof inicializarSensorVisao === "function") {
        inicializarSensorVisao(blocosDeVisao);
    } else {
        console.warn("SAMPA-ADAPT: Elementos de leitura não encontrados pelos módulos.");
    }
}

function alternarSensor(sensorNome, ativo) {
    ConfiguracaoSensores[sensorNome] = ativo;
    window.PerfilCognitivoTemporario.sensoresAtivos[sensorNome] = ativo;
    localStorage.setItem(`sampa_sensor_${sensorNome}`, ativo);
    console.log(`SAMPA-ADAPT (Painel): Sensor de [${sensorNome}] alterado para: ${ativo}`);

    if (!ativo) {
        removerAdaptacoesEspecificas(sensorNome);
    }
}

// Função para remover adaptações específicas de cada sensor
function removerAdaptacoesEspecificas(sensorNome) {
    if (sensorNome === "visao") {
        const formulario = document.querySelector("form");
        if (formulario) formulario.classList.remove("adapt-leitura-ampliada");
        const blocoInfo = document.querySelector(".instrucoes-servico");
        if (blocoInfo) blocoInfo.classList.remove("adapt-leitura-ampliada");

        const inputs = document.querySelectorAll("input");
        inputs.forEach((input) => {
            input.style.backgroundColor = "";
            input.style.color = "";
            input.style.borderColor = "";
        });
    }
    if (sensorNome === "rolagem") {
        document.querySelectorAll(".adapt-barra-progresso").forEach((el) => el.remove());
    }
    if (sensorNome === "retorno") {
        document.querySelectorAll(".adapt-alerta-retorno").forEach((el) => el.remove());
    }
    if (sensorNome === "hesitacao") {
        document.querySelectorAll(".adapt-tooltip").forEach((el) => el.remove());
    }
    if (sensorNome === "fadiga") {
        const botao = document.querySelector("button[type='submit']");
        if (botao) botao.classList.remove("adapt-botao-acessivel");
        document.querySelectorAll("input").forEach((input) => {
            input.classList.remove("adapt-modo-assistido");
            input.classList.remove("adapt-input-acessivel");
        });
    }
}

function atualizarCheckboxesPainel() {
    for (const sensor in ConfiguracaoSensores) {
        const checkbox = document.getElementById(`chk-${sensor}`);
        if (checkbox) {
            checkbox.checked = ConfiguracaoSensores[sensor];
        }
    }
}

// Exibe um balão de ajuda adaptativo próximo ao elemento alvo, com base no dicionário de dicas
function exibirTooltipAdaptativo(elemento) {
    if (!ConfiguracaoSensores.hesitacao) return;
    if (elemento.parentNode?.querySelector(".adapt-tooltip")) return;

    // DICIONARIO DE DICAS DE PREENCHIMENTO
    const dicas = {
        nome: "Digite seu nome completo, exatamente como está no seu documento oficial.",
        idade: "Informe sua idade atual em números (ex.: 25). Se não souber exatamente, calcule usando: ano atual − ano de nascimento. Se o seu aniversário ainda não tiver ocorrido neste ano, subtraia 1 do resultado; caso contrário, essa é a sua idade.",
        cpf: "Insira os 11 dígitos do seu CPF. Apenas números.",
        rg: "Digite o número do seu RG incluindo o dígito verificador se houver.",
        nacionalidade: "Informe o país onde você nasceu (ex: Brasil).",
        naturalidade: "Informe a cidade e o estado onde você nasceu (ex: São Paulo - SP).",
        rua: "Digite o nome da sua rua, avenida ou alameda sem o número.",
        numero: "Digite o número da sua residência. Se não houver, digite 'S/N'.",
        complemento: "Campo opcional. Pode ser o número do apartamento, bloco ou fundos.",
        bairro: "Digite o nome do seu bairro ou distrito.",
        cep: 'Não sabe seu CEP? <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer">Clique aqui para consultar.</a>',
        dataNascimento: "Selecione ou digite o dia, mês e ano do seu nascimento igual ao seu RG."
    };

    // Mensagem padrão caso o campo não esteja no dicionário
    const campoNome = elemento.name;
    const mensagemDica = dicas[campoNome] || "Precisa de ajuda com este campo? Certifique-se de preencher com calma.";

    const tooltip = document.createElement("div");
    tooltip.className = "adapt-tooltip";
    tooltip.innerHTML = `
        <span class="adapt-tooltip-icone">💡</span>
        <p class="adapt-tooltip-texto">${mensagemDica}</p>
    `;

    elemento.parentNode.style.position = "relative";
    elemento.parentNode.appendChild(tooltip);

    if (!PerfilCognitivoTemporario.hesitacao[campoNome]) {
        PerfilCognitivoTemporario.hesitacao[campoNome] = 0;
    }
    PerfilCognitivoTemporario.hesitacao[campoNome]++;

    console.log("SAMPA-ADAPT: Perfil atualizado localmente:", PerfilCognitivoTemporario);
}

window.togglePainel = togglePainel;
window.alternarSensor = alternarSensor;

document.addEventListener("DOMContentLoaded", () => {
    injetarEstilosPainelAssistido();
    injetarPainelAssistido();
    atualizarCheckboxesPainel();
    inicializarSensores();
    console.log("SAMPA-ADAPT: Ativado com sucesso. Interface e rastros injetados.");
});

