import { currentListItens, URLInput } from "./index.js";

localStorage.setItem("listSaves", "oi");
// localStorage.removeItem("listSaves");
const lh = localStorage.getItem("listSaves") || [];
console.log(currentListItens);
