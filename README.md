# PROJETO SAMPA-ADAPT PARA A 15ª EDIÇÃO DO PRÊMIO “AS MELHORES PRÁTICAS DE ESTÁGIO NA PREFEITURA DE SÃO PAULO” (2026)
## Framework Digital Plural com Acessibilidade Comportamental Adaptativa Autônoma em Tempo Real via Telemetria Local

## ESTRUTURA PRINCIPAL DO SISTEMA
```text
SAMPA-ADAPT/
│
├── index.html               # Página principal (Simulação de um Formulário)
│
├── vercel.json              # Configurações de implantação estática da Simulação do Formulário com o Framework
|
├── SAMPA-ADAPT/
│    |
│    ├── styles/
|    │   └── styles.css           # Estilização da página e das adaptações de acessibilidade
|    │
|    ├── js/
|        ├── main.js              # Inicializador e gerenciador do Perfil Cognitivo Temporário
|        ├── loader.js            # Cria um único script de uma linha para injetar todos os sensores com uma única linha
|        │
|        └── sensores/            # Pasta modular para cada sensor
|            ├── hesitacao.js     # Gatilho 1: Monitora tempo e ociosidade
|            ├── frustracao.js    # Gatilho 2: Monitora uso repetido de Backspace/correções
|            ├── fadiga.js        # Gatilho 3: Monitora cliques errados ao redor dos botões
|            ├── rolagem.js       # Gatilho 4: Monitora rolagens repetidas e rápidas na página
|            ├── retorno.js       # Gatilho 5: Monitora a saída da página e a volta
|            └── visao.js         # Gatilho 6: Monitora sensor do mouse parado em cima de um bloco informativo longo ou de uma label
|    
└── README.md                # Documentação técnica rápida do projeto

```

## Como Aplicar o SAMPA-ADAPT na prática?
O SAMPA-ADAPT foi feito pensando na alta replicabilidade e baixo custo do Framework para que seja viável tanto 
para um sistema legado quanto para um sistema mais moderno, de uma forma que ainda assim evite o retrabalho dos 
Servidores da área de Desenvolvimento. Pensando nisso, criamos o Snippet de Integração para que com um único
bloco de código possa haver a integração dessa funcionalidade.

### Snippet de Integração:

```html     
    <link rel="stylesheet" href="./SAMPA-ADAPT/styles/styles.css">
    <script src="./SAMPA-ADAPT/js/loader.js"></script>
```

## Guia para futuros desenvolvedores: como usar o framework
O SAMPA-ADAPT foi pensado para funcionar como uma camada de acessibilidade adaptativa sobre formulários já existentes. A integração é simples, não exige backend e pode ser aplicada tanto em sistemas legados quanto em interfaces mais modernas.

### 1. Requisitos mínimos de estrutura
Para que o framework funcione corretamente, a página deve possuir:

- Um formulário HTML com campos de entrada como `input`, `textarea` ou `select`.
- Um botão de envio com `type="submit"`.
- Labels próximos aos campos, para que o framework consiga identificar melhor o contexto.
- Um bloco de instruções ou texto explicativo, preferencialmente com a classe `.instrucoes-servico`.

### 2. Passo a passo de integração
1. Inclua o arquivo de estilos no cabeçalho da página.
2. Carregue os módulos dos sensores antes do script principal.
3. Garanta que o formulário e os elementos de interação estejam presentes no DOM antes da execução do framework.
4. Teste o comportamento em uma sessão real para validar as adaptações automáticas.

### 3. Como o framework reage automaticamente
O SAMPA-ADAPT monitora sinais comportamentais sem coletar o conteúdo digitado pelo cidadão. Entre os gatilhos disponíveis estão:

- Hesitação: campo vazio e sem atividade por tempo prolongado.
- Frustração: uso repetido da tecla Backspace.
- Fadiga: cliques erráticos próximos ao alvo.
- Desorientação: mudanças bruscas de rolagem.
- Retorno: saída e retorno à aba do navegador.
- Fixação visual: permanência prolongada em blocos informativos.

### 4. Como personalizar ou ajustar o comportamento
Os desenvolvedores podem adaptar o framework em três níveis:

- Ajustando o HTML: mantendo a semântica correta, com labels e estrutura clara.
- Ajustando os seletores: caso o sistema já tenha uma estrutura diferente, é possível modificar os elementos alvo nos arquivos JavaScript.
- Ajustando os estilos: os comportamentos visuais podem ser alterados no arquivo de CSS para combinar com a identidade visual do órgão.

### 5. Como preencher dicas personalizadas no bloco do main
As dicas exibidas pelo sensor de hesitação são definidas no objeto `dicas` dentro de `js/main.js`, na função `exibirTooltipAdaptativo(elemento)`. Para personalizar as mensagens, o desenvolvedor deve editar esse bloco diretamente.

Exemplo:

```javascript
const dicas = {
  nome: "Digite seu nome completo conforme consta no documento oficial.",
  cpf: "Informe apenas os números do CPF.",
  email: "Digite um e-mail válido, por exemplo: nome@empresa.com.br."
};
```

Regras importantes:
- A chave do objeto deve corresponder ao `name` do campo HTML.
- Se o campo não estiver no dicionário, o framework exibirá uma mensagem padrão.
- É possível adicionar novas chaves para novos campos do formulário.
- As mensagens podem incluir HTML simples, como links, se necessário.

Exemplo de campo HTML compatível:

```html
<input type="text" name="cpf" id="cpf" />
```

Assim, quando o usuário ficar em silêncio nesse campo, o framework exibirá a dica personalizada associada ao `name="cpf"`.

### 6. Controle dos sensores
Os sensores são ativados por padrão. Para desativar algum deles, o desenvolvedor pode utilizar o painel flutuante de controle disponibilizado pelo framework ou alterar as chaves de configuração salvas no `localStorage`.

### 6. Boas práticas recomendadas
- Preserve a acessibilidade semântica do HTML.
- Não substitua a lógica de validação do formulário por adaptações comportamentais.
- Use o framework como camada complementar de suporte, não como substituto da usabilidade básica.
- Teste sempre com teclado, mouse e leitura de tela.

### 7. Exemplo mínimo de uso
```html
<form>
  <div class="campo">
    <label for="nome">Nome</label>
    <input id="nome" name="nome" type="text" />
  </div>

  <button type="submit">Enviar</button>
</form>
```

Com essa estrutura básica, o SAMPA-ADAPT já pode iniciar o monitoramento adaptativo automaticamente.

## Como o SAMPA-ADAPT se aplica dentro da estrutura da LGPD-Compliant?
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
