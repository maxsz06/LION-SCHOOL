'use strict'

import { getUsuarios } from "./usuarios.js"

async function carregarPerfil() {
    const alunos = await getUsuarios()
    const alunoId = pegarAlunoId()
    console.log(alunoId)
    const aluno = alunos.find(a => a.id === alunoId)

    if (!aluno) {
        document.getElementById('perfil-aluno').innerHTML = '<p>Aluno não encontrado.</p>'
        return
    }

    renderizarPerfil(aluno)
}

function pegarAlunoId(){
    const params = new URLSearchParams(window.location.search)
    return Number(params.get('id'))
}

function renderizarPerfil(aluno){
    const container = document.getElementById('perfil-aluno')

    const itensDesempenho = aluno.desempenho
        .map(item => `
            <div class="barra-item">
                <span class="valor-nota ${definirCorNota(item.valor)}">${item.valor}</span>
                <div class="barra-trilho">
                    <div class="barra-preenchida ${definirCorNota(item.valor)}" style="height: ${item.valor}%"></div>
                </div>
                <span class="categoria-nota">${item.categoria}</span>
            </div>
        `)
        .join('')

    container.innerHTML = `
        <img src="${aluno.foto}" alt="${aluno.nome}">
        <h2>${aluno.nome}</h2>
        <span class="status ${aluno.status}">${aluno.status}</span>
        <ul class="lista-desempenho">${itensDesempenho}</ul>
    `
}

carregarPerfil()