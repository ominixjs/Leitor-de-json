const btnHide = document.getElementById("btn_hide");

// Dados da lista atual
let currentListItens = [];
let nameList = "";

// Contadores de paginas
let pageCount = 1;
let itemsPerPage = 8; // Limitador de itens por página
let start = 0;
let end = itemsPerPage;
let totalNumPages = 0; // vai ser incrementado ao inicializar uma lista

// Dados salvos
let lh = localStorage.getItem("listSave");
console.log(lh);

if (lh != null) {
  console.log("Dados salvos encontrados");
  console.log(lh);
  loadSavedLists();
} else {
  console.log("Não há dados salvos");
}

// Salva dados para uso posterior
function saveList() {
  if (currentListItens[0] == undefined) {
    console.log("Não existe lista carregada");
    return;
  }

  // Criar logica de salvamento...

  const saved = {
    name: nameList,
  };

  localStorage.setItem("listSave", JSON.stringify(saved));
  console.log(`Lista ${nameList} salva!`);
}

// Com listas salvas, gera um menu de atalho
function loadSavedLists() {
  const salvedMenu = document.getElementById("list_saved_items");

  salvedMenu.innerHTML = "";

  saved.forEach((items) => {
    const li = document.createElement("li");
    li.innerText = items.name;

    salvedMenu.appendChild(li);
  });
}

// Validar campos de entrada
function URLInput() {
  const url = document.getElementById("text").value;

  if (url === "" || !url.includes(".json")) {
    console.log("URL inválida, confira a fonte");
    return;
  }

  start = 0;
  end = itemsPerPage;

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
  end = itemsPerPage;
  pageCount = 1;

  createList(currentListItens);
}

// Voltar na paginação
function returnItemsList() {
  if (pageCount <= 1) {
    return;
  }

  pageCount--;

  start -= itemsPerPage;
  end -= itemsPerPage;

  createList(currentListItens);
}

// Avançar na paginação
function advanceItemsList() {
  if (pageCount >= totalNumPages) {
    return;
  }

  pageCount++;

  start = (pageCount - 1) * itemsPerPage;
  end = start + itemsPerPage;

  createList(currentListItens);
}
