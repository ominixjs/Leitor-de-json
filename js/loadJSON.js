import "./localstorage.js";
import {
  start,
  end,
  pageCount,
  itemsPerPage,
  resetCount,
  btnHide,
} from "./index.js";

/* Precisa ser feito:
- Unificar listas salvas;
- Definir para cada item nova proprieda de autor 
  com o nome da lista;
- script de colar texto direto para o campo de entrada 
- Validar url de itens da lista salva
- Verificar internet
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
  } catch (err) {
    console.log("Error ao validar URL", err);
  } finally {
    btnHide.disabled = false;
  }
}

// Criar lista
export function createList(list) {
  const container = document.querySelector(".container");
  const txtStart = document.getElementById("start");
  const txtTotal = document.getElementById("total");

  // nameJson.innerText = nameList;
  txtStart.innerText = pageCount;
  txtTotal.innerText = totalNumPages;

  container.innerHTML = "";

  const reduceList = list.slice(start, end);

  reduceList.forEach((item, index) => {
    const div = document.createElement("div");

    const h3 = document.createElement("h3");
    h3.innerHTML = ++index + item.title;

    const h4 = document.createElement("h4");
    h4.innerHTML = nameList;

    const dateItem = document.createElement("p");
    dateItem.innerHTML = item.uploadDate
      .replace(/\-/gi, "/")
      .replace(/[t, z]/gi, " ")
      .replace("000", "00");

    const a = document.createElement("a");
    a.innerHTML = "Torrent";
    a.href = item.uris[0];

    const btnCopy = document.createElement("button");
    btnCopy.innerHTML = "Copiar";

    btnCopy.addEventListener("click", () => {
      navigator.clipboard
        .writeText(item.uris[0])
        .then(() => {
          console.log("Texto copiado");
        })
        .catch((err) => {
          console.log("Erro, Texto não copiado!");
        });
    });

    const hr = document.createElement("hr");

    div.appendChild(h3);
    div.appendChild(dateItem);
    div.appendChild(h4);
    div.appendChild(a);
    div.appendChild(btnCopy);
    div.appendChild(hr);
    container.appendChild(div);
  });
}
