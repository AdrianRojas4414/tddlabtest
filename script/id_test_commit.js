// saveId.js
const fs = require("fs");

function saveId(id) {
  fs.writeFileSync("id.json", JSON.stringify({ id }));
}

function getId() {
  if (!fs.existsSync("id.json")) return null;
  const data = fs.readFileSync("id.json", "utf8");
  return JSON.parse(data).id;
}

// Ejemplo:
saveId(123);
console.log(getId()); // 123 incluso después de cerrar el programa
