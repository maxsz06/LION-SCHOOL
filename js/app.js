'use strict'

import { getUsuarios } from "./usuarios.js"

async function carregarAlunos() {
    const alunos = await getUsuarios()
    const cursoId = pegarCursoId()
    const alunosFiltrados = filtrarPorCurso(alunos, cursoId)
    renderizarAlunos(alunosFiltrados)
}

function pegarCursoId(){
    const params = new URLSearchParams(window.location.search)
    return Number(params.get('curso'))
}

function filtrarPorCurso(alunos, cursoId){
    return alunos.filter(aluno => aluno.curso_id === cursoId)
}

function calcularMedia(desempenho){
    const soma = desempenho.reduce((acc, item) => acc + item.valor, 0)
    return (soma / desempenho.length).toFixed(1)
}

function criarCardAluno(aluno){
    const card = document.createElement('div')
    card.classList.add('card-aluno', aluno.status)

    const media = calcularMedia(aluno.desempenho)

    card.innerHTML = `
        <img src="${aluno.foto}" alt="${aluno.nome}">
        <h3>${aluno.nome}</h3>
        <p class="media">Média: ${media}</p>
    `
    card.addEventListener('click', ()=>{
        window.location.href = `aluno.html?id=${aluno.id}`
    })
    return card
}

function definirCorNota(valor){
    if (valor < 50) return 'nota-baixa'
    if (valor < 70) return 'nota-media'
    return 'nota-alta'
}


function renderizarAlunos(alunos){
    const conteiner = document.getElementById('lista-alunos')
    conteiner.textContent = ''

    alunos.forEach(aluno => {
        const card = criarCardAluno(aluno)
        conteiner.appendChild(card)
    });
}

carregarAlunos()