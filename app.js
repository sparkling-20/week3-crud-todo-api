require('dotenv').config();

const express = require('express');
const cors = require('cors');
const logRequest = require("./middlewares/logger.js");
const { validateTodo, validateTodoUpdate } = require("./middlewares/validator.js");
const errorhandler = require("./middlewares/errorhandler.js");
const connectDB = require("./database/db.js");
const Todo = require("./models/todo.model.js");
const app = express();

app.use(express.json());
app.use(cors('*'));
app.use(logRequest);
connectDB();

app.get('/', (req, res) => {
    res.send('Todo API Ready!');
    });


// GET All - Read
app.get('/todos', async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.completed === 'true') {
      filter.completed = true;
    } else if (req.query.completed === 'false') {
      filter.completed = false;
    } else if (req.query.completed !== undefined) {
      return res.status(400).json({
        error: 'Completed must be true or false'
      });
    }

    const todos = await Todo.find(filter);
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
});

// GET Completed Todos
app.get('/todos/completed', async (req, res, next) => {
  try {
    const completed = await Todo.find({ completed: true });
    res.status(200).json(completed);
  } catch (error) {
    next(error);
  }
});

// GET Single Todo - Read
app.get('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// POST New - Create
app.post('/todos', validateTodo, async (req, res, next) => {
  try {
    const { task, completed } = req.body;

    const newTodo = new Todo({
      task,
      completed
    });

    await newTodo.save();

    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

// PATCH Update - Partial
app.patch('/todos/:id', validateTodoUpdate, async (req, res, next) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
});

// DELETE Remove
app.delete('/todos/:id', async (req, res, next) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json({
      message: 'Todo deleted successfully',
      deletedTodo
    });
  } catch (error) {
    next(error);
  }
});
app.use(errorhandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
