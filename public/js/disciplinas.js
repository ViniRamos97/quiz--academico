// ===============================
// VARIÁVEIS GLOBAIS
// ===============================

let moduloAtual = 1;
let disciplinas = [];


// ===============================
// OBTER PARÂMETRO DA URL
// ===============================

function obterParametroURL(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}


// ===============================
// CARREGAR DISCIPLINAS DO MÓDULO
// ===============================

function obterModuloAtual() {
    const moduloQuery = obterParametroURL('modulo');
    if (moduloQuery) return moduloQuery;

    const match = window.location.pathname.match(/\/modulo\/disciplinas\/(\d+)/);
    return match ? match[1] : '1';
}

async function carregarDisciplinas() {
    try {
        moduloAtual = obterModuloAtual() || 1;

        const response = await fetch(
            `/modulo/${moduloAtual}/disciplinas`
        );

        if (!response.ok) {
            throw new Error("Erro ao buscar disciplinas");
        }

        const dados = await response.json();

        if (dados.disciplinas && dados.disciplinas.length > 0) {
            disciplinas = dados.disciplinas;
            renderizarDisciplinas();
            atualizarTitulo();
        } else {
            mostrarErro("Nenhuma disciplina encontrada para este módulo.");
        }

    } catch (error) {
        console.log(error);
        mostrarErro("Erro ao carregar disciplinas.");
    }
}


// ===============================
// RENDERIZAR DISCIPLINAS
// ===============================

function renderizarDisciplinas() {
    const container = document.getElementById('disciplinasContainer');
    container.innerHTML = '';

    disciplinas.forEach(disciplina => {
        const card = document.createElement('div');
        card.className = 'discipline-card';
        card.innerHTML = `
            <span class="discipline-sigla">${disciplina.sigla}</span>
            <div class="discipline-name">${disciplina.nome}</div>
            <div class="discipline-info">Clique para começar</div>
        `;

        card.addEventListener('click', () => {
            irParaQuiz(disciplina.id);
        });

        container.appendChild(card);
    });
}


// ===============================
// ATUALIZAR TÍTULO
// ===============================

function atualizarTitulo() {
    let nomesModulo = {
        '1': 'Módulo 1 - Nível 1',
        '2': 'Módulo 2 - Nível 2',
        '3': 'Módulo 3 - Nível 3'
    };

    document.getElementById('tituloModulo').textContent = nomesModulo[moduloAtual] || 'Módulo';
    document.getElementById('subtituloModulo').textContent = `Selecione uma disciplina para começar - ${disciplinas.length} disciplinas disponíveis`;
}


// ===============================
// IR PARA QUIZ
// ===============================

function irParaQuiz(disciplinaId) {
    window.location.href = `/quiz.html?disciplina=${disciplinaId}`;
}


// ===============================
// MOSTRAR ERRO
// ===============================

function mostrarErro(mensagem) {
    const container = document.getElementById('disciplinasContainer');
    container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #ff6b6b;">${mensagem}</p>`;
}


// ===============================
// BOTÃO VOLTAR
// ===============================

document.getElementById('voltarBtn').addEventListener('click', () => {
    window.location.href = '/modulo';
});


// ===============================
// INICIALIZAR
// ===============================

document.addEventListener('DOMContentLoaded', carregarDisciplinas);
