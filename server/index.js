const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); 


mongoose.connect('mongodb://localhost:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => console.error(err));


const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);




app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});


app.post('/todos', async (req, res) => {
  const { task } = req.body;
  const newTodo = new Todo({
    task,
  });
  await newTodo.save();
  res.json(newTodo);
});


app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { task, isCompleted } = req.body;
  const updatedTodo = await Todo.findByIdAndUpdate(id, { task, isCompleted }, { new: true });
  res.json(updatedTodo);
});


app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: 'Todo deleted' });
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
