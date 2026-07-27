'use strict'

import { getUsuarios } from "./usuarios.js"

async function carregarAlunos() {
    const alunos = await getUsuarios()
    console.log( await getUsuarios())
    renderizarAlunos(alunos)
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

    return card
}

function renderizarAlunos(alunos){
    const conteiner = document.getElementById('lista-alunos')
    conteiner.innerHTML = ''

    alunos.forEach(aluno => {
        const card = criarCardAluno(aluno)
        conteiner.appendChild(card)
    });
}

carregarAlunos()