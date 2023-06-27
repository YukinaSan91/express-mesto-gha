/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND_ERROR } = require('./utils/constants');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use(usersRouter);
app.use(cardsRouter);

app.use('*', (req, res) => res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый ресурс не найден' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
