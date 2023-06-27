/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_BAD_REQUEST,
  NOT_FOUND_ERROR,
  ERROR_CODE,
  UNAUTHORIZED_ERROR,
} = require('../utils/constants');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(() => res.status(UNAUTHORIZED_ERROR).send({ message: 'Неправильные почта или пароль' }));
};

module.exports.getUsers = (req, res) => {
  User
    .find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User
    .findById(userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  const { _id } = req.user;

  User
    .findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    .then((user) => {
      res.send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send({ data: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.send({ data: user });
    })
    .catch(() => res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' }));
};
