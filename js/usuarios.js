'use strict'

const URL = 'https://lion-school-phbo.onrender.com/alunos'

export async function getUsuarios() {
    const response = await fetch(URL) // Resposta do servidor
    if (!response.ok)
        throw new Error('Erro ao buscar usuario')
    return await response.json()
}