const btnHide = document.getElementById("btn_hide");

// Dados da lista atual
let currentListItens = [];
let nameList = "";

// Contadores de paginas
let pageCount = 1;
let start = 0;
let end = 8;
let totalNumPages = 0;

// Validar campos de entrada
function URLInput() {
  const url = document.getElementById("text").value;

  if (url === "" || !url.includes(".json")) {
    console.log("URL inválida, confira a fonte");
    return;
  }

  btnHide.disabled = true;

  loadList(url);
}

// Validar e converter json
async function loadList(url) {
  try {
    console.log("Iniciando carregamento");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao dar continuidade");
    }

    const list = await response.json();

    currentListItens = list.downloads;
    nameList = list.name;
    totalNumPages = Math.ceil(list.downloads.length / 8);

    console.log("Processo de carregamento concluido");
    createList(currentListItens);
  } catch (error) {
    console.log("Error ", error);
  } finally {
    btnHide.disabled = false;
  }
}

// Criar lista
function createList(list) {
  const container = document.querySelector(".container");
  const txtStart = document.getElementById("start");
  const txtEnd = document.getElementById("end");
  const txtTotal = document.getElementById("total");

  txtStart.innerText = pageCount;
  txtTotal.innerText = totalNumPages;

  container.innerHTML = "";

  const reduceList = list.slice(start, end);

  reduceList.forEach((item, index) => {
    const div = document.createElement("div");

    const h3 = document.createElement("h3");
    h3.innerHTML = ++index + item.title;

    const a = document.createElement("a");
    a.innerHTML = "link";
    a.href = item.uris[0];

    div.appendChild(h3);
    div.appendChild(a);
    container.appendChild(div);
  });
}

// Busca pelo nome do item
function searchByName() {
  if (currentListItens[0] === undefined) {
    console.log("Não existe lista disponivel");
    return;
  }

  console.log("Busca iniciada");

  const inputName = document.getElementById("name").value;

  const searchResult = currentListItens.filter((item) => {
    return item.title.toLowerCase().includes(inputName.toLowerCase());
  });

  createList(searchResult);
}

// Restaura lista
function restoreList() {
  if (currentListItens[0] === undefined) {
    console.log("Não existe lista disponivel");
    return;
  }

  console.log("Lista restaurada");

  start = 0;
  end = 8;

  createList(currentListItens);
}

function returnItemsList() {}

function advanceItemsList() {}
