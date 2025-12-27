import {
  currentListItens,
  nameList,
  loadList,
  createList,
} from "./loadJSON.js";

// Acionadores de eventos
const btnSave = document.getElementById("btn_save");
const btnDeleteAll = document.getElementById("btn_delete_all");
const enableLoadAllOnStartup = document.getElementById(
  "load_everything_on_startup"
);

verifySavedData();

function verifySavedData() {
  // Verificar dados salvos
  let lh = localStorage.getItem("listSave");

  if (lh != null) {
    console.log("Dados salvos encontrados");
    loadSavedLists();
    checkAutomaticCharging();
  } else {
    console.log("Não há dados salvos");
  }
}

// Habilita e Desabilita carregamento automatico
enableLoadAllOnStartup.addEventListener("change", () => {
  let checkStatus = enableLoadAllOnStartup.checked;

  localStorage.setItem("loadAuto", JSON.stringify(checkStatus));

  console.log(`Carregamento automatico marcado como: ${checkStatus}`);
});

// Verifica o status e carrega as listas
function checkAutomaticCharging() {
  let ls = localStorage.getItem("loadAuto");

  let loadAuto = JSON.parse(ls);

  enableLoadAllOnStartup.checked = loadAuto;

  if (loadAuto) {
    loadAllLists();
  }
}

// Carrega todas as URLs salvas
function loadAllLists() {
  const ls = localStorage.getItem("listSave");
  const listSave = JSON.parse(ls);

  listSave.forEach((item) => {
    // loadSaveList(item.url);
    console.log(item.url);
  });
}

// async function loadSaveList(url) {
//   try {
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error("Erro ao dar continuidade na lista aalva");
//     }

//     const list = await response.json();

//     createList(list.downloads);
//   } catch (err) {}
// }

// Habilita e desabilita buttoes do menu
function buttonsDisabled() {
  const btnsDisabled = document.querySelectorAll("#btn_disabled");
  btnsDisabled.forEach((btn) => {
    btn.disabled ? (btn.disabled = false) : (btn.disabled = true);
  });
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
          .then((list) => {
            li.style.color = "green";
          })
          .catch((err) => {
            li.style.color = "red";
            console.log(`Erro ao carregar ${item.nameList}`);
          });
      })
      .catch((erro) => {
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

    const btnLoadList = document.createElement("button");
    btnLoadList.setAttribute("id", "btn_disabled");
    btnLoadList.innerText = "Carregar";

    btnLoadList.addEventListener("click", async function () {
      const selectItemFromList = JSON.parse(lh);
      const separateURLfromlist = selectItemFromList[index].url;

      buttonsDisabled();

      await loadList(separateURLfromlist);

      buttonsDisabled();
    });

    listSalvedMenu.appendChild(li);
    li.appendChild(btnLoadList);
    li.appendChild(btnDeleteItem);
  });
}

btnSave.addEventListener("click", saveList);

// Salva dados para uso posterior
function saveList() {
  if (currentListItens[0] === undefined) {
    console.log("Não existe lista disponivel");
    return;
  }

  const url = document.getElementById("text").value;

  if (url === "" || !url.includes(".json")) {
    console.log("Campo de URL vázia");
    return;
  }

  let lh = localStorage.getItem("listSave");

  if (lh != null) {
    // Verifica se ja possui a lista salva
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
