let dadosPorLoja = {};
let lojaSelecionada = "";
let sorteados = [];
let sorteiosFeitos = 0;

const selectUnidade = document.getElementById("select-unidade");
const titulo = document.getElementById("titulo-loja");
const roleta = document.getElementById("roleta");
const nomeEl = document.getElementById("nome");
const numeroEl = document.getElementById("numero");
const btn = document.getElementById("btnSortear");
const resultadoFinal = document.getElementById("resultado-final");
const listaGanhadores = document.getElementById("lista-ganhadores");

/* CARREGA CSV */
fetch("lista.csv")
  .then(res => res.text())
  .then(texto => {
    const linhas = texto.trim().split("\n").slice(1);

    linhas.forEach(linha => {
      const [nome, numero, unidade] = linha.split(",");
      if (!dadosPorLoja[unidade]) dadosPorLoja[unidade] = [];
      dadosPorLoja[unidade].push({ nome, numero });
    });

    Object.keys(dadosPorLoja).forEach(unidade => {
      const option = document.createElement("option");
      option.value = unidade;
      option.textContent = unidade;
      selectUnidade.appendChild(option);
    });
  });

/* SELEÇÃO DA UNIDADE */
selectUnidade.addEventListener("change", () => {
  lojaSelecionada = selectUnidade.value;
  if (!lojaSelecionada) return;

  sorteados = [];
  sorteiosFeitos = 0;
  titulo.innerText = lojaSelecionada;
  nomeEl.innerText = "Preparando sorteio";
  numeroEl.innerText = "";
  resultadoFinal.classList.add("hidden");
  roleta.classList.remove("hidden");
  selectUnidade.classList.remove("hidden");
  btn.innerText = "SORTEAR";
  btn.disabled = false;
});

/* BOTÃO PRINCIPAL */
btn.addEventListener("click", () => {
  if (!lojaSelecionada) return;

  if (sorteiosFeitos === 5) {
    resetarParaNovaUnidade();
    return;
  }

  btn.disabled = true;
  executarSorteios();
});

/* EXECUTA OS 5 SORTEIOS AUTOMATICAMENTE */
function executarSorteios() {
  if (sorteiosFeitos >= 5) {
    exibirResultadoFinal();
    return;
  }

  let contador = 0;
  const pool = dadosPorLoja[lojaSelecionada];

  const animacao = setInterval(() => {
    const temp = pool[Math.floor(Math.random() * pool.length)];
    nomeEl.innerText = formatarNome(temp.nome);
    numeroEl.innerText = temp.numero;
    contador++;

    // 🔥 MAIS RÁPIDO
    if (contador > 12) {
      clearInterval(animacao);
      finalizarSorteio();
    }
  }, 60); // velocidade da roleta
}

function finalizarSorteio() {
  const pool = dadosPorLoja[lojaSelecionada];
  const index = Math.floor(Math.random() * pool.length);
  const vencedor = pool.splice(index, 1)[0];

  sorteados.push(vencedor);
  sorteiosFeitos++;

  nomeEl.innerText = formatarNome(vencedor.nome);
  numeroEl.innerText = vencedor.numero;

  // pequeno delay entre sorteios
  setTimeout(() => {
    executarSorteios();
  }, 700);
}

function exibirResultadoFinal() {
  roleta.classList.add("hidden");
  selectUnidade.classList.add("hidden");
  resultadoFinal.classList.remove("hidden");
  btn.innerText = "SORTEAR OUTRA UNIDADE";
  btn.disabled = false;

  listaGanhadores.innerHTML = "";
  sorteados.forEach(p => {
    const li = document.createElement("li");
    li.innerText = `${formatarNome(p.nome)} - ${p.numero}`;
    listaGanhadores.appendChild(li);
  });
}

function resetarParaNovaUnidade() {
  lojaSelecionada = "";
  sorteados = [];
  sorteiosFeitos = 0;
  selectUnidade.value = "";
  selectUnidade.classList.remove("hidden");
  roleta.classList.remove("hidden");
  resultadoFinal.classList.add("hidden");
  titulo.innerText = "";
  nomeEl.innerText = "Aguardando sorteio";
  numeroEl.innerText = "";
  btn.innerText = "SORTEAR";
  btn.disabled = true;
}

function formatarNome(nome) {
  const partes = nome.trim().split(" ");
  return partes[0] + " " + partes[partes.length - 1];
}
