import { saveList } from "./localstorage.js";
import { currentList, loadJSON } from "./loadJSON.js";

// Contadores
export const totalByPages = 8;
let start = 0;
let end = totalByPages;
let currentPage = 1;
let calcTotalByPages = 0;

// acionadores de evento
const btnAdd = document.getElementById("btn_add");
const btnPaste = document.getElementById("btn_paste");
const btnSearch = document.getElementById("btn_search");
const btnRefrash = document.getElementById("btn_refrash");
const btnBack = document.getElementById("btn_back");
const btnNext = document.getElementById("btn_next");

// Lista de modelo para pesquisa
let searchResult = [];

btnAdd.addEventListener("click", loadURL);

async function loadURL() {
  const URL = document.getElementById("url_input");

  if (URL.value === "" || !URL.value.includes(".json")) {
    console.log("URL inválida!");
    return;
  }

  // Carrega URL
  await loadJSON(URL.value);

  // Após o carregamento salva nome e url
  saveList();
}

// Criar elementos no DOM
export function createElements(list) {
  const container = document.getElementById("container");
  container.innerHTML = "";

  const countPagination = document.getElementById("start");
  countPagination.innerHTML = currentPage;

  const totalNumberOfPages = document.getElementById("total");

  let reformList = [];

  // Reformula a lista
  list.forEach((obj) => {
    obj.downloads.forEach((item, i) => {
      reformList.push({
        name: obj.name,
        ...item,
      });
    });
  });

  // Calcula e define total de paginas
  calcTotalByPages = Math.ceil(reformList.length / totalByPages);

  totalNumberOfPages.innerHTML = `${calcTotalByPages} `;

  const cutlist = reformList.slice(start, end);

  cutlist.forEach((item) => {
    const name = document.createElement("p");
    name.innerHTML = item.title;

    const autor = document.createElement("p");
    autor.innerHTML = item.name;

    const hr = document.createElement("hr");

    container.appendChild(autor);
    container.appendChild(name);
    container.appendChild(hr);
  });
}

function resetPagination(list) {
  start = 0;
  end = totalByPages;
  currentPage = 1;

  createElements(list);
}

btnPaste.addEventListener("click", pasteText);

// Cola texto copiado no campo de adicionar
async function pasteText() {
  const URL = document.getElementById("url_input");

  try {
    const textCopied = await navigator.clipboard.readText();

    URL.value = textCopied;

    console.log("Texto colado!");
  } catch (error) {
    console.log(error);
  }
}

btnSearch.addEventListener("click", searchByName);

// Busca pelo nome do item
function searchByName() {
  console.log("Busca iniciada");

  // Limpa todo o DOM
  const container = document.getElementById("container");
  container.innerHTML = "";

  // Limpa o historico de pesquisa
  searchResult = [];

  // Variavel para armazenar o filter
  let res = undefined;

  // Campo de input do nome a ser procurado
  const inputName = document.getElementById("name").value;

  // Busca pelo nome do item e também salva o nome do pack
  currentList.forEach((obj) => {
    res = obj.downloads.filter((item) => {
      return item.title.toLowerCase().includes(inputName.toLowerCase());
    });

    searchResult.push({ name: obj.name, downloads: res });
  });

  // Cria lista no DOM
  resetPagination(searchResult);

  console.log("Busca encerrada");
}

btnRefrash.addEventListener("click", restoreList);

// Restaura lista
function restoreList() {
  if (currentList[0] === undefined) {
    console.log("Não existe lista disponivel");
    return;
  }

  // Remove lista criada pela pesquisa para evitar que quebre a paginação
  searchResult = [];

  resetPagination(currentList);

  console.log("Lista restaurada");
}

btnNext.addEventListener("click", advanceItemsList);

// Avançar na paginação
function advanceItemsList() {
  // Evita utrapassar o limite
  if (currentPage === calcTotalByPages) {
    console.log("Você chegou ao fim!");
    return;
  }

  // Adiciona um ao contato de pagina
  currentPage++;

  // Calcula para avança exibir o proximo valor
  start = (currentPage - 1) * totalByPages;
  end = start + totalByPages;

  // Caso tenha feito uma busca toda lista é preservada
  if (searchResult.length > 0) {
    createElements(searchResult);
    return;
  }

  createElements(currentList);
}

btnBack.addEventListener("click", returnItemsList);

function returnItemsList() {
  // Evita utrapassar o limite
  if (currentPage <= 1) {
    console.log("Você voltou ao inicio!");
    return;
  }

  currentPage--;
  start -= totalByPages;
  end -= totalByPages;

  // Caso tenha feito uma busca toda lista é preservada
  if (searchResult.length > 0) {
    createElements(searchResult);
    return;
  }

  createElements(currentList);
}
