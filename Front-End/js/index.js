import savelist from "./localstorage.js";
import {
  loadList,
  createList,
  currentListItens,
  totalNumPages,
  resetTotalNumPages,
} from "./loadJSON.js";

// Acionadores de eventos
export const btnHide = document.getElementById("btn_hide");
const btnSearch = document.getElementById("btn_search");
const btnRefrash = document.getElementById("btn_refrash");
const btnBack = document.getElementById("btn_back");
const btnNext = document.getElementById("btn_next");
const btnPasteText = document.getElementById("paste_text");

// Define como UNDEFINED até ser usada ou pare de ser usada
let searchResult = undefined;

// Contadores de paginas
export let pageCount = 1;
export let itemsPerPage = 8; // Limitador de itens por página
export let start = 0;
export let end = itemsPerPage;

// Reinicia todos os valores de paginação
export function resetCount() {
  start = 0;
  end = itemsPerPage;
  pageCount = 1;
}

autoLoad();

function autoLoad() {
  let ls = localStorage.getItem("listSave");
  ls = JSON.parse(ls);

  if (ls == null) {
    console.log("Você não possui listas salvas");
    return;
  }
  

  ls.forEach((elem) => {
    loadList(elem.url);
  });
}

btnHide.addEventListener("click", addURL);

// Validar campos de entrada
async function addURL() {
  const url = document.getElementById("text").value;

  if (url === "" || !url.includes(".json")) {
    console.log("URL inválida, confira a fonte");
    return;
  }

  start = 0;
  end = itemsPerPage;

  await loadList(url);
  savelist();
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
  resetTotalNumPages(searchResult);

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
  resetTotalNumPages(currentListItens);

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

btnNext.addEventListener("mousemove", advanceItemsList);

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

btnPasteText.addEventListener("click", pasteText);

// Cola texto copiado no campo de URL
async function pasteText() {
  const url = document.getElementById("text");
  try {
    const textCopied = await navigator.clipboard.readText();

    url.value = textCopied;

    console.log("Texto colado!");
  } catch (err) {
    console.log("Erro, não foi possivel colar texto!");
  }
}
