import { currentListItens, nameList } from "./loadJSON.js";

// Acionadores de eventos
const btnDeleteAll = document.getElementById("btn_delete_all");

verifySavedData();

// Verifica se há lista salva
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

    // Validar URL
    fetch(item.url)
      .then((response) => {
        if (!response.ok) {
          li.style.color = "red";
          return;
        }

        response
          .json()
          .then(() => {
            li.style.color = "green";
          })
          .catch((err) => {
            li.style.color = "red";
            console.log(`Erro ao carregar ${item.nameList}`);
          });
      })
      .catch((err) => {
        li.style.color = "red";
        console.log(`Erro ao carregar ${item.nameList}`);
      });

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

    listSalvedMenu.appendChild(li);
    li.appendChild(btnDeleteItem);
  });
}

// Salva dados para uso posterior
export default function saveList() {
  const url = document.getElementById("text").value;

  let lh = localStorage.getItem("listSave");

  // Verifica para não repetir
  if (lh != null) {
    let listSave = JSON.parse(lh);

    let repeatURL = listSave.filter((item) => item.url.includes(url));

    if (repeatURL.length > 0) {
      console.log("Esta lista já é existente");
      return;
    }
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

btnDeleteAll.addEventListener("click", deleteAllSavedLists);

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

async function loadAutoListSave() {}
