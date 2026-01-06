import { saveList } from "./localstorage.js";
import { currentList, loadJSON, nameList } from "./loadJSON.js";

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

  list.forEach((obj) => {
    obj.downloads.forEach((item, index) => {
      if (index <= 2) {
        const name = document.createElement("p");
        name.innerHTML = item.title;

        const autor = document.createElement("p");
        autor.innerHTML = obj.name;

        const hr = document.createElement("hr");

        container.appendChild(autor);
        container.appendChild(name);
        container.appendChild(hr);
      }
    });
  });
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
  createElements(searchResult);

  console.log("Busca encerrada");
}
