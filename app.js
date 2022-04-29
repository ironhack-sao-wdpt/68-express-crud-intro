// Equivale a "import express from 'express'"
const express = require("express");

// Cria uma nova instância do Express que pode ser configurada para capturar requisições HTTP
const app = express();

// Configura a instância do Express para aceitar requisições do tipo JSON
app.use(express.json());

// Importar dados do arquivo data.js
const books = require("./data");

// Definição das routes listeners

// Simulando CRUD no Express

// Create (Crud): POST, criar um novo livro
app.post("/books", (req, res) => {
  // 1. Extrair as informações enviadas pelo cliente da requisição
  const data = req.body;

  const copy = [...books];

  // Ordena a array de livros de forma decrescente
  copy.sort((a, b) => b.id - a.id);

  // Como o primeiro livro vai ser o com o id mais recente, usamos ele para calcular o id do novo livro

  // Short-circuit evaluation
  const lastInsertedId = (copy[0] || {}).id || 0;
  // Optional chaining
  // const lastInsertedId = copy[0]?.id || 0

  const newBook = { ...data, id: lastInsertedId + 1 };

  // 2. Inserir estas informações na nossa array 'books'
  books.push(newBook);

  console.log(books);

  // 3. Enviar uma mensagem de resposta
  res.json(newBook);
});

// Read (cRud): GET, Acessar um livro existente
app.get("/books/:id", (req, res) => {
  // Extrai o valor dinâmico da URL
  const { id } = req.params;

  // Usa esse valor para encontrar um livro específico
  const found = books.find((book) => book.id === Number(id));

  if (!found) {
    // Retorna uma mensagem de erro com código 404
    return res.status(404).json({ message: "Livro não encontrado" });
  }

  return res.json(found);
});

// Update (crUd): PATCH, Atualizar um livro existente
app.patch("/books/:id", (req, res) => {
  // Extrai o valor dinâmico da URL
  const { id } = req.params;

  // Recebe os novos valores que vão atualizar o livro existente
  const data = req.body;

  // Descobrir o índice do livro a ser atualizado
  const index = books.findIndex((book) => {
    return book.id === Number(id);
  });

  if (index < 0) {
    // Retorna uma mensagem de erro com código 404
    return res.status(404).json({ message: "Livro não encontrado" });
  }

  // Atualizando o livro atual com as novas informações. O primeiro spread é necessário para evitar perda de informação
  books[index] = { ...books[index], ...data };

  console.log(books);

  return res.json(books[index]);
});

// Delete (cruD): DELETE, Apaga um livro existente
app.delete("/books/:id", (req, res) => {
  // Extrai o valor dinâmico da URL
  const { id } = req.params;

  // Descobrir o índice do livro a ser deletado
  const index = books.findIndex((book) => {
    return book.id === Number(id);
  });

  if (index < 0) {
    // Retorna uma mensagem de erro com código 404
    return res.status(404).json({ message: "Livro não encontrado" });
  }

  books.splice(index, 1);

  console.log(books);

  return res.json({});
});

// Colocar o servidor HTTP para escutar em uma porta específica
app.listen(4000, () => {
  console.log("Servidor subiu com sucesso!");
});
