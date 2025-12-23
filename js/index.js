import "./localstorage.js";
import {
  start,
  end,
  pageCount,
  itemsPerPage,
  resetCount,
  btnHide,
} from "./events.js";

/* Precisa ser feito:
- Unificar listas salvas;
- Definir para cada item nova proprieda de autor 
  com o nome da lista;
- Ajustar listas de salvos para evitar repetições.
- script de colar texto direto para o campo de entrada 
- Validar url de itens da lista salva
*/

// Dados da lista atual
export let currentListItens = [];
export let nameList = "";

export let totalNumPages = 0; // vai ser incrementado ao inicializar uma lista

export function resetTotalNumPages(list) {
  console.log("Total de itens da lista foi renovada");
  totalNumPages = Math.ceil(list.length / itemsPerPage);
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
    resetTotalNumPages(list.downloads);

    console.log("Processo de carregamento concluido");
    createList(currentListItens);
  } catch (error) {
    console.log("Error ao validar URL", error);
  } finally {
    btnHide.disabled = false;
  }
}

// Criar lista
export function createList(list) {
  const container = document.querySelector(".container");
  const txtStart = document.getElementById("start");
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
