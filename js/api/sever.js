'use strict'

const URL = 'https://lion-school-phbo.onrender.com/alunos'
const URLCursos = 'https://lion-school-phbo.onrender.com/cursos'

export async function getUsuarios() {
    const response = await fetch(URL) // Resposta do servidor
    if (!response.ok)
        throw new Error('Erro ao buscar usuario')
    return await response.json()
}

export async function getCursos() {
  const resposta = await fetch(URLCursos) // troque pela URL real da API
  if (!resposta.ok) {
    throw new Error('Erro ao buscar cursos')
  }
  return await resposta.json()
}