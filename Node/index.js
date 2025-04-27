const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let todos = []; // Lista em memória
let historico = []; //Lista de já finalizadas
let id = 1;

// Pegar todos os todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Criar um novo todo
app.post('/todos', (req, res) => {
  const { texto } = req.body;
  const hora = new Date().toLocaleString('pt-BR');
  console.log(hora);
  const novoTodo = { id: id++, texto, concluido: false, hora };
  todos.push(novoTodo);
  res.status(201).json(novoTodo);
});

// Marcar como concluído
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (todo) {
    todo.concluido = !todo.concluido;
    res.json(todo);
  } else {
    res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
});

// Deletar um todo
app.delete('/todos/:id', (req, res) => {
  const idDelete = parseInt(req.params.id);
  const todoRemove = todos.find(t => t.id === idDelete);
  if(todoRemove){
    historico.push({
      ...todoRemove,
      concluido: true,
      dataRemocao: new Date().toLocaleString('pt-BR'),  
    });
    console.log("Histórico atualizado:", historico);
    todos = todos.filter(t => t.id !== idDelete);
    return res.status(200).json({todos, historico});
  }
  return res.status(200).json({historico});
});

// Rodar servidor
app.listen(3001, () => {
  console.log('API rodando em http://localhost:3001');
});
