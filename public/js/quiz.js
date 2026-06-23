
let perguntas = [];

let perguntaAtual = 0;

let pontuacao = 0;

let disciplinaAtualId = null;

// Estado de cada pergunta: null = não respondida, true/false = acertou/errou
let respostas = [];

// ===============================
// OBTER PARÂMETRO DA URL
// ===============================

function obterParametroURL(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}


// ===============================
// CARREGAR PERGUNTAS
// ===============================

async function carregarPerguntas() {

    try {

        // Obtém a disciplina da URL, ou usa 1 como padrão
        const disciplinaId = obterParametroURL('disciplina') || 1;
        disciplinaAtualId = disciplinaId;

        const response = await fetch(
            `http://localhost:3000/api/quiz/perguntas/${disciplinaId}`
        );

        if (!response.ok) {

            throw new Error(
                "Erro ao buscar perguntas"
            );
        }

        const dados = await response.json();

        const todas = organizarPerguntas(dados);

        // Seleciona 5 perguntas rotativas por disciplina usando localStorage
        perguntas = selecionarPerguntasRotativas(todas, disciplinaId, 5);

        // Inicializa o estado de respostas
        respostas = perguntas.map(() => ({
            respondida: false,   // já clicou em "Responder" e viu a correção
            acertou: null,       // true/false após responder
            alternativaSelecionada: null, // índice da alternativa escolhida
            pontos: 0
        }));

        // DEBUG: mostra no console as perguntas selecionadas (ids)
        console.log('Perguntas selecionadas (ids):', perguntas.map(p => p.id));

    } catch (error) {

        console.log(error);

        alert(
            "Não foi possível carregar o quiz."
        );
    }
}


// ===============================
// ORGANIZAR PERGUNTAS
// ===============================

function organizarPerguntas(dados) {

    const perguntasMap = {};

    dados.forEach((item) => {

        if (!perguntasMap[item.id]) {

            perguntasMap[item.id] = {

                id: item.id,

                pergunta: item.pergunta,

                pontuacao: item.pontuacao,

                alternativas: []
            };
        }

        perguntasMap[item.id]
            .alternativas
            .push({

                texto: item.alternativa,

                correta: item.correta
            });
    });

    return Object.values(perguntasMap);
}


// ===============================
// INICIAR QUIZ
// ===============================

function startQuiz() {

    document.getElementById(
        "startScreen"
    ).style.display = "none";

    document.getElementById(
        "quizScreen"
    ).style.display = "block";

    mostrarPergunta();
}


// ===============================
// MOSTRAR PERGUNTA
// ===============================

function mostrarPergunta() {

    const container =
        document.getElementById(
            "optionsContainer"
        );

    const tituloPergunta =
        document.getElementById(
            "questionText"
        );

    const numeroPergunta =
        document.getElementById(
            "questionNumber"
        );

    const pergunta =
        perguntas[perguntaAtual];

    const estadoAtual = respostas[perguntaAtual];

    numeroPergunta.innerText =
        `Pergunta ${perguntaAtual + 1}/ ${perguntas.length}`;

    tituloPergunta.innerText =
        pergunta.pergunta;

    container.innerHTML = "";

    pergunta.alternativas.forEach(
        (alternativa, index) => {

            const label = document.createElement('label');
            label.className = 'option';

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'answer';
            input.value = alternativa.correta;
            input.dataset.index = index;

            // Se já respondeu, desabilita e colore
            if (estadoAtual.respondida) {
                input.disabled = true;

                if (alternativa.correta == 1) {
                    label.style.backgroundColor = '#4CAF50';
                } else {
                    label.style.backgroundColor = '#f44336';
                }

                // Marca a alternativa que o usuário escolheu
                if (estadoAtual.alternativaSelecionada === index) {
                    input.checked = true;
                }

            } else {
                // Se não respondeu ainda, restaura seleção anterior (caso volte)
                if (estadoAtual.alternativaSelecionada === index) {
                    input.checked = true;
                }
            }

            label.appendChild(input);
            label.appendChild(document.createTextNode(' ' + alternativa.texto));
            container.appendChild(label);
        }
    );

    // Mostra feedback de pontos se já respondeu
    atualizarFeedbackPontos();

    // Atualiza botões de navegação
    atualizarBotoes();
}


