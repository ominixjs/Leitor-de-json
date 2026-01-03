import { createElements } from "./index.js";

// Variaveis reutilizaveis
export let currentlist = [];
export let nameList = "";

// acionadores de evento
const btnAdd = document.getElementById("btn_add");

export async function loadJSON(url) {
  try {
    console.log("Iniciando");
    btnAdd.disabled = true;

    const response = await fetch(url);

    if (response.status != 200) {
      throw new Error("Finalizando processo " + response.status);
    }

    const list = await response.json();

    currentlist.push(list);

    console.log(currentlist);

    createElements(currentlist);

    console.log("Carregamento finalizado com sucesso!");
  } catch (error) {
    throw new Error(error);
  } finally {
    btnAdd.disabled = false;
  }
}
