import { currentListItens, nameList, loadList } from "./index.js";

// Acionadores de eventos
const btnSave = document.getElementById("btn_save");
const btnDeleteAll = document.getElementById("btn_delete_all");

verifySavedData();

function verifySavedData() {
  // Verificar dados salvos
  let lh = localStorage.getItem("listSave");

  if (lh != null) {
    console.log("Dados salvos encontrados");
    loadSavedLists();
  } else {
    console.log("Não há dados salvos");
  }
}

// Localstorage events
btnSave.addEventListener("click", saveList);
btnDeleteAll.addEventListener("click", deleteAllSavedLists);

// Com listas salvas, gera uma lista de atalho
function loadSavedLists() {
  console.log("Carregando lista salva...");

  const listSalvedMenu = document.getElementById("list_saved_items");

  let lh = localStorage.getItem("listSave");

  listSalvedMenu.innerHTML = "";

  let listSaves = JSON.parse(lh);

  listSaves.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerText = `${item.nameList}`;

    const btnDeleteItem = document.createElement("button");
    btnDeleteItem.innerText = "Deletar";

    btnDeleteItem.addEventListener("click", () => {
      listSaves.splice(index, 1);

      // Caso não tenha mais itens, deixo nulo como padrão
      if (listSaves[0] == undefined) {
        localStorage.clear("listSave");
        listSalvedMenu.innerHTML = "";
      } else {
        localStorage.setItem("listSave", JSON.stringify(listSaves));
      }

      verifySavedData();
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

// Salva dados para uso posterior
function saveList() {
  if (currentListItens[0] === undefined) {
    console.log("Não existe lista disponivel");
    return;
  }

  let lh = localStorage.getItem("listSave");

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

// Apagar todas as listas salvas
function deleteAllSavedLists() {
  const listSalvedMenu = document.getElementById("list_saved_items");

  let lh = localStorage.getItem("listSave");

  if (lh == null) {
    console.log("Não existe dados salvos!");
    return;
  }

  localStorage.clear("listSave");

  listSalvedMenu.innerHTML = "";

  console.log("Toda lista salva deletada");
}