// ===============================
// ATUALIZAR FEEDBACK DE PONTOS
// ===============================

function atualizarFeedbackPontos() {
    let feedbackEl = document.getElementById('feedbackPontos');

    if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.id = 'feedbackPontos';
        feedbackEl.style.cssText = `
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
            min-height: 28px;
        `;
        const questionBox = document.querySelector('.question-box');
        questionBox.appendChild(feedbackEl);
    }

    const estadoAtual = respostas[perguntaAtual];

    if (estadoAtual.respondida) {
        if (estadoAtual.acertou) {
            feedbackEl.style.color = '#4CAF50';
            feedbackEl.innerText = `✓ Correto! +${estadoAtual.pontos} pontos`;
        } else {
            feedbackEl.style.color = '#f44336';
            feedbackEl.innerText = `✗ Errado! 0 pontos`;
        }
    } else {
        feedbackEl.innerText = '';
    }
}


// ===============================
// ATUALIZAR BOTÕES DE NAVEGAÇÃO
// ===============================

function atualizarBotoes() {
    const btnProxima = document.getElementById('btnProxima');
    const btnResponder = document.getElementById('btnResponder');

    // Botão Próxima: "Próxima Pergunta" ou "Ver Resultado" na última
    if (btnProxima) {
        if (perguntaAtual === perguntas.length - 1) {
            btnProxima.innerText = 'Ver Resultado';
        } else {
            btnProxima.innerText = 'Próxima Pergunta';
        }
    }

    // Setas de navegação
    const arrowVoltar = document.getElementById('arrowVoltar');
    const arrowProxima = document.getElementById('arrowProxima');
    if (arrowVoltar) arrowVoltar.disabled = perguntaAtual === 0;
    if (arrowProxima) arrowProxima.disabled = false; // sempre habilitada (leva ao resultado na última)

    // Botão Responder: oculto se já respondeu
    if (btnResponder) {
        const estadoAtual = respostas[perguntaAtual];
        btnResponder.style.display = estadoAtual.respondida ? 'none' : 'block';
    }
}


// ===============================
// SALVAR SELEÇÃO ATUAL (antes de navegar)
// ===============================

function salvarSelecaoAtual() {
    if (!respostas[perguntaAtual].respondida) {
        const respostaSelecionada = document.querySelector('input[name="answer"]:checked');
        if (respostaSelecionada) {
            respostas[perguntaAtual].alternativaSelecionada = parseInt(respostaSelecionada.dataset.index);
        } else {
            respostas[perguntaAtual].alternativaSelecionada = null;
        }
    }
}


// ===============================
// PRÓXIMA PERGUNTA
// ===============================

function proximaPergunta() {

    salvarSelecaoAtual();

    perguntaAtual++;

    if (
        perguntaAtual <
        perguntas.length
    ) {

        mostrarPergunta();

    } else {

        // Contabiliza perguntas não respondidas antes de mostrar resultado
        contabilizarNaoRespondidas();
        mostrarResultado();
    }
}


// ===============================
// VOLTAR PERGUNTA
// ===============================

function voltarPergunta() {
    if (perguntaAtual > 0) {
        salvarSelecaoAtual();
        perguntaAtual--;
        mostrarPergunta();
    }
}


// ===============================
// CONTABILIZAR NÃO RESPONDIDAS
// ===============================

function contabilizarNaoRespondidas() {
    respostas.forEach((estado, index) => {
        if (!estado.respondida) {
            // Verifica se havia alternativa selecionada
            const pergunta = perguntas[index];
            if (estado.alternativaSelecionada !== null) {
                const alternativa = pergunta.alternativas[estado.alternativaSelecionada];
                const acertou = alternativa.correta == 1;
                estado.acertou = acertou;
                if (acertou) {
                    estado.pontos = pergunta.pontuacao;
                    pontuacao += pergunta.pontuacao;
                } else {
                    estado.pontos = 0;
                }
            } else {
                estado.acertou = false;
                estado.pontos = 0;
            }
            console.log(`Pergunta ${index + 1} (não respondida): ${estado.acertou ? 'Correta' : 'Errada'}`);
        }
    });
}


