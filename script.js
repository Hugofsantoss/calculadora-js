// ================== CONFIG ==================
let display = document.getElementById("display");
let historico = [];
let novoCalculo = false;

// ================== ADD ==================
function add(valor) {
  const operadores = ["+", "-", "*", "/"];

  // 👉 Se acabou de calcular
  if (novoCalculo) {

    // Se for operador → CONTINUA a conta
    if (operadores.includes(valor)) {
      novoCalculo = false;
    } 
    // Se for número → LIMPA tudo
    else {
      display.value = "";
      novoCalculo = false;
    }
  }

  const ultimo = display.value.slice(-1);

  if (operadores.includes(valor)) {
    if (operadores.includes(ultimo)) {
      display.value = display.value.slice(0, -1) + valor;
      return;
    }

    if (display.value === "" && valor !== "-") {
      return;
    }
  }

  display.value += valor;
  atualizarScroll();
}

// ================== LIMPAR ==================
function limpar() {
  display.value = "";
  novoCalculo = false;
}

// ================== APAGAR ==================
function apagar() {
  display.value = display.value.slice(0, -1);
  atualizarScroll();
}

// ================== CALCULAR ==================
function calcular() {
  try {
    let contaOriginal = display.value;

    // ❌ não pode terminar com operador
    if (/[+\-*/]$/.test(contaOriginal)) {
  contaOriginal = contaOriginal.slice(0, -1);
}

    let numeros = contaOriginal.split(/[\+\-\*\/]/).map(Number);
    let operadores = contaOriginal.match(/[\+\-\*\/]/g);

    // ❌ erro se tiver NaN
    if (numeros.some(isNaN)) {
      display.value = "Erro";
      return;
    }

    if (!operadores) {
      display.value = numeros[0];
      return;
    }

    // 🔥 prioridade: * e /
    for (let i = 0; i < operadores.length; i++) {
      if (operadores[i] === "*" || operadores[i] === "/") {
        let resultadoParcial =
          operadores[i] === "*"
            ? numeros[i] * numeros[i + 1]
            : numeros[i] / numeros[i + 1];

        numeros.splice(i, 2, resultadoParcial);
        operadores.splice(i, 1);
        i--;
      }
    }

    // 🔥 depois: + e -
    let resultado = numeros[0];

    for (let i = 0; i < operadores.length; i++) {
      if (operadores[i] === "+") {
        resultado += numeros[i + 1];
      } else {
        resultado -= numeros[i + 1];
      }
    
    }
    display.value = resultado;
    atualizarScroll();

novoCalculo = true;

salvarHistorico(contaOriginal, resultado);

    display.value = resultado;

  } catch {
    display.value = "Erro";
  }
}

function salvarHistorico(conta, resultado) {
  let contaFormatada = conta
    .replaceAll("*", "×")
    .replaceAll("/", "÷");

  historico.push(`${contaFormatada} = ${resultado}`);
  atualizarHistorico();
}

function atualizarHistorico() {
  const lista = document.getElementById("historico");
  if (!lista) return;

  lista.innerHTML = "";

  historico.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item;
    lista.appendChild(li);
  });
}

function limparHistorico() {
  historico = [];
  atualizarHistorico();
}

// ================== TECLADO ==================
document.addEventListener("keydown", function (event) {
  const tecla = event.key;

  if (tecla === "Enter") {
    event.preventDefault(); // 🔥 evita duplicação
    calcular();
    return;
  }

  if (!isNaN(tecla)) add(tecla);

  if (["+", "-", "*", "/"].includes(tecla)) add(tecla);

  if (tecla === "Backspace") apagar();

  if (tecla === "Escape") limpar();
});
function atualizarScroll() {
  display.scrollLeft = display.scrollWidth;
}
