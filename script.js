let lojas = {};
let listaLojas = [];
let lojaAtual = 0;
let sorteados = [];
let sorteiosFeitos = 0;

const titulo = document.getElementById("titulo-loja");
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
      if (!lojas[unidade]) lojas[unidade] = [];
      lojas[unidade].push({ nome, numero });
    });

    listaLojas = Object.keys(lojas);
    iniciarLoja();
  });

function iniciarLoja() {
  sorteados = [];
  sorteiosFeitos = 0;
  resultadoFinal.classList.add("hidden");
  listaGanhadores.innerHTML = "";
  nomeEl.innerText = "Aguardando sorteio";
  numeroEl.innerText = "";
  titulo.innerText = listaLojas[lojaAtual];
}

btn.addEventListener("click", () => {
  if (sorteiosFeitos >= 5) return;

  btn.disabled = true;
  let contador = 0;

  const animacao = setInterval(() => {
    const pool = lojas[listaLojas[lojaAtual]];
    const temp = pool[Math.floor(Math.random() * pool.length)];
    nomeEl.innerText = formatarNome(temp.nome);
    numeroEl.innerText = temp.numero;
    contador++;

    if (contador > 20) {
      clearInterval(animacao);
      finalizarSorteio();
    }
  }, 100);
});

function finalizarSorteio() {
  const pool = lojas[listaLojas[lojaAtual]];
  const index = Math.floor(Math.random() * pool.length);
  const vencedor = pool.splice(index, 1)[0];

  sorteados.push(vencedor);
  nomeEl.innerText = formatarNome(vencedor.nome);
  numeroEl.innerText = vencedor.numero;

  sorteiosFeitos++;
  btn.disabled = false;

  if (sorteiosFeitos === 5) {
    mostrarResultado();
  }
}

function mostrarResultado() {
  resultadoFinal.classList.remove("hidden");

  sorteados.forEach(pessoa => {
    const li = document.createElement("li");
    li.innerText = `${formatarNome(pessoa.nome)} - ${pessoa.numero}`;
    listaGanhadores.appendChild(li);
  });

  setTimeout(() => {
    lojaAtual++;
    if (lojaAtual < listaLojas.length) {
      iniciarLoja();
    } else {
      titulo.innerText = "Sorteio finalizado";
      btn.disabled = true;
    }
  }, 6000);
}

function formatarNome(nome) {
  const partes = nome.trim().split(" ");
  return partes[0] + " " + partes[partes.length - 1];
}
