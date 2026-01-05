import { saveList } from "./localstorage.js";
import { loadJSON } from "./loadJSON.js";

// FAZER
// Manutenção no carregamento no DOM

// acionadores de evento
const btnAdd = document.getElementById("btn_add");

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
