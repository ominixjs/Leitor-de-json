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

// ===========================================================================================================

// Verificar dados salvos
let lh = localStorage.getItem("listSave");

if (lh != null) {
  console.log("Dados salvos encontrados");
  loadSavedLists();
} else {
  console.log("Não há dados salvos");
}

// Salva dados para uso posterior
function saveList() {
  if (currentListItens[0] === undefined) {
    console.log("Não existe lista disponivel");
    return;
  }

  const url = document.getElementById("text").value;

  if (url === "" || !url.includes(".json")) {
    console.log("Campo de URL vázia");
    return;
  }

  const saved = {
    nameList,
    url,
  };

  if (lh == null) {
    let createFirstArray = [];

    createFirstArray.push(saved);

    localStorage.setItem("listSave", JSON.stringify(createFirstArray));

    console.log("Primeiro salvamento no banco de dados");
  } else {
    let dataSave = JSON.parse(lh);

    dataSave.push(saved);

    dataSave = JSON.stringify(dataSave);

    localStorage.setItem("listSave", dataSave);

    console.log("Mais uma lista salva!");
  }

  loadSavedLists();
  console.log(`Lista ${nameList} salva!`);
}

// Com listas salvas, gera uma lista de atalho
function loadSavedLists() {
  console.log("Carregando lista salvas...");

  const listSalvedMenu = document.getElementById("list_saved_items");

  lh = localStorage.getItem("listSave");

  if (lh == null) {
    listSalvedMenu.innerHTML = "";
    console.log("Lista de dados salvos está vázia!");
    return;
  }

  listSalvedMenu.innerHTML = "";

  const listSaves = JSON.parse(lh);

  listSaves.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerText = item.nameList;

    const btnDeleteItem = document.createElement("button");
    btnDeleteItem.innerText = "Deletar";

    btnDeleteItem.addEventListener("click", () => {
      listSaves.splice(index, 1);
      localStorage.setItem("listSave", JSON.stringify(listSaves));
      loadSavedLists();
    });

    listSalvedMenu.appendChild(li);
    li.appendChild(btnDeleteItem);
  });
}

// Apagar todas as listas salvas
function deleteAllSavedLists() {
  lh = localStorage.getItem("listSave");

  if (lh == null) {
    console.log("Impossivel continuar, dados já foram apagados!");
    return;
  }

  localStorage.clear("listSave");

  loadSavedLists();

  console.log("Toda lista salva deletada");
}

// Procedimento de carregar listas salvas

// =======================================================================================

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
    console.log("Error ao validar URL", error);
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
  const nameJson = document.getElementById("nameList");

  nameJson.innerText = nameList;
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
