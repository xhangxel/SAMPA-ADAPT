## PROJETO SAMPA-ADAPT PARA A 15ª EDIÇÃO DO PRÊMIO “AS MELHORES PRÁTICAS DE ESTÁGIO NA PREFEITURA DE SÃO PAULO” (2026)
# Framework Digital Plural com Acessibilidade Comportamental Adaptativa Autônoma em Tempo Real via Telemetria Local

# ESTRUTURA PRINCIPAL DO SISTEMA
SAMPA-ADAPT/
│
├── index.html               # Página principal (Simulação de um Formulário)
│
├── styles/
│   └── styles.css           # Estilização da página e das adaptações de acessibilidade
│
├── js/
│   ├── main.js              # Inicializador e gerenciador do Perfil Cognitivo Temporário
│   │
│   └── sensores/            # Pasta modular para cada sensor (organização limpa)
│       ├── hesitacao.js     # Gatilho 1: Monitora tempo e ociosidade
│       ├── frustracao.js    # Gatilho 2: Monitora uso repetido de Backspace/correções
│       ├── fadiga.js        # Gatilho 3: Monitora cliques errados ao redor dos botões
│       ├── rolagem.js       # Gatilho 4: Monitora rolagens repetidas e rápidas na página
│       ├── retorno.js       # Gatilho 5: Monitora a saída da página e a volta
│       └── visao.js         # Gatilho 6: Monitora sensor do mouse parado em cima de um bloco informativo longo ou de uma label
│
└── README.md                # Documentação técnica rápida do projeto

# Como Aplicar o SAMPA-ADAPT na prática?
O SAMPA-ADAPT foi feito pensando na alta replicabilidade e baixo custo do Framework para que seja viável tanto 
para um sistema legado quanto para um sistema mais moderno, de uma forma que ainda assim evite o retrabalho dos 
Servidores da área de Desenvolvimento. Pensando nisso, criamos o Snippet de Integração para que com um único
bloco de código possa haver a integração dessa funcionalidade.

Snippet de Integração:

```html <!-- Estilização das adaptações dinâmicas -->
<link rel="stylesheet" href="./styles/styles.css">

<!-- Módulos dos Sensores -->
<script src="./js/sensores/hesitacao.js"></script>
<script src="./js/sensores/frustracao.js"></script>
<script src="./js/sensores/fadiga.js"></script>
<script src="./js/sensores/rolagem.js"></script>
<script src="./js/sensores/retorno.js"></script>
<script src="./js/sensores/visao.js"></script>

<!-- Maestro do Sistema -->
<script src="./js/main.js"></script> ´´´

# Como o SAMPA-ADAPT se aplica dentro da estrutura da LGPD-Compliant?
O SAMPA-ADAPT adota o conceito de Privacy by Design (Privacidade desde a Concepção). Por ser uma solução executada estritamente no lado
do cliente (client-side), o perfil adaptativo é temporário e reside apenas na memória volátil da sessão do usuário. Isso elimina riscos
de vazamento de dados, desonera a infraestrutura de servidores do município e garante conformidade absoluta com a LGPD sem necessidade de
termos de consentimento complexos, pois nenhum dado pessoal é coletado, transmitido ou armazenado.

O SAMPA-ADAPT é considerado em total conformidade com a lei por três motivos fundamentais:

- Armazenamento Volátil (Local na Memória): Os dados coletados pelo sensor (como "o usuário errou 3 vezes o clique perto do botão") não
são gravados em um banco de dados nem enviados para a nuvem. Eles ficam salvos em um objeto JavaScript comum dentro da memória RAM do
navegador do próprio munícipe (PerfilCognitivoTemporario).

- Descarte Automático: No momento em que o cidadão fecha a aba do navegador ou encerra o preenchimento, essa memória é totalmente
destruída. Nenhum rastro comportamental é armazenado.

- Anonimato de Dados Sensíveis: O sistema não monitora o que o usuário digita (o conteúdo do CPF ou o nome), mas sim como ele interage
com a interface (tempo decorrido e uso da tecla Backspace). Não há coleta de dados pessoais sensíveis.

Notas:
- O projeto é um site estático — `index.html` fica na raiz e os assets estão em `js/` e `styles/`.
- Adicionei [vercel.json](vercel.json) para explicitar o build como `@vercel/static` e forçar roteamento para `index.html`.
- Arquivos ignorados no deploy: [.vercelignore](.vercelignore).
