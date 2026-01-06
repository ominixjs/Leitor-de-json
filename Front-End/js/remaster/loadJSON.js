// Variaveis reutilizaveis
export let currentList = [];
export let nameList = "";

// acionadores de evento
const btnAdd = document.getElementById("btn_add");

export async function loadJSON(URL) {
  try {
    console.log("Iniciando");
    btnAdd.disabled = true;

    const response = await fetch(URL);

    if (response.ok == false || response.status != 200) {
      throw new Error("Finalizando processo " + response.status);
    }

    const list = await response.json();

    currentList.push(list);

    console.log("Carregamento finalizado com sucesso!");
  } catch (error) {
    throw new Error(error);
  } finally {
    btnAdd.disabled = false;
  }
}