// ===============================
// RESPONDER
// ===============================

function responder() {

    const estadoAtual = respostas[perguntaAtual];

    // Se já respondeu, não faz nada
    if (estadoAtual.respondida) return;

    const respostaSelecionada =
        document.querySelector(
            'input[name="answer"]:checked'
        );

    if (!respostaSelecionada) {

        alert(
            "Selecione uma alternativa"
        );

        return;
    }

    // Salva o índice da alternativa selecionada
    estadoAtual.alternativaSelecionada = parseInt(respostaSelecionada.dataset.index);

    const alternativas =
        document.querySelectorAll(
            '.option'
        );

    alternativas.forEach((label) => {

        const radio =
            label.querySelector(
                'input'
            );

        if (radio.value == "1") {

            label.style.backgroundColor =
                "#4CAF50";

        } else {

            label.style.backgroundColor =
                "#f44336";

        }

        radio.disabled = true;
    });

    const acertou =
        respostaSelecionada.value == "1";

    estadoAtual.respondida = true;
    estadoAtual.acertou = acertou;

    if (acertou) {
        estadoAtual.pontos = perguntas[perguntaAtual].pontuacao;
        pontuacao += perguntas[perguntaAtual].pontuacao;
    } else {
        estadoAtual.pontos = 0;
    }

    // Mostra feedback de pontos
    atualizarFeedbackPontos();

    // Esconde o botão Responder
    atualizarBotoes();
}



// ===============================
// RESULTADO
// ===============================

function mostrarResultado() {

    document.getElementById(
        "quizScreen"
    ).style.display = "none";

    document.getElementById(
        "resultScreen"
    ).style.display = "block";

    document.getElementById(
        "pontuacaoFinal"
    ).innerText =
        `${pontuacao} pontos`;

    // incrementa rotação para próxima vez que entrar nessa disciplina
    incrementarRotacao(disciplinaAtualId, perguntas.length);

    salvarPontuacao();
}


// ===============================
// SALVAR PONTUAÇÃO
// ===============================

async function salvarPontuacao() {

    const nome = localStorage.getItem("usuario");

    try {

        await fetch(
            "http://localhost:3000/api/ranking/pontuacao",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
    nome: nome,
    pontos: pontuacao
})
            }
        );

    } catch (error) {

        console.log(error);
    }
}


// ===============================
// ROTINA DE ROTAÇÃO DE PERGUNTAS
// ===============================

function selecionarPerguntasRotativas(todasPerguntas, disciplinaId, limite) {
    if (!Array.isArray(todasPerguntas) || todasPerguntas.length === 0) return [];

    // garante ordem estável: ordena por `id` caso exista
    const perguntasUnicas = todasPerguntas.slice().sort((a, b) => {
        if (a.id != null && b.id != null) return a.id - b.id;
        return 0;
    });

    const N = perguntasUnicas.length;

    if (N <= limite) {
        return perguntasUnicas.slice(0, limite);
    }

    const chave = `rotacao_disciplina_${disciplinaId}`;
    let indice = parseInt(localStorage.getItem(chave) || '0', 10);
    if (isNaN(indice) || indice < 0) indice = 0;

    const selecionadas = [];
    for (let i = 0; i < limite; i++) {
        const idx = (indice + i) % N;
        selecionadas.push(perguntasUnicas[idx]);
    }

    return selecionadas;
}

function incrementarRotacao(disciplinaId, usadasCount) {
    if (!disciplinaId) return;
    const chave = `rotacao_disciplina_${disciplinaId}`;
    let indice = parseInt(localStorage.getItem(chave) || '0', 10);
    if (isNaN(indice) || indice < 0) indice = 0;

    const incremento = usadasCount || 5;
    const novo = indice + incremento;
    localStorage.setItem(chave, String(novo));
}


// ===============================
// REINICIAR QUIZ
// ===============================

async function restartQuiz() {

    pontuacao = 0;

   document.getElementById(
        "resultScreen"
    ).style.display = "none";

    document.getElementById(
        "startScreen"
    ).style.display = "block";
    window.location.href = "/modulo";
    
}


// ===============================
// INICIAR AUTOMATICAMENTE
// ===============================

carregarPerguntas();
