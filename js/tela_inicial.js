'use strict'

import { getCursos } from "./api/sever.js"

async function exibirCursos() {
  const cursos = await getCursos()
  const container = document.querySelector('.cards-cursos')

  if (!container) {
    console.error('Elemento .cards-cursos não encontrado no DOM!')
    return
  }

  container.innerHTML = ''

  cursos.forEach(curso => {
    const link = document.createElement('a')
    link.href = `./estudantes.html?curso=${curso.id}`
    link.className = 'card-curso'

    link.innerHTML = `
      <img src="${curso.icon}" alt="${curso.nome}" width="40" height="40">
      <span>${curso.sigla}</span>
    `

    container.appendChild(link)
  })
}

exibirCursos()