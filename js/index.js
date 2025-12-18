import { saveList, deleteAllSavedLists } from "./localstorage.js";

// ================================================================================

// Acionadores de eventos
const btnHide = document.getElementById("btn_hide");
const btnSearch = document.getElementById("btn_search");
const btnRefrash = document.getElementById("btn_refrash");
const btnBack = document.getElementById("btn_back");
const btnNext = document.getElementById("btn_next");
const btnSave = document.getElementById("btn_save");
const btnDeleteAll = document.getElementById("btn_delete_all");

// Dados da lista atual
export let currentListItens = [];
let searchResult = undefined;
export let nameList = "";

// Contadores de paginas
let pageCount = 1;
let itemsPerPage = 8; // Limitador de itens por página
let start = 0;
let end = itemsPerPage;
let totalNumPages = 0; // vai ser incrementado ao inicializar uma lista

// ===============================================================================

btnHide.addEventListener("click", URLInput);

// Reinicia todos os valores de paginação
function resetCount() {
  start = 0;
  end = itemsPerPage;
  pageCount = 1;
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

  loadList(url);
}

// Validar e converter json
export async function loadList(url) {
  try {
    btnHide.disabled = true;
    resetCount();

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

btnSearch.addEventListener("click", searchByName);

// Busca pelo nome do item
function searchByName() {
  if (currentListItens[0] === undefined) {
    console.log("Não existe lista disponivel");
    return;
  }

  console.log("Busca iniciada");

  const inputName = document.getElementById("name").value;

  searchResult = currentListItens.filter((item) => {
    return item.title.toLowerCase().includes(inputName.toLowerCase());
  });

  resetCount();

  // Calcula um novo total de pagina
  totalNumPages = Math.ceil(searchResult.length / itemsPerPage);

  createList(searchResult);
}

btnRefrash.addEventListener("click", restoreList);

// Restaura lista
function restoreList() {
  if (currentListItens[0] === undefined) {
    console.log("Não existe lista disponivel");
    return;
  }

  // Remove lista criada pela pesquisa para evitar que quebre a paginação
  searchResult = undefined;

  resetCount();

  // Calcula um novo total de pagina
  totalNumPages = Math.ceil(currentListItens.length / itemsPerPage);

  createList(currentListItens);

  console.log("Lista restaurada");
}

btnBack.addEventListener("mousemove", returnItemsList);

// Voltar na paginação
function returnItemsList() {
  if (pageCount <= 1) {
    return;
  }

  pageCount--;

  start -= itemsPerPage;
  end -= itemsPerPage;

  const activeList = searchResult || currentListItens;
  createList(activeList);
}

btnNext.addEventListener("click", advanceItemsList);

// Avançar na paginação
function advanceItemsList() {
  if (pageCount >= totalNumPages) {
    return;
  }

  pageCount++;

  start = (pageCount - 1) * itemsPerPage;
  end = start + itemsPerPage;

  const activeList = searchResult || currentListItens;

  createList(activeList);
}

// =======================================================================================

// Localstorage
btnSave.addEventListener("click", saveList);
btnDeleteAll.addEventListener("click", deleteAllSavedLists);

// Precisa fazer!

// =======================================================================================
