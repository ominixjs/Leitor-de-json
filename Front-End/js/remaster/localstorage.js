import { createElements } from "./index.js";
import { loadJSON, nameList, currentList } from "./loadJSON.js";

loadListSave();

// Carregamento automático de listas salvas
async function loadListSave() {
  // Carrega lista salvas no localstorage
  let ls = localStorage.getItem("listSave");
  ls = JSON.parse(ls);

  // Verifica se há itens salvos
  if (ls == null) {
    console.log("Lista vázia");
    return;
  }

  // Faz iterações com a lista
  for (const item of ls) {
    await loadJSON(item.URL);
  }

  // Cria lista no DOM
  createElements(currentList);
}

// Salva dados para uso posterior
export function saveList() {
  const URL = document.getElementById("url_input").value;

  let ls = localStorage.getItem("listSave");

  // Verifica para não repetir
  if (ls != null) {
    let listSave = JSON.parse(ls);

    let repeatURL = listSave.filter((item) => item.URL.includes(URL));

    if (repeatURL.length > 0) {
      console.log("Esta lista já foi adicionada");
      return;
    }
  }

  // Modelo de objeto salvo
  const saved = {
    nameList,
    URL,
  };

  // Processo de salvamento
  if (ls == null) {
    // Primeiro salvamento cria uma array
    let createFirstArray = [];

    createFirstArray.push(saved);

    localStorage.setItem("listSave", JSON.stringify(createFirstArray));

    console.log("Primeiro salvamento no banco de dados");
  } else {
    // Após o primeiro salvamento adiciona o item a array existente
    let dataSave = JSON.parse(ls);

    dataSave.push(saved);

    dataSave = JSON.stringify(dataSave);

    localStorage.setItem("listSave", dataSave);

    console.log("Mais uma lista salva!");
  }

  console.log(`Lista ${nameList} salva!`);
}
