// Necesario pegar nome e lista carregada para validar existência
// que deu tudo certo
import { currentListItens, nameList, loadList } from "./index.js";

// Verificar dados salvos
let lh = localStorage.getItem("listSave");

if (lh != null) {
  console.log("Dados salvos encontrados");
  loadSavedLists();
} else {
  console.log("Não há dados salvos");
}

// Salva dados para uso posterior
export function saveList() {
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
export function loadSavedLists() {
  console.log("Carregando lista salva...");

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

    const btnLoadList = document.createElement("button");
    btnLoadList.innerText = "Carregar";

    btnLoadList.addEventListener("click", () => {
      const selectItemFromList = JSON.parse(lh);
      const separateURLfromlist = selectItemFromList[index].url;

      loadList(separateURLfromlist);
    });

    listSalvedMenu.appendChild(li);
    li.appendChild(btnLoadList);
    li.appendChild(btnDeleteItem);
  });
}

// Apagar todas as listas salvas
export function deleteAllSavedLists() {
  lh = localStorage.getItem("listSave");

  if (lh == null) {
    console.log("Impossivel continuar, dados já foram apagados!");
    return;
  }

  localStorage.clear("listSave");

  loadSavedLists();

  console.log("Toda lista salva deletada");
}
