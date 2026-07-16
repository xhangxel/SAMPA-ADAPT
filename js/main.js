// Objeto global na memória para o Perfil Cognitivo Temporário do usuário (Ele zera ao fechar a aba)
const PerfilCognitivoTemporario = {
    hesitacao: {},
    frustracao: {},
    fadiga: { cliquesFora: 0 },
    rolagem: { mudancasDirecao: 0, ultimoScrollY: 0, ultimaBateu: 0 },
    retorno: { tempoFora: 0, ultimaSaida: 0, ultimoCampoFocado: "" },
    visao: { tempoFixado: 0 }
};

// Usa window.onload para garantir que TODOS os elementos do HTML e scripts estejam prontos
window.onload = () => {
    console.log("SAMPA-ADAPT: Ativado com sucesso. Todos os módulos carregados.");
    inicializarSensores();
};

function inicializarSensores() {
    // Escuta global de foco (Hesitação + guarda o último campo para o sensor de Retorno)
    document.body.addEventListener("focusin", (event) => {
        if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
            // Guarda o nome legível do campo para o sensor de retorno usar depois
            PerfilCognitivoTemporario.retorno.ultimoCampoFocado = event.target.parentNode.querySelector('label')?.innerText || event.target.name;
            
            if (typeof iniciarMonitoramentoHesitacao === "function") {
                iniciarMonitoramentoHesitacao(event.target);
            }
        }
    });

    // Escuta global de teclado (Frustração)
    document.body.addEventListener("keydown", (event) => {
        if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
            if (typeof monitorarFrustracaoDigitacao === "function") {
                monitorarFrustracaoDigitacao(event.target, event);
            }
        }
    });

    // Escuta global de cliques (Fadiga Motora)
    document.body.addEventListener("click", (event) => {
        if (typeof verificarCliqueFadiga === "function") {
            verificarCliqueFadiga(event);
        }
    });

    // Escuta global de Rolagem (Desorientação)
    window.addEventListener("scroll", () => {
        if (typeof monitorarRolagemErratica === "function") {
            monitorarRolagemErratica();
        }
    });

    // Escuta global de Visibilidade da Aba (Retorno)
    document.addEventListener("visibilitychange", () => {
        if (typeof monitorarMudancaVisibilidade === "function") {
            monitorarMudancaVisibilidade();
        }
    });
    
    // Inicializa o Sensor de Visão buscando as instruções E todos os blocos de campos
    const blocosDeVisao = document.querySelectorAll(".instrucoes-servico, .campo");
    if (blocosDeVisao.length > 0 && typeof inicializarSensorVisao === "function") {
        inicializarSensorVisao(blocosDeVisao);
    } else {
        console.warn("SAMPA-ADAPT: Elementos de leitura não encontrados pelos módulos.");
    }
}

function exibirTooltipAdaptativo(elemento) {
    if (elemento.parentNode.querySelector('.adapt-tooltip')) return;

    // DICIONÁRIO COMPLETO: Mensagens personalizadas de ajuda baseadas no nome do campo do formulário
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

    // Pega a dica específica ou usa uma genérica amigável
    const campoNome = elemento.name;
    const mensagemDica = dicas[campoNome] || "Precisa de ajuda com este campo? Certifique-se de preencher com calma.";

    // Cria a estrutura HTML do balão de ajuda 
    const tooltip = document.createElement('div');
    tooltip.className = 'adapt-tooltip';
    tooltip.innerHTML = `
        <span class="adapt-tooltip-icone">💡</span>
        <p class="adapt-tooltip-texto">${mensagemDica}</p>
    `;

    // Posiciona o balão de ajuda 
    elemento.parentNode.style.position = 'relative';
    elemento.parentNode.appendChild(tooltip);
    
    // Registra a ação no Perfil Cognitivo Temporário (LGPD-compliant, local na memória)
    if (!PerfilCognitivoTemporario.hesitacao[campoNome]) {
        PerfilCognitivoTemporario.hesitacao[campoNome] = 0;
    }
    PerfilCognitivoTemporario.hesitacao[campoNome]++;
    
    console.log("SAMPA-ADAPT: Perfil atualizado localmente:", PerfilCognitivoTemporario);
}

