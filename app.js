const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Połączenie z bazą danych
var mongoDB = 'mongodb://127.0.0.1/people_db';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  title: String,
  author: String,
});

const User = mongoose.model('User', userSchema);

app.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

app.get('/users/new', (req, res) => {
  res.render('new-user');
});

app.post('/users', async (req, res) => {
  const { title, author } = req.body;
  const user = new User({ title, author });
  await user.save();
  res.redirect('/');
});

app.post('/users/:id/delete', async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    res.redirect('/');
});

// trasa GET dla wyświetlania formularza edycji
app.get('/users/:id/edit', async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      res.render('edit', { user: user })
    } catch (error) {
      console.error(error)
    }
  })
  
  // trasa POST dla przetwarzania formularza edycji
  app.post('/users/:id/edit', async (req, res) => {
    const id = req.params.id;
    const { title, author } = req.body;
    await User.findByIdAndUpdate(id, { title, author });
    res.redirect('/');
  });

app.listen(3000, () => {
  console.log('Aplikacja działa na http://localhost:3000');
});