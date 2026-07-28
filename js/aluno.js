'use strict'

import { getUsuarios } from "./usuarios.js"

async function carregarPerfil() {
    const alunos = await getUsuarios()
    const alunoId = pegarAlunoId()
    const aluno = alunos.find(a => a.id === alunoId)

    if (!aluno) {
        document.getElementById('perfil-aluno').h1 = '<p>Aluno não encontrado.</p>'
        return
    }

    renderizarPerfil(aluno)
}

function pegarAlunoId(){
    const params = new URLSearchParams(window.location.search)
    return Number(params.get('id'))
}

function definirCorNota(valor){
    if (valor < 50) return 'nota-baixa'
    if (valor < 70) return 'nota-media'
    return 'nota-alta'
}

function renderizarPerfil(aluno){
    const container = document.getElementById('perfil-aluno')

    const barras = aluno.desempenho
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
        <div class="card-foto">
            <img src="${aluno.foto}" alt="${aluno.nome}">
            <h2>${aluno.nome}</h2>
        </div>
        <div class="card-grafico">
            <div class="grafico-barras">
                ${barras}
            </div>
        </div>
    `
}

carregarPerfil()