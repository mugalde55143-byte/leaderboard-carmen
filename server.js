const http = require("http");
const fs = require("fs");
const path = require("path");
// La plataforma PaaS asigna el puerto en la variable PORT
const PORT = process.env.PORT || 3000;
// Puntuaciones guardadas en memoria (se pierden al reiniciar)
const scores = [];
const server = http.createServer((req, res) => {
// Página principal
if (req.method === "GET" && req.url === "/") {
const html = fs.readFileSync(path.join(__dirname, "index.html"));
res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
return res.end(html);
}
// Top 10 de puntuaciones
if (req.method === "GET" && req.url === "/api/scores") {
const top = [...scores].sort((a, b) => b.score - a.score).slice(0, 10);
res.writeHead(200, { "Content-Type": "application/json" });
return res.end(JSON.stringify(top));
}
// Registrar una puntuación nueva
if (req.method === "POST" && req.url === "/api/scores") {
let body = "";
req.on("data", (chunk) => (body += chunk));
req.on("end", () => {
try {



const { name, score } = JSON.parse(body);
if (typeof name !== "string" || name.trim() === "" ||
!Number.isInteger(score)) {
throw new Error();
}
const entry = { name: name.trim().slice(0, 20), score };
scores.push(entry);
res.writeHead(201, { "Content-Type": "application/json" });
res.end(JSON.stringify(entry));
} catch {
res.writeHead(400, { "Content-Type": "application/json" });
res.end(JSON.stringify({ error: "Envía name (texto) y score (entero)"

}));
}
});
return;
}
res.writeHead(404);
res.end("No encontrado");
});
server.listen(PORT, () => {
console.log(`Servidor escuchando en el puerto ${PORT}`);
});