'use strict'
// Ativa o modo estrito do JavaScript, tornando o código mais seguro
// e evitando erros silenciosos (ex: variáveis não declaradas)

import { getUsuarios } from "./usuarios.js"
// Importa a função que busca a lista de alunos na API/arquivo de dados
// (mesma função usada na página de listagem)

async function carregarPerfil() {
// Função principal desta página, assíncrona porque precisa esperar os dados da API
// Ela busca o aluno específico e manda renderizar o perfil dele

    const alunos = await getUsuarios()
    // Busca TODOS os alunos (a API não filtra por id, então precisa trazer tudo)

    const alunoId = pegarAlunoId()
    // Lê o id do aluno que veio na URL (ex: aluno.html?id=5)

    const aluno = alunos.find(a => a.id === alunoId)
    // Procura dentro do array o aluno cujo id bate com o id da URL
    // .find() retorna o primeiro que encontrar, ou undefined se não achar nenhum

    if (!aluno) {
        document.getElementById('perfil-aluno').h1 = '<p>Aluno não encontrado.</p>'
        return
    }
    // Se não encontrou nenhum aluno com esse id (aluno é undefined),
    // tenta mostrar uma mensagem de erro e interrompe a função com "return"

    renderizarPerfil(aluno)
    // Se encontrou o aluno, chama a função que desenha o perfil dele na tela
}

function pegarAlunoId(){
// Função que extrai o id do aluno a partir dos parâmetros da URL

    const params = new URLSearchParams(window.location.search)
    // Cria um objeto para ler facilmente os parâmetros depois do "?" na URL

    return Number(params.get('id'))
    // Pega o valor do parâmetro "id" (vem como texto) e converte para número
}

function definirCorNota(valor){
// Decide qual classe CSS usar de acordo com o valor da nota
// (aqui ela É usada, diferente do código anterior)

    if (valor < 50) return 'nota-baixa'
    // Nota menor que 50 → classe de nota baixa (provavelmente vermelho)

    if (valor < 70) return 'nota-media'
    // Nota entre 50 e 69 → classe de nota média (provavelmente amarelo)

    return 'nota-alta'
    // Nota 70 ou mais → classe de nota alta (provavelmente verde)
}

function renderizarPerfil(aluno){
// Recebe o objeto do aluno encontrado e monta toda a página de perfil

    const container = document.getElementById('perfil-aluno')
    // Pega o elemento HTML onde o perfil inteiro vai ser inserido

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
    // Para cada item do array desempenho (ex: {categoria: "Frontend", valor: 80}):
    // - .map() transforma cada item em um pedaço de HTML (uma "barra" do gráfico)
    // - o número da nota aparece colorido conforme definirCorNota()
    // - a barra visual usa style="height: X%" pra representar o valor graficamente
    //   (quanto maior a nota, mais alta a barra)
    // - .join('') junta todos os pedaços de HTML gerados em uma única string
    //   (sem isso, "barras" seria um array de strings, não uma string só)

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
    // Monta a estrutura final do perfil: foto + nome do aluno,
    // e o gráfico de barras com todas as categorias de desempenho
    // ${barras} insere ali dentro toda aquela string HTML montada acima
}

carregarPerfil()
// Dispara a execução assim que o script é carregado