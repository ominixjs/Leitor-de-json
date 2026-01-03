import { loadJSON, nameList } from "./loadJSON.js";

loadListSave();

// Carregamento automático de listas salvas
function loadListSave() {
  let ls = localStorage.getItem("listSave");
  ls = JSON.parse(ls);

  if (ls == null) {
    console.log("Lista vázia");
    return;
  }

  ls.forEach((item) => {
    loadJSON(item.URL);
  });

  console.log(1);
  
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

  if (ls == null) {
    let createFirstArray = [];

    createFirstArray.push(saved);

    localStorage.setItem("listSave", JSON.stringify(createFirstArray));

    console.log("Primeiro salvamento no banco de dados");
  } else {
    let dataSave = JSON.parse(ls);

    dataSave.push(saved);

    dataSave = JSON.stringify(dataSave);

    localStorage.setItem("listSave", dataSave);

    console.log("Mais uma lista salva!");
  }

  console.log(`Lista ${nameList} salva!`);
}
