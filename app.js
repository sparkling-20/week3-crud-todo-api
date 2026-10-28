require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors('*'));

app.get('/', (req, res) => {
    res.send('Todo API Ready!');
    });

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

// GET Active Todos – Bonus
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((t) => !t.completed);
  res.status(200).json(activeTodos);
    });

// GET Completed Todos
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.status(200).json(completed);
    });

// GET Single Todo – Read
app.get('/todos/:id', (req, res) => {
const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
  return res.status(400).json({ error: 'Invalid todo ID' });
  }
const todo = todos.find((t) => t.id === id);
if (!todo) {
return res.status(404).json({ error: 'Todo not found' });
}
res.status(200).json(todo);
});

// POST New – Create
app.post('/todos', (req, res) => {
const { task } = req.body;
if (typeof task !== 'string' || !task.trim()) {
return res.status(400).json({
error: 'The task field is required and cannot be empty.',
});
}
const newId =
todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
const newTodo = {
id: newId,
task: task.trim(),
completed: false,
 };

todos.push(newTodo);
res.status(201).json(newTodo);
 });

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
const id = Number(req.params.id);
if (!Number.isInteger(id) || id <= 0) {
return res.status(400).json({ error: 'Invalid todo ID' });
}
const todo = todos.find((t) => t.id === id);
if (!todo) {
return res.status(404).json({ error: 'Todo not found' });
}

const { task, completed } = req.body;
if (
task !== undefined && (typeof task !== 'string' || !task.trim())
) { return res.status(400).json({
error: 'Task must be a non-empty string',});}
if (completed !== undefined &&
  typeof completed !== 'boolean') {
return res.status(400).json({   error: 'Completed must be true or false',})
}
if (task !== undefined) todo.task = task.trim();
if (completed !== undefined) todo.completed = completed;
res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
  return res.status(400).json({ error: 'Invalid todo ID' });
    }
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
