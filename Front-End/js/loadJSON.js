import { start, end, pageCount, itemsPerPage, resetCount } from "./index.js";

/* Precisa ser feito:
- Unificar listas salvas; 
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
    resetCount();

    console.log("Iniciando carregamento");

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao dar continuidade");
    }

    const list = await response.json();

    currentListItens.push(...list.downloads);
    console.log(list.name);

    nameList = list.name;

    resetTotalNumPages(currentListItens);

    createList(currentListItens);

    console.log("Processo de carregamento concluido");
  } catch (err) {
    console.log("Error ao validar URL", err);
  }
}

// Criar lista
export function createList(list, name) {
  const container = document.querySelector(".container");
  const txtStart = document.getElementById("start");
  const txtTotal = document.getElementById("total");

  txtStart.innerText = pageCount;
  txtTotal.innerText = totalNumPages;

  container.innerHTML = "";

  const reduceList = list.slice(start, end);

  reduceList.forEach((item, index) => {
    const div = document.createElement("div");

    const h3 = document.createElement("h3");
    h3.innerHTML = ++index + item.title;

    const h4 = document.createElement("h4");
    h4.innerHTML = name;

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
