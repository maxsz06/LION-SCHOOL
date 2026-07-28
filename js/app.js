'use strict'
// Ativa o "modo estrito" do JavaScript: evita erros silenciosos,
// proíbe variáveis não declaradas e deixa o código mais seguro

import { getUsuarios } from "./usuarios.js"
// Importa a função getUsuarios do arquivo usuarios.js
// Essa função provavelmente faz uma requisição (fetch) para buscar os alunos

let todosAlunos = []
// Variável global que vai guardar a lista de alunos já filtrados pelo curso
// Começa vazia e é preenchida depois de carregar os dados
// Precisa ficar fora das funções porque o filtro de status (configurarFiltroStatus)
// também precisa acessar essa lista

async function carregarAlunos() {
// Função principal, assíncrona porque precisa esperar (await) a resposta da API
// É ela quem organiza toda a sequência: buscar dados -> filtrar -> renderizar

    const alunos = await getUsuarios()
    // Chama a função importada e espera a resposta
    // "alunos" recebe o array completo de todos os alunos (de todos os cursos)

    const cursoId = pegarCursoId()
    // Pega o ID do curso que está sendo exibido, lido da URL da página

    todosAlunos = filtrarPorCurso(alunos, cursoId)
    // Filtra a lista completa, deixando só os alunos do curso atual
    // Guarda o resultado na variável global todosAlunos

    renderizarAlunos(todosAlunos)
    // Desenha na tela os cards de todos os alunos filtrados

    configurarFiltroStatus()
    // Ativa os cliques no filtro (ex: "cursando" / "finalizado")
}

function pegarCursoId(){
// Função que lê o parâmetro "curso" da URL
// Ex: se a URL for pagina.html?curso=3, ela retorna o número 3

    const params = new URLSearchParams(window.location.search)
    // Cria um objeto que facilita ler os parâmetros da URL (o que vem depois do "?")

    return Number(params.get('curso'))
    // Pega o valor do parâmetro "curso" (vem como texto/string)
    // e converte para número com Number(), porque curso_id nos dados é número
}

function filtrarPorCurso(alunos, cursoId){
// Recebe a lista completa de alunos e o id do curso desejado

    return alunos.filter(aluno => aluno.curso_id === cursoId)
    // .filter() percorre o array e mantém só os alunos
    // cujo curso_id seja igual ao cursoId da URL
}

function calcularMedia(desempenho){
// Recebe o array de desempenho de um aluno, ex: [{categoria, valor}, ...]

    const soma = desempenho.reduce((acc, item) => acc + item.valor, 0)
    // .reduce() soma todos os "valor" do array
    // "acc" é o acumulador (começa em 0) e vai somando item.valor a cada volta

    return (soma / desempenho.length).toFixed(1)
    // Divide a soma pela quantidade de itens = média
    // .toFixed(1) arredonda para 1 casa decimal e transforma em string (ex: "7.5")
}

function criarCardAluno(aluno){
// Recebe um objeto aluno e monta o elemento HTML (card) dele

    const card = document.createElement('div')
    // Cria uma nova <div> ainda vazia, só existe na memória (não está na página ainda)

    card.classList.add('card-aluno', aluno.status)
    // Adiciona duas classes CSS: "card-aluno" (estilo padrão)
    // e o status do aluno (ex: "cursando" ou "finalizado"), usado para estilizar/filtrar

    const media = calcularMedia(aluno.desempenho)
    // Calcula a média de notas desse aluno específico usando a função criada acima

    card.innerHTML = `
        <img src="${aluno.foto}" alt="${aluno.nome}">
        <h3>${aluno.nome}</h3>
        <p class="media">Média: ${media}</p>
    `
    // Insere o HTML interno do card: foto, nome e média
    // Usa template string (crases ``) para inserir os valores dinâmicos com ${}

    card.addEventListener('click', ()=>{
        window.location.href = `aluno.html?id=${aluno.id}`
    })
    // Adiciona um evento de clique no card
    // Quando clicado, redireciona o usuário para a página de detalhes do aluno,
    // passando o id dele na URL

    return card
    // Retorna o elemento pronto para ser inserido na página por quem chamou a função
}

function definirCorNota(valor){
// Função que decide qual classe CSS usar dependendo do valor da nota
// (obs: essa função está definida mas não está sendo usada em nenhum lugar do código ainda)

    if (valor < 50) return 'nota-baixa'
    // Se a nota for menor que 50, retorna a classe "nota-baixa"

    if (valor < 70) return 'nota-media'
    // Se for menor que 70 (e já passou do if anterior, ou seja, é >= 50), retorna "nota-media"

    return 'nota-alta'
    // Se não caiu em nenhum dos casos acima, é porque é >= 70, retorna "nota-alta"
}

function renderizarAlunos(alunos){
// Recebe uma lista de alunos e desenha os cards deles na tela

    const conteiner = document.getElementById('lista-alunos')
    // Busca no HTML o elemento onde os cards devem ser colocados

    conteiner.textContent = ''
    // Limpa o conteúdo atual do container
    // Isso evita que os cards antigos fiquem duplicados quando a lista for filtrada de novo

    alunos.forEach(aluno => {
        const card = criarCardAluno(aluno)
        conteiner.appendChild(card)
    });
    // Para cada aluno da lista: cria o card (usando a função de cima)
    // e adiciona esse card dentro do container na página
}

function configurarFiltroStatus(){
// Configura o comportamento de clique do menu de filtro por status

    const itens = document.querySelectorAll('.filtro-status li')
    // Pega todos os itens <li> dentro do elemento com classe "filtro-status"
    // (provavelmente cada <li> representa uma opção: "todos", "cursando", "finalizado")

    const detalhes = document.querySelector('.filtro-status')
    // Pega o elemento pai do filtro (deve ser uma tag <details>, já que usa .open/.removeAttribute('open'))

    itens.forEach(item => {
        item.addEventListener('click', () => {
            const status = item.dataset.status
            // Lê o atributo data-status do item clicado (ex: data-status="cursando")

            const alunosFiltrados = status
                ? todosAlunos.filter(aluno => aluno.status === status)
                : todosAlunos
            // Se existir um status (não for vazio/undefined), filtra todosAlunos por esse status
            // Se não existir (ex: opção "todos"), usa a lista completa sem filtrar

            renderizarAlunos(alunosFiltrados)
            // Redesenha a tela só com os alunos filtrados

            detalhes.removeAttribute('open')
            // Fecha o menu <details> depois de escolher a opção
        })
    })
}

const btnVoltar = document.getElementById('btn-voltar');

btnVoltar.addEventListener('click', () => {
    window.location.href = './index.html'; // ajuste o caminho conforme a página desejada
});

carregarAlunos()
// Chamada que dispara toda a execução do script
// É a primeira coisa que roda quando o arquivo é carregado